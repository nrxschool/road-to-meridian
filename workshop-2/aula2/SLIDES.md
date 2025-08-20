---
marp: true
theme: gaia
---

# Aula 2: Desenvolvendo Smart Contracts na Stellar

## Abertura

Nesta aula, vamos mergulhar no desenvolvimento completo de smart contracts na blockchain Stellar usando Rust. Você aprenderá desde a criação do contrato até a integração com frontend, construindo um jogo interativo que demonstra os conceitos fundamentais de desenvolvimento Web3.

### Programa da aula:

1. **Apresentação**: Contexto e demonstração do projeto
2. **Smart Contracts**: Desenvolvimento, testes e deploy
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
└── web3/
    └── contracts/
        └── tap-game/
            ├── Cargo.toml
            ├── src/
            │   ├── lib.rs
            │   ├── contract.rs
            │   └── model.rs
            └── tests/
                └── first.rs
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

---

## 5. Deploy e Otimização

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
  -- new_game \
  --player_address alice \
  --nickname "Alice" \
  --score 100 \
  --game_time 60
```

---

## 6. Frontend - Integração

### Gerando Bindings

**MOSTRAR TERMINAL**: `stellar contract bindings typescript`

**MOSTRAR ÁRVORE DE ARQUIVOS**:
```
frontend/
├── src/
│   ├── contracts/
│   │   └── tap-game.ts
│   ├── components/
│   └── utils/
└── package.json
```

### Criando Wallets

**MOSTRAR CRIAÇÃO DA FUNÇÃO**:
```typescript
import { Keypair } from '@stellar/stellar-sdk';

const createWallet = () => {
  const keypair = Keypair.random();
  return {
    publicKey: keypair.publicKey(),
    secretKey: keypair.secret()
  };
};
```

---

## 7. Interação com Contratos

### Lendo do Contrato

**MOSTRAR CRIAÇÃO DA FUNÇÃO**:
```typescript
const getRank = async (playerAddress: string) => {
  const result = await contract.get_rank({
    player: playerAddress
  });
  return result;
};
```

### Escrevendo no Contrato

**MOSTRAR CRIAÇÃO DA FUNÇÃO**:
```typescript
const startNewGame = async (wallet: Wallet) => {
  const tx = await contract.new_game({
    player: wallet.publicKey
  }, {
    fee: '100000',
    networkPassphrase: Networks.TESTNET
  });
  
  return await tx.signAndSend();
};
```

### Configuração de Contas

**MOSTRAR TERMINAL**: Processo de funding via faucet
```bash
curl "https://friendbot.stellar.org?addr=PUBLIC_KEY"
```

---

## Revisão

1. **Apresentação**

- [x] Contexto do Road to Meridian e demonstração do DApp
- [x] Visão geral da arquitetura Stellar com Rust

2. **Smart Contracts**

- [x] Estrutura de dados e tipos de storage na Stellar
- [x] Implementação das funções new_game e get_rank
- [x] Testes unitários e de integração
- [x] Processo de deploy e otimização

3. **Frontend**

- [x] Geração de bindings TypeScript
- [x] Criação e gerenciamento de wallets
- [x] Integração com faucet para funding de contas
- [x] Leitura e escrita em contratos via frontend

4. **Integração Completa**

- [x] Fluxo completo de desenvolvimento Web3
- [x] Interação wallet-to-contract em tempo real

---

## Lição de casa

### Desafio de Aprendizagem

- **Fácil**: Adicione uma função para pausar/despausar jogos ativos
- **Médio**: Implemente um sistema de power-ups que modifica a pontuação
- **Difícil**: Crie um torneio multi-jogador com eliminatórias

**Recursos:**

- [Stellar Docs](https://developers.stellar.org/)
- [Soroban Examples](https://github.com/stellar/soroban-examples)
- [Rust Book](https://doc.rust-lang.org/book/)

### Desafio de Carreira

- Post no LinkedIn e Twitter com #road2meridian (2/3)
- Marque a Stellar
- Marque a NearX
- Compartilhe seu progresso no desenvolvimento

### Desafio de Comunidade

- Poste um screenshot do seu contrato funcionando! (discord da nearx)
- Ajude outros desenvolvedores com dúvidas (discord da stellar)

---

## Próxima Aula

Na próxima aula, vamos explorar **Padrões Avançados e Otimizações em Smart Contracts Stellar**. Até lá!

