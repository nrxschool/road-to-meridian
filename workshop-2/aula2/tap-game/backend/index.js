const express = require('express');
const cors = require('cors');
const StellarSdk = require('@stellar/stellar-sdk');
const { StrKey } = StellarSdk;

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Log incoming requests
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Middleware de tratamento de erros global
app.use((err, req, res, next) => {
  console.error('[ERROR]', new Date().toISOString(), 'Erro não tratado:', err);
  res.status(500).json({
    error: 'Erro interno do servidor',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Algo deu errado'
  });
});

// Configurar rede Stellar para testnet
StellarSdk.Networks.TESTNET;
const server = new StellarSdk.Horizon.Server('https://horizon-testnet.stellar.org');
console.log('[SETUP] Connected to Stellar Testnet');

// Rota para funding de wallets na testnet
app.post('/testnet/fund/:publickey', async (req, res) => {
  console.log('[FUNDING] Attempting to fund account:', req.params.publickey);
  try {
    const { publickey } = req.params;
    
    // Validar se a chave pública é válida usando StrKey
    if (!publickey || !StrKey.isValidEd25519PublicKey(publickey)) {
      console.log('[VALIDATION] Invalid public key:', publickey);
      return res.status(400).json({ 
        error: 'Chave pública inválida. Deve ser uma chave pública Ed25519 válida.' 
      });
    }

    // Usar o Friendbot da Stellar para financiar a conta na testnet
    try {
      console.log('[FRIENDBOT] Calling Friendbot for account:', publickey);
      const response = await server.friendbot(publickey).call();
      console.log('[FRIENDBOT] Success! Transaction hash:', response.hash);
      
      res.json({
        success: true,
        message: 'Conta financiada com sucesso!',
        publicKey: publickey,
        transactionHash: response.hash,
        balance: '10000.0000000' // Friendbot adiciona 10,000 XLM
      });
    } catch (friendbotError) {
      console.log('[FRIENDBOT] Error:', friendbotError.message);
      // Se a conta já existe, verificar se está ativa
      if (friendbotError.response && friendbotError.response.status === 400) {
        try {
          console.log('[ACCOUNT] Checking if account exists:', publickey);
          const account = await server.loadAccount(publickey);
          console.log('[ACCOUNT] Account already exists and is active');
          res.json({
            success: true,
            message: 'Conta já existe e está ativa!',
            publicKey: publickey
          });
        } catch (loadError) {
          console.error('[ACCOUNT] Error loading account:', loadError);
          res.status(400).json({
            error: 'Falha ao financiar a conta',
            details: friendbotError.message
          });
        }
      } else {
        res.status(400).json({
          error: 'Falha ao financiar a conta',
          details: friendbotError.message
        });
      }
    }
  } catch (error) {
    console.error('[ERROR] Failed to fund account:', error);
    res.status(500).json({
      error: 'Erro interno do servidor',
      message: error.message
    });
  }
});

// Rota de health check
app.get('/health', (req, res) => {
  console.log('[HEALTH] Health check requested');
  res.json({ status: 'OK', message: 'Backend funcionando!' });
});

// Rota para verificar saldo de uma conta
app.get('/balance/:publickey', async (req, res) => {
  console.log('[BALANCE] Checking balance for account:', req.params.publickey);
  try {
    const { publickey } = req.params;
    
    // Validar se a chave pública é válida usando StrKey
    if (!publickey || !StrKey.isValidEd25519PublicKey(publickey)) {
      console.log('[VALIDATION] Invalid public key:', publickey);
      return res.status(400).json({ 
        error: 'Chave pública inválida. Deve ser uma chave pública Ed25519 válida.' 
      });
    }
    
    const account = await server.loadAccount(publickey);
    const nativeBalance = account.balances.find(b => b.asset_type === 'native');
    console.log('[BALANCE] Account balance retrieved:', nativeBalance?.balance);
    
    res.json({
      publicKey: publickey,
      balance: nativeBalance ? nativeBalance.balance : '0',
      accountExists: true,
      balances: account.balances
    });
  } catch (error) {
    if (error instanceof StellarSdk.NotFoundError) {
      console.log('[BALANCE] Account not found:', req.params.publickey);
      res.json({
        publicKey: req.params.publickey,
        balance: '0',
        accountExists: false
      });
    } else {
      console.error('[ERROR] Failed to check balance:', error);
      res.status(500).json({
        error: 'Erro ao verificar saldo',
        message: error.message
      });
    }
  }
});

app.listen(PORT, () => {
  console.log(`[SERVER] 🚀 Backend rodando na porta ${PORT}`);
  console.log(`[SERVER] 📡 Health check: http://localhost:${PORT}/health`);
  console.log(`[SERVER] 💰 Funding endpoint: http://localhost:${PORT}/testnet/fund/:publickey`);
});