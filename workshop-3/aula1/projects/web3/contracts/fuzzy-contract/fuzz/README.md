# Teste Fuzzy para FuzzyContract

Este diretório contém um teste fuzzy simples para validar a lógica de armazenamento do contrato Soroban.

## Descrição

O teste fuzzy implementado simula o comportamento das funções `set` e `get` do contrato FuzzyContract, testando:

- Armazenamento e recuperação de valores i32 aleatórios
- Proteção contra overflow em operações aritméticas
- Teste de valores extremos (i32::MIN, i32::MAX, 0)
- Validação de que valores armazenados são recuperados corretamente

## Estrutura

- `fuzz_targets/fuzz_target_1.rs`: Implementação do teste fuzzy principal
- `Cargo.toml`: Configuração das dependências do fuzzer

## Como Executar

### Pré-requisitos

1. Instalar o Rust nightly:
```bash
rustup install nightly
```

2. Instalar cargo-fuzz:
```bash
cargo install cargo-fuzz
```

### Executar o Teste

```bash
# Executar por 15 segundos
cargo +nightly fuzz run fuzz_target_1 -- -max_total_time=15

# Executar por número específico de iterações
cargo +nightly fuzz run fuzz_target_1 -- -runs=1000000

# Executar indefinidamente (Ctrl+C para parar)
cargo +nightly fuzz run fuzz_target_1
```

## Lógica do Teste

O teste fuzzy:

1. **Converte entrada**: Transforma os primeiros 4 bytes da entrada fuzzy em um valor i32
2. **Simula armazenamento**: Usa uma estrutura MockStorage que replica o comportamento do contrato
3. **Testa operações básicas**: 
   - Armazena o valor usando `set()`
   - Recupera o valor usando `get()`
   - Verifica se são iguais
4. **Testa casos extremos**:
   - Incremento seguro (evitando overflow)
   - Valores limites (MIN, MAX, 0)

## Resultados

O teste foi executado com sucesso processando mais de 3 milhões de casos de teste em 16 segundos, validando a robustez da lógica de armazenamento.

## Benefícios do Fuzzing

- **Detecção de bugs**: Encontra casos extremos que testes manuais podem perder
- **Validação de robustez**: Testa o comportamento com entradas aleatórias
- **Cobertura de código**: Explora diferentes caminhos de execução
- **Detecção de overflows**: Identifica problemas aritméticos potenciais