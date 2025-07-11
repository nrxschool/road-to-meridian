---
marp: true
theme: gaia
---

# **Workshop: Road to Meridian**

## **Dia 3: WebAssembly com Rust**

---

## **1. Abertura**

**Hello World!**

Sejam todos bem-vindos ao último dia do **Workshop: Road to Meridian**!

Chegamos ao gran finale do nosso intensivão de 3 dias. Hoje, vamos criar um módulo **WebAssembly** com duas funções, integrá-lo à API CRUD do Dia 2, e criar um **CRUD-E** com uma rota para executar essas funções dinamicamente.

Na verdade o que você criou até agora sem você saber foi um protótipo da blockchain Stellar.

Preparados para fechar com chave de ouro?

---

## **2. Programação**

0. **História do WebAssembly?**: Qual problema resolve, o que é, por que as blockchain estão adotando.
1. **O que é WebAssembly?**: WASM, WASI, WAT, Wasmer e Wasmtime
2. **Funções em Rust**: `(u32, u32) -> u32` para soma e subtração
3. **Compilando para WebAssembly**: Usando cargo
4. **Transformando .wasm em Array u8**: Convertendo para integração
5. **Integrando com o CRUD**: Adicionando a rota Execute (CRUDE)
6. **Validando o Resultado**: Testando e verificando a execução
7. **Hands-on**: Codificação prática

---

## 3. História do WebAssembly

📌 _WASM: Performance, Segurança e Portabilidade._

**O que é?**

- WebAssembly é uma plataforma de execução (runtime environment) projetada para ser agnóstica ao host e segura por padrão.
- Não é assembly, nem apenas “para Web”.
- É um padrão de formato binário e máquina virtual abstrata que pode ser implementada em qualquer sistema (navegador, edge, blockchain).

---

**Como surgiu?**

- Criada por **Graydon Hoar** enquanto trabalhava na Mozilla em **2015**.
- Era a evolução natural do asm.js — um subset otimizado de JavaScript.
- Em **2017**, tornou-se um **padrão oficial do W3C**.
- Nasceu com foco em **rodar código de alto desempenho no navegador** (ex.: C/C++, Rust), mas se expandiu para **servidores, blockchain e edge computing**.

---

**Quais aplicações?**

- 🎮 **Games**: Portar engines C++ (ex.: Unity, Unreal) direto para o browser.
- 📦 **Apps Web pesadas**: Ferramentas como Figma e Photoshop online usam WASM para performance.
- 🧠 **IA e Machine Learning**: Rodar modelos localmente no browser.
- 🔐 **Blockchain**: Execução segura de smart contracts (ex.: Polkadot, CosmWasm, Near).
- 🌐 **Edge Computing**: Runtimes como Wasmer e Fastly executam código WASM perto do usuário.
- 🔧 **Plug-ins seguros**: Permite isolar código de terceiros com segurança e controle total.

---

**Por que Blockchains Adotam WASM?**

- **Performance Superior**: Contratos inteligentes em WASM são 10-100x mais rápidos que em EVM (Ethereum Virtual Machine), crucial para escalabilidade.
- **Linguagens Múltiplas**: Permite escrever contratos inteligentes em diversas linguagens (Rust, C++, Go), não apenas em uma linguagem específica (como Solidity para EVM).
- **Determinismo**: Garante que o mesmo código produzirá o mesmo resultado em qualquer ambiente, essencial para a validação de transações em blockchain.
- **Segurança Aprimorada**: O ambiente sandboxed do WASM reduz a superfície de ataque e minimiza vulnerabilidades.
- **Interoperabilidade**: Facilita a comunicação entre diferentes blockchains e a criação de aplicações descentralizadas mais complexas.

---

## **4. O que é WebAssembly?**

📌 _WASM, WASI, WAT, Wasmer e Wasmtime: Entendendo o Ecossistema._

- **WAT (WebAssembly Text Format)**:
  - Representação textual do WASM, legível por humanos.
  - Usado para debugging ou escrever WASM manualmente.

---

### Exemplo em WAT

```js
(module
  (func $add (param $a i32) (param $b i32) (result i32)
    local.get $a
    local.get $b
    i32.add
    i32.const 1
    i32.add) ;; Note: This example adds 1 to the sum
  (export "add" (func $add)))
```

---

### WASM (WebAssembly)

- É uma máquina virtual portátil e/ou um formato binário (.wasm)
- É o artefato gerado pelo compilador Rust, C++, Go, AssemblyScript.
- A máquina virtual é agnóstica ao host: não sabe nada sobre sistema de arquivos, rede ou relógio por padrão.

---

### WASI (WebAssembly System Interface)

- É uma especificação de API de sistema para WebAssembly, semelhante ao POSIX.
- Permite que módulos WASM acessem funcionalidades como: (Arquivos, Rede, Variáveis de ambiente, Tempo, argumentos, etc.)
- Garante que o acesso ao sistema seja feito de forma segura, determinística e multiplataforma.

---

### Runtimes WASM

**Wasmi**

- Descrição: Interpretador WASM puro em Rust. É embarcável, leve e escrito 100% em Rust.
- Integração: Perfeito para embutir a execução de WASM dentro de aplicações Rust (sem dependências externas).
- Uso ideal: Smart contracts, runtimes de blockchain, APIs que precisam isolar plugins de terceiros com segurança.

**Wasmtime**

- Descrição: Runtime WASM focado em performance e compliance com o padrão WASI, mantido pela Bytecode Alliance.
- Integração: Exponibiliza bindings para várias linguagens e uma CLI poderosa (wasmtime run ...).
- Uso ideal: Testes, linha de comando, ambientes que executam WASM isoladamente com acesso a sistema de arquivos, rede, etc.

**Wasmer**

- Descrição: Runtime WASM com foco em portabilidade e virtualização. Suporta múltiplos backends (LLVM, Cranelift, Singlepass).
- Diferencial: Pode empacotar aplicações como “universal binaries” com WASM e rodar em qualquer lugar.
- Uso ideal: Distribuição de binários multiplataforma, servidores edge, plugins universais.

---

### Nosso Foco Hoje

1. Refatorar nossa biblioteca para um módulo WebAssembly.
2. Refatorar nosso crud para suportar e executar módulos Wasm.
3. Enviar o bytecode Wasm para nosso servidor.
4. Usaremos `wasmi` para executá-las no servidor.
5. Entenderemos WASM, WASI, WAT, Wasmi e Wasmtime na prática.

---

## **5. Funções em Rust**

🛠️ _Criando funções `(u32, u32) -> u32` para soma e subtração._

### Criando o Projeto `wasm-math`

```bash
cargo new --lib wasm-math
cd wasm-math
```

---

### Configurando o `Cargo.toml`

```toml
[package]
name = "math"
version = "0.1.0"
edition = "2021"


[lib]
crate-type = ["cdylib"]

[profile.release]
lto = true
codegen-units = 1
opt-level = "z"

[dependencies]
```

- _Esses parâmetros tornam o binário final menor, mais rápido e compatível com ambientes WebAssembly._

---

### Código das Funções (`src/lib.rs`)

```rust
#[no_mangle]
pub extern "C" fn add(x: i32, y: i32) -> i32 {
    x + y
}

#[no_mangle]
pub extern "C" fn mul(x: i32, y: i32) -> i32 {
    x * y
}

#[no_mangle]
pub extern "C" fn sub(x: i32, y: i32) -> i32 {
    if x < y {
        return 0;
    }
    x - y
}

#[no_mangle]
pub extern "C" fn div(x: i32, y: i32) -> i32 {
    if y == 0 {
        return 0;
    }
    x / y
}
```

---

### Explicação das Funções

- `extern "C"`: Define a convenção de chamada C ABI (Application Binary Interface), que é uma forma padronizada de como funções são chamadas na memória. Isso garante compatibilidade com outros ambientes que esperam código C-like, como o WebAssembly.
- `#[no_mangle]`: Impede que o compilador renomeie a função (name mangling), garantindo que ela mantenha o nome original no binário final. Isso é essencial para que o runtime WASM consiga localizar e chamar a função corretamente.

---

## **6. Compilando para WebAssembly**

⚡ _Gerando o arquivo `.wasm` com cargo._

### Instalando o Target WASM

```bash
rustup target add wasm32-unknown-unknown
```

---

### Compilando o Projeto

```bash
cargo build --target wasm32-unknown-unknown --release
```

---

### Saída da Compilação

- Gera o arquivo `target/wasm32-unknown-unknown/release/math.wasm`.
- Este arquivo binário contém as funções e está pronto para ser executado em um runtime WASM.

---

### Converter Wasm para bytes

- Esse comando transforma um arquivo `.wasm` em uma lista de número (bytes) separados por vírgula, formatando tudo em uma única linha e salvando no arquivo `BYTES_RESULT.txt`.

```bash
od -An -v -t uC *.wasm \
| tr -s ' ' \
| tr ' ' ',' \
| tr -d '\n' \
| sed 's/^,//;s/,$//g' > BYTES_RESULT.txt
```

---

## **8. Integrando com o CRUD**

📌 _Adicionando a rota Execute ao CRUD-E, reutilizando a API do Dia 2._

### Configurando Dependências

```toml
[dependencies]
tide = "0.16.0"
async-std = { version = "1.12.0", features = ["attributes"] }
serde = { version = "1.0", features = ["derive"] }
serde_json = "1.0"
wasmi = "0.47.0"
```

---

### Modelo de Dados Atualizado (`src/models.rs`)

- Usaremos a API Tide do Dia 2, que armazena dados em um `HashMap<u32, DataEntry>`.
- Vamos renomear o modelo `DataEntry` para:

```rust
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct DataEntry {
    pub func_names: Vec<String>,
    pub bytecode: Vec<u8>,
}
```

---

### Nova Rota Execute (`src/handlers/execute.rs`)

### `execute.rs`: Imports e Struct

```rust
use tide::{Request, Response, StatusCode};
use crate::state::AppState;
use serde::Deserialize;
use serde_json::json;
use wasmi::{Engine, Module, Store, Instance, TypedFunc};

#[derive(Deserialize)]
struct ExecRequest {
    #[serde(rename = "fn")]
    func: String,
    arg: [i32; 2],
}
```

- Importações necessárias para manipular requisições, JSON e executar módulos WebAssembly via `wasmi`.
- A struct `ExecRequest` define o formato esperado no corpo da requisição: uma função (`fn`) e dois argumentos.

---

### `execute_fn`: Início e Validação do Body

```rust
pub async fn execute_fn(mut req: Request<AppState>) -> tide::Result {
    let exec_req: ExecRequest = req.body_json().await.map_err(|_| {
        tide::Error::from_str(400, "Invalid JSON: esperado { fn: string, arg: [i32; 2] }")
    })?;

    // ...
```

- A função é assíncrona e recebe uma requisição com estado compartilhado (`AppState`).
- Lê e valida o JSON do corpo, retornando erro 400 se inválido.

---

### Extração do ID e Busca no HashMap

```rust
    // ...

    let id: u32 = match req.param("id") {
        Ok(s) => s
            .parse()
            .map_err(|_| tide::Error::from_str(400, "Invalid id"))?,
        Err(_) => return Err(tide::Error::from_str(400, "Missing id")),
    };
    let map = req.state().lock().unwrap();
    let entry = match map.get(&id) {
        Some(e) => e,
        None => return Err(tide::Error::from_str(404, "Not found")),
    };
    let wasm_bytes = &entry.bytecode;

    // ...
```

- Extrai o `id` da URL (`/execute/:id`).
- Busca o módulo WASM correspondente no estado global protegido com `Mutex`.
- Retorna 404 se não houver módulo WASM

---

### Carregando e Instanciando o Módulo WASM

```rust
    // ...

    let engine = Engine::default();
    let module = Module::new(&engine, wasm_bytes)
        .map_err(|e| tide::Error::from_str(StatusCode::BadRequest, format!("Invalid wasm: {e}")))?;
    let mut store = Store::new(&engine, ());
    let instance = Instance::new(&mut store, &module, &[]).map_err(|e| {
        tide::Error::from_str(
            StatusCode::InternalServerError,
            format!("Wasm instantiation error: {e}"),
        )
    })?;

    // ...
```

- Usa `wasmi` para criar e instanciar um módulo WebAssembly em tempo de execução.
- Trata erros se o módulo for inválido ou não puder ser instanciado.

---

### Resolvendo a Função e Executando

```rust
    // ...

    let func = instance
        .get_func(&mut store, &exec_req.func)
        .ok_or_else(|| {
            tide::Error::from_str(
                StatusCode::BadRequest,
                format!("Function not found: {}", exec_req.func),
            )
        })?;

    let typed: TypedFunc<(i32, i32), i32> = func.typed(&store).map_err(|e| {
        tide::Error::from_str(StatusCode::BadRequest, format!("Signature error: {e}"))
    })?;

    let result = typed
        .call(&mut store, (exec_req.arg[0], exec_req.arg[1]))
        .map_err(|e| {
            tide::Error::from_str(StatusCode::InternalServerError, format!("Call error: {e}"))
        })?;

    // ...
```

- Busca a função exportada no módulo e verifica se a assinatura é válida.
- Cria a assinatura da função usando a tipagem (u32, u32) -> u32.
- Chama a função com os dois argumentos fornecidos.

---

### Respondendo com o Resultado

```rust
    // ...

    Ok(Response::builder(StatusCode::Ok)
        .body(serde_json::to_string(&json!({ "result": result }))?)
        .content_type(tide::http::mime::JSON)
        .build())
}
```

- Cria a resposta HTTP com o resultado da execução.
- Define o tipo de conteúdo como JSON e retorna com status 200.

---

## **9. Validando o Resultado**

⚡ _Testando e verificando a execução da API CRUDE com WASM._

Como já compilamos e convertemos nossa biblioteca `.wasm`, agora vamos enviar para salvar no Servidor

### Passo 1: Salvar o `.wasm` no Servidor

- Use o script para converter `math.wasm` em `bytes`.
- A lista de bytes está em `BYTES_RESULT.txt`.
- Copie e cole essa lista de bytes no comando abaixo.

```bash
curl -s -X POST http://127.0.0.1:8080/data \
  -H 'Content-Type: application/json' \
  -d '{"func_names": ["sum", "add", "mul", "div"], "bytecode": [BYTE_CODE]}'
```

---

### Passo 2: Testar a Rota Execute

```bash
export ID=1
curl -s -X POST http://127.0.0.1:8080/execute/$ID \
  -H "Content-Type: application/json" \
  -d '{"fn": "add", "arg": [1, 2]}'
```

```bash
export ID=1
curl -s -X POST http://127.0.0.1:8080/execute/$ID \
  -H "Content-Type: application/json" \
  -d '{"fn": "mul", "arg": [1, 2]}'
```

---

## **11. Recapitulação**

1. **WASM**: Formato binário compacto e performático; **WASI**: Interface para acesso a recursos do sistema; **WAT**: Formato textual legível.
2. **Runtimes**: Wasmer e Wasmtime são runtimes WASM; usamos `wasmi` para a execução embarcada na API.
3. **Funções Rust para WASM**: Criamos e compilamos funções `add` e `sub` em Rust para um módulo WASM.
4. **`DataEntry` Aprimorado**: Incluímos `function_name: Vec<String>` para gerenciar as funções disponíveis no módulo WASM.
5. **CRUDE**: Estendemos a API CRUD com uma rota `/execute` dinâmica, permitindo a execução de funções WASM sob demanda.
6. **Validação**: Realizamos testes manuais para garantir o funcionamento correto e o tratamento de erros da integração WASM na API.

---

## **12. Lição de Casa**

### Desafio de Aprendizagem

- Implemente um storage para que as funcoes tenham estado

DICAS:

- adicione um novo elemento ao `DataEntry` como um storage: `HashMap<String, Vec<u8>>`
- implemente tbm chama syscall de getter e setter para esse storage
- ...

### Desafio de Carreira

- Post no LinkedIn e Twitter com #road2meridian (3/3)
- Marque a Stellar
- Marque a NearX

**Recursos:**

- [Documentação Rust](https://www.rust-lang.org/learn)
- [Documentação WebAssembly](https://webassembly.org)
- [WASI](https://wasi.dev)
- [Wasmer](https://wasmer.io)
- [Wasmtime](https://wasmtime.dev)
- [wasmi](https://github.com/paritytech/wasmi)

---

## **13. Encerramento do Workshop**

**Parabéns, coders!** Vocês completaram o **Workshop: Rust**! 🏆

Dominamos bibliotecas, CRUD, e WebAssembly em apenas 3 dias. Continuem codificando, explorando Rust, WASM, WASI, e runtimes como Wasmer e Wasmtime.

_"Obrigado por participarem! Nos vemos nos próximos desafios!"_
