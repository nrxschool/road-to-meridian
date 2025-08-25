# Roteiro Falado - Workshop: Road to Meridian 2

## Aula 2: Desenvolvendo Smart Contracts na Stellar

---

## Abertura

Olá pessoal! Sejam muito bem-vindos à segunda aula do Workshop: Road to Meridian 2! É um prazer imenso ter vocês aqui novamente.

Nesta aula, vamos mergulhar no desenvolvimento completo de smart contracts na blockchain Stellar usando Rust. Vocês vão aprender desde a criação do contrato até a integração com frontend, construindo um jogo interativo que demonstra os conceitos fundamentais de desenvolvimento Web3.

Esta é uma aula muito prática e hands-on. Ao final dela, cada um de vocês terá um jogo completo funcionando na blockchain Stellar, com interface web e tudo!

### Programa da aula

Nossa jornada hoje está dividida em 4 grandes blocos:

Primeiro, no bloco 1, vamos abordar os Conceitos Requisitos - os fundamentos de Smart Contracts na Stellar que vocês precisam dominar.

No bloco 2, faremos a Introdução ao Desenvolvimento, criando o projeto e definindo a estrutura de dados.

No bloco 3, que é nosso Tema Principal, vamos implementar as funções, escrever testes e fazer o deploy.

E finalmente, no bloco 4, vamos para as Aplicações Avançadas, integrando com SDK JavaScript e criando o frontend.

---

## 0. Apresentação

### Lucas Oliveira

Para quem está chegando agora, deixe-me me reapresentar rapidamente. Meu nome é Lucas, sou Head of Education na NearX, onde lidero toda a área de educação blockchain na América Latina.

Tenho mais de 5 anos como Engenheiro de Blockchain, com experiência na criação de Layer 1, SDKs e smart contracts tanto para redes EVM quanto não-EVM. Sou Embaixador da Stellar aqui no Brasil e contribuidor ativo de projetos open source, tendo publicado mais de 3 bibliotecas de criptografia.

Sou matemático de formação, o que me ajuda muito a entender os aspectos técnicos mais profundos da blockchain.

### NearX

A NearX é nossa plataforma de educação em tecnologias emergentes como Web3, IA e Blockchain. Temos mais de 2.500 membros ativos no Discord e oferecemos desde pós-graduação até bootcamps como este que vocês estão fazendo.

Nossas parcerias estratégicas incluem gigantes como Animoca Brands, Stellar, Optimism, Arbitrum, Starknet, ZkVerify e MultiverseX, garantindo que nosso conteúdo esteja sempre alinhado com as melhores práticas do mercado.

### Stellar

A Stellar tem mais de 13 bilhões de dólares em capitalização de mercado e nasceu em 2014. Os smart contracts em Rust foram lançados em 2022 por Graydon Hoare, o criador original da linguagem Rust.

O foco da Stellar está em pagamentos e aplicações financeiras globais, o que a torna perfeita para nossos projetos.

### Road to Meridian

Este é nosso workshop intensivo de desenvolvimento Stellar, que leva vocês do básico ao avançado em smart contracts. Hoje vamos construir um projeto prático - um jogo interativo on-chain - que vai preparar vocês para hackathons e projetos reais.

### Demo do DApp

> MOSTRAR TERMINAL: Demonstração do jogo funcionando

Antes de começarmos a programar, deixe-me mostrar o que vamos construir hoje. Aqui temos nossa interface web interativa, onde os jogadores podem interagir diretamente com o smart contract. Vejam como as transações acontecem on-chain em tempo real, temos um sistema de ranking e pontuação, e uma integração completa entre carteira e contrato.

Isso é o que vocês vão ter funcionando ao final da aula!

---

## 1. Conceitos Requisitos: Fundamentos de Smart Contracts na Stellar

Vamos começar entendendo o que são smart contracts na Stellar. Smart contracts na Stellar são programas executados na blockchain que automatizam acordos e lógicas de negócio. Diferente de outras blockchains, a Stellar utiliza Rust como linguagem principal, oferecendo performance e segurança excepcionais.

### Arquitetura do Nosso Contrato

Todo contrato na Stellar segue uma estrutura básica:

```rust
#[contract]
pub struct Contract;
```

Esta é a declaração básica que define nosso contrato. O atributo `#[contract]` é uma macro do Soroban que transforma nossa struct em um contrato inteligente.

### Funcionalidades Principais

Nosso jogo terá duas funcionalidades principais:

- **new_game()**: Esta função vai criar uma nova partida, armazenando o nickname do jogador, sua pontuação e o tempo de jogo
- **get_rank()**: Esta função vai consultar o ranking completo de todos os jogadores

O armazenamento será feito por endereço do jogador, e teremos um sistema de ranking persistente que sobrevive entre diferentes execuções.

---

## 2. Introdução ao Desenvolvimento: Criando o Projeto e Estrutura de Dados

### Criando o Projeto

> MOSTRAR TERMINAL: `cargo new --lib tap-game`

Vamos começar criando nosso projeto. Usamos o comando `cargo new --lib tap-game` para criar uma nova biblioteca Rust. Escolhemos `--lib` porque smart contracts são bibliotecas, não executáveis.

> MOSTRAR ÁRVORE DE ARQUIVOS:
```
tap-game/
├── Cargo.toml
├── src/
│   └── lib.rs
└── contracts/
    └── tap_game/
        ├── Cargo.toml
        └── src/
            └── lib.rs
```

Esta é a estrutura que vamos ter. O diretório `contracts/` contém nosso smart contract específico, enquanto a raiz do projeto pode conter outros contratos ou utilitários.

### Estrutura de Dados

> MOSTRAR CRIAÇÃO DE MÓDULO:

Agora vamos definir as estruturas de dados que nosso contrato vai usar:

```rust
use soroban_sdk::{contracttype, Address, String};

#[derive(Clone)]
#[contracttype]
pub struct Game {
    pub nickname: String,
    pub game_time: i32,
    pub score: i32,
}

#[derive(Clone)]
#[contracttype]
pub enum DataKey {
    Rank,
    PlayerAddress(Address),
}
```

A struct `Game` representa uma partida individual, com nickname do jogador, tempo de jogo e pontuação. O enum `DataKey` define as chaves que usaremos para armazenar dados no contrato.

### Tipos de Storage

Na Stellar, temos três tipos de storage:

- **Temporary**: Para dados temporários como sessões de jogo
- **Persistent**: Para dados duradouros como rankings que precisam persistir
- **Instance**: Para configurações do contrato

Vamos usar principalmente o storage persistente para nosso ranking.

---

## 3. Tema Principal: Implementação das Funções, Testes e Deploy

Agora vamos para a parte mais importante da aula, dividida em 6 blocos práticos:

1. Bloco 1: Smart Contracts - Escrever Funções e Storage
2. Bloco 2: Escrever Testes
3. Bloco 3: Otimizar/Deploy e Interagir CLI
4. Bloco 4: Stellar SDK JS, Criar Carteira e Conta
5. Bloco 5: Ler e Escrever Smart Contracts
6. Bloco 6: Recapitulação, Lição de Casa e Próxima Aula

## Bloco 1: Smart Contracts - Escrever Funções e Storage

Vamos começar implementando nossas duas funções principais: `new_game` para escrever dados e `get_rank` para ler dados.

### Função new_game

> MOSTRAR CRIAÇÃO DA FUNÇÃO:

```rust
#[contractimpl]
impl Contract {
    pub fn new_game(
        env: Env,
        player_address: Address,
        nickname: String,
        score: i32,
        game_time: i32,
    ) {
        let value = Game {
            nickname,
            score,
            game_time,
        };
        let key = DataKey::PlayerAddress(player_address);
        env.storage().persistent().set(&key, &value);

        let mut rank = env
            .storage()
            .persistent()
            .get::<DataKey, Vec<Game>>(&DataKey::Rank)
            .unwrap();

        rank.push_back(value);
        env.storage().persistent().set(&DataKey::Rank, &rank);
    }
}
```

Esta função recebe o endereço do jogador, nickname, pontuação e tempo de jogo. Ela cria uma instância de `Game`, armazena no storage usando o endereço como chave, e também adiciona ao ranking geral.

### Função get_rank

> MOSTRAR CRIAÇÃO DA FUNÇÃO:

```rust
pub fn get_rank(env: Env) -> Vec<Game> {
    env.storage()
        .persistent()
        .get::<DataKey, Vec<Game>>(&DataKey::Rank)
        .unwrap()
}
```

Esta função é mais simples - ela apenas recupera o ranking completo do storage e retorna para quem chamou.

## Bloco 2: Escrever Testes

Testes são fundamentais para garantir que nosso contrato funciona corretamente. Vamos criar três testes principais.

### Configuração de Testes

> MOSTRAR CRIAÇÃO DE MÓDULO:

Primeiro, vamos configurar nosso ambiente de testes:

```rust
#[cfg(test)]
use soroban_sdk::testutils::Address as _;
use soroban_sdk::{Address, Env, String, Vec};
use tap_game::contract::{Contract, ContractClient};
use tap_game::model::{DataKey, Game};

fn init_rank_storage(env: &Env, contract_id: &Address) {
    env.as_contract(contract_id, || {
        let empty: Vec<Game> = Vec::new(env);
        env.storage().persistent().set(&DataKey::Rank, &empty);
    });
}
```

A função `init_rank_storage` inicializa o storage com um ranking vazio, necessário para nossos testes.

### Teste create_single_game

> MOSTRAR CRIAÇÃO DE MÓDULO:

```rust
#[test]
fn create_single_game() {
    let env = Env::default();
    let contract_id = env.register(Contract, ());
    let client = ContractClient::new(&env, &contract_id);
    
    init_rank_storage(&env, &contract_id);
    
    let player = Address::generate(&env);
    let name = String::from_str(&env, "Alice");
    client.new_game(&player, &name, &42, &120);
    
    let rank = client.get_rank();
    assert_eq!(rank.len(), 1);
}
```

Este teste verifica se conseguimos criar uma única partida e se ela aparece corretamente no ranking.

### Teste multiple_games

```rust
#[test]
fn multiple_games() {
    let env = Env::default();
    let contract_id = env.register(Contract, ());
    let client = ContractClient::new(&env, &contract_id);
    
    init_rank_storage(&env, &contract_id);
    
    let p1 = Address::generate(&env);
    client.new_game(&p1, &String::from_str(&env, "Bob"), &10, &30);
    
    let p2 = Address::generate(&env);
    client.new_game(&p2, &String::from_str(&env, "Carol"), &77, &200);
    
    let rank = client.get_rank();
    assert_eq!(rank.len(), 2);
}
```

Este teste verifica se conseguimos criar múltiplas partidas e se todas aparecem no ranking.

### Teste get_account_score

```rust
#[test]
fn get_account_score() {
    let env = Env::default();
    let contract_id = env.register(Contract, ());
    let client = ContractClient::new(&env, &contract_id);
    
    init_rank_storage(&env, &contract_id);
    
    let player = Address::generate(&env);
    let name = String::from_str(&env, "Dave");
    client.new_game(&player, &name, &50, &150);
    
    let key = DataKey::PlayerAddress(player);
    let game: Game = env.storage().persistent().get(&key).unwrap();
    assert_eq!(game.score, 50);
}
```

Este teste verifica se conseguimos recuperar a pontuação específica de um jogador.

> MOSTRAR TERMINAL: `cargo test`

Vamos executar nossos testes para garantir que tudo está funcionando corretamente.

## Bloco 3: Otimizar/Deploy e Interagir CLI

### Otimizar e Compilação

> MOSTRAR TERMINAL: `cargo build --target wasm32-unknown-unknown --release`

Primeiro, compilamos nosso contrato para WebAssembly. Este comando gera o arquivo `.wasm` que será executado na blockchain.

### Deploy no Testnet

> MOSTRAR TERMINAL:

```bash
stellar contract deploy \
  --wasm target/wasm32-unknown-unknown/release/tap_game.wasm \
  --source alice \
  --network testnet
```

Agora fazemos o deploy do nosso contrato no testnet da Stellar. Isso vai retornar um ID de contrato que usaremos para interagir com ele.

### Interagir via CLI

> MOSTRAR TERMINAL:

```bash
stellar contract invoke \
  --id CONTRACT_ID \
  --source alice \
  --network testnet \
  -- new_game --player_address alice --nickname Alice --score 42 --game_time 120
```

Podemos interagir com nosso contrato diretamente pela linha de comando, criando uma nova partida.

### Gerar Bindings

> MOSTRAR TERMINAL: `stellar contract bindings typescript`

Este comando gera bindings TypeScript que facilitam a integração com frontend JavaScript.

## Bloco 4: Stellar SDK JS, Criar Carteira e Conta com Faucets

### Stellar SDK JS

A SDK em JavaScript permite interagir com a rede Stellar de forma programática, essencial para integração com frontend.

> MOSTRAR TERMINAL: `npm install @stellar/stellar-sdk`

Instalamos a SDK oficial da Stellar para JavaScript.

### Criar Carteira

> MOSTRAR CRIAÇÃO DA FUNÇÃO:

```typescript
import { Keypair } from '@stellar/stellar-sdk';

const createWallet = () => {
  const keypair = Keypair.random();
  return {
    publicKey: keypair.publicKey(),
    secretKey: keypair.secretKey()
  };
};
```

Esta função cria uma nova carteira com chaves pública e privada aleatórias.

### Criar Conta e Faucets

> MOSTRAR TERMINAL: Funding via faucet

```bash
curl "https://friendbot.stellar.org?addr=PUBLIC_KEY"
```

Usamos o faucet da Stellar para financiar nossa conta de teste com XLM gratuito.

## Bloco 5: Ler e Escrever Smart Contracts

### Ler Smart Contract

> MOSTRAR CRIAÇÃO DA FUNÇÃO:

```typescript
import { Contract, SorobanRpc, TransactionBuilder, Networks } from '@stellar/stellar-sdk';

async function getRank(contractId: string, server: SorobanRpc.Server) {
  const contract = new Contract(contractId);
  const tx = new TransactionBuilder(await server.getAccount('SOME_ACCOUNT'), { 
    fee: '100', 
    networkPassphrase: Networks.TESTNET 
  })
    .addOperation(contract.call('get_rank'))
    .setTimeout(30)
    .build();
  const result = await server.simulateTransaction(tx);
  // Decode result
}
```

Esta função lê o ranking do nosso contrato usando a SDK JavaScript.

### Escrever Smart Contract

> MOSTRAR CRIAÇÃO DA FUNÇÃO:

```typescript
async function newGame(contractId: string, server: SorobanRpc.Server, keypair: Keypair, params: {
  player_address: string, 
  nickname: string, 
  score: number, 
  game_time: number
}) {
  const contract = new Contract(contractId);
  const tx = new TransactionBuilder(await server.getAccount(keypair.publicKey()), { 
    fee: '100', 
    networkPassphrase: Networks.TESTNET 
  })
    .addOperation(contract.call('new_game', ...Object.values(params).map(xdr.ScVal.from)))
    .setTimeout(30)
    .build();
  tx.sign(keypair);
  await server.sendTransaction(tx);
}
```

Esta função cria uma nova partida no nosso contrato usando a SDK JavaScript.

## Bloco 6: Recapitulação, Lição de Casa e Próxima Aula

### Revisão

Vamos recapitular tudo que aprendemos hoje:

**Bloco 1: Escrever Funções e Storage**
- ✅ Implementação de new_game e get_rank
- ✅ Estrutura de dados Game e DataKey

**Bloco 2: Escrever Testes**
- ✅ create_single_game
- ✅ multiple_games
- ✅ get_account_score

**Bloco 3: Otimizar/Deploy e Interagir CLI**
- ✅ Compilação e deploy
- ✅ Interação via CLI

**Bloco 4: Stellar SDK JS**
- ✅ Criar carteira e conta com faucets

**Bloco 5: Ler e Escrever Smart Contracts**
- ✅ Funções de leitura e escrita

---

## Lição de casa

### Desafio de Aprendizagem

- **Fácil:** Crie um novo teste para o contrato que verifica se um jogador pode atualizar sua pontuação.
- **Médio:** Faça o deploy de seu próprio contrato no testnet e teste todas as funções via CLI.
- **Difícil:** Integre a SDK JavaScript em um aplicativo web simples que permita criar partidas e visualizar o ranking.

**Recursos:**
- [Documentação Stellar](https://developers.stellar.org)
- [Rust Book](https://doc.rust-lang.org/book/)
- [Soroban Examples](https://github.com/stellar/soroban-examples)

### Desafio de Carreira

- Poste no LinkedIn e Twitter com #road2meridian (2/3)
- Marque a Stellar (@StellarOrg)
- Marque a NearX (@NearX)

### Desafio de Comunidade

- Compartilhe seu deploy no Discord da NearX
- Ajude outros participantes com dúvidas sobre implementação

---

## Próxima Aula

Na próxima aula, vamos explorar **Integração Frontend Avançada**, onde criaremos uma interface web completa para nosso jogo, com recursos como:

- Interface React moderna
- Integração com carteiras Stellar
- Visualização em tempo real do ranking
- Animações e feedback visual
- Deploy da aplicação completa

Até lá, pratiquem os conceitos que vimos hoje e não hesitem em tirar dúvidas no Discord!

Obrigado pela participação e até a próxima aula!