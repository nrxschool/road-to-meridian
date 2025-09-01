//! Storage keys for the parking contract
//! Defines all storage keys used throughout the system

use soroban_sdk::{symbol_short, Symbol};

// ============================================================================
// INSTANCE STORAGE KEYS (Contract configuration)
// ============================================================================

/// First administrator address
pub const ADMIN_1: Symbol = symbol_short!("admin1");

/// Second administrator address
pub const ADMIN_2: Symbol = symbol_short!("admin2");

/// Third administrator address
pub const ADMIN_3: Symbol = symbol_short!("admin3");

/// Price per hour in stroops
pub const HOURLY_PRICE: Symbol = symbol_short!("h_price");

/// Annual pass price in stroops
pub const ANNUAL_PRICE: Symbol = symbol_short!("a_price");

/// Total parking spots available
pub const TOTAL_SPOTS: Symbol = symbol_short!("spots");

/// Total revenue collected
pub const TOTAL_REVENUE: Symbol = symbol_short!("revenue");

/// Contract initialization flag
pub const INITIALIZED: Symbol = symbol_short!("init");

// ============================================================================
// TEMPORARY STORAGE KEYS (Short-term data)
// ============================================================================

/// Reentrancy guard to prevent attacks
pub const REENTRANCY_GUARD: Symbol = symbol_short!("guard");

// Note: Prefix constants removed as they're not currently used
// They can be added back when implementing composite key generation

// ============================================================================
// KEY GENERATION HELPERS
// ============================================================================

/// Generate a storage key for parking tickets
/// Combines prefix with plate identifier
pub fn get_ticket_key(_plate: &Symbol) -> Symbol {
    // In a real implementation, you would create a composite key
    // For simplicity, we'll use a shortened version
    symbol_short!("tkt")
}

/// Generate a storage key for annual passes
/// Combines prefix with plate identifier
pub fn get_annual_key(_plate: &Symbol) -> Symbol {
    // In a real implementation, you would create a composite key
    // For simplicity, we'll use a shortened version
    symbol_short!("ann")
}

/// Generate a storage key for fine records
/// Combines prefix with plate identifier
pub fn get_fine_key(_plate: &Symbol) -> Symbol {
    // In a real implementation, you would create a composite key
    // For simplicity, we'll use a shortened version
    symbol_short!("fine")
}