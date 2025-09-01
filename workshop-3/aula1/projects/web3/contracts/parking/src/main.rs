#![no_std]
use soroban_sdk::{
    contract, contractimpl, contracttype, symbol_short, Address, Env, Symbol, Vec, panic_with_error
};

// ============================================================================
// DATA TYPES
// ============================================================================

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct ParkingTicket {
    pub plate: Symbol,
    pub hours_paid: u32,
    pub amount_paid: u64,
    pub entry_time: u64,
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct AnnualPass {
    pub plate: Symbol,
    pub purchase_time: u64,
    pub amount_paid: u64,
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
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
}

// ============================================================================
// STORAGE KEYS
// ============================================================================

const ADMIN_1: Symbol = symbol_short!("admin1");
const ADMIN_2: Symbol = symbol_short!("admin2");
const ADMIN_3: Symbol = symbol_short!("admin3");
const HOURLY_PRICE: Symbol = symbol_short!("h_price");
const ANNUAL_PRICE: Symbol = symbol_short!("a_price");
const TOTAL_SPOTS: Symbol = symbol_short!("spots");
const TOTAL_REVENUE: Symbol = symbol_short!("revenue");
const REENTRANCY_GUARD: Symbol = symbol_short!("guard");

// Prefixes for user data
const TICKET_PREFIX: Symbol = symbol_short!("ticket");
const ANNUAL_PREFIX: Symbol = symbol_short!("annual");
const FINE_PREFIX: Symbol = symbol_short!("fine");

// ============================================================================
// CONTRACT
// ============================================================================

#[contract]
pub struct ParkingContract;

#[contractimpl]
impl ParkingContract {
    
    // ========================================================================
    // INITIALIZATION
    // ========================================================================
    
    pub fn initialize(
        env: Env,
        admin1: Address,
        admin2: Address,
        admin3: Address,
        hourly_price: u64,
        annual_price: u64,
        total_spots: u32,
    ) {
        // Set admins
        env.storage().instance().set(&ADMIN_1, &admin1);
        env.storage().instance().set(&ADMIN_2, &admin2);
        env.storage().instance().set(&ADMIN_3, &admin3);
        
        // Set initial prices
        env.storage().instance().set(&HOURLY_PRICE, &hourly_price);
        env.storage().instance().set(&ANNUAL_PRICE, &annual_price);
        env.storage().instance().set(&TOTAL_SPOTS, &total_spots);
        env.storage().instance().set(&TOTAL_REVENUE, &0u64);
    }
    
    // ========================================================================
    // USER FUNCTIONS
    // ========================================================================
    
    /// Park car by paying hourly
    pub fn park_car(env: Env, user: Address, plate: Symbol, hours: u32) {
        user.require_auth();
        
        // Validations
        if hours == 0 || hours > 24 {
            panic_with_error!(&env, ParkingError::InvalidHours);
        }
        
        // Check if already parked
        let ticket_key = Self::get_ticket_key(&plate);
        if env.storage().temporary().has(&ticket_key) {
            panic_with_error!(&env, ParkingError::AlreadyParked);
        }
        
        let annual_key = Self::get_annual_key(&plate);
        if env.storage().persistent().has(&annual_key) {
            panic_with_error!(&env, ParkingError::AlreadyParked);
        }
        
        // Calculate price
        let hourly_price: u64 = env.storage().instance().get(&HOURLY_PRICE).unwrap();
        let total_price = (hours as u64)
            .checked_mul(hourly_price)
            .unwrap_or_else(|| panic_with_error!(&env, ParkingError::InsufficientPayment));
        
        // Create ticket
        let ticket = ParkingTicket {
            plate: plate.clone(),
            hours_paid: hours,
            amount_paid: total_price,
            entry_time: env.ledger().timestamp(),
        };
        
        // Store ticket with TTL (hours * 3600 seconds)
        let ttl_seconds = (hours as u64) * 3600;
        env.storage().temporary().set(&ticket_key, &ticket);
        env.storage().temporary().extend_ttl(&ticket_key, 0, ttl_seconds as u32);
        
        // Update revenue
        let current_revenue: u64 = env.storage().instance().get(&TOTAL_REVENUE).unwrap_or(0);
        env.storage().instance().set(&TOTAL_REVENUE, &(current_revenue + total_price));
    }
    
    /// Buy annual pass
    pub fn buy_annual_pass(env: Env, user: Address, plate: Symbol) {
        user.require_auth();
        
        // Check if already has pass or ticket
        let annual_key = Self::get_annual_key(&plate);
        if env.storage().persistent().has(&annual_key) {
            panic_with_error!(&env, ParkingError::AlreadyParked);
        }
        
        let ticket_key = Self::get_ticket_key(&plate);
        if env.storage().temporary().has(&ticket_key) {
            panic_with_error!(&env, ParkingError::AlreadyParked);
        }
        
        let annual_price: u64 = env.storage().instance().get(&ANNUAL_PRICE).unwrap();
        
        // Create annual pass
        let pass = AnnualPass {
            plate: plate.clone(),
            purchase_time: env.ledger().timestamp(),
            amount_paid: annual_price,
        };
        
        // Store with 1 year TTL (365 * 24 * 3600 = 31,536,000 seconds)
        env.storage().persistent().set(&annual_key, &pass);
        env.storage().persistent().extend_ttl(&annual_key, 0, 31_536_000);
        
        // Update revenue
        let current_revenue: u64 = env.storage().instance().get(&TOTAL_REVENUE).unwrap_or(0);
        env.storage().instance().set(&TOTAL_REVENUE, &(current_revenue + annual_price));
    }
    
    /// Extend parking time
    pub fn extend_parking(env: Env, user: Address, plate: Symbol, extra_hours: u32) {
        user.require_auth();
        
        if extra_hours == 0 || extra_hours > 24 {
            panic_with_error!(&env, ParkingError::InvalidHours);
        }
        
        let ticket_key = Self::get_ticket_key(&plate);
        
        // Get existing ticket
        let mut ticket: ParkingTicket = env.storage().temporary()
            .get(&ticket_key)
            .unwrap_or_else(|| panic_with_error!(&env, ParkingError::NotParked));
        
        // Calculate additional price
        let hourly_price: u64 = env.storage().instance().get(&HOURLY_PRICE).unwrap();
        let additional_price = (extra_hours as u64)
            .checked_mul(hourly_price)
            .unwrap_or_else(|| panic_with_error!(&env, ParkingError::InsufficientPayment));
        
        // Update ticket
        ticket.hours_paid += extra_hours;
        ticket.amount_paid += additional_price;
        
        // Extend TTL
        let additional_seconds = (extra_hours as u64) * 3600;
        env.storage().temporary().set(&ticket_key, &ticket);
        env.storage().temporary().extend_ttl(&ticket_key, additional_seconds as u32, additional_seconds as u32);
        
        // Update revenue
        let current_revenue: u64 = env.storage().instance().get(&TOTAL_REVENUE).unwrap_or(0);
        env.storage().instance().set(&TOTAL_REVENUE, &(current_revenue + additional_price));
    }
    
    /// Exit parking - checks TTL and applies fine if expired
    pub fn exit_parking(env: Env, user: Address, plate: Symbol) -> u64 {
        user.require_auth();
        
        // Reentrancy guard
        if env.storage().temporary().has(&REENTRANCY_GUARD) {
            panic_with_error!(&env, ParkingError::ReentrancyDetected);
        }
        env.storage().temporary().set(&REENTRANCY_GUARD, &true);
        env.storage().temporary().extend_ttl(&REENTRANCY_GUARD, 0, 100);
        
        let ticket_key = Self::get_ticket_key(&plate);
        let annual_key = Self::get_annual_key(&plate);
        let fine_key = Self::get_fine_key(&plate);
        
        let mut fine_amount = 0u64;
        
        // Check if has active annual pass
        if env.storage().persistent().has(&annual_key) {
            // Annual pass holders can exit freely (if not expired)
            env.storage().persistent().remove(&annual_key);
        }
        // Check if has active ticket
        else if env.storage().temporary().has(&ticket_key) {
            // Ticket is still valid, can exit freely
            env.storage().temporary().remove(&ticket_key);
        }
        // Check if has pending fine
        else if env.storage().persistent().has(&fine_key) {
            // Must pay fine to exit
            fine_amount = env.storage().persistent().get(&fine_key).unwrap();
            panic_with_error!(&env, ParkingError::TicketExpired);
        }
        else {
            // Not parked
            panic_with_error!(&env, ParkingError::NotParked);
        }
        
        // Remove reentrancy guard
        env.storage().temporary().remove(&REENTRANCY_GUARD);
        fine_amount
    }
    
    /// Pay fine for expired ticket
    pub fn pay_fine(env: Env, user: Address, plate: Symbol) {
        user.require_auth();
        
        let fine_key = Self::get_fine_key(&plate);
        
        if !env.storage().persistent().has(&fine_key) {
            panic_with_error!(&env, ParkingError::NotParked);
        }
        
        // Remove fine record
        env.storage().persistent().remove(&fine_key);
        
        // Update revenue with fine amount
        let annual_price: u64 = env.storage().instance().get(&ANNUAL_PRICE).unwrap();
        let current_revenue: u64 = env.storage().instance().get(&TOTAL_REVENUE).unwrap_or(0);
        env.storage().instance().set(&TOTAL_REVENUE, &(current_revenue + annual_price));
    }
    
    /// Renew annual pass
    pub fn renew_annual_pass(env: Env, user: Address, plate: Symbol) {
        user.require_auth();
        
        let annual_key = Self::get_annual_key(&plate);
        
        // Check if has existing pass
        if !env.storage().persistent().has(&annual_key) {
            panic_with_error!(&env, ParkingError::NotParked);
        }
        
        let annual_price: u64 = env.storage().instance().get(&ANNUAL_PRICE).unwrap();
        
        // Create new pass
        let new_pass = AnnualPass {
            plate: plate.clone(),
            purchase_time: env.ledger().timestamp(),
            amount_paid: annual_price,
        };
        
        // Extend for another year
        env.storage().persistent().set(&annual_key, &new_pass);
        env.storage().persistent().extend_ttl(&annual_key, 31_536_000, 31_536_000);
        
        // Update revenue
        let current_revenue: u64 = env.storage().instance().get(&TOTAL_REVENUE).unwrap_or(0);
        env.storage().instance().set(&TOTAL_REVENUE, &(current_revenue + annual_price));
    }
    
    // ========================================================================
    // ADMIN FUNCTIONS
    // ========================================================================
    
    /// Only admin can change hourly price
    pub fn set_hourly_price(env: Env, admin: Address, new_price: u64) {
        Self::require_admin(&env, &admin);
        
        if new_price == 0 {
            panic_with_error!(&env, ParkingError::InsufficientPayment);
        }
        
        env.storage().instance().set(&HOURLY_PRICE, &new_price);
    }
    
    /// Only admin can change annual price
    pub fn set_annual_price(env: Env, admin: Address, new_price: u64) {
        Self::require_admin(&env, &admin);
        
        if new_price == 0 {
            panic_with_error!(&env, ParkingError::InsufficientPayment);
        }
        
        env.storage().instance().set(&ANNUAL_PRICE, &new_price);
    }
    
    /// Requires 2 out of 3 admins to withdraw revenue
    pub fn withdraw_revenue(
        env: Env, 
        admin1: Address, 
        admin2: Address, 
        amount: u64
    ) {
        // Both admins must sign
        admin1.require_auth();
        admin2.require_auth();
        
        // Verify both are actual admins
        Self::require_multi_admin(&env, &admin1, &admin2);
        
        let current_revenue: u64 = env.storage().instance().get(&TOTAL_REVENUE).unwrap_or(0);
        
        if amount > current_revenue {
            panic_with_error!(&env, ParkingError::InsufficientPayment);
        }
        
        // Update revenue
        env.storage().instance().set(&TOTAL_REVENUE, &(current_revenue - amount));
    }
    
    /// Admin function to mark expired tickets as fined
    pub fn process_expired_tickets(env: Env, admin: Address, plates: Vec<Symbol>) {
        Self::require_admin(&env, &admin);
        
        let annual_price: u64 = env.storage().instance().get(&ANNUAL_PRICE).unwrap();
        
        for plate in plates.iter() {
            let ticket_key = Self::get_ticket_key(&plate);
            let fine_key = Self::get_fine_key(&plate);
            
            // If ticket is expired (TTL ran out), create fine record
            if !env.storage().temporary().has(&ticket_key) {
                env.storage().persistent().set(&fine_key, &annual_price);
                env.storage().persistent().extend_ttl(&fine_key, 0, 31_536_000); // 1 year to pay fine
            }
        }
    }
    
    // ========================================================================
    // VIEW FUNCTIONS
    // ========================================================================
    
    pub fn check_parking_status(env: Env, plate: Symbol) -> Symbol {
        let ticket_key = Self::get_ticket_key(&plate);
        let annual_key = Self::get_annual_key(&plate);
        let fine_key = Self::get_fine_key(&plate);
        
        if env.storage().persistent().has(&fine_key) {
            symbol_short!("fined")
        } else if env.storage().temporary().has(&ticket_key) {
            symbol_short!("hourly")
        } else if env.storage().persistent().has(&annual_key) {
            symbol_short!("annual")
        } else {
            symbol_short!("free")
        }
    }
    
    pub fn get_parking_info(env: Env) -> (u64, u64, u32, u64) {
        let hourly_price: u64 = env.storage().instance().get(&HOURLY_PRICE).unwrap();
        let annual_price: u64 = env.storage().instance().get(&ANNUAL_PRICE).unwrap();
        let total_spots: u32 = env.storage().instance().get(&TOTAL_SPOTS).unwrap();
        let total_revenue: u64 = env.storage().instance().get(&TOTAL_REVENUE).unwrap_or(0);
        
        (hourly_price, annual_price, total_spots, total_revenue)
    }
    
    // ========================================================================
    // HELPER FUNCTIONS
    // ========================================================================
    
    fn require_admin(env: &Env, admin: &Address) {
        let admin1: Address = env.storage().instance().get(&ADMIN_1).unwrap();
        let admin2: Address = env.storage().instance().get(&ADMIN_2).unwrap();
        let admin3: Address = env.storage().instance().get(&ADMIN_3).unwrap();
        
        if admin != &admin1 && admin != &admin2 && admin != &admin3 {
            panic_with_error!(env, ParkingError::NotAdmin);
        }
        
        admin.require_auth();
    }
    
    fn require_multi_admin(env: &Env, admin1: &Address, admin2: &Address) {
        let valid_admin1: Address = env.storage().instance().get(&ADMIN_1).unwrap();
        let valid_admin2: Address = env.storage().instance().get(&ADMIN_2).unwrap();
        let valid_admin3: Address = env.storage().instance().get(&ADMIN_3).unwrap();
        
        let is_admin1_valid = admin1 == &valid_admin1 || admin1 == &valid_admin2 || admin1 == &valid_admin3;
        let is_admin2_valid = admin2 == &valid_admin1 || admin2 == &valid_admin2 || admin2 == &valid_admin3;
        
        if !is_admin1_valid || !is_admin2_valid || admin1 == admin2 {
            panic_with_error!(env, ParkingError::MultiAuthRequired);
        }
    }
    
    fn get_ticket_key(plate: &Symbol) -> Symbol {
        // In real implementation, you'd use proper key generation
        // This is simplified for demonstration
        symbol_short!("tkt")
    }
    
    fn get_annual_key(plate: &Symbol) -> Symbol {
        symbol_short!("ann")
    }
    
    fn get_fine_key(plate: &Symbol) -> Symbol {
        symbol_short!("fine")
    }
}