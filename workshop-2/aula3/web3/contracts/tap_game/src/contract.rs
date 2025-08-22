use crate::model::{DataKey, Game};
use soroban_sdk::{contract, contractimpl, Address, Env, String, Vec};

#[contract]
pub struct Contract;

#[contractimpl]
impl Contract {
    pub fn initialize(env: Env) {
        if env.storage().persistent().has(&DataKey::Rank) {
            return;
        }

        let initial_rank: Vec<Game> = Vec::new(&env);
        env.storage()
            .persistent()
            .set(&DataKey::Rank, &initial_rank);
    }

    pub fn new_game(env: Env, player: Address, nickname: String, score: i32, game_time: i32) {
        env.storage().persistent().set(&player, &score);
        let value = Game {
            player: player.clone(),
            nickname,
            score,
            game_time,
        };

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
