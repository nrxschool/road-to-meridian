### Introdução à PoC

Sim, você pode usar um backend local para ouvir eventos em vez do Mercury. O Mercury é um serviço de indexação terceirizado que facilita lookups (ex.: mapear passkeyId para contractId) e rastreamento de eventos via consultas eficientes. Para uma PoC simples, você pode substituir isso por:

- **Polling direto na RPC da Soroban**: Use o `soroban-client` ou `stellar-sdk` para consultar o estado do contrato periodicamente (ex.: via `getContractData` ou simular invocações read-only).
- **Ouvir eventos localmente**: Configure um listener no seu backend usando `soroban-client` para polling de ledgers recentes via `getEvents` na RPC. Isso é mais eficiente que polling constante, mas requer um loop assíncrono no seu servidor (ex.: com WebSockets ou setInterval). Evite depender de Mercury para manter tudo local/off-chain onde possível.

Para essa PoC, vamos manter simples: Usaremos polling no frontend para ler o estado do Flipper (sem eventos reais, já que o contrato não emite eventos no código dado). Para interações (flip), usaremos o passkey-kit com Launchtube para submissão gasless. Não usaremos Mercury — em vez disso, armazenaremos o `contractId` da smart wallet localmente no frontend (via localStorage) após criação, evitando lookups.

Assumimos:
- Ambiente: Testnet da Stellar.
- Ferramentas: Rust para contrato, Node.js/TypeScript para backend/frontend, React para UI.
- Sem servidor full-blown: Usaremos um backend mínimo com Express para lidar com submissões (mas você pode rodar tudo local).
- Pré-requisitos: Instale Rust (com `soroban-cli`), Node.js, pnpm, e obtenha um JWT do Launchtube para Testnet (como no guia anterior).

O foco é funcionalidade mínima: Deploy contrato → Criar passkey/smart wallet → Login → Ler estado → Flipar estado.

### Passo 1: Configurar o Ambiente de Desenvolvimento

1. **Instale Ferramentas Globais**:
   - Rust e Soroban CLI: `curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh` (se não tiver Rust), então `cargo install --locked soroban-cli`.
   - Node.js e pnpm: `sudo npm install -g pnpm`.
   - Crie um diretório para o projeto: `mkdir flipper-poc && cd flipper-poc`.

2. **Crie o Projeto do Contrato Soroban**:
   - `soroban contract init flipper-contract`.
   - Edite `src/lib.rs` para o código do Flipper (complete os stubs, adicionando storage):
     ```rust
     use soroban_sdk::{contract, contractimpl, Env, Bool};

     #[contract]
     pub struct Flipper;

     #[contractimpl]
     impl Flipper {
         pub fn state(env: Env) -> Bool {
             env.storage().instance().get::<(), Bool>(&()).unwrap_or(false)
         }

         pub fn flip(env: Env) {
             let current = Self::state(env.clone());
             env.storage().instance().set::<(), Bool>(&(), &!current);
         }
     }
     ```

3. **Crie o Projeto React (Frontend)**:
   - `pnpm create vite flipper-frontend --template react-ts`.
   - `cd flipper-frontend && pnpm install passkey-kit @stellar/stellar-sdk soroban-client`.
   - Crie um `.env` no root do frontend:
     ```
     VITE_RPC_URL=https://soroban-testnet.stellar.org
     VITE_NETWORK_PASSPHRASE="Test SDF Network ; October 2022"
     VITE_FACTORY_CONTRACT_ID=CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZGQRUQRSL4VQ4IMRTZWU  # Factory padrão para Testnet (verifique na doc Stellar se mudou)
     VITE_LAUNCHTUBE_URL=https://testnet.launchtube.xyz
     VITE_LAUNCHTUBE_JWT=<seu_jwt_do_launchtube>  # Obtenha em https://testnet.launchtube.xyz/gen
     ```

4. **Crie um Backend Simples (para Submissão de Transações)**:
   - No root do projeto: `mkdir backend && cd backend`.
   - `pnpm init && pnpm install express passkey-kit @stellar/stellar-sdk soroban-client body-parser`.
   - Crie `index.ts`:
     ```typescript
     import express from 'express';
     import { PasskeyServer } from 'passkey-kit';
     import bodyParser from 'body-parser';

     const app = express();
     app.use(bodyParser.json());

     const env = {
       rpcUrl: process.env.RPC_URL || 'https://soroban-testnet.stellar.org',
       networkPassphrase: process.env.NETWORK_PASSPHRASE || 'Test SDF Network ; October 2022',
       launchtubeUrl: process.env.LAUNCHTUBE_URL || 'https://testnet.launchtube.xyz',
       launchtubeJwt: process.env.LAUNCHTUBE_JWT,  // Do .env
     };

     const server = new PasskeyServer(env);

     // Endpoint para criar smart wallet
     app.post('/create-wallet', async (req, res) => {
       const { publicKey } = req.body;
       try {
         const tx = await server.prepareCreateAccount({ signerPublicKey: publicKey });
         const result = await server.submitTransaction(tx);
         res.json({ contractId: result.contractId });
       } catch (error) {
         res.status(500).json({ error: error.message });
       }
     });

     // Endpoint para invocar contrato (ex.: flip)
     app.post('/invoke', async (req, res) => {
       const { contractId, functionName, params, passkeySignature } = req.body;
       try {
         const tx = await server.prepareInvokeContract({
           contractId,
           functionName,
           params,
           auth: { type: 'passkey', signature: passkeySignature },
         });
         const result = await server.submitTransaction(tx);
         res.json({ hash: result.hash });
       } catch (error) {
         res.status(500).json({ error: error.message });
       }
     });

     app.listen(3001, () => console.log('Backend rodando na porta 3001'));
     ```
   - Crie `.env` no backend com as mesmas vars do frontend.
   - Rode: `ts-node index.ts` (instale ts-node se preciso: `pnpm add -D ts-node`).

   **Nota sobre Eventos Local**: No backend, adicione um listener simples para polling eventos (ex.: para flip). Adicione isso ao `index.ts`:
     ```typescript
     import { SorobanRpc } from '@stellar/stellar-sdk';

     const rpc = new SorobanRpc.Server(env.rpcUrl);

     async function pollEvents(contractId: string, lastLedger: number) {
       const events = await rpc.getEvents({ filters: [{ contractIds: [contractId] }] });
       // Procese events aqui (ex.: se flip emitiu evento, mas nosso Flipper não emite; adicione env.events() no Rust se quiser)
       return events.latestLedger;
     }

     // Exemplo: setInterval(() => pollEvents('seu_contract_id', lastLedger), 5000);
     ```
     Para simplicidade, usaremos polling no frontend para o state.

### Passo 2: Deploy do Contrato Flipper

1. No diretório `flipper-contract`:
   - Build: `soroban contract build`.
   - Deploy (use uma conta funded na Testnet; obtenha XLM em https://laboratory.stellar.org/#account):
     - Crie identidade: `soroban config identity generate deployer`.
     - Fund: `soroban config identity fund deployer --network testnet`.
     - Deploy: `soroban contract deploy --wasm target/wasm32-unknown-unknown/release/flipper_contract.wasm --source deployer --network testnet`.
     - Anote o `FLIPPER_CONTRACT_ID` retornado (ex.: C...).

2. Instale bindings para JS (opcional, mas útil para invocações):
   - `soroban contract bindings typescript --wasm target/wasm32-unknown-unknown/release/flipper_contract.wasm --id <FLIPPER_CONTRACT_ID> --network testnet --output-dir ../flipper-frontend/src/contracts/flipper`.
   - Isso gera um client TS para chamar `state()` e `flip()`.

### Passo 3: Implementar o Frontend React

Edite `flipper-frontend/src/App.tsx` para uma UI simples:

```typescript
import { useState } from 'react';
import { PasskeyKit, type PasskeySignature } from 'passkey-kit';
import { SorobanRpc, TransactionBuilder, Operation, Networks, Contract } from '@stellar/stellar-sdk';
import { FlipperClient } from './contracts/flipper/client';  // Dos bindings, se gerou

const env = {
  rpcUrl: import.meta.env.VITE_RPC_URL,
  networkPassphrase: import.meta.env.VITE_NETWORK_PASSPHRASE,
  factoryContractId: import.meta.env.VITE_FACTORY_CONTRACT_ID,
};

const kit = new PasskeyKit(env);
const rpc = new SorobanRpc.Server(env.rpcUrl);
const FLIPPER_ID = '<seu_FLIPPER_CONTRACT_ID>';  // Coloque aqui após deploy

function App() {
  const [passkeyId, setPasskeyId] = useState<string | null>(localStorage.getItem('passkeyId'));
  const [contractId, setContractId] = useState<string | null>(localStorage.getItem('contractId'));
  const [state, setState] = useState<boolean>(false);

  async function createPasskey() {
    const { passkeyId, publicKey } = await kit.createPasskey({ userName: 'test@user.com', challenge: new Uint8Array(32) });
    setPasskeyId(passkeyId);
    localStorage.setItem('passkeyId', passkeyId);

    const response = await fetch('http://localhost:3001/create-wallet', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ publicKey }),
    });
    const { contractId } = await response.json();
    setContractId(contractId);
    localStorage.setItem('contractId', contractId);
  }

  async function login() {
    if (!passkeyId) return;
    await kit.authenticatePasskey({ passkeyId, challenge: new Uint8Array(32) });
    alert('Logado!');  // Aqui você pode setar um state de auth
    await fetchState();  // Carrega estado inicial
  }

  async function fetchState() {
    const client = new FlipperClient({ contractId: FLIPPER_ID, networkPassphrase: env.networkPassphrase, rpcUrl: env.rpcUrl });
    const result = await client.state();
    setState(result);
  }

  async function flip() {
    if (!passkeyId || !contractId) return;

    // Assine localmente
    const source = { contractId };  // Smart wallet como source
    const txBuilder = new TransactionBuilder(source, { fee: '100', networkPassphrase: env.networkPassphrase });
    const op = Operation.invokeContractFunction({
      contract: FLIPPER_ID,
      function: 'flip',
      args: [],
    });
    txBuilder.addOperation(op);
    const tx = txBuilder.build();

    const signature: PasskeySignature = await kit.signTransaction({ passkeyId, transaction: tx });

    const response = await fetch('http://localhost:3001/invoke', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contractId: FLIPPER_ID,
        functionName: 'flip',
        params: [],
        passkeySignature: signature,
      }),
    });
    await response.json();
    await fetchState();  // Poll para atualizar
  }

  return (
    <div>
      {!passkeyId && <button onClick={createPasskey}>Criar Passkey e Wallet</button>}
      {passkeyId && !contractId && <p>Wallet sendo criada...</p>}
      {contractId && (
        <>
          <button onClick={login}>Login com Passkey</button>
          <p>Estado atual: {state ? 'True' : 'False'}</p>
          <button onClick={flip}>Flip</button>
          <button onClick={fetchState}>Atualizar Estado</button>
        </>
      )}
    </div>
  );
}

export default App;
```

- Rode o frontend: `pnpm run dev` (abre em http://localhost:5173).
- Rode o backend: No diretório backend, `ts-node index.ts`.

### Passo 4: Testar a PoC

1. Rode backend e frontend.
2. No browser: Clique "Criar Passkey e Wallet" → Autentique com biometria/PIN.
3. Clique "Login com Passkey".
4. Veja o estado (inicialmente false).
5. Clique "Flip" → O backend submete via Launchtube, flipa o estado.
6. Clique "Atualizar Estado" para poll e ver a mudança.

**Notas**:
- Isso é mínimo; adicione error handling e auth real.
- Para eventos: No contrato Rust, adicione `env.events().publish(("Flipper", "flipped"), !current);` no flip. No frontend/backend, poll `rpc.getEvents()` filtrando por contractId.
- Se precisar de mais, expanda com WebSockets para push de eventos do backend ao frontend.

Essa PoC é funcional em Testnet sem Mercury! Se der erro, verifique JWTs e IDs.