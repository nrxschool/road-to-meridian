#[unsafe(no_mangle)]
pub extern "C" fn add(x: i32, y: i32) -> i32 {
    x + y
}

#[unsafe(no_mangle)]
pub extern "C" fn mul(x: i32, y: i32) -> i32 {
    x * y
}

#[unsafe(no_mangle)]
pub extern "C" fn sub(x: i32, y: i32) -> i32 {
    if x < y {
        return 0;
    }
    x - y
}

#[unsafe(no_mangle)]
pub extern "C" fn div(x: i32, y: i32) -> i32 {
    if y == 0 {
        return 0;
    }
    x / y
}
