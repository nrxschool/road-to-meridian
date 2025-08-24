# Roteiro Final: Workshop: Road to Meridian – Dia 3: WebAssembly com Rust

## Introdução: O Gran Finale do Nosso Workshop! 🚀

Olá pessoal!

**Hello World pela última vez neste workshop!**

Sejam todos muito bem-vindos ao último dia do **Workshop: Road to Meridian**!

Chegamos ao gran finale do nosso intensivão de 3 dias. Que jornada incrível fizemos juntos, não foi? No primeiro dia, mergulhamos nos fundamentos do Rust e criamos nossa primeira biblioteca. No segundo dia, construímos uma API CRUD completa e robusta.

E hoje? Hoje vamos fechar com chave de ouro! Vamos criar um módulo **WebAssembly** com funções matemáticas, integrá-lo à nossa API CRUD do Dia 2, e transformar nosso sistema em um **CRUD-E** — onde o "E" significa "Execute" — com uma rota especial para executar essas funções dinamicamente.

E aqui vai um spoiler interessante: o que vocês criaram até agora, sem nem perceber, foi um protótipo funcional de como funciona a blockchain Stellar! Isso mesmo — vocês estão construindo os fundamentos de uma blockchain!

Preparados para descobrir o poder do WebAssembly e fechar este workshop de forma espetacular? Vamos nessa!

## Capítulo 1: A História Revolucionária do WebAssembly

Antes de colocarmos a mão na massa, precisamos entender o que é WebAssembly e por que ele está revolucionando não apenas o desenvolvimento web, mas também o mundo das blockchains.

### O Que É WebAssembly?

WebAssembly, ou WASM como é carinhosamente conhecido, é muito mais do que o nome sugere. Não é apenas "assembly para a web" — é uma plataforma de execução completa projetada para ser agnóstica ao host e segura por padrão.

Pense no WebAssembly como uma máquina virtual universal que pode rodar em qualquer lugar: navegadores, servidores, dispositivos edge, e até mesmo blockchains. É um formato binário padronizado que permite executar código de alto desempenho de forma segura e portável.

### Como Surgiu Esta Revolução?

A história do WebAssembly é fascinante e tem uma conexão direta com o Rust! Foi criado por **Graydon Hoare** — o mesmo criador do Rust — enquanto trabalhava na Mozilla em **2015**.

O WebAssembly nasceu como a evolução natural do asm.js, que era um subset otimizado de JavaScript. A ideia era simples, mas revolucionária: permitir que linguagens como C++, Rust e outras rodassem no navegador com performance próxima ao código nativo.

Em **2017**, o WebAssembly se tornou um **padrão oficial do W3C**, consolidando sua importância no ecossistema de desenvolvimento.

### Aplicações Que Mudaram o Jogo

O WebAssembly rapidamente se expandiu além do navegador e hoje está presente em:

**🎮 Games**: Engines como Unity e Unreal Engine podem ser portadas diretamente para o browser, permitindo jogos AAA rodando nativamente na web.

**📦 Aplicações Web Pesadas**: Ferramentas como Figma, Photoshop online e editores de vídeo usam WASM para entregar performance desktop no navegador.

**🧠 Inteligência Artificial**: Modelos de machine learning podem rodar localmente no browser, garantindo privacidade e reduzindo latência.

**🔐 Blockchain**: Aqui está o ponto mais interessante para nós! Blockchains como Polkadot, CosmWasm e Near Protocol usam WASM para smart contracts.

**🌐 Edge Computing**: Runtimes como Wasmer e Fastly executam código WASM próximo aos usuários, reduzindo latência.

**🔧 Plug-ins Seguros**: Permite isolar código de terceiros com segurança total e controle granular.

### Por Que as Blockchains Estão Adotando WASM?

Esta é a parte mais empolgante! As blockchains estão migrando massivamente para WebAssembly por razões muito convincentes:

**Performance Superior**: Smart contracts em WASM são 10 a 100 vezes mais rápidos que na EVM (Ethereum Virtual Machine). Isso é crucial para escalabilidade.

**Linguagens Múltiplas**: Diferente do Ethereum que força você a usar Solidity, blockchains WASM permitem escrever smart contracts em Rust, C++, Go, AssemblyScript e outras linguagens.

**Determinismo Garantido**: O mesmo código WASM produzirá exatamente o mesmo resultado em qualquer ambiente, o que é essencial para validação de transações em blockchain.

**Segurança Aprimorada**: O ambiente sandboxed do WASM reduz drasticamente a superfície de ataque e minimiza vulnerabilidades.

**Interoperabilidade**: Facilita a comunicação entre diferentes blockchains e a criação de aplicações descentralizadas mais complexas.

## Capítulo 2: Entendendo o Ecossistema WebAssembly

Para trabalhar efetivamente com WebAssembly, precisamos entender seus componentes principais. É como aprender um novo idioma — precisamos conhecer o vocabulário básico!

### WAT (WebAssembly Text Format)

O WAT é a representação textual do WASM, legível por humanos. É como o "código fonte" do WebAssembly, usado principalmente para debugging ou para escrever WASM manualmente em casos muito específicos.

**MOSTRAR TERMINAL: Exemplo de WAT**

```wat
(module
  (func $add (param $a i32) (param $b i32) (result i32)
    local.get $a
    local.get $b
    i32.add
    i32.const 1
    i32.add)
  (export "add" (func $add)))
```

Este exemplo define um módulo com uma função que soma dois números inteiros e adiciona 1 ao resultado.

### WASM (WebAssembly Binary Format)

O WASM é o formato binário propriamente dito — o arquivo `.wasm` que é gerado quando compilamos código Rust, C++ ou outras linguagens. É este arquivo que contém o bytecode otimizado que será executado pela máquina virtual.

A máquina virtual WASM é agnóstica ao host, o que significa que ela não sabe nada sobre sistema de arquivos, rede ou relógio por padrão. Isso garante segurança e portabilidade.

### WASI (WebAssembly System Interface)

O WASI é uma especificação de API de sistema para WebAssembly, similar ao POSIX para sistemas Unix. Ele define como módulos WASM podem acessar funcionalidades do sistema de forma segura e padronizada:

- Arquivos e sistema de arquivos
- Rede e sockets
- Variáveis de ambiente
- Tempo e relógio
- Argumentos de linha de comando
- E muito mais!

O WASI garante que o acesso ao sistema seja feito de forma segura, determinística e multiplataforma.

### Runtimes WASM: Escolhendo a Ferramenta Certa

Existem vários runtimes WASM, cada um otimizado para diferentes casos de uso:

#### Wasmi: O Interpretador Puro

**Wasmi** é um interpretador WASM escrito 100% em Rust. É embarcável, leve e perfeito para integrar execução WASM dentro de aplicações Rust sem dependências externas.

**Ideal para**: Smart contracts, runtimes de blockchain, APIs que precisam isolar plugins de terceiros com segurança.

**É exatamente o que usaremos hoje!**

#### Wasmtime: Performance e Compliance

**Wasmtime** é um runtime WASM focado em performance e compliance total com o padrão WASI. É mantido pela Bytecode Alliance e oferece bindings para várias linguagens.

**Ideal para**: Testes, linha de comando, ambientes que executam WASM isoladamente com acesso completo ao sistema.

#### Wasmer: Portabilidade Universal

**Wasmer** é um runtime com foco em portabilidade e virtualização. Suporta múltiplos backends (LLVM, Cranelift, Singlepass) e pode empacotar aplicações como "universal binaries".

**Ideal para**: Distribuição de binários multiplataforma, servidores edge, plugins universais.

### Nosso Foco Hoje

Para este workshop, vamos:

1. Refatorar nossa biblioteca matemática para um módulo WebAssembly
2. Refatorar nosso CRUD para suportar e executar módulos WASM
3. Enviar bytecode WASM para nosso servidor
4. Usar `wasmi` para executar as funções no servidor
5. Entender WASM, WASI, WAT e runtimes na prática

## Capítulo 3: Criando Funções Rust para WebAssembly

Agora vamos colocar a mão na massa e criar nossas primeiras funções que serão compiladas para WebAssembly!

### Configurando o Projeto

Vamos criar um novo projeto Rust especificamente para nossas funções matemáticas:

**MOSTRAR TERMINAL:**

```bash
cargo new --lib wasm-math
cd wasm-math
```

### Estrutura Inicial

**MOSTRAR ARVORE DE ARQUIVOS:**

```
wasm-math/
├── Cargo.toml
└── src/
    └── lib.rs
```

### Configurando o Cargo.toml para WebAssembly

O arquivo `Cargo.toml` precisa de configurações especiais para gerar um módulo WebAssembly otimizado:

**MOSTRAR CRIACAO DE MODULO: Cargo.toml**

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

Vamos entender cada configuração:

**`crate-type = ["cdylib"]`**: Gera uma biblioteca dinâmica compatível com C, necessária para WebAssembly.

**`lto = true`**: Ativa Link Time Optimization, que otimiza o código durante a linkagem, resultando em binários menores e mais rápidos.

**`codegen-units = 1`**: Força o compilador a usar apenas uma unidade de geração de código, melhorando as otimizações.

**`opt-level = "z"`**: Otimiza para tamanho mínimo, crucial para módulos WebAssembly que serão transmitidos pela rede.

### Implementando as Funções Matemáticas

Agora vamos implementar nossas funções matemáticas que serão exportadas para WebAssembly:

**MOSTRAR CRIACAO DA FUNCAO: src/lib.rs**

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

### Entendendo as Anotações Especiais

**`extern "C"`**: Define a convenção de chamada C ABI (Application Binary Interface). Isso garante que as funções sejam chamadas de forma padronizada, compatível com WebAssembly e outros ambientes que esperam código C-like.

**`#[no_mangle]`**: Esta anotação é crucial! Ela impede que o compilador Rust renomeie a função (processo chamado "name mangling"). Sem ela, uma função chamada `add` poderia se tornar algo como `_ZN4math3add17h1234567890abcdefE` no binário final. Com `#[no_mangle]`, ela mantém o nome `add`, permitindo que o runtime WASM a encontre corretamente.

### Lógica das Funções

Notice que implementamos verificações de segurança:

- **Subtração**: Retorna 0 se o resultado seria negativo, evitando underflow
- **Divisão**: Retorna 0 se o divisor for zero, evitando panic

Essas verificações são importantes porque em ambientes como blockchain, panics podem ser catastróficos!

## Capítulo 4: Compilando para WebAssembly

Agora que temos nossas funções prontas, vamos compilá-las para WebAssembly!

### Instalando o Target WebAssembly

Primeiro, precisamos instalar o target de compilação para WebAssembly:

**MOSTRAR TERMINAL:**

```bash
rustup target add wasm32-unknown-unknown
```

Este comando adiciona o target `wasm32-unknown-unknown` ao seu ambiente Rust. Este target específico gera WebAssembly "puro", sem dependências de sistema operacional.

### Compilando o Projeto

Agora vamos compilar nosso projeto para WebAssembly:

**MOSTRAR TERMINAL:**

```bash
cargo build --target wasm32-unknown-unknown --release
```

Este comando:
- `--target wasm32-unknown-unknown`: Especifica que queremos compilar para WebAssembly
- `--release`: Usa as otimizações de release que configuramos no `Cargo.toml`

### Resultado da Compilação

Após a compilação bem-sucedida, você encontrará o arquivo WebAssembly em:

**MOSTRAR ARVORE DE ARQUIVOS:**

```
wasm-math/
├── target/
│   └── wasm32-unknown-unknown/
│       └── release/
│           └── math.wasm  ← Nosso módulo WebAssembly!
└── ...
```

Este arquivo `math.wasm` contém o bytecode otimizado de nossas funções, pronto para ser executado em qualquer runtime WebAssembly!

### Convertendo WASM para Bytes

Para integrar o módulo WASM com nossa API, precisamos converter o arquivo binário em uma lista de bytes. Vamos usar um comando Unix poderoso:

**MOSTRAR TERMINAL:**

```bash
od -An -v -t uC *.wasm \
| tr -s ' ' \
| tr ' ' ',' \
| tr -d '\n' \
| sed 's/^,//;s/,$//g' > BYTES_RESULT.txt
```

Vamos quebrar este comando:

- `od -An -v -t uC *.wasm`: Converte o arquivo binário em números decimais (um por byte)
- `tr -s ' '`: Remove espaços duplicados
- `tr ' ' ','`: Substitui espaços por vírgulas
- `tr -d '\n'`: Remove quebras de linha
- `sed 's/^,//;s/,$//g'`: Remove vírgulas do início e fim

O resultado é uma lista de números separados por vírgula, perfeita para usar em JSON!

## Capítulo 5: Integrando WebAssembly com Nossa API CRUD

Agora vem a parte mais empolgante: vamos transformar nossa API CRUD em uma CRUD-E, onde o "E" significa "Execute"!

### Atualizando as Dependências

Primeiro, vamos adicionar o `wasmi` às dependências do nosso projeto CRUD:

**MOSTRAR CRIACAO DE MODULO: Cargo.toml**

```toml
[dependencies]
tide = "0.16.0"
async-std = { version = "1.12.0", features = ["attributes"] }
serde = { version = "1.0", features = ["derive"] }
serde_json = "1.0"
wasmi = "0.47.0"
```

O `wasmi` é nosso runtime WebAssembly embarcado que permitirá executar módulos WASM dentro da nossa API.

### Atualizando o Modelo de Dados

Vamos modificar nosso `DataEntry` para armazenar módulos WebAssembly:

**MOSTRAR CRIACAO DE MODULO: src/models.rs**

```rust
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct DataEntry {
    pub func_names: Vec<String>,
    pub bytecode: Vec<u8>,
}
```

Agora nosso modelo armazena:
- `func_names`: Lista dos nomes das funções disponíveis no módulo WASM
- `bytecode`: O bytecode do módulo WebAssembly como uma lista de bytes

### Criando o Handler de Execução

Vamos criar um novo handler para executar funções WebAssembly:

**MOSTRAR CRIACAO DA FUNCAO: src/handlers/execute.rs**

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

A struct `ExecRequest` define o formato da requisição:
- `func`: Nome da função a ser executada
- `arg`: Array com dois argumentos inteiros

Usamos `#[serde(rename = "fn")]` porque `fn` é uma palavra reservada em Rust.

### Implementando a Lógica de Execução

**MOSTRAR CRIACAO DA FUNCAO: Continuação do execute.rs**

```rust
pub async fn execute_fn(mut req: Request<AppState>) -> tide::Result {
    // Validação do JSON de entrada
    let exec_req: ExecRequest = req.body_json().await.map_err(|_| {
        tide::Error::from_str(400, "Invalid JSON: esperado { fn: string, arg: [i32; 2] }")
    })?;

    // Extração e validação do ID da URL
    let id: u32 = match req.param("id") {
        Ok(s) => s
            .parse()
            .map_err(|_| tide::Error::from_str(400, "Invalid id"))?,
        Err(_) => return Err(tide::Error::from_str(400, "Missing id")),
    };

    // Busca do módulo WASM no estado global
    let map = req.state().lock().unwrap();
    let entry = match map.get(&id) {
        Some(e) => e,
        None => return Err(tide::Error::from_str(404, "Not found")),
    };
    let wasm_bytes = &entry.bytecode;

    // Carregamento e instanciação do módulo WASM
    let engine = Engine::default();
    let module = Module::new(&engine, wasm_bytes)
        .map_err(|e| tide::Error::from_str(StatusCode::BadRequest, format!("Invalid wasm: {e}")))?;
    let mut store = Store::new(&engine, ());
    let instance = Instance::new(&mut store, &module, &[])
        .map_err(|e| {
            tide::Error::from_str(
                StatusCode::InternalServerError,
                format!("Wasm instantiation error: {e}"),
            )
        })?;

    // Resolução e execução da função
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

    // Resposta com o resultado
    Ok(Response::builder(StatusCode::Ok)
        .body(serde_json::to_string(&json!({ "result": result }))?)
        .content_type(tide::http::mime::JSON)
        .build())
}
```

### Entendendo o Fluxo de Execução

1. **Validação**: Verificamos se o JSON está no formato correto
2. **Busca**: Encontramos o módulo WASM pelo ID no nosso HashMap
3. **Carregamento**: Criamos uma instância do módulo usando `wasmi`
4. **Resolução**: Encontramos a função específica no módulo
5. **Tipagem**: Verificamos se a assinatura da função está correta
6. **Execução**: Chamamos a função com os argumentos fornecidos
7. **Resposta**: Retornamos o resultado como JSON

### Atualizando o Main

Vamos adicionar a nova rota ao nosso servidor:

**MOSTRAR CRIACAO DA FUNCAO: src/main.rs (atualização)**

```rust
mod models;
mod state;
mod handlers;

use handlers::{create, read, update, delete, execute};
use state::new_state;

#[async_std::main]
async fn main() -> tide::Result<()> {
    let addr = "127.0.0.1:8080";
    println!("Servidor CRUD-E rodando em: http://{}", addr);

    let state = new_state();
    let mut app = tide::with_state(state);

    // Rotas CRUD originais
    app.at("/data").post(create::create_data);
    app.at("/data").get(read::read_all_data);
    app.at("/data/:id").get(read::read_data);
    app.at("/data/:id").put(update::update_data);
    app.at("/data/:id").delete(delete::delete_data);

    // Nova rota Execute!
    app.at("/execute/:id").post(execute::execute_fn);

    app.listen(addr).await?;
    Ok(())
}
```

Agora temos uma API CRUD-E completa!

## Capítulo 6: Testando Nossa API CRUD-E com WebAssembly

Chegou a hora da verdade! Vamos testar nossa integração WebAssembly e ver a mágica acontecer.

### Executando o Servidor

Primeiro, vamos iniciar nosso servidor CRUD-E:

**MOSTRAR TERMINAL:**

```bash
cargo run
```

### Passo 1: Salvando o Módulo WASM no Servidor

Vamos enviar nosso módulo WebAssembly para o servidor. Primeiro, você precisa copiar o conteúdo do arquivo `BYTES_RESULT.txt` que criamos anteriormente:

**MOSTRAR TERMINAL:**

```bash
curl -s -X POST http://127.0.0.1:8080/data \
  -H 'Content-Type: application/json' \
  -d '{"func_names": ["add", "mul", "sub", "div"], "bytecode": [BYTE_CODE_AQUI]}'
```

**Importante**: Substitua `[BYTE_CODE_AQUI]` pelo conteúdo real do arquivo `BYTES_RESULT.txt`.

Este comando cria um novo registro no nosso servidor contendo:
- A lista de funções disponíveis no módulo
- O bytecode completo do módulo WebAssembly

### Passo 2: Testando a Execução de Funções

Agora vamos testar cada uma das nossas funções matemáticas:

**Testando Adição:**

**MOSTRAR TERMINAL:**

```bash
export ID=1
curl -s -X POST http://127.0.0.1:8080/execute/$ID \
  -H "Content-Type: application/json" \
  -d '{"fn": "add", "arg": [5, 3]}'
```

Resultado esperado: `{"result": 8}`

**Testando Multiplicação:**

**MOSTRAR TERMINAL:**

```bash
curl -s -X POST http://127.0.0.1:8080/execute/$ID \
  -H "Content-Type: application/json" \
  -d '{"fn": "mul", "arg": [4, 7]}'
```

Resultado esperado: `{"result": 28}`

**Testando Subtração:**

**MOSTRAR TERMINAL:**

```bash
curl -s -X POST http://127.0.0.1:8080/execute/$ID \
  -H "Content-Type: application/json" \
  -d '{"fn": "sub", "arg": [10, 3]}'
```

Resultado esperado: `{"result": 7}`

**Testando Divisão:**

**MOSTRAR TERMINAL:**

```bash
curl -s -X POST http://127.0.0.1:8080/execute/$ID \
  -H "Content-Type: application/json" \
  -d '{"fn": "div", "arg": [15, 3]}'
```

Resultado esperado: `{"result": 5}`

### Testando Casos de Erro

Vamos também testar como nossa API lida com erros:

**Função inexistente:**

**MOSTRAR TERMINAL:**

```bash
curl -s -X POST http://127.0.0.1:8080/execute/$ID \
  -H "Content-Type: application/json" \
  -d '{"fn": "inexistente", "arg": [1, 2]}'
```

**Divisão por zero:**

**MOSTRAR TERMINAL:**

```bash
curl -s -X POST http://127.0.0.1:8080/execute/$ID \
  -H "Content-Type: application/json" \
  -d '{"fn": "div", "arg": [10, 0]}'
```

Resultado esperado: `{"result": 0}` (nossa função trata este caso)

## Capítulo 7: A Conexão com Blockchain - Você Construiu um Protótipo!

Agora vou revelar algo incrível: o que vocês acabaram de construir é essencialmente um protótipo funcional de como smart contracts funcionam em blockchains modernas como Stellar, Polkadot e Near Protocol!

### Paralelos com Blockchain

**Módulos WASM = Smart Contracts**: Nossos módulos WebAssembly são equivalentes aos smart contracts em blockchains WASM-based.

**API CRUD-E = Blockchain Runtime**: Nossa API que armazena e executa módulos é similar ao runtime de uma blockchain que gerencia e executa smart contracts.

**Execução Isolada = Sandboxing**: O `wasmi` executa código de forma isolada, exatamente como blockchains executam smart contracts de forma segura.

**Determinismo = Consenso**: Nossas funções sempre produzem o mesmo resultado para os mesmos inputs, crucial para consenso em blockchain.

### O Que Falta para uma Blockchain Real?

1. **Consenso**: Múltiplos nós concordando sobre o estado
2. **Criptografia**: Assinaturas digitais e hashes
3. **Persistência**: Armazenamento permanente em disco
4. **Rede P2P**: Comunicação entre nós
5. **Economia de Tokens**: Sistema de taxas e recompensas

Mas a base — execução segura e determinística de código — vocês já dominaram!

## Capítulo 8: Próximos Passos e Desafios

### Desafio de Aprendizagem: Implementando Storage

Para levar este projeto ao próximo nível, aqui está um desafio empolgante:

**Implemente um storage para que as funções tenham estado!**

**Dicas para implementação:**

1. **Adicione storage ao DataEntry**:
   ```rust
   pub struct DataEntry {
       pub func_names: Vec<String>,
       pub bytecode: Vec<u8>,
       pub storage: HashMap<String, Vec<u8>>, // Novo!
   }
   ```

2. **Implemente syscalls de getter e setter**:
   - Crie funções host que o WASM pode chamar
   - Use `wasmi::Linker` para expor essas funções
   - Permita que módulos WASM leiam e escrevam no storage

3. **Expanda as capacidades**:
   - Adicione persistência em arquivo
   - Implemente diferentes tipos de dados
   - Crie um sistema de permissões

Este desafio vai transformar seu protótipo em algo ainda mais próximo de uma blockchain real!

### Recursos para Continuar Aprendendo

**Documentação Essencial:**
- [Documentação Oficial do Rust](https://doc.rust-lang.org/)
- [The Rust Book](https://doc.rust-lang.org/book/)
- [Documentação WebAssembly](https://webassembly.org)
- [WASI Specification](https://wasi.dev)

**Runtimes e Ferramentas:**
- [Wasmer](https://wasmer.io) - Runtime universal
- [Wasmtime](https://wasmtime.dev) - Runtime da Bytecode Alliance
- [wasmi](https://github.com/paritytech/wasmi) - Runtime embarcado

**Blockchains WASM:**
- [Stellar Soroban](https://soroban.stellar.org) - Smart contracts em Rust
- [Polkadot](https://polkadot.network) - Parachains em WASM
- [Near Protocol](https://near.org) - Contratos em Rust/AssemblyScript

## Capítulo 9: Recapitulação e Conquistas

Vamos celebrar tudo que conquistamos nestes três dias incríveis!

### Dia 1: Fundamentos Sólidos
- ✅ Dominamos o sistema de ownership do Rust
- ✅ Criamos nossa primeira biblioteca
- ✅ Entendemos gerenciamento de memória seguro
- ✅ Publicamos no Crates.io

### Dia 2: APIs Robustas
- ✅ Construímos uma API CRUD completa
- ✅ Trabalhamos com programação assíncrona
- ✅ Implementamos estado compartilhado seguro
- ✅ Dominamos serialização JSON

### Dia 3: WebAssembly e Além
- ✅ Entendemos a revolução do WebAssembly
- ✅ Compilamos Rust para WASM
- ✅ Integramos execução WASM em APIs
- ✅ Construímos um protótipo de blockchain
- ✅ Conectamos teoria com prática real

### Habilidades Desenvolvidas

**Técnicas:**
- Programação em Rust (ownership, borrowing, lifetimes)
- Desenvolvimento de APIs REST
- Programação assíncrona
- Compilação para WebAssembly
- Integração de runtimes WASM
- Arquitetura de sistemas distribuídos

**Conceituais:**
- Segurança de memória
- Concorrência segura
- Determinismo computacional
- Sandboxing e isolamento
- Fundamentos de blockchain

## Encerramento: O Início de Uma Nova Jornada! 🏆

**Parabéns, coders extraordinários!**

Vocês completaram o **Workshop: Road to Meridian** com maestria absoluta! Em apenas três dias, saíram de iniciantes em Rust para desenvolvedores capazes de construir sistemas complexos que são a base de tecnologias revolucionárias.

O que vocês construíram aqui não é apenas código — é o fundamento para o futuro da computação descentralizada. Vocês agora têm as ferramentas e o conhecimento para:

- Contribuir para projetos blockchain reais
- Desenvolver smart contracts em Stellar, Polkadot, Near
- Criar aplicações WebAssembly de alto desempenho
- Construir sistemas seguros e eficientes em Rust

### Desafio de Carreira

**Compartilhem suas conquistas!**

- Postem no LinkedIn e Twitter com #road2meridian (3/3)
- Marquem a @Stellar e @NearX
- Mostrem ao mundo o que vocês construíram!

### A Jornada Continua

Este workshop é apenas o começo. Continuem explorando, experimentando e construindo. O ecossistema Rust e WebAssembly está crescendo exponencialmente, e vocês agora fazem parte dessa revolução.

Lembrem-se: cada linha de código que vocês escrevem, cada problema que resolvem, cada sistema que constroem — tudo isso contribui para um futuro mais descentralizado, seguro e eficiente.

**Obrigado por esta jornada incrível! Nos vemos nos próximos desafios!** 🦀✨

_"O futuro pertence àqueles que constroem hoje. E vocês acabaram de construir o amanhã."_
