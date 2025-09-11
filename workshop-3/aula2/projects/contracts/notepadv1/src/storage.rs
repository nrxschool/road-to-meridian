use soroban_sdk::contracttype;


#[contracttype]
pub enum DataKey {
    Admin,
    Counter,
    Note(u32),
}