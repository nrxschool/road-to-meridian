pub fn add(a: u32, b: u32) -> u32 {
    a + b
}

pub fn sub(a: u32, b: u32) -> u32 {
    if a < b {
        0 // Retorna 0 se o resultado for negativo para u32
    } else {
        a - b
    }
}