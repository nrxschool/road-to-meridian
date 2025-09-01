use super::*;

#[contractimpl]
impl TtlContract {
    pub fn acc_persistent(env: &Env) {
        let mut counter = env.storage().persistent().get(&PERSISTENT).unwrap_or(0);
        counter += 1;
        env.storage().persistent().set(&PERSISTENT, &counter);
    }

    pub fn get_persistent(env: &Env) -> i32 {
        env.storage().persistent().get(&PERSISTENT).unwrap_or(0)
    }
}
