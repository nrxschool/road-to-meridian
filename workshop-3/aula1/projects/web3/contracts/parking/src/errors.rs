//! # Error Definitions
//!
//! This module defines all possible errors that can occur during parking contract operations.
//! The error system is designed to provide clear, actionable feedback to users and developers
//! while maintaining security by not exposing sensitive internal state.
//!
//! ## Error Categories
//!
//! - **Access Control**: Unauthorized operations and permission violations
//! - **Validation**: Invalid input parameters and data validation failures
//! - **State**: Contract state inconsistencies and operational conflicts
//! - **Payment**: Financial transaction and payment processing errors
//! - **Storage**: Data persistence and retrieval failures
//!
//! ## Error Handling Strategy
//!
//! All contract functions return `Result<T, ParkingError>` to ensure proper error handling.
//! Errors are designed to be:
//! - **Descriptive**: Clear indication of what went wrong
//! - **Actionable**: Users can understand how to fix the issue
//! - **Secure**: No sensitive information leaked in error messages
//!
//! ## Usage
//!
//! ```rust
//! match parking_operation() {
//!     Ok(result) => handle_success(result),
//!     Err(ParkingError::InsufficientPayment) => handle_payment_error(),
//!     Err(ParkingError::Unauthorized) => handle_access_error(),
//!     Err(error) => handle_generic_error(error),
//! }
//! ```

#![allow(unused)]
use soroban_sdk::{contracttype, contracterror};

/// Custom error types for parking operations
/// 
/// This enum defines all possible error conditions that can occur during parking
/// contract operations. Each error is assigned a unique numeric code for efficient
/// storage and transmission in the Soroban environment.
/// 
/// # Error Categories
/// 
/// - **Access Control (1-3)**: Authorization and permission errors
/// - **State Management (4-8)**: Parking state and validation errors  
/// - **Security (9-11)**: Security and initialization errors
/// - **Financial (12-14)**: Payment and revenue errors
#[contracterror]
#[derive(Copy, Clone, Debug, Eq, PartialEq, PartialOrd, Ord)]
#[repr(u32)]
pub enum ParkingError {
    /// Caller is not an authorized administrator
    /// 
    /// This error occurs when a non-admin address attempts to call admin-only
    /// functions such as price updates, revenue withdrawals, or system configuration.
    /// Only addresses with admin privileges can perform these operations.
    NotAdmin = 1,
    
    /// Vehicle is already parked (has active ticket or annual pass)
    /// 
    /// Returned when attempting to purchase a parking ticket or pass for a vehicle
    /// that already has an active parking session. Each license plate can only
    /// have one active parking record at a time.
    AlreadyParked = 2,
    
    /// Vehicle is not currently parked
    /// 
    /// Occurs when trying to exit parking or perform operations on a vehicle
    /// that doesn't have an active parking ticket or annual pass in the system.
    NotParked = 3,
    
    /// Parking ticket has expired and fine is due
    /// 
    /// The vehicle's paid parking time has exceeded the purchased duration.
    /// A fine has been automatically generated and must be paid before the
    /// vehicle can exit or purchase new parking.
    TicketExpired = 4,
    
    /// Payment amount is insufficient for the requested service
    /// 
    /// The provided payment is less than the required amount for parking tickets,
    /// annual passes, or fine payments. Check current pricing and ensure adequate
    /// payment is provided.
    InsufficientPayment = 5,
    
    /// Invalid number of hours (must be 1-24)
    /// 
    /// Parking tickets can only be purchased for 1 to 24 hours. Values outside
    /// this range are not accepted to prevent system abuse and ensure reasonable
    /// parking durations.
    InvalidHours = 6,
    
    /// License plate identifier is too long
    /// 
    /// The provided license plate string exceeds the maximum allowed length.
    /// License plates must be within reasonable character limits for efficient
    /// storage and processing.
    PlateTooLong = 7,
    
    /// Reentrancy attack detected
    /// 
    /// The contract has detected a potential reentrancy attack where a function
    /// is called recursively before the previous execution completes. This is
    /// blocked for security reasons.
    ReentrancyDetected = 8,
    
    /// Multiple administrator authorization required
    /// 
    /// Certain critical operations require authorization from multiple admin
    /// addresses for enhanced security. This error indicates that additional
    /// admin approvals are needed.
    MultiAuthRequired = 9,
    
    /// Contract has not been initialized
    /// 
    /// The contract must be initialized with admin addresses and pricing
    /// configuration before any parking operations can be performed.
    /// Call the initialize function first.
    NotInitialized = 10,
    
    /// Contract has already been initialized
    /// 
    /// Attempting to initialize a contract that has already been set up.
    /// Initialization can only be performed once for security reasons.
    AlreadyInitialized = 11,
    
    /// Invalid administrator address provided
    /// 
    /// The provided admin address is invalid or improperly formatted.
    /// Ensure the address follows the correct Stellar address format.
    InvalidAdmin = 12,
    
    /// Withdrawal amount exceeds available revenue
    /// 
    /// The requested withdrawal amount is greater than the total revenue
    /// collected by the parking system. Only available funds can be withdrawn.
    InsufficientRevenue = 13,
    
    /// Fine payment is required before exit
    /// 
    /// The vehicle has an outstanding fine that must be paid before it can
    /// exit the parking facility or purchase new parking services.
    FinePaymentRequired = 14,
}