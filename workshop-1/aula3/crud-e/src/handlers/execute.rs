use crate::state::AppState;
use serde::Deserialize;
use serde_json::json;
use std::io::Cursor;
use tide::{Request, Response, StatusCode};
use wasmi::{Engine, Extern, Linker, Module, Store, TypedFunc};

#[derive(Deserialize)]
struct ExecRequest {
    #[serde(rename = "fn")]
    func: String,
    arg: [i32; 2],
}

pub async fn execute_fn(mut req: Request<AppState>) -> tide::Result {
    // Lê e valida o JSON do body
    let exec_req: ExecRequest = req.body_json().await.map_err(|_| {
        tide::Error::from_str(400, "Invalid JSON: esperado { fn: string, arg: [i32; 2] }")
    })?;

    // Busca o registro no estado global
    let id: u32 = match req.param("id") {
        Ok(s) => s
            .parse()
            .map_err(|_| tide::Error::from_str(400, "Invalid id"))?,
        Err(_) => return Err(tide::Error::from_str(400, "Missing id")),
    };
    let state = req.state();
    let map = state.lock().unwrap();

    // Verifica se o id existe no map
    let entry = match map.get(&id) {
        Some(e) => e,
        None => return Ok(Response::new(StatusCode::NotFound)),
    };

    // Verifica se o nome da função requisitada existe no data1
    if entry.data1.contains(&exec_req.func) == false {
        return Ok(tide::Response::new(404));
    }

    // Verifica se o campo data2 (wasm) existe e não está vazio
    if entry.data2.is_empty() {
        return Err(tide::Error::from_str(
            StatusCode::BadRequest,
            "Wasm code (data2) is empty",
        ));
    }
    let wasm_bytes = &entry.data2;

    // Carrega e instancia o wasm
    let engine = Engine::default();
    let module = Module::new(&engine, Cursor::new(wasm_bytes))
        .map_err(|e| tide::Error::from_str(StatusCode::BadRequest, format!("Invalid wasm: {e}")))?;
    let mut store = Store::new(&engine, ());
    let linker = Linker::new(&engine);
    let instance_pre = linker.instantiate(&mut store, &module).map_err(|e| {
        tide::Error::from_str(
            StatusCode::InternalServerError,
            format!("Wasm instantiation error: {e}"),
        )
    })?;
    let instance = instance_pre.ensure_no_start(&mut store).map_err(|e| {
        tide::Error::from_str(
            StatusCode::InternalServerError,
            format!("Wasm start error: {e}"),
        )
    })?;

    // Busca a função exportada
    let export = instance
        .get_export(&mut store, &exec_req.func)
        .and_then(Extern::into_func)
        .ok_or_else(|| {
            tide::Error::from_str(
                StatusCode::BadRequest,
                format!("Function not found: {}", exec_req.func),
            )
        })?;
    let typed: TypedFunc<(i32, i32), i32> = export.typed(&store).map_err(|e| {
        tide::Error::from_str(StatusCode::BadRequest, format!("Signature error: {e}"))
    })?;

    // Executa a função
    let result = typed
        .call(&mut store, (exec_req.arg[0], exec_req.arg[1]))
        .map_err(|e| {
            tide::Error::from_str(StatusCode::InternalServerError, format!("Call error: {e}"))
        })?;

    let mut resp = Response::new(StatusCode::Ok);
    resp.set_body(serde_json::to_string(&json!({"result": result}))?);
    resp.set_content_type(tide::http::mime::JSON);
    Ok(resp)
}
