#![no_std]

use soroban_sdk::{contract, contractimpl};

#[contract]
pub struct ParkingContract;

#[contractimpl]
impl ParkingContract {
    pub fn __constructor() {}
}
