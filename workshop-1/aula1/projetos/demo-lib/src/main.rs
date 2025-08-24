use std::io;
use calculator_olivmath::calc1::{add, sub};
use calculator_olivmath::calc2::{multiply, rate};


fn main() {
    println!("Escolha a operação (+, -, *, /):");
    let mut operation = String::new();
    io::stdin().read_line(&mut operation).expect("Erro");
    let operation = operation.trim();


    println!("Digite o primeiro número:");
    let mut num_a_str = String::new();
    io::stdin().read_line(&mut num_a_str).expect("Erro");
    let num_a: u32 = num_a_str.trim().parse().expect("Número inválido");
    
    println!("Digite o segundo número:");
    let mut num_b_str = String::new();
    io::stdin().read_line(&mut num_b_str).expect("Erro");
    let num_b: u32 = num_b_str.trim().parse().expect("Número inválido");

    let result = match operation {
        "+" => add(num_a, num_b),
        "-" => sub(num_a, num_b),
        "*" => multiply(num_a, num_b),
        "/" => rate(num_a, num_b),
        _ => {
            println!("Operação inválida!");
            return;
        }
    };
    println!("Resultado: {}", result);
}
