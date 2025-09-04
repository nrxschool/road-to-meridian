#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, symbol_short, IntoVal};
use soroban_sdk::{Address, BytesN, Env, String, Symbol, Vec};

const COUNTER: Symbol = symbol_short!("counter");

#[contracttype]
#[derive(Clone)]
enum DataKey {
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

#[contract]
pub struct Notepad;

#[contractimpl]
impl Notepad {
    pub fn __constructor(env: Env, admin: Address) {
        env.storage().instance().set(&DataKey::Admin, &admin);
        env.storage().instance().set(&COUNTER, &0);
    }
}

#[contractimpl]
impl Notepad {
    pub fn add_note(env: Env, caller: Address, note: String) {
        Self::check_admin(env.clone(), caller);

        let note = Note { content: note };

        let counter: i64 = env.storage().instance().get(&COUNTER).unwrap_or(0);
        env.storage().instance().set(&COUNTER, &(counter + 1));

        env.storage().persistent().set(&counter, &note);
    }

    pub fn get_note(env: Env, counter: i64) -> Note {
        env.storage().persistent().get(&counter).unwrap_or_default()
    }

    pub fn get_counter(env: Env) -> i64 {
        env.storage().instance().get(&COUNTER).unwrap_or(0)
    }
}

#[contractimpl]
impl Notepad {
    pub fn check_admin(env: Env, caller: Address) {
        let admin: Address = env.storage().instance().get(&DataKey::Admin).unwrap();
        caller.require_auth();
        assert_eq!(admin, caller);
    }

    pub fn set_admin(env: Env, caller: Address, new_admin: Address) {
        Self::check_admin(env.clone(), caller);
        env.storage().instance().set(&DataKey::Admin, &new_admin);
    }

    pub fn get_admin(env: Env) -> Address {
        env.storage().instance().get(&DataKey::Admin).unwrap()
    }
}

#[contractimpl]
impl Notepad {
    pub fn version() -> u32 {
        2
    }

    pub fn upgrade(env: Env, caller: Address, new_wasm_hash: BytesN<32>) {
        Self::check_admin(env.clone(), caller);
        env.deployer().update_current_contract_wasm(new_wasm_hash);
    }
}

#[contractimpl]
impl Notepad {
    pub fn add_note_on_contract(env: Env, caller: Address, note: String, contract: Address) {
        // Require authorization for the cross-contract call with specific arguments
        caller.require_auth();

        // Make the cross-contract call to add_note function
        let _: () = env.invoke_contract(
            &contract,
            &symbol_short!("add_note"),
            (caller, note).into_val(&env),
        );
    }

    pub fn get_all_notes_from_contract(env: Env, contract: Address, counter: i64) -> Vec<Note> {
        // Get all notes by calling get_note for each counter from 1 to counter
        let mut notes = Vec::new(&env);

        for i in 1..=counter {
            let note: Note =
                env.invoke_contract(&contract, &symbol_short!("get_note"), (i,).into_val(&env));
            notes.push_back(note);
        }

        notes
    }
}
