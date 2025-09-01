//! Test module for the parking smart contract
//! Contains comprehensive unit tests and integration tests

#![cfg(test)]

// Import necessary testing utilities
use soroban_sdk::{
    testutils::{Address as _, AuthorizedFunction, AuthorizedInvocation},
    Address, Env, Symbol,
};

// Import contract and types
use crate::{
    ParkingContract, ParkingContractClient,
    types::{ParkingTicket, AnnualPass, FineRecord, ParkingConfig},
    errors::ParkingError,
};

// Test modules
mod unit_tests;
mod integration_tests;

// Test utilities and helper functions
pub mod test_utils {
    use super::*;

    /// Create a test environment with initialized contract
    pub fn setup_test_env() -> (Env, ParkingContractClient<'static>, Address, Address) {
        let env = Env::default();
        let contract_id = env.register_contract(None, ParkingContract);
        let client = ParkingContractClient::new(&env, &contract_id);
        
        // Create test addresses
        let admin1 = Address::generate(&env);
        let admin2 = Address::generate(&env);
        
        (env, client, admin1, admin2)
    }

    /// Initialize contract with test parameters
    pub fn initialize_contract(
        client: &ParkingContractClient,
        admin1: &Address,
        admin2: &Address,
        hourly_price: i128,
        annual_price: i128,
    ) {
        client.initialize(admin1, admin2, &hourly_price, &annual_price);
    }

    /// Create a test plate symbol
    pub fn test_plate(env: &Env, plate_str: &str) -> Symbol {
        Symbol::new(env, plate_str)
    }

    /// Create a test user address
    pub fn test_user(env: &Env) -> Address {
        Address::generate(env)
    }

    /// Advance time in the test environment
    pub fn advance_time(env: &Env, seconds: u64) {
        env.ledger().with_mut(|li| {
            li.timestamp += seconds;
        });
    }

    /// Get current timestamp
    pub fn current_time(env: &Env) -> u64 {
        env.ledger().timestamp()
    }
}

// Common test constants
pub const DEFAULT_HOURLY_PRICE: i128 = 1_000_000; // 0.1 XLM in stroops
pub const DEFAULT_ANNUAL_PRICE: i128 = 100_000_000; // 10 XLM in stroops
pub const SECONDS_PER_HOUR: u64 = 3600;
pub const SECONDS_PER_DAY: u64 = 86400;
pub const SECONDS_PER_YEAR: u64 = 31_536_000;