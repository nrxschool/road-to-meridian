use soroban_sdk::{contract, contractimpl, Address, BytesN, Env, Symbol, Val, Vec, String, token, symbol_short, contracttype};

// ##########################################################
// # Constants
// ##########################################################
const ADMIN: Symbol = symbol_short!("admin");
const NOTEPAD_WASM_HASH: Symbol = symbol_short!("wasm_hash");
const DEPLOYED_NOTEPADS: Symbol = symbol_short!("notepads");
const NOTEPAD_PRICE: Symbol = symbol_short!("price");
const BALANCE: Symbol = symbol_short!("balance");
const COUNTER: Symbol = symbol_short!("counter");

// ##########################################################
// # Main Contract Struct
// ##########################################################
#[contract]
pub struct Deployer;

#[contractimpl]
impl Deployer {
    // ##########################################################
    // # Constructor
    // ##########################################################
    pub fn __constructor(env: Env, admin: Address) {
        // Initialize admin
        env.storage().instance().set(&ADMIN, &admin);
        
        // Initialize storage counters and default values
        env.storage().instance().set(&COUNTER, &0i64);
        env.storage().instance().set(&NOTEPAD_PRICE, &10_000_000i128); // Default: 1 XLM
        env.storage().instance().set(&BALANCE, &0i128);
        
        // Initialize deployed notepads list
        let empty_notepads: Vec<Address> = Vec::new(&env);
        env.storage().instance().set(&DEPLOYED_NOTEPADS, &empty_notepads);
    }

    // ##########################################################
    // # Admin Management Functions
    // ##########################################################
    
    /// Updates the contract administrator
    pub fn set_admin(env: Env, admin: Address, new_admin: Address) {
        admin.require_auth();
        env.storage().instance().set(&ADMIN, &new_admin);
    }

    /// Retrieves the current contract administrator
    pub fn get_admin(env: Env) -> Address {
        env.storage().instance().get(&ADMIN).unwrap()
    }

    // ##########################################################
    // # Deployment Management Functions
    // ##########################################################

    /// Deploys a contract using an existing WASM hash on the testnet
    pub fn deploy(
        env: Env,
        wasm_hash: BytesN<32>,
        salt: BytesN<32>,
        constructor_args: Vec<Val>,
    ) -> Address {
        let admin: Address = env.storage().instance().get(&ADMIN).unwrap();
        admin.require_auth();

        // Deploy do contrato usando o WASM hash fornecido
        env.deployer()
            .with_current_contract(salt)
            .deploy_v2(wasm_hash, constructor_args)
    }

    /// Sets the WASM hash for notepad contracts
    pub fn set_notepad_wasm_hash(env: Env, admin: Address, wasm_hash: BytesN<32>) {
        admin.require_auth();
        env.storage().instance().set(&NOTEPAD_WASM_HASH, &wasm_hash);
    }

    /// Retrieves the current WASM hash for notepad contracts
    pub fn get_notepad_wasm_hash(env: Env) -> BytesN<32> {
        env.storage().instance().get(&NOTEPAD_WASM_HASH).unwrap()
    }

    /// Deploy a notepad for a specific caller
    pub fn deploy_notepad(env: Env, caller: Address) -> Address {
        let wasm_hash: BytesN<32> = env.storage().instance().get(&NOTEPAD_WASM_HASH).unwrap();
        
        // Generate deterministic salt using caller address
        let counter = Self::increment_counter(env.clone());
        let salt_bytes = BytesN::from_array(&env, &counter.to_be_bytes().repeat(4).try_into().unwrap_or([0u8; 32]));
        
        // Constructor args for notepad: admin = caller
        let mut constructor_args = Vec::new(&env);
        constructor_args.push_back(caller.to_val());
        
        // Deploy notepad
        let notepad_address = env.deployer()
            .with_current_contract(salt_bytes)
            .deploy_v2(wasm_hash, constructor_args);
        
        // Store deployed notepad address
        let mut deployed_notepads: Vec<Address> = env.storage()
            .instance()
            .get(&DEPLOYED_NOTEPADS)
            .unwrap_or(Vec::new(&env));
        deployed_notepads.push_back(notepad_address.clone());
        env.storage().instance().set(&DEPLOYED_NOTEPADS, &deployed_notepads);
        
        notepad_address
    }

    /// Get list of all deployed notepad addresses
    pub fn get_deployed_notepads(env: Env) -> Vec<Address> {
        env.storage()
            .instance()
            .get(&DEPLOYED_NOTEPADS)
            .unwrap_or(Vec::new(&env))
    }

    // ##########################################################
    // # Pricing and Payment Functions
    // ##########################################################
    
    /// Set the price for buying a notepad in stroops (1 XLM = 10,000,000 stroops)
    pub fn set_notepad_price(env: Env, admin: Address, price: i128) {
        admin.require_auth();
        env.storage().instance().set(&NOTEPAD_PRICE, &price);
    }

    /// Get the current notepad price
    pub fn get_notepad_price(env: Env) -> i128 {
        env.storage()
            .instance()
            .get(&NOTEPAD_PRICE)
            .unwrap_or(10_000_000) // Default: 1 XLM
    }

    /// Process payment in XLM from caller to contract
    pub fn process_payment(env: Env, caller: Address, amount: i128) {
        caller.require_auth();

        // Create token client for native XLM
        let xlm_token = token::Client::new(&env, &Address::from_string(&String::from_str(&env, "native")));
        
        // Transfer XLM from caller to this contract
        xlm_token.transfer(&caller, &env.current_contract_address(), &amount);
        
        // Update internal balance
        let current_balance: i128 = env.storage().instance().get(&BALANCE).unwrap_or(0);
        env.storage().instance().set(&BALANCE, &(current_balance + amount));
    }

    /// Get contract's XLM balance
    pub fn get_balance(env: Env) -> i128 {
        env.storage().instance().get(&BALANCE).unwrap_or(0)
    }

    /// Withdraw XLM from contract (admin only)
    pub fn withdraw(env: Env, admin: Address, to: Address) {
        admin.require_auth();
        
        let balance: i128 = env.storage().instance().get(&BALANCE).unwrap_or(0);
        if balance > 0 {
            let xlm_token = token::Client::new(&env, &Address::from_string(&String::from_str(&env, "native")));
            xlm_token.transfer(&env.current_contract_address(), &to, &balance);
            
            // Reset balance
            env.storage().instance().set(&BALANCE, &0i128);
        }
    }

    // ##########################################################
    // # Purchase Functions
    // ##########################################################
    
    /// Buy a notepad by sending exact XLM amount
    pub fn buy_notepad(env: Env, caller: Address) -> Address {
        let price: i128 = env.storage()
            .instance()
            .get(&NOTEPAD_PRICE)
            .unwrap_or(10_000_000);

        // Process payment
        Self::process_payment(env.clone(), caller.clone(), price);

        // Deploy notepad
        Self::deploy_notepad(env, caller)
    }

    // ##########################################################
    // # Storage Management Functions
    // ##########################################################
    
    /// Initialize counter
    pub fn initialize_counter(env: Env) {
        env.storage().instance().set(&COUNTER, &0i64);
    }

    /// Increment and return new counter value
    pub fn increment_counter(env: Env) -> i64 {
        let current: i64 = env.storage().instance().get(&COUNTER).unwrap_or(0);
        let new_counter = current + 1;
        env.storage().instance().set(&COUNTER, &new_counter);
        new_counter
    }

    /// Get current counter value
    pub fn get_counter(env: Env) -> i64 {
        env.storage().instance().get(&COUNTER).unwrap_or(0)
    }

    /// Store a note
    pub fn store_note(env: Env, counter: i64, note: Note) {
        env.storage().persistent().set(&counter, &note);
    }

    /// Get a note by counter
    pub fn get_note(env: Env, counter: i64) -> Note {
        env.storage().persistent().get(&counter).unwrap_or_default()
    }

    /// Get all notes from a contract
    pub fn get_all_notes_from_contract(env: Env, contract_counter: i64) -> Vec<Note> {
        let mut notes = Vec::new(&env);
        
        for i in 1..=contract_counter {
            if let Some(note) = env.storage().persistent().get::<i64, Note>(&i) {
                notes.push_back(note);
            }
        }
        
        notes
    }
}

// ##########################################################
// # Data Models
// ##########################################################

#[contracttype]
#[derive(Clone)]
pub enum DataKey {
    Admin,
}

#[derive(Clone)]
#[contracttype]
pub struct Note {
    pub content: String,
}

impl Default for Note {
    fn default() -> Self {
        Self {
            content: String::from_str(&Env::default(), ""),
        }
    }
}

// ##########################################################
// # Model Implementations
// ##########################################################

impl Note {
    /// Create a new note with content
    pub fn new(_env: &Env, content: String) -> Self {
        Self { content }
    }

    /// Get note content
    pub fn get_content(&self) -> &String {
        &self.content
    }

    /// Check if note is empty
    pub fn is_empty(&self) -> bool {
        self.content.len() == 0
    }
}