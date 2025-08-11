# Coisas que preciso que sejam ditas:

## Wallets

- Clico de vida da carteira:

1. Criar par de chaves (publica e privada)
2. Assinar transação
3. Enviar para a blockchain

- Gerencia suas chaves privadas e públicas
- Assina transações e envia para a blockchain
- Não armazena moedas, apenas as chaves de acesso

---

**Contas:**

- Stellar usa a chave publica como endereço, diferente do mundo EVM
- Account Based Model
- Voce pode ter chaves offline mas para que alguém envie ativos é preciso criar a conta na blockchain
- Para criar a conta vc precisa depositar 1XLM + 0.5 para cada Ativo que você criar na conta.

---

**Saldos:**

- Temos o token nativo XLM (que chamamos de criptomoeda)
- Temos tokens criados por meio de trustlines chamados Ativos
- Temos tokens criados por meio de contratos inteligentes
- lunes é a menor unidade de XLM
- 1 XLM = 100000000 lumens
- 1 lumens = 0.000000001 XLM

## Transações

- Podemos colocar 100 operaçnoes em cada transaçnao
- Temos vários tipos de de transações: criaçnao de conta, transferencia de tokens, criação de smartcontract, execução de contratos...
- Custo para processar a transação é de 100 lumens

**Ciclo de Vida de uma transação:**

1. Criação
2. Assinatura
3. Broadcast para a rede
4. Validação pelos nós
5. Inclusão em um bloco
6. Confirmação final

## Blocos

**Tempo de Bloco:**

- Intervalo entre criação de novos blocos
- Stellar: ~5 segundos
- Bitcoin: ~10 minutos

**Anatomia de um Bloco:**

- Header: metadados do bloco
- Transações: lista de operações validadas
- Hash: identificador único
- Timestamp: momento da criação

**STF (State Transition Function):**

- Função que define como o estado muda
- Recebe estado atual + transações = novo estado
- Garante determinismo e consenso

## Consenso

**Proof of Work (PoW):**

- Mineradores competem usando poder computacional

**Proof of Stake (PoS):**

- Mineradores competem usando poder monetario

**Stellar Consensus Protocol (SCP):**

- Mineradores competem usando poder reputação

---
