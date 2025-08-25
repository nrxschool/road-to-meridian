use super::*;

#[contractimpl]
impl TtlContract {
    pub fn acc_instance(env: &Env) {
        let mut counter = env.storage().instance().get(&INSTANCE).unwrap_or(0);
        counter += 1;
        env.storage().instance().set(&INSTANCE, &counter);
    }

    pub fn get_instance(env: &Env) -> i32 {
        env.storage().instance().get(&INSTANCE).unwrap_or(0)
    }
}
