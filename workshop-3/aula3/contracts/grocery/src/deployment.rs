use soroban_sdk::{Address, Bytes, BytesN, Env, Symbol, Val, Vec, symbol_short};
use crate::admin::AdminManager;

const NOTEPAD_WASM_HASH: Symbol = symbol_short!("wasm_hash");
const DEPLOYED_NOTEPADS: Symbol = symbol_short!("notepads");

/// Módulo responsável por gerenciar deployment de contratos
pub struct DeploymentManager;

impl DeploymentManager {
    /// Deploy genérico de contrato usando hash WASM existente
    pub fn deploy(
        env: &Env,
        admin: Address,
        wasm_hash: BytesN<32>,
        salt: BytesN<32>,
        constructor_args: Vec<Val>,
    ) -> Address {
        AdminManager::check_admin(admin);

        // Deploy do contrato usando o WASM hash fornecido
        env.deployer()
            .with_current_contract(salt)
            .deploy_v2(wasm_hash, constructor_args)
    }

    /// Define o hash WASM do notepad
    pub fn set_notepad_wasm_hash(env: &Env, admin: Address, wasm_hash: BytesN<32>) {
        AdminManager::check_admin(admin);
        env.storage().instance().set(&NOTEPAD_WASM_HASH, &wasm_hash);
    }

    /// Obtém o hash WASM do notepad
    pub fn get_notepad_wasm_hash(env: &Env) -> BytesN<32> {
        env.storage().instance().get(&NOTEPAD_WASM_HASH).unwrap()
    }

    /// Deploy específico de notepad com geração automática de salt
    pub fn deploy_notepad(env: &Env, caller: Address) -> Address {
        let wasm_hash = Self::get_notepad_wasm_hash(env);

        // Gera salt único usando endereço do caller e sequência do ledger
        let sequence = env.ledger().sequence();
        let salt_bytes = Bytes::from_array(env, &sequence.to_be_bytes());
        let salt = env.crypto().keccak256(&salt_bytes);

        // Deploy do contrato notepad com caller como admin
        let constructor_args: Vec<Val> = Vec::from_array(env, [caller.to_val()]);
        let notepad_address = env
            .deployer()
            .with_current_contract(salt)
            .deploy_v2(wasm_hash, constructor_args);

        // Armazena o endereço do notepad deployado
        Self::store_deployed_notepad(env, notepad_address.clone());

        notepad_address
    }

    /// Armazena endereço de notepad deployado
    fn store_deployed_notepad(env: &Env, notepad_address: Address) {
        let mut deployed_notepads: Vec<Address> = env
            .storage()
            .instance()
            .get(&DEPLOYED_NOTEPADS)
            .unwrap_or(Vec::new(env));
        deployed_notepads.push_back(notepad_address);
        env.storage()
            .instance()
            .set(&DEPLOYED_NOTEPADS, &deployed_notepads);
    }

    /// Obtém lista de todos os notepads deployados
    pub fn get_deployed_notepads(env: &Env) -> Vec<Address> {
        env.storage()
            .instance()
            .get(&DEPLOYED_NOTEPADS)
            .unwrap_or(Vec::new(env))
    }
}