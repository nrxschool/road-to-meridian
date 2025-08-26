#![cfg(test)]

use crate::FuzzyContract;
use soroban_sdk::Env;

#[test]
fn test_set_and_get() {
    let env = Env::default();
    let contract_id = env.register(FuzzyContract, ());
    let client = crate::FuzzyContractClient::new(&env, &contract_id);

    // Test basic functionality
    client.set(&42);
    assert_eq!(client.get(), 42);
}

#[test]
fn test_get_default_value() {
    let env = Env::default();
    let contract_id = env.register(FuzzyContract, ());
    let client = crate::FuzzyContractClient::new(&env, &contract_id);

    // Should return 0 when no value is set
    assert_eq!(client.get(), 0);
}

#[test]
fn test_overwrite_value() {
    let env = Env::default();
    let contract_id = env.register(FuzzyContract, ());
    let client = crate::FuzzyContractClient::new(&env, &contract_id);

    // Set initial value
    client.set(&100);
    assert_eq!(client.get(), 100);

    // Overwrite with new value
    client.set(&200);
    assert_eq!(client.get(), 200);
}

// Manual fuzzy tests with various edge cases
#[test]
fn fuzz_test_extreme_values() {
    let env = Env::default();
    let contract_id = env.register(FuzzyContract, ());
    let client = crate::FuzzyContractClient::new(&env, &contract_id);

    let extreme_values = [
        i32::MIN,
        i32::MAX,
        0,
        -1,
        1,
        i32::MIN + 1,
        i32::MAX - 1,
        -42,
        42,
        1000000,
        -1000000,
    ];

    for &value in &extreme_values {
        client.set(&value);
        assert_eq!(client.get(), value);
    }
}

#[test]
fn fuzz_test_multiple_sets() {
    let env = Env::default();
    let contract_id = env.register(FuzzyContract, ());
    let client = crate::FuzzyContractClient::new(&env, &contract_id);

    let test_values = [100, -200, 0, 42, -42, 999, -999, i32::MAX, i32::MIN, 1, -1];

    // Test multiple sequential sets - only the last value should be stored
    for &value in &test_values {
        client.set(&value);
        assert_eq!(client.get(), value);
    }

    // The last value should still be stored
    assert_eq!(client.get(), -1);
}

#[test]
fn fuzz_test_idempotent_operations() {
    let env = Env::default();
    let contract_id = env.register(FuzzyContract, ());
    let client = crate::FuzzyContractClient::new(&env, &contract_id);

    let test_values = [42, -42, 0, i32::MAX, i32::MIN];

    for &value in &test_values {
        // Setting the same value multiple times should be idempotent
        client.set(&value);
        let first_get = client.get();

        client.set(&value);
        let second_get = client.get();

        client.set(&value);
        let third_get = client.get();

        assert_eq!(first_get, value);
        assert_eq!(second_get, value);
        assert_eq!(third_get, value);
        assert_eq!(first_get, second_get);
        assert_eq!(second_get, third_get);
    }
}

#[test]
fn fuzz_test_alternating_values() {
    let env = Env::default();
    let contract_id = env.register(FuzzyContract, ());
    let client = crate::FuzzyContractClient::new(&env, &contract_id);

    let pairs = [
        (100, -100),
        (i32::MAX, i32::MIN),
        (0, 1),
        (42, -42),
        (999999, -999999),
    ];

    for &(value1, value2) in &pairs {
        // Test alternating between two values
        client.set(&value1);
        assert_eq!(client.get(), value1);

        client.set(&value2);
        assert_eq!(client.get(), value2);

        client.set(&value1);
        assert_eq!(client.get(), value1);

        client.set(&value2);
        assert_eq!(client.get(), value2);
    }
}

#[test]
fn fuzz_test_storage_persistence() {
    let env = Env::default();
    let contract_id = env.register(FuzzyContract, ());
    let client = crate::FuzzyContractClient::new(&env, &contract_id);

    // Test that storage persists across multiple operations
    let test_values = [42, -100, 0, i32::MAX, i32::MIN];

    for &value in &test_values {
        client.set(&value);

        // Multiple gets should return the same value
        for _ in 0..10 {
            assert_eq!(client.get(), value);
        }
    }
}

#[test]
fn fuzz_test_negative_values() {
    let env = Env::default();
    let contract_id = env.register(FuzzyContract, ());
    let client = crate::FuzzyContractClient::new(&env, &contract_id);

    // Test negative values specifically
    let negative_values = [
        -1,
        -2,
        -10,
        -42,
        -100,
        -1000,
        -10000,
        -100000,
        -1000000,
        i32::MIN,
        i32::MIN + 1,
    ];

    for &value in &negative_values {
        client.set(&value);
        assert_eq!(client.get(), value);
    }
}

#[test]
fn fuzz_test_positive_values() {
    let env = Env::default();
    let contract_id = env.register(FuzzyContract, ());
    let client = crate::FuzzyContractClient::new(&env, &contract_id);

    // Test positive values specifically
    let positive_values = [
        1,
        2,
        10,
        42,
        100,
        1000,
        10000,
        100000,
        1000000,
        i32::MAX,
        i32::MAX - 1,
    ];

    for &value in &positive_values {
        client.set(&value);
        assert_eq!(client.get(), value);
    }
}

#[test]
fn fuzz_test_zero_and_boundaries() {
    let env = Env::default();
    let contract_id = env.register(FuzzyContract, ());
    let client = crate::FuzzyContractClient::new(&env, &contract_id);

    // Test zero and boundary values
    let boundary_values = [
        0,
        1,
        -1,
        2,
        -2,
        i32::MAX,
        i32::MIN,
        i32::MAX - 1,
        i32::MIN + 1,
        i32::MAX / 2,
        i32::MIN / 2,
    ];

    for &value in &boundary_values {
        client.set(&value);
        assert_eq!(client.get(), value);
    }
}

#[test]
fn fuzz_test_sequential_operations() {
    let env = Env::default();
    let contract_id = env.register(FuzzyContract, ());
    let client = crate::FuzzyContractClient::new(&env, &contract_id);

    // Test a sequence of operations
    let operations = [
        ("set", 100),
        ("get", 100),
        ("set", -50),
        ("get", -50),
        ("set", 0),
        ("get", 0),
        ("set", i32::MAX),
        ("get", i32::MAX),
        ("set", i32::MIN),
        ("get", i32::MIN),
    ];

    let mut expected_value = 0;

    for &(operation, value) in &operations {
        match operation {
            "set" => {
                client.set(&value);
                expected_value = value;
            }
            "get" => {
                assert_eq!(client.get(), expected_value);
            }
            _ => {}
        }
    }
}

#[test]
fn fuzz_test_stress_operations() {
    let env = Env::default();
    let contract_id = env.register(FuzzyContract, ());
    let client = crate::FuzzyContractClient::new(&env, &contract_id);

    // Stress test with many operations
    for i in 0..100 {
        let test_value = match i % 5 {
            0 => i,
            1 => -i,
            2 => i * 1000,
            3 => -i * 1000,
            _ => 0,
        };

        client.set(&test_value);
        
        // Verify the value is correctly stored
        assert_eq!(client.get(), test_value);

        // Do multiple gets to ensure consistency
        for _ in 0..3 {
            assert_eq!(client.get(), test_value);
        }
    }
}

#[test]
fn fuzz_test_random_sequence() {
    let env = Env::default();
    let contract_id = env.register(FuzzyContract, ());
    let client = crate::FuzzyContractClient::new(&env, &contract_id);

    // Test with a pseudo-random sequence of values
    let random_values = [
        42,
        -17,
        999,
        -999,
        0,
        1,
        -1,
        100,
        -100,
        50,
        -50,
        777,
        -777,
        123,
        -123,
        456,
        -456,
        789,
        -789,
        321,
        -321,
        i32::MAX,
        i32::MIN,
        2147483646,
        -2147483647,
    ];

    for &value in &random_values {
        client.set(&value);
        assert_eq!(client.get(), value);

        // Test multiple consecutive gets
        for _ in 0..5 {
            assert_eq!(client.get(), value);
        }
    }
}

#[test]
fn fuzz_test_edge_case_transitions() {
    let env = Env::default();
    let contract_id = env.register(FuzzyContract, ());
    let client = crate::FuzzyContractClient::new(&env, &contract_id);

    // Test transitions between edge cases
    let transitions = [
        (0, i32::MAX),
        (i32::MAX, i32::MIN),
        (i32::MIN, 0),
        (0, -1),
        (-1, 1),
        (1, i32::MAX - 1),
        (i32::MAX - 1, i32::MIN + 1),
        (i32::MIN + 1, 0),
    ];

    for &(from_value, to_value) in &transitions {
        // Set first value
        client.set(&from_value);
        assert_eq!(client.get(), from_value);

        // Transition to second value
        client.set(&to_value);
        assert_eq!(client.get(), to_value);

        // Verify the transition was complete
        assert_eq!(client.get(), to_value);
    }
}
