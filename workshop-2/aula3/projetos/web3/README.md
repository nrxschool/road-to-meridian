# Tap Game - Contrato Soroban

Este é um contrato inteligente Soroban que implementa um jogo de ranking onde jogadores podem registrar suas pontuações e visualizar o ranking global.

## Estrutura do Projeto

```text
.
├── contracts/
│   └── tap-game/
│       ├── src/
│       │   ├── lib.rs          # Módulos do contrato
│       │   ├── contract.rs     # Implementação do contrato
│       │   └── model.rs        # Estruturas de dados
│       └── Cargo.toml          # Dependências do contrato
├── Cargo.toml                  # Workspace configuration
└── README.md                   # Esta documentação
```

## Funcionalidades do Contrato

### Estruturas de Dados

- **Game**: Estrutura que representa um jogo com jogador, apelido, pontuação e tempo de jogo
- **DataKey**: Enum para chaves de armazenamento (`Rank` e `PlayerAddress`)

### Funções Disponíveis

1. **initialize**: Inicializa o contrato com um ranking vazio
2. **new_game**: Adiciona um novo jogo ao ranking
3. **get_rank**: Retorna o ranking completo

## Passo a Passo Completo

### 1. Pré-requisitos

Certifique-se de ter instalado:
- [Rust](https://rustup.rs/)
- [Stellar CLI](https://developers.stellar.org/docs/tools/developer-tools)

### 2. Compilação

```bash
# Navegar para o diretório do projeto
cd web3

# Limpar builds anteriores (opcional)
cargo clean

# Compilar o contrato
stellar contract build
```

Este comando irá:
- Compilar o contrato Rust para WebAssembly (WASM)
- Gerar o arquivo `target/wasm32v1-none/release/tap_game.wasm`
- Otimizar o WASM para deploy
- Exportar 4 funções: `_`, `get_rank`, `initialize`, `new_game`

### 3. Testes

```bash
# Executar testes unitários
cargo test

# Executar testes com output detalhado
cargo test -- --nocapture
```

### 4. Deploy

#### 4.1. Configurar Identidade

```bash
# Criar uma nova identidade (se não existir)
stellar keys generate --global alice --network testnet

# Verificar identidade
stellar keys list
```

#### 4.2. Fazer Deploy do Contrato

```bash
# Deploy na testnet
stellar contract deploy \
  --wasm target/wasm32v1-none/release/tap_game.wasm \
  --source-account alice \
  --network testnet
```

O comando retornará o ID do contrato (ex: `CDRAVC5KLCTCVXSI6MG6SCULMJ5LBT33ZY5LVTAZPWRL2REXCLFE3TQK`)

#### 4.3. Inicializar o Contrato

```bash
# Inicializar o contrato (obrigatório antes do primeiro uso)
stellar contract invoke \
  --id CDRAVC5KLCTCVXSI6MG6SCULMJ5LBT33ZY5LVTAZPWRL2REXCLFE3TQK \
  --source-account alice \
  --send=yes \
  -- \
  initialize
```

### 5. Invocação de Funções

#### 5.1. Adicionar um Novo Jogo

```bash
stellar contract invoke \
  --id CDRAVC5KLCTCVXSI6MG6SCULMJ5LBT33ZY5LVTAZPWRL2REXCLFE3TQK \
  --source-account alice \
  --send=yes \
  -- \
  new_game \
  --player alice \
  --nickname "ProPlayer" \
  --score 250 \
  --game_time 10
```

#### 5.2. Consultar Ranking

```bash
stellar contract invoke \
  --id CDRAVC5KLCTCVXSI6MG6SCULMJ5LBT33ZY5LVTAZPWRL2REXCLFE3TQK \
  --source-account alice \
  -- \
  get_rank
```

Exemplo de resposta:
```json
[
  {
    "game_time": 10,
    "nickname": "ProPlayer",
    "player": "GAXZWWXHEDRIXW75C35DKXXWX2ARU23OU6AUEXGXQP4XOXHLUPTLXC3F",
    "score": 250
  }
]
```

### 6. Comandos CLI Úteis

#### 6.1. Verificar Informações do Contrato

```bash
# Verificar se o contrato está deployado e funcionando
stellar contract invoke \
  --id CDRAVC5KLCTCVXSI6MG6SCULMJ5LBT33ZY5LVTAZPWRL2REXCLFE3TQK \
  --source-account alice \
  -- \
  get_rank
```

#### 6.2. Adicionar Múltiplos Jogos

```bash
# Adicionar primeiro jogo
stellar contract invoke \
  --id CDRAVC5KLCTCVXSI6MG6SCULMJ5LBT33ZY5LVTAZPWRL2REXCLFE3TQK \
  --source-account alice \
  --send=yes \
  -- \
  new_game \
  --player alice \
  --nickname "ProPlayer" \
  --score 250 \
  --game_time 10

# Adicionar segundo jogo
stellar contract invoke \
  --id CDRAVC5KLCTCVXSI6MG6SCULMJ5LBT33ZY5LVTAZPWRL2REXCLFE3TQK \
  --source-account alice \
  --send=yes \
  -- \
  new_game \
  --player alice \
  --nickname "GamerPro" \
  --score 180 \
  --game_time 8
```

## Estrutura do Código

### Contrato Principal (`contract.rs`)

```rust
use crate::model::{DataKey, Game};
use soroban_sdk::{contract, contractimpl, Address, Env, String, Vec};

#[contract]
pub struct Contract;

#[contractimpl]
impl Contract {
    // Inicializa o contrato com ranking vazio
    pub fn initialize(env: Env) {
        if env.storage().persistent().has(&DataKey::Rank) {
            return;
        }
        let initial_rank: Vec<Game> = Vec::new(&env);
        env.storage().persistent().set(&DataKey::Rank, &initial_rank);
    }

    // Adiciona novo jogo ao ranking
    pub fn new_game(env: Env, player: Address, nickname: String, score: i32, game_time: i32) {
        let value = Game { player: player.clone(), nickname, score, game_time };
        let mut rank = env.storage().persistent()
            .get::<DataKey, Vec<Game>>(&DataKey::Rank).unwrap();
        rank.push_back(value);
        env.storage().persistent().set(&DataKey::Rank, &rank);
    }
    
    // Retorna ranking completo
    pub fn get_rank(env: Env) -> Vec<Game> {
        env.storage().persistent()
            .get::<DataKey, Vec<Game>>(&DataKey::Rank).unwrap()
    }
}
```

### Estruturas de Dados (`model.rs`)

```rust
use soroban_sdk::{contracttype, Address, String};

#[derive(Clone)]
#[contracttype]
pub struct Game {
    pub player: Address,
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

## Troubleshooting

### Erro de Macro
Se encontrar erro de macro (`proc-macro panicked`), execute:
```bash
cargo clean
stellar contract build
```

### Erro de Unwrap
O contrato atual usa `unwrap()` e requer inicialização antes do primeiro uso. Certifique-se de chamar `initialize` após o deploy.

### Erro de Storage Vazio
Se receber erro ao chamar `get_rank` ou `new_game`, inicialize o contrato:
```bash
stellar contract invoke \
  --id SEU_CONTRACT_ID \
  --source-account alice \
  --send=yes \
  -- \
  initialize
```

### Verificar Status do Contrato
```bash
# Verificar se o contrato está deployado e inicializado
stellar contract invoke \
  --id SEU_CONTRACT_ID \
  --source-account alice \
  -- \
  get_rank
```

## Redes Suportadas

- **Testnet**: Para desenvolvimento e testes
- **Futurenet**: Para recursos experimentais
- **Mainnet**: Para produção (cuidado com custos)

## Recursos Adicionais

- [Documentação Soroban](https://soroban.stellar.org/docs)
- [Stellar CLI Reference](https://developers.stellar.org/docs/tools/developer-tools)
- [Soroban Examples](https://github.com/stellar/soroban-examples)

## ID do Contrato Atual

**Testnet**: `CDRAVC5KLCTCVXSI6MG6SCULMJ5LBT33ZY5LVTAZPWRL2REXCLFE3TQK`

> **Nota**: Este ID é específico para a versão atual do contrato na testnet. Atualize conforme necessário após novos deploys.

## Fluxo Completo de Uso

1. **Compilar**: `stellar contract build`
2. **Deploy**: `stellar contract deploy --wasm target/wasm32v1-none/release/tap_game.wasm --source-account alice --network testnet`
3. **Inicializar**: `stellar contract invoke --id CONTRACT_ID --source-account alice --send=yes -- initialize`
4. **Adicionar jogos**: `stellar contract invoke --id CONTRACT_ID --source-account alice --send=yes -- new_game --player alice --nickname "Player" --score 100 --game_time 10`
5. **Consultar ranking**: `stellar contract invoke --id CONTRACT_ID --source-account alice -- get_rank`