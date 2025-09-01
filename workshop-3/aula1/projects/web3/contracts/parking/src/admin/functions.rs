//! Administrative functions for the parking contract
//! Handles admin-only operations and multi-signature requirements

use soroban_sdk::{Env, Address, Symbol, Vec, contracttype};
use crate::types::*;
use crate::errors::ParkingError;
use crate::storage::operations::*;

// ============================================================================
// MULTI-SIGNATURE STORAGE KEYS
// ============================================================================

/// Key for storing pending withdrawal proposals
const WITHDRAWAL_PROPOSAL: Symbol = soroban_sdk::symbol_short!("w_prop");

/// Key for storing withdrawal approvals
const WITHDRAWAL_APPROVALS: Symbol = soroban_sdk::symbol_short!("w_appr");

// ============================================================================
// PRICE MANAGEMENT FUNCTIONS
// ============================================================================

/// Update hourly parking price (admin only)
/// Any single admin can change pricing
pub fn update_hourly_price(
    env: &Env,
    caller: &Address,
    new_price: i128,
) -> Result<(), ParkingError> {
    if !is_initialized(env) {
        return Err(ParkingError::NotInitialized);
    }
    
    set_hourly_price(env, caller, new_price)
}

/// Update annual pass price (admin only)
/// Any single admin can change pricing
pub fn update_annual_price(
    env: &Env,
    caller: &Address,
    new_price: i128,
) -> Result<(), ParkingError> {
    if !is_initialized(env) {
        return Err(ParkingError::NotInitialized);
    }
    
    set_annual_price(env, caller, new_price)
}

// ============================================================================
// MULTI-SIGNATURE WITHDRAWAL FUNCTIONS
// ============================================================================

/// Propose a revenue withdrawal (admin only)
/// First admin proposes, requires approval from second admin
pub fn propose_withdrawal(
    env: &Env,
    caller: &Address,
    amount: i128,
    recipient: Address,
) -> Result<(), ParkingError> {
    if !is_initialized(env) {
        return Err(ParkingError::NotInitialized);
    }
    
    if !is_admin(env, caller) {
        return Err(ParkingError::NotAdmin);
    }
    
    // Check if there's sufficient revenue
    let total_revenue = get_total_revenue(env);
    if amount > total_revenue {
        return Err(ParkingError::InsufficientRevenue);
    }
    
    // Store withdrawal proposal
    let proposal = WithdrawalProposal {
        proposer: caller.clone(),
        amount,
        recipient,
        timestamp: env.ledger().timestamp(),
    };
    
    env.storage().temporary().set(&WITHDRAWAL_PROPOSAL, &proposal);
    
    // Initialize empty approvals list
    let approvals: Vec<Address> = Vec::new(env);
    env.storage().temporary().set(&WITHDRAWAL_APPROVALS, &approvals);
    
    Ok(())
}

/// Approve a pending withdrawal (admin only)
/// Second admin approves the withdrawal
pub fn approve_withdrawal(
    env: &Env,
    caller: &Address,
) -> Result<(), ParkingError> {
    if !is_initialized(env) {
        return Err(ParkingError::NotInitialized);
    }
    
    if !is_admin(env, caller) {
        return Err(ParkingError::NotAdmin);
    }
    
    // Get pending proposal
    let proposal: WithdrawalProposal = env.storage()
        .temporary()
        .get(&WITHDRAWAL_PROPOSAL)
        .ok_or(ParkingError::NotParked)?; // Reusing error for "no proposal"
    
    // Admin cannot approve their own proposal
    if proposal.proposer == *caller {
        return Err(ParkingError::NotAdmin);
    }
    
    // Get current approvals
    let mut approvals: Vec<Address> = env.storage()
        .temporary()
        .get(&WITHDRAWAL_APPROVALS)
        .unwrap_or(Vec::new(env));
    
    // Check if already approved by this admin
    for approval in approvals.iter() {
        if approval == *caller {
            return Err(ParkingError::AlreadyParked); // Reusing error for "already approved"
        }
    }
    
    // Add approval
    approvals.push_back(caller.clone());
    env.storage().temporary().set(&WITHDRAWAL_APPROVALS, &approvals);
    
    // Check if we have enough approvals (need 2 out of 3)
    if approvals.len() >= 1 {
        // Execute withdrawal
        withdraw_revenue(env, proposal.amount)?;
        
        // Clean up proposal and approvals
        env.storage().temporary().remove(&WITHDRAWAL_PROPOSAL);
        env.storage().temporary().remove(&WITHDRAWAL_APPROVALS);
        
        // In a real implementation, you would transfer the funds to the recipient
        // For this contract, we just reduce the revenue counter
    }
    
    Ok(())
}

/// Get pending withdrawal proposal (admin only)
/// Returns current proposal details if one exists
pub fn get_withdrawal_proposal(
    env: &Env,
    caller: &Address,
) -> Result<Option<WithdrawalProposal>, ParkingError> {
    if !is_admin(env, caller) {
        return Err(ParkingError::NotAdmin);
    }
    
    let proposal = env.storage().temporary().get(&WITHDRAWAL_PROPOSAL);
    Ok(proposal)
}

/// Cancel pending withdrawal proposal (admin only)
/// Only the proposer can cancel their own proposal
pub fn cancel_withdrawal(
    env: &Env,
    caller: &Address,
) -> Result<(), ParkingError> {
    if !is_admin(env, caller) {
        return Err(ParkingError::NotAdmin);
    }
    
    // Get pending proposal
    let proposal: WithdrawalProposal = env.storage()
        .temporary()
        .get(&WITHDRAWAL_PROPOSAL)
        .ok_or(ParkingError::NotParked)?; // Reusing error for "no proposal"
    
    // Only proposer can cancel
    if proposal.proposer != *caller {
        return Err(ParkingError::NotAdmin);
    }
    
    // Remove proposal and approvals
    env.storage().temporary().remove(&WITHDRAWAL_PROPOSAL);
    env.storage().temporary().remove(&WITHDRAWAL_APPROVALS);
    
    Ok(())
}

// ============================================================================
// INFORMATION FUNCTIONS
// ============================================================================

/// Get contract configuration (admin only)
/// Returns current pricing and revenue information
pub fn get_contract_config(
    env: &Env,
    caller: &Address,
) -> Result<ParkingConfig, ParkingError> {
    if !is_admin(env, caller) {
        return Err(ParkingError::NotAdmin);
    }
    
    let config = ParkingConfig {
        hourly_price: get_hourly_price(env)?,
        annual_price: get_annual_price(env)?,
        total_spots: env.storage()
            .instance()
            .get(&crate::storage::keys::TOTAL_SPOTS)
            .unwrap_or(0),
        total_revenue: get_total_revenue(env),
    };
    
    Ok(config)
}

/// Check if address is admin
/// Public function to verify admin status
pub fn check_admin_status(env: &Env, address: &Address) -> bool {
    is_admin(env, address)
}

// ============================================================================
// HELPER TYPES
// ============================================================================

/// Withdrawal proposal structure for multi-signature withdrawals
#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct WithdrawalProposal {
    pub proposer: Address,
    pub amount: i128,
    pub recipient: Address,
    pub timestamp: u64,
}