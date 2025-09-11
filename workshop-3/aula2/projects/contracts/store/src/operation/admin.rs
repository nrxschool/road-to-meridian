use soroban_sdk::symbol_short;
use soroban_sdk::{Address, Env};

use crate::storage::error::Error;
use crate::storage::types::DataKey;

pub fn set_admin(env: Env, caller: Address, new_admin: Address) -> Result<(), Error> {
    only_admin(&env, caller).unwrap();

    env.storage().persistent().set(&DataKey::Admin, &new_admin);

    env.events()
        .publish((symbol_short!("new_admin"), new_admin), ());

    Ok(())
}

pub fn get_admin(env: Env) {
    env.storage().persistent().get(&DataKey::Admin).unwrap()
}

pub fn only_admin(e: &Env, caller: Address) -> Result<(), Error> {
    let admin: Address = e.storage().persistent().get(&DataKey::Admin).unwrap();
    if admin != caller {
        return Err(Error::Unauthorized);
    }

    Ok(())
}
