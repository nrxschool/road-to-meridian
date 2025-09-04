#![no_std]
use soroban_sdk::{
    contract, contractimpl, Address, BytesN, Env, Val, Vec,
};

// Módulos modularizados seguindo o princípio de responsabilidade única
mod admin;
mod deployment;
mod pricing;
mod storage;
mod notepad;

use admin::AdminManager;
use deployment::DeploymentManager;
use pricing::PricingManager;

#[contract]
pub struct Deployer;

#[contractimpl]
impl Deployer {
    /// Construct the deployer with a provided administrator.
    pub fn __constructor(env: Env, admin: Address) {
        AdminManager::initialize_admin(&env, admin);
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
        let admin = AdminManager::get_admin(&env);
        DeploymentManager::deploy(&env, admin, wasm_hash, salt, constructor_args)
    }

    pub fn set_notepad_wasm_hash(env: Env, admin: Address, wasm_hash: BytesN<32>) {
        DeploymentManager::set_notepad_wasm_hash(&env, admin, wasm_hash);
    }

    pub fn get_notepad_wasm_hash(env: Env) -> BytesN<32> {
        DeploymentManager::get_notepad_wasm_hash(&env)
    }
}

#[contractimpl]
impl Deployer {
    pub fn set_admin(env: Env, admin: Address, new_admin: Address) {
        AdminManager::set_admin(&env, admin, new_admin);
    }

    pub fn get_admin(env: Env) -> Address {
        AdminManager::get_admin(&env)
    }
}

#[contractimpl]
impl Deployer {
    /// Set the price for buying a notepad in stroops (1 XLM = 10,000,000 stroops)
    pub fn set_notepad_price(env: Env, admin: Address, price: i128) {
        PricingManager::set_notepad_price(&env, admin, price);
    }

    /// Get the current notepad price
    pub fn get_notepad_price(env: Env) -> i128 {
        PricingManager::get_notepad_price(&env)
    }

    /// Buy a notepad by sending exact XLM amount
    pub fn buy_notepad(env: Env, caller: Address) -> Address {
        let price = PricingManager::get_notepad_price(&env);
        
        // Process payment
        PricingManager::process_payment(&env, caller.clone(), price);
        
        // Deploy notepad
        DeploymentManager::deploy_notepad(&env, caller)
    }

    /// Withdraw XLM from contract (admin only)
    pub fn withdraw(env: Env, admin: Address, to: Address) {
        PricingManager::withdraw(&env, admin, to);
    }

    /// Get list of all deployed notepad addresses
    pub fn get_deployed_notepads(env: Env) -> Vec<Address> {
        DeploymentManager::get_deployed_notepads(&env)
    }

    /// Get contract's XLM balance
    pub fn get_balance(env: Env) -> i128 {
        PricingManager::get_balance(&env)
    }
}
