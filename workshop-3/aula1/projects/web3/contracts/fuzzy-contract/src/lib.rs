#![no_std]
use soroban_sdk::{contract, contractimpl, symbol_short, Env, Symbol};

pub mod test;

const STORAGE: Symbol = symbol_short!("instance");

#[contract]
pub struct FuzzyContract;

#[contractimpl]
impl FuzzyContract {
    pub fn set(env: Env, value: i32) {
        env.storage().instance().set(&STORAGE, &value);
    }

    pub fn get(env: Env) -> i32 {
        env.storage().instance().get(&STORAGE).unwrap_or(0)
    }
}
