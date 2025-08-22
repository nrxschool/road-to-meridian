# Contrato Tap Game - Funções de Interação

Este diretório contém as funções para interagir com o contrato Soroban `tap_game`. O contrato implementa um jogo simples onde jogadores podem registrar seus scores e consultar um ranking.

## Estrutura do Contrato

O contrato `tap_game` possui as seguintes funcionalidades:

### Funções do Contrato Soroban

1. **`initialize(env: Env)`**
   - Inicializa o contrato criando um ranking vazio
   - Deve ser chamada apenas uma vez
   - Não recebe parâmetros além do ambiente

2. **`new_game(env: Env, player: Address, nickname: String, score: i32, game_time: i32)`**
   - Registra um novo jogo no ranking
   - Parâmetros:
     - `player`: Endereço Stellar do jogador
     - `nickname`: Nome do jogador
     - `score`: Pontuação obtida
     - `game_time`: Tempo de jogo em segundos

3. **`get_rank(env: Env) -> Vec<Game>`**
   - Retorna o ranking completo de todos os jogos
   - Não recebe parâmetros
   - Retorna uma lista de estruturas `Game`

### Estrutura de Dados

```rust
pub struct Game {
    pub player: Address,    // Endereço do jogador
    pub nickname: String,   // Nome do jogador
    pub game_time: i32,     // Tempo de jogo
    pub score: i32,         // Pontuação
}
```

## Arquivos de Interação

### `read.py` - Funções de Leitura

Contém funções para consultar dados do contrato sem modificá-lo:

#### `get_game_rank(contract_address: str)`

Obtém o ranking completo do jogo.

**Parâmetros:**
- `contract_address`: Endereço do contrato tap_game

**Retorno:**
```python
{
    "success": bool,
    "error": str | None,
    "data": Any,
    "ranking": list | str
}
```

**Exemplo:**
```python
from contract.read import get_game_rank

contract_addr = "CXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
result = get_game_rank(contract_addr)

if result["success"]:
    print("Ranking obtido:", result["ranking"])
else:
    print("Erro:", result["error"])
```

#### `get_player_score(contract_address: str, player_address: str)`

Obtém o score de um jogador específico.

**Parâmetros:**
- `contract_address`: Endereço do contrato
- `player_address`: Endereço do jogador

**Retorno:**
```python
{
    "success": bool,
    "error": str | None,
    "player_address": str,
    "score": int | None,
    "message": str
}
```

#### `check_contract_initialized(contract_address: str)`

Verifica se o contrato foi inicializado.

**Parâmetros:**
- `contract_address`: Endereço do contrato

**Retorno:**
```python
{
    "success": bool,
    "initialized": bool,
    "error": str | None
}
```

### `write.py` - Funções de Escrita

Contém funções para modificar o estado do contrato:

#### `initialize_tap_game(source_keypair: Keypair, contract_address: str, memo: str = None)`

Inicializa o contrato tap_game.

**Parâmetros:**
- `source_keypair`: Keypair da conta que irá pagar a transação
- `contract_address`: Endereço do contrato
- `memo`: Memo opcional para a transação

**Retorno:**
```python
{
    "success": bool,
    "error": str | None,
    "transaction_hash": str | None,
    "status": str
}
```

**Exemplo:**
```python
from stellar_sdk import Keypair
from contract.write import initialize_tap_game

# Criar ou carregar keypair
keypair = Keypair.from_secret("SXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX")
contract_addr = "CXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"

result = initialize_tap_game(keypair, contract_addr, "Inicialização")

if result["success"]:
    print("Contrato inicializado!", result["transaction_hash"])
else:
    print("Erro:", result["error"])
```

#### `create_new_game(source_keypair: Keypair, contract_address: str, player_address: str, nickname: str, score: int, game_time: int, memo: str = None)`

Cria um novo jogo no ranking.

**Parâmetros:**
- `source_keypair`: Keypair da conta que irá pagar a transação
- `contract_address`: Endereço do contrato
- `player_address`: Endereço do jogador
- `nickname`: Nome do jogador
- `score`: Pontuação obtida
- `game_time`: Tempo de jogo em segundos
- `memo`: Memo opcional

**Retorno:**
```python
{
    "success": bool,
    "error": str | None,
    "transaction_hash": str | None,
    "status": str,
    "game_data": {
        "player": str,
        "nickname": str,
        "score": int,
        "game_time": int
    }
}
```

**Exemplo:**
```python
from stellar_sdk import Keypair
from contract.write import create_new_game

keypair = Keypair.from_secret("SXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX")
contract_addr = "CXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
player_addr = "GXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"

result = create_new_game(
    source_keypair=keypair,
    contract_address=contract_addr,
    player_address=player_addr,
    nickname="Alice",
    score=150,
    game_time=45,
    memo="Novo jogo da Alice"
)

if result["success"]:
    print("Jogo criado!", result["game_data"])
else:
    print("Erro:", result["error"])
```

## Fluxo de Uso Típico

1. **Deploy do Contrato**: Primeiro, faça o deploy do contrato Soroban na testnet
2. **Inicialização**: Chame `initialize_tap_game()` uma única vez
3. **Verificação**: Use `check_contract_initialized()` para confirmar
4. **Criar Jogos**: Use `create_new_game()` para registrar scores
5. **Consultar Ranking**: Use `get_game_rank()` para ver o ranking

## Exemplo Completo

Veja o arquivo `tap_game_example.py` na raiz do diretório backend para um exemplo completo de uso.

## Configuração da Rede

Todas as funções estão configuradas para usar a **Stellar Testnet**:

- **Horizon URL**: `https://horizon-testnet.stellar.org`
- **Soroban RPC URL**: `https://soroban-testnet.stellar.org`
- **Network Passphrase**: `Test SDF Network ; September 2015`

## Tratamento de Erros

Todas as funções retornam um dicionário com:
- `success`: Boolean indicando sucesso/falha
- `error`: Mensagem de erro (se houver)
- Dados específicos da função

## Logs

Todas as operações são logadas com diferentes níveis:
- `INFO`: Operações normais
- `WARNING`: Situações que merecem atenção
- `ERROR`: Erros que impedem a operação

## Dependências

- `stellar-sdk`: SDK oficial do Stellar para Python
- `logging`: Para logs detalhados das operações

## Próximos Passos

1. **Deploy Real**: Substitua os endereços de exemplo pelos reais
2. **Testes**: Execute os exemplos na testnet
3. **Integração**: Integre com sua aplicação frontend
4. **Monitoramento**: Implemente logs e métricas de produção