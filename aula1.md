---
marp: true
theme: gaia
---

# **Flashbootcamp: Rust – Dia 1: Lib em Rust**

- data: 04/05
- prof: Lucas Oliveira

## **1. Abertura**

**Hello World!**

Sejam todos bem-vindos ao **Flashbootcamp: Rust**!

Este é o primeiro dia do nosso intensivão de 3 dias para dominar o básico do Rust, a linguagem que combina segurança, performance e produtividade.

Hoje vamos criar nossa primeira **biblioteca em Rust** e explorar os fundamentos da linguagem!

---

## **2. Programação**

1. **O que é Rust?**: Fundamentos e por que usá-lo
2. **Compilador + Ambiente**: Configurando cargo, rustc e rustup
3. **Hello World**: Um programa simples compilado com rustc
4. **Funções e Módulos**: Biblioteca calculadora para u8 em `lib.rs`
5. **Testes**: Escrevendo e rodando testes automatizados
6. **Crates.io**: Criando conta e publicando uma biblioteca
7. **Usando Bibliotecas**: Baixando e integrando crates

---

## **3. O que é Rust?**

📌 _Rust: Segurança, performance e produtividade._

- **Definição**: Rust é uma linguagem de programação de sistemas focada em segurança de memória, concorrência e desempenho.
- **Por que Rust?**:
  - **Zero-cost abstractions**: Performance próxima de C/C++.
  - **Ownership**: Evita erros como null pointers e data races.
  - **Ecossistema**: Usada em projetos como Firefox, Solana e ferramentas modernas.
- **Ideal para**: Projetos que exigem alta confiabilidade e eficiência.

---

## **4. Compilador + Ambiente**

⚡ _Ferramentas para começar: rustup, cargo e rustc._

- **rustup**: Gerenciador de versões do Rust.
- **rustc**: Compilador oficial do Rust.
- **cargo**: Gerenciador de pacotes e ferramenta de build.

### Instalação

```bash
# Instalar rustup (Linux/MacOS/Windows via WSL)
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# Verificar instalação
rustc --version
cargo --version
```

---

## **5. Hello World: Programa Simples com rustc**

🛠️ _Compilando um programa básico diretamente com rustc._

```rust
// hello.rs
fn main() {
    let greeting: &str = "Hello, World!";
    println!("{}", greeting);
}
```

### Compilando e Executando

```bash
# Compilar com rustc
rustc hello.rs

# Executar o binário
./hello  # Linux/MacOS
.\hello.exe  # Windows
```

- **Explicação**:
  - Criamos um arquivo `hello.rs` com um programa simples.
  - Usamos `rustc` para compilar diretamente, gerando um executável.
  - `println!` é uma macro para impressão no console.

---

## **6. Funções e Módulos: Biblioteca Calculadora u8**

🛠️ _Criando uma biblioteca com cargo para operações com u8._

### Criando o Projeto

```bash
cargo new --lib calculator
cd calculator
```

### Código da Biblioteca

```rust
// src/lib.rs
pub mod operations {
    /// Soma dois números u8, retorna u8 ou erro em caso de overflow.
    pub fn add(a: u8, b: u8) -> Result<u8, &'static str> {
        a.checked_add(b).ok_or("Overflow na soma")
    }

    /// Subtrai dois números u8, retorna u8 ou erro em caso de underflow.
    pub fn subtract(a: u8, b: u8) -> Result<u8, &'static str> {
        a.checked_sub(b).ok_or("Underflow na subtração")
    }

    /// Multiplica dois números u8, retorna u8 ou erro em caso de overflow.
    pub fn multiply(a: u8, b: u8) -> Result<u8, &'static str> {
        a.checked_mul(b).ok_or("Overflow na multiplicação")
    }

    /// Divide dois números u8, retorna u8 ou erro em caso de divisão por zero.
    pub fn divide(a: u8, b: u8) -> Result<u8, &'static str> {
        if b == 0 {
            return Err("Divisão por zero");
        }
        Ok(a / b)
    }
}
```

### Usando a Biblioteca

```rust
// src/main.rs
use calculator::operations::{add, subtract, multiply, divide};

fn main() {
    match add(100, 50) {
        Ok(result) => println!("Soma: {}", result),
        Err(e) => println!("Erro: {}", e),
    }
    match subtract(100, 50) {
        Ok(result) => println!("Subtração: {}", result),
        Err(e) => println!("Erro: {}", e),
    }
    match multiply(10, 20) {
        Ok(result) => println!("Multiplicação: {}", result),
        Err(e) => println!("Erro: {}", e),
    }
    match divide(100, 2) {
        Ok(result) => println!("Divisão: {}", result),
        Err(e) => println!("Erro: {}", e),
    }
}
```

- **Explicação**:
  - Criamos um projeto de biblioteca com `cargo new --lib`.
  - Definimos um módulo `operations` com funções para soma, subtração, multiplicação e divisão de `u8`.
  - Usamos `checked_*` para lidar com overflow/underflow e retornamos `Result` para gerenciar erros.
  - Adicionamos um `main.rs` para testar a biblioteca.

---

## **7. Testes**

⚡ _Escrevendo testes automatizados para a calculadora._

```rust
// src/lib.rs (continuação)
#[cfg(test)]
mod tests {
    use super::operations::{add, subtract, multiply, divide};

    #[test]
    fn test_add() {
        assert_eq!(add(10, 20), Ok(30));
        assert_eq!(add(255, 1), Err("Overflow na soma"));
    }

    #[test]
    fn test_subtract() {
        assert_eq!(subtract(30, 20), Ok(10));
        assert_eq!(subtract(10, 20), Err("Underflow na subtração"));
    }

    #[test]
    fn test_multiply() {
        assert_eq!(multiply(5, 4), Ok(20));
        assert_eq!(multiply(100, 3), Err("Overflow na multiplicação"));
    }

    #[test]
    fn test_divide() {
        assert_eq!(divide(20, 5), Ok(4));
        assert_eq!(divide(10, 0), Err("Divisão por zero"));
    }
}
```

- **Explicação**:
  - `#[cfg(test)]`: Define um módulo de testes.
  - `#[test]`: Marca funções de teste.
  - Testamos cada operação com casos de sucesso e erro.
  - Rodar testes: `cargo test`.

---

## **8. Crates.io: Criando Conta e Publicando**

📌 _Publicando a biblioteca calculadora no crates.io._

### Criar Conta

1. Acesse [crates.io](https://crates.io) e crie uma conta.
2. Gere um token de API em `Account Settings > API Tokens`.
3. Autentique-se localmente:

```bash
cargo login <seu-token>
```

### Configurar e Publicar

```toml
# Cargo.toml
[package]
name = "u8-calculator"
version = "0.1.0"
edition = "2021"
description = = "Biblioteca simples para operações com u8"
license = "MIT"
```

```bash
# Verificar antes de publicar
cargo package

# Publicar no crates.io
cargo publish
```

- **Dica**: Use um nome único para o crate (ex.: `u8-calculator-<seu-nome>`).

---

## **9. Baixando e Usando Bibliotecas**

🛠️ _Integrando a biblioteca publicada._

### Exemplo: Usando a biblioteca `u8-calculator`

```toml
# Cargo.toml de outro projeto
[dependencies]
u8-calculator = "0.1.0"
```

```rust
// main.rs
use u8_calculator::operations::add;

fn main() {
    match add(50, 25) {
        Ok(result) => println!("Soma: {}", result),
        Err(e) => println!("Erro: {}", e),
    }
}
```

- **Explicação**:
  - Adicione a dependência no `Cargo.toml`.
  - Use `cargo build` para baixar e compilar.
  - Importe e use as funções da biblioteca.

---

## **10. Hands-on**

```js
// PROGRAMMING, MOTHERF****
```

---

## **11. Recapitulação**

1. Rust = linguagem segura e performática.
2. `rustup`, `cargo`, `rustc` = ferramentas essenciais.
3. `rustc` = compilação direta de programas simples.
4. Biblioteca `u8-calculator` = operações seguras com u8.
5. Testes = garantia de qualidade.
6. Crates.io = compartilhamento de código.

---

## **12. Lição de Casa**

### Desafio de Aprendizagem

- Adicione uma função de potência (`pow`) à biblioteca `u8-calculator`.
- Escreva testes e publique a nova versão no crates.io.

### Desafio de Carreira

- Post no LinkedIn com #FlashbootcampRust (1/3)

### Desafio de Comunidade

- 🎮 Poste o jogo que você mais jogou em 2024! (discord)

**Recursos:**

- [Documentação Rust](https://www.rust-lang.org/learn)
- [Crates.io](https://crates.io)
- [The Rust Book](https://doc.rust-lang.org/book/)

---

## **13. Próxima Aula**

**05/05 – Dia 2: CRUD em Rust**

- Vamos criar um sistema CRUD completo com Rust.

_"Não esqueça: Aula ao vivo amanhã, 19h, no YouTube. Traga suas dúvidas!"_
