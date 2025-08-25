---
marp: true
theme: gaia
---

# **Workshop: Road to Meridian 1**

## **Dia 2: CRUD em Rust**

---

## Abertura

**Hello World!**

Sejam todos bem-vindos ao segundo dia do **Workshop: Road to Meridian 1**!

Ontem, mergulhamos nos fundamentos do Rust e criamos nossa primeira biblioteca. Hoje, vamos dar um passo adiante e construir um sistema **CRUD** completo. CRUD significa Create, Read, Update e Delete, as operações básicas para gerenciar dados em qualquer aplicação.

Nesta aula, vamos explorar como o Rust gerencia a memória de forma segura, entender os runtimes assíncronos para lidar com operações que demoram, e criar uma API robusta usando o framework **Tide**.

Preparados para botar a mão na massa e ver o Rust em ação construindo uma API?

### Programa da aula:

0. **Quem somos e o que é o Road to Meridian?**
1.  **Gerenciamento de Memória**: As 3 leis do Rust.
2.  **Erros Comuns**: Armadilhas do gerenciamento de memória.
3.  **O que é CRUD?**: Entendendo cliente e servidor.
4.  **Runtimes Assíncronos**: Básico, Tokio vs. async-std, e Hyper.
5.  **Frameworks**: Hyper (low-level) vs. Tide (high-level).
6.  **Modelo de Dados**: Definindo `MyData` como `Vec<u8>`.
7.  **Rotas CRUD**: Create, Read, Update, Delete.
8.  **Swagger e Testes Manuais**: Documentação e validação.
9.  **Fazendo Deploy**: Subindo a API para produção.

---

## 0. Apresentação

### Lucas Oliveira

- Matemático (formado em 2021).
- +5 anos como Engenheiro Senior de Blockchain.
- Criação de Layer 1, SDKs, smart contracts (EVM e não-EVM).
- Liderou a entrega de 2 Projetos do DREX.
- Embaixador da Stellar no Brasil.
- Contribuidor F/OSS: +3 bibliotecas crypto publicadas.
- Head of Education @ NearX: Liderança em educação blockchain na LATAM.

---

### NearX

- Plataforma de educação em tecnologias emergentes (Web3, IA, Blockchain).
- Consultoria em Blockchain para Empresas.
- 30 Alunos na Pós Graduação Lato Senso.
- +9.000 alunos na Plataforma.
- +2.500 membros no Discord.
- Oferece: Pós-graduação, Plataforma por assinatura, Mentorias, Bootcamps, Hackathons
- Parcerias: Stellar, Animoca Brands, Optimism, Arbitrum, Starknet, ZkVerify, MultiverseX.

### Stellar

- +13Bi de captalização de mercado.
- Fundada em 2014 pelo Jed McCaleb, founder da Mt. Gox e co-founder da Ripple.
- Smartcontracts em Rust lançados em 2023 por Grandon Hoare.

### Road to Meridian

#### Workshop 1: Introdução ao Rust

- Aula 1: Criar e Publicar Bibliotecas em Rust
- Aula 2: Criar e Deployar Rest API CRUD em Rust
- Aula 3: Criar e Integrar WebAssembly em Rust

---

#### Workshop 2: Smartcontracts Básico na Stellar com Soroban

- Aula 1: Básico de Blockchain e Hello World
- Aula 2: Smartcontracts e Integração com Backend
- Aula 3: Smartcontracts e Integração com Frontend

---

#### Workshop 3: Smartcontracts Avançado na Stellar com Soroban

- Aula 1: Segurança em Smartcontracts
- Aula 2: Composabilidade em Protocolos Soroban
- Aula 3: Implementando Passkey Authn

---

## **3. Gerenciamento de Memória em Rust**

📌 _Rust: Segurança de memória sem garbage collector._

Rust é conhecido por sua segurança de memória, o que significa que ele ajuda a evitar muitos erros comuns de programação que podem causar falhas ou vulnerabilidades. Ele faz isso sem precisar de um "coletor de lixo" (garbage collector), que é um sistema que gerencia a memória automaticamente em outras linguagens, mas que pode adicionar uma sobrecarga.

Rust usa um sistema chamado **ownership** (posse) para gerenciar a memória. Este sistema é baseado em três regras simples, mas poderosas. Entender essas regras é fundamental para escrever código Rust.

---

### As 3 Leis do Ownership

1.  **Cada valor tem um dono (owner)**:
    - Em Rust, cada pedaço de dado na memória tem uma variável que é seu "dono".
    - Quando o dono de um valor sai de escopo (ou seja, a parte do código onde ele foi definido termina), o Rust automaticamente libera a memória associada a esse valor. Isso evita vazamentos de memória.

---

### As 3 Leis do Ownership

2.  **Apenas um dono mutável por vez (ou vários imutáveis)**:
    - Um valor pode ter apenas um dono que pode modificá-lo (`mut`).
    - Ou, ele pode ter várias referências que apenas leem o valor (`&`), mas nunca ambas ao mesmo tempo.
    - Isso evita problemas de concorrência e garante que os dados não sejam modificados de forma inesperada por diferentes partes do programa ao mesmo tempo.

---

### As 3 Leis do Ownership

3.  **Valores são movidos ou emprestados**:
    - Quando você passa um valor de uma variável para outra, ele pode ser **movido** (transferindo a posse) ou **emprestado** (criando uma referência temporária).
    - Se um valor é movido, a variável original não pode mais ser usada. Isso é chamado de _move semantics_.
    - Se um valor é emprestado, a variável original ainda é a dona, e a referência é temporária.

---

### Exemplo de Ownership: Move

Vamos ver um exemplo prático de como o _ownership_ funciona com a regra de "movimento".

ERRADO

```rust
fn main() {
    let s1 = String::from("Hello"); // s1 é o dono da String "Hello"
    let s2 = s1; // A posse da String é MOVIDA de s1 para s2

    // Agora, s1 NÃO é mais válido. Se tentarmos usar s1, teremos um erro de compilação.
    println!("{}", s1);
}
```

CERTO

```rust
fn main() {
    let s1 = String::from("Hello"); // s1 é o dono da String "Hello"
    let s2 = s1; // A posse da String é MOVIDA de s1 para s2

    println!("{}", s2); // OK: s2 é o novo dono e pode usar a String
}
```

---

Neste exemplo, quando `s1` é atribuído a `s2`, a posse da string é transferida. `s1` não pode mais ser usado, garantindo que não haja duas variáveis tentando gerenciar a mesma memória de forma conflitante.

```rust
fn main() {
    let s1 = String::from("Hello");
    let s2 = s1;
    println!("{}", s2);
}
```

---

## **4. Erros Comuns em Rust**

⚡ _Armadilhas do gerenciamento de memória._

Mesmo com as regras de _ownership_, é comum encontrar alguns erros no início. Vamos ver os mais frequentes e como resolvê-los.

---

### 1. Use-after-move

- **Erro**: Acontece quando você tenta usar uma variável depois que a posse do valor dela foi movida para outra variável.
- **Solução**: Se você precisa usar o valor em vários lugares, pode **emprestá-lo** usando referências (`&`) ou, em último caso, **clonar** o valor (`.clone()`) para criar uma cópia independente.

---

REFERENCIA

```rust
fn main() {
    let s1 = String::from("Hello"); // s1 é o dono

    // Se você quer apenas ler s1, use uma referência:
    let s2 = &s1; // Empresta s1, s1 continua sendo o dono
    println!("s1: {}, s2: {}", s1, s2); // Ambos são válidos
}
```

CLONE

```rust
fn main() {
    let s1 = String::from("Hello"); // s1 é o dono

    let s2 = s1.clone(); // Cria uma CÓPIA independente de s1 para s2
    println!("s1: {}, s2: {}", s1, s2); // OK: s1 e s2 são donos de cópias diferentes
}
```

---

### 2. Conflitos do Borrow Checker

- **Erro**: O _borrow checker_ é a parte do compilador Rust que garante as regras de _ownership_. Conflitos ocorrem quando você tenta ter múltiplas referências mutáveis ao mesmo tempo, ou misturar referências mutáveis com imutáveis.
- **Solução**: Reestruture seu código para que ele respeite as regras de _borrowing_. Lembre-se: ou **uma** referência mutável, ou **várias** referências imutáveis, mas nunca as duas ao mesmo tempo para o mesmo dado.

---

ERRADO

```rust
fn main() {
    let mut x = 10; // x é uma variável mutável

    let r1 = &mut x; // r1 é a primeira referência mutável para x

    // Se tentarmos criar outra referência mutável para x aqui, teremos um erro:
    let r2 = &mut x; // ERRO: "cannot borrow `x` as mutable more than once at a time"

    println!("r1: {}", r1);
    println!("r2: {}", r2);
}
```

CERTO

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

---

### 3. Referências e Lifetimes

- **Erro**: Acontece quando uma referência tenta viver mais tempo do que o dado ao qual ela se refere. Isso pode levar a referências "penduradas" (dangling references).
- **Solução**: O compilador Rust geralmente sugere como corrigir isso usando anotações de _lifetime_ (`'a`) ou reestruturando o código para garantir que os dados vivam o tempo suficiente para as referências.

---

Exemplo:

```rust
fn main() {
    let r;                // ---------+-- 'a
                          //          |
    {                     //          |
        let x = 5;        // -+-- 'b  |
        r = &x;           //  |       |
    }                     // -+       |
                          //          |
    println!("r: {r}");   //          |
}                         // ---------+
```

---

## **6. Runtimes Assíncronos em Rust**

📌 _Programação assíncrona em Rust._

### Básico de Programação Assíncrona

Programação assíncrona é uma forma de escrever código que permite que seu programa execute tarefas que demoram (como fazer uma requisição de rede ou ler um arquivo) sem "travar" ou bloquear a execução de outras partes do programa. Em Rust, isso é feito com as palavras-chave `async` e `await`.

- `async`: Marca uma função como assíncrona, o que significa que ela pode pausar sua execução e retomar mais tarde.
- `await`: Usado dentro de funções `async` para esperar que uma operação assíncrona seja concluída sem bloquear o programa.

Rust, por si só, não tem um "runtime" assíncrono embutido na sua biblioteca padrão. Um **runtime assíncrono** é como um motor que orquestra a execução das tarefas assíncronas. Precisamos escolher um para o nosso projeto.

---

### Tokio vs. async-std

Existem dois runtimes assíncronos populares em Rust

---

#### **Tokio**

- **Descrição**: É o runtime assíncrono mais utilizado e maduro em Rust. É altamente performático, robusto e oferece uma vasta gama de recursos, como timers, tarefas, sockets de rede, etc.
- **Ideal para**: Aplicações de alto desempenho, sistemas de produção, e quando você precisa de controle de baixo nível sobre as operações assíncronas.

---

#### **async-std**

- **Descrição**: Oferece uma API que é muito semelhante à biblioteca padrão do Rust (`std`), tornando-o mais fácil de aprender e usar para quem já está familiarizado com Rust síncrono. Possui menos recursos avançados que o Tokio, mas é excelente para a maioria dos casos.
- **Ideal para**: Projetos menores, para quem está começando com programação assíncrona em Rust, e para prototipagem rápida.

Para o nosso workshop, vamos usar o `async-std` por sua simplicidade e facilidade de uso, o que nos permitirá focar mais na lógica do CRUD.

---

## **5. O que é CRUD?**

🛠️ _CRUD: Create, Read, Update, Delete._

CRUD é um acrônimo que representa as quatro operações básicas que podemos realizar em dados armazenados em um sistema. É um padrão fundamental em quase todas as aplicações que lidam com informações.

- **C - Create (Criar)**: Adicionar novos registros ou dados ao sistema.
- **R - Read (Ler/Consultar)**: Recuperar ou visualizar registros existentes.
- **U - Update (Atualizar)**: Modificar registros existentes.
- **D - Delete (Deletar/Remover)**: Remover registros do sistema.

---

### Cliente e Servidor

Para entender o CRUD, precisamos falar sobre **cliente** e **servidor**.

- **Cliente**: É a parte da aplicação que o usuário interage. Pode ser um navegador web, um aplicativo de celular, ou até mesmo um programa de terminal. O cliente envia **requisições HTTP** (como GET, POST, PUT, DELETE) para o servidor.

- **Servidor**: É a parte da aplicação que processa as requisições do cliente. Ele contém a **API** (Interface de Programação de Aplicações) que define como o cliente pode interagir com os dados. O servidor gerencia os dados, que podem estar em um banco de dados, em arquivos, ou até mesmo na memória RAM do servidor.

No nosso caso, vamos construir a parte do **servidor** em Rust, que vai expor uma API HTTP Web para realizar as operações CRUD em dados que estarão armazenados na memória.

---

## **7. Frameworks Web em Rust**

⚡ _Hyper: a base de tudo. Tide: nosso escolhido._

Para construir APIs web em Rust, usamos _frameworks_. Um _framework_ é um conjunto de ferramentas e bibliotecas que facilitam o desenvolvimento, fornecendo uma estrutura e funcionalidades prontas.

---

### Hyper

- **Descrição**: `Hyper` é uma biblioteca de baixo nível para lidar com o protocolo HTTP. Ele é extremamente performático, mas exige que você configure muitos detalhes manualmente.
- **Uso**: Muitos _frameworks_ web de alto nível em Rust, como Axum e Warp, são construídos sobre o `Hyper`. Ele usa o `Tokio` como seu runtime assíncrono.

---

### Tide

- **Descrição**: `Tide` é um _framework_ web de alto nível, inspirado em outros _frameworks_ populares como o Express.js do JavaScript. Ele oferece APIs mais simples e intuitivas para definir rotas, lidar com requisições, e trabalhar com JSON.
- **Uso**: `Tide` é construído sobre o `async-std` e utiliza o projeto `async-h1` para as operações HTTP. Sua simplicidade e produtividade o tornam uma excelente escolha para começar a construir APIs Web em Rust.

Para o nosso projeto CRUD, usaremos o `Tide` por sua simplicidade e produtividade, o que nos permitirá focar na lógica do CRUD sem nos perdermos em detalhes de baixo nível.

---

### Configurando o Projeto com Tide

Vamos criar um novo projeto Rust para nossa API CRUD. Abra seu terminal e digite os seguintes comandos:

```bash
cargo new crud
cd crud
```

---

### Estrutura de Inicial Pastas

```
.
├── Cargo.toml   # arquivo de configuração do Rust
└── src
    └── main.rs   # arquivo de principal
```

---

### Configurando bibliotecas

Agora, precisamos adicionar as dependências necessárias ao nosso arquivo `Cargo.toml`.

```toml
[dependencies]
async-std = { version = "1.12.0", features = ["attributes"] }
serde = { version = "1.0", features = ["derive"] }
serde_json = "1.0"
tide = "0.16.0"
```

- `async-std`: O runtime do nosso projeto, necessário para usar o Tide. A feature `attributes` nos permite usar a macro `#[async_std::main]`.
- `serde`: É uma biblioteca de serialização/desserialização. Ela nos permite converter dados Rust para formatos como JSON e vice-versa. A feature `derive` nos permite usar as macros `#[derive(Serialize, Deserialize)]`.
- `serde_json`: Uma biblioteca específica para trabalhar com o formato JSON, construída sobre o `serde`.
- `tide`: O _framework_ web `Tide` que usaremos para construir nossa API Web.

---

### Hello World

Vamos criar uma API "Hello World" em `src/main.rs`.

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

---

### Validando o Hello World com Tide

Para testar nossa API "Hello World", abra seu terminal na pasta `crud` e execute o servidor:

```bash
cargo run
```

---

Você verá uma mensagem no terminal indicando que o servidor está rodando. Agora, abra um **novo terminal** (mantenha o servidor rodando no primeiro terminal) e use o comando `curl` para fazer uma requisição HTTP para a sua API:

```bash
curl http://127.0.0.1:8080
```

O que você deve esperar como resultado? O terminal deve exibir a mensagem `Hello, World!`. Isso significa que sua API Tide está funcionando corretamente e respondendo às requisições HTTP!

---

## **8. Teoria antes da prática**

### Modelo de Dados

Para o nosso sistema CRUD, não vamos salvar Pessoas ou Livros ou qualquer coisa do tipo.
Vamos salvar duas lista simples, uma strings e outra de números. E vamos identificar essas listas com um ID que vai ser um número qualquer.

---

### Gerenciamento de memória

Nosso servidor precisará de uma estrutura de dados para armazenar os dados.
Usaremos um `HashMap` (um mapa de chave-valor) para guardar nossas `DataEntry`s.
A chave será um `u32` e o valor será dois vetores um de string e outro de u8.

Para garantir que múltiplos acessos (de diferentes requisições HTTP) sejam seguros, usaremos `Arc<Mutex<T>>`:

---

### Gestão de Compartilhada de Memória

Como nosso CRUD não vai implementar um banco de dados, usaremos um HashMap. Mas como a API é assíncrona, e várias requisições podem tentar acessar ou modificar os dados ao mesmo tempo. Preciso de algo um pouco mais sofisticado

**Arc: acesso compartilhado**

- Arc: Atomic Reference Counted.
- Ele permite compartilhar um valor entre várias partes do código — como entre as rotas da API.
- É como colocar o nosso HashMap dentro de um contador inteligente que sabe quantas pessoas estão usando ao mesmo tempo.

**Mutex: acesso exclusivo**

- Mutex: Mutual Exclusion.
- Ele garante que só uma parte do código por vez consegue modificar o dado que está dentro dele.
- Assim, evitamos que duas requisições diferentes estraguem os dados ao mesmo tempo.

---

### Arc, Mutex, HashMap, DataEntry, Dragons, Alossauro...

1. Teremos um tipo DataEntry que junta nossas listas.
2. Um HashMap que guarda os nossos dados (DataEntry).
3. Protegido por um Mutex para evitar acessos simultâneos incorretos.
4. Envolto num Arc, para que possamos compartilhar esse estado entre todas as rotas da API.

- **Por que isso importa?**

Quando uma rota acessa ou modifica o banco de dados (HashMap), ela:

1. Clona o Arc (barato! só aumenta o contador de uso).
2. Tenta travar o Mutex (espera se alguém estiver usando).
3. Lê ou escreve com segurança o DataEntry no HashMap.

---

## **9. Rotas CRUD: Implementando a API**

🛠️ _Implementando um CRUD com Tide e HashMap._

Para organizar nosso código de forma limpa, vamos separar as rotas CRUD em arquivos diferentes

---

### Estrutura de Pastas para o CRUD

Vamos criar a seguinte estrutura de arquivos dentro da pasta `src/` do seu projeto `crud`:

```
crud/
├── Cargo.toml
└── src/
    ├── main.rs         # Ponto de entrada da aplicação e configuração das rotas
    ├── models.rs       # Definição do modelo de dados (DataEntry)
    ├── state.rs        # Gerenciamento do estado global (HashMap)
    ├── handlers/
    │   ├── create.rs   # Lógica para criar dados (POST)
    │   ├── read.rs     # Lógica para ler dados (GET)
    │   ├── update.rs   # Lógica para atualizar dados (PUT)
    │   └── delete.rs   # Lógica para deletar dados (DELETE)
```

---

### `src/models.rs`: Nosso Modelo de Dados

Crie o arquivo `src/models.rs` e adicione o código que definimos anteriormente para `DataEntry`:

```rust
use serde::{Serialize, Deserialize};

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct DataEntry {
    pub data1: Vec<String>,
    pub data2: Vec<u8>,
}
```

---

Vamos detalhar cada _trait_ que estamos derivando:

- `serde::Serialize`: Permite que o servidor serialize o `DataEntry` em uma resposta JSON.
- `serde::Deserialize`: Permite que o servidor deserialize uma request JSON em `DataEntry`.
- `Clone`: Permite que você explicitamente crie uma nova cópia dos dados.
- `Debug`: Permite que você imprima o struct com a macro `println!` com o formatador `{:?}` (ex: `println!("{:?}", minha_entrada);`).

Essas macros nos poupam muito tempo e código, tornando o desenvolvimento em Rust mais eficiente!

---

### `src/state.rs`: Gerenciando o Estado da Aplicação

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

---

### `src/handlers/mpd.rs`: Configurando Módulo

```rust
pub mod create;
pub mod delete;
pub mod read;
pub mod update;
```

---

### `src/handlers/create.rs`: Lógica para Criar Dados (POST)

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

---

### `src/handlers/read.rs`: Lógica para Ler Dados (GET)

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

    // Procura o registro pelo id
    if let Some(entry) = map.get(&id) {
        Ok(tide::Body::from_json(entry)?.into())
    } else {
        Ok(tide::Response::new(404))
    }
}
```

---

### `src/handlers/update.rs`: Lógica para Atualizar Dados (PUT)

```rust
use crate::models::DataEntry;
use crate::state::AppState;
use tide::Request;

pub async fn update_data(mut req: Request<AppState>) -> tide::Result {
    // Extrai o id da URL (ex: /data/:id)
    let id: u32 = match req.param("id")?.parse() {
        Ok(val) => val,
        Err(_) => return Err(tide::Error::from_str(400, "Invalid id")),
    };

    // Lê o corpo da requisição como JSON
    let entry: DataEntry = req.body_json().await?;

    // Pega o estado global
    let state = req.state();
    let mut map = state.lock().unwrap();

    // Atualiza o registro se existir
    if let std::collections::hash_map::Entry::Occupied(mut e) = map.entry(id) {
        e.insert(entry);
        Ok(tide::Response::new(200))
    } else {
        Ok(tide::Response::new(404))
    }
}
```

---

### `src/handlers/delete.rs`: Lógica para Deletar Dados (DELETE)

```rust
use crate::state::AppState;
use tide::Request;

pub async fn delete_data(req: Request<AppState>) -> tide::Result {
    // Extrai o id da URL (ex: /data/:id)
    let id: u32 = match req.param("id")?.parse() {
        Ok(val) => val,
        Err(_) => return Err(tide::Error::from_str(400, "Invalid id")),
    };

    // Pega o estado global
    let state = req.state();
    let mut map = state.lock().unwrap();

    // Remove o registro se existir
    if map.remove(&id).is_some() {
        Ok(tide::Response::new(204))
    } else {
        Ok(tide::Response::new(404))
    }
}
```

---

### `src/main.rs`: Conectando Tudo

```rust
mod handlers;
mod models;
mod state;

use handlers::create::create_data;
use handlers::delete::delete_data;
use handlers::read::{read_all_data, read_data};
use handlers::update::update_data;

#[async_std::main]
async fn main() -> tide::Result<()> {
    // Cria o estado global da aplicação
    let state = state::new_state();

    // Cria o app Tide e associa o estado
    let mut app = tide::with_state(state);

    // Define as rotas CRUD
    app.at("/data").post(create_data); // Cria
    app.at("/data").get(read_all_data); // Lê todos
    app.at("/data/:id").get(read_data); // Lê um
    app.at("/data/:id").put(update_data); // Atualiza
    app.at("/data/:id").delete(delete_data); // Deleta

    let addr = "127.0.0.1:8080";
    println!("Servidor CRUD rodando em: http://{addr}");

    // Inicia o servidor
    app.listen(addr).await?;
    Ok(())
}
```

---

### Execute

```bash
cargo run
```

---

### 10. Testes Manuais

Agora vamos acessar nosso crud e testar todas as rotas seguindo o seguinte roteiro:

---

### 1. Criar um novo item de dados.

```bash
curl -s -X POST http://127.0.0.1:8080/data \
  -H 'Content-Type: application/json' \
  -d '{"data1": ["primeiro", "segundo"], "data2": [1,2,3]}'
```

---

### 2. Ler um item específico por ID.

```bash
curl http://127.0.0.1:8080/data/1
```

---

### 3. Atualizar um item existente.

```bash
curl -s -X PUT http://127.0.0.1:8080/data/1 \
  -H 'Content-Type: application/json' \
  -d '{"data1": ["atualizado"], "data2": [9,8,7]}'
```

### 4. Remover um item.

```bash
curl -s -X DELETE http://127.0.0.1:8080/data/1
```

---

### 5. Ler todos os dados.

```bash
curl http://127.0.0.1:8080/data
```

---

## **11. Fazendo Deploy: Subindo a API para Produção**

📌 _Subindo a API para produção._

Depois de desenvolver e testar sua API localmente, o próximo passo é colocá-la online para que outras pessoas possam acessá-la. Isso é chamado de _deploy_. Vamos usar a plataforma Railway para fazer isso de forma simples.

---

### Deploy com Railway

Claro! Aqui está a versão ajustada, com linguagem mais clara, objetiva e organizada para facilitar o entendimento de quem está seguindo o tutorial:

1. **Crie uma conta gratuita**: Acesse [railway.app](https://railway.app) e crie sua conta (você pode usar GitHub para facilitar).

2. **Configure seu GitHub**: Conecte sua conta do GitHub ao Railway e dê permissão ao repositório do seu projeto.

3. **Ajuste o ambiente para produção**: No arquivo `main.rs`, certifique-se de mudar de `127.0.0.1` para o servidor está escutando em `0.0.0.0`:

```rust
// src/main.rs linha 25
let addr = "0.0.0.0:8080";
```

4. **Conecte seu repositório no Railway**: Crie um novo projeto → **Deploy from GitHub Repo** → selecione o repositório.

5. **Deploy e domínio automático**: O Railway vai compilar e rodar o projeto automaticamente. Ele também gera uma URL pública (como `https://seu-projeto.up.railway.app`).

6. **Tudo pronto!**: Aponte seus scripts de teste (ou Swagger) para o novo domínio e valide a API em produção. ✅

---

## **13. Recapitulação**

Chegamos ao final do nosso segundo dia de Workshop! Vamos revisar os pontos mais importantes que cobrimos:

1.  **Gerenciamento de Memória em Rust**: Entendemos as 3 leis fundamentais do _ownership_ (cada valor tem um dono, apenas um dono mutável ou vários imutáveis, valores são movidos ou emprestados) que garantem a segurança de memória sem a necessidade de um coletor de lixo.
2.  **Erros Comuns de Ownership**: Vimos como identificar e resolver problemas como _use-after-move_, conflitos do _borrow checker_ e _lifetimes_ incorretos, que são desafios iniciais ao aprender Rust.
3.  **O que é CRUD?**: Definimos o padrão CRUD (Create, Read, Update, Delete) como as operações essenciais para gerenciar dados em qualquer aplicação, e a relação entre cliente e servidor em uma API.
4.  **Runtimes Assíncronos**: Exploramos a importância da programação assíncrona em Rust com `async` e `await`, e comparamos os runtimes `Tokio` (robusto e performático) e `async-std` (simples e fácil de usar), escolhendo o último para nosso projeto.
5.  **Frameworks Web**: Discutimos o `Hyper` como uma base HTTP de baixo nível e o `Tide` como um _framework_ de alto nível, mais produtivo para construir APIs, que foi nossa escolha para este workshop.
6.  **Modelo de Dados**: Definimos nosso modelo de dados `DataEntry` com um `id` (`u32`) e um `data` (`Vec<u8>`), e como o `Arc<Mutex<HashMap<u32, MyData>>>` é usado para gerenciar o estado da aplicação de forma segura para concorrência.
7.  **Rotas CRUD Implementadas**: Quebramos a implementação das rotas CRUD em arquivos separados (`create.rs`, `read.rs`, `update.rs`, `delete.rs`) para melhor organização do código, e conectamos tudo no `main.rs`.
8.  **Swagger e Testes Manuais**: Aprendemos a documentar nossa API usando Swagger/OpenAPI com `tide-openapi` e `openapi-spec`, e como realizar testes manuais em cada endpoint usando `curl` para validar o comportamento da API.
9.  **Fazendo Deploy**: Vimos como subir nossa API para a nuvem usando a plataforma Railway, desde a instalação do CLI até o comando `railway up` para colocar a aplicação em produção.

Você construiu uma API CRUD completa em Rust! Isso é um feito e tanto!

---

## **14. Lição de Casa**

Para consolidar o que você aprendeu, tenho alguns desafios para você:

### Desafio de Aprendizagem

- **Adicione uma camada de segurança**: Implemente uma camada de autenticação para que apenas o dono do DataEntry possa atualiza-lo e deleta-lo.

### Desafio de Carreira

- Post no LinkedIn e Twitter com #road2meridian (1/3)
- Marque a Stellar
- Marque a NearX

### Recursos Adicionais

Para continuar seus estudos, recomendo:

- [Documentação Oficial do Rust](https://www.rust-lang.org/learn): O site oficial do Rust tem uma documentação excelente.
- [Documentação Tide](https://docs.rs/tide): A documentação oficial do framework Tide.
- [The Rust Book](https://doc.rust-lang.org/book/): Um livro completo e gratuito sobre Rust, ideal para aprofundar seus conhecimentos.

---

## **15. Próxima Aula**

**06/05 – Dia 3: WebAssembly com Rust**

- Amanhã, vamos dar um passo ainda maior: transformar nosso código Rust em **WebAssembly** para que ele possa rodar diretamente no navegador web! Prepare-se para ver o Rust em ação no frontend.

_"Não esqueça: Aula ao vivo amanhã, 19h, no YouTube. Traga suas dúvidas!"_
