---
marp: true
theme: gaia
---

# **Workshop: Road to Meridian**

## **Dia 1: Bibliotecas em Rust**

---

## **1. Abertura**

**Hello World!**

Sejam todos bem-vindos ao **Workshop: Road to Meridian**!

Este é o primeiro dia do nosso intensivão de 3 dias para dominar o básico do Rust, a linguagem que combina segurança, performance e produtividade.

Hoje vamos criar nossa primeira **Biblioteca em Rust** e explorar os fundamentos da linguagem!

---

## **2. Programação**

1. **O que é Rust?**: Fundamentos e por que usá-lo.
2. **Compilador + Ambiente**: Configurando `cargo`, `rustc` e `rustup`.
3. **Hello World**: Nosso primeiro código Rust.
4. **Tipos, Funções e Módulos**: Construindo nossa Biblioteca.
5. **Testes**: Validando nossa Biblioteca com testes automatizados.
6. **Crates.io**: Criando conta e publicando nossa Biblioteca.
7. **Usando Bibliotecas**: Baixando e integrando crates.

---

## **3. O que é Rust?**

📌 _Rust: Segurança, performance e produtividade._

- **Definição**: Rust é uma linguagem de programação de sistemas focada em segurança de memória, concorrência e desempenho.
- **Por que Rust?**:
  - **Zero-cost abstractions**: Performance próxima de C/C++.
  - **Ownership**: Evita os erros mais comuns de memória.
  - **Ecossistema**: Usada em projetos como Firefox, Solana, Polkadot e Stellar.

---

## **4. Compilador + Ambiente**

⚡ _Ferramentas para começar: rustup, cargo e rustc._

- **rustup**: Gerenciador de versões do Rust.
- **rustc**: Compilador oficial do Rust.
- **cargo**: Gerenciador de pacotes e ferramenta de build.

---

### Instalação

```bash
# Instalar rustup (Linux/MacOS/Windows via WSL)
curl --proto \'=https\' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

---

### Verificação da Instalação

```bash
# Verificar instalação
rustc --version
cargo --version
```

---

## **5. Hello World**

🛠️ _Compilando um programa básico diretamente com rustc._

```rust
// hello.rs
fn main() {
    println!("Hello, World!");
}
```

---

### Compilando e Executando

```bash
# Compilar com rustc
rustc hello.rs

# Executar o binário
./hello
```

**Explicação**:

1. Criamos um arquivo `hello.rs` com `println!` que é uma macro para impressão no console.
2. Usamos `rustc` para compilar diretamente, gerando um executável.
3. E executamos o arquivo com `./hello` (ou `.\hello.exe` no Windows).

---

## **6. Tipos, Funções e Módulos**

🛠️ _Criando uma biblioteca com cargo para operações com u32._

### Criando o Projeto

```bash
cargo new --lib calculator
```

---

### Estrutura de Pastas

```
.
├── Cargo.toml   # arquivo de configuração do Rust
└── src
    └── lib.rs   # arquivo de código principal da biblioteca
```

---

### Tipos em Rust

- `u8`, `u32`, `u64` (inteiros sem sinal)
- `i8`, `i32`, `i64` (inteiros com sinal)
- `String` (texto mutável)
- `&str` (fatia de texto imutável)
- `Vec<T>` (vetor, lista de elementos, ex: `Vec<u8>`)

---

### Assinatura de Funções

- `fn`: Palavra-chave para definir função
- `->`: Indica o tipo de retorno da função
- `return;`: Retorno explícito (opcional na última expressão)

---

### Módulos em Rust

Módulos servem para agrupar funções com um propósito comum. Podem estar dentro do mesmo arquivo ou em arquivos separados.

```rust
// módulo dentro do mesmo arquivo
mod saudacoes {
    pub fn ola() {
        println!("Olá!");
    }
}

fn main() {
    saudacoes::ola();
}
```

Mas normalmente usamos um arquivo para cada módulo, como vamos fazer a seguir com `calc1.rs` e `calc2.rs`.

---

### Organizando o Código

- Criar `src/calc1.rs` para soma e subtração
- Criar `src/calc2.rs` para multiplicação e divisão

---

### `src/calc1.rs`

```rust
// src/calc1.rs
pub fn add(a: u32, b: u32) -> u32 {
    a + b
}

pub fn sub(a: u32, b: u32) -> u32 {
    if a < b {
        0 // Retorna 0 se o resultado for negativo para u32
    } else {
        a - b
    }
}
```

---

### `src/calc2.rs`

```rust
// src/calc2.rs
pub fn multiply(a: u32, b: u32) -> u32 {
    a * b
}

pub fn rate(a: u32, b: u32) -> u32 {
    if b == 0 {
        0 // Retorna 0 se houver divisão por zero
    } else {
        a / b
    }
}
```

---

### `src/lib.rs`: Expondo Módulos

```rust
// src/lib.rs
pub mod calc1;
pub mod calc2;
```

---

### Usando a Biblioteca: `src/main.rs`

```rust
// src/main.rs
use calculator::calc1::{add, sub};
use calculator::calc2::{multiply, rate};

fn main() {
    println!("\n--- Testando a Biblioteca Calculadora ---");

    let c = add(3, 8);
    println!("Soma de 3 + 8: {}", c);

    /// programing motherf*

    println!("\n--- Fim dos Testes Manuais ---");
}
```

---

## **7. Testes Automatizados**

⚡ _Escrevendo testes automatizados para a calculadora._

### `src/lib.rs`: Adicionando Testes

```rust
// src/lib.rs (continuação)
#[cfg(test)]
mod tests {
    use super::calc1::{add, sub};
    use super::calc2::{multiply, rate};

    #[test]
    fn test_add() {
        assert_eq!(add(10, 20), 30);
        assert_eq!(add(u32::MAX, 1), u32::MAX); // Overflow para u32 satura no máximo
    }

    /// programing motherf*
}
```

---

### Rodando os Testes

```bash
cargo test
```

- **Explicação**:
  - `#[cfg(test)]`: Define um módulo que só compila para testes.
  - `#[test]`: Marca funções de teste.
  - `assert_eq!`: Macro para verificar igualdade.
  - Rodar testes: `cargo test`.

---

## **8. Crates.io: Criando Conta e Publicando**

📌 _Publicando a biblioteca calculadora no crates.io._

### Criar Conta e Autenticar

1. Acesse [crates.io](https://crates.io) e crie uma conta.
2. Gere um token de API em `Account Settings > API Tokens`.
3. Autentique-se localmente:

```bash
cargo login <seu-token>
```

---

### Configurar `Cargo.toml`

```toml
# Cargo.toml
[package]
name = "calculator-olivmath"
version = "0.1.0"
edition = "2021"
description = "Biblioteca simples para operações com u32"
license = "MIT"
```

---

### Publicar no Crates.io

```bash
# Verificar antes de publicar
cargo package

# Publicar no crates.io
cargo publish
```

- **Dica**: Use um nome único para o crate (ex.: `calculator-seu-nome`).

---

Sim! Como você está usando **Marp**, o ideal é quebrar em **vários slides curtos**, cada um com foco único, para **guiar o aluno passo a passo**.

Aqui está a sua seção “Baixando e Usando Bibliotecas” **reorganizada em slides menores e didáticos**, já formatada para Marp:

---

## **9. Baixando e Usando Bibliotecas**

🛠️ _Integrando a biblioteca publicada no Crates.io_

Vamos criar um novo projeto que usa a biblioteca `calculator-olivmath`, publicada no Crates.io.

---

### 1. Criando um Novo Projeto

```bash
cargo new interactive_calculator
cd interactive_calculator
```

---

### 2. Adicionando a Biblioteca no `Cargo.toml`

```toml
# interactive_calculator/Cargo.toml
[dependencies]
calculator-olivmath = "0.1.0"
```

---

### 3. Estrutura Inicial do Projeto

```
interactive_calculator/
├── Cargo.toml
└── src
    └── main.rs
```

---

### 4. Importando Funções da Biblioteca

```rust
use calculator_olivmath::calc1::{add, sub};
use calculator_olivmath::calc2::{multiply, rate};
```

---

### 5. Lendo a Operação do Usuário

```rust
use std::io;

println!("Escolha a operação (+, -, *, /):");
let mut operation = String::new();
io::stdin().read_line(&mut operation).expect("Erro");
let operation = operation.trim();
```

---

### 6. Lendo os Números

```rust
println!("Digite o primeiro número:");
let mut num_a_str = String::new();
io::stdin().read_line(&mut num_a_str).expect("Erro");
let num_a: u32 = num_a_str.trim().parse().expect("Número inválido");

println!("Digite o segundo número:");
let mut num_b_str = String::new();
io::stdin().read_line(&mut num_b_str).expect("Erro");
let num_b: u32 = num_b_str.trim().parse().expect("Número inválido");
```

---

### 7. Executando o Cálculo

```rust
let result = match operation {
    "+" => add(num_a, num_b),
    "-" => sub(num_a, num_b),
    "*" => multiply(num_a, num_b),
    "/" => rate(num_a, num_b),
    _ => {
        println!("Operação inválida!");
        return;
    }
};
```

---

### 8. Exibindo o Resultado

```rust
println!("Resultado: {} {} {} = {}", num_a, operation, num_b, result);
```

---

### 9. Executando o Programa

```bash
cargo run
```

Digite os dados no terminal e veja o resultado calculado com a **sua biblioteca publicada!**

---

## **10. Recapitulação**

1. **Rust**: Linguagem segura, performática e produtiva, ideal para sistemas de alta confiabilidade.
2. **Ferramentas Essenciais**: `rustup` (gerenciador de versões), `cargo` (gerenciador de pacotes e build), e `rustc` (compilador) são a base para o desenvolvimento em Rust.
3. **Hello World**: O primeiro passo em Rust, demonstrando a compilação e execução de um programa simples.
4. **Tipos de Dados**: Entendimento de tipos como `u32` (inteiros sem sinal), `String` (textos mutáveis), `&str` (fatias de texto imutáveis).
5. **Funções**: Como definir e usar funções (`fn`, `->`, `return;`) para organizar blocos de código reutilizáveis.
6. **Módulos**: A importância da organização do código em módulos (`calc1.rs`, `calc2.rs`) para modularidade e evitar conflitos de nomes.
7. **Criação de Bibliotecas**: O processo de criar uma biblioteca Rust com `cargo new --lib` e como ela pode ser estruturada.
8. **Testes Automatizados**: A prática de escrever testes (`#[test]`, `assert_eq!`) para garantir a correção e a robustez do código, executados com `cargo test`.
9. **Crates.io**: O processo de publicação de uma biblioteca no registro oficial do Rust e como consumir bibliotecas de terceiros em seus próprios projetos.
10. **Interação com o Usuário**: Como criar programas que recebem entrada do usuário (`std::io`) e utilizam as funções da biblioteca para processar dados.

---

## **11. Lição de Casa**

### Desafio de Aprendizagem

- Adicione uma função de potência e seu inverso, logaritmo à biblioteca `calculator` em `calc3.rs`.
- Escreva testes e publique a nova versão (0.2.0) no crates.io.

### Desafio de Carreira

- Post no LinkedIn e Twitter com #road2meridian (1/3)
- Marque a Stellar
- Marque a NearX

**Recursos:**

- [Documentação Rust](https://www.rust-lang.org/learn)
- [Crates.io](https://crates.io)
- [The Rust Book](https://doc.rust-lang.org/book/)

---

## **12. Próxima Aula**

**24/07 – Dia 2: CRUD em Rust**

- Vamos criar um sistema CRUD completo com Rust.

_"Não esqueça: Aula ao vivo amanhã, 19h, no YouTube. Traga suas dúvidas!"_
