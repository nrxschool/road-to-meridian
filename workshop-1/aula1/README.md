# Roteiro Final: Workshop: Road to Meridian – Dia 1: Bibliotecas em Rust

## Introdução: Bem-vindos ao Workshop: Road to Meridian 🚀

Olá, mundo!

**Você já se perguntou por que o Rust se tornou a linguagem preferida dos engenheiros que constroem o futuro?**

Meu nome é **Lucas Oliveira**, sou **Matemático** e **Engenheiro Senior de Blockchain**, e hoje você está dando um passo importante numa jornada que vai mudar a forma como você pensa sobre programação.

Seja bem-vindo ao **Workshop: Road to Meridian** — uma imersão de três dias onde vamos sair do zero absoluto até construir confiança na linguagens mais potente, segura e moderna da atualidade: **Rust**.

Este não é só mais um curso de introdução. Aqui, você vai aprender Rust **de verdade** — escrevendo código que compila, que funciona e que pode ser usado no mundo real.

Hoje é o Dia 1. E nosso objetivo é simples: **criar nossa primeira biblioteca em Rust**.
Sim, você vai sair daqui com algo concreto, algo que você mesmo escreveu e entende.

Se você nunca programou antes, ótimo. Se já tem experiência com outras linguagens, melhor ainda.

Rust vai desafiar seus conceitos — e ao mesmo tempo, vai te ensinar a pensar como um engenheiro de software de verdade.

Prepare-se para entender memória, segurança, performance e concisão como nunca viu antes.

Com explicações claras, exemplos práticos e uma trilha pensada para fazer você evoluir rápido e com profundidade.

Rust não é só uma linguagem — é uma forma de pensar.

E hoje você está cruzando a primeira fronteira rumo a um novo paradigma de engenharia de software.

O caminho para o Meridian começa agora.

## Capítulo 1: O que é Rust e Por Que Ele é Tão Especial?

Antes de colocarmos a mão na massa, é importante entender o que é Rust e por que ele se destaca.

Pense em Rust como uma linguagem de programação feita para construir programas que precisam ser muito rápidos e muito seguros.

Ela é usada para criar sistemas complexos, como navegadores de internet e até mesmo _blockchains_.

Rust é especial por três motivos principais: Segurança, Performance, Produtividade.

1.  **Segurança**: Rust foi projetado para evitar erros comuns que acontecem em outras linguagens, especialmente aqueles relacionados ao uso da memória do computador. Isso significa menos travamentos e mais confiabilidade nos seus programas.

2.  **Performance**: Programas escritos em Rust são extremamente rápidos, quase tão rápidos quanto programas escritos em linguagens como C ou C++. Isso é ótimo para aplicações que exigem alta velocidade, como jogos ou sistemas de tempo real.

3.  **Produtividade**: Apesar de ser uma linguagem poderosa, Rust oferece ferramentas e um sistema de tipos que ajudam os programadores a escrever código de forma mais eficiente e com menos bugs.

Rust consegue essa combinação de segurança e performance através de um conceito chamado **ownership**, que vamos explorar mais a fundo.

Ele garante que o uso da memória seja feito de forma correta, sem que você precise se preocupar com isso diretamente, como acontece em outras linguagens.

Você pode encontrar Rust em praticamente todas as grande empresas de técnologia, alguns exemplos são:

- O navegador Firefox
- Plataformas de edge computing como a Azion, Fastly, Vercel e AWS
- _blockchain_ como Solana, Ethereum, Polkadot e Stellar.

Isso mostra o quão confiável e poderosa essa linguagem é.

## Capítulo 2: Preparando Nosso Ambiente de Programação

Para começar a programar em Rust, precisamos instalar algumas ferramentas essenciais no nosso computador. Não se preocupe, o processo é bem simples e eu vou guiar você passo a passo.

As três ferramentas principais que vamos instalar são: rustup, rustc, cargo.

- `rustup`: Este é o gerenciador de versões do Rust. Ele nos ajuda a instalar e atualizar o Rust de forma fácil.

- `rustc`: Este é o compilador do Rust. Ele transforma o código que escrevemos em um programa que o computador consegue entender e executar.

- `cargo`: Este é o gerenciador de pacotes e a ferramenta de construção de projetos do Rust. Ele nos ajuda a criar novos projetos, adicionar bibliotecas e compilar nosso código.

### Instalando o Rust no Seu Computador

Vamos começar a instalação.

Abra a página oficial do Rust e clique em "Get Started". Depois disso role pra baixo cópie o script.

Agora abra seu Terminal.

Cole e de Enter para executar o comando.

Este comando vai baixar e executar um script que instala o `rustup` e, por consequência, o `rustc` e o `cargo`.

Durante a instalação, você pode ser perguntado sobre algumas opções.

Pra gente a opção padrão (a primeira) é a melhor. Basta pressionar Enter para continuar.

Após a instalação, o terminal pode pedir para você reiniciar ou abrir uma nova sessão para que as mudanças tenham efeito. Se isso acontecer, feche e abra o terminal novamente.

### Verificando a Instalação do Rust

Agora que a instalação foi concluída, vamos verificar se tudo está funcionando corretamente.

Para isso, vamos usar os comandos de versão do `rustc` e `cargo` no terminal.

Digite `rustc --version` pressione Enter

Agora digite `cargo --version` e pressione Enter

Este comando deve exibir a versão do compilador Rust que foi instalada se tudo correu bem.

Se ambos os comandos exibirem as versões instaladas, parabéns! Sua instalação do Rust está funcionando perfeitamente e você está pronto para começar a programar.

## Capítulo 3: Nosso Primeiro Programa em Rust – O Famoso "Hello, World!"

Antes de começarmos a programar, precisamos criar o arquivo que vai conter nosso código em Rust.

Você pode usar qualquer editor de texto simples, como o Notepad, VS Code, Sublime ou até o editor de txt — o importante é salvar com o nome certo e na pasta certa.

Crie um novo arquivo e salve com o nome **`main.rs`** em uma pasta fácil de encontrar.

A extensão **`.rs`** indica que este é um arquivo de código escrito em **Rust**.

Agora, abra esse arquivo e digite exatamente o seguinte código, linha por linha, como vou descrever a seguir:

```
fn, espaço, main, abre parênteses, fecha parênteses, espaço, abre chaves.
Pula linha.
Tab, ou quatro espaços.
println, ponto de exclamação, abre parênteses, aspas duplas, Hello, vírgula, espaço, World, ponto de exclamação, aspas duplas, fecha parênteses, ponto e vírgula.
Pula linha.
Fecha chaves.
```

Esse é o nosso primeiro programa em Rust. Agora vamos entender o que cada parte significa:

- **`fn main() { ... }`**: Essa é a função principal do nosso programa. Todo código Rust começa sua execução por aqui — é o ponto de entrada.

- **`println!("Hello, World!");`**: Essa linha usa uma **macro** do Rust chamada `println!`, que serve para imprimir mensagens no terminal. No nosso caso, ela vai mostrar exatamente o texto: **Hello, World!**

Esse é o equivalente ao chute inicial do jogo: simples, direto e poderoso.

Agora que escrevemos e entendemos o código, estamos prontos para compilar e executar.

### Compilando e Executando Nosso Programa

Para isso, vamos usar o **compilador do Rust**, chamado `rustc`.

#### Passo 1: Abrindo o Terminal

Abra o terminal ou prompt de comando, e navegue até a pasta onde você salvou o arquivo `main.rs`.

Se estiver usando o terminal do VS Code, você já deve estar na pasta certa. Caso contrário, use o comando `cd` para navegar até o local correto.

## Por isso eu disse que tinha q salvar num lugar fácil de lembrar.

#### Passo 2: Compilando o Programa

No terminal, digite o seguinte comando e pressione Enter:

```
rustc main.rs
```

O que esse comando faz?

- O `rustc` é o compilador oficial da linguagem Rust.
- Ele vai **ler** o arquivo `main.rs`, **verificar se o código está correto** e, se tudo estiver certo, **gerar um arquivo executável**.

Esse novo arquivo terá o nome `main` no Linux ou macOS, e `main.exe` no Windows. Ele será salvo na mesma pasta onde está o seu código-fonte.

---

#### Passo 3: Executando o Programa

Agora, chegou o momento da verdade: vamos rodar o executável que acabamos de compilar.

Digite o comando correspondente ao seu sistema operacional:

- **Linux ou macOS:**

```
./main
```

- **Windows:**

```
.\main.exe
```

---

#### O Resultado

Se tudo deu certo, você verá no terminal exatamente esta mensagem:

```
Hello, World!
```

Parabéns!

Você acabou de escrever, compilar e executar seu **primeiro programa em Rust**.

Esse é o seu primeiro gol — e a partida só está começando.

## Capítulo 4: Tipos, Funções e Módulos: Construindo Nossa Biblioteca

Até agora, compilamos um programa simples diretamente. Mas para projetos maiores e mais organizados, usamos o `cargo`.

O `cargo` não é apenas um gerenciador de pacotes; ele também nos ajuda a criar e gerenciar projetos de forma estruturada. Vamos usá-lo para criar nossa primeira biblioteca.

### Iniciando um Novo Projeto de Biblioteca

Abra seu terminal e navegue até a pasta onde você quer criar seu novo projeto. Digite o seguinte comando e pressione Enter:

`cargo new --lib calculator`

Esse comando cria uma nova pasta chamada `calculator`. Dentro dessa pasta, o `cargo` já organiza a estrutura básica de um projeto de biblioteca Rust para você.

Veja como a estrutura de arquivos deve parecer:

```
calculator/
├── Cargo.toml   # arquivo de configuração do Rust
└── src/
    └── lib.rs   # arquivo de código principal da biblioteca
```

Vamos entender essa estrutura:

- `calculator/`: Esta é a pasta principal do seu projeto.
- `Cargo.toml`: Este é o arquivo de configuração do seu projeto. Ele contém informações sobre o nome da sua biblioteca, a versão, as dependências (outras bibliotecas que seu projeto usa) e outras configurações.
- `src/`: Esta pasta contém o código-fonte do seu projeto.
- `lib.rs`: Este é o arquivo principal da sua biblioteca. É aqui que vamos escrever o código das nossas funções.

Agora, entre na pasta do projeto que acabamos de criar. Digite o seguinte comando e pressione Enter:

MOSTRAR TERMINAL: `cd calculator`

Você está agora dentro da pasta `calculator`, pronto para começar a escrever o código da sua biblioteca.

### Entendendo os Tipos de Dados em Rust

Em Rust, cada valor tem um tipo de dado. Isso ajuda o compilador a entender como o programa deve lidar com as informações e a evitar erros. Alguns tipos comuns que vamos usar são:

- **Números Inteiros**: Representam números sem casas decimais.
  - `u8`: Um número inteiro sem sinal (só positivo) que vai de 0 a 255. O `u` significa _unsigned_ (sem sinal) e o `8` indica que ele usa 8 bits de memória.
  - `u32`: Um número inteiro sem sinal que vai de 0 a 4.294.967.295. Ele usa 32 bits de memória. É o tipo que vamos usar para nossas operações de calculadora hoje.
  - `i8`, `i32`, `i64`: Números inteiros com sinal (podem ser positivos ou negativos). O `i` significa _integer_ (inteiro).
- **Textos**: Representam sequências de caracteres.
  - `String`: Um texto que pode ser modificado e crescer de tamanho.
  - `&str`: Uma "fatia" de texto, que é imutável e geralmente aponta para um texto já existente.
- **Vetores**: Representam listas de elementos.
  - `Vec<T>`: Um vetor (ou lista) de elementos de um tipo `T`. Por exemplo, `Vec<u8>` é uma lista de números do tipo `u8`.

### Definindo Funções em Rust

Funções são blocos de código que realizam uma tarefa específica. Em Rust, definimos funções usando a palavra-chave `fn`. Veja a estrutura básica de uma função:

MOSTRAR CRIACAO DA FUNCAO:

```rust
fn nome_da_funcao(parametro1: Tipo1, parametro2: Tipo2) -> TipoDeRetorno {
    // Código da função
    // ...
    // A última expressão sem ponto e vírgula é o valor de retorno
    valor_a_retornar
}
```

- `fn`: Palavra-chave para definir uma função.
- `nome_da_funcao`: O nome que você dá à sua função.
- `(parametro1: Tipo1, parametro2: Tipo2)`: São os valores que a função recebe como entrada. Você precisa especificar o nome e o tipo de cada parâmetro.
- `-> TipoDeRetorno`: A seta `->` indica o tipo de valor que a função vai devolver (retornar) após ser executada. Se a função não retorna nada, você pode omitir essa parte.
- `return ;`: Você pode usar a palavra-chave `return` seguida de um ponto e vírgula para sair da função e retornar um valor a qualquer momento. No entanto, em Rust, a última expressão de uma função (sem ponto e vírgula) é automaticamente o valor de retorno.

### Módulos em Rust: Organizando o Código

Módulos servem para agrupar funções com um propósito comum. Eles são essenciais para organizar o código em projetos maiores, ajudando a evitar conflitos de nomes e a manter tudo limpo e fácil de entender. Um módulo pode ser definido dentro do mesmo arquivo ou em arquivos separados.

MOSTRAR CRIACAO DE MODULO:

```rust
// Exemplo de módulo dentro do mesmo arquivo
mod saudacoes {
    pub fn ola() {
        println!("Olá!");
    }
}

fn main() {
    // Para usar a função 'ola' do módulo 'saudacoes', fazemos:
    saudacoes::ola();
}
```

No nosso caso, para a biblioteca `calculator`, vamos usar um arquivo separado para cada módulo, o que é uma prática comum e recomendada para projetos maiores. Vamos criar `calc1.rs` e `calc2.rs` para nossas operações.

### Organizando o Código em Arquivos Separados

Para a nossa biblioteca `calculator`, vamos criar dois novos arquivos dentro da pasta `src/` para organizar as operações. Crie os arquivos `calc1.rs` e `calc2.rs`:

MOSTRAR ARVORE DE ARQUIVOS:

```
calculator/
├── Cargo.toml
└── src/
    ├── lib.rs
    ├── calc1.rs
    └── calc2.rs
```

Agora, vamos adicionar o código para as operações de soma e subtração no arquivo `src/calc1.rs`. Abra este arquivo no seu editor de texto e digite o seguinte:

MOSTRAR EDITOR DE TEXTO: Abrindo `src/calc1.rs`

MOSTRAR CRIACAO DE MODULO:

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

Observe que estamos usando `u32` para os números. A função `sub` verifica se `a` é menor que `b`. Se for, ela retorna `0`, pois `u32` não pode ter valores negativos. Caso contrário, ela realiza a subtração.

Agora, vamos adicionar o código para as operações de multiplicação e divisão no arquivo `src/calc2.rs`. Abra este arquivo no seu editor de texto e digite o seguinte:

MOSTRAR EDITOR DE TEXTO: Abrindo `src/calc2.rs`

MOSTRAR CRIACAO DE MODULO:

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

A função `rate` (que é a nossa divisão) verifica se o divisor `b` é zero. Se for, ela retorna `0` para evitar um erro de divisão por zero.

### `src/lib.rs`: Expondo os Módulos na Biblioteca Principal

Para que as funções que acabamos de criar em `calc1.rs` e `calc2.rs` possam ser usadas por outros programas que importam nossa biblioteca `calculator`, precisamos declará-las no arquivo principal da biblioteca, `src/lib.rs`.

Abra o arquivo `src/lib.rs` no seu editor de texto. Apague o conteúdo existente e digite o seguinte código:

MOSTRAR EDITOR DE TEXTO: Abrindo `src/lib.rs`

MOSTRAR CRIACAO DE MODULO:

```rust
// src/lib.rs
pub mod calc1;
pub mod calc2;
```

Com essas duas linhas, estamos dizendo ao Rust que nossa biblioteca `calculator` agora expõe dois módulos públicos: `calc1` e `calc2`. Isso significa que qualquer programa que usar nossa biblioteca poderá acessar as funções `add`, `sub`, `multiply` e `rate`.

### Usando a Biblioteca em um Programa Executável

Uma biblioteca não pode ser executada diretamente. Ela precisa de um programa que a utilize. Vamos criar um arquivo `src/main.rs` para testar as funções da nossa biblioteca `calculator`.

Crie um novo arquivo chamado `main.rs` dentro da pasta `src/` do seu projeto `calculator`. Se já existir um `main.rs` (o `cargo new` cria um projeto executável por padrão, mas usamos `--lib`), você pode apagar o conteúdo e colar o novo.

MOSTRAR EDITOR DE TEXTO: Criando/Editando `src/main.rs`

Dentro de `src/main.rs`, digite o seguinte código:

MOSTRAR CRIACAO DA FUNCAO:

```rust
// src/main.rs
use calculator::calc1::{add, sub};
use calculator::calc2::{multiply, rate};

fn main() {
    println!("\n--- Testando a Biblioteca Calculadora ---");

    // Teste de Soma
    let result_add = add(3, 8);
    println!("Soma de 3 + 8: {}", result_add);

    // Teste de Subtração
    let result_sub_positive = sub(10, 5);
    println!("Subtração de 10 - 5: {}", result_sub_positive);
    let result_sub_negative = sub(5, 10); // Deve retornar 0
    println!("Subtração de 5 - 10: {}", result_sub_negative);

    // Teste de Multiplicação
    let result_multiply = multiply(4, 7);
    println!("Multiplicação de 4 * 7: {}", result_multiply);

    // Teste de Divisão
    let result_rate_normal = rate(20, 5);
    println!("Divisão de 20 / 5: {}", result_rate_normal);
    let result_rate_zero = rate(10, 0); // Deve retornar 0
    println!("Divisão de 10 / 0: {}", result_rate_zero);

    println!("\n--- Fim dos Testes Manuais ---");
}
```

Vamos entender as novidades:

- `use calculator::calc1::{add, sub};`: Esta linha nos permite usar as funções `add` e `sub` que definimos no módulo `calc1` da nossa biblioteca `calculator`.
- `use calculator::calc2::{multiply, rate};`: Similarmente, esta linha nos permite usar as funções `multiply` e `rate` do módulo `calc2`.
- `let result_add = add(3, 8);`: Aqui, chamamos a função `add` e guardamos o resultado na variável `result_add`.

Para executar este programa e ver nossa biblioteca em ação, abra o terminal na pasta `calculator` (se você não estiver nela, use `cd calculator`). Digite o seguinte comando e pressione Enter:

MOSTRAR TERMINAL: `cargo run`

O que você deve esperar como resultado? O `cargo` vai compilar sua biblioteca e seu programa `main.rs`, e então executará o programa. Você verá as mensagens no terminal mostrando os resultados das operações da calculadora, incluindo os casos de sucesso e os casos especiais de subtração que resultaria em negativo e divisão por zero. Isso demonstra que nossa biblioteca está funcionando e tratando os casos como esperado.

## Capítulo 5: Garantindo a Qualidade com Testes Automatizados

Escrever testes é uma prática fundamental na programação. Testes automatizados nos ajudam a garantir que nosso código funciona como esperado e que futuras mudanças não quebrem funcionalidades existentes. Rust tem um sistema de testes integrado que é muito fácil de usar.

Vamos adicionar testes automatizados à nossa biblioteca `calculator`. Abra novamente o arquivo `src/lib.rs` no seu editor de texto.

MOSTRAR EDITOR DE TEXTO: Abrindo `src/lib.rs`

Role até o final do arquivo e adicione o seguinte bloco de código _após_ a declaração dos módulos `calc1` e `calc2`:

MOSTRAR CRIACAO DE MODULO:

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

    #[test]
    fn test_sub() {
        assert_eq!(sub(30, 20), 10);
        assert_eq!(sub(10, 20), 0); // Deve retornar 0 para underflow
    }

    #[test]
    fn test_multiply() {
        assert_eq!(multiply(5, 4), 20);
        // Para u32, a multiplicação pode estourar sem erro explícito se não for checked_mul
        // assert_eq!(multiply(u32::MAX / 2, 3), ...); // Exemplo de teste para grandes números
    }

    #[test]
    fn test_rate() {
        assert_eq!(rate(20, 5), 4);
        assert_eq!(rate(10, 0), 0); // Divisão por zero deve retornar 0
    }
}
```

Vamos entender o que adicionamos:

- `#[cfg(test)]`: Esta linha é uma _diretiva de compilação_. Ela diz ao Rust para incluir o código dentro deste módulo `tests` _apenas_ quando estamos rodando os testes. Isso significa que o código de teste não será incluído no seu programa final, mantendo-o leve.
- `mod tests { ... }`: Este é o nosso módulo de testes. É uma boa prática agrupar os testes em um módulo separado.
- `use super::calc1::{add, sub};` e `use super::calc2::{multiply, rate};`: Aqui, estamos importando as funções dos nossos módulos `calc1` e `calc2` para que possamos testá-las. O `super::` indica que estamos nos referindo aos módulos que estão um nível acima no nosso arquivo `lib.rs`.
- `#[test]`: Esta é uma _anotação_ que marca a função seguinte como uma função de teste. O Rust vai procurar por todas as funções marcadas com `#[test]` e executá-las quando você rodar os testes.
- `fn test_add() { ... }`: Esta é uma função de teste específica para a operação `add`.
- `assert_eq!(add(10, 20), 30);`: Esta é uma _macro de asserção_. Ela verifica se o resultado da função `add(10, 20)` é exatamente igual a `30`. Se for diferente, o teste falha.
- `assert_eq!(add(u32::MAX, 1), u32::MAX);`: Este é um exemplo de como testar o comportamento de _overflow_ para `u32`. Como nossas funções não usam `checked_*` e `u32` satura no valor máximo em caso de _overflow_ (ao invés de retornar um erro), testamos se o resultado é o valor máximo de `u32`.

As outras funções de teste (`test_sub`, `test_multiply`, `test_rate`) seguem a mesma lógica, testando tanto os casos de sucesso quanto os casos especiais que definimos (subtração que resultaria em negativo e divisão por zero).

### Rodando Nossos Testes Automatizados

Para executar todos os testes que acabamos de escrever, abra o terminal na pasta `calculator` (se você não estiver nela, use `cd calculator`). Digite o seguinte comando e pressione Enter:

MOSTRAR TERMINAL: `cargo test`

O que você deve esperar como resultado? O `cargo` vai compilar seu código de teste e executar todas as funções marcadas com `#[test]`. No terminal, você verá um resumo dos testes, indicando quantos testes foram executados e quantos passaram ou falharam. Se todos os testes passarem, você verá uma mensagem como `test result: ok. X passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in Y.YYs`.

Isso significa que sua biblioteca está funcionando corretamente e que você tem uma base sólida para futuras modificações, sabendo que seus testes vão te avisar se algo quebrar.

## Capítulo 6: Compartilhando Nossa Biblioteca com o Mundo: Crates.io

Uma das grandes vantagens de criar bibliotecas é poder compartilhá-las com outros programadores ou usá-las em seus próprios projetos. O `crates.io` é o registro oficial de pacotes (ou _crates_) do Rust. É como uma grande loja onde você pode publicar suas bibliotecas e encontrar bibliotecas criadas por outras pessoas.

Vamos aprender como preparar e publicar nossa biblioteca `calculator` no `crates.io`.

### Criando uma Conta e Autenticando-se

1.  **Acesse o site**: Primeiro, abra seu navegador e vá para [crates.io](https://crates.io).
2.  **Crie uma conta**: Se você ainda não tem uma conta, crie uma. É um processo simples de registro.
3.  **Gere um token de API**: Depois de fazer login, vá para as configurações da sua conta (geralmente em `Account Settings` ou `Configurações da Conta`) e procure por `API Tokens` (Tokens de API). Gere um novo token. Este token é como uma senha especial que permite ao `cargo` publicar bibliotecas em seu nome.
4.  **Autentique-se localmente**: Com o token em mãos, volte para o seu terminal (na pasta `calculator`). Digite o seguinte comando, substituindo `<seu-token>` pelo token que você acabou de gerar, e pressione Enter:

MOSTRAR TERMINAL: `cargo login <seu-token>`

Este comando vai salvar seu token de API no seu computador, permitindo que o `cargo` se comunique com o `crates.io`.

### Configurando o `Cargo.toml` para Publicação

Antes de publicar, precisamos adicionar algumas informações importantes ao arquivo `Cargo.toml` do nosso projeto. Abra o arquivo `Cargo.toml` no seu editor de texto.

MOSTRAR EDITOR DE TEXTO: Abrindo `Cargo.toml`

Localize a seção `[package]`. Se ela não existir, crie-a. Adicione as seguintes linhas. Se algumas já existirem, apenas verifique se os valores estão corretos ou adicione as que faltam:

MOSTRAR CRIACAO DE MODULO:

```toml
# Cargo.toml
[package]
name = "calculator-olivmath"
version = "0.1.0"
edition = "2021"
description = "Biblioteca simples para operações com u32"
license = "MIT"
```

Vamos entender o que cada linha significa:

- `name = "calculator-olivmath"`: Este é o nome da sua biblioteca no `crates.io`. **É muito importante que este nome seja único!** Se você tentar publicar com um nome que já existe, o `crates.io` não permitirá. O nome `calculator-olivmath` foi sugerido para garantir a unicidade.
- `version = "0.1.0"`: Esta é a versão da sua biblioteca. É uma boa prática seguir o versionamento semântico (maior.menor.patch).
- `edition = "2021"`: Indica a edição do Rust que seu projeto está usando. A edição 2021 é a mais recente e recomendada.
- `description = "Biblioteca simples para operações com u32"`: Uma breve descrição do que sua biblioteca faz. Isso ajuda outras pessoas a entenderem o propósito dela.
- `license = "MIT"`: A licença sob a qual sua biblioteca é distribuída. A licença MIT é uma licença de código aberto muito comum e permissiva.

Salve o arquivo `Cargo.toml` após fazer essas alterações.

### Publicando Nossa Biblioteca

Agora estamos prontos para publicar! No terminal (ainda na pasta `calculator`), vamos primeiro verificar se o pacote está pronto para ser publicado. Digite o seguinte comando e pressione Enter:

MOSTRAR TERMINAL: `cargo package`

Este comando vai criar um pacote localmente, simulando o que seria enviado para o `crates.io`. Se houver algum problema de configuração, ele avisará agora, antes de você tentar a publicação real. Se tudo estiver ok, ele criará um arquivo `.crate` na pasta `target/package/`.

Finalmente, para publicar sua biblioteca no `crates.io`, digite o seguinte comando e pressione Enter:

MOSTRAR TERMINAL: `cargo publish`

O que você deve esperar como resultado? O `cargo` vai enviar seu pacote para o `crates.io`. Se tudo estiver correto, você verá uma mensagem de sucesso no terminal, indicando que sua biblioteca foi publicada. Pode levar alguns minutos para que ela apareça no site do `crates.io`.

Parabéns! Você acabou de publicar sua primeira biblioteca Rust para o mundo! Isso é um grande passo.

## Capítulo 7: Usando Bibliotecas de Terceiros em Nossos Projetos

Assim como publicamos nossa biblioteca, podemos usar bibliotecas criadas por outras pessoas que estão disponíveis no `crates.io`. Isso é uma das grandes vantagens da programação: não precisamos reinventar a roda para cada funcionalidade.

Vamos criar um novo projeto para demonstrar como usar a biblioteca `calculator-olivmath` que acabamos de publicar (ou qualquer outra biblioteca do `crates.io`).

### Exemplo: Criando um programa interativo com a biblioteca `calculator-olivmath`

Vamos criar um novo projeto que interage com o usuário via terminal, usando as funções da nossa biblioteca `calculator-olivmath`.

Abra seu terminal e navegue até a pasta onde você quer criar seu novo projeto. Digite os seguintes comandos e pressione Enter após cada um:

MOSTRAR TERMINAL: `cargo new interactive_calculator`
MOSTRAR TERMINAL: `cd interactive_calculator`

Agora você tem uma nova pasta `interactive_calculator` com a estrutura básica de um projeto executável, incluindo um `src/main.rs` e um `Cargo.toml`.

MOSTRAR ARVORE DE ARQUIVOS:

```
interactive_calculator/
├── Cargo.toml
└── src
    └── main.rs
```

### Adicionando a Dependência no `Cargo.toml`

Abra o arquivo `Cargo.toml` do seu novo projeto `interactive_calculator` no editor de texto.

MOSTRAR EDITOR DE TEXTO: Abrindo `interactive_calculator/Cargo.toml`

Localize a seção `[dependencies]`. Se ela não existir, crie-a. Adicione a seguinte linha abaixo dela, especificando o nome da biblioteca e a versão que você quer usar:

MOSTRAR CRIACAO DE MODULO:

```toml
# interactive_calculator/Cargo.toml
[dependencies]
calculator-olivmath = "0.1.0"
```

- `calculator-olivmath = "0.1.0"`: Esta linha diz ao `cargo` que seu projeto `interactive_calculator` precisa da biblioteca `calculator-olivmath` na versão `0.1.0`. Se você publicou sua biblioteca com um nome diferente, use esse nome aqui.

Salve o arquivo `Cargo.toml`.

### `src/main.rs` no Novo Projeto: Construindo a Calculadora Interativa

Agora, vamos abrir o arquivo `src/main.rs` do seu projeto `interactive_calculator` no editor de texto. Apague o conteúdo existente e digite o seguinte código:

MOSTRAR EDITOR DE TEXTO: Abrindo `interactive_calculator/src/main.rs`

MOSTRAR CRIACAO DA FUNCAO:

```rust
// src/main.rs
use std::io;
use calculator_olivmath::calc1::{add, sub};
use calculator_olivmath::calc2::{multiply, rate};

fn main() {
    println!("\n--- Calculadora Interativa --- ");
    println!("Escolha a operação (+, -, *, /):");

    let mut operation = String::new();
    io::stdin().read_line(&mut operation).expect("Falha ao ler a operação");
    let operation = operation.trim();

    println!("Digite o primeiro número (a): ");
    let mut num_a_str = String::new();
    io::stdin().read_line(&mut num_a_str).expect("Falha ao ler o número a");
    let num_a: u32 = num_a_str.trim().parse().expect("Entrada inválida para o número a");

    println!("Digite o segundo número (b): ");
    let mut num_b_str = String::new();
    io::stdin().read_line(&mut num_b_str).expect("Falha ao ler o número b");
    let num_b: u32 = num_b_str.trim().parse().expect("Entrada inválida para o número b");

    let result: u32;
    let op_symbol: &str;

    match operation {
        "+" => {
            result = add(num_a, num_b);
            op_symbol = "+";
        },
        "-" => {
            result = sub(num_a, num_b);
            op_symbol = "-";
        },
        "*" => {
            result = multiply(num_a, num_b);
            op_symbol = "*";
        },
        "/" => {
            result = rate(num_a, num_b);
            op_symbol = "/";
        },
        _ => {
            println!("Operação inválida!");
            return;
        }
    }

    println!("Resultado {} {} {}: {}", num_a, op_symbol, num_b, result);
    println!("\n--- Fim da Calculadora --- ");
}
```

Vamos entender as partes importantes deste código:

- `use std::io;`: Esta linha importa o módulo `io` da biblioteca padrão do Rust, que nos permite ler a entrada do usuário.
- `use calculator_olivmath::calc1::{add, sub};` e `use calculator_olivmath::calc2::{multiply, rate};`: Aqui, importamos as funções da nossa biblioteca `calculator-olivmath` que vamos usar.
- `println!("Escolha a operação (+, -, *, /):");`: Exibe uma mensagem para o usuário escolher a operação.
- `let mut operation = String::new();`: Cria uma nova string mutável para armazenar a operação digitada pelo usuário.
- `io::stdin().read_line(&mut operation).expect("Falha ao ler a operação");`: Lê a linha digitada pelo usuário e armazena na variável `operation`.
- `let operation = operation.trim();`: Remove espaços em branco e quebras de linha da entrada do usuário.
- `let num_a: u32 = num_a_str.trim().parse().expect("Entrada inválida para o número a");`: Lê o número digitado, remove espaços, tenta converter para `u32` e, se falhar, exibe uma mensagem de erro.
- `match operation { ... }`: Esta estrutura `match` verifica qual operação o usuário escolheu e chama a função correspondente da nossa biblioteca (`add`, `sub`, `multiply` ou `rate`).
- `println!("Resultado {} {} {}: {}", num_a, op_symbol, num_b, result);`: Exibe o resultado da operação de forma formatada.

Para executar este programa, abra o terminal na pasta `interactive_calculator` (se você não estiver nela, use `cd interactive_calculator`). Digite o seguinte comando e pressione Enter:

MOSTRAR TERMINAL: `cargo run`

O que você deve esperar como resultado? O `cargo` vai primeiro baixar a biblioteca `calculator-olivmath` (se ainda não tiver feito), compilá-la junto com o seu projeto `interactive_calculator`, e então executar o programa. Você será solicitado a escolher uma operação e digitar dois números. O programa então exibirá o resultado do cálculo, demonstrando que você conseguiu integrar e usar uma biblioteca externa em um programa interativo com sucesso!

## Recapitulação: O que Aprendemos Hoje?

Chegamos ao final do nosso primeiro dia de Workshop! Vamos revisar os pontos mais importantes que cobrimos:

1.  **Rust**: Vimos que Rust é uma linguagem de programação de sistemas que se destaca por sua **segurança de memória**, **alta performance** (próxima de C/C++) e **produtividade**. Ele evita erros comuns com o conceito de _ownership_ e é usado em projetos críticos como Firefox, Solana, Polkadot e Stellar.
2.  **Ferramentas Essenciais**: Aprendemos a instalar e usar as ferramentas fundamentais para o desenvolvimento em Rust: `rustup` (o gerenciador de versões), `cargo` (o gerenciador de pacotes e ferramenta de build) e `rustc` (o compilador). Esses são seus companheiros diários no Rust.
3.  **Hello World**: Demos nossos primeiros passos escrevendo e executando o clássico "Hello, World!". Isso nos mostrou como compilar um programa simples diretamente com `rustc` e entender a estrutura básica de um programa Rust.
4.  **Tipos de Dados em Rust**: Exploramos os tipos de dados básicos, com foco nos números inteiros `u32` (inteiro sem sinal de 32 bits), além de `u8`, `u64`, `i8`, `i32`, `i64`. Também vimos `String` para textos mutáveis, `&str` para fatias de texto imutáveis e `Vec<T>` para listas de elementos.
5.  **Funções**: Entendemos como definir e usar funções em Rust usando a palavra-chave `fn`, como especificar seus parâmetros e o tipo de retorno com `->`, e a convenção de que a última expressão é o valor de retorno.
6.  **Módulos**: Aprofundamos na importância dos módulos para organizar o código. Vimos como criar módulos em arquivos separados (`calc1.rs`, `calc2.rs`) e como expô-los na nossa biblioteca principal (`lib.rs`) para garantir a modularidade e evitar conflitos de nomes.
7.  **Criação de Bibliotecas**: Aprendemos o processo completo de criar uma biblioteca Rust do zero usando `cargo new --lib`. Construímos uma biblioteca de calculadora (`calculator-olivmath`) com operações de soma, subtração, multiplicação e divisão para números `u32`, tratando casos especiais como subtração que resultaria em negativo e divisão por zero.
8.  **Testes Automatizados**: Implementamos testes automatizados para nossa biblioteca usando as anotações `#[test]` e as macros de asserção como `assert_eq!`. Isso nos permite verificar se o código funciona como esperado e nos dá confiança para fazer futuras modificações, rodando os testes com `cargo test`.
9.  **Crates.io**: Dominamos o processo de publicação de uma biblioteca no `crates.io`, o registro oficial de pacotes do Rust. Também aprendemos a consumir bibliotecas de terceiros em nossos próprios projetos, adicionando-as como dependências no `Cargo.toml`.
10. **Interação com o Usuário**: Finalizamos o dia criando um programa interativo que lê a entrada do usuário via terminal (`std::io`) e utiliza as funções da nossa biblioteca publicada para realizar cálculos, demonstrando uma aplicação prática do que aprendemos.

Você deu um grande passo hoje no mundo da programação com Rust! Parabéns!

## Próximos Passos: Desafios e a Próxima Aula

Para consolidar o que você aprendeu, tenho alguns desafios para você:

### Desafio de Aprendizagem

- **Adicione uma função de potência e seu inverso, logaritmo (`pow`)**: Tente adicionar uma nova função à sua biblioteca `calculator` em um novo módulo chamado `calc3.rs` que calcule a potência de um número `u32` (por exemplo, `a` elevado a `b`) e, se possível, uma função para logaritmo. Lembre-se de considerar os casos de _overflow_ e de escrever testes para essa nova função.
- **Publique a nova versão**: Depois de adicionar a função `pow` (e logaritmo, se conseguir) e os testes, atualize a versão da sua biblioteca no `Cargo.toml` para `0.2.0` e publique a nova versão no `crates.io`.

### Desafio de Carreira

- **Compartilhe seu aprendizado**: Faça um post no LinkedIn sobre o que você aprendeu hoje no Workshop: Road to Meridian, usando a hashtag `#road2meridian`. Compartilhar seu conhecimento é uma ótima forma de fixar o conteúdo e mostrar seu desenvolvimento!

### Desafio de Comunidade

- **Qual seu jogo favorito de 2024?**: Entre no nosso Discord e compartilhe qual foi o jogo que você mais jogou em 2024! Vamos interagir e nos divertir um pouco.

### Recursos Adicionais

Para continuar seus estudos, recomendo:

- [Documentação Oficial do Rust](https://www.rust-lang.org/learn): O site oficial do Rust tem uma documentação excelente.
- [Crates.io](https://crates.io): Explore outras bibliotecas e veja como elas são usadas.
- [The Rust Book](https://doc.rust-lang.org/book/): Um livro completo e gratuito sobre Rust, ideal para aprofundar seus conhecimentos.

## Encerramento: Até a Próxima Aula!

Chegamos ao fim do nosso primeiro dia de Workshop! Espero que vocês tenham gostado e se sentido à vontade para explorar o Rust. Lembrem-se, a prática leva à perfeição.

E preparem-se, porque amanhã, no Dia 2, vamos mergulhar no mundo do **CRUD em Rust**, criando um sistema completo para gerenciar dados. A aula ao vivo será amanhã, às 19h, no YouTube. Tragam suas dúvidas e sua energia!

Muito obrigado por participarem e até a próxima!
