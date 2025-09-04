#![no_std]
use soroban_sdk::{contract, contractimpl, symbol_short, Address, BytesN, Env, Symbol, Val, Vec};

const ADMIN: Symbol = symbol_short!("admin");
const NOTEPAD_WASM_HASH: Symbol = symbol_short!("notepad_hash");

#[contract]
pub struct Deployer;

#[contractimpl]
impl Deployer {
    /// Construct the deployer with a provided administrator.
    pub fn __constructor(env: Env, admin: Address) {
        env.storage().instance().set(&ADMIN, &admin);
    }
}

#[contractimpl]
impl Deployer {
    /// Deploys a contract using an existing WASM hash on the testnet.
    /// This has to be authorized by the Deployer's administrator.
    pub fn deploy(
        env: Env,
        wasm_hash: BytesN<32>,
        salt: BytesN<32>,
        constructor_args: Vec<Val>,
    ) -> Address {
        let admin: Address = env.storage().instance().get(&ADMIN).unwrap();
        admin.require_auth();

        // Deploy the contract using the uploaded Wasm with given hash on behalf
        // of the current contract.
        env.deployer()
            .with_current_contract(salt)
            .deploy_v2(wasm_hash, constructor_args)
    }

    pub fn set_notepad_wasm_hash(env: &Env, admin: Address, wasm_hash: BytesN<32>) {
        Self::check_admin(admin);
        env.storage().instance().set(&NOTEPAD_WASM_HASH, &wasm_hash);
    }

    pub fn get_notepad_wasm_hash(env: &Env) -> BytesN<32> {
        env.storage().instance().get(&NOTEPAD_WASM_HASH).unwrap()
    }
}

#[contractimpl]
impl Deployer {
    fn check_admin(admin: Address) {
        admin.require_auth();
    }

    pub fn set_admin(env: &Env, admin: Address, new_admin: Address) {
        Self::check_admin(admin);
        env.storage().instance().set(&ADMIN, &new_admin);
    }

    pub fn get_admin(env: &Env) -> Address {
        env.storage().instance().get(&ADMIN).unwrap()
    }
}
