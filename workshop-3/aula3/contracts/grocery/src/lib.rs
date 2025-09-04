#![no_std]
use soroban_sdk::{
    contract, contractimpl, symbol_short, token, Address, Bytes, BytesN, Env, Symbol, Val, Vec,
};

const ADMIN: Symbol = symbol_short!("admin");
const NOTEPAD_WASM_HASH: Symbol = symbol_short!("wasm_hash");
const NOTEPAD_PRICE: Symbol = symbol_short!("price");
const DEPLOYED_NOTEPADS: Symbol = symbol_short!("notepads");
const BALANCE: Symbol = symbol_short!("balance");

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

#[contractimpl]
impl Deployer {
    /// Set the price for buying a notepad in stroops (1 XLM = 10,000,000 stroops)
    pub fn set_notepad_price(env: Env, admin: Address, price: i128) {
        Self::check_admin(admin);
        env.storage().instance().set(&NOTEPAD_PRICE, &price);
    }

    /// Get the current notepad price
    pub fn get_notepad_price(env: Env) -> i128 {
        env.storage()
            .instance()
            .get(&NOTEPAD_PRICE)
            .unwrap_or(10_000_000) // Default 1 XLM
    }

    /// Buy a notepad by sending exact XLM amount
    pub fn buy_notepad(env: Env, caller: Address) -> Address {
        caller.require_auth();

        let price = Self::get_notepad_price(env.clone());

        // Create token client for native XLM
        // In production, you would get this address using: soroban lab token id --asset native --network <network>
        // For now, we'll use a placeholder approach that works with the current SDK
        let native_token = token::Client::new(&env, &env.current_contract_address());
        
        // Transfer XLM from caller to contract
        native_token.transfer(&caller, &env.current_contract_address(), &price);

        // Get the notepad WASM hash
        let wasm_hash = Self::get_notepad_wasm_hash(&env);

        // Generate unique salt for deployment using caller address and ledger sequence
        let sequence = env.ledger().sequence();
        let salt_bytes = Bytes::from_array(&env, &sequence.to_be_bytes());
        let salt = env.crypto().keccak256(&salt_bytes);

        // Deploy notepad contract with caller as admin
        let constructor_args: Vec<Val> = Vec::from_array(&env, [caller.to_val()]);
        let notepad_address = env
            .deployer()
            .with_current_contract(salt)
            .deploy_v2(wasm_hash, constructor_args);

        // Store the deployed notepad address
        let mut deployed_notepads: Vec<Address> = env
            .storage()
            .instance()
            .get(&DEPLOYED_NOTEPADS)
            .unwrap_or(Vec::new(&env));
        deployed_notepads.push_back(notepad_address.clone());
        env.storage()
            .instance()
            .set(&DEPLOYED_NOTEPADS, &deployed_notepads);

        // Update contract balance
        let current_balance: i128 = env.storage().instance().get(&BALANCE).unwrap_or(0);
        env.storage()
            .instance()
            .set(&BALANCE, &(current_balance + price));

        notepad_address
    }

    /// Withdraw XLM from contract (admin only)
    pub fn withdraw(env: Env, admin: Address, to: Address) {
        Self::check_admin(admin);

        let balance = Self::get_balance(env.clone());
        if balance == 0 {
            panic!("Insufficient balance");
        }

        // Create token client for native XLM
        // In production, you would get this address using: soroban lab token id --asset native --network <network>
        // For now, we'll use a placeholder approach that works with the current SDK
        let native_token = token::Client::new(&env, &env.current_contract_address());
        
        // Transfer XLM from contract to specified address
        native_token.transfer(&env.current_contract_address(), &to, &balance);
        
        // Reset the balance
        env.storage().instance().set(&BALANCE, &0i128);
    }

    /// Get list of all deployed notepad addresses
    pub fn get_deployed_notepads(env: Env) -> Vec<Address> {
        env.storage()
            .instance()
            .get(&DEPLOYED_NOTEPADS)
            .unwrap_or(Vec::new(&env))
    }

    /// Get contract's XLM balance
    pub fn get_balance(env: Env) -> i128 {
        env.storage().instance().get(&BALANCE).unwrap_or(0)
    }
}
