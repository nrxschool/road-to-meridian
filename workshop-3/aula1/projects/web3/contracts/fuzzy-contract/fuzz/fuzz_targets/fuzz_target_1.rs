#![no_main]

use libfuzzer_sys::fuzz_target;
use std::collections::HashMap;

// Simula o comportamento do contrato para teste fuzzy
struct MockStorage {
    data: HashMap<String, i32>,
}

impl MockStorage {
    fn new() -> Self {
        Self {
            data: HashMap::new(),
        }
    }
    
    fn set(&mut self, key: &str, value: i32) {
        self.data.insert(key.to_string(), value);
    }
    
    fn get(&self, key: &str) -> i32 {
        self.data.get(key).copied().unwrap_or(0)
    }
}

fuzz_target!(|data: &[u8]| {
    // Converte os bytes de entrada em um i32
    if data.len() < 4 {
        return;
    }
    
    let value = i32::from_le_bytes([
        data[0],
        data[1], 
        data[2],
        data[3]
    ]);
    
    // Testa a lógica de armazenamento simulada
    let mut storage = MockStorage::new();
    
    // Simula a função set do contrato
    storage.set("instance", value);
    
    // Simula a função get do contrato
    let retrieved_value = storage.get("instance");
    
    // Verifica se o valor recuperado é igual ao valor armazenado
    assert_eq!(value, retrieved_value);
    
    // Testa casos extremos com proteção contra overflow
    if value != 0 && value < i32::MAX {
        // Verifica que valores diferentes são armazenados corretamente
        storage.set("instance", value + 1);
        let new_value = storage.get("instance");
        assert_eq!(value + 1, new_value);
    }
    
    // Testa valores extremos
    storage.set("test_min", i32::MIN);
    assert_eq!(storage.get("test_min"), i32::MIN);
    
    storage.set("test_max", i32::MAX);
    assert_eq!(storage.get("test_max"), i32::MAX);
    
    // Testa valor zero
    storage.set("test_zero", 0);
    assert_eq!(storage.get("test_zero"), 0);
});
