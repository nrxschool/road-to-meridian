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

**Saldos:**

- Temos o token nativo **XLM** (chamado de criptomoeda nativa da rede Stellar).
- Temos tokens criados por meio de **trustlines**, chamados de **Ativos**.
- Temos tokens criados por meio de **contratos inteligentes** (introduzidos com o protocolo Soroban).
- **Stroop** é a menor unidade de XLM.
- 1 XLM = **10.000.000 stroops**.
- 1 stroop = **0.0000001 XLM**.
- A taxa base da rede é: 100 stroops = **0.00001 XLM**

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

| **Operação**                     | **Descrição**                                                                |
| -------------------------------- | ---------------------------------------------------------------------------- |
| **Create Account**               | Cria e financia uma nova conta com um saldo inicial de XLM.                  |
| Payment                          | Envia um valor em um ativo para uma conta de destino.                        |
| Path Payment Strict Send         | Envia um ativo e recebe outro, especificando a quantidade enviada.           |
| Path Payment Strict Receive      | Envia um ativo e recebe outro, especificando a quantidade recebida.          |
| Manage Buy Offer                 | Cria, atualiza ou deleta uma oferta para comprar um ativo.                   |
| Manage Sell Offer                | Cria, atualiza ou deleta uma oferta para vender um ativo.                    |
| Create Passive Sell Offer        | Cria uma oferta de venda passiva que não consome uma oferta correspondente.  |
| Set Options                      | Define opções da conta, como destino de inflação, signatários ou limites.    |
| Change Trust                     | Cria, atualiza ou deleta uma linha de confiança para um ativo.               |
| Allow Trust                      | Atualiza a autorização de uma linha de confiança existente.                  |
| Account Merge                    | Deleta uma conta e transfere seu saldo para outra.                           |
| Inflation                        | Executa a inflação na rede (atualmente obsoleta).                            |
| Manage Data                      | Define, modifica ou deleta uma entrada de dados (nome/valor) para uma conta. |
| Bump Sequence                    | Avança o número de sequência de uma conta.                                   |
| Invoke Host Function             | Executa funções de contratos inteligentes (Soroban).                         |
| Extend Footprint TTL             | Estende o tempo de vida (TTL) de dados de contratos inteligentes.            |
| Restore Footprint                | Restaura dados de contratos inteligentes que expiraram.                      |
| Create Claimable Balance         | Cria um saldo resgatável para outra conta.                                   |
| Claim Claimable Balance          | Resgata um saldo resgatável.                                                 |
| Begin Sponsoring Future Reserves | Inicia o patrocínio de reservas futuras para uma conta.                      |
| End Sponsoring Future Reserves   | Finaliza o patrocínio de reservas futuras.                                   |
| Revoke Sponsorship               | Revoga o patrocínio de uma conta ou ativo.                                   |
| Clawback                         | Recupera ativos de uma conta (exige autorização).                            |
| Clawback Claimable Balance       | Recupera um saldo resgatável.                                                |
| Set Trustline Flags              | Define configurações específicas para linhas de confiança.                   |
| Liquidity Pool Deposit/Withdraw  | Deposita ou retira ativos de um pool de liquidez.                            |

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

## Smartcontracts

- o que é DSL (Domain Specific Language)
- o que é `#[contract]` e `#[contractimpl]`
- o que é o env: Env em `hello(env: Env, to: Symbol)`:
  - Interface com runtime
  - Acesso a storage, eventos, criptografia
- o que é o `#[no_std]`?
- Sem standard library
- Usa `soroban-sdk`
- Ambiente determinístico

