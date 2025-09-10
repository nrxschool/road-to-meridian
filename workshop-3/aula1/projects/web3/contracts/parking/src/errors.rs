#![allow(unused)]
use soroban_sdk::{contracttype, contracterror};

#[contracterror]
#[derive(Copy, Clone, Debug, Eq, PartialEq, PartialOrd, Ord)]
#[repr(u32)]
pub enum ParkingError {
    NotAdmin = 1,
    AlreadyParked = 2,
    NotParked = 3,
    TicketExpired = 4,
    InsufficientPayment = 5,
    InvalidHours = 6,
    PlateTooLong = 7,
    ReentrancyDetected = 8,
    MultiAuthRequired = 9,
    NotInitialized = 10,
    AlreadyInitialized = 11,
    InvalidAdmin = 12,
    InsufficientRevenue = 13,
    FinePaymentRequired = 14,
}