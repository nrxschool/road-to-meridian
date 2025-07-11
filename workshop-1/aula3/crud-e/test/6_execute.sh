#!/bin/bash

# 1. Cria um novo registro
resp=$(curl -s -X POST http://127.0.0.1:8080/data \
  -H 'Content-Type: application/json' \
  -d '{"data1": ["sum", "add", "mul", "div"], "data2": [COLE O BYTE CODE AQUI]}' )
echo "Resposta da criação: $resp"
id=$(echo $resp | grep -oE '"id": *[0-9]+' | grep -oE '[0-9]+')
echo "ID criado: $id"

if [ -z "$id" ]; then
  echo "Erro: ID não encontrado. Abortando."
  exit 1
fi

# 2. Executa a função wasm usando o id retornado
exec_resp=$(curl -s -X POST \
  -H "Content-Type: application/json" \
  -d '{"fn": "mul", "arg": [23, 2]}' \
  http://localhost:8080/execute/$id)
echo "Resposta da execução: $exec_resp" 