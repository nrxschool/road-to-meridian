#![no_std]
use soroban_sdk::{contract, contractimpl, Address, BytesN, Env, String};

// Módulos modularizados seguindo o princípio de responsabilidade única
mod admin;
mod notepad;
mod storage;

use admin::AdminManager;
use notepad::NotepadManager;
use storage::Note;

#[contract]
pub struct Notepad;

#[contractimpl]
impl Notepad {
    pub fn __constructor(env: Env, admin: Address) {
        NotepadManager::initialize(&env, admin);
    }
}

#[contractimpl]
impl Notepad {
    pub fn add_note(env: Env, caller: Address, note: String) {
        NotepadManager::add_note(&env, caller, note);
    }

    pub fn get_note(env: Env, counter: i64) -> Note {
        NotepadManager::get_note(&env, counter)
    }

    pub fn get_counter(env: Env) -> i64 {
        NotepadManager::get_counter(&env)
    }
}

#[contractimpl]
impl Notepad {
    pub fn check_admin(env: Env, caller: Address) {
        NotepadManager::check_admin(&env, caller);
    }

    pub fn set_admin(env: Env, caller: Address, new_admin: Address) {
        AdminManager::set_admin(&env, caller, new_admin);
    }

    pub fn get_admin(env: Env) -> Address {
        AdminManager::get_admin(&env)
    }
}

#[contractimpl]
impl Notepad {
    pub fn version() -> u32 {
        NotepadManager::version()
    }

    pub fn upgrade(env: Env, caller: Address, new_wasm_hash: BytesN<32>) {
        NotepadManager::upgrade(&env, caller, new_wasm_hash);
    }
}
