use crate::storage::DataKey;
use soroban_sdk::{contract, contractimpl, Address, BytesN, Env, String, Vec};

use crate::admin;
use crate::notepad_core;
use crate::upgrade;

#[contract]
pub struct Notepad;

#[contractimpl]
impl Notepad {
    pub fn __constructor(env: Env, admin: Address) {
        env.storage().persistent().set(&DataKey::Admin, &admin);
        env.storage().persistent().set(&DataKey::Counter, &0);
    }
}

#[contractimpl]
impl Notepad {
    pub fn add_note(env: Env, caller: Address, note: String) {
        notepad_core::add_note(&env, caller, note);
    }

    pub fn get_note(env: Env, counter: u32) -> String {
        notepad_core::get_note(&env, counter)
    }

    pub fn get_all_notes(env: Env) -> Vec<String> {
        notepad_core::get_all_notes(&env)
    }
    pub fn get_notes_counter(env: Env) -> u32 {
        notepad_core::get_notes_counter(&env)
    }
}

#[contractimpl]
impl Notepad {
    pub fn only_admin(env: Env, caller: Address) {
        admin::only_admin(&env, caller);
    }

    pub fn set_admin(env: Env, caller: Address, new_admin: Address) {
        admin::set_admin(&env, caller, new_admin);
    }

    pub fn get_admin(env: Env) -> Address {
        admin::get_admin(&env)
    }
}

#[contractimpl]
impl Notepad {
    pub fn version() -> u32 {
        upgrade::version()
    }

    pub fn upgrade(env: Env, new_wasm_hash: BytesN<32>) {
        upgrade::upgrade(env, new_wasm_hash);
    }
}
