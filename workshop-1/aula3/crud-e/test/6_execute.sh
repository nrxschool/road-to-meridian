#!/bin/bash

# Testa a execução de função wasm via API
# Certifique-se de que o servidor está rodando e o registro 1 existe

curl -s -X POST \
  -H "Content-Type: application/json" \
  -d '{"fn": "mul", "arg": [23, 2]}' \
  http://localhost:8080/execute/1 | jq