#![cfg(test)]

use soroban_sdk::testutils::Address as _; // enables Address::generate in tests
use soroban_sdk::{log, Address, Env, String, Vec};
use tap_game::contract::{Contract, ContractClient};
use tap_game::model::{DataKey, Game};

fn init_rank_storage(env: &Env, contract_id: &Address) {
    // Initialize the persistent Rank vector so new_game doesn't unwrap(None)
    env.as_contract(contract_id, || {
        let empty: Vec<Game> = Vec::new(env);
        env.storage().persistent().set(&DataKey::Rank, &empty);
    });
}

#[test]
fn new_game_and_rank_single() {
    let env = Env::default();
    let contract_id = env.register(Contract, ());
    let client = ContractClient::new(&env, &contract_id);

    init_rank_storage(&env, &contract_id);

    let player = Address::generate(&env);
    let name = String::from_str(&env, "Alice");
    let score: i32 = 42;
    let game_time: i32 = 120;

    client.new_game(&player, &name, &score, &game_time);

    let rank = client.get_rank();
    assert_eq!(rank.len(), 1);
    let g0 = rank.get(0).unwrap();
    assert_eq!(g0.nickname, name);
    assert_eq!(g0.score, score);
    assert_eq!(g0.game_time, game_time);
}

#[test]
fn new_game_multiple_order() {
    let env = Env::default();
    let contract_id = env.register(Contract, ());
    let client = ContractClient::new(&env, &contract_id);

    init_rank_storage(&env, &contract_id);

    // First player
    let p1 = Address::generate(&env);
    let n1 = String::from_str(&env, "Bob");
    let s1: i32 = 10;
    let t1: i32 = 30;
    client.new_game(&p1, &n1, &s1, &t1);

    // Second player
    let p2 = Address::generate(&env);
    let n2 = String::from_str(&env, "Carol");
    let s2: i32 = 77;
    let t2: i32 = 200;
    client.new_game(&p2, &n2, &s2, &t2);

    let rank = client.get_rank();
    assert_eq!(rank.len(), 2);

    let g0 = rank.get(0).unwrap();
    assert_eq!(g0.nickname, n1);
    assert_eq!(g0.score, s1);
    assert_eq!(g0.game_time, t1);

    let g1 = rank.get(1).unwrap();
    assert_eq!(g1.nickname, n2);
    assert_eq!(g1.score, s2);
    assert_eq!(g1.game_time, t2);
}

#[test]
fn new_game_stores_by_address() {
    let env = Env::default();
    let contract_id = env.register(Contract, ());
    let client = ContractClient::new(&env, &contract_id);

    init_rank_storage(&env, &contract_id);

    let player = Address::generate(&env);
    let name = String::from_str(&env, "Dora");
    let score: i32 = 5;
    let game_time: i32 = 15;

    client.new_game(&player, &name, &score, &game_time);

    // Read back the per-player storage directly from contract storage
    let saved = env.as_contract(&contract_id, || {
        env.storage()
            .persistent()
            .get::<DataKey, i32>(&DataKey::PlayerAddress(player.clone()))
            .unwrap()
    });

    log!(&env, "saved: {}", saved);
    assert_eq!(saved, score);
}
