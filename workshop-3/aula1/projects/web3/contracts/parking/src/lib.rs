//! # Parking Smart Contract
//!
//! A comprehensive parking management system built on Soroban (Stellar blockchain).
//! This contract provides a complete solution for managing parking operations including
//! ticket purchases, annual passes, fine management, and administrative controls.
//!
//! ## Overview
//!
//! The parking contract is designed to handle all aspects of a modern parking system:
//! - **Hourly Parking**: Users can purchase parking tickets for specific durations
//! - **Annual Passes**: Frequent users can buy annual passes for unlimited parking
//! - **Fine Management**: Automated fine issuance and payment processing
//! - **Administrative Controls**: Multi-signature admin functions for system management
//! - **Revenue Tracking**: Complete financial oversight with withdrawal mechanisms
//!
//! ## Architecture
//!
//! The contract is organized into several modules:
//! - `types`: Core data structures and enums
//! - `errors`: Custom error definitions for all operations
//! - `storage`: Data persistence layer with keys and operations
//! - `parking`: Core parking functionality (hourly, annual, fines)
//! - `admin`: Administrative functions and multi-signature operations
//!
//! ## Security Features
//!
//! - **Access Control**: Admin-only functions protected by address verification
//! - **Input Validation**: All user inputs are validated before processing
//! - **Reentrancy Protection**: Guards against recursive calls
//! - **Safe Arithmetic**: Overflow-safe calculations for all financial operations
//!
//! ## Usage Example
//!
//! ```rust
//! // Initialize the contract (admin only)
//! contract.initialize(admin_address, hourly_price, annual_price);
//!
//! // Purchase hourly parking ticket
//! contract.purchase_hourly_ticket(plate, hours, payment);
//!
//! // Buy annual pass
//! contract.purchase_annual_pass(plate, payment);
//!
//! // Pay a fine
//! contract.pay_fine(plate, payment);
//! ```
//!
//! ## State Management
//!
//! The contract uses Soroban's storage system with three tiers:
//! - **Persistent**: Long-term data (config, passes, fines)
//! - **Instance**: Contract-level data (admin settings)
//! - **Temporary**: Short-lived data (reentrancy guards)
//!
//! ## Error Handling
//!
//! All functions return `Result<T, ParkingError>` for proper error handling.
//! See the `errors` module for complete error definitions.

#![no_std]

// Import all necessary modules
mod types;
mod errors;
mod storage;
mod parking;
mod admin;

// Re-export public types and errors
pub use types::*;
pub use errors::*;

// Import Soroban SDK components
use soroban_sdk::{
    contract, contractimpl, Address, Env, Symbol
};

// Import module functions
use storage::operations::*;
use parking::*;
use admin::*;

/// Main parking contract structure
#[contract]
pub struct ParkingContract;

/// Contract implementation with all public functions
#[contractimpl]
impl ParkingContract {
    
    // ========================================================================
    // INITIALIZATION FUNCTIONS
    // ========================================================================
    
    /// Initialize the parking contract with administrators and pricing
    /// Must be called once before any other operations
    /// 
    /// # Arguments
    /// * `admin1` - First administrator address
    /// * `admin2` - Second administrator address  
    /// * `admin3` - Third administrator address
    /// * `hourly_price` - Price per hour in stroops
    /// * `annual_price` - Annual pass price in stroops
    /// * `total_spots` - Total number of parking spots
    pub fn initialize(
        env: Env,
        admin1: Address,
        admin2: Address,
        admin3: Address,
        hourly_price: i128,
        annual_price: i128,
        total_spots: u32,
    ) -> Result<(), ParkingError> {
        initialize_contract(
            &env,
            admin1,
            admin2,
            admin3,
            hourly_price,
            annual_price,
            total_spots,
        )
    }
    
    // ========================================================================
    // HOURLY PARKING FUNCTIONS
    // ========================================================================
    
    /// Purchase an hourly parking ticket
    /// Users can park for 1-24 hours by paying the required amount
    /// 
    /// # Arguments
    /// * `plate` - Vehicle license plate identifier
    /// * `hours` - Number of hours to park (1-24)
    /// * `payment` - Payment amount in stroops
    pub fn buy_hourly_ticket(
        env: Env,
        plate: Symbol,
        hours: u32,
        payment: i128,
    ) -> Result<(), ParkingError> {
        let caller = env.current_contract_address();
        purchase_hourly_ticket(&env, &caller, plate, hours, payment)
    }
    
    /// Exit parking with hourly ticket
    /// Removes the ticket if still valid, or issues a fine if expired
    /// 
    /// # Arguments
    /// * `plate` - Vehicle license plate identifier
    pub fn exit_hourly(
        env: Env,
        plate: Symbol,
    ) -> Result<(), ParkingError> {
        let caller = env.current_contract_address();
        exit_hourly_parking(&env, &caller, plate)
    }
    
    /// Get parking ticket information
    /// Returns ticket details if vehicle is currently parked
    /// 
    /// # Arguments
    /// * `plate` - Vehicle license plate identifier
    pub fn get_ticket(
        env: Env,
        plate: Symbol,
    ) -> Option<ParkingTicket> {
        get_parking_ticket(&env, plate)
    }
    
    // Note: get_remaining_time function removed as it's not currently implemented
    // It can be added back when the utility function is restored
    
    // ========================================================================
    // ANNUAL PASS FUNCTIONS
    // ========================================================================
    
    /// Purchase an annual parking pass
    /// Allows unlimited parking for one year from purchase date
    /// 
    /// # Arguments
    /// * `plate` - Vehicle license plate identifier
    /// * `payment` - Payment amount in stroops
    pub fn buy_annual_pass(
        env: Env,
        plate: Symbol,
        payment: i128,
    ) -> Result<(), ParkingError> {
        let caller = env.current_contract_address();
        purchase_annual_pass(&env, &caller, plate, payment)
    }
    
    /// Park with annual pass
    /// Validates that the annual pass is still valid
    /// 
    /// # Arguments
    /// * `plate` - Vehicle license plate identifier
    pub fn park_annual(
        env: Env,
        plate: Symbol,
    ) -> Result<(), ParkingError> {
        let caller = env.current_contract_address();
        park_with_annual_pass(&env, &caller, plate)
    }
    
    /// Exit parking with annual pass
    /// Annual pass holders can exit anytime without penalties
    /// 
    /// # Arguments
    /// * `plate` - Vehicle license plate identifier
    pub fn exit_annual(
        env: Env,
        plate: Symbol,
    ) -> Result<(), ParkingError> {
        let caller = env.current_contract_address();
        exit_annual_parking(&env, &caller, plate)
    }
    
    /// Get annual pass information
    /// Returns pass details if vehicle has an annual pass
    /// 
    /// # Arguments
    /// * `plate` - Vehicle license plate identifier
    pub fn get_annual_pass(
        env: Env,
        plate: Symbol,
    ) -> Option<AnnualPass> {
        get_annual_pass_info(&env, plate)
    }
    
    /// Check if annual pass is valid
    /// Returns true if pass exists and hasn't expired
    /// 
    /// # Arguments
    /// * `plate` - Vehicle license plate identifier
    pub fn is_annual_valid(
        env: Env,
        plate: Symbol,
    ) -> bool {
        is_annual_pass_valid(&env, plate)
    }
    
    // ========================================================================
    // FINE MANAGEMENT FUNCTIONS
    // ========================================================================
    
    /// Pay outstanding fine
    /// Users must pay fines before they can park again
    /// 
    /// # Arguments
    /// * `plate` - Vehicle license plate identifier
    /// * `payment` - Payment amount in stroops
    pub fn pay_fine(
        env: Env,
        plate: Symbol,
        payment: i128,
    ) -> Result<(), ParkingError> {
        let caller = env.current_contract_address();
        parking::fines::pay_fine(&env, &caller, plate, payment)
    }
    
    /// Get fine information
    /// Returns fine details if vehicle has an unpaid fine
    /// 
    /// # Arguments
    /// * `plate` - Vehicle license plate identifier
    pub fn get_fine(
        env: Env,
        plate: Symbol,
    ) -> Option<FineRecord> {
        get_fine_info(&env, plate)
    }
    
    /// Check if vehicle has unpaid fine
    /// Returns true if there's an outstanding fine
    /// 
    /// # Arguments
    /// * `plate` - Vehicle license plate identifier
    pub fn has_fine(
        env: Env,
        plate: Symbol,
    ) -> bool {
        has_outstanding_fine(&env, plate)
    }
    
    // ========================================================================
    // ADMINISTRATIVE FUNCTIONS
    // ========================================================================
    
    /// Update hourly parking price (admin only)
    /// Any single admin can change pricing
    /// 
    /// # Arguments
    /// * `new_price` - New hourly price in stroops
    pub fn set_hourly_price(
        env: Env,
        new_price: i128,
    ) -> Result<(), ParkingError> {
        let caller = env.current_contract_address();
        update_hourly_price(&env, &caller, new_price)
    }
    
    /// Update annual pass price (admin only)
    /// Any single admin can change pricing
    /// 
    /// # Arguments
    /// * `new_price` - New annual price in stroops
    pub fn set_annual_price(
        env: Env,
        new_price: i128,
    ) -> Result<(), ParkingError> {
        let caller = env.current_contract_address();
        update_annual_price(&env, &caller, new_price)
    }
    
    /// Propose a revenue withdrawal (admin only)
    /// First admin proposes, requires approval from second admin
    /// 
    /// # Arguments
    /// * `amount` - Amount to withdraw in stroops
    /// * `recipient` - Address to receive the funds
    pub fn propose_withdrawal(
        env: Env,
        amount: i128,
        recipient: Address,
    ) -> Result<(), ParkingError> {
        let caller = env.current_contract_address();
        admin::functions::propose_withdrawal(&env, &caller, amount, recipient)
    }
    
    /// Approve a pending withdrawal (admin only)
    /// Second admin approves the withdrawal
    pub fn approve_withdrawal(
        env: Env,
    ) -> Result<(), ParkingError> {
        let caller = env.current_contract_address();
        admin::functions::approve_withdrawal(&env, &caller)
    }
    
    /// Get contract configuration (admin only)
    /// Returns current pricing and revenue information
    pub fn get_config(
        env: Env,
    ) -> Result<ParkingConfig, ParkingError> {
        let caller = env.current_contract_address();
        get_contract_config(&env, &caller)
    }
    
    /// Check if address is admin
    /// Public function to verify admin status
    /// 
    /// # Arguments
    /// * `address` - Address to check
    pub fn is_admin(
        env: Env,
        address: Address,
    ) -> bool {
        check_admin_status(&env, &address)
    }
    
    // ========================================================================
    // PUBLIC INFORMATION FUNCTIONS
    // ========================================================================
    
    /// Get current hourly price
    /// Public function to check pricing
    pub fn get_hourly_price(
        env: Env,
    ) -> Result<i128, ParkingError> {
        storage::operations::get_hourly_price(&env)
    }
    
    /// Get current annual price
    /// Public function to check pricing
    pub fn get_annual_price(
        env: Env,
    ) -> Result<i128, ParkingError> {
        storage::operations::get_annual_price(&env)
    }
    
    /// Get total revenue collected
    /// Public function to check contract revenue
    pub fn get_revenue(
        env: Env,
    ) -> i128 {
        get_total_revenue(&env)
    }
    
    /// Check if contract is initialized
    /// Public function to verify contract state
    pub fn is_initialized(
        env: Env,
    ) -> bool {
        storage::operations::is_initialized(&env)
    }
}
