use soroban_sdk::{contracttype, Env, String, Symbol, symbol_short};

const COUNTER: Symbol = symbol_short!("counter");

#[contracttype]
#[derive(Clone)]
pub enum DataKey {
    Admin,
}

#[derive(Clone)]
#[contracttype]
pub struct Note {
    pub content: String,
}

impl Default for Note {
    fn default() -> Self {
        Self {
            content: String::from_str(&Env::default(), ""),
        }
    }
}

/// Módulo responsável por gerenciar armazenamento e estruturas de dados
pub struct StorageManager;

impl StorageManager {
    /// Inicializa o contador de notas
    pub fn initialize_counter(env: &Env) {
        env.storage().instance().set(&COUNTER, &0i64);
    }

    /// Incrementa e retorna o próximo valor do contador
    pub fn increment_counter(env: &Env) -> i64 {
        let counter: i64 = env.storage().instance().get(&COUNTER).unwrap_or(0);
        let new_counter = counter + 1;
        env.storage().instance().set(&COUNTER, &new_counter);
        new_counter
    }

    /// Obtém o valor atual do contador
    pub fn get_counter(env: &Env) -> i64 {
        env.storage().instance().get(&COUNTER).unwrap_or(0)
    }

    /// Armazena uma nota no storage persistente
    pub fn store_note(env: &Env, counter: i64, note: Note) {
        env.storage().persistent().set(&counter, &note);
    }

    /// Recupera uma nota do storage persistente
    pub fn get_note(env: &Env, counter: i64) -> Note {
        env.storage().persistent().get(&counter).unwrap_or_default()
    }

    /// Cria uma nova nota com conteúdo
    pub fn create_note(content: String) -> Note {
        Note { content }
    }


}