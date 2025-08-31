# Fuzzy Contract - Testes Fuzzy para Soroban

Este projeto implementa testes fuzzy (fuzz testing) para um contrato inteligente Soroban simples que armazena e recupera valores inteiros.

## Estrutura do Projeto

```
fuzzy-contract/
├── src/
│   ├── lib.rs          # Contrato principal
│   └── test.rs         # Testes unitários
├── fuzz/
│   ├── Cargo.toml      # Configuração do fuzzer
│   └── fuzz_targets/   # Targets de fuzzing
│       ├── fuzz_target_1.rs  # Teste básico de set/get
│       ├── fuzz_target_2.rs  # Múltiplas operações sequenciais
│       └── fuzz_target_3.rs  # Casos extremos e edge cases
└── Cargo.toml          # Configuração principal
```

## Contrato Fuzzy

O contrato implementa duas funções simples:
- `set(value: i32)`: Armazena um valor inteiro
- `get() -> i32`: Recupera o valor armazenado

## Testes Implementados

### 1. Testes Unitários (src/test.rs)
- `test_basic_functionality`: Testa operações básicas de set/get
- `test_edge_cases`: Testa valores extremos (i32::MIN, i32::MAX, 0)
- `test_multiple_operations`: Testa múltiplas operações com diferentes valores

### 2. Testes Fuzzy (fuzz/fuzz_targets/)

#### fuzz_target_1.rs - Teste Básico
- Testa operações básicas de set/get com valores aleatórios
- Verifica se o valor recuperado é igual ao valor definido

#### fuzz_target_2.rs - Múltiplas Operações
- Executa sequências de operações set com valores aleatórios
- Verifica consistência após cada operação
- Realiza verificação final de estado

#### fuzz_target_3.rs - Casos Extremos
- Testa valores extremos (i32::MIN, i32::MAX, 0, -1, 1)
- Inclui valores gerados pelo fuzzer
- Verifica consistência em múltiplas chamadas get

## Como Executar

### Pré-requisitos

1. **Instalar Rust Nightly**:
   ```bash
   rustup toolchain install nightly
   ```

2. **Instalar cargo-fuzz**:
   ```bash
   cargo install cargo-fuzz
   ```

### Executar Testes Unitários

```bash
cargo test
```

### Executar Testes Fuzzy

1. **Listar targets disponíveis**:
   ```bash
   cargo +nightly fuzz list
   ```

2. **Executar um target específico**:
   ```bash
   # Executar por 60 segundos
   cargo +nightly fuzz run fuzz_target_1 -- -max_total_time=60
   
   # Executar por número específico de iterações
   cargo +nightly fuzz run fuzz_target_1 -- -runs=10000
   ```

3. **Executar todos os targets**:
   ```bash
   cargo +nightly fuzz run fuzz_target_1 -- -max_total_time=30
   cargo +nightly fuzz run fuzz_target_2 -- -max_total_time=30
   cargo +nightly fuzz run fuzz_target_3 -- -max_total_time=30
   ```

## Problemas Conhecidos

### Erro de Linkagem com AddressSanitizer

Em alguns ambientes (especialmente macOS ARM64), pode ocorrer erro de linkagem:
```
ld: multiple errors: initializer pointer has no target
```

**Soluções alternativas**:

1. **Executar sem sanitizer**:
   ```bash
   RUSTFLAGS="" cargo +nightly fuzz run fuzz_target_1
   ```

2. **Usar proptest para testes baseados em propriedades**:
   ```bash
   # Adicionar ao Cargo.toml:
   [dev-dependencies]
   proptest = "1.0"
   ```

3. **Executar em ambiente Linux/Docker**:
   ```dockerfile
   FROM rust:nightly
   RUN cargo install cargo-fuzz
   # ... resto da configuração
   ```

## Benefícios do Fuzz Testing

1. **Descoberta de Edge Cases**: Encontra casos que testes manuais podem perder
2. **Teste de Robustez**: Verifica comportamento com inputs inesperados
3. **Cobertura Ampla**: Testa milhares de combinações automaticamente
4. **Detecção de Panics**: Identifica condições que causam falhas no contrato
5. **Validação de Invariantes**: Verifica se propriedades fundamentais são mantidas

## Exemplo de Saída do Fuzzer

```
INFO: Running with entropic power schedule (0xFF, 100).
INFO: Seed: 1234567890
INFO: Loaded 1 modules   (2048 inline 8-bit counters): 2048 [0x..., 0x...)
INFO: Loaded 1 PC tables (2048 PCs): 2048 [0x..., 0x...)
INFO: -max_total_time=60 seconds
#1      INITED cov: 123 ft: 456 corp: 1/1b exec/s: 0 rss: 45Mb
#2      NEW    cov: 124 ft: 457 corp: 2/2b lim: 4 exec/s: 0 rss: 45Mb
...
INFO: Done 50000 runs in 60 second(s)
```

## Referências

- [Soroban Examples - Fuzzing](https://github.com/stellar/soroban-examples/tree/v22.0.1/fuzzing)
- [Rust Fuzz Book](https://rust-fuzz.github.io/book/)
- [libFuzzer Documentation](https://llvm.org/docs/LibFuzzer.html)
- [Soroban SDK Documentation](https://docs.rs/soroban-sdk/)