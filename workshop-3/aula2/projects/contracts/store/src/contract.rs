use soroban_sdk::{contract, contractimpl, BytesN};
use soroban_sdk::{Address, Env, String};

use crate::operation::admin::{get_admin, set_admin};
use crate::operation::factory::{deploy_notepad, get_notepad_wasm_hash, update_notepad_wasm_hash};
use crate::operation::treasure::{collect_payment, get_price, validate_payment};
use crate::storage::error::Error;
use crate::storage::types::DataKey;

#[contract]
pub struct Store;

#[contractimpl]
impl Store {
    pub fn __constructor(env: &Env, admin: Address, xlm: Address, notepad_wasm_hash: BytesN<32>) {
        env.storage().persistent().set(&DataKey::Admin, &admin);
        env.storage().persistent().set(&DataKey::Token, &xlm);
        env.storage().persistent().set(&DataKey::Price, &10_000_000);
        env.storage()
            .persistent()
            .set(&DataKey::NotepadWasmHash, &notepad_wasm_hash);
    }

    pub fn set_admin(env: Env, caller: Address, new_admin: Address) -> Result<(), Error> {
        set_admin(env, caller, new_admin)
    }

    pub fn get_admin(env: Env) {
        get_admin(env);
    }

    pub fn buy_notepad(env: Env, caller: Address, name: String) -> Result<Address, Error> {
        let price = get_price(&env);
        validate_payment(&env, caller.clone(), price)?;
        collect_payment(&env, caller.clone(), price)?;

        deploy_notepad(&env, caller, name)
    }

    pub fn get_notepad_wasm_hash(env: Env) -> Result<BytesN<32>, Error> {
        get_notepad_wasm_hash(&env)
    }

    pub fn update_notepad_wasm_hash(
        env: Env,
        caller: Address,
        new_hash: BytesN<32>,
    ) -> Result<(), Error> {
        update_notepad_wasm_hash(&env, caller, new_hash)
    }
}
