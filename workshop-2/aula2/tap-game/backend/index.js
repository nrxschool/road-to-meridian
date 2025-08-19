const express = require('express');
const cors = require('cors');
const StellarSdk = require('@stellar/stellar-sdk');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Configurar servidor Stellar para testnet
const server = new StellarSdk.Horizon.Server('https://horizon-testnet.stellar.org');

// Rota para funding de wallets na testnet
app.post('/testnet/fund/:publickey', async (req, res) => {
  try {
    const { publickey } = req.params;
    
    // Validar se a chave pública é válida
    if (!publickey || publickey.length !== 56 || !publickey.startsWith('G')) {
      return res.status(400).json({ 
        error: 'Chave pública inválida. Deve ter 56 caracteres e começar com G.' 
      });
    }

    // Usar o Friendbot da Stellar para financiar a conta na testnet
    const friendbotUrl = `https://friendbot.stellar.org?addr=${publickey}`;
    
    const response = await fetch(friendbotUrl);
    
    if (response.ok) {
      const result = await response.json();
      
      res.json({
        success: true,
        message: 'Conta financiada com sucesso!',
        publicKey: publickey,
        transactionHash: result.hash,
        balance: '10000.0000000' // Friendbot adiciona 10,000 XLM
      });
    } else {
      const errorText = await response.text();
      
      // Se a conta já existe, ainda consideramos sucesso
      if (errorText.includes('createAccountAlreadyExist')) {
        res.json({
          success: true,
          message: 'Conta já existe e está ativa!',
          publicKey: publickey
        });
      } else {
        res.status(400).json({
          error: 'Falha ao financiar a conta',
          details: errorText
        });
      }
    }
  } catch (error) {
    console.error('Erro ao financiar conta:', error);
    res.status(500).json({
      error: 'Erro interno do servidor',
      message: error.message
    });
  }
});

// Rota de health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Backend funcionando!' });
});

// Rota para verificar saldo de uma conta
app.get('/balance/:publickey', async (req, res) => {
  try {
    const { publickey } = req.params;
    
    const account = await server.loadAccount(publickey);
    const balance = account.balances.find(b => b.asset_type === 'native');
    
    res.json({
      publicKey: publickey,
      balance: balance ? balance.balance : '0',
      accountExists: true
    });
  } catch (error) {
    if (error.response && error.response.status === 404) {
      res.json({
        publicKey: req.params.publickey,
        balance: '0',
        accountExists: false
      });
    } else {
      res.status(500).json({
        error: 'Erro ao verificar saldo',
        message: error.message
      });
    }
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Backend rodando na porta ${PORT}`);
  console.log(`📡 Health check: http://localhost:${PORT}/health`);
  console.log(`💰 Funding endpoint: http://localhost:${PORT}/testnet/fund/:publickey`);
});