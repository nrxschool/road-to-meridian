use crate::admin::AdminManager;
use crate::storage::{Note, StorageManager};
use soroban_sdk::{Address, BytesN, Env, String};

/// Módulo responsável por funcionalidades específicas do notepad v1
pub struct NotepadManager;

impl NotepadManager {
    /// Adiciona uma nova nota ao notepad
    pub fn add_note(env: &Env, caller: Address, note_content: String) {
        AdminManager::check_admin(caller);

        let note = StorageManager::create_note(note_content);
        let counter = StorageManager::increment_counter(env);
        StorageManager::store_note(env, counter, note);
    }

    /// Obtém uma nota específica pelo contador
    pub fn get_note(env: &Env, counter: i64) -> Note {
        StorageManager::get_note(env, counter)
    }

    /// Obtém o contador atual de notas
    pub fn get_counter(env: &Env) -> i64 {
        StorageManager::get_counter(env)
    }

    /// Atualiza o contrato para uma nova versão (upgrade)
    pub fn upgrade(env: &Env, caller: Address, new_wasm_hash: BytesN<32>) {
        AdminManager::check_admin(caller);
        env.deployer().update_current_contract_wasm(new_wasm_hash);
    }

    /// Retorna a versão do contrato
    pub fn version() -> u32 {
        1 // Versão 1
    }

    /// Inicializa o notepad com configurações padrão
    pub fn initialize(env: &Env, admin: Address) {
        AdminManager::initialize_admin(env, admin);
        StorageManager::initialize_counter(env);
    }

    /// Verifica se o caller é admin (função auxiliar para compatibilidade)
    pub fn check_admin(_env: &Env, caller: Address) {
        AdminManager::check_admin(caller);
    }
}
