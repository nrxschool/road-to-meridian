use soroban_sdk::symbol_short;
use soroban_sdk::token::Client;
use soroban_sdk::{contract, contractimpl};
use soroban_sdk::{Address, Env, String, Vec};

use crate::operation::admin::{get_admin, set_admin};
use crate::storage::error::Error;
use crate::storage::types::DataKey;

#[contract]
pub struct Store;

#[contractimpl]
impl Store {
    pub fn __constructor(env: &Env, admin: Address, xlm: Address) {
        env.storage().persistent().set(&DataKey::Admin, &admin);
        env.storage().persistent().set(&DataKey::Token, &xlm);
        env.storage().persistent().set(&DataKey::Price, &10_000_000);
    }

    pub fn set_admin(env: Env, caller: Address, new_admin: Address) -> Result<(), Error> {
        set_admin(env, caller, new_admin)
    }

    pub fn get_admin(env: Env) {
        get_admin(env);
    }

    pub fn buy_notepad(env: Env, name: String, emojis: Vec<String>) -> Address {
        // check money
        validate_payment();
        // deploy contract
    }

    pub fn validate_payment(e: &Env, caller: Address) {
        caller.require_auth();

        let token = e.storage().persistent().get(&DataKey::Token).unwrap();
        let xlm = Client::new(&e, token);

        let price = e.storage().persistent().get(&DataKey::Price).unwrap();
        xlm.transfer(&caller, &e.current_contract_address(), &price);

        // Update internal balance
        let current_balance: i128 = env.storage().instance().get(&BALANCE).unwrap_or(0);
        env.storage()
            .instance()
            .set(&BALANCE, &(current_balance + amount));
    }
}
