---
marp: true
theme: gaia
---

# Aula 2: Desenvolvendo Smart Contracts na Stellar

## Abertura

Nesta aula, vamos mergulhar no desenvolvimento completo de smart contracts na blockchain Stellar usando Rust. Você aprenderá desde a criação do contrato até a integração com frontend, construindo um jogo interativo que demonstra os conceitos fundamentais de desenvolvimento Web3.

### Programa da aula:

1. Conceitos Requisitos: Fundamentos de Smart Contracts na Stellar
2. Introdução ao Desenvolvimento: Criando o Projeto e Estrutura de Dados
3. Tema Principal: Implementação, Testes e Deploy
4. Aplicações Avançadas: Integração com SDK JS e Frontend

---

## 0. Apresentação

### Lucas Oliveira

- Head of Education @ NearX: Liderança em educação blockchain na LATAM.
- +5 anos como Engenheiro de Blockchain:
- Criação de Layer 1, SDKs, smart contracts (EVM e não-EVM).
- Embaixador da Stellar no Brasil.
- Contribuidor F/OSS: +3 bibliotecas crypto publicadas.
- Matemático (formado em 2021).

### NearX

- Plataforma de educação em tecnologias emergentes (Web3, IA, Blockchain).
- +2.500 membros no Discord.
- Oferece: Pós-graduação, Plataforma por assinatura, Mentorias, Bootcamps, Hackathons
- Parcerias: Animoca Brands, Stellar, Optimism, Arbitrum, Starknet, ZkVerify, MultiverseX.

### Stellar

- +13Bi de capitalização de mercado 
- Nasceu em 2014
- Smart contracts em Rust lançados em 2022 por Graydon Hoare
- Foco em pagamentos e aplicações financeiras globais

### Road to Meridian

- Workshop intensivo de desenvolvimento Stellar
- Do básico ao avançado em smart contracts
- Projeto prático: Jogo interativo on-chain
- Preparação para hackathons e projetos reais

### Demo do DApp

**MOSTRAR TERMINAL**: Demonstração do jogo funcionando
- Interface web interativa
- Transações on-chain em tempo real
- Sistema de ranking e pontuação
- Integração wallet-to-contract

---

## 1. Conceitos Requisitos: Fundamentos de Smart Contracts na Stellar

Smart contracts na Stellar são programas executados na blockchain que automatizam acordos e lógicas de negócio. Diferente de outras blockchains, a Stellar utiliza Rust como linguagem principal, oferecendo performance e segurança excepcionais.

### Arquitetura do Nosso Contrato

```rust
#[contract]
pub struct Contract;
```

### Funcionalidades Principais

- **new_game()**: Criar nova partida com nickname, score e tempo
- **get_rank()**: Consultar ranking completo de jogadores
- Armazenamento por endereço do jogador
- Sistema de ranking persistente

---

## 2. Introdução ao Desenvolvimento: Criando o Projeto e Estrutura de Dados

### Criando o Projeto

**MOSTRAR TERMINAL**: `cargo new --lib tap-game`

**MOSTRAR ÁRVORE DE ARQUIVOS**:
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

### Estrutura de Dados

**MOSTRAR CRIAÇÃO DE MÓDULO**:
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

### Tipos de Storage

- **Temporary**: Dados temporários (sessões)
- **Persistent**: Dados duradouros (rankings)
- **Instance**: Configurações do contrato

---

## 3. Tema Principal: Implementação das Funções, Testes e Deploy

### Programa da aula:

1. Bloco 1: Smart Contracts - Escrever Funções e Storage
2. Bloco 2: Escrever Testes
3. Bloco 3: Otimizar/Deploy e Interagir CLI
4. Bloco 4: Stellar SDK JS, Criar Carteira e Conta
5. Bloco 5: Ler e Escrever Smart Contracts
6. Bloco 6: Recapitulação, Lição de Casa e Próxima Aula

## 1. Bloco 1: Smart Contracts - Escrever Funções e Storage

### Escrever Funções
- new_game (Write)
- get_rank (Read)

### Escrever Storage
- Tipos de storage
- Estrutura de dados (struct e enums)

### Função new_game

**MOSTRAR CRIAÇÃO DA FUNÇÃO**:
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

### Função get_rank

**MOSTRAR CRIAÇÃO DA FUNÇÃO**:
```rust
pub fn get_rank(env: Env) -> Vec<Game> {
    env.storage()
        .persistent()
        .get::<DataKey, Vec<Game>>(&DataKey::Rank)
        .unwrap()
}
```

---

## 4. Testes do Contrato

### Configuração de Testes

**MOSTRAR CRIAÇÃO DE MÓDULO**:
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

## 2. Bloco 2: Escrever Testes

### Teste create_single_game

**MOSTRAR CRIAÇÃO DE MÓDULO**:
```rust
#[test]
fn create_single_game() {
    // Código ajustado do new_game_and_rank_single
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

### Teste multiple_games

```rust
#[test]
fn multiple_games() {
    // Código ajustado do new_game_multiple_order
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

**MOSTRAR TERMINAL**: `cargo test`

---

## 5. Bloco 3: Otimizar/Deploy e Interagir CLI

### Otimizar e Compilação
**MOSTRAR TERMINAL**: `cargo build --target wasm32-unknown-unknown --release`

### Deploy no Testnet
**MOSTRAR TERMINAL**: 
```bash
stellar contract deploy \
  --wasm target/wasm32-unknown-unknown/release/tap_game.wasm \
  --source alice \
  --network testnet
```

### Interagir via CLI
**MOSTRAR TERMINAL**:
```bash
stellar contract invoke \
  --id CONTRACT_ID \
  --source alice \
  --network testnet \
  -- new_game --player_address alice --nickname Alice --score 42 --game_time 120
```

### Gerar Bindings

**MOSTRAR TERMINAL**: `stellar contract bindings typescript`

---

## Próxima Aula

Na próxima aula, vamos explorar **Padrões Avançados e Otimizações em Smart Contracts Stellar**. Até lá!


## 4. Bloco 4: Stellar SDK JS, Criar Carteira e Conta com Faucets

### Stellar SDK JS
A SDK em JavaScript permite interagir com a rede Stellar de forma programática.

**MOSTRAR TERMINAL**: `npm install @stellar/stellar-sdk`

### Criar Carteira
**MOSTRAR CRIAÇÃO DA FUNÇÃO**:
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

### Criar Conta e Faucets
**MOSTRAR TERMINAL**: Funding via faucet
```bash
curl "https://friendbot.stellar.org?addr=PUBLIC_KEY"
```


## 5. Bloco 5: Ler e Escrever Smart Contracts

### Ler Smart Contract
**MOSTRAR CRIAÇÃO DA FUNÇÃO**:
```typescript
import { Contract, SorobanRpc, TransactionBuilder, Networks } from '@stellar/stellar-sdk';

async function getRank(contractId: string, server: SorobanRpc.Server) {
  const contract = new Contract(contractId);
  const tx = new TransactionBuilder(await server.getAccount('SOME_ACCOUNT'), { fee: '100', networkPassphrase: Networks.TESTNET })
    .addOperation(contract.call('get_rank'))
    .setTimeout(30)
    .build();
  const result = await server.simulateTransaction(tx);
  // Decode result
}
```

### Escrever Smart Contract
**MOSTRAR CRIAÇÃO DA FUNÇÃO**:
```typescript
async function newGame(contractId: string, server: SorobanRpc.Server, keypair: Keypair, params: {player_address: string, nickname: string, score: number, game_time: number}) {
  const contract = new Contract(contractId);
  const tx = new TransactionBuilder(await server.getAccount(keypair.publicKey()), { fee: '100', networkPassphrase: Networks.TESTNET })
    .addOperation(contract.call('new_game', ...Object.values(params).map(xdr.ScVal.from)))
    .setTimeout(30)
    .build();
  tx.sign(keypair);
  await server.sendTransaction(tx);
}
```


## 6. Bloco 6: Recapitulação, Lição de Casa e Próxima Aula

### Revisão
1. Bloco 1: Escrever Funções e Storage
- [x] Implementação de new_game e get_rank
- [x] Estrutura de dados Game e DataKey

2. Bloco 2: Escrever Testes
- [x] create_single_game
- [x] multiple_games
- [x] get_account_score

3. Bloco 3: Otimizar/Deploy e Interagir CLI
- [x] Compilação e deploy
- [x] Interação via CLI

4. Bloco 4: Stellar SDK JS
- [x] Criar carteira e conta com faucets

5. Bloco 5: Ler e Escrever Smart Contracts
- [x] Funções de leitura e escrita

### Lição de Casa
#### Desafio de Aprendizagem
- Fácil: Crie um novo teste para o contrato.
- Médio: Deploy um contrato no testnet.
- Difícil: Integre SDK JS em um app simples.

**Recursos:**
- [Documentação Stellar](https://developers.stellar.org)
- [Rust Book](https://doc.rust-lang.org/book/)

#### Desafio de Carreira
- Poste no LinkedIn com #road2meridian (2/3)
- Marque Stellar e NearX

#### Desafio de Comunidade
- Compartilhe seu deploy no Discord da NearX

### Próxima Aula
Na próxima aula, vamos explorar **Integração Frontend Avançada**. Até lá!

