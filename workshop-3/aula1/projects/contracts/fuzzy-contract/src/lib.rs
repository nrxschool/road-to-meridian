#![no_std]
use soroban_sdk::{
    contract, contractimpl, contracttype, Address, Env,
};

#[derive(Clone, Debug, Eq, PartialEq)]
#[contracttype]
pub enum DataKey {
    Balance(Address),
    TotalSupply,
}

#[contract]
pub struct FuzzyContract;

#[contractimpl]
impl FuzzyContract {
    /// Inicializa o contrato com supply total
    pub fn initialize(env: Env, total_supply: u64) {
        if total_supply == 0 {
            panic!("Total supply must be greater than 0");
        }
        
        env.storage().instance().set(&DataKey::TotalSupply, &total_supply);
    }
    
    /// Define o saldo de um endereço
    pub fn set_balance(env: Env, address: Address, amount: u64) {
        address.require_auth();
        
        let total_supply: u64 = env.storage().instance()
            .get(&DataKey::TotalSupply)
            .unwrap_or(0);
            
        if amount > total_supply {
            panic!("Amount cannot exceed total supply");
        }
        
        env.storage().persistent().set(&DataKey::Balance(address), &amount);
    }
    
    /// Obtém o saldo de um endereço
    pub fn get_balance(env: Env, address: Address) -> u64 {
        env.storage().persistent()
            .get(&DataKey::Balance(address))
            .unwrap_or(0)
    }
    
    /// Transfere tokens entre endereços
    pub fn transfer(env: Env, from: Address, to: Address, amount: u64) {
        from.require_auth();
        
        let from_balance = Self::get_balance(env.clone(), from.clone());
        let to_balance = Self::get_balance(env.clone(), to.clone());
        
        if from_balance < amount {
            panic!("Insufficient balance");
        }
        
        // Verifica overflow na soma
        let new_to_balance = to_balance.checked_add(amount)
            .expect("Balance overflow");
            
        let new_from_balance = from_balance - amount;
        
        env.storage().persistent().set(&DataKey::Balance(from), &new_from_balance);
        env.storage().persistent().set(&DataKey::Balance(to), &new_to_balance);
    }
    
    /// Adiciona tokens ao supply (mint)
    pub fn mint(env: Env, to: Address, amount: u64) {
        let current_supply: u64 = env.storage().instance()
            .get(&DataKey::TotalSupply)
            .unwrap_or(0);
            
        let current_balance = Self::get_balance(env.clone(), to.clone());
        
        // Verifica overflow
        let new_supply = current_supply.checked_add(amount)
            .expect("Supply overflow");
            
        let new_balance = current_balance.checked_add(amount)
            .expect("Balance overflow");
        
        env.storage().instance().set(&DataKey::TotalSupply, &new_supply);
        env.storage().persistent().set(&DataKey::Balance(to), &new_balance);
    }
    
    /// Remove tokens do supply (burn)
    pub fn burn(env: Env, from: Address, amount: u64) {
        from.require_auth();
        
        let current_supply: u64 = env.storage().instance()
            .get(&DataKey::TotalSupply)
            .unwrap_or(0);
            
        let current_balance = Self::get_balance(env.clone(), from.clone());
        
        if current_balance < amount {
            panic!("Insufficient balance to burn");
        }
        
        if current_supply < amount {
            panic!("Cannot burn more than total supply");
        }
        
        let new_supply = current_supply - amount;
        let new_balance = current_balance - amount;
        
        env.storage().instance().set(&DataKey::TotalSupply, &new_supply);
        env.storage().persistent().set(&DataKey::Balance(from), &new_balance);
    }
    
    /// Obtém o supply total
    pub fn get_total_supply(env: Env) -> u64 {
        env.storage().instance()
            .get(&DataKey::TotalSupply)
            .unwrap_or(0)
    }
}

#[cfg(test)]
mod test {
    use super::*;
    use soroban_sdk::{testutils::Address as _, Address, Env};
    use proptest::prelude::*;

    #[test]
    fn test_basic_functionality() {
        let env = Env::default();
        let contract_id = env.register_contract(None, FuzzyContract);
        let client = FuzzyContractClient::new(&env, &contract_id);
        
        let user1 = Address::generate(&env);
        let user2 = Address::generate(&env);
        
        // Inicializa contrato
        client.initialize(&1000);
        assert_eq!(client.get_total_supply(), 1000);
        
        // Testa mint
        client.mint(&user1, &500);
        assert_eq!(client.get_balance(&user1), 500);
        assert_eq!(client.get_total_supply(), 1500);
        
        // Testa transfer
        client.transfer(&user1, &user2, &200);
        assert_eq!(client.get_balance(&user1), 300);
        assert_eq!(client.get_balance(&user2), 200);
        
        // Testa burn
        client.burn(&user1, &100);
        assert_eq!(client.get_balance(&user1), 200);
        assert_eq!(client.get_total_supply(), 1400);
    }
    
    // FUZZY TESTS - Testes com dados aleatórios
    
    proptest! {
        #[test]
        fn fuzz_initialize_never_panics_with_positive_supply(
            total_supply in 1u64..u64::MAX
        ) {
            let env = Env::default();
            let contract_id = env.register_contract(None, FuzzyContract);
            let client = FuzzyContractClient::new(&env, &contract_id);
            
            // Não deve entrar em pânico com supply positivo
            client.initialize(&total_supply);
            prop_assert_eq!(client.get_total_supply(), total_supply);
        }
    }
    
    proptest! {
        #[test]
        fn fuzz_balance_never_exceeds_supply(
            initial_supply in 1u64..1000000u64,
            mint_amount in 0u64..1000000u64
        ) {
            let env = Env::default();
            let contract_id = env.register_contract(None, FuzzyContract);
            let client = FuzzyContractClient::new(&env, &contract_id);
            let user = Address::generate(&env);
            
            client.initialize(&initial_supply);
            
            // Tenta fazer mint (pode falhar por overflow, mas não deve corromper estado)
            let result = std::panic::catch_unwind(|| {
                client.mint(&user, &mint_amount);
            });
            
            // Se não entrou em pânico, verifica invariantes
            if result.is_ok() {
                let balance = client.get_balance(&user);
                let total_supply = client.get_total_supply();
                
                // Balance nunca deve exceder total supply
                prop_assert!(balance <= total_supply);
                // Total supply deve ser pelo menos o initial_supply
                prop_assert!(total_supply >= initial_supply);
            }
        }
    }
    
    proptest! {
        #[test]
        fn fuzz_transfer_preserves_total_balance(
            amount1 in 1u64..1000u64,
            amount2 in 1u64..1000u64,
            transfer_amount in 1u64..500u64
        ) {
            let env = Env::default();
            let contract_id = env.register_contract(None, FuzzyContract);
            let client = FuzzyContractClient::new(&env, &contract_id);
            
            let user1 = Address::generate(&env);
            let user2 = Address::generate(&env);
            
            client.initialize(&10000);
            client.mint(&user1, &amount1);
            client.mint(&user2, &amount2);
            
            let total_before = client.get_balance(&user1) + client.get_balance(&user2);
            
            // Tenta transferir (pode falhar se saldo insuficiente)
            let result = std::panic::catch_unwind(|| {
                client.transfer(&user1, &user2, &transfer_amount);
            });
            
            // Se transferência foi bem-sucedida, total deve ser preservado
            if result.is_ok() {
                let total_after = client.get_balance(&user1) + client.get_balance(&user2);
                prop_assert_eq!(total_before, total_after);
            }
        }
    }
    
    proptest! {
        #[test]
        fn fuzz_burn_never_increases_supply(
            initial_supply in 1000u64..10000u64,
            mint_amount in 100u64..1000u64,
            burn_amount in 1u64..500u64
        ) {
            let env = Env::default();
            let contract_id = env.register_contract(None, FuzzyContract);
            let client = FuzzyContractClient::new(&env, &contract_id);
            let user = Address::generate(&env);
            
            client.initialize(&initial_supply);
            client.mint(&user, &mint_amount);
            
            let supply_before = client.get_total_supply();
            
            // Tenta fazer burn (pode falhar se saldo insuficiente)
            let result = std::panic::catch_unwind(|| {
                client.burn(&user, &burn_amount);
            });
            
            let supply_after = client.get_total_supply();
            
            // Supply nunca deve aumentar após burn
            prop_assert!(supply_after <= supply_before);
            
            // Se burn foi bem-sucedido, supply deve diminuir exatamente pelo burn_amount
            if result.is_ok() {
                prop_assert_eq!(supply_after, supply_before - burn_amount);
            }
        }
    }
    
    proptest! {
        #[test]
        fn fuzz_no_negative_balances(
            operations in prop::collection::vec(
                (0u8..4u8, 1u64..1000u64), // (operation_type, amount)
                1..10
            )
        ) {
            let env = Env::default();
            let contract_id = env.register_contract(None, FuzzyContract);
            let client = FuzzyContractClient::new(&env, &contract_id);
            
            let user1 = Address::generate(&env);
            let user2 = Address::generate(&env);
            
            client.initialize(&100000);
            
            // Executa sequência aleatória de operações
            for (op_type, amount) in operations {
                let _result = std::panic::catch_unwind(|| {
                    match op_type {
                        0 => client.mint(&user1, &amount),
                        1 => client.mint(&user2, &amount),
                        2 => client.transfer(&user1, &user2, &amount),
                        3 => client.burn(&user1, &amount),
                        _ => {}
                    }
                });
                
                // Verifica que balances nunca são negativos (u64 não permite, mas verifica overflow)
                let balance1 = client.get_balance(&user1);
                let balance2 = client.get_balance(&user2);
                let total_supply = client.get_total_supply();
                
                // Invariantes que sempre devem ser verdadeiras
                prop_assert!(balance1 <= total_supply);
                prop_assert!(balance2 <= total_supply);
                prop_assert!(total_supply <= u64::MAX);
            }
        }
    }
}