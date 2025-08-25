use super::*;

#[contractimpl]
impl TtlContract {
    pub fn acc_temporary(env: &Env) {
        let mut counter = env.storage().temporary().get(&TEMPORARY).unwrap_or(0);
        counter += 1;
        env.storage().temporary().set(&TEMPORARY, &counter);
    }

    pub fn get_temporary(env: &Env) -> i32 {
        env.storage().temporary().get(&TEMPORARY).unwrap_or(0)
    }
}

