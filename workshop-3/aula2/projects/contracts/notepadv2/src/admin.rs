use soroban_sdk::{symbol_short, Address, Env, Symbol};

const ADMIN: Symbol = symbol_short!("admin");

/// Módulo responsável por gerenciar funções administrativas
pub struct AdminManager;

impl AdminManager {
    /// Verifica se o endereço fornecido é o administrador e requer autenticação
    pub fn check_admin(admin: Address) {
        admin.require_auth();
    }

    /// Define um novo administrador
    pub fn set_admin(env: &Env, admin: Address, new_admin: Address) {
        Self::check_admin(admin);
        env.storage().instance().set(&ADMIN, &new_admin);
    }

    /// Obtém o endereço do administrador atual
    pub fn get_admin(env: &Env) -> Address {
        env.storage().instance().get(&ADMIN).unwrap()
    }

    /// Inicializa o administrador no construtor
    pub fn initialize_admin(env: &Env, admin: Address) {
        env.storage().instance().set(&ADMIN, &admin);
    }
}
