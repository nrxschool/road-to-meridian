# Tap Game - Contrato Soroban

Este é um contrato inteligente Soroban que implementa um jogo de ranking onde jogadores podem registrar suas pontuações e visualizar o ranking global.

## Estrutura do Projeto

```text
.
├── contracts/
│   └── tap-game/
│       ├── src/
│       │   ├── lib.rs          # Contrato principal
│       │   └── test.rs         # Testes unitários
│       └── Cargo.toml          # Dependências do contrato
├── Cargo.toml                  # Workspace configuration
└── README.md                   # Esta documentação
```

## Funcionalidades do Contrato

### Estruturas de Dados

- **Game**: Estrutura que representa um jogo com jogador, apelido, pontuação e tempo
- **DataKey**: Enum para chaves de armazenamento (atualmente apenas `Rank`)

### Funções Disponíveis

1. **new_game**: Adiciona um novo jogo ao ranking
2. **get_rank**: Retorna o ranking completo ordenado por pontuação

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
- Gerar o arquivo `target/wasm32-unknown-unknown/release/tap_game.wasm`
- Otimizar o WASM para deploy

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
  --wasm target/wasm32-unknown-unknown/release/tap_game.wasm \
  --source alice \
  --network testnet
```

O comando retornará o ID do contrato (ex: `CAGFRUMLQVBUEAKG5CTB25DYCVBM2KVZOKZ2PMUKT2G34233CDKU3TLM`)

### 5. Invocação de Funções

#### 5.1. Adicionar um Novo Jogo

```bash
stellar contract invoke \
  --id CAGFRUMLQVBUEAKG5CTB25DYCVBM2KVZOKZ2PMUKT2G34233CDKU3TLM \
  --source alice \
  --network testnet \
  -- \
  new_game \
  --player GDIY6AQQ75WMD4W46EYB7O6UYMHOCGQHLAQGQTKHDX4J2DYQCHVCR4W4 \
  --nickname "TestPlayer" \
  --score 100 \
  --game_time 10
```

#### 5.2. Consultar Ranking

```bash
stellar contract invoke \
  --id CAGFRUMLQVBUEAKG5CTB25DYCVBM2KVZOKZ2PMUKT2G34233CDKU3TLM \
  --source alice \
  --network testnet \
  -- \
  get_rank
```

### 6. Integração com Frontend

#### 6.1. Gerar Bindings TypeScript

```bash
# No diretório frontend
cd ../frontend

# Gerar bindings
stellar contract bindings typescript \
  --contract-id CAGFRUMLQVBUEAKG5CTB25DYCVBM2KVZOKZ2PMUKT2G34233CDKU3TLM \
  --output-dir lib \
  --overwrite
```

#### 6.2. Usar no Frontend React

```typescript
import { Contract } from './lib';

// Inicializar contrato
const contract = new Contract({
  contractId: 'CAGFRUMLQVBUEAKG5CTB25DYCVBM2KVZOKZ2PMUKT2G34233CDKU3TLM',
  networkPassphrase: Networks.TESTNET,
  rpcUrl: 'https://soroban-testnet.stellar.org'
});

// Chamar funções
const ranking = await contract.get_rank();
const result = await contract.new_game({
  player: 'GDIY6AQQ75WMD4W46EYB7O6UYMHOCGQHLAQGQTKHDX4J2DYQCHVCR4W4',
  nickname: 'Player1',
  score: 150,
  game_time: 12
});
```

## Estrutura do Código

### Contrato Principal (`lib.rs`)

```rust
#[contract]
pub struct TapGameContract;

#[contractimpl]
impl TapGameContract {
    // Adiciona novo jogo ao ranking
    pub fn new_game(env: Env, player: Address, nickname: String, score: i32, game_time: i32) -> Vec<Game> {
        // Implementação...
    }
    
    // Retorna ranking ordenado por pontuação
    pub fn get_rank(env: Env) -> Vec<Game> {
        // Implementação...
    }
}
```

### Estruturas de Dados

```rust
#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct Game {
    pub player: Address,
    pub nickname: String,
    pub score: i32,
    pub game_time: i32,
}

#[contracttype]
pub enum DataKey {
    Rank,
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
O contrato foi corrigido para usar `unwrap_or_else(|| Vec::new(&env))` ao invés de `unwrap()` para evitar panics quando dados não existem.

### Verificar Status do Contrato
```bash
# Verificar se o contrato está deployado
stellar contract invoke \
  --id SEU_CONTRACT_ID \
  --source alice \
  --network testnet \
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

**Testnet**: `CAGFRUMLQVBUEAKG5CTB25DYCVBM2KVZOKZ2PMUKT2G34233CDKU3TLM`

> **Nota**: Este ID é específico para a versão atual do contrato na testnet. Atualize conforme necessário após novos deploys.