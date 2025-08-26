---
marp: true
theme: gaia
---

# **Workshop: Road to Meridian 3**

## **Dia 1: Segurança em Smartcontracts**

---

## Abertura

Bem-vindos ao **Workshop: Road to Meridian 3**! Hoje vamos mergulhar profundamente na segurança de smartcontracts na Stellar Network. Esta aula vai abordar conceitos avançados como TTL (Time to Live), autenticação, multisig e testes de segurança com fuzzing.

---

### Programa da aula:

0. **Quem somos e o que é o Road to Meridian?**
1. **Time to Live (TTL): Gerenciamento de Ciclo de Vida de Dados**
2. **Testes de Segurança com Fuzzing**
3. **Autenticação Simples em Smartcontracts**
4. **Autenticação Multisig: Segurança Distribuída**

---

## 0. Apresentação

### Lucas Oliveira

- Matemático (formado em 2021).
- +5 anos como Engenheiro Senior de Blockchain.
- Criação de Layer 1, SDKs, smart contracts (EVM e não-EVM).
- Liderou a entrega de 2 Projetos do DREX.
- Embaixador da Stellar no Brasil.
- Contribuidor F/OSS: +3 bibliotecas crypto publicadas.
- Head of Education @ NearX: Liderança em educação blockchain na LATAM.

---

### NearX

- Plataforma de educação em tecnologias emergentes (Web3, IA, Blockchain).
- Consultoria em Blockchain para Empresas.
- 30 Alunos na Pós Graduação Lato Senso.
- +9.000 alunos na Plataforma.
- +2.500 membros no Discord.
- Oferece: Pós-graduação, Plataforma por assinatura, Mentorias, Bootcamps, Hackathons
- Parcerias: Stellar, Animoca Brands, Optimism, Arbitrum, Starknet, ZkVerify, MultiverseX.

### Stellar

- +13Bi de captalização de mercado.
- Fundada em 2014 pelo Jed McCaleb, founder da Mt. Gox e co-founder da Ripple.
- Smartcontracts em Rust lançados em 2023 por Grandon Hoare.

### Road to Meridian

#### Workshop 1: Introdução ao Rust

- Aula 1: Criar e Publicar Bibliotecas em Rust
- Aula 2: Criar e Deployar Rest API CRUD em Rust
- Aula 3: Criar e Integrar WebAssembly em Rust

---

#### Workshop 2: Smartcontracts Básico na Stellar com Soroban

- Aula 1: Básico de Blockchain e Hello World
- Aula 2: Smartcontracts e Integração com Backend
- Aula 3: Smartcontracts e Integração com Frontend

---

#### Workshop 3: Smartcontracts Avançado na Stellar com Soroban

- Aula 1: Segurança em Smartcontracts
- Aula 2: Composabilidade em Protocolos Soroban
- Aula 3: Implementando Passkey Authn

---

## 1. Time to Live (TTL): Gerenciamento de Ciclo de Vida de Dados

O TTL é um mecanismo fundamental para controlar o tempo de vida dos dados no storage de smartcontracts. Vamos explorar os três tipos de storage e como o TTL afeta cada um.

### Tipos de Storage na Stellar

- **Temporary**: Dados temporários com TTL obrigatório
- **Persistent**: Dados permanentes com TTL opcional
- **Instance**: Dados da instância do contrato

---

### Contrato TTL Demo

```rust
#![no_std]
use soroban_sdk::{contract, contractimpl, symbol_short, Env, Symbol};

const INSTANCE: Symbol = symbol_short!("instance");
const TEMPORARY: Symbol = symbol_short!("temporary");
const PERSISTENT: Symbol = symbol_short!("persisten");

#[contract]
pub struct TtlContract;

#[contractimpl]
impl TtlContract {
    pub fn __constructor(env: Env) {
        if env.storage().instance().has(&INSTANCE) {
            return;
        }
        env.storage().instance().set(&INSTANCE, &0);
        env.storage().temporary().set(&TEMPORARY, &0);
        env.storage().persistent().set(&PERSISTENT, &0);
    }
}

```

---

### Implementação [INSTANCE]

```rust
#[contractimpl]
impl TtlContract {
    pub fn acc_instance(env: &Env) {
        let mut counter = env.storage().instance().get(&INSTANCE).unwrap_or(0);
        counter += 1;
        env.storage().instance().set(&INSTANCE, &counter);
    }

    pub fn get_instance(env: &Env) -> i32 {
        env.storage().instance().get(&INSTANCE).unwrap_or(0)
    }
}
```

---

### Implementação [TEMPORARY]

```rust
#[contractimpl]
impl TtlContract {
    pub fn acc_temporary(env: &Env) {
        let mut counter = env.storage().temporary().get(&TEMPORARY).unwrap_or(0);
        counter += 1;
        env.storage().temporary().set(&TEMPORARY, &counter);
    }

    pub fn get_temporary(env: &Env) -> i32 {
        env.storage().temporary().get(&TEMPORARY).unwrap_or(0)
    }
}
```

---

### Implementação [PERSISTENCE]

```rust
#[contractimpl]
impl TtlContract {
    pub fn acc_persistent(env: &Env) {
        let mut counter = env.storage().persistent().get(&PERSISTENT).unwrap_or(0);
        counter += 1;
        env.storage().persistent().set(&PERSISTENT, &counter);
    }

    pub fn get_persistent(env: &Env) -> i32 {
        env.storage().persistent().get(&PERSISTENT).unwrap_or(0)
    }
}
```

---

### HANDS-ON

---

## 2. Testes de Segurança com Fuzzing

Fuzzing é uma técnica de teste que envia dados aleatórios ou malformados para encontrar vulnerabilidades. Vamos implementar fuzzing nativo em Rust.

---

### Contrato Simples para Fuzzing

```rust
#[contract]
pub struct FuzzContract;

#[contractimpl]
impl FuzzContract {
    pub fn divide(env: Env, a: i32, b: i32) -> i32 {
        if b == 0 {
            panic_with_error!(&env, Error::DivisionByZero);
        }
        a / b
    }

    pub fn process_array(env: Env, data: Vec<u32>) -> u32 {
        if data.len() > 1000 {
            panic_with_error!(&env, Error::ArrayTooLarge);
        }
        data.iter().sum()
    }
}
```

---

### Implementação de Fuzz Tests

**MOSTRAR CRIACAO DE MODULO:**

```rust
#[cfg(test)]
mod fuzz_tests {
    use super::*;
    use quickcheck::{quickcheck, TestResult};

    #[quickcheck]
    fn fuzz_divide(a: i32, b: i32) -> TestResult {
        if b == 0 {
            return TestResult::discard();
        }

        let env = Env::default();
        let contract = FuzzContract::new(&env, contract_address);

        let result = contract.divide(&a, &b);
        TestResult::from_bool(result == a / b)
    }

    #[quickcheck]
    fn fuzz_array_processing(data: Vec<u32>) -> TestResult {
        if data.len() > 1000 {
            return TestResult::discard();
        }

        let env = Env::default();
        let contract = FuzzContract::new(&env, contract_address);

        let result = contract.process_array(&data);
        let expected: u32 = data.iter().sum();

        TestResult::from_bool(result == expected)
    }
}
```

---

### Executando Fuzz Tests

**MOSTRAR TERMINAL:** `cargo test fuzz_tests -- --nocapture`

```bash
# Instalar dependência de fuzzing
cargo add quickcheck --dev

# Executar testes de fuzzing
cargo test fuzz_tests

# Executar com mais iterações
QUICKCHECK_TESTS=10000 cargo test fuzz_tests
```

---

## 3. Autenticação Simples em Smartcontracts

A autenticação é crucial para controlar acesso a funções sensíveis. Vamos implementar um sistema de autenticação baseado em assinaturas.

### Contrato de Autenticação

**MOSTRAR CRIACAO DE MODULO:**

```rust
#[contract]
pub struct AuthContract;

#[contractimpl]
impl AuthContract {
    pub fn initialize(env: Env, admin: Address) {
        env.storage().instance().set(&symbol_short!("admin"), &admin);
    }

    pub fn set_value(env: Env, caller: Address, value: u32) {
        caller.require_auth();

        let admin: Address = env.storage().instance()
            .get(&symbol_short!("admin"))
            .unwrap();

        if caller != admin {
            panic_with_error!(&env, Error::Unauthorized);
        }

        env.storage().persistent().set(&symbol_short!("value"), &value);
    }

    pub fn get_value(env: Env) -> Option<u32> {
        env.storage().persistent().get(&symbol_short!("value"))
    }
}
```

---

### Script JavaScript para Teste de Auth

**MOSTRAR TERMINAL:** `node auth_test.js`

```javascript
const { Keypair, Contract, SorobanRpc } = require("@stellar/stellar-sdk");

// Criar keypairs
const admin = Keypair.random();
const user = Keypair.random();

// Inicializar contrato
await contract.initialize({ admin: admin.publicKey() });

// Teste com admin (deve funcionar)
try {
  await contract.set_value(
    { caller: admin.publicKey(), value: 42 },
    { source: admin }
  );
  console.log("✅ Admin conseguiu definir valor");
} catch (error) {
  console.log("❌ Erro inesperado:", error);
}

// Teste com usuário não autorizado (deve falhar)
try {
  await contract.set_value(
    { caller: user.publicKey(), value: 99 },
    { source: user }
  );
  console.log("❌ Usuário não autorizado conseguiu definir valor!");
} catch (error) {
  console.log("✅ Usuário não autorizado foi rejeitado");
}
```

---

## 4. Autenticação Multisig: Segurança Distribuída

Multisig (múltiplas assinaturas) aumenta a segurança exigindo aprovação de múltiplas partes. Vamos implementar um sistema 2-de-3.

### Contrato Multisig

**MOSTRAR CRIACAO DE MODULO:**

```rust
#[contract]
pub struct MultisigContract;

#[derive(Clone)]
#[contracttype]
pub struct MultisigState {
    pub signers: Vec<Address>,
    pub threshold: u32,
    pub value: bool,
    pub pending_change: Option<bool>,
    pub approvals: Vec<Address>,
}

#[contractimpl]
impl MultisigContract {
    pub fn initialize(env: Env, signers: Vec<Address>) {
        let state = MultisigState {
            signers,
            threshold: 2,
            value: true,
            pending_change: None,
            approvals: vec![&env],
        };
        env.storage().instance().set(&symbol_short!("state"), &state);
    }
}
```

---

### Implementação das Funções Multisig

**MOSTRAR CRIACAO DA FUNCAO:**

```rust
impl MultisigContract {
    pub fn propose_change(env: Env, signer: Address, new_value: bool) {
        signer.require_auth();

        let mut state: MultisigState = env.storage().instance()
            .get(&symbol_short!("state")).unwrap();

        if !state.signers.contains(&signer) {
            panic_with_error!(&env, Error::NotASigner);
        }

        state.pending_change = Some(new_value);
        state.approvals = vec![&env, signer];

        env.storage().instance().set(&symbol_short!("state"), &state);
    }

    pub fn approve_change(env: Env, signer: Address) {
        signer.require_auth();

        let mut state: MultisigState = env.storage().instance()
            .get(&symbol_short!("state")).unwrap();

        if !state.signers.contains(&signer) {
            panic_with_error!(&env, Error::NotASigner);
        }

        if !state.approvals.contains(&signer) {
            state.approvals.push(signer);
        }

        if state.approvals.len() >= state.threshold {
            state.value = state.pending_change.unwrap();
            state.pending_change = None;
            state.approvals = vec![&env];
        }

        env.storage().instance().set(&symbol_short!("state"), &state);
    }
}
```

---

### Script Python para Teste Multisig

**MOSTRAR TERMINAL:** `python multisig_test.py`

```python
from stellar_sdk import Keypair

# Criar 3 signatários
signer1 = Keypair.random()
signer2 = Keypair.random()
signer3 = Keypair.random()

signers = [signer1.public_key, signer2.public_key, signer3.public_key]

# Inicializar contrato
contract.initialize(signers)
print(f"Estado inicial: {contract.get_value()}")

# Signer1 propõe mudança
contract.propose_change(signer1.public_key, False, source=signer1)
print("Mudança proposta por signer1")

# Apenas 1 aprovação - não deve mudar
print(f"Estado após 1 aprovação: {contract.get_value()}")

# Signer2 aprova - agora deve mudar (2 de 3)
contract.approve_change(signer2.public_key, source=signer2)
print(f"Estado após 2 aprovações: {contract.get_value()}")
```

---

## Boas Práticas de Segurança

### Princípios Fundamentais

- **Princípio do Menor Privilégio**: Conceda apenas as permissões mínimas necessárias
- **Validação de Entrada**: Sempre valide todos os parâmetros de entrada
- **Fail-Safe**: Em caso de erro, falhe de forma segura
- **Auditabilidade**: Mantenha logs de todas as operações críticas

---

### Checklist de Segurança

- ✅ **Autenticação**: Verificar identidade do chamador
- ✅ **Autorização**: Verificar permissões do chamador
- ✅ **Validação**: Validar todos os inputs
- ✅ **Overflow**: Usar tipos seguros (SafeMath)
- ✅ **Reentrância**: Proteger contra ataques de reentrância
- ✅ **TTL**: Gerenciar ciclo de vida dos dados
- ✅ **Testes**: Implementar testes abrangentes incluindo fuzzing

---

### Ferramentas de Segurança

- **Fuzzing**: Testes com dados aleatórios
- **Static Analysis**: Análise estática do código
- **Formal Verification**: Verificação matemática
- **Audit**: Revisão por especialistas
- **Bug Bounty**: Programas de recompensa por bugs

---

## Revisão

1. **Time to Live (TTL)**

- [x] Três tipos de storage: Temporary, Persistent, Instance
- [x] TTL obrigatório para dados temporários
- [x] Extensão de TTL para manter dados vivos
- [x] Script Python demonstrando expiração de dados

2. **Testes de Segurança com Fuzzing**

- [x] Fuzzing nativo em Rust com quickcheck
- [x] Testes com dados aleatórios para encontrar bugs
- [x] Validação de edge cases e inputs maliciosos
- [x] Integração com cargo test

---

3. **Autenticação Simples**

- [x] Verificação de identidade com require_auth()
- [x] Controle de acesso baseado em endereços
- [x] Script JavaScript para testes de autorização
- [x] Tratamento de erros de autenticação

4. **Autenticação Multisig**

- [x] Sistema 2-de-3 para maior segurança
- [x] Propostas e aprovações distribuídas
- [x] Estado compartilhado entre múltiplos signatários
- [x] Script Python demonstrando fluxo completo

---

## Lição de casa

### Desafio de Aprendizagem

- **fácil**: Modifique o contrato TTL para suportar diferentes tipos de dados
- **médio**: Implemente um sistema de votação com fuzzing tests
- **difícil**: Crie um contrato multisig 3-de-5 com timelock

**Recursos:**

- [Soroban Security Best Practices](https://soroban.stellar.org/docs/security)
- [Rust Fuzzing Book](https://rust-fuzz.github.io/book/)
- [Stellar Multisig Examples](https://github.com/stellar/soroban-examples)

### Desafio de Carreira

- Post no LinkedIn e Twitter com #road2meridian (1/3)
- Marque a Stellar
- Marque a NearX

### Desafio de Comunidade

- Poste uma foto da sua mesa de trabalho! (discord da nearx)
- Poste uma mensagem para encorajar as pessoas (discord da stellar)

---

## Próxima Aula

Na próxima aula, vamos explorar **Composabilidade em Protocolos Soroban**. Até lá!
