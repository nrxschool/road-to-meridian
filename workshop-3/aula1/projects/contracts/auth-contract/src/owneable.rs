use super::*;

#[contractimpl]
impl Flipper {
    pub fn is_owner(env: &Env, address: Address) -> Result<(), Error> {
        let owner = env
            .storage()
            .instance()
            .get::<DataKey, Address>(&DataKey::Owner)
            .unwrap();
        if owner != address {
            Err(Error::Unauthorized)
        } else {
            Ok(())
        }
    }

    pub fn get_owner(env: &Env) -> Address {
        env.storage()
            .instance()
            .get::<DataKey, Address>(&DataKey::Owner)
            .unwrap()
    }

    pub fn set_owner(env: &Env, owner: Address, new_owner: Address) -> Result<(), Error> {
        Self::is_owner(env, owner)?;
        env.storage().instance().set(&DataKey::Owner, &new_owner);
        Ok(())
    }
}
