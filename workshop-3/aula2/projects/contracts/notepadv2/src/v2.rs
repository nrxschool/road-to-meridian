use soroban_sdk::{Address, Env, String};

// Define the interface of the external notepad contract
#[soroban_sdk::contractclient(name = "NotepadClient")]
pub trait NotepadContract {
    fn add_note(env: Env, caller: Address, note: String) -> u32;
    fn get_note(env: Env, counter: u32) -> String;
}

pub fn add_note_contract(
    env: &Env,
    contract: Address,
    caller: Address,
    note_content: String,
) -> u32 {
    // Create a client for the external contract
    let client = NotepadClient::new(env, &contract);
    
    // Call the add_note function on the external contract
    client.add_note(&caller, &note_content)
}

pub fn get_note_contract(env: &Env, contract: Address, id: u32) -> String {
    // Create a client for the external contract
    let client = NotepadClient::new(env, &contract);
    
    // Call the get_note function on the external contract
    client.get_note(&id)
}
