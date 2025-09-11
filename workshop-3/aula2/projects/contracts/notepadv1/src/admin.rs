use crate::storage::DataKey;
use soroban_sdk::{Address, Env};

pub fn only_admin(env: &Env, caller: Address) {
    let admin: Address = env
        .storage()
        .persistent()
        .get(&DataKey::Admin)
        .expect("Admin not set");

    if !caller.eq(&admin) {
        panic!("Only admin can perform this action");
    }
}

pub fn set_admin(env: &Env, caller: Address, new_admin: Address) {
    only_admin(env, caller);
    env.storage().persistent().set(&DataKey::Admin, &new_admin);
}

pub fn get_admin(env: &Env) -> Address {
    env.storage()
        .persistent()
        .get(&DataKey::Admin)
        .expect("Admin not set")
}
