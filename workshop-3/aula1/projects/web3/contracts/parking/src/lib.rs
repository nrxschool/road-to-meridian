#![no_std]

use soroban_sdk::{contract, contractimpl, Address, Env, Symbol};

#[contract]
pub struct ParkingContract;

#[contractimpl]
impl ParkingContract {
    pub fn __constructor() -> {}
}
