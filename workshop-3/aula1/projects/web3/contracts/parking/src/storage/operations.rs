//! Storage operations for the parking contract
//! Provides high-level functions for data persistence

use soroban_sdk::{Env, Address, Symbol};
use crate::types::*;
use crate::errors::ParkingError;
use crate::storage::keys::*;

// ============================================================================
// INSTANCE STORAGE OPERATIONS (Contract configuration)
// ============================================================================

/// Initialize the contract with administrators and pricing
pub fn initialize_contract(
    env: &Env,
    admin1: Address,
    admin2: Address,
    admin3: Address,
    hourly_price: i128,
    annual_price: i128,
    total_spots: u32,
) -> Result<(), ParkingError> {
    // Check if already initialized
    if env.storage().instance().has(&INITIALIZED) {
        return Err(ParkingError::AlreadyInitialized);
    }

    // Store administrators
    env.storage().instance().set(&ADMIN_1, &admin1);
    env.storage().instance().set(&ADMIN_2, &admin2);
    env.storage().instance().set(&ADMIN_3, &admin3);

    // Store pricing configuration
    env.storage().instance().set(&HOURLY_PRICE, &hourly_price);
    env.storage().instance().set(&ANNUAL_PRICE, &annual_price);
    env.storage().instance().set(&TOTAL_SPOTS, &total_spots);
    env.storage().instance().set(&TOTAL_REVENUE, &0i128);

    // Mark as initialized
    env.storage().instance().set(&INITIALIZED, &true);

    Ok(())
}

/// Check if the contract is initialized
pub fn is_initialized(env: &Env) -> bool {
    env.storage().instance().has(&INITIALIZED)
}

/// Check if an address is an administrator
pub fn is_admin(env: &Env, address: &Address) -> bool {
    if let Some(admin1) = env.storage().instance().get::<Symbol, Address>(&ADMIN_1) {
        if admin1 == *address {
            return true;
        }
    }
    if let Some(admin2) = env.storage().instance().get::<Symbol, Address>(&ADMIN_2) {
        if admin2 == *address {
            return true;
        }
    }
    if let Some(admin3) = env.storage().instance().get::<Symbol, Address>(&ADMIN_3) {
        if admin3 == *address {
            return true;
        }
    }
    false
}

/// Get hourly parking price
pub fn get_hourly_price(env: &Env) -> Result<i128, ParkingError> {
    env.storage()
        .instance()
        .get(&HOURLY_PRICE)
        .ok_or(ParkingError::NotInitialized)
}

/// Get annual pass price
pub fn get_annual_price(env: &Env) -> Result<i128, ParkingError> {
    env.storage()
        .instance()
        .get(&ANNUAL_PRICE)
        .ok_or(ParkingError::NotInitialized)
}

/// Update hourly price (admin only)
pub fn set_hourly_price(env: &Env, caller: &Address, new_price: i128) -> Result<(), ParkingError> {
    if !is_admin(env, caller) {
        return Err(ParkingError::NotAdmin);
    }
    env.storage().instance().set(&HOURLY_PRICE, &new_price);
    Ok(())
}

/// Update annual price (admin only)
pub fn set_annual_price(env: &Env, caller: &Address, new_price: i128) -> Result<(), ParkingError> {
    if !is_admin(env, caller) {
        return Err(ParkingError::NotAdmin);
    }
    env.storage().instance().set(&ANNUAL_PRICE, &new_price);
    Ok(())
}

/// Add revenue to total
pub fn add_revenue(env: &Env, amount: i128) {
    let current_revenue: i128 = env.storage()
        .instance()
        .get(&TOTAL_REVENUE)
        .unwrap_or(0);
    env.storage().instance().set(&TOTAL_REVENUE, &(current_revenue + amount));
}

/// Get total revenue
pub fn get_total_revenue(env: &Env) -> i128 {
    env.storage()
        .instance()
        .get(&TOTAL_REVENUE)
        .unwrap_or(0)
}

/// Withdraw revenue (requires multi-admin approval)
pub fn withdraw_revenue(env: &Env, amount: i128) -> Result<(), ParkingError> {
    let current_revenue = get_total_revenue(env);
    if amount > current_revenue {
        return Err(ParkingError::InsufficientRevenue);
    }
    env.storage().instance().set(&TOTAL_REVENUE, &(current_revenue - amount));
    Ok(())
}

// ============================================================================
// TEMPORARY STORAGE OPERATIONS (Short-term data)
// ============================================================================

/// Set reentrancy guard
pub fn set_reentrancy_guard(env: &Env) -> Result<(), ParkingError> {
    if env.storage().temporary().has(&REENTRANCY_GUARD) {
        return Err(ParkingError::ReentrancyDetected);
    }
    env.storage().temporary().set(&REENTRANCY_GUARD, &true);
    Ok(())
}

/// Clear reentrancy guard
pub fn clear_reentrancy_guard(env: &Env) {
    env.storage().temporary().remove(&REENTRANCY_GUARD);
}

/// Store parking ticket
pub fn store_ticket(env: &Env, plate: &Symbol, ticket: &ParkingTicket) {
    let key = get_ticket_key(plate);
    env.storage().temporary().set(&key, ticket);
}

/// Get parking ticket
pub fn get_ticket(env: &Env, plate: &Symbol) -> Option<ParkingTicket> {
    let key = get_ticket_key(plate);
    env.storage().temporary().get(&key)
}

/// Remove parking ticket
pub fn remove_ticket(env: &Env, plate: &Symbol) {
    let key = get_ticket_key(plate);
    env.storage().temporary().remove(&key);
}

/// Check if vehicle has active ticket
pub fn has_active_ticket(env: &Env, plate: &Symbol) -> bool {
    let key = get_ticket_key(plate);
    env.storage().temporary().has(&key)
}

// ============================================================================
// PERSISTENT STORAGE OPERATIONS (Long-term data)
// ============================================================================

/// Store annual pass
pub fn store_annual_pass(env: &Env, plate: &Symbol, pass: &AnnualPass) {
    let key = get_annual_key(plate);
    env.storage().persistent().set(&key, pass);
}

/// Get annual pass
pub fn get_annual_pass(env: &Env, plate: &Symbol) -> Option<AnnualPass> {
    let key = get_annual_key(plate);
    env.storage().persistent().get(&key)
}

/// Check if vehicle has valid annual pass
pub fn has_valid_annual_pass(env: &Env, plate: &Symbol) -> bool {
    if let Some(pass) = get_annual_pass(env, plate) {
        let current_time = env.ledger().timestamp();
        // Annual pass is valid for 365 days (31,536,000 seconds)
        let expiry_time = pass.purchase_time + 31_536_000;
        return current_time < expiry_time;
    }
    false
}

/// Store fine record
pub fn store_fine(env: &Env, plate: &Symbol, fine: &FineRecord) {
    let key = get_fine_key(plate);
    env.storage().persistent().set(&key, fine);
}

/// Get fine record
pub fn get_fine(env: &Env, plate: &Symbol) -> Option<FineRecord> {
    let key = get_fine_key(plate);
    env.storage().persistent().get(&key)
}

/// Remove fine record (after payment)
pub fn remove_fine(env: &Env, plate: &Symbol) {
    let key = get_fine_key(plate);
    env.storage().persistent().remove(&key);
}

/// Check if vehicle has unpaid fine
pub fn has_unpaid_fine(env: &Env, plate: &Symbol) -> bool {
    let key = get_fine_key(plate);
    env.storage().persistent().has(&key)
}