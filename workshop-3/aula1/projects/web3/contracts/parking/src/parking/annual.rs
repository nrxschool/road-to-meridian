//! Annual pass functionality
//! Handles annual parking passes and validation

use soroban_sdk::{Env, Address, Symbol};
use crate::types::*;
use crate::errors::ParkingError;
use crate::storage::operations::*;

/// Purchase an annual parking pass
/// Allows unlimited parking for one year from purchase date
pub fn purchase_annual_pass(
    env: &Env,
    _caller: &Address,
    plate: Symbol,
    payment: i128,
) -> Result<(), ParkingError> {
    // Set reentrancy guard
    set_reentrancy_guard(env)?;
    
    // Check if vehicle already has valid annual pass
    if has_valid_annual_pass(env, &plate) {
        clear_reentrancy_guard(env);
        return Err(ParkingError::AlreadyParked);
    }
    
    // Check if vehicle is currently parked with hourly ticket
    if has_active_ticket(env, &plate) {
        clear_reentrancy_guard(env);
        return Err(ParkingError::AlreadyParked);
    }
    
    // Check if vehicle has unpaid fines
    if has_unpaid_fine(env, &plate) {
        clear_reentrancy_guard(env);
        return Err(ParkingError::FinePaymentRequired);
    }
    
    // Validate payment amount
    let annual_price = get_annual_price(env)?;
    if payment < annual_price {
        clear_reentrancy_guard(env);
        return Err(ParkingError::InsufficientPayment);
    }
    
    // Create annual pass
    let current_time = env.ledger().timestamp();
    let annual_pass = AnnualPass {
        plate: plate.clone(),
        purchase_time: current_time,
        amount_paid: payment,
    };
    
    // Store pass and add revenue
    store_annual_pass(env, &plate, &annual_pass);
    add_revenue(env, payment);
    
    // Clear reentrancy guard
    clear_reentrancy_guard(env);
    
    Ok(())
}

/// Park with annual pass
/// Validates that the annual pass is still valid
pub fn park_with_annual_pass(
    env: &Env,
    _caller: &Address,
    plate: Symbol,
) -> Result<(), ParkingError> {
    // Check if vehicle has valid annual pass
    if !has_valid_annual_pass(env, &plate) {
        return Err(ParkingError::NotParked);
    }
    
    // Check if vehicle has unpaid fines
    if has_unpaid_fine(env, &plate) {
        return Err(ParkingError::FinePaymentRequired);
    }
    
    // Annual pass holders can park without additional tickets
    Ok(())
}

/// Exit parking with annual pass
/// Annual pass holders can exit anytime without penalties
pub fn exit_annual_parking(
    env: &Env,
    _caller: &Address,
    plate: Symbol,
) -> Result<(), ParkingError> {
    // Check if vehicle has valid annual pass
    if !has_valid_annual_pass(env, &plate) {
        return Err(ParkingError::NotParked);
    }
    
    // Annual pass holders can exit without any additional processing
    Ok(())
}

/// Get annual pass information
/// Returns pass details if vehicle has an annual pass
pub fn get_annual_pass_info(env: &Env, plate: Symbol) -> Option<AnnualPass> {
    get_annual_pass(env, &plate)
}

/// Check if annual pass is valid
/// Returns true if pass exists and hasn't expired
pub fn is_annual_pass_valid(env: &Env, plate: Symbol) -> bool {
    has_valid_annual_pass(env, &plate)
}

// Note: Utility functions removed as they're not currently used
// They can be added back when needed:
// - get_annual_pass_expiry
// - get_remaining_annual_time

/// Renew annual pass
/// Extends the current pass or creates a new one if expired
pub fn renew_annual_pass(
    env: &Env,
    _caller: &Address,
    plate: Symbol,
    payment: i128,
) -> Result<(), ParkingError> {
    // Set reentrancy guard
    set_reentrancy_guard(env)?;
    
    // Check if vehicle has unpaid fines
    if has_unpaid_fine(env, &plate) {
        clear_reentrancy_guard(env);
        return Err(ParkingError::FinePaymentRequired);
    }
    
    // Validate payment amount
    let annual_price = get_annual_price(env)?;
    if payment < annual_price {
        clear_reentrancy_guard(env);
        return Err(ParkingError::InsufficientPayment);
    }
    
    // Create new annual pass (overwrites existing one)
    let current_time = env.ledger().timestamp();
    let annual_pass = AnnualPass {
        plate: plate.clone(),
        purchase_time: current_time,
        amount_paid: payment,
    };
    
    // Store pass and add revenue
    store_annual_pass(env, &plate, &annual_pass);
    add_revenue(env, payment);
    
    // Clear reentrancy guard
    clear_reentrancy_guard(env);
    
    Ok(())
}