# Roteiro Final: Workshop: Road to Meridian – Dia 2: CRUD em Rust

## Introdução: Bem-vindos ao Segundo Dia do Workshop! 🚀

Olá pessoal!

**Hello World de novo!**

Sejam todos muito bem-vindos ao segundo dia do **Workshop: Road to Meridian**!

Ontem foi incrível, não foi? Mergulhamos nos fundamentos do Rust e criamos nossa primeira biblioteca. Vocês viram como o Rust é uma linguagem poderosa e como o sistema de ownership funciona na prática.

Hoje, vamos dar um passo gigante adiante e construir algo ainda mais empolgante: um sistema **CRUD** completo!

Para quem não sabe, CRUD significa **Create, Read, Update e Delete** — são as quatro operações básicas para gerenciar dados em qualquer aplicação. É literalmente a base de quase tudo que fazemos em programação quando falamos de dados.

Nesta aula, vamos explorar conceitos fundamentais como o gerenciamento de memória do Rust funciona na prática, entender os runtimes assíncronos para lidar com operações que podem demorar um pouco, e criar uma API robusta e funcional usando o framework **Tide**.

Preparados para botar a mão na massa e ver o Rust em ação construindo uma API de verdade? Vamos nessa!

## Capítulo 1: Gerenciamento de Memória em Rust - As 3 Leis Sagradas

Antes de começarmos a construir nossa API, precisamos entender um dos conceitos mais importantes e revolucionários do Rust: o gerenciamento de memória.

Rust é conhecido mundialmente por sua segurança de memória, e isso não é por acaso. Ele consegue evitar muitos erros comuns de programação que podem causar falhas graves ou vulnerabilidades de segurança em nossos programas.

E o mais impressionante: ele faz isso sem precisar de um "coletor de lixo" (garbage collector), que é aquele sistema que gerencia a memória automaticamente em outras linguagens como Java ou Python, mas que pode adicionar uma sobrecarga significativa na performance.

Rust usa um sistema revolucionário chamado **ownership** (posse) para gerenciar a memória. Este sistema é baseado em três regras simples, mas extremamente poderosas. Entender essas regras é absolutamente fundamental para escrever código Rust eficiente e seguro.

Vamos conhecer as **3 Leis do Ownership**:

### Lei 1: Cada valor tem um dono (owner)

Em Rust, cada pedaço de dado na memória tem uma variável que é seu "dono" exclusivo.

Quando o dono de um valor sai de escopo — ou seja, quando a parte do código onde ele foi definido termina — o Rust automaticamente libera a memória associada a esse valor. Isso é fantástico porque evita completamente os vazamentos de memória!

Pense nisso como se cada dado fosse um animal de estimação, e cada variável fosse seu dono responsável. Quando o dono vai embora, o Rust cuida de "limpar a casa" automaticamente.

### Lei 2: Apenas um dono mutável por vez (ou vários imutáveis)

Esta é uma regra genial: um valor pode ter apenas um dono que pode modificá-lo (usando `mut`), OU ele pode ter várias referências que apenas leem o valor (usando `&`), mas nunca ambas ao mesmo tempo.

Isso evita completamente problemas de concorrência e garante que os dados não sejam modificados de forma inesperada por diferentes partes do programa simultaneamente.

É como ter uma regra clara: ou uma pessoa pode editar um documento, ou várias pessoas podem lê-lo, mas nunca as duas coisas ao mesmo tempo.

### Lei 3: Valores são movidos ou emprestados

Quando você passa um valor de uma variável para outra, ele pode ser **movido** (transferindo a posse completamente) ou **emprestado** (criando uma referência temporária).

Se um valor é movido, a variável original não pode mais ser usada. Isso é chamado de _move semantics_.

Se um valor é emprestado, a variável original ainda é a dona, e a referência é apenas temporária.

Vamos ver isso na prática com alguns exemplos:

**MOSTRAR TERMINAL:**

```rust
fn main() {
    let s1 = String::from("Hello"); // s1 é o dono da String "Hello"
    let s2 = s1; // A posse da String é MOVIDA de s1 para s2

    // Agora, s1 NÃO é mais válido. Se tentarmos usar s1, teremos um erro de compilação.
    // println!("{}", s1); // ERRO!
    
    println!("{}", s2); // OK: s2 é o novo dono e pode usar a String
}
```

Neste exemplo, quando `s1` é atribuído a `s2`, a posse da string é transferida completamente. `s1` não pode mais ser usado, garantindo que não haja duas variáveis tentando gerenciar a mesma memória de forma conflitante.

## Capítulo 2: Erros Comuns em Rust - Armadilhas e Como Evitá-las

Mesmo com as regras claras de _ownership_, é muito comum encontrar alguns erros no início da jornada com Rust. Não se preocupem — isso é completamente normal! Vamos ver os mais frequentes e, mais importante, como resolvê-los.

### Erro 1: Use-after-move

Este erro acontece quando você tenta usar uma variável depois que a posse do valor dela foi movida para outra variável.

**A solução:** Se você precisa usar o valor em vários lugares, pode **emprestá-lo** usando referências (`&`) ou, em último caso, **clonar** o valor (`.clone()`) para criar uma cópia independente.

**MOSTRAR TERMINAL: Usando Referência**

```rust
fn main() {
    let s1 = String::from("Hello"); // s1 é o dono

    // Se você quer apenas ler s1, use uma referência:
    let s2 = &s1; // Empresta s1, s1 continua sendo o dono
    println!("s1: {}, s2: {}", s1, s2); // Ambos são válidos
}
```

**MOSTRAR TERMINAL: Usando Clone**

```rust
fn main() {
    let s1 = String::from("Hello"); // s1 é o dono

    let s2 = s1.clone(); // Cria uma CÓPIA independente de s1 para s2
    println!("s1: {}, s2: {}", s1, s2); // OK: s1 e s2 são donos de cópias diferentes
}
```

### Erro 2: Conflitos do Borrow Checker

O _borrow checker_ é a parte do compilador Rust que garante as regras de _ownership_. Conflitos ocorrem quando você tenta ter múltiplas referências mutáveis ao mesmo tempo, ou misturar referências mutáveis com imutáveis.

**A solução:** Reestruture seu código para que ele respeite as regras de _borrowing_. Lembre-se da regra de ouro: ou **uma** referência mutável, ou **várias** referências imutáveis, mas nunca as duas ao mesmo tempo para o mesmo dado.

**MOSTRAR TERMINAL: Código Correto**

```rust
fn main() {
    let mut x = 10; // x é uma variável mutável

    let r1 = &mut x; // r1 é a primeira referência mutável para x

    println!("r1: {}", r1); // Usamos r1. Após este ponto, r1 pode não ser mais usado

    // Agora podemos criar outra referência mutável, pois r1 já foi usado e não está mais ativo
    let r2 = &mut x;

    println!("r2: {}", r2);
}
```

### Erro 3: Referências e Lifetimes

Este erro acontece quando uma referência tenta viver mais tempo do que o dado ao qual ela se refere. Isso pode levar a referências "penduradas" (dangling references).

**A solução:** O compilador Rust geralmente sugere como corrigir isso usando anotações de _lifetime_ (`'a`) ou reestruturando o código para garantir que os dados vivam o tempo suficiente para as referências.

Por enquanto, não vamos nos aprofundar em lifetimes, mas é importante saber que eles existem e que o compilador vai nos ajudar quando necessário.

## Capítulo 3: O que é CRUD? - Entendendo Cliente e Servidor

Agora que entendemos como o Rust gerencia a memória, vamos falar sobre o que vamos construir hoje: um sistema CRUD.

CRUD é um acrônimo que representa as quatro operações básicas que podemos realizar em dados armazenados em qualquer sistema. É um padrão fundamental em praticamente todas as aplicações que lidam com informações.

Vamos quebrar cada letra:

- **C - Create (Criar)**: Adicionar novos registros ou dados ao sistema
- **R - Read (Ler/Consultar)**: Recuperar ou visualizar registros existentes
- **U - Update (Atualizar)**: Modificar registros existentes
- **D - Delete (Deletar/Remover)**: Remover registros do sistema

### Cliente e Servidor: A Dança da Comunicação

Para entender completamente o CRUD, precisamos falar sobre a arquitetura **cliente-servidor**.

**Cliente** é a parte da aplicação que o usuário interage diretamente. Pode ser:
- Um navegador web
- Um aplicativo de celular
- Um programa de terminal
- Ou até mesmo outro servidor!

O cliente envia **requisições HTTP** (como GET, POST, PUT, DELETE) para o servidor.

**Servidor** é a parte da aplicação que processa as requisições do cliente. Ele contém a **API** (Interface de Programação de Aplicações) que define exatamente como o cliente pode interagir com os dados.

O servidor gerencia os dados, que podem estar armazenados em:
- Um banco de dados
- Arquivos no disco
- Ou até mesmo na memória RAM do servidor (como faremos hoje!)

No nosso caso, vamos construir a parte do **servidor** em Rust, que vai expor uma API HTTP para realizar as operações CRUD em dados que estarão armazenados na memória do servidor.

## Capítulo 4: Runtimes Assíncronos em Rust - O Poder da Concorrência

Antes de começarmos a construir nossa API, precisamos entender um conceito fundamental: programação assíncrona.

### O Básico da Programação Assíncrona

Programação assíncrona é uma forma revolucionária de escrever código que permite que seu programa execute tarefas que podem demorar — como fazer uma requisição de rede ou ler um arquivo — sem "travar" ou bloquear a execução de outras partes do programa.

Em Rust, isso é feito com duas palavras-chave mágicas:

- `async`: Marca uma função como assíncrona, o que significa que ela pode pausar sua execução e retomar mais tarde
- `await`: Usado dentro de funções `async` para esperar que uma operação assíncrona seja concluída sem bloquear o programa

Rust, por design, não tem um "runtime" assíncrono embutido na sua biblioteca padrão. Um **runtime assíncrono** é como um motor sofisticado que orquestra a execução das tarefas assíncronas. Por isso, precisamos escolher um para o nosso projeto.

### Tokio vs. async-std: A Grande Escolha

Existem dois runtimes assíncronos principais em Rust, e cada um tem suas características:

#### Tokio

**Tokio** é o runtime assíncrono mais utilizado e maduro em Rust. É altamente performático, extremamente robusto e oferece uma vasta gama de recursos avançados, como timers precisos, gerenciamento de tarefas, sockets de rede otimizados, e muito mais.

**Ideal para:** Aplicações de alto desempenho, sistemas de produção críticos, e quando você precisa de controle de baixo nível sobre as operações assíncronas.

#### async-std

**async-std** oferece uma API que é muito semelhante à biblioteca padrão do Rust (`std`), tornando-o mais fácil de aprender e usar para quem já está familiarizado com Rust síncrono. Possui menos recursos avançados que o Tokio, mas é excelente para a maioria dos casos de uso.

**Ideal para:** Projetos menores, para quem está começando com programação assíncrona em Rust, e para prototipagem rápida.

**Para o nosso workshop, vamos usar o `async-std`** por sua simplicidade e facilidade de uso, o que nos permitirá focar mais na lógica do CRUD sem nos perdermos em detalhes complexos de baixo nível.

## Capítulo 5: Frameworks Web em Rust - Hyper vs. Tide

Para construir APIs web em Rust, usamos _frameworks_. Um _framework_ é um conjunto poderoso de ferramentas e bibliotecas que facilitam enormemente o desenvolvimento, fornecendo uma estrutura sólida e funcionalidades prontas para uso.

### Hyper: A Base de Tudo

**Hyper** é uma biblioteca de baixo nível para lidar com o protocolo HTTP. Ele é extremamente performático — estamos falando de performance de nível industrial — mas exige que você configure muitos detalhes manualmente.

Muitos _frameworks_ web de alto nível em Rust, como Axum e Warp, são construídos sobre o `Hyper`. Ele usa o `Tokio` como seu runtime assíncrono padrão.

### Tide: Nosso Escolhido

**Tide** é um _framework_ web de alto nível, inspirado em outros _frameworks_ populares e bem-sucedidos como o Express.js do JavaScript. Ele oferece APIs mais simples e intuitivas para definir rotas, lidar com requisições HTTP, e trabalhar com JSON.

`Tide` é construído sobre o `async-std` e utiliza o projeto `async-h1` para as operações HTTP. Sua simplicidade e alta produtividade o tornam uma excelente escolha para começar a construir APIs Web em Rust.

**Para o nosso projeto CRUD, usaremos o `Tide`** por sua simplicidade e produtividade, o que nos permitirá focar na lógica do CRUD sem nos perdermos em detalhes de baixo nível do protocolo HTTP.

## Capítulo 6: Configurando o Projeto - Mãos à Obra!

Agora que entendemos toda a teoria, vamos colocar a mão na massa e criar nosso projeto!

**MOSTRAR TERMINAL:**

```bash
cargo new crud
cd crud
```

Isso vai criar um novo projeto Rust para nossa API CRUD.

### Estrutura Inicial de Pastas

**MOSTRAR ARVORE DE ARQUIVOS:**

```
.
├── Cargo.toml   # arquivo de configuração do Rust
└── src
    └── main.rs   # arquivo principal
```

### Configurando as Dependências

Agora, precisamos adicionar as dependências necessárias ao nosso arquivo `Cargo.toml`.

**MOSTRAR CRIACAO DE MODULO: Cargo.toml**

```toml
[dependencies]
async-std = { version = "1.12.0", features = ["attributes"] }
serde = { version = "1.0", features = ["derive"] }
serde_json = "1.0"
tide = "0.16.0"
```

Vamos entender cada dependência:

- **async-std**: O runtime do nosso projeto, necessário para usar o Tide. A feature `attributes` nos permite usar a macro `#[async_std::main]`
- **serde**: Uma biblioteca fantástica de serialização/desserialização. Ela nos permite converter dados Rust para formatos como JSON e vice-versa. A feature `derive` nos permite usar as macros `#[derive(Serialize, Deserialize)]`
- **serde_json**: Uma biblioteca específica para trabalhar com o formato JSON, construída sobre o `serde`
- **tide**: O _framework_ web `Tide` que usaremos para construir nossa API

### Hello World com Tide

Vamos criar nossa primeira API "Hello World" em `src/main.rs`.

**MOSTRAR CRIACAO DA FUNCAO: src/main.rs**

```rust
// Marca a função main como assíncrona e usa o runtime async-std
#[async_std::main]
async fn main() -> tide::Result<()> {
    // Define o endereço e porta onde a API vai rodar
    let addr = "127.0.0.1:8080";

    println!("Servidor Tide rodando em: http://{}", addr);

    // Cria uma nova aplicação Tide
    let mut app = tide::new();

    // Define uma rota GET para o caminho raiz ("/")
    // Quando uma requisição GET chega em "/", ela responde com "Hello, World!"
    app.at("/").get(|_| async {
        Ok("Hello, World!")
    });

    // Inicia o servidor Tide e o faz escutar as requisições no endereço definido
    app.listen(addr).await?;

    // Retorna vazio (sucesso)
    Ok(())
}
```

### Testando Nosso Hello World

Para testar nossa API "Hello World", vamos executar o servidor:

**MOSTRAR TERMINAL:**

```bash
cargo run
```

Você verá uma mensagem no terminal indicando que o servidor está rodando. Agora, abra um **novo terminal** (mantenha o servidor rodando no primeiro terminal) e use o comando `curl` para fazer uma requisição HTTP para a sua API:

**MOSTRAR TERMINAL:**

```bash
curl http://127.0.0.1:8080
```

O que você deve esperar como resultado? O terminal deve exibir a mensagem `Hello, World!`. Isso significa que sua API Tide está funcionando perfeitamente e respondendo às requisições HTTP!

## Capítulo 7: Teoria Antes da Prática - Modelando Nossos Dados

### Modelo de Dados Simples e Eficaz

Para o nosso sistema CRUD, não vamos complicar com Pessoas, Livros ou qualquer entidade complexa. Vamos manter as coisas simples e focar no aprendizado.

Vamos trabalhar com duas listas simples:
- Uma lista de strings
- Uma lista de números (u8)

E vamos identificar essas listas com um ID que será um número simples.

### Gerenciamento de Memória Compartilhada

Nosso servidor precisará de uma estrutura de dados para armazenar os dados de forma segura. Usaremos um `HashMap` (um mapa de chave-valor) para guardar nossas `DataEntry`s.

- A chave será um `u32` (nosso ID)
- O valor será nossa estrutura com as duas listas

Mas aqui vem um desafio interessante: como nossa API é assíncrona, várias requisições podem tentar acessar ou modificar os dados ao mesmo tempo. Precisamos de algo mais sofisticado para garantir segurança.

### Arc e Mutex: A Dupla Dinâmica

Para garantir que múltiplos acessos (de diferentes requisições HTTP) sejam seguros, usaremos `Arc<Mutex<T>>`:

**Arc: Acesso Compartilhado**
- Arc significa "Atomic Reference Counted"
- Ele permite compartilhar um valor entre várias partes do código — como entre as rotas da API
- É como colocar o nosso HashMap dentro de um contador inteligente que sabe quantas pessoas estão usando ao mesmo tempo

**Mutex: Acesso Exclusivo**
- Mutex significa "Mutual Exclusion"
- Ele garante que só uma parte do código por vez consegue modificar o dado que está dentro dele
- Assim, evitamos que duas requisições diferentes "estraguem" os dados ao mesmo tempo

### A Arquitetura Completa

Vamos ter:
1. Um tipo `DataEntry` que junta nossas listas
2. Um `HashMap` que guarda os nossos dados (`DataEntry`)
3. Protegido por um `Mutex` para evitar acessos simultâneos incorretos
4. Envolto num `Arc`, para que possamos compartilhar esse estado entre todas as rotas da API

**Por que isso importa?**

Quando uma rota acessa ou modifica o "banco de dados" (HashMap), ela:
1. Clona o Arc (barato! só aumenta o contador de uso)
2. Tenta travar o Mutex (espera se alguém estiver usando)
3. Lê ou escreve com segurança o DataEntry no HashMap

## Capítulo 8: Implementando a API CRUD - Estrutura e Organização

Para organizar nosso código de forma limpa e profissional, vamos separar as rotas CRUD em arquivos diferentes. Isso torna o código mais fácil de manter e entender.

### Estrutura de Pastas para o CRUD

Vamos criar a seguinte estrutura de arquivos dentro da pasta `src/` do seu projeto `crud`:

**MOSTRAR ARVORE DE ARQUIVOS:**

```
crud/
├── Cargo.toml
└── src/
    ├── main.rs         # Ponto de entrada da aplicação e configuração das rotas
    ├── models.rs       # Definição do modelo de dados (DataEntry)
    ├── state.rs        # Gerenciamento do estado global (HashMap)
    └── handlers/
        ├── mod.rs      # Configuração do módulo handlers
        ├── create.rs   # Lógica para criar dados (POST)
        ├── read.rs     # Lógica para ler dados (GET)
        ├── update.rs   # Lógica para atualizar dados (PUT)
        └── delete.rs   # Lógica para deletar dados (DELETE)
```

### Definindo Nosso Modelo de Dados

**MOSTRAR CRIACAO DE MODULO: src/models.rs**

```rust
use serde::{Serialize, Deserialize};

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct DataEntry {
    pub data1: Vec<String>,
    pub data2: Vec<u8>,
}
```

Vamos entender cada _trait_ que estamos derivando:

- **serde::Serialize**: Permite que o servidor serialize o `DataEntry` em uma resposta JSON
- **serde::Deserialize**: Permite que o servidor deserialize uma request JSON em `DataEntry`
- **Clone**: Permite que você explicitamente crie uma nova cópia dos dados
- **Debug**: Permite que você imprima o struct com a macro `println!` usando `{:?}`

Essas macros nos poupam muito tempo e código, tornando o desenvolvimento em Rust mais eficiente!

### Gerenciando o Estado da Aplicação

**MOSTRAR CRIACAO DE MODULO: src/state.rs**

```rust
use std::collections::HashMap;
use std::sync::{Arc, Mutex};

// Importamos o modelo de dados que definimos
use crate::models::DataEntry;

// AppState é o estado global da aplicação.
pub type AppState = Arc<Mutex<HashMap<u32, DataEntry>>>;

// Cria um novo estado vazio
pub fn new_state() -> AppState {
    Arc::new(Mutex::new(HashMap::new()))
}
```

### Configurando o Módulo de Handlers

**MOSTRAR CRIACAO DE MODULO: src/handlers/mod.rs**

```rust
pub mod create;
pub mod delete;
pub mod read;
pub mod update;
```

### Implementando a Lógica de Criação (CREATE)

**MOSTRAR CRIACAO DA FUNCAO: src/handlers/create.rs**

```rust
use crate::models::DataEntry;
use crate::state::AppState;
use tide::Request;

pub async fn create_data(mut req: Request<AppState>) -> tide::Result {
    // Lê o corpo da requisição como JSON
    let entry: DataEntry = req.body_json().await?;

    // Pega o estado global (HashMap protegido por Mutex)
    let state = req.state();
    let mut map = state.lock().unwrap();

    // Gera um novo id simples
    let new_id = map.len() as u32 + 1;

    // Insere o novo registro
    map.insert(new_id, entry);

    // Retorna o id criado como JSON
    Ok(tide::Body::from_json(&serde_json::json!({ "id": new_id }))?.into())
}
```

### Implementando a Lógica de Leitura (READ)

**MOSTRAR CRIACAO DA FUNCAO: src/handlers/read.rs**

```rust
use crate::state::AppState;
use tide::Request;

pub async fn read_all_data(req: Request<AppState>) -> tide::Result {
    // Pega o estado global
    let state = req.state();
    let map = state.lock().unwrap();

    // Retorna todos os registros como JSON
    Ok(tide::Body::from_json(&*map)?.into())
}

pub async fn read_data(req: Request<AppState>) -> tide::Result {
    // Extrai o id da URL (ex: /data/:id)
    let id: u32 = match req.param("id")?.parse() {
        Ok(val) => val,
        Err(_) => return Err(tide::Error::from_str(400, "Invalid id")),
    };

    // Pega o estado global
    let state = req.state();
    let map = state.lock().unwrap();

    // Busca o registro pelo id
    match map.get(&id) {
        Some(entry) => Ok(tide::Body::from_json(entry)?.into()),
        None => Err(tide::Error::from_str(404, "Data not found")),
    }
}
```

### Implementando a Lógica de Atualização (UPDATE)

**MOSTRAR CRIACAO DA FUNCAO: src/handlers/update.rs**

```rust
use crate::models::DataEntry;
use crate::state::AppState;
use tide::Request;

pub async fn update_data(mut req: Request<AppState>) -> tide::Result {
    // Extrai o id da URL
    let id: u32 = match req.param("id")?.parse() {
        Ok(val) => val,
        Err(_) => return Err(tide::Error::from_str(400, "Invalid id")),
    };

    // Lê o novo conteúdo do corpo da requisição
    let new_entry: DataEntry = req.body_json().await?;

    // Pega o estado global
    let state = req.state();
    let mut map = state.lock().unwrap();

    // Verifica se o registro existe e atualiza
    match map.get_mut(&id) {
        Some(entry) => {
            *entry = new_entry;
            Ok(tide::Body::from_json(&serde_json::json!({ "message": "Updated successfully" }))?.into())
        }
        None => Err(tide::Error::from_str(404, "Data not found")),
    }
}
```

### Implementando a Lógica de Exclusão (DELETE)

**MOSTRAR CRIACAO DA FUNCAO: src/handlers/delete.rs**

```rust
use crate::state::AppState;
use tide::Request;

pub async fn delete_data(req: Request<AppState>) -> tide::Result {
    // Extrai o id da URL
    let id: u32 = match req.param("id")?.parse() {
        Ok(val) => val,
        Err(_) => return Err(tide::Error::from_str(400, "Invalid id")),
    };

    // Pega o estado global
    let state = req.state();
    let mut map = state.lock().unwrap();

    // Remove o registro
    match map.remove(&id) {
        Some(_) => Ok(tide::Body::from_json(&serde_json::json!({ "message": "Deleted successfully" }))?.into()),
        None => Err(tide::Error::from_str(404, "Data not found")),
    }
}
```

### Conectando Tudo no Main

**MOSTRAR CRIACAO DA FUNCAO: src/main.rs**

```rust
mod models;
mod state;
mod handlers;

use handlers::{create, read, update, delete};
use state::new_state;

#[async_std::main]
async fn main() -> tide::Result<()> {
    let addr = "127.0.0.1:8080";
    println!("Servidor CRUD rodando em: http://{}", addr);

    // Cria o estado global da aplicação
    let state = new_state();
    let mut app = tide::with_state(state);

    // Rotas CRUD
    app.at("/data").post(create::create_data);           // CREATE
    app.at("/data").get(read::read_all_data);            // READ ALL
    app.at("/data/:id").get(read::read_data);            // READ ONE
    app.at("/data/:id").put(update::update_data);        // UPDATE
    app.at("/data/:id").delete(delete::delete_data);     // DELETE

    app.listen(addr).await?;
    Ok(())
}
```

## Capítulo 9: Testando Nossa API CRUD

Agora que nossa API está completa, vamos testá-la! Vamos criar alguns scripts de teste para validar cada operação CRUD.

### Executando o Servidor

Primeiro, vamos executar nosso servidor:

**MOSTRAR TERMINAL:**

```bash
cargo run
```

### Testando CREATE (POST)

**MOSTRAR TERMINAL:**

```bash
curl -X POST http://127.0.0.1:8080/data \
  -H "Content-Type: application/json" \
  -d '{"data1": ["hello", "world"], "data2": [1, 2, 3]}'
```

### Testando READ ALL (GET)

**MOSTRAR TERMINAL:**

```bash
curl http://127.0.0.1:8080/data
```

### Testando READ ONE (GET)

**MOSTRAR TERMINAL:**

```bash
curl http://127.0.0.1:8080/data/1
```

### Testando UPDATE (PUT)

**MOSTRAR TERMINAL:**

```bash
curl -X PUT http://127.0.0.1:8080/data/1 \
  -H "Content-Type: application/json" \
  -d '{"data1": ["updated", "data"], "data2": [4, 5, 6]}'
```

### Testando DELETE (DELETE)

**MOSTRAR TERMINAL:**

```bash
curl -X DELETE http://127.0.0.1:8080/data/1
```

## Capítulo 10: Deploy e Próximos Passos

Parabéns! Vocês acabaram de construir uma API CRUD completa em Rust usando Tide!

### O que Aprendemos Hoje

1. **Gerenciamento de Memória**: As 3 leis do ownership e como evitar erros comuns
2. **Programação Assíncrona**: Como usar async/await em Rust
3. **Frameworks Web**: A diferença entre Hyper e Tide
4. **Arquitetura de API**: Como estruturar um projeto CRUD
5. **Concorrência Segura**: Como usar Arc e Mutex para compartilhar estado
6. **Serialização**: Como trabalhar com JSON usando Serde

### Próximos Passos

Para levar este projeto adiante, vocês podem:

1. **Adicionar Validação**: Implementar validação de dados de entrada
2. **Persistência**: Conectar com um banco de dados real
3. **Autenticação**: Adicionar sistema de login e autorização
4. **Documentação**: Gerar documentação automática da API
5. **Deploy**: Subir a API para um serviço de cloud

### Recursos para Continuar Aprendendo

- [Documentação Oficial do Rust](https://doc.rust-lang.org/)
- [The Rust Book](https://doc.rust-lang.org/book/)
- [Tide Documentation](https://docs.rs/tide/)
- [Serde Guide](https://serde.rs/)

Amanhã, no último dia do workshop, vamos dar o próximo passo e trabalhar com WebAssembly, criando um sistema ainda mais avançado!

Obrigado pela atenção e até amanhã! 🦀