# Parking Smart Contract

A comprehensive parking management system built on Soroban (Stellar blockchain). This contract provides a complete solution for managing parking operations including ticket purchases, annual passes, fine management, and administrative controls.

## 🚀 Features

### Core Parking Operations
- **Hourly Parking Tickets**: Purchase parking for 1-24 hours with flexible pricing
- **Annual Passes**: Unlimited parking access for 365 days
- **Automatic Fine System**: Smart fine generation for expired tickets
- **Exit Management**: Secure vehicle exit validation

### Administrative Features
- **Multi-signature Admin Controls**: Enhanced security for critical operations
- **Dynamic Pricing**: Configurable hourly and annual pass pricing
- **Revenue Tracking**: Complete financial oversight and reporting
- **Withdrawal Management**: Secure revenue withdrawal with multi-auth

### Security Features
- **Access Control**: Admin-only functions with address verification
- **Reentrancy Protection**: Guards against recursive call attacks
- **Input Validation**: Comprehensive parameter validation
- **Safe Arithmetic**: Overflow-protected financial calculations

## 📋 Prerequisites

- Rust 1.70+
- Soroban CLI
- Stellar SDK
- Soroban SDK 22.0+

## 🛠️ Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd parking-contract
```

2. Install dependencies:
```bash
cargo build
```

3. Run tests:
```bash
cargo test
```

4. Build for deployment:
```bash
soroban contract build
```

## 🚀 Deployment

### Local Development (Futurenet)

1. Deploy the contract:
```bash
soroban contract deploy \
  --wasm target/wasm32-unknown-unknown/release/parking.wasm \
  --source alice \
  --network futurenet
```

2. Initialize the contract:
```bash
soroban contract invoke \
  --id <CONTRACT_ID> \
  --source alice \
  --network futurenet \
  -- initialize \
  --admin <ADMIN_ADDRESS> \
  --hourly_price 500000 \
  --annual_price 50000000
```

## 📖 Usage Examples

### Purchase Hourly Parking Ticket

```bash
soroban contract invoke \
  --id <CONTRACT_ID> \
  --source user \
  --network futurenet \
  -- purchase_hourly_ticket \
  --plate "ABC123" \
  --hours 2 \
  --payment 1000000
```

### Buy Annual Pass

```bash
soroban contract invoke \
  --id <CONTRACT_ID> \
  --source user \
  --network futurenet \
  -- purchase_annual_pass \
  --plate "XYZ789" \
  --payment 50000000
```

### Pay Fine

```bash
soroban contract invoke \
  --id <CONTRACT_ID> \
  --source user \
  --network futurenet \
  -- pay_fine \
  --plate "ABC123" \
  --payment 5000000
```

### Exit Parking

```bash
soroban contract invoke \
  --id <CONTRACT_ID> \
  --source user \
  --network futurenet \
  -- exit_hourly_parking \
  --plate "ABC123"
```

## 🏗️ Architecture

### Module Structure

```
src/
├── lib.rs              # Main contract interface
├── types.rs            # Core data structures
├── errors.rs           # Error definitions
├── storage/
│   ├── mod.rs          # Storage module exports
│   ├── keys.rs         # Storage key definitions
│   └── operations.rs   # Storage operations
├── parking/
│   ├── mod.rs          # Parking module exports
│   ├── hourly.rs       # Hourly parking logic
│   ├── annual.rs       # Annual pass logic
│   └── fines.rs        # Fine management
└── admin/
    ├── mod.rs          # Admin module exports
    └── functions.rs    # Administrative functions
```

### Data Structures

#### ParkingTicket
```rust
pub struct ParkingTicket {
    pub plate: Symbol,        // License plate
    pub entry_time: u64,      // Entry timestamp
    pub hours_paid: u32,      // Paid duration
    pub amount_paid: i128,    // Payment amount
    pub has_exited: bool,     // Exit status
}
```

#### AnnualPass
```rust
pub struct AnnualPass {
    pub plate: Symbol,        // License plate
    pub purchase_time: u64,   // Purchase timestamp
    pub amount_paid: i128,    // Payment amount
    pub is_active: bool,      // Activation status
}
```

#### FineRecord
```rust
pub struct FineRecord {
    pub plate: Symbol,        // License plate
    pub issue_time: u64,      // Fine issue time
    pub fine_amount: i128,    // Fine amount
    pub is_paid: bool,        // Payment status
    pub reason: Symbol,       // Violation reason
}
```

## 💰 Pricing Structure

### Default Pricing (Configurable)
- **Hourly Rate**: 0.05 XLM per hour (500,000 stroops)
- **Annual Pass**: 5 XLM (50,000,000 stroops)
- **Base Fine**: 0.5 XLM (5,000,000 stroops)
- **Overdue Penalty**: Additional 0.1 XLM per day after 30 days

### Fine Calculation
```
Base Fine = 0.5 XLM
Overdue Hours Fine = Hours × Hourly Rate
Overdue Penalty = Days > 30 × 0.1 XLM
Total Fine = Base Fine + Overdue Hours Fine + Overdue Penalty
```

## 🔒 Security Considerations

### Access Control
- Admin functions require authorized addresses
- Multi-signature requirements for critical operations
- Reentrancy protection on all state-changing functions

### Input Validation
- License plate length limits (max 32 characters)
- Parking duration limits (1-24 hours)
- Payment amount validation
- Address format verification

### Financial Security
- Overflow-safe arithmetic operations
- Payment verification before state changes
- Revenue tracking with audit trails
- Secure withdrawal mechanisms

## 🧪 Testing

The contract includes comprehensive tests covering:
- All parking operations (hourly, annual, fines)
- Administrative functions
- Error conditions and edge cases
- Security scenarios (reentrancy, unauthorized access)
- Financial calculations and overflow protection

Run tests with:
```bash
cargo test
```

## 📊 Monitoring and Analytics

### Available Metrics
- Total revenue collected
- Active parking sessions
- Fine collection rates
- Parking utilization statistics
- Admin operation logs

### Query Functions
```bash
# Get parking configuration
soroban contract invoke --id <CONTRACT_ID> -- get_config

# Check if vehicle is parked
soroban contract invoke --id <CONTRACT_ID> -- is_parked --plate "ABC123"

# Get fine information
soroban contract invoke --id <CONTRACT_ID> -- get_fine --plate "ABC123"
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation in the `docs/` directory
- Review the inline code documentation

## 🔄 Version History

### v0.1.0 (Current)
- Initial release
- Core parking functionality
- Admin controls
- Fine management system
- Comprehensive error handling
- Security features

---

**Built with ❤️ on Stellar Soroban**