use super::*;

#[contractimpl]
impl Flipper {
    pub fn get(env: &Env) -> bool {
        env.storage().instance().get(&DataKey::State).unwrap()
    }

    pub fn flip(env: &Env, owner: Address) -> Result<(), Error> {
        Self::is_owner(env, owner)?;
        let state: bool = env.storage().instance().get(&DataKey::State).unwrap();
        env.storage().instance().set(&DataKey::State, &!state);
        Ok(())
    }
}
