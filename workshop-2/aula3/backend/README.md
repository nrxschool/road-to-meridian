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

## 📋 Estrutura do Projeto

```
backend/
├── main.py              # Demonstração principal integrada
├── wallet.py            # Operações de wallet e keypairs
├── README.md           # Esta documentação
├── tx/                 # Módulo de transações
│   ├── create_account.py   # Criação de contas
│   ├── payment.py         # Operações de pagamento
│   └── invoke.py          # Invocação de contratos
└── stellar_demo.log    # Arquivo de logs (gerado automaticamente)
```

## 🛠️ Pré-requisitos

```bash
pip install stellar-sdk
```

## 🚀 Como Executar

### Demonstração Completa
```bash
python main.py
```

### Módulos Individuais
```bash
# Testar operações de wallet
python wallet.py

# Testar criação de contas
python tx/create_account.py

# Testar pagamentos
python tx/payment.py

# Testar invocação de contratos
python tx/invoke.py
```

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

## 🔒 Segurança

- **Chaves Privadas**: Nunca logadas completamente
- **Testnet Only**: Configurado apenas para ambiente de teste
- **Validação**: Verificação de parâmetros em todas as operações
- **Error Handling**: Tratamento robusto de erros

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

## 📚 Recursos Adicionais

- [Stellar SDK Python](https://stellar-sdk.readthedocs.io/)
- [Soroban Documentation](https://soroban.stellar.org/)
- [Stellar Testnet](https://www.stellar.org/developers/guides/get-started/create-account.html)
- [Friendbot](https://friendbot.stellar.org/)

## 🤝 Contribuição

Este é um projeto de demonstração educacional. Sinta-se livre para:
- Adicionar novas funcionalidades
- Melhorar o tratamento de erros
- Expandir os testes
- Otimizar performance

---

**🌟 Stellar Backend Demo - Explorando o futuro das finanças descentralizadas!**