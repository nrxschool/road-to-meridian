#![no_std]
use soroban_sdk::{
    contract, contractimpl, contracttype, Env, Symbol,
};

#[derive(Clone, Debug, Eq, PartialEq)]
#[contracttype]
pub enum DataKey {
    // Temporary storage - TTL baixo, dados temporários
    TempData(Symbol),
    // Persistent storage - TTL médio, dados importantes
    PersistentData(Symbol),
    // Instance storage - TTL alto, configurações do contrato
    InstanceData(Symbol),
}

#[contract]
pub struct TtlContract;

#[contractimpl]
impl TtlContract {
    /// Armazena dados temporários com TTL baixo (100 ledgers)
    pub fn store_temp_data(env: Env, key: Symbol, value: u32) {
        let storage_key = DataKey::TempData(key);
        env.storage().temporary().set(&storage_key, &value);
        
        // Define TTL de 100 ledgers para dados temporários
        env.storage().temporary().extend_ttl(&storage_key, 100, 100);
    }
    
    /// Armazena dados persistentes com TTL médio (1000 ledgers)
    pub fn store_persistent_data(env: Env, key: Symbol, value: u32) {
        let storage_key = DataKey::PersistentData(key);
        env.storage().persistent().set(&storage_key, &value);
        
        // Define TTL de 1000 ledgers para dados persistentes
        env.storage().persistent().extend_ttl(&storage_key, 1000, 1000);
    }
    
    /// Armazena dados de instância com TTL alto (10000 ledgers)
    pub fn store_instance_data(env: Env, key: Symbol, value: u32) {
        let storage_key = DataKey::InstanceData(key);
        env.storage().instance().set(&storage_key, &value);
        
        // Define TTL de 10000 ledgers para dados de instância
        env.storage().instance().extend_ttl(10000, 10000);
    }
    
    /// Recupera dados temporários
    pub fn get_temp_data(env: Env, key: Symbol) -> Option<u32> {
        let storage_key = DataKey::TempData(key);
        env.storage().temporary().get(&storage_key)
    }
    
    /// Recupera dados persistentes
    pub fn get_persistent_data(env: Env, key: Symbol) -> Option<u32> {
        let storage_key = DataKey::PersistentData(key);
        env.storage().persistent().get(&storage_key)
    }
    
    /// Recupera dados de instância
    pub fn get_instance_data(env: Env, key: Symbol) -> Option<u32> {
        let storage_key = DataKey::InstanceData(key);
        env.storage().instance().get(&storage_key)
    }
    
    /// Estende o TTL de dados temporários
    pub fn extend_temp_ttl(env: Env, key: Symbol, extend_to: u32) {
        let storage_key = DataKey::TempData(key);
        env.storage().temporary().extend_ttl(&storage_key, extend_to, extend_to);
    }
    
    /// Estende o TTL de dados persistentes
    pub fn extend_persistent_ttl(env: Env, key: Symbol, extend_to: u32) {
        let storage_key = DataKey::PersistentData(key);
        env.storage().persistent().extend_ttl(&storage_key, extend_to, extend_to);
    }
    
    /// Estende o TTL de dados de instância
    pub fn extend_instance_ttl(env: Env, extend_to: u32) {
        env.storage().instance().extend_ttl(extend_to, extend_to);
    }
    
    /// Verifica se dados temporários existem
    pub fn has_temp_data(env: Env, key: Symbol) -> bool {
        let storage_key = DataKey::TempData(key);
        env.storage().temporary().has(&storage_key)
    }
    
    /// Verifica se dados persistentes existem
    pub fn has_persistent_data(env: Env, key: Symbol) -> bool {
        let storage_key = DataKey::PersistentData(key);
        env.storage().persistent().has(&storage_key)
    }
    
    /// Verifica se dados de instância existem
    pub fn has_instance_data(env: Env, key: Symbol) -> bool {
        let storage_key = DataKey::InstanceData(key);
        env.storage().instance().has(&storage_key)
    }
}

#[cfg(test)]
mod test {
    use super::*;
    use soroban_sdk::{testutils::Ledger, Env};

    #[test]
    fn test_ttl_storage() {
        let env = Env::default();
        let contract_id = env.register_contract(None, TtlContract);
        let client = TtlContractClient::new(&env, &contract_id);
        
        let key = symbol_short!("test");
        let value = 42u32;
        
        // Testa armazenamento temporário
        client.store_temp_data(&key, &value);
        assert_eq!(client.get_temp_data(&key), Some(value));
        assert!(client.has_temp_data(&key));
        
        // Testa armazenamento persistente
        client.store_persistent_data(&key, &value);
        assert_eq!(client.get_persistent_data(&key), Some(value));
        assert!(client.has_persistent_data(&key));
        
        // Testa armazenamento de instância
        client.store_instance_data(&key, &value);
        assert_eq!(client.get_instance_data(&key), Some(value));
        assert!(client.has_instance_data(&key));
    }
    
    #[test]
    fn test_ttl_expiration() {
        let env = Env::default();
        let contract_id = env.register_contract(None, TtlContract);
        let client = TtlContractClient::new(&env, &contract_id);
        
        let key = symbol_short!("expire");
        let value = 100u32;
        
        // Armazena dados temporários
        client.store_temp_data(&key, &value);
        assert!(client.has_temp_data(&key));
        
        // Simula passagem de tempo (101 ledgers)
        env.ledger().with_mut(|ledger| {
            ledger.sequence_number += 101;
        });
        
        // Dados devem ter expirado
        assert!(!client.has_temp_data(&key));
        assert_eq!(client.get_temp_data(&key), None);
    }
}