use soroban_sdk::{BytesN, Env};

pub fn version() -> u32 {
    10
}

pub fn upgrade(env: Env, new_wasm_hash: BytesN<32>) {
    let admin = crate::admin::get_admin(&env);
    admin.require_auth();

    env.deployer().update_current_contract_wasm(new_wasm_hash);
}
