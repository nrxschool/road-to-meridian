use crate::model::{DataKey, Game};
use soroban_sdk::{contract, contractimpl, Address, Env, String, Vec};

#[contract]
pub struct Contract;

#[contractimpl]
impl Contract {
    pub fn new_game(
        env: Env,
        player_address: Address,
        nickname: String,
        score: i32,
        game_time: i32,
    ) {
        let value = Game {
            nickname,
            score,
            game_time,
        };
        let key = DataKey::PlayerAddress(player_address);
        env.storage().persistent().set(&key, &value);

        let mut rank = env
            .storage()
            .persistent()
            .get::<DataKey, Vec<Game>>(&DataKey::Rank)
            .unwrap();

        rank.push_back(value);
        env.storage().persistent().set(&DataKey::Rank, &rank);
    }

    pub fn get_rank(env: Env) -> Vec<Game> {
        env.storage()
            .persistent()
            .get::<DataKey, Vec<Game>>(&DataKey::Rank)
            .unwrap()
    }
}
