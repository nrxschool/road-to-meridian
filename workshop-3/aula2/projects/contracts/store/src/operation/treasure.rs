use crate::{
    operation::admin::only_admin,
    storage::{error::Error, types::DataKey},
};
use soroban_sdk::{token::TokenClient, Address, Env};

fn get_token_client(env: &Env) -> TokenClient<'_> {
    let token: Address = env.storage().persistent().get(&DataKey::Token).unwrap();
    let xlm = TokenClient::new(env, &token);

    xlm
}

pub fn show_balance(env: &Env) -> i128 {
    let xlm = get_token_client(&env);

    xlm.balance(&env.current_contract_address())
}

pub fn validate_payment(env: &Env, caller: Address, amount: i128) -> Result<(), Error> {
    caller.require_auth();

    let xlm = get_token_client(env);
    let allowance = xlm.allowance(&caller, &env.current_contract_address());

    if amount >= allowance {
        Ok(())
    } else {
        Err(Error::NoAllowance)
    }
}

pub fn collect_payment(env: &Env, caller: Address, amount: i128) -> Result<(), Error> {
    validate_payment(&env, caller.clone(), amount).unwrap();
    let xlm = get_token_client(&env);

    xlm.transfer_from(
        &env.current_contract_address(),
        &caller,
        &env.current_contract_address(),
        &amount,
    );

    env.storage()
        .persistent()
        .update(&DataKey::Balance, |balance: Option<i128>| {
            balance.unwrap_or(0) + amount
        });

    Ok(())
}

pub fn withdraw(env: Env, caller: Address) -> Result<(), Error> {
    only_admin(&env, caller)
}

pub fn set_price(env: &Env, caller: Address, price: i128) -> Result<(), Error> {
    only_admin(env, caller)?;
    env.storage().persistent().set(&DataKey::Price, &price);
    Ok(())
}

pub fn get_price(env: &Env) -> i128 {
    env.storage().persistent().get(&DataKey::Price).unwrap_or(0)
}
