
marp: truetheme: gaia

# Flashbootcamp: Rust – Dia 3: WebAssembly com Rust

data: 06/05
prof: Lucas Oliveira

1. Abertura
Hello World!
Sejam todos bem-vindos ao último dia do Flashbootcamp: Rust!
Chegamos ao gran finale do nosso intensivão de 3 dias. Hoje, vamos criar um módulo WebAssembly com duas funções, integrá-lo à API CRUD do Dia 2, and criar um CRUDE com uma rota para executar essas funções dinamicamente.
Preparados para fechar com chave de ouro? Vamos ao GRANDE CÓDIGO!

2. Programação

O que é WebAssembly?: WASM, WASI, WAT, Wasmer e Wasmtime
Funções em Rust: (u32, u32) -> u32 para soma e subtração
Compilando para WebAssembly: Usando cargo
Transformando .wasm em Array u8: Convertendo para integração
Integrando com o CRUD: Adicionando a rota Execute (CRUDE)
Validando o Resultado: Testando e verificando a execução
Hands-on: Codificação prática


3. O que é WebAssembly?
📌 WebAssembly (WASM): Código portátil e performático.

WASM (WebAssembly):

Formato binário para executar código de alto desempenho em navegadores ou servidores.
Compilado a partir de linguagens como Rust, C++, ou Go.
Características: Portátil, seguro (sandboxed), e rápido.
Usos: Aplicações web, blockchain (ex.: Solana, Polkadot), jogos.


WASI (WebAssembly System Interface):

Extensão do WASM para rodar fora de navegadores (ex.: servidores, IoT).
Fornece acesso a recursos do sistema (arquivos, rede) de forma segura.


WAT (WebAssembly Text Format):

Representação textual do WASM, legível por humanos.
Usado para debugging ou escrever WASM manualmente.
Exemplo de funções add e sub em WAT:



(module
  (func $add (param $a i32) (param $b i32) (result i32)
    local.get $a
    local.get $b
    i32.add
    i32.const 1
    i32.add)
  (func $sub (param $a i32) (param $b i32) (result i32)
    local.get $a
    local.get $b
    i32.sub)
  (export "add" (func $add))
  (export "sub" (func $sub)))


Wasmer:

Runtime WASM leve para executar módulos WASM em servidores ou desktops.
Ideal para: Aplicações standalone.


Wasmtime:

Runtime WASM focado em performance, mantido pela Bytecode Alliance.
Ideal para: Projetos complexos ou blockchain.


Hoje: Compilaremos um módulo Rust com duas funções para WASM usando cargo, usaremos wasmi para executá-las na API, and entenderemos WASM, WASI, WAT, Wasmer e Wasmtime.



4. Funções em Rust
🛠️ Criando funções (u32, u32) -> u32 para soma e subtração.
Criando o Projeto
cargo new --lib wasm-math
cd wasm-math

Configurando o Cargo.toml
# Cargo.toml
[package]
name = "wasm-math"
version = "0.1.0"
edition = "2021"

[lib]
crate-type = ["cdylib"]

[dependencies]
wasm-bindgen = "0.2"

Código das Funções
// src/lib.rs
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
#[no_mangle]
pub fn add(a: u32, b: u32) -> u32 {
    a + b + 1
}

#[wasm_bindgen]
#[no_mangle]
pub fn sub(a: u32, b: u32) -> u32 {
    a - b
}


Explicação:
add: Soma a + b + 1 (ex.: 5 + 3 + 1 = 9).
sub: Subtrai a - b (ex.: 5 - 3 = 2).
#[wasm_bindgen] e #[no_mangle]: Exportam as funções para WASM com nomes preservados.




5. Compilando para WebAssembly
⚡ Gerando o arquivo .wasm com cargo.
Instalando o Target WASM
rustup target add wasm32-unknown-unknown

Compilando
cargo build --target wasm32-unknown-unknown --release


Saída:

Gera o arquivo target/wasm32-unknown-unknown/release/wasm_math.wasm.
Contém as funções add e sub.


Explicação:

Usamos cargo build com o target wasm32-unknown-unknown para compilar para WASM.
A flag --release otimiza o binário.




6. Transformando .wasm em Array u8
🛠️ Convertendo o .wasm para Vec<u8>.
Código para Conversão
// src/main.rs (no projeto wasm-math)
use std::fs;

fn main() {
    let wasm_bytes = fs::read("target/wasm32-unknown-unknown/release/wasm_math.wasm")
        .expect("Erro ao ler o arquivo WASM");
    println!("WASM como array u8: {:?}", wasm_bytes);
}


Explicação:
Usamos std::fs::read para ler o arquivo .wasm como bytes.
O resultado é um Vec<u8>, pronto para ser enviado à API CRUD.
Rode com cargo run para verificar.




7. Integrando com o CRUD
📌 Adicionando a rota Execute ao CRUDE.
Reutilizando a API do Dia 2
Usaremos a API Tide do Dia 2, que armazena dados em um HashMap<u32, DataEntry>. O modelo DataEntry foi atualizado para incluir function_name: Vec<String> com a lista de funções do módulo WASM (ex.: ["add", "sub"]). Mostraremos apenas a rota POST /execute/:id.
Configurando Dependências
# Adicionar ao Cargo.toml do projeto rust-crud
[dependencies]
tide = "0.16.0"
async-std = { version = "1.12.0", features = ["attributes"] }
serde = { version = "1.0", features = ["derive"] }
serde_json = "1.0"
wasmi = "0.31.0"

Modelo de Dados Atualizado
// src/main.rs (projeto rust-crud)
use serde::{Deserialize, Serialize};

type MyData = Vec<u8>;
#[derive(Serialize, Deserialize, Clone)]
struct DataEntry {
    id: u32,
    data: MyData,
    function_name: Vec<String>, // Lista de funções no WASM: ["add", "sub"]
}

Nova Rota Execute
// src/main.rs (adicionar ao projeto rust-crud)
use tide::Request;
use serde::{Deserialize, Serialize};
use std::sync::{Arc, Mutex};
use std::collections::HashMap;
use wasmi::{Engine, Module, Store, Func};

// Modelos e estado (já definidos no Dia 2)
#[derive(Serialize, Deserialize)]
struct ExecuteRequest {
    a: u32,
    b: u32,
    function_name: String, // Nome da função a executar: "add" ou "sub"
}

type State = Arc<Mutex<HashMap<u32, DataEntry>>>;

// Rota Execute
async fn execute_wasm(mut req: Request<State>) -> tide::Result {
    let id: u32 = req.param("id")?.parse()?;
    let input: ExecuteRequest = req.body_json().await?;
    
    let state = req.state().lock().unwrap();
    let entry = match state.get(&id) {
        Some(entry) => entry,
        None => return Ok(tide::StatusCode::NotFound.into()),
    };

    // Verificar se a função solicitada existe no módulo
    if !entry.function_name.contains(&input.function_name) {
        return Ok(tide::StatusCode::BadRequest.into());
    }

    // Configurar o interpretador WASM com wasmi
    let engine = Engine::default();
    let module = Module::new(&engine, &entry.data[..]).map_err(|_| tide::StatusCode::BadRequest)?;
    let mut store = Store::new(&engine, ());
    let instance = wasmi::Linker::new(&engine)
        .instantiate(&mut store, &module)
        .map_err(|_| tide::StatusCode::InternalServerError)?
        .start(&mut store)
        .map_err(|_| tide::StatusCode::InternalServerError)?;

    // Chamar a função especificada
    let func = instance
        .get_export(&store, &input.function_name)
        .and_then(|e| e.into_func())
        .ok_or(tide::StatusCode::BadRequest)?;
    let func = func.typed::<(u32, u32), u32>(&store).unwrap();

    let result = func.call(&mut store, (input.a, input.b)).map_err(|_| tide::StatusCode::InternalServerError)?;
    Ok(tide::Body::from_json(&serde_json::json!({ "result": result }))?.into())
}


Explicação:
A rota POST /execute/:id recebe { a: u32, b: u32, function_name: String } e o id do módulo WASM.
Verifica se function_name está na lista entry.function_name (ex.: ["add", "sub"]).
Usa wasmi para executar a função especificada (add ou sub).
Exemplo: Para add com a=5, b=3, retorna 9 (5 + 3 + 1); para sub, retorna 2 (5 - 3).




8. Validando o Resultado
⚡ Testando e verificando a execução.
Passo a Passo

Salvar o .wasm no HashMap:
Use o código do item 6 para converter wasm_math.wasm em Vec<u8>.
Envie para a API com (substitua [/* array u8 */] pelo array real gerado):



curl -X POST http://127.0.0.1:8080/data -H "Content-Type: application/json" -d '{"id": 1, "data": [/* array u8 do wasm_math.wasm */], "function_name": ["add", "sub"]}'


Testar a Rota Execute:

# Testar add
curl -X POST http://127.0.0.1:8080/execute/1 -H "Content-Type: application/json" -d '{"a": 5, "b": 3, "function_name": "add"}'
# Resposta esperada: {"result": 9}

# Testar sub
curl -X POST http://127.0.0.1:8080/execute/1 -H "Content-Type: application/json" -d '{"a": 5, "b": 3, "function_name": "sub"}'
# Resposta esperada: {"result": 2}


Validação:
Verifique se os resultados estão corretos: add(5, 3) = 9 (5 + 3 + 1), sub(5, 3) = 2.
Teste casos de erro:
ID inválido: curl -X POST http://127.0.0.1:8080/execute/999 (retorna 404).
Função inválida: curl -X POST http://127.0.0.1:8080/execute/1 -d '{"a": 5, "b": 3, "function_name": "invalid"}' (retorna 400).
Entrada inválida: curl -X POST http://127.0.0.1:8080/execute/1 -d '{"a": "invalid", "b": 3}' (retorna 400).






Explicação:
Usamos curl para testar a rota /execute.
Validamos que as funções WASM retornam os resultados esperados e que erros são tratados corretamente.




9. Hands-on
// PROGRAMMING, MOTHERF****


10. Recapitulação

WASM = formato binário; WASI = interface para sistemas; WAT = formato textual.
Wasmer e Wasmtime = runtimes alternativos; usamos wasmi por simplicidade.
Funções add e sub = compiladas com cargo em um único módulo WASM.
DataEntry = inclui function_name: Vec<String> para listar funções.
CRUDE = CRUD + Execute com a rota /execute dinâmica.
Validação = testes manuais garantem funcionamento.


11. Lição de Casa
Desafio de Aprendizagem

Adicione uma função WASM mul (retorna a * b + 1) ao módulo wasm-math.
Atualize a API para incluir mul na lista function_name e teste com /execute.
(Bônus) Experimente executar o .wasm com Wasmer ou Wasmtime.

Desafio de Carreira

Post no LinkedIn com #FlashbootcampRust (3/3)

Desafio de Comunidade

🚀 Poste o que você mais gostou de aprender no Flashbootcamp! (discord)

Recursos:

Documentação Rust
Documentação WebAssembly
WASI
Wasmer
Wasmtime
wasmi


12. Encerramento do Flashbootcamp
Parabéns, coders! Vocês completaram o Flashbootcamp: Rust! 🏆
Dominamos bibliotecas, CRUD, e WebAssembly em apenas 3 dias. Continuem codificando, explorando Rust, WASM, WASI, e runtimes como Wasmer e Wasmtime. O GRANDE CÓDIGO agora está com vocês!
"Obrigado por participarem! Nos vemos nos próximos desafios!"
