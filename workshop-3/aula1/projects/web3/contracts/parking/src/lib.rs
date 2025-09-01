#![no_std]
use soroban_sdk::{contract, contractimpl, symbol_short, Env, Symbol};

pub mod instance;
pub mod persistent;
pub mod temporary;

const INSTANCE: Symbol = symbol_short!("instance");
const TEMPORARY: Symbol = symbol_short!("temporary");
const PERSISTENT: Symbol = symbol_short!("persisten");

#[contract]
pub struct TtlContract;

#[contractimpl]
impl TtlContract {
    pub fn __constructor(env: Env) {
        if env.storage().instance().has(&INSTANCE) {
            return;
        }
        env.storage().instance().set(&INSTANCE, &0);
        env.storage().temporary().set(&TEMPORARY, &0);
        env.storage().persistent().set(&PERSISTENT, &0);
    }
}
