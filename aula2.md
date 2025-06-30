---
marp: true
theme: gaia
---

# **Flashbootcamp: Rust – Dia 2: CRUD em Rust**

- data: 05/05
- prof: Lucas Oliveira

## **1. Abertura**

**Hello World!**

Sejam todos bem-vindos ao segundo dia do **Flashbootcamp: Rust**!

Estamos no intensivão de 3 dias para dominar o Rust. Hoje, vamos construir um sistema **CRUD** completo, explorando o gerenciamento de memória, runtimes assíncronos e criando uma API com o framework **Tide**.

Preparados para botar a mão na massa? Vamos ao **GRANDE CÓDIGO**!

---

## **2. Programação**

1. **Gerenciamento de Memória**: As 3 leis do Rust
2. **Erros Comuns**: Armadilhas do gerenciamento de memória
3. **O que é CRUD?**: Entendendo cliente e servidor
4. **Runtimes Assíncronos**: Básico, tokio vs. async-std, e Hyper
5. **Frameworks**: Hyper (low-level) vs. Tide (high-level)
6. **Modelo de Dados**: Definindo `MyData` como `Vec<u8>`
7. **Rotas CRUD**: Create, Read, Update, Delete
8. **Swagger e Testes Manuais**: Documentação e validação
9. **Fazendo Deploy**: Subindo a API para produção

---

## **3. Gerenciamento de Memória**

📌 _Rust: Segurança de memória sem garbage collector._

Rust usa o conceito de **ownership** para gerenciar memória, garantindo segurança e desempenho. As **3 leis** são o coração do sistema:

1. **Cada valor tem um dono (owner)**: Todo valor em Rust tem uma variável que é sua "dona". Quando o dono sai de escopo, o valor é liberado.
2. **Apenas um dono mutável por vez**: Um valor pode ter um dono mutável (`mut`) ou vários donos imutáveis (`&`), mas nunca ambos ao mesmo tempo.
3. **Valores são movidos ou emprestados**: Ao passar um valor, ele é movido (transferindo posse) ou emprestado (com referências `&` ou `&mut`).

### Exemplo

```rust
fn main() {
    let s1 = String::from("Hello"); // s1 é o dono
    let s2 = s1; // s1 move a posse para s2
    // println!("{}", s1); // ERRO: s1 não é mais válido
    println!("{}", s2); // OK: s2 é o novo dono
}
```

---

## **4. Erros Comuns em Rust**

⚡ _Armadilhas do gerenciamento de memória._

1. **Use-after-move**:
   - Erro: Tentar usar um valor após sua posse ser movida.
   - Solução: Use referências (`&`) ou clone o valor com `.clone()`.

```rust
let s1 = String::from("Hello");
let s2 = s1; // Move a posse
// println!("{}", s1); // Erro: "value used after move"
let s3 = s2.clone(); // Cria uma cópia
println!("s2: {}, s3: {}", s2, s3); // OK
```

2. **Borrow checker conflitos**:
   - Erro: Tentar ter múltiplas referências mutáveis ou misturar mutáveis com imutáveis.
   - Solução: Estruture o código para respeitar as regras de borrowing.

```rust
let mut x = 10;
let r1 = &mut x; // Primeira referência mutável
// let r2 = &mut x; // Erro: "cannot borrow as mutable more than once"
println!("{}", r1);
```

3. **Lifetimes incorretos**:
   - Erro: Referências que vivem menos que o necessário.
   - Solução: Use anotações de lifetime (`'a`) ou reestruture o código.

---

## **5. O que é CRUD?**

🛠️ _CRUD: Create, Read, Update, Delete._

- **Definição**: CRUD é um padrão para gerenciar dados em aplicações, representando as operações básicas:
  - **Create**: Criar novos registros.
  - **Read**: Consultar registros existentes.
  - **Update**: Atualizar registros.
  - **Delete**: Remover registros.
- **Cliente e Servidor**:
  - **Cliente**: Interface (ex.: browser, app) que faz requisições HTTP (GET, POST, etc.).
  - **Servidor**: API que processa requisições e gerencia dados (ex.: banco de dados ou memória).

---

## **6. Runtimes Assíncronos**

📌 _Programação assíncrona em Rust._

### Básico
- Rust suporta programação assíncrona com `async` e `await`, permitindo operações não bloqueantes (ex.: requisições HTTP, I/O).
- Um **runtime** é necessário para executar código assíncrono, pois Rust não tem um runtime embutido na biblioteca padrão.

### Tokio vs. async-std
- **Tokio**: Runtime assíncrono mais popular, robusto e amplamente usado (ex.: em Hyper, Axum). Oferece mais recursos, mas é mais complexo.
  - Ideal para: Projetos complexos, alto desempenho.
- **async-std**: Runtime mais leve, inspirado na biblioteca padrão do Rust. Mais simples, mas com menos funcionalidades avançadas.
  - Ideal para: Projetos menores, aprendizado.

### Apontando para Hyper
- **Hyper**: Biblioteca low-level para HTTP, usada como base por frameworks como Tide e Axum. Oferece controle total, mas exige mais código manual.

---

## **7. Frameworks**

⚡ _Hyper: a base de tudo. Tide: nosso escolhido._

- **Hyper**: Biblioteca low-level para HTTP, usada como base para frameworks web em Rust. Extremamente performática, mas exige configuração manual.
- **Tide**: Framework high-level, inspirado no Express.js, construído sobre o Hyper. Oferece APIs simples para rotas, middlewares e JSON. **Usaremos Tide** por sua facilidade e produtividade.

### Configurando o Tide

```bash
cargo new rust-crud
cd rust-crud
# Adicionar dependências ao Cargo.toml
[dependencies]
tide = "0.16.0"
async-std = { version = "1.12.0", features = ["attributes"] }
serde = { version = "1.0", features = ["derive"] }
serde_json = "1.0"
```

### Hello World com Tide

```rust
// src/main.rs
#[async_std::main]
async fn main() -> tide::Result<()> {
    let mut app = tide::new();
    app.at("/").get(|_| async { Ok("Hello, World!") });
    app.listen("127.0.0.1:8080").await?;
    Ok(())
}
```

- **Explicação**:
  - Criamos uma API simples com Tide que responde "Hello, World!" na rota `/`.
  - Usamos `async-std` como runtime.
  - Rode com `cargo run` e acesse `http://127.0.0.1:8080`.

---

## **8. Modelo de Dados**

🛠️ _Definindo o modelo de dados para o CRUD._

Vamos salvar uma lista simples de números que vamos chamar de `MyData`, do tipo `Vec<u8>`. Cada entrada será identificada por um ID (`u32`) e associada a uma lista de números.

```rust
type MyData = Vec<u8>;
```

- **Exemplo**: `{ id: 1, data: [10, 20, 30] }` representa uma entrada com ID 1 e uma lista de números `u8`.

---

## **9. Rotas CRUD**

🛠️ _Implementando um CRUD com Tide e HashMap._

### Estrutura do Projeto

```rust
// src/main.rs
use tide::Request;
use serde::{Deserialize, Serialize};
use std::sync::{Arc, Mutex};
use std::collections::HashMap;

// Modelo de dados
type MyData = Vec<u8>;
#[derive(Serialize, Deserialize, Clone)]
struct DataEntry {
    id: u32,
    data: MyData,
}

type State = Arc<Mutex<HashMap<u32, MyData>>>;

#[async_std::main]
async fn main() -> tide::Result<()> {
    let state = Arc::new(Mutex::new(HashMap::new()));
    let mut app = tide::with_state(state);
    
    // Rotas CRUD
    app.at("/data").post(create_data);
    app.at("/data").get(read_all_data);
    app.at("/data/:id").get(read_data);
    app.at("/data/:id").put(update_data);
    app.at("/data/:id").delete(delete_data);

    app.listen("127.0.0.1:8080").await?;
    Ok(())
}

// Create
async fn create_data(mut req: Request<State>) -> tide::Result {
    let entry: DataEntry = req.body_json().await?;
    let mut state = req.state().lock().unwrap();
    state.insert(entry.id, entry.data.clone());
    Ok(tide::Body::from_json(&entry)?.into())
}

// Read (todos)
async fn read_all_data(req: Request<State>) -> tide::Result {
    let state = req.state().lock().unwrap();
    let result: Vec<DataEntry> = state
        .iter()
        .map(|(id, data)| DataEntry { id: *id, data: data.clone() })
        .collect();
    Ok(tide::Body::from_json(&result)?.into())
}

// Read (um item)
async fn read_data(req: Request<State>) -> tide::Result {
    let id: u32 = req.param("id")?.parse()?;
    let state = req.state().lock().unwrap();
    match state.get(&id) {
        Some(data) => {
            let entry = DataEntry { id, data: data.clone() };
            Ok(tide::Body::from_json(&entry)?.into())
        }
        None => Ok(tide::StatusCode::NotFound.into()),
    }
}

// Update
async fn update_data(mut req: Request<State>) -> tide::Result {
    let id: u32 = req.param("id")?.parse()?;
    let entry: DataEntry = req.body_json().await?;
    let mut state = req.state().lock().unwrap();
    if state.contains_key(&id) {
        state.insert(id, entry.data.clone());
        Ok(tide::Body::from_json(&entry)?.into())
    } else {
        Ok(tide::StatusCode::NotFound.into())
    }
}

// Delete
async fn delete_data(req: Request<State>) -> tide::Result {
    let id: u32 = req.param("id")?.parse()?;
    let mut state = req.state().lock().unwrap();
    if state.remove(&id).is_some() {
        Ok(tide::StatusCode::Ok.into())
    } else {
        Ok(tide::StatusCode::NotFound.into())
    }
}
```

- **Explicação**:
  - Usamos `HashMap<u32, MyData>` para armazenar dados, onde `MyData` é `Vec<u8>`.
  - Cada entrada é identificada por um `id` (`u32`) e contém uma lista de números `u8`.
  - `Arc<Mutex<>>` garante concorrência segura.
  - Rotas: POST `/data` (create), GET `/data` (read all), GET `/data/:id` (read one), PUT `/data/:id` (update), DELETE `/data/:id` (delete).

---

## **10. Swagger e Testes Manuais**

⚡ _Documentando e testando a API._

### Adicionando Swagger

```bash
# Adicionar dependência ao Cargo.toml
[dependencies]
tide-openapi = "0.2.0"
openapi-spec = "0.3.0"
```

```rust
// src/main.rs (adicionar ao topo)
use tide_openapi::OpenApi;

// Configurar Swagger
async fn setup_swagger(app: &mut tide::Server<State>) {
    let openapi = openapi_spec::OpenApiBuilder::new()
        .title("Rust CRUD API")
        .version("0.1.0")
        .build();
    app.at("/swagger").get(OpenApi::new(openapi));
}

// No main, antes de app.listen
setup_swagger(&mut app).await;
```

- Acesse `http://127.0.0.1:8080/swagger` para ver a documentação.

### Testes Manuais com curl

```bash
# Create
curl -X POST http://127.0.0.1:8080/data -H "Content-Type: application/json" -d '{"id": 1, "data": [10, 20, 30]}'

# Read (todos)
curl http://127.0.0.1:8080/data

# Read (um item)
curl http://127.0.0.1:8080/data/1

# Update
curl -X PUT http://127.0.0.1:8080/data/1 -H "Content-Type: application/json" -d '{"id": 1, "data": [40, 50, 60]}'

# Delete
curl -X DELETE http://127.0.0.1:8080/data/1
```

- **Explicação**:
  - `tide-openapi` gera documentação Swagger automaticamente.
  - Testes com `curl` validam as rotas CRUD.

---

## **11. Fazendo Deploy**

📌 _Subindo a API para produção._

### Deploy com Railway

1. Crie uma conta em [railway.app](https://railway.app).
2. Instale o CLI do Railway:

```bash
npm install -g @railway/cli
railway login
```

3. Configure o deploy:

```bash
# Inicializar projeto Railway
railway init

# Fazer deploy
railway up
```

4. Adicione variáveis de ambiente (se necessário) no painel da Railway.
5. Acesse a URL gerada pelo Railway para testar a API.

- **Dica**: Certifique-se de que `Cargo.toml` e dependências estão corretos antes do deploy.

---

## **12. Hands-on**

```js
// PROGRAMMING, MOTHERF****
```

---

## **13. Recapitulação**

1. Gerenciamento de memória = 3 leis (ownership, borrowing, lifetimes).
2. Erros comuns = use-after-move, borrow checker, lifetimes.
3. CRUD = padrão para gerenciar dados.
4. Runtimes = Tokio (robusto), async-std (leve).
5. Hyper = base low-level; Tide = high-level.
6. Modelo `MyData` = `Vec<u8>` em `HashMap`.
7. Swagger = documentação; Railway = deploy.

---

## **14. Lição de Casa**

### Desafio de Aprendizagem

- Adicione validação para garantir que `MyData` não seja vazio no endpoint POST.
- Escreva testes manuais para todos os endpoints e documente com Swagger.

### Desafio de Carreira

- Post no LinkedIn com #FlashbootcampRust (2/3)

### Desafio de Comunidade

- 📷 Poste uma foto do seu ambiente de codificação! (discord)

**Recursos:**

- [Documentação Rust](https://www.rust-lang.org/learn)
- [Documentação Tide](https://docs.rs/tide)
- [The Rust Book](https://doc.rust-lang.org/book/)

---

## **15. Próxima Aula**

**06/05 – Dia 3: WebAssembly com Rust**

- Vamos transformar nosso código Rust em WebAssembly para rodar no navegador!

_"Não esqueça: Aula ao vivo amanhã, 19h, no YouTube. Traga suas dúvidas!"_
