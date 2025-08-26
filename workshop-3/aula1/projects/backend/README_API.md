# Stellar Contracts REST API

Uma API REST simples construída com FastAPI para interagir com contratos Stellar TTL e Auth.

## Funcionalidades

### Storage Types
- **GET /storage/ttl** - Obtém o TTL do contrato e de todos os ledger entries
- **POST /storage/ttl/extend** - Estende o TTL para um tipo de storage específico
- **GET /storage/counter/{storage_type}** - Busca o número do contador pelo tipo de storage (instance, temporary, persistent)
- **POST /storage/counter/{storage_type}/increment** - Incrementa o contador pelo tipo de storage

### Auth
- **GET /auth/keys** - Mostra toda a lista de chaves armazenadas
- **POST /auth/keys/new** - Gera uma nova chave aleatória e retorna o ID
- **POST /auth/flip** - Chama a função flip no contrato usando a chave especificada
- **GET /auth/state** - Obtém o estado atual do contrato Auth

## Como executar (estrutura modular)

1) Crie e ative um ambiente virtual Python (recomendado)

```bash
python3 -m venv venv_api
source venv_api/bin/activate
```

2) Instale as dependências

```bash
pip install -r backend/requirements.txt
```

3) Exporte as variáveis de ambiente obrigatórias (ou crie um arquivo `.env` na pasta backend/)

```bash
export SOROBAN_RPC_URL="https://rpc-futurenet.stellar.org"
export STELLAR_NETWORK="FUTURENET"
export TTL_CONTRACT_ID="CB..."
export AUTH_CONTRACT_ID="CB..."
export PRIVATE_KEY="SB..." # Opcional para rotas que submeterão transações
```

4) Execute a API

```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

## Documentação

Após iniciar a API, acesse:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc
- **Health Check**: http://localhost:8000/health

## Exemplos de Uso

### Obter contador instance
```bash
curl -X GET "http://localhost:8000/storage/counter/instance"
```

### Incrementar contador persistent
```bash
curl -X POST "http://localhost:8000/storage/counter/persistent/increment"
```

### Criar nova chave
```bash
curl -X POST "http://localhost:8000/auth/keys/new"
```

### Flipar estado usando chave ID 0
```bash
curl -X POST "http://localhost:8000/auth/flip" \
  -H "Content-Type: application/json" \
  -d '{"key_id": 0}'
```

### Obter estado do contrato
```bash
curl -X GET "http://localhost:8000/auth/state"
```

## Estrutura da API

```
/
├── /health                           # Health check
├── /storage/
│   ├── /ttl                         # GET - Obter TTL
│   ├── /ttl/extend                  # POST - Estender TTL
│   └── /counter/
│       ├── /{storage_type}          # GET - Obter contador
│       └── /{storage_type}/increment # POST - Incrementar contador
└── /auth/
    ├── /keys                        # GET - Listar chaves
    ├── /keys/new                    # POST - Criar nova chave
    ├── /flip                        # POST - Flipar estado
    └── /state                       # GET - Obter estado
```

## Tipos de Storage

- `instance` - Storage de instância
- `temporary` - Storage temporário
- `persistent` - Storage persistente

## Notas

- A API usa a rede testnet do Stellar por padrão
- As chaves são armazenadas em memória (em produção, use um banco de dados)
- Certifique-se de que os contratos estejam deployados na rede testnet
- Para produção, configure adequadamente as variáveis de ambiente e segurança