use soroban_sdk::{BytesN, Env};

pub fn version() -> u32 {
    20
}

pub fn upgrade(env: Env, new_wasm_hash: BytesN<32>) {
    // Get admin from storage and require admin authorization
    let admin = crate::admin::get_admin(&env);
    admin.require_auth();

    // Update the contract with the new WASM bytecode
    // The new_wasm_hash must already be installed on the ledger
    env.deployer().update_current_contract_wasm(new_wasm_hash);
}
