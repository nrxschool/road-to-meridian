//! # Core Data Types
//!
//! This module defines all the core data structures used throughout the parking smart contract.
//! All types are designed to be serializable with Soroban's storage system and include
//! comprehensive validation and safety features.
//!
//! ## Type Categories
//!
//! - **Parking Records**: `ParkingTicket`, `AnnualPass` - User parking data
//! - **Financial Records**: `FineRecord` - Fine and penalty tracking
//! - **Configuration**: `ParkingConfig` - System-wide settings
//!
//! ## Design Principles
//!
//! - All monetary values use `i128` for precision and Soroban compatibility
//! - Timestamps use `u64` for Unix epoch time representation
//! - All types implement `Clone`, `Debug`, `Eq`, `PartialEq` for testing and debugging
//! - Soroban's `#[contracttype]` attribute enables automatic serialization

#![allow(unused)]
use soroban_sdk::{contracttype, Symbol};

/// Represents a parking ticket for hourly parking
/// 
/// This structure tracks all information related to a single parking session,
/// including timing, payment, and exit status. Each ticket is uniquely identified
/// by the vehicle's license plate.
/// 
/// # Fields
/// 
/// * `plate` - Unique vehicle identifier (license plate)
/// * `entry_time` - Unix timestamp when parking session began
/// * `hours_paid` - Duration of parking purchased (in hours)
/// * `amount_paid` - Total payment made for this ticket (in stroops)
/// * `has_exited` - Flag indicating if vehicle has left the parking area
/// 
/// # Usage
/// 
/// ```rust
/// let ticket = ParkingTicket {
///     plate: symbol_short!("ABC123"),
///     entry_time: 1640995200, // Unix timestamp
///     hours_paid: 2,
///     amount_paid: 1000000, // 0.1 XLM in stroops
///     has_exited: false,
/// };
/// ```
#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct ParkingTicket {
    /// Vehicle license plate identifier
    pub plate: Symbol,
    /// Timestamp when parking started
    pub entry_time: u64,
    /// Number of hours paid for
    pub hours_paid: u32,
    /// Amount paid for the ticket
    pub amount_paid: i128,
    /// Whether the vehicle has exited
    pub has_exited: bool,
}

/// Represents an annual parking pass
/// 
/// Annual passes provide unlimited parking access for a full year from the purchase date.
/// This structure tracks the pass ownership, payment details, and activation status.
/// 
/// # Fields
/// 
/// * `plate` - Vehicle license plate associated with this pass
/// * `purchase_time` - Unix timestamp when the pass was purchased
/// * `amount_paid` - Total payment made for the annual pass (in stroops)
/// * `is_active` - Current activation status of the pass
/// 
/// # Pass Validity
/// 
/// An annual pass is valid for exactly 365 days (31,536,000 seconds) from the purchase time.
/// The contract automatically checks expiration when validating parking sessions.
/// 
/// # Usage
/// 
/// ```rust
/// let annual_pass = AnnualPass {
///     plate: symbol_short!("XYZ789"),
///     purchase_time: 1640995200,
///     amount_paid: 50000000, // 5 XLM in stroops
///     is_active: true,
/// };
/// ```
#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct AnnualPass {
    /// Vehicle license plate identifier
    pub plate: Symbol,
    /// Timestamp when the pass was purchased
    pub purchase_time: u64,
    /// Amount paid for the annual pass
    pub amount_paid: i128,
    /// Whether the pass is currently active
    pub is_active: bool,
}

/// Represents a parking fine record
/// 
/// Fine records track violations and penalties issued to vehicles that exceed
/// their paid parking time or violate parking regulations. Each fine includes
/// detailed information about the violation and payment status.
/// 
/// # Fields
/// 
/// * `plate` - Vehicle license plate that received the fine
/// * `issue_time` - Unix timestamp when the fine was issued
/// * `fine_amount` - Penalty amount in stroops (includes base fine + overdue penalties)
/// * `is_paid` - Payment status of the fine
/// * `reason` - Violation type (e.g., "expired", "no_ticket", "overdue")
/// 
/// # Fine Calculation
/// 
/// Fines are calculated based on:
/// - Base fine amount (configurable)
/// - Hours overdue (for expired tickets)
/// - Additional penalties for long-overdue fines (>30 days)
/// 
/// # Usage
/// 
/// ```rust
/// let fine = FineRecord {
///     plate: symbol_short!("ABC123"),
///     issue_time: 1640995200,
///     fine_amount: 5000000, // 0.5 XLM in stroops
///     is_paid: false,
///     reason: symbol_short!("expired"),
/// };
/// ```
#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct FineRecord {
    /// Vehicle license plate identifier
    pub plate: Symbol,
    /// Timestamp when the fine was issued
    pub issue_time: u64,
    /// Fine amount in stroops
    pub fine_amount: i128,
    /// Whether the fine has been paid
    pub is_paid: bool,
    /// Reason for the fine
    pub reason: Symbol,
}

/// Parking system configuration and statistics
/// 
/// This structure contains all global settings and operational parameters for the parking
/// system, including pricing, capacity limits, and revenue tracking. It serves as the
/// central configuration store for the entire parking contract.
/// 
/// # Fields
/// 
/// * `hourly_price` - Cost per hour of parking in stroops
/// * `annual_price` - Cost of an annual parking pass in stroops
/// * `total_spots` - Maximum number of concurrent parking spots available
/// * `total_revenue` - Cumulative revenue collected from all parking fees and fines
/// 
/// # Configuration Management
/// 
/// The configuration is typically set during contract initialization and can be
/// updated by authorized administrators. All pricing is denominated in stroops
/// (1 XLM = 10,000,000 stroops) for precision in Soroban calculations.
/// 
/// # Usage
/// 
/// ```rust
/// let config = ParkingConfig {
///     hourly_price: 500000,    // 0.05 XLM per hour
///     annual_price: 50000000,  // 5 XLM for annual pass
///     total_spots: 100,        // 100 parking spots
///     total_revenue: 0,        // Starting revenue
/// };
/// ```
#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct ParkingConfig {
    /// Price per hour in stroops
    pub hourly_price: i128,
    /// Annual pass price in stroops
    pub annual_price: i128,
    /// Total parking spots available
    pub total_spots: u32,
    /// Total revenue collected
    pub total_revenue: i128,
}