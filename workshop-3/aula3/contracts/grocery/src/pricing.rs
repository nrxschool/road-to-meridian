use soroban_sdk::{Address, Env, Symbol, token, symbol_short};
use crate::admin::AdminManager;

const NOTEPAD_PRICE: Symbol = symbol_short!("price");
const BALANCE: Symbol = symbol_short!("balance");

/// Módulo responsável por gerenciar preços e pagamentos
pub struct PricingManager;

impl PricingManager {
    /// Define o preço do notepad em stroops (1 XLM = 10,000,000 stroops)
    pub fn set_notepad_price(env: &Env, admin: Address, price: i128) {
        AdminManager::check_admin(admin);
        env.storage().instance().set(&NOTEPAD_PRICE, &price);
    }

    /// Obtém o preço atual do notepad
    pub fn get_notepad_price(env: &Env) -> i128 {
        env.storage()
            .instance()
            .get(&NOTEPAD_PRICE)
            .unwrap_or(10_000_000) // Padrão: 1 XLM
    }

    /// Processa pagamento em XLM do caller para o contrato
    pub fn process_payment(env: &Env, caller: Address, amount: i128) {
        caller.require_auth();

        // Cria cliente de token para XLM nativo
        // Em produção, usar: soroban lab token id --asset native --network <network>
        let native_token = token::Client::new(env, &env.current_contract_address());
        
        // Transfere XLM do caller para o contrato
        native_token.transfer(&caller, &env.current_contract_address(), &amount);

        // Atualiza saldo do contrato
        Self::update_balance(env, amount);
    }

    /// Atualiza o saldo do contrato
    fn update_balance(env: &Env, amount: i128) {
        let current_balance: i128 = env.storage().instance().get(&BALANCE).unwrap_or(0);
        env.storage()
            .instance()
            .set(&BALANCE, &(current_balance + amount));
    }

    /// Saque de XLM do contrato (apenas admin)
    pub fn withdraw(env: &Env, admin: Address, to: Address) {
        AdminManager::check_admin(admin);

        let balance = Self::get_balance(env);
        if balance == 0 {
            panic!("Insufficient balance");
        }

        // Cria cliente de token para XLM nativo
        let native_token = token::Client::new(env, &env.current_contract_address());
        
        // Transfere XLM do contrato para o endereço especificado
        native_token.transfer(&env.current_contract_address(), &to, &balance);
        
        // Reseta o saldo
        env.storage().instance().set(&BALANCE, &0i128);
    }

    /// Obtém o saldo atual do contrato em XLM
    pub fn get_balance(env: &Env) -> i128 {
        env.storage().instance().get(&BALANCE).unwrap_or(0)
    }

    /// Verifica se o pagamento é suficiente para comprar um notepad
    pub fn validate_payment(env: &Env, amount: i128) -> bool {
        let required_price = Self::get_notepad_price(env);
        amount >= required_price
    }
}