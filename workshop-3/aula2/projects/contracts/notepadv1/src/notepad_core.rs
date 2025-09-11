use crate::storage::DataKey;
use soroban_sdk::{Address, Env, String, Vec};

pub fn add_note(env: &Env, _caller: Address, note_content: String) -> u32 {
    // only_admin(caller);

    let id = env
        .storage()
        .persistent()
        .update(&DataKey::Counter, |c| c.unwrap() + 1);

    env.storage()
        .persistent()
        .set(&DataKey::Note(id), &note_content);

    id
}

pub fn get_note(env: &Env, id: u32) -> String {
    env.storage()
        .persistent()
        .get(&DataKey::Note(id))
        .unwrap_or(String::from_str(env, "NOTFOUND"))
}

pub fn get_all_notes(env: &Env) -> Vec<String> {
    let mut notes = Vec::new(env);
    let counter = env
        .storage()
        .persistent()
        .get(&DataKey::Counter)
        .unwrap_or(0);

    for id in 1..=counter {
        if let Some(content) = env.storage().persistent().get(&DataKey::Note(id)) {
            notes.push_front(content);
        }
    }

    notes
}

pub fn get_notes_counter(env: &Env) -> u32 {
    env.storage()
        .persistent()
        .get(&DataKey::Counter)
        .unwrap_or(0)
}
