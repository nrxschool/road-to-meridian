# Stellar Backend Demo

🌟 **Demonstração completa de operações Stellar usando Python SDK**

Este projeto implementa uma demonstração abrangente das principais funcionalidades da blockchain Stellar, incluindo operações de wallet, criação de contas, pagamentos e invocação de contratos Soroban.

## 🚀 Funcionalidades Implementadas

### 🔑 Operações de Wallet (`wallet.py`)
- **Criação de Keypairs**: Gera pares de chaves públicas/privadas
- **Funding via Friendbot**: Financia contas na Testnet automaticamente
- **Consulta de Saldos**: Verifica saldos de contas Stellar
- **Criação e Funding Automático**: Função conveniente que cria e financia contas

### 👥 Criação de Contas (`tx/create_account.py`)
- **Criação Individual**: Cria uma nova conta Stellar
- **Criação em Lote**: Cria múltiplas contas em uma única transação
- **Saldo Inicial Customizável**: Define saldo inicial para novas contas
- **Memos Personalizados**: Adiciona memos às transações

### 💸 Pagamentos (`tx/payment.py`)
- **Pagamentos XLM**: Envia Lumens (XLM) entre contas
- **Assets Customizados**: Suporte para envio de tokens personalizados
- **Pagamentos em Lote**: Múltiplos pagamentos em uma transação
- **Logs Detalhados**: Rastreamento completo de todas as operações

### 🔧 Contratos Soroban (`tx/invoke.py`)
- **Invocação de Funções**: Chama funções de contratos Soroban
- **Simulação de Transações**: Testa transações antes da execução
- **Autorização**: Suporte para contratos que requerem autorização
- **Conversão de Argumentos**: Converte automaticamente tipos Python para SCVal

## 📋 Estrutura do Projeto e Exemplos

```
backend/
├── main.py                 # 🎯 Demonstração principal integrada
├── requirements.txt        # 📦 Dependências do projeto
├── README.md              # 📖 Esta documentação
├── wallet/                # 🔑 Módulo de operações de wallet
│   └── create_wallet.py       # Criação de keypairs e funding
├── tx/                    # 💸 Módulo de transações
│   ├── create_account.py      # Criação de contas Stellar
│   └── payment.py            # Operações de pagamento XLM
├── contract/              # 🔧 Módulo de contratos Soroban
│   ├── old/                  # Implementação usando métodos antigos
│   │   ├── read.py              # Leitura de contratos (método antigo)
│   │   └── write.py             # Escrita em contratos (método antigo)
│   └── new/                  # Implementação usando ContractClient
│       ├── read.py              # Leitura de contratos (método novo)
│       └── write.py             # Escrita em contratos (método novo)
└── stellar_demo.log       # 📝 Arquivo de logs (gerado automaticamente)
```

### 📍 Localização dos Exemplos

- **🎯 Exemplo Principal**: `main.py` - Demonstração completa integrando todas as funcionalidades
- **🔑 Operações de Wallet**: `wallet/create_wallet.py` - Criação de keypairs, funding e consulta de saldos
- **💸 Transações**: 
  - `tx/create_account.py` - Criação de novas contas Stellar
  - `tx/payment.py` - Envio de pagamentos em XLM
- **🔧 Contratos Soroban**:
  - `contract/old/` - Implementação usando métodos tradicionais do SDK
  - `contract/new/` - Implementação usando ContractClient (recomendado)
- **📦 Configuração**: `requirements.txt` - Lista de dependências necessárias

## 🛠️ Instalação

### Pré-requisitos
- Python 3.8 ou superior
- pip (gerenciador de pacotes Python)

### Instalação das Dependências

```bash
# Clone o repositório (se aplicável)
git clone <repository-url>
cd backend

# Instale as dependências
pip install -r requirements.txt

# Ou instale manualmente
pip install stellar-sdk>=13.0.0 coloredlogs requests
```

### Verificação da Instalação

```bash
# Teste a instalação executando o exemplo principal
python main.py
```

## 🚀 Como Executar

### Demonstração Completa
```bash
python main.py
```

### Módulos Individuais
```bash
# Testar operações de wallet
python -c "from wallet.create_wallet import *; import logging; logger = logging.getLogger(); create_keypair(logger)"

# Testar criação de contas
python -c "from tx.create_account import *; # Execute as funções necessárias"

# Testar pagamentos
python -c "from tx.payment import *; # Execute as funções necessárias"

# Testar contratos Soroban (método novo)
python -c "from contract.new.read import *; # Execute as funções necessárias"

# Testar contratos Soroban (método antigo)
python -c "from contract.old.read import *; # Execute as funções necessárias"
```

**💡 Dica**: Para testes mais detalhados, modifique o arquivo `main.py` comentando/descomentando as seções desejadas.

## 📊 Fluxo da Demonstração

1. **🔑 Operações de Wallet**
   - Cria keypair principal
   - Financia via Friendbot
   - Verifica saldo inicial

2. **👥 Criação de Contas**
   - Cria conta individual com saldo de 10 XLM
   - Cria 3 contas em lote com 5 XLM cada
   - Verifica saldos das novas contas

3. **💸 Pagamentos**
   - Envia 2 XLM para conta individual
   - Envia 1 XLM para 2 contas em lote
   - Verifica saldos após pagamentos

4. **🔧 Contratos Soroban**
   - Simula invocação de contrato
   - Mostra exemplo de uso real
   - Explica requisitos para teste real

## 📝 Logs e Monitoramento

- **Console**: Logs coloridos em tempo real
- **Arquivo**: `stellar_demo.log` com histórico completo
- **Níveis**: INFO, WARNING, ERROR com timestamps
- **Emojis**: Interface visual amigável

## 🌐 Configuração de Rede

- **Rede**: Stellar Testnet
- **Horizon**: `https://horizon-testnet.stellar.org`
- **Soroban RPC**: `https://soroban-testnet.stellar.org`
- **Friendbot**: Funding automático para testes

## ⚠️ Cuidados Importantes

### 🔄 Diferenças entre Versões do Stellar SDK

**Este projeto foi desenvolvido para Stellar SDK v13.x**. Existem diferenças significativas entre as versões:

#### 📊 Comparação de Versões

| Funcionalidade | SDK v12.x | SDK v13.x (Atual) |
|---|---|---|
| **Contratos Soroban** | Métodos manuais | `ContractClient` simplificado |
| **Invocação de Funções** | `invoke_contract()` | `client.invoke()` |
| **Simulação** | Manual via `simulate_transaction()` | Automática no `ContractClient` |
| **Parsing de Resultados** | Manual com `scval` | `parse_result_xdr_fn` integrado |
| **Autorização** | Configuração manual | Automática via `signer` |

#### 🚨 Problemas de Compatibilidade

- **Migração v12 → v13**: Métodos antigos podem estar deprecated
- **Contratos Soroban**: API completamente reformulada na v13
- **Imports**: Alguns módulos mudaram de localização
- **Parâmetros**: Assinaturas de funções diferentes

#### 💡 Recomendações

```bash
# ✅ Versão recomendada (compatível com este projeto)
pip install stellar-sdk>=13.0.0

# ❌ Evite versões antigas
pip install stellar-sdk==12.x.x  # Pode causar incompatibilidades
```

#### 🔧 Exemplos de Migração

**Método Antigo (v12):**
```python
# Invocação manual complexa
from stellar_sdk import scval
result = server.simulate_transaction(transaction)
```

**Método Novo (v13):**
```python
# ContractClient simplificado
from stellar_sdk.contract import ContractClient
client = ContractClient(contract_id, rpc_url, network_passphrase)
result = client.invoke(function_name, parameters, source, signer)
```

### 🔒 Segurança

- **Chaves Privadas**: Nunca logadas completamente
- **Testnet Only**: Configurado apenas para ambiente de teste
- **Validação**: Verificação de parâmetros em todas as operações
- **Error Handling**: Tratamento robusto de erros
- **Versão do SDK**: Use sempre a versão mais recente para correções de segurança

## 🧪 Testando com Contratos Reais

Para testar invocação de contratos Soroban reais:

1. **Deploy um contrato**:
   ```bash
   soroban contract deploy --wasm contract.wasm --source KEYPAIR
   ```

2. **Obtenha o endereço do contrato**

3. **Modifique o teste em `invoke.py`**:
   ```python
   contract_address = "CXXXXXXX..."  # Seu contrato
   function_name = "hello"           # Função do contrato
   function_args = ["world"]         # Argumentos
   ```

## 💡 Projetos que Podem Usar Estes Exemplos

### 1. 🏃‍♂️ **Running Tracker com Incentivos USDC**
**Descrição**: App de corrida similar ao Nike Run Club com recompensas em criptomoedas

**Componentes Utilizados**:
- `wallet/create_wallet.py` - Criação automática de wallets para usuários via social login
- `contract/new/` - Smart contracts para:
  - Criação e gestão de clubes de corrida
  - Conversão de quilômetros em tokens KM
  - Distribuição de USDC baseada em performance
- `tx/payment.py` - Pagamentos de recompensas para corredores

**Funcionalidades**:
- Clubes com depósitos USDC pelos organizadores
- Tokens KM baseados em quilometragem validada
- Saques seguros via QR codes
- Integração com Apple Watch/iPhone

### 2. 🎮 **Plataforma de Gaming com NFTs e Tokens**
**Descrição**: Marketplace de jogos com economia baseada em blockchain

**Componentes Utilizados**:
- `contract/new/read.py` - Leitura de rankings e estatísticas de jogadores
- `contract/new/write.py` - Criação de novos jogos e atualização de scores
- `tx/create_account.py` - Onboarding automático de novos jogadores
- `wallet/create_wallet.py` - Gestão de wallets de jogadores

**Funcionalidades**:
- Sistema de ranking global
- Recompensas em tokens por achievements
- Marketplace de itens do jogo
- Torneios com prize pools em USDC

### 3. 🤝 **DeFi Lending Platform**
**Descrição**: Plataforma de empréstimos descentralizados com garantias

**Componentes Utilizados**:
- `contract/new/` - Smart contracts para:
  - Pools de liquidez
  - Cálculo de juros automático
  - Gestão de garantias (collateral)
- `tx/payment.py` - Transferências de empréstimos e pagamentos
- `wallet/create_wallet.py` - Onboarding de usuários

**Funcionalidades**:
- Empréstimos com garantia em criptomoedas
- Taxas de juros dinâmicas
- Liquidação automática de posições
- Dashboard de gestão de portfólio

---

## 📚 Recursos Adicionais

- [Stellar SDK Python](https://stellar-sdk.readthedocs.io/)
- [Soroban Documentation](https://soroban.stellar.org/)
- [Stellar Testnet](https://www.stellar.org/developers/guides/get-started/create-account.html)
- [Friendbot](https://friendbot.stellar.org/)
- [ContractClient Documentation](https://stellar-sdk.readthedocs.io/en/latest/contract.html)
- [Soroban CLI](https://soroban.stellar.org/docs/getting-started/setup)

## 🔧 Troubleshooting

### Problemas Comuns

#### ❌ Erro: `ModuleNotFoundError: No module named 'stellar_sdk'`
```bash
# Solução: Instale o SDK
pip install stellar-sdk>=13.0.0
```

#### ❌ Erro: `ConnectionError` ao usar Friendbot
```bash
# Solução: Verifique sua conexão com a internet e tente novamente
# O Friendbot pode estar temporariamente indisponível
```

#### ❌ Erro: `PrepareTransactionException` em contratos
```bash
# Solução: Verifique se:
# 1. O contrato está deployado corretamente
# 2. A função existe no contrato
# 3. Os parâmetros estão corretos
# 4. A conta tem saldo suficiente
```

#### ❌ Erro: Incompatibilidade de versão do SDK
```bash
# Solução: Force a instalação da versão correta
pip uninstall stellar-sdk
pip install stellar-sdk>=13.0.0
```

### 📞 Suporte

- **Logs**: Verifique o arquivo `stellar_demo.log` para detalhes dos erros
- **Testnet**: Use sempre a Testnet para desenvolvimento
- **Documentação**: Consulte a [documentação oficial do Stellar SDK](https://stellar-sdk.readthedocs.io/)

## 🤝 Contribuição

Este é um projeto de demonstração educacional. Contribuições são bem-vindas!

### Como Contribuir

1. **Fork** o repositório
2. **Clone** sua fork localmente
3. **Crie** uma branch para sua feature: `git checkout -b feature/nova-funcionalidade`
4. **Implemente** suas mudanças
5. **Teste** suas mudanças executando `python main.py`
6. **Commit** suas mudanças: `git commit -m 'Adiciona nova funcionalidade'`
7. **Push** para sua branch: `git push origin feature/nova-funcionalidade`
8. **Abra** um Pull Request

### Áreas para Contribuição

- ✨ **Novas funcionalidades**: Adicionar novos exemplos de uso
- 🐛 **Correção de bugs**: Melhorar tratamento de erros
- 📖 **Documentação**: Expandir exemplos e explicações
- 🧪 **Testes**: Adicionar testes unitários
- ⚡ **Performance**: Otimizar operações
- 🔒 **Segurança**: Melhorar práticas de segurança

### Diretrizes

- Mantenha compatibilidade com Stellar SDK v13.x
- Adicione logs informativos para novas funcionalidades
- Documente novas funções com docstrings
- Use apenas Testnet para exemplos
- Siga o padrão de nomenclatura existente

---

**🌟 Stellar Backend Demo - Explorando o futuro das finanças descentralizadas!**

*Desenvolvido com ❤️ para a comunidade Stellar*