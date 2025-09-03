//! Hourly parking functionality
//! Handles parking tickets and hourly payments

use soroban_sdk::{Env, Address, Symbol};
use crate::types::*;
use crate::errors::ParkingError;
use crate::storage::operations::*;

/// Purchase an hourly parking ticket
/// Users can park for 1-24 hours by paying the required amount
pub fn purchase_hourly_ticket(
    env: &Env,
    _caller: &Address,
    plate: Symbol,
    hours: u32,
    payment: i128,
) -> Result<(), ParkingError> {
    // Set reentrancy guard
    set_reentrancy_guard(env)?;
    
    // Validate input parameters
    if hours == 0 || hours > 24 {
        clear_reentrancy_guard(env);
        return Err(ParkingError::InvalidHours);
    }
    
    // Check if vehicle is already parked
    if has_active_ticket(env, &plate) || has_valid_annual_pass(env, &plate) {
        clear_reentrancy_guard(env);
        return Err(ParkingError::AlreadyParked);
    }
    
    // Check if vehicle has unpaid fines
    if has_unpaid_fine(env, &plate) {
        clear_reentrancy_guard(env);
        return Err(ParkingError::FinePaymentRequired);
    }
    
    // Calculate required payment
    let hourly_price = get_hourly_price(env)?;
    let required_payment = hourly_price * (hours as i128);
    
    if payment < required_payment {
        clear_reentrancy_guard(env);
        return Err(ParkingError::InsufficientPayment);
    }
    
    // Create parking ticket
    let current_time = env.ledger().timestamp();
    let ticket = ParkingTicket {
        plate: plate.clone(),
        hours_paid: hours,
        amount_paid: payment,
        entry_time: current_time,
        has_exited: false
    };
    
    // Store ticket and add revenue
    store_ticket(env, &plate, &ticket);
    add_revenue(env, payment);
    
    // Clear reentrancy guard
    clear_reentrancy_guard(env);
    
    Ok(())
}

/// Exit parking with hourly ticket
/// Removes the ticket if still valid, or issues a fine if expired
pub fn exit_hourly_parking(
    env: &Env,
    _caller: &Address,
    plate: Symbol,
) -> Result<(), ParkingError> {
    // Set reentrancy guard
    set_reentrancy_guard(env)?;
    
    // Check if vehicle has active ticket
    let ticket = get_ticket(env, &plate).ok_or(ParkingError::NotParked)?;
    
    let current_time = env.ledger().timestamp();
    let expiry_time = ticket.entry_time + (ticket.hours_paid as u64 * 3600); // hours to seconds
    
    if current_time > expiry_time {
        // Ticket expired - issue fine
        let hourly_price = get_hourly_price(env)?;
        let fine_amount = hourly_price * 2; // Fine is 2x hourly rate
        
        let fine = FineRecord {
            plate: plate.clone(),
            fine_amount,
            issue_time: current_time,
        };
        
        store_fine(env, &plate, &fine);
        remove_ticket(env, &plate);
        
        clear_reentrancy_guard(env);
        return Err(ParkingError::TicketExpired);
    }
    
    // Ticket still valid - allow exit
    remove_ticket(env, &plate);
    
    // Clear reentrancy guard
    clear_reentrancy_guard(env);
    
    Ok(())
}

/// Get parking ticket information
/// Returns ticket details if vehicle is currently parked
pub fn get_parking_ticket(env: &Env, plate: Symbol) -> Option<ParkingTicket> {
    get_ticket(env, &plate)
}

// Note: Utility functions removed as they're not currently used
// They can be added back when needed:
// - calculate_hourly_cost
// - is_ticket_expired  
// - get_remaining_time