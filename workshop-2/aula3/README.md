# Roteiro Falado - Workshop: Road to Meridian 2

## Aula 3: Integração Frontend e Backend Avançada

---

## Abertura

Olá pessoal! Sejam muito bem-vindos à terceira e última aula do Workshop: Road to Meridian 2! É incrível ver vocês chegando até aqui.

Esta é nossa aula final e mais avançada, onde vamos integrar tudo que aprendemos nas aulas anteriores. Hoje vocês vão dominar tanto o desenvolvimento frontend quanto backend para aplicações Stellar, criando uma solução completa e profissional.

Esta aula é o ápice do nosso workshop. Ao final dela, vocês terão conhecimento completo para desenvolver aplicações Web3 na Stellar, desde smart contracts até interfaces de usuário e APIs backend.

### Programa da aula

Nossa jornada final está dividida em 4 blocos estratégicos:

No bloco 1, faremos a Apresentação e Demo do DApp completo que vamos construir.

No bloco 2, vamos mergulhar no Desenvolvimento Frontend, criando carteiras, contas e integrando com contratos.

No bloco 3, que é nosso foco principal, desenvolveremos o Backend completo com Python SDK.

E no bloco 4, finalizaremos com recapitulação e preparação para os próximos passos na sua jornada Stellar.

---

## 0. Apresentação

### Lucas Oliveira

Para nossa aula final, deixe-me reforçar minha apresentação. Sou Lucas Oliveira, Head of Education na NearX, onde lidero toda a estratégia de educação blockchain na América Latina.

Com mais de 5 anos como Engenheiro de Blockchain, tenho experiência prática na criação de Layer 1, SDKs e smart contracts para diversas redes, tanto EVM quanto não-EVM. Como Embaixador da Stellar no Brasil, estou sempre conectado com as últimas inovações da rede.

Sou contribuidor ativo de projetos open source, tendo publicado mais de 3 bibliotecas de criptografia, e minha formação em matemática me permite abordar os aspectos mais técnicos com profundidade.

### NearX

A NearX é nossa plataforma líder em educação de tecnologias emergentes como Web3, IA e Blockchain. Com mais de 2.500 membros ativos no Discord, oferecemos desde pós-graduação até bootcamps intensivos como este.

Nossas parcerias estratégicas com gigantes como Animoca Brands, Stellar, Optimism, Arbitrum, Starknet, ZkVerify e MultiverseX garantem que nosso conteúdo esteja sempre na vanguarda da inovação.

### Stellar

A Stellar, com mais de 13 bilhões de dólares em capitalização de mercado, nasceu em 2014 com foco em pagamentos globais. Os smart contracts em Rust foram lançados em 2022 por Graydon Hoare, revolucionando o desenvolvimento na rede.

A combinação de velocidade, baixo custo e foco em aplicações financeiras torna a Stellar ideal para projetos de pagamentos e DeFi.

### Road to Meridian

Este workshop intensivo levou vocês do básico ao avançado em desenvolvimento Stellar. Hoje, na aula final, vamos integrar frontend e backend para criar uma aplicação completa e profissional.

### Demo do DApp Completo

> MOSTRAR TERMINAL: Demonstração da aplicação completa funcionando

Antes de começarmos, deixe-me mostrar o que vamos construir hoje. Aqui temos nossa aplicação completa: um frontend React interativo conectado a um backend Python robusto, tudo integrado com smart contracts Soroban.

Vejam como temos operações de carteira automatizadas, criação de contas em lote, sistema de pagamentos, e integração completa com contratos. Esta é uma aplicação de nível profissional que vocês poderão usar como base para seus próprios projetos.

---

## 1. Conceitos Requisitos: Arquitetura Full-Stack Stellar

Vamos começar entendendo a arquitetura completa de uma aplicação Stellar. Uma aplicação full-stack na Stellar envolve três camadas principais: smart contracts Soroban, backend para operações complexas, e frontend para interação do usuário.

### Arquitetura da Aplicação

Nossa aplicação segue uma arquitetura moderna:

- **Smart Contracts (Soroban)**: Lógica de negócio on-chain em Rust
- **Backend (Python)**: API para operações complexas e integração com SDK
- **Frontend (JavaScript)**: Interface de usuário e experiência interativa

### Fluxo de Dados

O fluxo de dados acontece de forma integrada:
1. Frontend captura ações do usuário
2. Backend processa operações complexas usando Python SDK
3. Smart contracts executam lógica de negócio on-chain
4. Resultados retornam através das camadas para o usuário

### Vantagens da Arquitetura

Esta arquitetura oferece:
- **Escalabilidade**: Backend pode processar operações em lote
- **Segurança**: Validações em múltiplas camadas
- **Performance**: Operações otimizadas no backend
- **Experiência**: Interface rica e responsiva no frontend

---

## 2. Introdução ao Desenvolvimento: Frontend com JavaScript SDK

Vamos começar pelo desenvolvimento frontend, criando as funcionalidades essenciais para interação com a Stellar.

### Configuração do Ambiente Frontend

> MOSTRAR TERMINAL: `npm install @stellar/stellar-sdk`

Primeiro, instalamos a SDK oficial da Stellar para JavaScript. Esta SDK nos permite interagir diretamente com a rede Stellar do navegador.

### Criação de Carteiras

> MOSTRAR CRIAÇÃO DA FUNÇÃO:

```javascript
import { Keypair } from '@stellar/stellar-sdk';

const createWallet = () => {
  const keypair = Keypair.random();
  return {
    publicKey: keypair.publicKey(),
    secretKey: keypair.secretKey(),
    keypair: keypair
  };
};

const restoreWallet = (secretKey) => {
  const keypair = Keypair.fromSecret(secretKey);
  return {
    publicKey: keypair.publicKey(),
    secretKey: keypair.secretKey(),
    keypair: keypair
  };
};
```

Estas funções permitem criar novas carteiras ou restaurar carteiras existentes usando a chave secreta.

### Criação de Contas e Faucet

> MOSTRAR CRIAÇÃO DA FUNÇÃO:

```javascript
import { Server } from '@stellar/stellar-sdk';

const fundAccount = async (publicKey) => {
  try {
    const response = await fetch(
      `https://friendbot.stellar.org?addr=${publicKey}`
    );
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Erro ao financiar conta:', error);
    throw error;
  }
};

const getAccountBalance = async (publicKey) => {
  const server = new Server('https://horizon-testnet.stellar.org');
  try {
    const account = await server.loadAccount(publicKey);
    return account.balances;
  } catch (error) {
    console.error('Erro ao consultar saldo:', error);
    throw error;
  }
};
```

Estas funções gerenciam o financiamento de contas via faucet e consulta de saldos.

### Leitura de Contratos

> MOSTRAR CRIAÇÃO DA FUNÇÃO:

```javascript
import { Contract, SorobanRpc, TransactionBuilder, Networks } from '@stellar/stellar-sdk';

const readContract = async (contractId, functionName, args = []) => {
  const server = new SorobanRpc.Server('https://soroban-testnet.stellar.org');
  const sourceKeypair = Keypair.random(); // Conta temporária para simulação
  
  try {
    const sourceAccount = await server.getAccount(sourceKeypair.publicKey());
    const contract = new Contract(contractId);
    
    const transaction = new TransactionBuilder(sourceAccount, {
      fee: '100',
      networkPassphrase: Networks.TESTNET,
    })
      .addOperation(contract.call(functionName, ...args))
      .setTimeout(30)
      .build();
    
    const result = await server.simulateTransaction(transaction);
    return result;
  } catch (error) {
    console.error('Erro ao ler contrato:', error);
    throw error;
  }
};
```

Esta função permite ler dados de contratos Soroban sem executar transações.

### Escrita em Contratos

> MOSTRAR CRIAÇÃO DA FUNÇÃO:

```javascript
const writeContract = async (contractId, functionName, args, userKeypair) => {
  const server = new SorobanRpc.Server('https://soroban-testnet.stellar.org');
  
  try {
    const sourceAccount = await server.getAccount(userKeypair.publicKey());
    const contract = new Contract(contractId);
    
    let transaction = new TransactionBuilder(sourceAccount, {
      fee: '100',
      networkPassphrase: Networks.TESTNET,
    })
      .addOperation(contract.call(functionName, ...args))
      .setTimeout(30)
      .build();
    
    // Preparar transação
    transaction = await server.prepareTransaction(transaction);
    
    // Assinar transação
    transaction.sign(userKeypair);
    
    // Enviar transação
    const result = await server.sendTransaction(transaction);
    return result;
  } catch (error) {
    console.error('Erro ao escrever no contrato:', error);
    throw error;
  }
};
```

Esta função executa transações que modificam o estado dos contratos.

---

## 3. Tema Principal: Desenvolvimento Backend com Python SDK

Agora vamos para a parte mais robusta da nossa aplicação: o backend Python que oferece funcionalidades avançadas e operações em lote.

### Configuração do Ambiente Backend

> MOSTRAR TERMINAL: `pip install stellar-sdk coloredlogs requests`

Instalamos as dependências necessárias: a SDK oficial da Stellar para Python, sistema de logs coloridos e biblioteca para requisições HTTP.

> MOSTRAR ÁRVORE DE ARQUIVOS:
```
backend/
├── main.py                 # Demonstração principal integrada
├── requirements.txt        # Dependências do projeto
├── wallet/                 # Módulo de operações de wallet
│   └── create_wallet.py
├── tx/                     # Módulo de transações
│   ├── create_account.py
│   └── payment.py
├── contract/               # Módulo de contratos Soroban
│   ├── old/                # Métodos tradicionais
│   └── new/                # ContractClient (recomendado)
└── stellar_demo.log        # Arquivo de logs
```

### Operações de Wallet no Backend

> MOSTRAR CRIAÇÃO DE MÓDULO:

```python
from stellar_sdk import Keypair, Server
import requests
import logging

def create_keypair(logger):
    """Cria um novo par de chaves Stellar"""
    keypair = Keypair.random()
    logger.info(f"🔑 Keypair criado:")
    logger.info(f"   📍 Public Key: {keypair.public_key}")
    logger.info(f"   🔐 Secret Key: {keypair.secret[:8]}...")
    return keypair

def fund_account(public_key, logger):
    """Financia uma conta usando o Friendbot"""
    try:
        response = requests.get(f"https://friendbot.stellar.org?addr={public_key}")
        if response.status_code == 200:
            logger.info(f"💰 Conta financiada com sucesso: {public_key}")
            return True
        else:
            logger.error(f"❌ Erro ao financiar conta: {response.status_code}")
            return False
    except Exception as e:
        logger.error(f"❌ Erro na requisição de funding: {e}")
        return False

def get_account_balance(public_key, logger):
    """Consulta o saldo de uma conta"""
    server = Server("https://horizon-testnet.stellar.org")
    try:
        account = server.load_account(public_key)
        for balance in account.balances:
            if balance.asset_type == "native":
                logger.info(f"💎 Saldo XLM: {balance.balance}")
                return float(balance.balance)
    except Exception as e:
        logger.error(f"❌ Erro ao consultar saldo: {e}")
        return 0
```

Este módulo gerencia todas as operações básicas de carteira com logs detalhados.

### Criação de Contas em Lote

> MOSTRAR CRIAÇÃO DA FUNÇÃO:

```python
from stellar_sdk import TransactionBuilder, CreateAccount, Network

def create_single_account(source_keypair, starting_balance, logger):
    """Cria uma única conta nova"""
    server = Server("https://horizon-testnet.stellar.org")
    new_keypair = Keypair.random()
    
    try:
        source_account = server.load_account(source_keypair.public_key)
        
        transaction = (
            TransactionBuilder(
                source_account=source_account,
                network_passphrase=Network.TESTNET_NETWORK_PASSPHRASE,
                base_fee=100,
            )
            .add_text_memo("Criação de conta individual")
            .append_create_account_op(
                destination=new_keypair.public_key,
                starting_balance=str(starting_balance),
            )
            .set_timeout(30)
            .build()
        )
        
        transaction.sign(source_keypair)
        response = server.submit_transaction(transaction)
        
        logger.info(f"👤 Conta criada: {new_keypair.public_key}")
        logger.info(f"💰 Saldo inicial: {starting_balance} XLM")
        
        return new_keypair, response
    except Exception as e:
        logger.error(f"❌ Erro ao criar conta: {e}")
        return None, None

def create_multiple_accounts(source_keypair, count, starting_balance, logger):
    """Cria múltiplas contas em uma única transação"""
    server = Server("https://horizon-testnet.stellar.org")
    new_keypairs = []
    
    try:
        source_account = server.load_account(source_keypair.public_key)
        
        transaction_builder = TransactionBuilder(
            source_account=source_account,
            network_passphrase=Network.TESTNET_NETWORK_PASSPHRASE,
            base_fee=100,
        ).add_text_memo(f"Criação de {count} contas em lote")
        
        for i in range(count):
            new_keypair = Keypair.random()
            new_keypairs.append(new_keypair)
            
            transaction_builder.append_create_account_op(
                destination=new_keypair.public_key,
                starting_balance=str(starting_balance),
            )
        
        transaction = transaction_builder.set_timeout(30).build()
        transaction.sign(source_keypair)
        response = server.submit_transaction(transaction)
        
        logger.info(f"👥 {count} contas criadas em lote")
        logger.info(f"💰 Saldo inicial cada: {starting_balance} XLM")
        
        return new_keypairs, response
    except Exception as e:
        logger.error(f"❌ Erro ao criar contas em lote: {e}")
        return [], None
```

Estas funções permitem criar contas individuais ou em lote, otimizando custos de transação.

### Sistema de Pagamentos

> MOSTRAR CRIAÇÃO DA FUNÇÃO:

```python
from stellar_sdk import Payment

def send_payment(source_keypair, destination_public_key, amount, logger):
    """Envia um pagamento XLM"""
    server = Server("https://horizon-testnet.stellar.org")
    
    try:
        source_account = server.load_account(source_keypair.public_key)
        
        transaction = (
            TransactionBuilder(
                source_account=source_account,
                network_passphrase=Network.TESTNET_NETWORK_PASSPHRASE,
                base_fee=100,
            )
            .add_text_memo(f"Pagamento de {amount} XLM")
            .append_payment_op(
                destination=destination_public_key,
                amount=str(amount),
                asset_code="XLM",
            )
            .set_timeout(30)
            .build()
        )
        
        transaction.sign(source_keypair)
        response = server.submit_transaction(transaction)
        
        logger.info(f"💸 Pagamento enviado: {amount} XLM")
        logger.info(f"📍 Para: {destination_public_key}")
        
        return response
    except Exception as e:
        logger.error(f"❌ Erro ao enviar pagamento: {e}")
        return None

def send_batch_payments(source_keypair, payments_list, logger):
    """Envia múltiplos pagamentos em uma transação"""
    server = Server("https://horizon-testnet.stellar.org")
    
    try:
        source_account = server.load_account(source_keypair.public_key)
        
        transaction_builder = TransactionBuilder(
            source_account=source_account,
            network_passphrase=Network.TESTNET_NETWORK_PASSPHRASE,
            base_fee=100,
        ).add_text_memo(f"Lote de {len(payments_list)} pagamentos")
        
        total_amount = 0
        for payment in payments_list:
            transaction_builder.append_payment_op(
                destination=payment['destination'],
                amount=str(payment['amount']),
                asset_code="XLM",
            )
            total_amount += payment['amount']
        
        transaction = transaction_builder.set_timeout(30).build()
        transaction.sign(source_keypair)
        response = server.submit_transaction(transaction)
        
        logger.info(f"💸 Lote de pagamentos enviado")
        logger.info(f"📊 Total: {total_amount} XLM para {len(payments_list)} contas")
        
        return response
    except Exception as e:
        logger.error(f"❌ Erro ao enviar lote de pagamentos: {e}")
        return None
```

O sistema de pagamentos suporta tanto transações individuais quanto em lote.

### Integração com Contratos Soroban

> MOSTRAR CRIAÇÃO DA FUNÇÃO:

```python
from stellar_sdk.contract import ContractClient
from stellar_sdk import scval

def read_contract_data(contract_id, function_name, args, logger):
    """Lê dados de um contrato Soroban"""
    server = Server("https://soroban-testnet.stellar.org")
    
    try:
        # Criar keypair temporário para simulação
        temp_keypair = Keypair.random()
        
        # Criar cliente do contrato
        contract_client = ContractClient(
            contract_id=contract_id,
            server=server,
            network_passphrase=Network.TESTNET_NETWORK_PASSPHRASE,
        )
        
        # Simular chamada da função
        result = contract_client.simulate(
            function_name=function_name,
            args=args,
            source=temp_keypair,
        )
        
        logger.info(f"📖 Dados lidos do contrato: {function_name}")
        return result
    except Exception as e:
        logger.error(f"❌ Erro ao ler contrato: {e}")
        return None

def write_contract_data(contract_id, function_name, args, source_keypair, logger):
    """Escreve dados em um contrato Soroban"""
    server = Server("https://soroban-testnet.stellar.org")
    
    try:
        # Criar cliente do contrato
        contract_client = ContractClient(
            contract_id=contract_id,
            server=server,
            network_passphrase=Network.TESTNET_NETWORK_PASSPHRASE,
        )
        
        # Executar função do contrato
        result = contract_client.invoke(
            function_name=function_name,
            args=args,
            source=source_keypair,
        )
        
        logger.info(f"✍️ Dados escritos no contrato: {function_name}")
        return result
    except Exception as e:
        logger.error(f"❌ Erro ao escrever no contrato: {e}")
        return None
```

Este módulo permite interação completa com contratos Soroban usando o ContractClient.

### Demonstração Principal Integrada

> MOSTRAR CRIAÇÃO DE MÓDULO:

```python
import logging
import coloredlogs
from wallet.create_wallet import *
from tx.create_account import *
from tx.payment import *

def setup_logging():
    """Configura sistema de logs coloridos"""
    logger = logging.getLogger()
    coloredlogs.install(
        level='INFO',
        logger=logger,
        fmt='%(asctime)s 🚀 %(levelname)s: %(message)s'
    )
    
    # Configurar arquivo de log
    file_handler = logging.FileHandler('stellar_demo.log')
    file_handler.setFormatter(
        logging.Formatter('%(asctime)s - %(levelname)s: %(message)s')
    )
    logger.addHandler(file_handler)
    
    return logger

def main_demo():
    """Demonstração principal integrando todas as funcionalidades"""
    logger = setup_logging()
    
    logger.info("🌟 Iniciando demonstração Stellar Backend")
    
    # 1. Operações de Wallet
    logger.info("\n🔑 === OPERAÇÕES DE WALLET ===")
    main_keypair = create_keypair(logger)
    fund_account(main_keypair.public_key, logger)
    get_account_balance(main_keypair.public_key, logger)
    
    # 2. Criação de Contas
    logger.info("\n👥 === CRIAÇÃO DE CONTAS ===")
    single_keypair, _ = create_single_account(main_keypair, 10, logger)
    multiple_keypairs, _ = create_multiple_accounts(main_keypair, 3, 5, logger)
    
    # 3. Pagamentos
    logger.info("\n💸 === SISTEMA DE PAGAMENTOS ===")
    if single_keypair:
        send_payment(main_keypair, single_keypair.public_key, 2, logger)
    
    if multiple_keypairs:
        payments = [
            {'destination': kp.public_key, 'amount': 1}
            for kp in multiple_keypairs[:2]
        ]
        send_batch_payments(main_keypair, payments, logger)
    
    logger.info("\n✅ Demonstração concluída com sucesso!")

if __name__ == "__main__":
    main_demo()
```

Este arquivo principal integra todas as funcionalidades em uma demonstração completa.

---

## 4. Aplicações Avançadas: Integração e Deploy

### Integração Frontend-Backend

Para integrar frontend e backend, criamos uma API REST que expõe as funcionalidades do backend:

> MOSTRAR CRIAÇÃO DA FUNÇÃO:

```python
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Permitir requisições do frontend

@app.route('/api/create-wallet', methods=['POST'])
def api_create_wallet():
    try:
        keypair = create_keypair(logger)
        return jsonify({
            'success': True,
            'publicKey': keypair.public_key,
            'secretKey': keypair.secret
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)})

@app.route('/api/fund-account', methods=['POST'])
def api_fund_account():
    data = request.json
    public_key = data.get('publicKey')
    
    try:
        success = fund_account(public_key, logger)
        return jsonify({'success': success})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)})

@app.route('/api/send-payment', methods=['POST'])
def api_send_payment():
    data = request.json
    source_secret = data.get('sourceSecret')
    destination = data.get('destination')
    amount = data.get('amount')
    
    try:
        source_keypair = Keypair.from_secret(source_secret)
        response = send_payment(source_keypair, destination, amount, logger)
        return jsonify({'success': True, 'response': response})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)})

if __name__ == '__main__':
    app.run(debug=True, port=5000)
```

Esta API permite que o frontend acesse todas as funcionalidades do backend.

### Deploy e Monitoramento

> MOSTRAR TERMINAL: Configuração de deploy

```bash
# Instalar dependências de produção
pip install gunicorn

# Executar em produção
gunicorn -w 4 -b 0.0.0.0:5000 main:app

# Monitorar logs
tail -f stellar_demo.log
```

O sistema inclui logs detalhados para monitoramento em produção.

---

## Revisão

Vamos recapitular nossa jornada completa no Workshop: Road to Meridian 2:

**Bloco 1: Apresentação e Demo**
- ✅ Arquitetura full-stack Stellar
- ✅ Demonstração da aplicação completa

**Bloco 2: Frontend com JavaScript SDK**
- ✅ Criação e gerenciamento de carteiras
- ✅ Financiamento via faucet e consulta de saldos
- ✅ Leitura e escrita em contratos Soroban
- ✅ Integração com interface de usuário

**Bloco 3: Backend com Python SDK**
- ✅ Operações avançadas de wallet
- ✅ Criação de contas individuais e em lote
- ✅ Sistema completo de pagamentos
- ✅ Integração com contratos Soroban
- ✅ Sistema de logs e monitoramento

**Bloco 4: Integração e Deploy**
- ✅ API REST para integração frontend-backend
- ✅ Configuração de deploy em produção
- ✅ Monitoramento e logs avançados

---

## Lição de casa

### Desafio de Aprendizagem

- **Fácil:** Implemente uma função no backend que consulte o histórico de transações de uma conta.
- **Médio:** Crie uma interface web que permita criar múltiplas contas e enviar pagamentos em lote.
- **Difícil:** Desenvolva um sistema completo de carteira multi-assinatura usando a arquitetura que aprendemos.

**Recursos:**
- [Documentação Stellar Python SDK](https://stellar-sdk.readthedocs.io/)
- [Stellar JavaScript SDK](https://stellar.github.io/js-stellar-sdk/)
- [Soroban Documentation](https://soroban.stellar.org/)
- [Horizon API Reference](https://developers.stellar.org/api/)

### Desafio de Carreira

- Poste no LinkedIn e Twitter com #road2meridian (3/3) - Workshop Completo!
- Marque a Stellar (@StellarOrg)
- Marque a NearX (@NearX)
- Compartilhe seu projeto completo no GitHub

### Desafio de Comunidade

- Publique seu projeto completo no Discord da NearX
- Mentore outros desenvolvedores que estão começando
- Participe de hackathons Stellar usando o conhecimento adquirido

---

## Próximos Passos

Parabéns! Vocês completaram o Workshop: Road to Meridian 2 e agora são desenvolvedores Stellar completos!

### Oportunidades Futuras:

- **Hackathons Stellar**: Participem de competições usando suas habilidades
- **Projetos Open Source**: Contribuam para o ecossistema Stellar
- **Certificações**: Busquem certificações oficiais da Stellar
- **Comunidade**: Mantenham-se ativos na comunidade de desenvolvedores

### Recursos Contínuos:

- Discord da NearX para suporte contínuo
- Stellar Developer Discord para networking
- Documentação oficial sempre atualizada
- Workshops avançados da NearX

Vocês agora têm todas as ferramentas necessárias para construir aplicações Web3 profissionais na Stellar. O futuro das finanças descentralizadas está em suas mãos!

Obrigado por esta jornada incrível e sucesso em seus projetos futuros!

**Até a próxima aventura no universo Stellar! 🚀**