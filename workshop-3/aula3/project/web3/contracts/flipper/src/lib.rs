#![no_std]

use soroban_sdk::{contract, contractimpl, symbol_short, Env, Symbol};

#[contract]
pub struct Flipper;

const STATE: Symbol = symbol_short!("STATE");

#[contractimpl]
impl Flipper {
    pub fn state(env: Env) -> bool {
        env.storage().instance().get(&STATE).unwrap_or(false)
    }

    pub fn flip(env: Env) {
        let current = env.storage().instance().get(&STATE).unwrap_or(false);
        let new_value = !current;
        env.storage().instance().set(&STATE, &new_value);
    }
}
