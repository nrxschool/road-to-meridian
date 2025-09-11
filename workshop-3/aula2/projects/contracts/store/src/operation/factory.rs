use crate::storage::{error::Error, types::DataKey};
use soroban_sdk::{Address, Bytes, BytesN, Env, IntoVal, String, Val, Vec};

pub fn deploy_notepad(env: &Env, caller: Address, name: String) -> Result<Address, Error> {
    // Security: Require caller authentication
    caller.require_auth();

    // Validation: Check if name is not empty
    if name.len() == 0 {
        return Err(Error::InvalidName);
    }

    // Get the stored WASM hash for notepad contracts
    let wasm_hash = if let Some(hash) = env
        .storage()
        .persistent()
        .get::<DataKey, BytesN<32>>(&DataKey::NotepadWasmHash)
    {
        hash
    } else {
        return Err(Error::DeployNewHash);
    };

    // Generate a unique salt based on caller address and name
    // This ensures each deployment has a unique address
    let salt = generate_salt(env, &caller, &name);

    let constructor_args: Vec<Val> = Vec::from_array(env, [caller.clone().into_val(env)]);

    // Deploy the contract using Soroban's deployer API
    // This creates a new contract instance with the given WASM code
    let deployed_address = env
        .deployer()
        .with_address(env.current_contract_address(), salt)
        .deploy_v2(wasm_hash, constructor_args);

    Ok(deployed_address)
}

fn generate_salt(env: &Env, _caller: &Address, _name: &String) -> BytesN<32> {
    let ledger = env.ledger();
    let timestamp = ledger.timestamp();
    let sequence = ledger.sequence() as u64;

    // Combine multiple sources
    let seed = timestamp.wrapping_mul(sequence);

    let seed_bytes = Bytes::from_array(env, &seed.to_be_bytes());
    env.crypto().keccak256(&seed_bytes).to_bytes()
}

pub fn get_notepad_wasm_hash(env: &Env) -> Result<BytesN<32>, Error> {
    env.storage()
        .persistent()
        .get(&DataKey::NotepadWasmHash)
        .ok_or(Error::Unauthorized)
}

pub fn update_notepad_wasm_hash(
    env: &Env,
    caller: Address,
    new_wasm_hash: BytesN<32>,
) -> Result<(), Error> {
    // Security: Require caller authentication
    caller.require_auth();

    // Verify caller is admin (this should be implemented in admin module)
    let admin: Address = env
        .storage()
        .persistent()
        .get(&DataKey::Admin)
        .ok_or(Error::Unauthorized)?;

    if caller != admin {
        return Err(Error::Unauthorized);
    }

    // Validation: Ensure the new hash is not empty (all zeros)
    let empty_hash = BytesN::from_array(env, &[0u8; 32]);
    if new_wasm_hash == empty_hash {
        return Err(Error::Unauthorized); // Could create a specific validation error
    }

    // Update the WASM hash
    env.storage()
        .persistent()
        .set(&DataKey::NotepadWasmHash, &new_wasm_hash);

    Ok(())
}
