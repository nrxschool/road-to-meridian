use soroban_sdk::{contracttype, Address, String};

#[derive(Clone)]
#[contracttype]
pub struct Game {
    pub player: Address,
    pub nickname: String,
    pub game_time: i32,
    pub score: i32,
}

#[derive(Clone)]
#[contracttype]
pub enum DataKey {
    Rank,
    PlayerAddress(Address),
}
