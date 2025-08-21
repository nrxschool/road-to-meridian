---
marp: true
theme: gaia
---

# Aula 2: Desenvolvendo Smart Contracts na Stellar

## Abertura

Nesta aula, vamos mergulhar no desenvolvimento completo de smart contracts na blockchain Stellar usando Rust. Você aprenderá desde a criação do contrato até a integração com frontend, construindo um jogo interativo que demonstra os conceitos fundamentais de desenvolvimento Web3.

### Programa da aula:

1. **Apresentação**: Contexto e demonstração do projeto
2. **Smart Contracts**: Desenvolvimento, testes, otimização, deploy e bindings
3. **Frontend**: Integração e interação com contratos
4. **Finalização**: Recapitulação e próximos passos

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

## 1. Smart Contracts - Fundamentos

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

## 2. Desenvolvimento do Contrato

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

## 3. Implementação das Funções

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

#[test]
fn new_game_and_rank_single() {
    let env = Env::default();
    let contract_id = env.register(Contract, ());
    let client = ContractClient::new(&env, &contract_id);
    
    init_rank_storage(&env, &contract_id);
    
    let player = Address::generate(&env);
    let name = String::from_str(&env, "Alice");
    let score: i32 = 42;
    let game_time: i32 = 120;
    
    client.new_game(&player, &name, &score, &game_time);
    
    let rank = client.get_rank();
    assert_eq!(rank.len(), 1);
}
```

### Teste Multiple Games

**MOSTRAR TERMINAL**: `cargo test`

```rust
#[test]
fn new_game_multiple_order() {
    let env = Env::default();
    let contract_id = env.register(Contract, ());
    let client = ContractClient::new(&env, &contract_id);
    
    init_rank_storage(&env, &contract_id);
    
    // Primeiro jogador
    let p1 = Address::generate(&env);
    let n1 = String::from_str(&env, "Bob");
    client.new_game(&p1, &n1, &10, &30);
    
    // Segundo jogador
    let p2 = Address::generate(&env);
    let n2 = String::from_str(&env, "Carol");
    client.new_game(&p2, &n2, &77, &200);
    
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
    
    // Implementação do teste para get_account_score
    // Verificar score do jogador específico
}
```

**MOSTRAR TERMINAL**: `cargo test`

---

## 5. Otimizar/Deploy

### Compilação Otimizada

**MOSTRAR TERMINAL**: `cargo build --target wasm32-unknown-unknown --release`

### Deploy no Testnet

**MOSTRAR TERMINAL**: 
```bash
stellar contract deploy \
  --wasm target/wasm32-unknown-unknown/release/tap_game.wasm \
  --source alice \
  --network testnet
```

### Interação via CLI

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

