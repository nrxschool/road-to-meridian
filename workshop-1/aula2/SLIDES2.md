---
marp: true
theme: gaia
---

# **Workshop: Road to Meridian**

## **Dia 2: CRUD em Rust**

---

## **1. Abertura**

**Hello World!**

Sejam todos bem-vindos ao segundo dia do **Workshop: Road to Meridian**!

Ontem, mergulhamos nos fundamentos do Rust e criamos nossa primeira biblioteca. Hoje, vamos dar um passo adiante e construir um sistema **CRUD** completo. CRUD significa Create, Read, Update e Delete, as operações básicas para gerenciar dados em qualquer aplicação.

Nesta aula, vamos explorar como o Rust gerencia a memória de forma segura, entender os runtimes assíncronos para lidar com operações que demoram, e criar uma API robusta usando o framework **Tide**.

Preparados para botar a mão na massa e ver o Rust em ação construindo uma API?

---

## **2. Programação**

1.  [Gerenciamento de Memória](#3-gerenciamento-de-memoria-em-rust): As 3 leis do Rust.
2.  [Erros Comuns](#4-erros-comuns-em-rust): Armadilhas do gerenciamento de memória.
3.  [O que é CRUD?](#5-o-que-e-crud): Entendendo cliente e servidor.
4.  [Runtimes Assíncronos](#6-runtimes-assincronos-em-rust): Básico, Tokio vs. async-std, e Hyper.
5.  [Frameworks Web](#7-frameworks-web-em-rust): Hyper (low-level) vs. Tide (high-level).
6.  [Modelo de Dados](#8-teoria-antes-da-pratica): Definindo `DataEntry`.
7.  [Rotas CRUD](#9-rotas-crud-implementando-a-api): Create, Read, Update, Delete.
8.  [Swagger e Testes Manuais](#10-swagger-e-testes-manuais): Documentação e validação.
9.  [Fazendo Deploy](#11-fazendo-deploy-subindo-a-api-para-producao): Subindo a API para produção.

---

## **3. Gerenciamento de Memória em Rust**

📌 _Rust: Segurança de memória sem garbage collector._

Rust é conhecido por sua segurança de memória, o que significa que ele ajuda a evitar muitos erros comuns de programação que podem causar falhas ou vulnerabilidades. Ele faz isso sem precisar de um "coletor de lixo" (garbage collector), que é um sistema que gerencia a memória automaticamente em outras linguagens, mas que pode adicionar uma sobrecarga.

Rust usa um sistema chamado **ownership** (posse) para gerenciar a memória. Este sistema é baseado em três regras simples, mas poderosas. Entender essas regras é fundamental para escrever código Rust.

---

### As 3 Leis do Ownership

1.  **Cada valor tem um dono (owner)**:
    *   Em Rust, cada pedaço de dado na memória tem uma variável que é seu "dono".
    *   Quando o dono de um valor sai de escopo (ou seja, a parte do código onde ele foi definido termina), o Rust automaticamente libera a memória associada a esse valor. Isso evita vazamentos de memória.

---

### As 3 Leis do Ownership (cont.)

2.  **Apenas um dono mutável por vez (ou vários imutáveis)**:
    *   Um valor pode ter apenas um dono que pode modificá-lo (`mut`).
    *   Ou, ele pode ter várias referências que apenas leem o valor (`&`), mas nunca ambas ao mesmo tempo.
    *   Isso evita problemas de concorrência e garante que os dados não sejam modificados de forma inesperada por diferentes partes do programa ao mesmo tempo.

---

### As 3 Leis do Ownership (cont.)

3.  **Valores são movidos ou emprestados**:
    *   Quando você passa um valor de uma variável para outra, ele pode ser **movido** (transferindo a posse) ou **emprestado** (criando uma referência temporária).
    *   Se um valor é movido, a variável original não pode mais ser usada. Isso é chamado de _move semantics_.
    *   Se um valor é emprestado, a variável original ainda é a dona, e a referência é temporária.

---

### Exemplo de Ownership: Move

Vamos ver um exemplo prático de como o _ownership_ funciona com a regra de "movimento".

```rust
fn main() {
    let s1 = String::from("Hello"); // s1 é o dono da String "Hello"
    let s2 = s1; // A posse da String é MOVIDA de s1 para s2

    // Agora, s1 NÃO é mais válido. Se tentarmos usar s1, teremos um erro de compilação.
    // println!("{}", s1); // ERRO: s1 não é mais válido após o movimento

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

Exemplo:

```rust
fn main() {
    let s1 = String::from("Hello"); // s1 é o dono

    // Se você quer apenas ler s1, use uma referência:
    // let s2 = &s1; // Empresta s1, s1 continua sendo o dono
    // println!("s1: {}, s2: {}", s1, s2); // Ambos são válidos

    let s2 = s1.clone(); // Cria uma CÓPIA independente de s1 para s2
    println!("s1: {}, s2: {}", s1, s2); // OK: s1 e s2 são donos de cópias diferentes
}
```

---

### 2. Conflitos do Borrow Checker

- **Erro**: O _borrow checker_ é a parte do compilador Rust que garante as regras de _ownership_. Conflitos ocorrem quando você tenta ter múltiplas referências mutáveis ao mesmo tempo, ou misturar referências mutáveis com imutáveis.
- **Solução**: Reestruture seu código para que ele respeite as regras de _borrowing_. Lembre-se: ou **uma** referência mutável, ou **várias** referências imutáveis, mas nunca as duas ao mesmo tempo para o mesmo dado.

---

Exemplo:

```rust
fn main() {
    let mut x = 10; // x é uma variável mutável

    let r1 = &mut x; // r1 é a primeira referência mutável para x

    // Se tentarmos criar outra referência mutável para x aqui, teremos um erro:
    // let r2 = &mut x; // ERRO: "cannot borrow `x` as mutable more than once at a time"

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

Existem dois runtimes assíncronos populares em Rust:

**Tokio**

- **Descrição**: É o runtime assíncrono mais utilizado e maduro em Rust. É altamente performático, robusto e oferece uma vasta gama de recursos, como timers, tarefas, sockets de rede, etc.
- **Ideal para**: Aplicações de alto desempenho, sistemas de produção, e quando você precisa de controle de baixo nível sobre as operações assíncronas.

**async-std**

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

Para construir APIs web em Rust, usamos *frameworks*. Um *framework* é um conjunto de ferramentas e bibliotecas que facilitam o desenvolvimento, fornecendo uma estrutura e funcionalidades prontas.

---

### Hyper

- **Descrição**: `Hyper` é uma biblioteca de baixo nível para lidar com o protocolo HTTP. Ele é extremamente performático, mas exige que você configure muitos detalhes manualmente.
- **Uso**: Muitos *frameworks* web de alto nível em Rust, como Axum e Warp, são construídos sobre o `Hyper`. Ele usa o `Tokio` como seu runtime assíncrono.

---

### Tide

- **Descrição**: `Tide` é um *framework* web de alto nível, inspirado em outros *frameworks* populares como o Express.js do JavaScript. Ele oferece APIs mais simples e intuitivas para definir rotas, lidar com requisições, e trabalhar com JSON.
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

### Estrutura de Pastas

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
serde_json = "1.0" # Adicionado para garantir que serde_json esteja disponível
tide = "0.16.0"
```

- `async-std`: O runtime do nosso projeto, necessário para usar o Tide. A feature `attributes` nos permite usar a macro `#[async_std::main]`.
- `serde`: É uma biblioteca de serialização/desserialização. Ela nos permite converter dados Rust para formatos como JSON e vice-versa. A feature `derive` nos permite usar as macros `#[derive(Serialize, Deserialize)]`.
- `serde_json`: Uma biblioteca específica para trabalhar com o formato JSON, construída sobre o `serde`.
- `tide`: O _framework_ web `Tide` que usaremos para construir nossa API Web.

---

### Hello World com Tide

Vamos criar uma API "Hello World".

```rust
// src/main.rs
#[async_std::main] // Marca a função main como assíncrona e usa o runtime async-std
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

Para testar nossa API "Hello World", abra seu terminal na pasta `rust-crud` e execute o servidor:

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

Para o nosso sistema CRUD, vamos salvar um tipo de dado mais complexo, que chamaremos de `DataEntry`. Ele terá dois campos:*   `data1`: Uma lista de textos (`Vec<String>`).
*   `data2`: Uma lista de números de 8 bits (`Vec<u8>`).

E vamos identificar essas entradas com um ID que será um número `u32` (entre 0 e 4.294.967.295).

---

### Gerenciamento de memória

Nosso servidor precisará de um lugar para armazenar os dados. Usaremos um `HashMap` (um mapa de chave-valor) para guardar nossas `DataEntry`s. A chave será o `id` (`u32`) e o valor será a `DataEntry`.

Para garantir que múltiplos acessos (de diferentes requisições HTTP) sejam seguros, usaremos `Arc<Mutex<HashMap<u32, DataEntry>>>`:

- `HashMap<u32, DataEntry>`: Onde nossos dados serão armazenados.
- `Mutex`: Garante que apenas uma requisição por vez possa modificar o `HashMap`, evitando problemas de concorrência.
- `Arc`: Permite que o `Mutex` (e o `HashMap` dentro dele) seja compartilhado de forma segura entre diferentes partes da aplicação (diferentes rotas e _threads_ assíncronas).


---

## **9. Rotas CRUD: Implementando a API**

🛠️ _Implementando um CRUD com Tide e HashMap._

Para organizar nosso código de forma limpa, vamos separar as rotas CRUD em arquivos diferentes

### Estrutura de Pastas para o CRUD

Vamos criar a seguinte estrutura de arquivos dentro da pasta `src/` do seu projeto `rust-crud`:

```
rust-crud/
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

MOSTRAR EDITOR DE TEXTO: Criando `src/models.rs`

MOSTRAR CRIACAO DE MODULO:
```rust
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Clone, Debug)]pub struct DataEntry {
    pub id: u32,
    pub data1: Vec<String>, // Lista de textos
    pub data2: Vec<u8>,     // Lista de números inteiros (bytes)
}
```

---

### Entendendo as Macros `#[derive]`

Você deve ter notado a linha `#[derive(serde::Serialize, serde::Deserialize, Clone, Debug)]` acima da nossa struct `DataEntry`. Isso é um exemplo de **macro de atributo** em Rust. Macros são como código que escreve código para você, e as macros de atributo são usadas para adicionar funcionalidades a itens como structs, enums e funções.

*   `#[]`: Indica que o que vem a seguir é uma macro de atributo.
*   `derive`: É uma macro especial que gera implementações de *traits* (interfaces) comuns para a sua struct ou enum. Em vez de escrever todo o código repetitivo para, por exemplo, clonar uma struct, você simplesmente usa `#[derive(Clone)]` e o Rust faz o trabalho pesado para você.

Vamos detalhar cada *trait* que estamos derivando:

*   `serde::Serialize`: Esta *trait* é fornecida pela biblioteca `serde`. Ela permite que instâncias da sua struct `DataEntry` sejam **serializadas**, ou seja, convertidas para um formato de dados externo, como JSON. Quando o servidor envia uma resposta JSON, ele usa essa funcionalidade.
*   `serde::Deserialize`: Também da biblioteca `serde`, esta *trait* permite que instâncias da sua struct `DataEntry` sejam **desserializadas**, ou seja, convertidas de um formato de dados externo (como JSON recebido de uma requisição) de volta para uma struct Rust. Quando o servidor recebe um JSON no corpo da requisição, ele usa essa funcionalidade.
*   `Clone`: Esta *trait* permite que você crie uma **cópia exata** de uma instância da sua struct. Em Rust, por padrão, a atribuição de structs grandes pode mover a posse. `Clone` permite que você explicitamente crie uma nova cópia dos dados, o que é útil quando você precisa de múltiplas cópias independentes de um valor.
*   `Debug`: Esta *trait* permite que você imprima instâncias da sua struct de uma forma que seja útil para **depuração**. Você pode usar a macro `println!` com o formatador `{:?}` (ex: `println!("{:?}", minha_entrada);`) para ver uma representação formatada da sua struct, o que é muito útil para entender o estado do seu programa durante o desenvolvimento.

Essas macros nos poupam muito tempo e código, tornando o desenvolvimento em Rust mais eficiente!

---

### `src/state.rs`: Gerenciando o Estado da Aplicação

Nosso servidor precisará de um lugar para armazenar os dados. Usaremos um `HashMap` (um mapa de chave-valor) para guardar nossas `DataEntry`s. A chave será o `id` (`u32`) e o valor será a `DataEntry`.

Para garantir que múltiplos acessos (de diferentes requisições HTTP) sejam seguros, usaremos `Arc<Mutex<HashMap<u32, DataEntry>>>`:

*   `HashMap<u32, DataEntry>`: Onde nossos dados serão armazenados.
*   `Mutex`: Garante que apenas uma requisição por vez possa modificar o `HashMap`, evitando problemas de concorrência.
*   `Arc`: Permite que o `Mutex` (e o `HashMap` dentro dele) seja compartilhado de forma segura entre diferentes partes da aplicação (diferentes rotas e _threads_ assíncronas).

Crie o arquivo `src/state.rs` e adicione o seguinte código:

MOSTRAR EDITOR DE TEXTO: Criando `src/state.rs`

MOSTRAR CRIACAO DE MODULO:
```rust
// src/state.rs

use std::collections::HashMap;
use std::sync::{Arc, Mutex};

// Importamos o modelo de dados que definimos
use crate::models::DataEntry;

// Definimos o tipo State para facilitar o uso em outras partes do código
pub type State = Arc<Mutex<HashMap<u32, DataEntry>>>;

// Função para criar um estado inicial vazio
pub fn new_state() -> State {
    Arc::new(Mutex::new(HashMap::new()))
}
```

---

### `src/handlers/create.rs`: Lógica para Criar Dados (POST)

Crie a pasta `src/handlers/` e, dentro dela, o arquivo `create.rs`. Este arquivo conterá a função que lida com a criação de novos dados.

MOSTRAR EDITOR DE TEXTO: Criando `src/handlers/create.rs`

MOSTRAR CRIACAO DE MODULO:
```rust
// src/handlers/create.rs

use tide::Request;
use crate::state::State;
use crate::models::DataEntry;

pub async fn create_data(mut req: Request<State>) -> tide::Result {
    // 1. Extrai o corpo da requisição JSON para um DataEntry
    let entry: DataEntry = req.body_json().await?;

    // 2. Bloqueia o Mutex para acessar o estado compartilhado de forma segura
    let mut state = req.state().lock().unwrap();

    // 3. Insere a nova entrada no HashMap. Usamos .clone() para copiar os dados.
    state.insert(entry.id, entry.clone());

    // 4. Retorna a entrada criada como JSON com status 200 OK
    Ok(tide::Body::from_json(&entry)?.into())
}
```

---

### `src/handlers/read.rs`: Lógica para Ler Dados (GET)

Crie o arquivo `src/handlers/read.rs`. Este arquivo conterá duas funções: uma para ler todos os dados e outra para ler um dado específico por ID.

MOSTRAR EDITOR DE TEXTO: Criando `src/handlers/read.rs`

MOSTRAR CRIACAO DE MODULO:
```rust
// src/handlers/read.rs

use tide::Request;
use crate::state::State;
use crate::models::DataEntry;

// Função para ler TODOS os dados
pub async fn read_all_data(req: Request<State>) -> tide::Result {
    // 1. Bloqueia o Mutex para acessar o estado compartilhado
    let state = req.state().lock().unwrap();

    // 2. Converte o HashMap de dados para uma lista de DataEntry
    let result: Vec<DataEntry> = state
        .iter()
        .map(|(_, entry)| entry.clone())
        .collect();

    // 3. Retorna a lista de DataEntry como JSON com status 200 OK
    Ok(tide::Body::from_json(&result)?.into())
}

// Função para ler UM dado específico por ID
pub async fn read_data(req: Request<State>) -> tide::Result {
    // 1. Extrai o ID da URL (ex: /data/123 -> id = 123)
    let id: u32 = req.param("id")?.parse()?;

    // 2. Bloqueia o Mutex para acessar o estado compartilhado
    let state = req.state().lock().unwrap();

    // 3. Tenta encontrar o dado no HashMap pelo ID
    match state.get(&id) {
        Some(entry) => {
            // Se encontrado, retorna o DataEntry como JSON
            Ok(tide::Body::from_json(&entry)?.into())
        }
        None => {
            // Se não encontrado, retorna status 404 Not Found
            Ok(tide::StatusCode::NotFound.into())
        }
    }
}
```

---

### `src/handlers/update.rs`: Lógica para Atualizar Dados (PUT)

Crie o arquivo `src/handlers/update.rs`. Este arquivo conterá a função que lida com a atualização de dados existentes.

MOSTRAR EDITOR DE TEXTO: Criando `src/handlers/update.rs`

MOSTRAR CRIACAO DE MODULO:
```rust
// src/handlers/update.rs

use tide::Request;
use crate::state::State;
use crate::models::DataEntry;

pub async fn update_data(mut req: Request<State>) -> tide::Result {
    // 1. Extrai o ID da URL
    let id: u32 = req.param("id")?.parse()?;

    // 2. Extrai o corpo da requisição JSON para um DataEntry (com os novos dados)
    let entry: DataEntry = req.body_json().await?;

    // 3. Bloqueia o Mutex para acessar o estado compartilhado
    let mut state = req.state().lock().unwrap();

    // 4. Verifica se o ID existe no HashMap
    if state.contains_key(&id) {
        // Se existir, atualiza a entrada com os novos dados
        state.insert(id, entry.clone());
        // Retorna a entrada atualizada como JSON
        Ok(tide::Body::from_json(&entry)?.into())
    } else {
        // Se não existir, retorna status 404 Not Found
        Ok(tide::StatusCode::NotFound.into())
    }
}
```

---

### `src/handlers/delete.rs`: Lógica para Deletar Dados (DELETE)

Crie o arquivo `src/handlers/delete.rs`. Este arquivo conterá a função que lida com a remoção de dados.

MOSTRAR EDITOR DE TEXTO: Criando `src/handlers/delete.rs`

MOSTRAR CRIACAO DE MODULO:
```rust
// src/handlers/delete.rs

use tide::Request;
use crate::state::State;

pub async fn delete_data(req: Request<State>) -> tide::Result {
    // 1. Extrai o ID da URL
    let id: u32 = req.param("id")?.parse()?;

    // 2. Bloqueia o Mutex para acessar o estado compartilhado
    let mut state = req.state().lock().unwrap();

    // 3. Tenta remover a entrada do HashMap pelo ID
    if state.remove(&id).is_some() {
        // Se removido com sucesso, retorna status 200 OK
        Ok(tide::StatusCode::Ok.into())
    } else {
        // Se não encontrado, retorna status 404 Not Found
        Ok(tide::StatusCode::NotFound.into())
    }
}
```

---

### `src/main.rs`: Declarando nossos módulos

Para que o `main.rs` possa usar os arquivos que acabamos de criar (`models.rs`, `state.rs` e a pasta `handlers`), precisamos declará-los como módulos. Adicione as seguintes linhas no topo do seu `src/main.rs`:

MOSTRAR EDITOR DE TEXTO: Abrindo `src/main.rs`

MOSTRAR CRIACAO DE MODULO:
```rust
// src/main.rs

// Declara o módulo 'state'
mod state;
// Declara o módulo 'models'
mod models;
// Declara o módulo 'handlers' (que contém outros módulos)
mod handlers;

// ... (restante dos 'use' e 'main' function)
```

---

### `src/main.rs`: Conectando Tudo

Agora que temos os modelos, o estado e os _handlers_ separados, vamos atualizar o `src/main.rs` para importar e usar tudo isso. Este arquivo será o ponto de entrada da nossa aplicação.

```rust
// src/main.rs

// Importa o módulo 'state' que definimos
mod state;
// Importa o módulo 'models' que definimos
mod models;
// Importa todos os handlers que criamos
mod handlers;

use tide::Request;
use crate::state::State;

// Importa as funções específicas dos handlers
use crate::handlers::create::create_data;
use crate::handlers::read::{read_all_data, read_data};
use crate::handlers::update::update_data;
use crate::handlers::delete::delete_data;

#[async_std::main]
async fn main() -> tide::Result<()> {
    // Cria uma nova instância do nosso estado global
    let state = state::new_state();
    
    // Cria uma nova aplicação Tide e associa o estado a ela
    let mut app = tide::with_state(state);

    // Configura as rotas CRUD
    // Rota para criar dados (POST /data)
    app.at("/data").post(create_data);
    // Rota para ler todos os dados (GET /data)
    app.at("/data").get(read_all_data);
    // Rota para ler um dado específico por ID (GET /data/:id)
    app.at("/data/:id").get(read_data);
    // Rota para atualizar um dado (PUT /data/:id)
    app.at("/data/:id").put(update_data);
    // Rota para deletar um dado (DELETE /data/:id)
    app.at("/data/:id").delete(delete_data);

    let addr = "127.0.0.1:8080";
    println!("Servidor CRUD rodando em: http://{}", addr);
    
    // Inicia o servidor
    app.listen(addr).await?;
    Ok(())
}
```

---

## **10. Swagger e Testes Manuais**

⚡ _Documentando e testando a API._

Documentar sua API é crucial para que outros desenvolvedores (e você mesmo no futuro) possam entender como usá-la. O Swagger (ou OpenAPI) é uma ferramenta popular para isso. Além disso, vamos testar manualmente nossas rotas usando `curl`.

---

### Adicionando Swagger à API

Primeiro, precisamos adicionar as dependências para o Swagger no nosso `Cargo.toml`. Abra o arquivo `Cargo.toml` e adicione as seguintes linhas na seção `[dependencies]`:

MOSTRAR EDITOR DE TEXTO: Abrindo `Cargo.toml`

MOSTRAR CRIACAO DE MODULO:
```toml
# Cargo.toml (adicionar)

tide-openapi = "0.2.0"
openapi-spec = "0.3.0"
```

Agora, vamos integrar o Swagger ao nosso `main.rs`. Abra o `src/main.rs` e adicione o código para configurar o Swagger. Você pode adicionar a função `setup_swagger` e chamá-la antes de `app.listen`.

MOSTRAR EDITOR DE TEXTO: Abrindo `src/main.rs`

MOSTRAR CRIACAO DA FUNCAO:
```rust
// src/main.rs (adicionar ao topo, após os 'mod' e 'use')
use tide_openapi::OpenApi;
use openapi_spec::OpenApiBuilder;

// ... (restante dos 'use' e 'mod')

// Função para configurar a documentação Swagger/OpenAPI
async fn setup_swagger(app: &mut tide::Server<State>) {
    let openapi = OpenApiBuilder::new()
        .title("Rust CRUD API") // Título da sua API
        .version("0.1.0") // Versão da sua API
        .description("Uma API CRUD simples construída com Rust e Tide.") // Descrição
        .build();
    
    // Define uma rota para o Swagger UI
    app.at("/api").get(OpenApi::new(openapi));
}

#[async_std::main]
async fn main() -> tide::Result<()> {
    // ... (código existente para criar 'state' e 'app')

    // Chama a função para configurar o Swagger
    setup_swagger(&mut app).await;

    // ... (restante do main, incluindo app.listen)
}
```

Para ver a documentação Swagger, inicie o servidor com `cargo run` e acesse `http://127.0.0.1:8080/api` no seu navegador. Você verá uma interface interativa com todos os seus endpoints!

---

### Testes Manuais

Agora vamos acessar o swagger e testar todas as rotas seguindo o seguinte roteiro:

*   [ ] **POST /data**: Crie um novo registro com `data1` (lista de strings) e `data2` (lista de números).
*   [ ] **GET /data**: Liste todos os registros e verifique se o que você criou está lá.
*   [ ] **GET /data/:id**: Consulte o registro específico pelo ID que você criou.
*   [ ] **PUT /data/:id**: Atualize o registro com novos valores para `data1` e `data2`.
*   [ ] **GET /data/:id**: Consulte novamente para confirmar a atualização.
*   [ ] **DELETE /data/:id**: Exclua o registro.
*   [ ] **GET /data**: Verifique se o registro foi removido da lista.

---

## **11. Fazendo Deploy: Subindo a API para Produção**

📌 _Subindo a API para produção._

Depois de desenvolver e testar sua API localmente, o próximo passo é colocá-la online para que outras pessoas possam acessá-la. Isso é chamado de _deploy_. Vamos usar a plataforma Railway para fazer isso de forma simples.

---

### Deploy com Railway

1.  **Crie uma conta**: Se você ainda não tem, crie uma conta gratuita em [railway.app](https://railway.app).
2.  **Instale o CLI do Railway**: O Railway tem uma ferramenta de linha de comando (CLI) que facilita o deploy. Abra seu terminal e instale-o (você precisa ter Node.js e npm instalados):

    MOSTRAR TERMINAL: `npm install -g @railway/cli`

    Depois de instalar, faça login na sua conta Railway pelo terminal:

    MOSTRAR TERMINAL: `railway login`

    Isso abrirá uma página no seu navegador para você autorizar o login.

---

### Deploy com Railway (cont.)

3.  **Configure e faça o deploy**: Navegue até a pasta raiz do seu projeto `rust-crud` no terminal. Agora, vamos inicializar o projeto Railway e fazer o deploy:

    MOSTRAR TERMINAL: `railway init`

    Este comando vai configurar seu projeto para o Railway. Siga as instruções na tela.

    MOSTRAR TERMINAL: `railway up`

    Este comando vai empacotar seu código Rust, enviá-lo para o Railway, que irá compilá-lo e colocá-lo online. O processo pode levar alguns minutos.

---

### Deploy com Railway (cont.)

4.  **Variáveis de Ambiente (se necessário)**: Se sua API precisar de variáveis de ambiente (como chaves de API, senhas de banco de dados, etc.), você pode adicioná-las no painel da Railway, na seção de configurações do seu projeto.

5.  **Acesse a URL**: Após o deploy ser concluído, o Railway fornecerá uma URL pública para sua API. Você pode acessá-la no navegador ou usar `curl` para testar sua API online!

*   **Dica**: Sempre verifique se o seu `Cargo.toml` e todas as dependências estão corretas e atualizadas antes de fazer o deploy. Isso evita erros de compilação no servidor.

---

## **12. Hands-on**

MOSTRAR TERMINAL: `cargo run`

MOSTRAR TERMINAL: `curl -X POST http://127.0.0.1:8080/data -H "Content-Type: application/json" -d '{"id": 1, "data1": ["item1", "item2"], "data2": [10, 20, 30]}'`

MOSTRAR TERMINAL: `curl http://127.0.0.1:8080/data`

MOSTRAR TERMINAL: `curl -X PUT http://127.0.0.1:8080/data/1 -H "Content-Type: application/json" -d '{"id": 1, "data1": ["novo_item"], "data2": [40, 50, 60]}'`

MOSTRAR TERMINAL: `curl http://127.0.0.1:8080/data/1`

MOSTRAR TERMINAL: `curl -X DELETE http://127.0.0.1:8080/data/1`

MOSTRAR TERMINAL: `curl http://127.0.0.1:8080/data`

Nesta seção, você deve demonstrar ao vivo a criação, leitura, atualização e exclusão de dados usando os comandos `curl` que aprendemos. Mostre o servidor rodando em um terminal e os comandos `curl` em outro, explicando cada passo e o resultado esperado.

---

## **13. Recapitulação**

Chegamos ao final do nosso segundo dia de Workshop! Vamos revisar os pontos mais importantes que cobrimos:

1.  **Gerenciamento de Memória em Rust**: Entendemos as 3 leis fundamentais do _ownership_ (cada valor tem um dono, apenas um dono mutável ou vários imutáveis, valores são movidos ou emprestados) que garantem a segurança de memória sem a necessidade de um coletor de lixo.
2.  **Erros Comuns de Ownership**: Vimos como identificar e resolver problemas como _use-after-move_, conflitos do _borrow checker_ e _lifetimes_ incorretos, que são desafios iniciais ao aprender Rust.
3.  **O que é CRUD?**: Definimos o padrão CRUD (Create, Read, Update, Delete) como as operações essenciais para gerenciar dados em qualquer aplicação, e a relação entre cliente e servidor em uma API.
4.  **Runtimes Assíncronos**: Exploramos a importância da programação assíncrona em Rust com `async` e `await`, e comparamos os runtimes `Tokio` (robusto e performático) e `async-std` (simples e fácil de usar), escolhendo o último para nosso projeto.
5.  **Frameworks Web**: Discutimos o `Hyper` como uma base HTTP de baixo nível e o `Tide` como um _framework_ de alto nível, mais produtivo para construir APIs, que foi nossa escolha para este workshop.
6.  **Modelo de Dados**: Definimos nosso modelo de dados `DataEntry` com um `id` (`u32`), `data1` (`Vec<String>`) e `data2` (`Vec<u8>`), e como o `Arc<Mutex<HashMap<u32, DataEntry>>>` é usado para gerenciar o estado da aplicação de forma segura para concorrência.
7.  **Rotas CRUD Implementadas**: Quebramos a implementação das rotas CRUD em arquivos separados (`create.rs`, `read.rs`, `update.rs`, `delete.rs`) para melhor organização do código, e conectamos tudo no `main.rs`.
8.  **Swagger e Testes Manuais**: Aprendemos a documentar nossa API usando Swagger/OpenAPI com `tide-openapi` e `openapi-spec`, e como realizar testes manuais em cada endpoint usando `curl` para validar o comportamento da API.
9.  **Fazendo Deploy**: Vimos como subir nossa API para a nuvem usando a plataforma Railway, desde a instalação do CLI até o comando `railway up` para colocar a aplicação em produção.

Você construiu uma API CRUD completa em Rust! Isso é um feito e tanto!

---

## **14. Lição de Casa**

Para consolidar o que você aprendeu, tenho alguns desafios para você:

### Desafio de Aprendizagem

*   **Validação no Endpoint POST**: Modifique o _handler_ `create_data` para garantir que o campo `data2` (o `Vec<u8>`) não seja vazio. Se for, retorne um erro apropriado (por exemplo, status 400 Bad Request).
*   **Testes Manuais e Documentação**: Certifique-se de que todos os endpoints (Create, Read, Update, Delete) estão completamente testados manualmente com `curl` e que a documentação Swagger reflete todas as funcionalidades e possíveis respostas.

### Desafio de Carreira

*   **Compartilhe seu aprendizado**: Faça um post no LinkedIn sobre o que você construiu hoje no Workshop: Road to Meridian, usando a hashtag `#WorkshopRust`. Mostre sua API CRUD em Rust!

### Desafio de Comunidade

*   **Mostre seu ambiente de codificação**: Entre no nosso Discord e poste uma foto do seu ambiente de codificação! Queremos ver onde a mágica acontece!

### Recursos Adicionais

Para continuar seus estudos, recomendo:

*   [Documentação Oficial do Rust](https://www.rust-lang.org/learn): O site oficial do Rust tem uma documentação excelente.
*   [Documentação Tide](https://docs.rs/tide): A documentação oficial do framework Tide.
*   [The Rust Book](https://doc.rust-lang.org/book/): Um livro completo e gratuito sobre Rust, ideal para aprofundar seus conhecimentos.

---

## **15. Próxima Aula**

**06/05 – Dia 3: WebAssembly com Rust**

- Amanhã, vamos dar um passo ainda maior: transformar nosso código Rust em **WebAssembly** para que ele possa rodar diretamente no navegador web! Prepare-se para ver o Rust em ação no frontend.

_"Não esqueça: Aula ao vivo amanhã, 19h, no YouTube. Traga suas dúvidas!"_


