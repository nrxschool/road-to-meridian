#![no_std]
use soroban_sdk::{
    contract, contractimpl, contracttype, Address, Env,
};

#[derive(Clone)]
#[contracttype]
pub enum DataKey {
    Owner,
    Balance(Address),
    Allowance(Address, Address), // (owner, spender)
}

#[contract]
pub struct AuthContract;

#[contractimpl]
impl AuthContract {
    /// Inicializa o contrato definindo o owner
    pub fn initialize(env: Env, owner: Address) {
        env.storage().instance().set(&DataKey::Owner, &owner);
    }
    
    /// Obtém o owner do contrato
    pub fn get_owner(env: Env) -> Address {
        env.storage().instance()
            .get(&DataKey::Owner)
            .expect("Contract not initialized")
    }
    
    /// Define o saldo de um usuário (apenas o owner pode fazer isso)
    pub fn set_balance(env: Env, user: Address, amount: u64) {
        let owner = Self::get_owner(env.clone());
        owner.require_auth();
        
        env.storage().persistent().set(&DataKey::Balance(user), &amount);
    }
    
    /// Obtém o saldo de um usuário
    pub fn get_balance(env: Env, user: Address) -> u64 {
        env.storage().persistent()
            .get(&DataKey::Balance(user))
            .unwrap_or(0)
    }
    
    /// Transfere tokens (requer autenticação do remetente)
    pub fn transfer(env: Env, from: Address, to: Address, amount: u64) {
        // Requer autenticação do remetente
        from.require_auth();
        
        let from_balance = Self::get_balance(env.clone(), from.clone());
        
        if from_balance < amount {
            panic!("Insufficient balance");
        }
        
        let to_balance = Self::get_balance(env.clone(), to.clone());
        
        // Atualiza saldos
        let new_from_balance = from_balance - amount;
        let new_to_balance = to_balance + amount;
        
        env.storage().persistent().set(&DataKey::Balance(from), &new_from_balance);
        env.storage().persistent().set(&DataKey::Balance(to), &new_to_balance);
    }
    
    /// Aprova um spender para gastar tokens em nome do owner
    pub fn approve(env: Env, owner: Address, spender: Address, amount: u64) {
        // Requer autenticação do owner
        owner.require_auth();
        
        env.storage().persistent().set(&DataKey::Allowance(owner, spender), &amount);
    }
    
    /// Obtém a allowance aprovada
    pub fn get_allowance(env: Env, owner: Address, spender: Address) -> u64 {
        env.storage().persistent()
            .get(&DataKey::Allowance(owner, spender))
            .unwrap_or(0)
    }
    
    /// Transfere tokens usando allowance (transfer_from)
    pub fn transfer_from(env: Env, spender: Address, from: Address, to: Address, amount: u64) {
        // Requer autenticação do spender
        spender.require_auth();
        
        let allowance = Self::get_allowance(env.clone(), from.clone(), spender.clone());
        
        if allowance < amount {
            panic!("Insufficient allowance");
        }
        
        let from_balance = Self::get_balance(env.clone(), from.clone());
        
        if from_balance < amount {
            panic!("Insufficient balance");
        }
        
        let to_balance = Self::get_balance(env.clone(), to.clone());
        
        // Atualiza saldos
        let new_from_balance = from_balance - amount;
        let new_to_balance = to_balance + amount;
        let new_allowance = allowance - amount;
        
        env.storage().persistent().set(&DataKey::Balance(from.clone()), &new_from_balance);
        env.storage().persistent().set(&DataKey::Balance(to), &new_to_balance);
        env.storage().persistent().set(&DataKey::Allowance(from, spender), &new_allowance);
    }
    
    /// Função administrativa - apenas o owner pode executar
    pub fn admin_mint(env: Env, to: Address, amount: u64) {
        let owner = Self::get_owner(env.clone());
        owner.require_auth();
        
        let current_balance = Self::get_balance(env.clone(), to.clone());
        let new_balance = current_balance + amount;
        
        env.storage().persistent().set(&DataKey::Balance(to), &new_balance);
    }
    
    /// Função administrativa - apenas o owner pode executar
    pub fn admin_burn(env: Env, from: Address, amount: u64) {
        let owner = Self::get_owner(env.clone());
        owner.require_auth();
        
        let current_balance = Self::get_balance(env.clone(), from.clone());
        
        if current_balance < amount {
            panic!("Insufficient balance to burn");
        }
        
        let new_balance = current_balance - amount;
        env.storage().persistent().set(&DataKey::Balance(from), &new_balance);
    }
    
    /// Transfere ownership do contrato (apenas o owner atual pode fazer)
    pub fn transfer_ownership(env: Env, new_owner: Address) {
        let current_owner = Self::get_owner(env.clone());
        current_owner.require_auth();
        
        env.storage().instance().set(&DataKey::Owner, &new_owner);
    }
}

#[cfg(test)]
mod test {
    use super::*;
    use soroban_sdk::{testutils::Address as _, Address, Env};

    #[test]
    fn test_initialization() {
        let env = Env::default();
        let contract_id = env.register_contract(None, AuthContract);
        let client = AuthContractClient::new(&env, &contract_id);
        
        let owner = Address::generate(&env);
        
        client.initialize(&owner);
        assert_eq!(client.get_owner(), owner);
    }
    
    #[test]
    fn test_owner_functions() {
        let env = Env::default();
        let contract_id = env.register_contract(None, AuthContract);
        let client = AuthContractClient::new(&env, &contract_id);
        
        let owner = Address::generate(&env);
        let user = Address::generate(&env);
        
        client.initialize(&owner);
        
        // Owner pode definir saldo
        client.set_balance(&user, &1000);
        assert_eq!(client.get_balance(&user), 1000);
        
        // Owner pode fazer mint
        client.admin_mint(&user, &500);
        assert_eq!(client.get_balance(&user), 1500);
        
        // Owner pode fazer burn
        client.admin_burn(&user, &200);
        assert_eq!(client.get_balance(&user), 1300);
    }
    
    #[test]
    fn test_transfer_with_auth() {
        let env = Env::default();
        let contract_id = env.register_contract(None, AuthContract);
        let client = AuthContractClient::new(&env, &contract_id);
        
        let owner = Address::generate(&env);
        let user1 = Address::generate(&env);
        let user2 = Address::generate(&env);
        
        client.initialize(&owner);
        client.set_balance(&user1, &1000);
        
        // Transfer requer autenticação do remetente
        client.transfer(&user1, &user2, &300);
        
        assert_eq!(client.get_balance(&user1), 700);
        assert_eq!(client.get_balance(&user2), 300);
    }
    
    #[test]
    fn test_allowance_system() {
        let env = Env::default();
        let contract_id = env.register_contract(None, AuthContract);
        let client = AuthContractClient::new(&env, &contract_id);
        
        let owner = Address::generate(&env);
        let user1 = Address::generate(&env);
        let user2 = Address::generate(&env);
        let spender = Address::generate(&env);
        
        client.initialize(&owner);
        client.set_balance(&user1, &1000);
        
        // User1 aprova spender para gastar 500 tokens
        client.approve(&user1, &spender, &500);
        assert_eq!(client.get_allowance(&user1, &spender), 500);
        
        // Spender pode transferir usando allowance
        client.transfer_from(&spender, &user1, &user2, &200);
        
        assert_eq!(client.get_balance(&user1), 800);
        assert_eq!(client.get_balance(&user2), 200);
        assert_eq!(client.get_allowance(&user1, &spender), 300); // 500 - 200
    }
    
    #[test]
    fn test_ownership_transfer() {
        let env = Env::default();
        let contract_id = env.register_contract(None, AuthContract);
        let client = AuthContractClient::new(&env, &contract_id);
        
        let owner1 = Address::generate(&env);
        let owner2 = Address::generate(&env);
        
        client.initialize(&owner1);
        assert_eq!(client.get_owner(), owner1);
        
        // Transfere ownership
        client.transfer_ownership(&owner2);
        assert_eq!(client.get_owner(), owner2);
    }
    
    #[test]
    #[should_panic(expected = "Insufficient balance")]
    fn test_transfer_insufficient_balance() {
        let env = Env::default();
        let contract_id = env.register_contract(None, AuthContract);
        let client = AuthContractClient::new(&env, &contract_id);
        
        let owner = Address::generate(&env);
        let user1 = Address::generate(&env);
        let user2 = Address::generate(&env);
        
        client.initialize(&owner);
        client.set_balance(&user1, &100);
        
        // Tenta transferir mais do que tem
        client.transfer(&user1, &user2, &200);
    }
    
    #[test]
    #[should_panic(expected = "Insufficient allowance")]
    fn test_transfer_from_insufficient_allowance() {
        let env = Env::default();
        let contract_id = env.register_contract(None, AuthContract);
        let client = AuthContractClient::new(&env, &contract_id);
        
        let owner = Address::generate(&env);
        let user1 = Address::generate(&env);
        let user2 = Address::generate(&env);
        let spender = Address::generate(&env);
        
        client.initialize(&owner);
        client.set_balance(&user1, &1000);
        client.approve(&user1, &spender, &100);
        
        // Tenta transferir mais do que a allowance permite
        client.transfer_from(&spender, &user1, &user2, &200);
    }
}