# ❤️

```bash
NOTEPADV1_WASM="./target/wasm32v1-none/release/notepadv1.wasm"
NOTEPADV2_WASM="./target/wasm32v1-none/release/notepadv2.wasm"
STORE_WASM="./target/wasm32v1-none/release/store.wasm"
TOKEN_WASM="./target/wasm32v1-none/release/token.wasm"
```

# Upload Notepadv1

```bash
stellar contract upload --wasm $NOTEPADV1_WASM --source lucas
```

# Upload Notepadv2

```bash
stellar contract upload --wasm $NOTEPADV2_WASM --source lucas
```

# Deploy Token

```bash
stellar contract deploy --wasm $TOKEN_WASM --source lucas -- --owner $(stellar keys public-key lucas)
```

# Deploy Store

```bash
stellar contract deploy --wasm $STORE_WASM --source lucas \
    -- \
    --admin $(stellar keys public-key lucas) \
    --xlm TOKEN_ID \
    --notepad_wasm_hash NOTEPAD_WASM_HASH
```

# Invoke `store.buy_notepad`

```bash
stellar contract invoke \
  --id STORE_ID \
  --source lucas \
  -- buy_notepad \
  --caller $(stellar keys public-key lucas) \
  --name lucas
```

# Invoke `notepadv1.add_note`

```bash
contract invoke \
  --id NOTEPADV1_ID \
  --source lucas \
  -- add_note \
  --caller $(stellar keys public-key lucas) \
  --note "tive uma grande ideia"
```

# Invoke `notepadv1.get_note`

```bash
contract invoke \
  --id NOTEPADV1_ID \
  --source lucas \
  -- get_note \
  --counter 1
```

# Invoke `notepad.upgrade`

```bash
contract invoke \
  --id NOTEPADV1_ID \
  --source lucas \
  -- upgrade \
  --new_wasm_hash NOTEPADV2_WASM_HASH
```

# Invoke `store.buy_notepad`

```bash
contract invoke \
  --id STORE_ID \
  --source grazy \
  -- buy_notepad \
  --caller $(stellar keys public-key lucas) \
  --name bob
```

# Invoke `notepadv2.add_note`

```bash
contract invoke \
  --id NOTEPADV2_ID \
  --source lucas \
  -- add_note \
  --caller $(stellar keys public-key lucas) \
  --note "tive uma grande ideia denovo"
```

# Invoke `notepadv2.get_note`

```bash
contract invoke \
  --id NOTEPADV2_ID \
  --source lucas \
  -- get_note \
  --counter 1
```

# Invoke `notepadv1.add_note_contract(v2)`

```bash
contract invoke \
  --id NOTEPADV1_ID \
  --source grazy \
  -- add_note_contract \
  --contract NOTEPADV2_ID \
  --caller $(stellar keys public-key bob) \
  --note_content "todo dia uma nova ideia" \
```

# Invoke `notepadv1.get_note_contract(v2)`

```bash
contract invoke \
  --id NOTEPADV1_ID \
  --source lucas \
  -- get_note_contract \
  --contract NOTEPADV2_ID \
  --counter 1
```
