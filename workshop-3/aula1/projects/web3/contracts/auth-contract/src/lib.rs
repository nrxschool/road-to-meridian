#![no_std]
use soroban_sdk::{contract, contracterror, contractimpl, contracttype};
use soroban_sdk::{Address, Env};

pub mod owneable;
pub mod storage;

#[contracttype]
pub enum DataKey {
    Owner,
    State,
}

#[contracterror]
#[derive(Copy, Clone, Debug, Eq, PartialEq, PartialOrd, Ord)]
#[repr(u32)]
pub enum Error {
    Unauthorized = 0,
    AlreadyInitialized = 1,
}

#[contract]
pub struct Flipper;

#[contractimpl]
impl Flipper {
    pub fn __constructor(env: Env, owner: Address) -> Result<(), Error> {
        if env.storage().persistent().has(&DataKey::Owner) {
            return Err(Error::AlreadyInitialized);
        }
        env.storage().instance().set(&DataKey::Owner, &owner);
        env.storage().instance().set(&DataKey::State, &false);
        Ok(())
    }
}
