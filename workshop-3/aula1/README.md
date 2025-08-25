# Roteiro Final: Workshop: Road to Meridian 3 – Dia 1: Segurança em Smartcontracts

## Introdução: Bem-vindos ao Workshop: Road to Meridian 3 🚀

Olá, mundo!

**Você já se perguntou como os engenheiros de blockchain garantem que bilhões de dólares estejam seguros em smartcontracts?**

Meu nome é **Lucas Oliveira**, sou **Head of Education na NearX** e **Engenheiro de Blockchain** com mais de 5 anos de experiência, e hoje você está dando um passo crucial numa jornada que vai transformar a forma como você pensa sobre segurança em sistemas descentralizados.

Seja bem-vindo ao **Workshop: Road to Meridian 3** — nossa terceira e mais avançada imersão, onde vamos mergulhar profundamente nos aspectos de segurança, composabilidade e autenticação avançada em smartcontracts na Stellar Network.

Este não é apenas mais um workshop sobre blockchain. Aqui, você vai aprender as técnicas e práticas que os melhores engenheiros de segurança blockchain usam no mundo real para proteger protocolos que movimentam milhões de dólares diariamente.

Hoje é o Dia 1, e nosso foco é **Segurança em Smartcontracts**. Vamos construir e testar quatro tipos diferentes de contratos, cada um demonstrando aspectos críticos de segurança que todo desenvolvedor blockchain precisa dominar.

Você vai sair daqui sabendo como implementar Time to Live (TTL) para gerenciar o ciclo de vida de dados, como usar fuzzing para encontrar vulnerabilidades antes que hackers as encontrem, como implementar autenticação robusta e como criar sistemas multisig que distribuem o risco entre múltiplas partes.

Se você chegou até aqui, significa que já domina os fundamentos do Rust e já sabe criar smartcontracts básicos na Stellar. Agora é hora de elevar seu nível e pensar como um engenheiro de segurança.

Prepare-se para entender conceitos avançados de segurança, testes automatizados e arquiteturas distribuídas que vão fazer você se destacar no mercado de blockchain.

O caminho para o Meridian está quase completo, e hoje você vai dar um dos passos mais importantes.

Vamos começar!

## Capítulo 1: Time to Live (TTL) - Gerenciamento Inteligente do Ciclo de Vida de Dados

Antes de mergulharmos nos aspectos mais complexos de segurança, precisamos entender um conceito fundamental que afeta diretamente a economia e a segurança dos nossos contratos: o **Time to Live**, ou TTL.

Pense no TTL como um "prazo de validade" para os dados que você armazena no blockchain. Assim como alimentos têm data de vencimento, os dados em smartcontracts também podem e devem ter um tempo limite de vida útil.

Mas por que isso é importante? Imagine se todos os dados que você já salvou no seu computador nunca pudessem ser deletados. Eventualmente, você ficaria sem espaço de armazenamento, certo? O mesmo acontece com blockchains - elas precisam de mecanismos para gerenciar o crescimento do estado global.

Na Stellar Network, temos três tipos diferentes de storage, cada um com suas próprias características de TTL:

**Temporary Storage**: Este é o tipo de armazenamento mais econômico, mas com uma pegadinha - ele **obrigatoriamente** precisa de um TTL. Os dados aqui são como uma nota adesiva que você cola na geladeira sabendo que vai removê-la em alguns dias. É perfeito para dados que você sabe que não vai precisar para sempre, como resultados de cálculos temporários ou cache de operações.

**Persistent Storage**: Este é o armazenamento "premium" - mais caro, mas os dados podem viver para sempre se você quiser. O TTL aqui é opcional. É como comprar um HD externo - você paga mais, mas tem a garantia de que seus dados estarão lá quando precisar.

**Instance Storage**: Este armazenamento está ligado à própria instância do contrato e geralmente contém configurações e metadados essenciais para o funcionamento do contrato.

Vamos ver isso na prática. Vou mostrar como criar um contrato que demonstra todos esses conceitos.

**MOSTRAR CRIACAO DE MODULO:**

Agora vou criar um contrato que vai nos permitir experimentar com diferentes tipos de storage e TTL:

```rust
#[contract]
pub struct TtlContract;

#[contractimpl]
impl TtlContract {
    pub fn store_temp(env: Env, key: Symbol, value: u32, ttl: u32) {
        // Armazenar no storage temporário
        env.storage().temporary().set(&key, &value);
        // Definir TTL - obrigatório para temporary storage
        env.storage().temporary().extend_ttl(&key, ttl, ttl);
    }
    
    pub fn store_persistent(env: Env, key: Symbol, value: u32) {
        // Armazenar no storage persistente - TTL opcional
        env.storage().persistent().set(&key, &value);
    }
    
    pub fn get_data(env: Env, key: Symbol) -> Option<u32> {
        // Tentar buscar primeiro no temporary, depois no persistent
        env.storage().temporary().get(&key)
            .or_else(|| env.storage().persistent().get(&key))
    }
    
    pub fn extend_ttl(env: Env, key: Symbol, new_ttl: u32) {
        // Estender o TTL de dados temporários
        env.storage().temporary().extend_ttl(&key, new_ttl, new_ttl);
    }
}
```

Veja como este contrato nos dá controle total sobre onde e por quanto tempo armazenamos nossos dados. A função `store_temp` não apenas salva o dado, mas também define explicitamente por quantos ledgers (blocos) ele deve permanecer vivo.

A função `get_data` é inteligente - ela primeiro procura nos dados temporários (mais baratos) e só depois nos persistentes. Isso é uma otimização comum em sistemas reais.

Agora, vamos testar esse comportamento com um script Python que vai nos mostrar exatamente o que acontece quando o TTL expira:

**MOSTRAR TERMINAL:** `python ttl_test.py`

```python
import stellar_sdk
from stellar_sdk.soroban import SorobanServer
import time

# Conectar ao servidor Soroban
server = SorobanServer("https://soroban-testnet.stellar.org")

# Testar armazenamento temporário com TTL curto
print("=== Teste de TTL - Armazenamento Temporário ===")
contract.store_temp("temp_key", 42, 100)  # TTL de 100 ledgers
print(f"Valor armazenado: {contract.get_data('temp_key')}")

# Verificar o valor imediatamente
value = contract.get_data("temp_key")
print(f"Valor recuperado imediatamente: {value}")

# Simular passagem do tempo (em um ambiente real, isso seria ledgers)
print("\nSimulando passagem do tempo...")
time.sleep(5)

# Em um ambiente de teste, vamos simular a expiração
print("Verificando se o valor ainda existe após simulação de expiração...")
try:
    value = contract.get_data("temp_key")
    if value is None:
        print("✅ TTL funcionou: dados temporários expiraram como esperado")
    else:
        print(f"⚠️  Dados ainda existem: {value} (normal em testnet)")
except Exception as e:
    print(f"❌ Erro ao acessar dados expirados: {e}")

# Demonstrar extensão de TTL
print("\n=== Teste de Extensão de TTL ===")
contract.store_temp("extend_key", 99, 50)  # TTL inicial de 50
print("Dados armazenados com TTL de 50 ledgers")

# Estender o TTL
contract.extend_ttl("extend_key", 200)
print("TTL estendido para 200 ledgers")

value = contract.get_data("extend_key")
print(f"Valor após extensão: {value}")

# Comparar com storage persistente
print("\n=== Comparação com Storage Persistente ===")
contract.store_persistent("persistent_key", 123)
print("Dados armazenados em storage persistente (sem TTL)")

value = contract.get_data("persistent_key")
print(f"Valor persistente: {value}")
```

Este script nos mostra na prática a diferença entre os tipos de storage. Você vai ver que dados temporários podem desaparecer, enquanto dados persistentes permanecem disponíveis.

O TTL não é apenas uma curiosidade técnica - ele tem implicações econômicas reais. Dados temporários são mais baratos porque o protocolo sabe que não precisará mantê-los para sempre. Isso permite que a rede mantenha custos baixos e performance alta.

Em aplicações reais, você usaria temporary storage para coisas como:
- Cache de cálculos complexos
- Resultados de oráculos que ficam obsoletos rapidamente
- Estados temporários de jogos ou aplicações
- Dados de sessão que não precisam ser permanentes

E usaria persistent storage para:
- Saldos de tokens
- Configurações críticas do protocolo
- Histórico de transações importantes
- Metadados que definem o comportamento do contrato

## Capítulo 2: Testes de Segurança com Fuzzing - Encontrando Bugs Antes dos Hackers

Agora que entendemos como gerenciar o ciclo de vida dos dados, vamos falar sobre uma das técnicas mais poderosas para encontrar vulnerabilidades em smartcontracts: o **fuzzing**.

Fuzzing é como ter um hacker ético trabalhando 24/7 para você. É uma técnica de teste automatizado que bombardeia seu código com milhares ou milhões de inputs aleatórios, malformados e extremos, tentando quebrar seu contrato de todas as formas possíveis.

Pense assim: você pode testar manualmente seu contrato com alguns casos que você imagina, mas um fuzzer vai testar com casos que você nunca pensaria. Ele vai tentar números negativos onde você espera positivos, strings vazias onde você espera texto, arrays gigantescos onde você espera listas pequenas.

O melhor de tudo? O Rust tem suporte nativo para fuzzing, e podemos integrar isso diretamente nos nossos testes de smartcontracts.

Vamos criar um contrato simples que parece seguro à primeira vista, mas que pode ter vulnerabilidades que só o fuzzing vai encontrar:

**MOSTRAR CRIACAO DE MODULO:**

```rust
#[contract]
pub struct FuzzContract;

#[derive(Copy, Clone, Debug, Eq, PartialEq, PartialOrd, Ord)]
#[contracttype]
pub enum Error {
    DivisionByZero = 1,
    ArrayTooLarge = 2,
    InvalidInput = 3,
}

#[contractimpl]
impl FuzzContract {
    pub fn divide(env: Env, a: i32, b: i32) -> i32 {
        // Esta função parece simples, mas tem edge cases
        if b == 0 {
            panic_with_error!(&env, Error::DivisionByZero);
        }
        
        // E se a for i32::MIN e b for -1? Isso causa overflow!
        a / b
    }
    
    pub fn process_array(env: Env, data: Vec<u32>) -> u32 {
        // Proteção básica contra arrays muito grandes
        if data.len() > 1000 {
            panic_with_error!(&env, Error::ArrayTooLarge);
        }
        
        // Mas e se a soma dos elementos causar overflow?
        data.iter().sum()
    }
    
    pub fn calculate_percentage(env: Env, value: u32, percentage: u32) -> u32 {
        // Parece seguro, mas e se percentage for maior que 100?
        if percentage > 100 {
            panic_with_error!(&env, Error::InvalidInput);
        }
        
        // E se value * percentage causar overflow?
        (value * percentage) / 100
    }
}
```

Você consegue ver os problemas potenciais neste código? Alguns são óbvios, outros são sutis. É exatamente para isso que serve o fuzzing - encontrar esses casos extremos que nossa mente humana pode não considerar.

Agora vamos implementar testes de fuzzing que vão bombardear essas funções com inputs aleatórios:

**MOSTRAR CRIACAO DE MODULO:**

```rust
#[cfg(test)]
mod fuzz_tests {
    use super::*;
    use quickcheck::{quickcheck, TestResult, Arbitrary};
    use soroban_sdk::{Env, testutils::Address as _};
    
    // Implementar Arbitrary para nossos tipos customizados se necessário
    #[derive(Clone, Debug)]
    struct SafeU32(u32);
    
    impl Arbitrary for SafeU32 {
        fn arbitrary(g: &mut quickcheck::Gen) -> Self {
            // Limitar o range para evitar overflows óbvios em alguns testes
            SafeU32(u32::arbitrary(g) % 1_000_000)
        }
    }
    
    #[quickcheck]
    fn fuzz_divide(a: i32, b: i32) -> TestResult {
        // Descartar casos que sabemos que devem falhar
        if b == 0 {
            return TestResult::discard();
        }
        
        // Descartar o caso de overflow conhecido
        if a == i32::MIN && b == -1 {
            return TestResult::discard();
        }
        
        let env = Env::default();
        let contract_address = env.register_contract(None, FuzzContract);
        let client = FuzzContractClient::new(&env, &contract_address);
        
        // Este teste deve sempre passar se não descartarmos
        let result = client.divide(&a, &b);
        let expected = a / b;
        
        TestResult::from_bool(result == expected)
    }
    
    #[quickcheck]
    fn fuzz_array_processing(data: Vec<u32>) -> TestResult {
        // Descartar arrays muito grandes que sabemos que vão falhar
        if data.len() > 1000 {
            return TestResult::discard();
        }
        
        // Descartar casos onde sabemos que vai dar overflow
        let sum_check: Option<u32> = data.iter().try_fold(0u32, |acc, &x| acc.checked_add(x));
        if sum_check.is_none() {
            return TestResult::discard();
        }
        
        let env = Env::default();
        let contract_address = env.register_contract(None, FuzzContract);
        let client = FuzzContractClient::new(&env, &contract_address);
        
        let result = client.process_array(&data);
        let expected: u32 = data.iter().sum();
        
        TestResult::from_bool(result == expected)
    }
    
    #[quickcheck]
    fn fuzz_percentage_calculation(value: SafeU32, percentage: u32) -> TestResult {
        let SafeU32(value) = value;
        
        // Descartar percentuais inválidos
        if percentage > 100 {
            return TestResult::discard();
        }
        
        // Descartar casos que podem causar overflow na multiplicação
        if value > u32::MAX / 100 {
            return TestResult::discard();
        }
        
        let env = Env::default();
        let contract_address = env.register_contract(None, FuzzContract);
        let client = FuzzContractClient::new(&env, &contract_address);
        
        let result = client.calculate_percentage(&value, &percentage);
        let expected = (value * percentage) / 100;
        
        TestResult::from_bool(result == expected)
    }
    
    // Teste de fuzzing mais agressivo - tentando quebrar o contrato
    #[quickcheck]
    fn fuzz_divide_aggressive(a: i32, b: i32) -> TestResult {
        let env = Env::default();
        let contract_address = env.register_contract(None, FuzzContract);
        let client = FuzzContractClient::new(&env, &contract_address);
        
        // Não descartamos nada - queremos ver o que quebra
        match std::panic::catch_unwind(|| {
            client.divide(&a, &b)
        }) {
            Ok(result) => {
                // Se não deu panic, o resultado deve ser correto
                if b != 0 && !(a == i32::MIN && b == -1) {
                    TestResult::from_bool(result == a / b)
                } else {
                    TestResult::failed()
                }
            },
            Err(_) => {
                // Se deu panic, deve ser por uma razão válida
                TestResult::from_bool(b == 0 || (a == i32::MIN && b == -1))
            }
        }
    }
}
```

Esses testes de fuzzing são poderosos porque eles vão executar milhares de vezes com inputs completamente aleatórios. Cada execução é uma tentativa de quebrar seu contrato.

Vamos executar esses testes e ver o que eles encontram:

**MOSTRAR TERMINAL:** `cargo test fuzz_tests -- --nocapture`

```bash
# Primeiro, vamos adicionar a dependência de fuzzing
echo '[dev-dependencies]' >> Cargo.toml
echo 'quickcheck = "1.0"' >> Cargo.toml

# Executar testes de fuzzing com configuração padrão (100 testes por função)
cargo test fuzz_tests

# Executar com mais iterações para encontrar bugs mais raros
QUICKCHECK_TESTS=10000 cargo test fuzz_tests

# Executar apenas os testes agressivos
cargo test fuzz_divide_aggressive

# Ver output detalhado
cargo test fuzz_tests -- --nocapture
```

Quando você executar esses testes, pode descobrir bugs que não esperava. Por exemplo, o fuzzer pode encontrar:

1. **Integer Overflow**: Casos onde `a * percentage` na função `calculate_percentage` causa overflow
2. **Edge Cases**: Combinações específicas de inputs que causam comportamentos inesperados
3. **Performance Issues**: Arrays que, mesmo sendo menores que 1000 elementos, causam lentidão

O fuzzing é especialmente importante em smartcontracts porque:
- **Dinheiro Real**: Bugs podem resultar em perda de fundos
- **Imutabilidade**: Uma vez deployado, é difícil ou impossível corrigir
- **Adversários Ativos**: Hackers estão constantemente procurando vulnerabilidades
- **Casos Extremos**: Usuários maliciosos vão tentar inputs que você nunca imaginou

Em projetos reais, você deveria executar fuzzing por horas ou dias, com milhões de testes, antes de fazer deploy de um contrato que vai lidar com valores significativos.

## Capítulo 3: Autenticação Simples - Controlando Quem Pode Fazer O Quê

Agora que sabemos como encontrar bugs com fuzzing, vamos falar sobre um dos aspectos mais críticos de segurança em smartcontracts: **autenticação**.

Autenticação em blockchain é diferente de autenticação em aplicações web tradicionais. Não temos senhas, cookies ou sessões. Em vez disso, temos **assinaturas criptográficas** que provam que uma transação realmente veio de quem diz que veio.

Pense assim: quando você assina um documento importante, sua assinatura prova que você concordou com aquele documento. Em blockchain, assinaturas digitais fazem a mesma coisa - elas provam que você autorizou uma determinada operação.

Na Stellar Network, isso é implementado através do método `require_auth()`, que verifica se o endereço que está chamando a função realmente assinou a transação.

Vamos criar um contrato que demonstra autenticação simples:

**MOSTRAR CRIACAO DE MODULO:**

```rust
#[contract]
pub struct AuthContract;

#[derive(Copy, Clone, Debug, Eq, PartialEq, PartialOrd, Ord)]
#[contracttype]
pub enum Error {
    Unauthorized = 1,
    NotInitialized = 2,
    AlreadyInitialized = 3,
}

#[contractimpl]
impl AuthContract {
    pub fn initialize(env: Env, admin: Address) {
        // Verificar se já foi inicializado
        if env.storage().instance().has(&symbol_short!("admin")) {
            panic_with_error!(&env, Error::AlreadyInitialized);
        }
        
        // Definir o administrador
        env.storage().instance().set(&symbol_short!("admin"), &admin);
        
        // Inicializar com um valor padrão
        env.storage().persistent().set(&symbol_short!("value"), &0u32);
    }
    
    pub fn set_value(env: Env, caller: Address, value: u32) {
        // CRÍTICO: Verificar se o caller realmente assinou esta transação
        caller.require_auth();
        
        // Verificar se o contrato foi inicializado
        let admin: Address = env.storage().instance()
            .get(&symbol_short!("admin"))
            .unwrap_or_else(|| panic_with_error!(&env, Error::NotInitialized));
            
        // Verificar se o caller é o admin
        if caller != admin {
            panic_with_error!(&env, Error::Unauthorized);
        }
        
        // Se chegou até aqui, está autorizado
        env.storage().persistent().set(&symbol_short!("value"), &value);
        
        // Log da operação (em um contrato real, você poderia emitir eventos)
        env.storage().persistent().set(
            &symbol_short!("last_update"), 
            &env.ledger().sequence()
        );
    }
    
    pub fn get_value(env: Env) -> u32 {
        // Leitura não precisa de autenticação
        env.storage().persistent()
            .get(&symbol_short!("value"))
            .unwrap_or(0)
    }
    
    pub fn get_admin(env: Env) -> Option<Address> {
        // Permitir que qualquer um veja quem é o admin
        env.storage().instance().get(&symbol_short!("admin"))
    }
    
    pub fn transfer_admin(env: Env, current_admin: Address, new_admin: Address) {
        // Verificar autenticação do admin atual
        current_admin.require_auth();
        
        // Verificar se é realmente o admin atual
        let stored_admin: Address = env.storage().instance()
            .get(&symbol_short!("admin"))
            .unwrap_or_else(|| panic_with_error!(&env, Error::NotInitialized));
            
        if current_admin != stored_admin {
            panic_with_error!(&env, Error::Unauthorized);
        }
        
        // Transferir a propriedade
        env.storage().instance().set(&symbol_short!("admin"), &new_admin);
    }
}
```

Veja como este contrato implementa várias camadas de segurança:

1. **Inicialização Única**: O contrato só pode ser inicializado uma vez
2. **Verificação de Assinatura**: `require_auth()` garante que o caller assinou a transação
3. **Controle de Acesso**: Apenas o admin pode modificar valores
4. **Transferência Segura**: O admin pode transferir seus privilégios para outro endereço
5. **Auditabilidade**: Registramos quando a última atualização foi feita

Agora vamos testar este contrato com JavaScript para ver como a autenticação funciona na prática:

**MOSTRAR TERMINAL:** `node auth_test.js`

```javascript
const { 
    Keypair, 
    Contract, 
    SorobanRpc, 
    TransactionBuilder,
    Networks,
    Operation
} = require('@stellar/stellar-sdk');

// Configurar conexão com a rede de teste
const server = new SorobanRpc.Server('https://soroban-testnet.stellar.org');

// Criar keypairs para teste
const admin = Keypair.random();
const user = Keypair.random();
const newAdmin = Keypair.random();

console.log('=== Teste de Autenticação Simples ===');
console.log(`Admin: ${admin.publicKey()}`);
console.log(`User: ${user.publicKey()}`);
console.log(`New Admin: ${newAdmin.publicKey()}`);

// Função auxiliar para criar e assinar transações
async function callContract(method, params, signer) {
    try {
        const account = await server.getAccount(signer.publicKey());
        
        const transaction = new TransactionBuilder(account, {
            fee: '100',
            networkPassphrase: Networks.TESTNET
        })
        .addOperation(Operation.invokeContract({
            contract: contractAddress,
            function: method,
            args: params
        }))
        .setTimeout(30)
        .build();
        
        transaction.sign(signer);
        
        const result = await server.sendTransaction(transaction);
        return result;
    } catch (error) {
        throw error;
    }
}

async function runAuthTests() {
    try {
        // 1. Inicializar o contrato
        console.log('\n1. Inicializando contrato...');
        await callContract('initialize', [admin.publicKey()], admin);
        console.log('✅ Contrato inicializado com sucesso');
        
        // 2. Verificar se o admin foi definido corretamente
        const storedAdmin = await contract.get_admin();
        console.log(`Admin armazenado: ${storedAdmin}`);
        
        // 3. Teste com admin (deve funcionar)
        console.log('\n2. Testando acesso com admin...');
        await callContract('set_value', [admin.publicKey(), 42], admin);
        
        const value = await contract.get_value();
        console.log(`✅ Admin conseguiu definir valor: ${value}`);
        
        // 4. Teste com usuário não autorizado (deve falhar)
        console.log('\n3. Testando acesso com usuário não autorizado...');
        try {
            await callContract('set_value', [user.publicKey(), 99], user);
            console.log('❌ ERRO: Usuário não autorizado conseguiu definir valor!');
        } catch (error) {
            console.log('✅ Usuário não autorizado foi rejeitado corretamente');
            console.log(`   Erro: ${error.message}`);
        }
        
        // 5. Teste de transferência de admin
        console.log('\n4. Testando transferência de admin...');
        await callContract('transfer_admin', [admin.publicKey(), newAdmin.publicKey()], admin);
        console.log('✅ Admin transferido com sucesso');
        
        // 6. Verificar se o novo admin funciona
        console.log('\n5. Testando novo admin...');
        await callContract('set_value', [newAdmin.publicKey(), 123], newAdmin);
        
        const newValue = await contract.get_value();
        console.log(`✅ Novo admin conseguiu definir valor: ${newValue}`);
        
        // 7. Verificar se o admin antigo não funciona mais
        console.log('\n6. Testando admin antigo (deve falhar)...');
        try {
            await callContract('set_value', [admin.publicKey(), 456], admin);
            console.log('❌ ERRO: Admin antigo ainda tem acesso!');
        } catch (error) {
            console.log('✅ Admin antigo foi revogado corretamente');
        }
        
        // 8. Teste de ataque: tentar se passar por admin sem assinar
        console.log('\n7. Testando ataque de impersonificação...');
        try {
            // Tentar chamar com endereço do admin mas assinando com user
            await callContract('set_value', [admin.publicKey(), 789], user);
            console.log('❌ ERRO: Ataque de impersonificação funcionou!');
        } catch (error) {
            console.log('✅ Ataque de impersonificação foi bloqueado');
            console.log('   Isso prova que require_auth() funciona corretamente');
        }
        
    } catch (error) {
        console.error('Erro durante os testes:', error);
    }
}

// Executar os testes
runAuthTests();
```

Este script demonstra vários aspectos importantes da autenticação:

1. **Prova de Propriedade**: `require_auth()` garante que apenas quem tem a chave privada pode autorizar operações
2. **Controle de Acesso**: O contrato verifica se o endereço autenticado tem permissão para a operação
3. **Transferência Segura**: Administradores podem transferir privilégios de forma segura
4. **Proteção contra Ataques**: Tentativas de impersonificação são automaticamente bloqueadas

A autenticação simples é a base de sistemas mais complexos. Em aplicações reais, você pode ter:
- **Múltiplos Roles**: Admin, Moderador, Usuário, etc.
- **Permissões Granulares**: Diferentes funções requerem diferentes níveis de acesso
- **Timeouts**: Permissões que expiram após um tempo
- **Delegação**: Permitir que outros endereços ajam em seu nome

## Capítulo 4: Autenticação Multisig - Distribuindo o Risco e Aumentando a Segurança

Agora chegamos ao conceito mais avançado de autenticação que vamos ver hoje: **Multisig**, ou múltiplas assinaturas.

Imagine que você é o CEO de uma empresa e precisa autorizar uma transferência de 1 milhão de dólares. Seria seguro se apenas você pudesse autorizar isso? Provavelmente não. Na maioria das empresas, operações críticas requerem aprovação de múltiplas pessoas - talvez você, o CFO e um membro do conselho.

Multisig funciona exatamente assim em blockchain. Em vez de uma única pessoa ter controle total, você distribui o poder entre múltiplas partes, e operações críticas só acontecem quando um número suficiente dessas partes concordam.

O padrão mais comum é "M-de-N", onde você precisa de M assinaturas de um total de N signatários possíveis. Por exemplo:
- **2-de-3**: Precisa de 2 aprovações de 3 pessoas possíveis
- **3-de-5**: Precisa de 3 aprovações de 5 pessoas possíveis
- **5-de-7**: Precisa de 5 aprovações de 7 pessoas possíveis

Vamos implementar um sistema 2-de-3 que controla uma simples variável booleana. Pode parecer simples, mas os conceitos se aplicam a qualquer operação crítica:

**MOSTRAR CRIACAO DE MODULO:**

```rust
#[contract]
pub struct MultisigContract;

#[derive(Clone, Debug, Eq, PartialEq)]
#[contracttype]
pub struct MultisigState {
    pub signers: Vec<Address>,
    pub threshold: u32,
    pub value: bool,
    pub pending_change: Option<bool>,
    pub approvals: Vec<Address>,
    pub proposal_ledger: u32,
}

#[derive(Copy, Clone, Debug, Eq, PartialEq, PartialOrd, Ord)]
#[contracttype]
pub enum Error {
    NotASigner = 1,
    AlreadyApproved = 2,
    NoPendingProposal = 3,
    ProposalExpired = 4,
    InsufficientApprovals = 5,
    AlreadyInitialized = 6,
}

#[contractimpl]
impl MultisigContract {
    pub fn initialize(env: Env, signers: Vec<Address>, threshold: u32) {
        // Verificar se já foi inicializado
        if env.storage().instance().has(&symbol_short!("state")) {
            panic_with_error!(&env, Error::AlreadyInitialized);
        }
        
        // Validações básicas
        assert!(threshold > 0, "Threshold deve ser maior que 0");
        assert!(threshold <= signers.len() as u32, "Threshold não pode ser maior que o número de signers");
        assert!(signers.len() >= 2, "Deve ter pelo menos 2 signers");
        
        let state = MultisigState {
            signers,
            threshold,
            value: true,  // Valor inicial
            pending_change: None,
            approvals: vec![&env],
            proposal_ledger: 0,
        };
        
        env.storage().instance().set(&symbol_short!("state"), &state);
    }
    
    pub fn propose_change(env: Env, signer: Address, new_value: bool) {
        // Verificar autenticação
        signer.require_auth();
        
        let mut state: MultisigState = env.storage().instance()
            .get(&symbol_short!("state"))
            .unwrap();
            
        // Verificar se é um signer válido
        if !state.signers.contains(&signer) {
            panic_with_error!(&env, Error::NotASigner);
        }
        
        // Iniciar nova proposta
        state.pending_change = Some(new_value);
        state.approvals = vec![&env, signer.clone()];
        state.proposal_ledger = env.ledger().sequence();
        
        env.storage().instance().set(&symbol_short!("state"), &state);
        
        // Em um contrato real, você emitiria um evento aqui
        env.storage().temporary().set(
            &symbol_short!("last_proposal"), 
            &(signer, new_value, env.ledger().sequence())
        );
    }
    
    pub fn approve_change(env: Env, signer: Address) {
        // Verificar autenticação
        signer.require_auth();
        
        let mut state: MultisigState = env.storage().instance()
            .get(&symbol_short!("state"))
            .unwrap();
            
        // Verificar se é um signer válido
        if !state.signers.contains(&signer) {
            panic_with_error!(&env, Error::NotASigner);
        }
        
        // Verificar se há uma proposta pendente
        if state.pending_change.is_none() {
            panic_with_error!(&env, Error::NoPendingProposal);
        }
        
        // Verificar se a proposta não expirou (exemplo: 1000 ledgers = ~1.4 horas)
        if env.ledger().sequence() > state.proposal_ledger + 1000 {
            panic_with_error!(&env, Error::ProposalExpired);
        }
        
        // Verificar se já aprovou
        if state.approvals.contains(&signer) {
            panic_with_error!(&env, Error::AlreadyApproved);
        }
        
        // Adicionar aprovação
        state.approvals.push(signer);
        
        // Verificar se atingiu o threshold
        if state.approvals.len() as u32 >= state.threshold {
            // Executar a mudança
            state.value = state.pending_change.unwrap();
            state.pending_change = None;
            state.approvals = vec![&env];
            
            // Log da execução
            env.storage().temporary().set(
                &symbol_short!("last_execution"), 
                &(state.value, env.ledger().sequence())
            );
        }
        
        env.storage().instance().set(&symbol_short!("state"), &state);
    }
    
    pub fn get_value(env: Env) -> bool {
        let state: MultisigState = env.storage().instance()
            .get(&symbol_short!("state"))
            .unwrap();
        state.value
    }
    
    pub fn get_state(env: Env) -> MultisigState {
        env.storage().instance()
            .get(&symbol_short!("state"))
            .unwrap()
    }
    
    pub fn cancel_proposal(env: Env, signer: Address) {
        signer.require_auth();
        
        let mut state: MultisigState = env.storage().instance()
            .get(&symbol_short!("state"))
            .unwrap();
            
        // Apenas signers podem cancelar
        if !state.signers.contains(&signer) {
            panic_with_error!(&env, Error::NotASigner);
        }
        
        // Verificar se há proposta para cancelar
        if state.pending_change.is_none() {
            panic_with_error!(&env, Error::NoPendingProposal);
        }
        
        // Cancelar a proposta
        state.pending_change = None;
        state.approvals = vec![&env];
        
        env.storage().instance().set(&symbol_short!("state"), &state);
    }
}
```

Este contrato implementa um sistema multisig completo com várias funcionalidades importantes:

1. **Propostas**: Qualquer signer pode propor uma mudança
2. **Aprovações**: Outros signers podem aprovar a proposta
3. **Threshold**: A mudança só acontece quando o número mínimo de aprovações é atingido
4. **Expiração**: Propostas expiram após um tempo para evitar ataques de timing
5. **Cancelamento**: Propostas podem ser canceladas se necessário
6. **Auditabilidade**: Todas as operações são registradas

Agora vamos testar este sistema com um script Python que simula o fluxo completo:

**MOSTRAR TERMINAL:** `python multisig_test.py`

```python
from stellar_sdk import Keypair
import time

# Criar 3 signatários para o sistema 2-de-3
signer1 = Keypair.random()
signer2 = Keypair.random()
signer3 = Keypair.random()

signers = [signer1.public_key, signer2.public_key, signer3.public_key]
threshold = 2

print("=== Teste de Sistema Multisig 2-de-3 ===")
print(f"Signer 1: {signer1.public_key}")
print(f"Signer 2: {signer2.public_key}")
print(f"Signer 3: {signer3.public_key}")
print(f"Threshold: {threshold} de {len(signers)}")

def print_state():
    state = contract.get_state()
    print(f"\n--- Estado Atual ---")
    print(f"Valor: {state.value}")
    print(f"Proposta pendente: {state.pending_change}")
    print(f"Aprovações: {len(state.approvals)} de {state.threshold}")
    if state.approvals:
        print(f"Aprovado por: {[str(addr) for addr in state.approvals]}")

try:
    # 1. Inicializar o contrato
    print("\n1. Inicializando contrato multisig...")
    contract.initialize(signers, threshold)
    print("✅ Contrato inicializado")
    print_state()
    
    # 2. Signer1 propõe mudança de True para False
    print("\n2. Signer1 propõe mudança para False...")
    contract.propose_change(signer1.public_key, False, source=signer1)
    print("✅ Proposta criada")
    print_state()
    
    # 3. Verificar que ainda não mudou (apenas 1 aprovação)
    current_value = contract.get_value()
    print(f"\n3. Valor atual após 1 aprovação: {current_value}")
    if current_value == True:
        print("✅ Correto: valor não mudou com apenas 1 aprovação")
    else:
        print("❌ ERRO: valor mudou com apenas 1 aprovação!")
    
    # 4. Signer2 aprova a mudança (agora temos 2 aprovações = threshold)
    print("\n4. Signer2 aprova a mudança...")
    contract.approve_change(signer2.public_key, source=signer2)
    print("✅ Segunda aprovação registrada")
    print_state()
    
    # 5. Verificar que agora mudou
    current_value = contract.get_value()
    print(f"\n5. Valor atual após 2 aprovações: {current_value}")
    if current_value == False:
        print("✅ Correto: valor mudou após atingir o threshold")
    else:
        print("❌ ERRO: valor não mudou mesmo atingindo o threshold!")
    
    # 6. Teste: Signer3 tenta aprovar uma proposta que já foi executada
    print("\n6. Testando aprovação de proposta já executada...")
    try:
        contract.approve_change(signer3.public_key, source=signer3)
        print("❌ ERRO: conseguiu aprovar proposta já executada")
    except Exception as e:
        print("✅ Correto: não pode aprovar proposta já executada")
        print(f"   Erro: {str(e)}")
    
    # 7. Nova proposta: voltar para True
    print("\n7. Signer2 propõe mudança de volta para True...")
    contract.propose_change(signer2.public_key, True, source=signer2)
    print("✅ Nova proposta criada")
    print_state()
    
    # 8. Teste: mesmo signer tenta aprovar novamente
    print("\n8. Testando dupla aprovação pelo mesmo signer...")
    try:
        contract.approve_change(signer2.public_key, source=signer2)
        print("❌ ERRO: mesmo signer conseguiu aprovar duas vezes")
    except Exception as e:
        print("✅ Correto: mesmo signer não pode aprovar duas vezes")
        print(f"   Erro: {str(e)}")
    
    # 9. Signer3 aprova (completando o threshold novamente)
    print("\n9. Signer3 aprova a mudança...")
    contract.approve_change(signer3.public_key, source=signer3)
    print("✅ Terceira aprovação registrada")
    print_state()
    
    # 10. Verificar valor final
    final_value = contract.get_value()
    print(f"\n10. Valor final: {final_value}")
    if final_value == True:
        print("✅ Sistema multisig funcionou perfeitamente!")
    else:
        print("❌ ERRO: valor final incorreto")
    
    # 11. Teste de cancelamento
    print("\n11. Testando cancelamento de proposta...")
    contract.propose_change(signer1.public_key, False, source=signer1)
    print("Proposta criada")
    print_state()
    
    contract.cancel_proposal(signer2.public_key, source=signer2)
    print("Proposta cancelada")
    print_state()
    
    # 12. Teste de segurança: usuário não autorizado
    print("\n12. Testando acesso não autorizado...")
    unauthorized_user = Keypair.random()
    try:
        contract.propose_change(unauthorized_user.public_key, False, source=unauthorized_user)
        print("❌ ERRO: usuário não autorizado conseguiu criar proposta")
    except Exception as e:
        print("✅ Correto: usuário não autorizado foi bloqueado")
        print(f"   Erro: {str(e)}")
        
except Exception as e:
    print(f"❌ Erro durante os testes: {e}")
    import traceback
    traceback.print_exc()

print("\n=== Resumo dos Benefícios do Multisig ===")
print("✅ Nenhuma pessoa tem controle total")
print("✅ Operações críticas requerem consenso")
print("✅ Proteção contra chaves comprometidas")
print("✅ Auditabilidade de todas as decisões")
print("✅ Flexibilidade para diferentes thresholds")
print("✅ Proteção contra ataques de timing")
```

Este script demonstra todos os aspectos importantes de um sistema multisig:

1. **Distribuição de Poder**: Nenhuma pessoa sozinha pode fazer mudanças
2. **Consenso**: Mudanças só acontecem quando há acordo suficiente
3. **Proteção contra Erros**: Se uma pessoa for comprometida, o sistema ainda está seguro
4. **Auditabilidade**: Todas as propostas e aprovações são registradas
5. **Flexibilidade**: Diferentes operações podem ter diferentes thresholds

Em aplicações reais, multisig é usado para:
- **Tesourarias de DAOs**: Controlar fundos de organizações descentralizadas
- **Upgrades de Contratos**: Mudanças críticas em protocolos
- **Operações de Exchange**: Movimentações grandes de fundos
- **Governança**: Decisões importantes da comunidade
- **Custódia Institucional**: Bancos e instituições financeiras

O multisig não é apenas uma funcionalidade técnica - é uma filosofia de segurança que reconhece que sistemas críticos não devem depender de pontos únicos de falha.

## Capítulo 5: Boas Práticas de Segurança - Construindo Sistemas Verdadeiramente Seguros

Agora que exploramos TTL, fuzzing, autenticação simples e multisig, vamos consolidar tudo isso em um conjunto de **boas práticas de segurança** que você deve sempre seguir ao desenvolver smartcontracts.

Segurança em blockchain não é um recurso que você adiciona no final - é uma mentalidade que deve permear todo o processo de desenvolvimento, desde o design inicial até o monitoramento pós-deploy.

### Princípio 1: Defesa em Profundidade

Nunca confie em uma única camada de proteção. Assim como um castelo medieval tinha muralhas, fossos, torres e guardas, seus contratos devem ter múltiplas camadas de segurança:

- **Validação de Entrada**: Sempre valide todos os parâmetros
- **Controle de Acesso**: Verifique permissões em múltiplos níveis
- **Limites de Recursos**: Proteja contra ataques de DoS
- **Auditoria**: Registre todas as operações críticas
- **Monitoramento**: Detecte comportamentos anômalos

### Princípio 2: Fail-Safe (Falha Segura)

Quando algo der errado - e vai dar - seu sistema deve falhar de forma segura:

```rust
// ❌ RUIM: Falha insegura
pub fn withdraw(env: Env, amount: u32) {
    let balance = get_balance(&env);
    if balance >= amount {
        set_balance(&env, balance - amount);
        transfer_funds(&env, amount); // E se isso falhar?
    }
}

// ✅ BOM: Falha segura
pub fn withdraw(env: Env, amount: u32) {
    let balance = get_balance(&env);
    if balance < amount {
        panic_with_error!(&env, Error::InsufficientFunds);
    }
    
    // Primeiro transferir, depois atualizar estado
    transfer_funds(&env, amount);
    set_balance(&env, balance - amount);
}
```

### Princípio 3: Princípio do Menor Privilégio

Conceda apenas as permissões mínimas necessárias:

```rust
// ❌ RUIM: Permissões muito amplas
pub fn admin_function(env: Env, caller: Address) {
    caller.require_auth();
    // Qualquer endereço autenticado pode chamar
}

// ✅ BOM: Permissões específicas
pub fn admin_function(env: Env, caller: Address) {
    caller.require_auth();
    
    let admin = get_admin(&env);
    if caller != admin {
        panic_with_error!(&env, Error::Unauthorized);
    }
}
```

### Princípio 4: Validação Rigorosa

Nunca confie em dados externos:

```rust
// ❌ RUIM: Sem validação
pub fn set_percentage(env: Env, percentage: u32) {
    env.storage().set(&symbol_short!("pct"), &percentage);
}

// ✅ BOM: Validação completa
pub fn set_percentage(env: Env, percentage: u32) {
    if percentage > 100 {
        panic_with_error!(&env, Error::InvalidPercentage);
    }
    
    if percentage == 0 {
        panic_with_error!(&env, Error::ZeroPercentage);
    }
    
    env.storage().set(&symbol_short!("pct"), &percentage);
}
```

### Checklist de Segurança Completo

Antes de fazer deploy de qualquer contrato, passe por este checklist:

**🔐 Autenticação e Autorização**
- [ ] Todas as funções críticas usam `require_auth()`?
- [ ] Controles de acesso estão implementados corretamente?
- [ ] Há proteção contra ataques de impersonificação?
- [ ] Permissões seguem o princípio do menor privilégio?

**📊 Validação de Dados**
- [ ] Todos os inputs são validados?
- [ ] Há proteção contra overflow/underflow?
- [ ] Ranges de valores estão verificados?
- [ ] Dados externos são tratados como não confiáveis?

**⏰ Gerenciamento de Estado**
- [ ] TTL está configurado apropriadamente?
- [ ] Estados inválidos são impossíveis?
- [ ] Transições de estado são atômicas?
- [ ] Há proteção contra condições de corrida?

**🧪 Testes e Qualidade**
- [ ] Testes unitários cobrem casos extremos?
- [ ] Fuzzing foi executado extensivamente?
- [ ] Testes de integração estão passando?
- [ ] Código foi auditado por terceiros?

**🚨 Tratamento de Erros**
- [ ] Todos os erros são tratados explicitamente?
- [ ] Mensagens de erro não vazam informações sensíveis?
- [ ] Falhas são seguras por padrão?
- [ ] Há logs adequados para auditoria?

**💰 Considerações Econômicas**
- [ ] Custos de gas estão otimizados?
- [ ] Há proteção contra ataques de DoS econômicos?
- [ ] Incentivos estão alinhados corretamente?
- [ ] Há limites de recursos apropriados?

### Ferramentas de Segurança Recomendadas

1. **Análise Estática**: Use ferramentas como `clippy` para encontrar problemas comuns
2. **Fuzzing**: Implemente testes de fuzzing com `quickcheck` ou `proptest`
3. **Formal Verification**: Para contratos críticos, considere verificação formal
4. **Auditorias**: Sempre faça auditoria por especialistas antes de mainnet
5. **Bug Bounties**: Ofereça recompensas por encontrar vulnerabilidades
6. **Monitoramento**: Implemente alertas para comportamentos anômalos

### Padrões de Segurança Comuns

**Checks-Effects-Interactions Pattern**:
```rust
pub fn withdraw(env: Env, caller: Address, amount: u32) {
    caller.require_auth();
    
    // 1. Checks (verificações)
    let balance = get_balance(&env, &caller);
    if balance < amount {
        panic_with_error!(&env, Error::InsufficientFunds);
    }
    
    // 2. Effects (efeitos no estado)
    set_balance(&env, &caller, balance - amount);
    
    // 3. Interactions (interações externas)
    external_transfer(&env, &caller, amount);
}
```

**Circuit Breaker Pattern**:
```rust
pub fn emergency_pause(env: Env, admin: Address) {
    admin.require_auth();
    verify_admin(&env, &admin);
    
    env.storage().set(&symbol_short!("paused"), &true);
}

pub fn critical_function(env: Env) {
    let paused: bool = env.storage().get(&symbol_short!("paused")).unwrap_or(false);
    if paused {
        panic_with_error!(&env, Error::ContractPaused);
    }
    
    // Lógica normal...
}
```

Lembre-se: segurança não é um destino, é uma jornada. O cenário de ameaças está sempre evoluindo, e você precisa estar sempre aprendendo e se adaptando.

## Conclusão: Você Agora é um Desenvolvedor de Smartcontracts Consciente de Segurança

Parabéns! Você acabou de completar uma das aulas mais importantes da sua jornada como desenvolvedor blockchain.

Hoje você aprendeu não apenas como implementar funcionalidades, mas como implementá-las de forma **segura**. Você entendeu:

- **TTL (Time to Live)**: Como gerenciar o ciclo de vida dos dados de forma econômica e eficiente
- **Fuzzing**: Como encontrar bugs antes que hackers os encontrem
- **Autenticação**: Como garantir que apenas pessoas autorizadas possam executar operações críticas
- **Multisig**: Como distribuir poder e criar sistemas verdadeiramente descentralizados
- **Boas Práticas**: Como pensar como um engenheiro de segurança

Mas mais importante que as técnicas específicas, você desenvolveu uma **mentalidade de segurança**. Você agora pensa em termos de:
- "O que pode dar errado?"
- "Como um atacante tentaria explorar isso?"
- "Quais são os casos extremos?"
- "Como posso falhar de forma segura?"

Essa mentalidade é o que separa desenvolvedores casuais de engenheiros profissionais que podem ser confiados com sistemas que lidam com valores reais.

Na próxima aula, vamos explorar **Composabilidade em Protocolos Soroban** - como diferentes contratos podem trabalhar juntos de forma segura para criar sistemas complexos e poderosos.

Mas por enquanto, pratique o que aprendeu hoje. Implemente os contratos que vimos, execute os testes, experimente com diferentes configurações. A segurança só se torna segunda natureza com prática.

Lembre-se: em blockchain, não há "ctrl+z". O código que você escreve hoje pode estar protegendo milhões de dólares amanhã. Essa responsabilidade é ao mesmo tempo assustadora e emocionante.

Você está pronto para ela.

Até a próxima aula, e continue construindo o futuro - de forma segura! 🚀