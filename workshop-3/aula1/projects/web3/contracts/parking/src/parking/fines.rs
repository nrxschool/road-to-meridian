//! Fine management functionality
//! Handles parking fines and payments

use soroban_sdk::{Env, Address, Symbol};
use crate::types::*;
use crate::errors::ParkingError;
use crate::storage::operations::*;

/// Issue a fine for expired parking
/// Called automatically when a vehicle exits with an expired ticket
pub fn issue_fine(
    env: &Env,
    plate: Symbol,
    fine_amount: i128,
) -> Result<(), ParkingError> {
    // Check if vehicle already has an unpaid fine
    if has_unpaid_fine(env, &plate) {
        return Err(ParkingError::AlreadyParked); // Reusing error for "already has fine"
    }
    
    // Create fine record
    let current_time = env.ledger().timestamp();
    let fine = FineRecord {
        plate: plate.clone(),
        fine_amount,
        issue_time: current_time,
    };
    
    // Store fine record
    store_fine(env, &plate, &fine);
    
    Ok(())
}

/// Pay outstanding fine
/// Users must pay fines before they can park again
pub fn pay_fine(
    env: &Env,
    _caller: &Address,
    plate: Symbol,
    payment: i128,
) -> Result<(), ParkingError> {
    // Set reentrancy guard
    set_reentrancy_guard(env)?;
    
    // Check if vehicle has an unpaid fine
    let fine = get_fine(env, &plate).ok_or(ParkingError::NotParked)?;
    
    // Validate payment amount
    if payment < fine.fine_amount {
        clear_reentrancy_guard(env);
        return Err(ParkingError::InsufficientPayment);
    }
    
    // Remove fine record and add revenue
    remove_fine(env, &plate);
    add_revenue(env, payment);
    
    // Clear reentrancy guard
    clear_reentrancy_guard(env);
    
    Ok(())
}

/// Get fine information
/// Returns fine details if vehicle has an unpaid fine
pub fn get_fine_info(env: &Env, plate: Symbol) -> Option<FineRecord> {
    get_fine(env, &plate)
}

/// Check if vehicle has unpaid fine
/// Returns true if there's an outstanding fine
pub fn has_outstanding_fine(env: &Env, plate: Symbol) -> bool {
    has_unpaid_fine(env, &plate)
}

/// Calculate fine amount based on hours overdue
/// Used to determine fine amount for expired tickets
pub fn calculate_fine_amount(env: &Env, hours_overdue: u32) -> Result<i128, ParkingError> {
    let hourly_price = get_hourly_price(env)?;
    
    // Base fine is 2x hourly rate
    let base_fine = hourly_price * 2;
    
    // Additional penalty for each hour overdue
    let additional_penalty = hourly_price * (hours_overdue as i128);
    
    Ok(base_fine + additional_penalty)
}

/// Get fine age in seconds
/// Returns how long the fine has been outstanding
pub fn get_fine_age(env: &Env, plate: Symbol) -> u64 {
    if let Some(fine) = get_fine(env, &plate) {
        let current_time = env.ledger().timestamp();
        return current_time.saturating_sub(fine.issue_time);
    }
    0
}

/// Check if a fine is overdue
/// Fines may incur additional charges if unpaid for too long
pub fn is_fine_overdue(env: &Env, plate: &Symbol) -> bool {
    let fine_age = get_fine_age(env, plate.clone());
    // Consider fine overdue after 30 days (2,592,000 seconds)
    fine_age > 2_592_000
}

/// Apply additional penalty for overdue fines
/// Increases fine amount for fines that remain unpaid
pub fn apply_overdue_penalty(
    env: &Env,
    caller: &Address,
    plate: Symbol,
) -> Result<(), ParkingError> {
    // Only admins can apply overdue penalties
    if !is_admin(env, caller) {
        return Err(ParkingError::NotAdmin);
    }
    
    // Check if vehicle has an overdue fine
    if let Some(mut fine) = get_fine(env, &plate) {
        if is_fine_overdue(env, &plate) {
            // Double the fine amount for overdue fines
            fine.fine_amount *= 2;
            store_fine(env, &plate, &fine);
            return Ok(());
        }
    }
    
    Err(ParkingError::NotParked)
}

/// Get total outstanding fines (admin function)
/// Returns the sum of all unpaid fines in the system
pub fn get_total_outstanding_fines(env: &Env, caller: &Address) -> Result<i128, ParkingError> {
    // Only admins can view total outstanding fines
    if !is_admin(env, caller) {
        return Err(ParkingError::NotAdmin);
    }
    
    // Note: In a real implementation, you would iterate through all fine records
    // For simplicity, we'll return 0 here as we don't have a way to iterate
    // through all stored keys in Soroban without maintaining a separate index
    Ok(0)
}