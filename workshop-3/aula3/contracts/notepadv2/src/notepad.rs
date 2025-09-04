use soroban_sdk::{Address, BytesN, Env, String, Vec};
use crate::admin::AdminManager;
use crate::storage::{StorageManager, Note};

/// Módulo responsável por funcionalidades específicas do notepad v2
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

    /// Adiciona uma nota em um contrato específico (funcionalidade v2)
    pub fn add_note_on_contract(env: &Env, caller: Address, note_content: String, contract: Address) {
        AdminManager::check_admin(caller);
        
        // Cria a nota
        let note = StorageManager::create_note(note_content);
        
        // Usa o endereço do contrato como parte da chave para armazenamento
        let counter = StorageManager::increment_counter(env);
        
        // Armazena a nota usando uma tupla como chave (contract, counter)
        let storage_key = (contract, counter);
        env.storage().persistent().set(&storage_key, &note);
    }

    /// Obtém todas as notas de um contrato específico (funcionalidade v2)
    pub fn get_all_notes_from_contract(env: &Env, contract: Address, max_counter: i64) -> Vec<Note> {
        let mut notes = Vec::new(env);
        
        for i in 1..=max_counter {
            let storage_key = (contract.clone(), i);
            if let Some(note) = env.storage().persistent().get(&storage_key) {
                notes.push_back(note);
            }
        }
        
        notes
    }

    /// Atualiza o contrato para uma nova versão (upgrade)
    pub fn upgrade(env: &Env, caller: Address, new_wasm_hash: BytesN<32>) {
        AdminManager::check_admin(caller);
        env.deployer().update_current_contract_wasm(new_wasm_hash);
    }

    /// Retorna a versão do contrato
    pub fn version() -> u32 {
        2 // Versão 2
    }

    /// Inicializa o notepad com configurações padrão
    pub fn initialize(env: &Env, admin: Address) {
        AdminManager::initialize_admin(env, admin);
        StorageManager::initialize_counter(env);
    }

    /// Verifica se o caller é admin (função auxiliar para compatibilidade)
    pub fn check_admin(env: &Env, caller: Address) {
        AdminManager::check_admin(caller);
    }
}