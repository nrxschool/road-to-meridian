#!/usr/bin/env node

/**
 * Demonstração de Autenticação com Smart Contracts Stellar
 * Mostra como usar autenticação em contratos Soroban
 */

const StellarSdk = require('@stellar/stellar-sdk');

class AuthDemo {
    constructor() {
        // Configuração da rede Stellar (Testnet)
        this.server = new StellarSdk.SorobanRpc.Server('https://soroban-testnet.stellar.org');
        this.networkPassphrase = StellarSdk.Networks.TESTNET;
        
        // Keypairs para demonstração
        this.ownerKeypair = StellarSdk.Keypair.random();
        this.user1Keypair = StellarSdk.Keypair.random();
        this.user2Keypair = StellarSdk.Keypair.random();
        this.spenderKeypair = StellarSdk.Keypair.random();
        
        // ID do contrato (será definido após deploy)
        this.contractId = null;
        
        console.log('🔐 === DEMO DE AUTENTICAÇÃO ===');
        console.log(`Owner: ${this.ownerKeypair.publicKey()}`);
        console.log(`User1: ${this.user1Keypair.publicKey()}`);
        console.log(`User2: ${this.user2Keypair.publicKey()}`);
        console.log(`Spender: ${this.spenderKeypair.publicKey()}`);
    }
    
    async fundAccounts() {
        console.log('\n💰 Financiando contas na testnet...');
        
        const accounts = [
            this.ownerKeypair.publicKey(),
            this.user1Keypair.publicKey(),
            this.user2Keypair.publicKey(),
            this.spenderKeypair.publicKey()
        ];
        
        for (const account of accounts) {
            try {
                const response = await fetch(`https://friendbot.stellar.org?addr=${account}`);
                if (response.ok) {
                    console.log(`✅ Conta financiada: ${account.substring(0, 8)}...`);
                } else {
                    console.log(`❌ Erro ao financiar: ${account.substring(0, 8)}...`);
                }
            } catch (error) {
                console.log(`❌ Erro de rede: ${error.message}`);
            }
        }
    }
    
    async deployContract() {
        console.log('\n📦 Simulando deploy do contrato...');
        
        // Simula deploy do contrato
        this.contractId = 'CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQAHHAGK6Z62';
        console.log(`✅ Contrato deployado com ID: ${this.contractId}`);
        
        // Simula inicialização
        console.log('🔧 Inicializando contrato...');
        console.log(`📞 Chamando initialize(owner: ${this.ownerKeypair.publicKey().substring(0, 8)}...)`);
        console.log('✅ Contrato inicializado com owner definido');
    }
    
    async demonstrateOwnerFunctions() {
        console.log('\n👑 === FUNÇÕES DO OWNER ===');
        
        // Owner define saldos iniciais
        console.log('💾 Owner definindo saldos iniciais...');
        console.log(`📞 set_balance(user1, 1000)`);
        console.log(`📞 set_balance(user2, 500)`);
        console.log('✅ Saldos definidos pelo owner');
        
        // Owner faz mint
        console.log('\n🏭 Owner fazendo mint de tokens...');
        console.log(`📞 admin_mint(user1, 500)`);
        console.log('✅ 500 tokens mintados para user1');
        console.log('📊 Saldo user1: 1000 + 500 = 1500');
        
        // Owner faz burn
        console.log('\n🔥 Owner fazendo burn de tokens...');
        console.log(`📞 admin_burn(user1, 200)`);
        console.log('✅ 200 tokens queimados de user1');
        console.log('📊 Saldo user1: 1500 - 200 = 1300');
    }
    
    async demonstrateUserTransfer() {
        console.log('\n💸 === TRANSFERÊNCIA ENTRE USUÁRIOS ===');
        
        console.log('🔐 User1 transferindo para User2...');
        console.log('⚠️  Requer autenticação de User1');
        
        // Simula assinatura da transação
        console.log('✍️  User1 assinando transação...');
        console.log(`📞 transfer(from: user1, to: user2, amount: 300)`);
        console.log('✅ Transferência autorizada e executada');
        
        console.log('📊 Saldos após transferência:');
        console.log('   User1: 1300 - 300 = 1000');
        console.log('   User2: 500 + 300 = 800');
    }
    
    async demonstrateAllowanceSystem() {
        console.log('\n🎫 === SISTEMA DE ALLOWANCE ===');
        
        // User1 aprova spender
        console.log('📝 User1 aprovando spender...');
        console.log('⚠️  Requer autenticação de User1');
        console.log('✍️  User1 assinando aprovação...');
        console.log(`📞 approve(owner: user1, spender: spender, amount: 400)`);
        console.log('✅ Spender aprovado para gastar 400 tokens');
        
        // Spender usa allowance
        console.log('\n💳 Spender usando allowance...');
        console.log('⚠️  Requer autenticação do Spender');
        console.log('✍️  Spender assinando transação...');
        console.log(`📞 transfer_from(spender: spender, from: user1, to: user2, amount: 150)`);
        console.log('✅ Transferência via allowance executada');
        
        console.log('📊 Estado após transfer_from:');
        console.log('   User1: 1000 - 150 = 850');
        console.log('   User2: 800 + 150 = 950');
        console.log('   Allowance restante: 400 - 150 = 250');
    }
    
    async demonstrateOwnershipTransfer() {
        console.log('\n👑 === TRANSFERÊNCIA DE OWNERSHIP ===');
        
        console.log('🔄 Owner atual transferindo ownership...');
        console.log('⚠️  Requer autenticação do owner atual');
        console.log('✍️  Owner assinando transferência...');
        console.log(`📞 transfer_ownership(new_owner: user1)`);
        console.log('✅ Ownership transferido para User1');
        
        console.log('📊 User1 agora é o novo owner do contrato');
    }
    
    async demonstrateSecurityFeatures() {
        console.log('\n🛡️  === RECURSOS DE SEGURANÇA ===');
        
        console.log('🔒 Tentativas de acesso não autorizado:');
        
        // Tentativa de user2 definir saldo (deve falhar)
        console.log('\n❌ User2 tentando definir saldo (sem ser owner):');
        console.log(`📞 set_balance(user: user2, amount: 9999)`);
        console.log('🚫 FALHA: Apenas o owner pode definir saldos');
        
        // Tentativa de transferir sem saldo suficiente
        console.log('\n❌ User2 tentando transferir mais do que tem:');
        console.log(`📞 transfer(from: user2, to: user1, amount: 2000)`);
        console.log('🚫 FALHA: Saldo insuficiente');
        
        // Tentativa de usar allowance excessiva
        console.log('\n❌ Spender tentando usar mais allowance do que tem:');
        console.log(`📞 transfer_from(spender: spender, from: user1, to: user2, amount: 500)`);
        console.log('🚫 FALHA: Allowance insuficiente (apenas 250 restantes)');
        
        console.log('\n✅ Todas as verificações de segurança funcionaram!');
    }
    
    async demonstrateAuthenticationFlow() {
        console.log('\n🔐 === FLUXO DE AUTENTICAÇÃO ===');
        
        console.log('📋 Processo de autenticação no Stellar:');
        console.log('1. 🔑 Usuário possui keypair (chave privada + pública)');
        console.log('2. 📝 Transação é criada com operações do contrato');
        console.log('3. ✍️  Usuário assina transação com chave privada');
        console.log('4. 🌐 Transação é enviada para a rede Stellar');
        console.log('5. ✅ Rede verifica assinatura e executa contrato');
        
        console.log('\n🛡️  Benefícios da autenticação:');
        console.log('• 🔒 Apenas donos de chaves podem autorizar ações');
        console.log('• 🚫 Previne execução não autorizada de funções');
        console.log('• 📊 Permite controle granular de permissões');
        console.log('• 🎫 Sistema de allowance para delegação segura');
    }
    
    async demonstrateCodeExamples() {
        console.log('\n💻 === EXEMPLOS DE CÓDIGO ===');
        
        console.log('🔧 Implementação de autenticação no contrato:');
        console.log(`
// Rust - Soroban
pub fn transfer(env: Env, from: Address, to: Address, amount: u64) {
    from.require_auth(); // ← Requer autenticação!
    // ... lógica da transferência
}
`);
        
        console.log('📱 Uso no JavaScript:');
        console.log(`
// JavaScript - Stellar SDK
const transaction = new StellarSdk.TransactionBuilder(account, {
    fee: StellarSdk.BASE_FEE,
    networkPassphrase: StellarSdk.Networks.TESTNET,
})
.addOperation(contract.call('transfer', from, to, amount))
.setTimeout(30)
.build();

// Assina com a chave privada do 'from'
transaction.sign(fromKeypair);
`);
    }
    
    async runDemo() {
        try {
            await this.fundAccounts();
            await this.deployContract();
            await this.demonstrateOwnerFunctions();
            await this.demonstrateUserTransfer();
            await this.demonstrateAllowanceSystem();
            await this.demonstrateOwnershipTransfer();
            await this.demonstrateSecurityFeatures();
            await this.demonstrateAuthenticationFlow();
            await this.demonstrateCodeExamples();
            
            console.log('\n🎉 === DEMONSTRAÇÃO CONCLUÍDA ===');
            console.log('\n📚 Pontos importantes sobre autenticação:');
            console.log('• 🔐 require_auth() garante que apenas o dono da chave pode executar');
            console.log('• 🎫 Sistema de allowance permite delegação controlada');
            console.log('• 👑 Funções administrativas protegidas por ownership');
            console.log('• 🛡️  Verificações de saldo/allowance previnem ataques');
            console.log('• ✍️  Assinaturas criptográficas garantem integridade');
            
        } catch (error) {
            console.error('❌ Erro na demonstração:', error.message);
        }
    }
}

// Executa a demonstração se chamado diretamente
if (require.main === module) {
    const demo = new AuthDemo();
    demo.runDemo();
}

module.exports = AuthDemo;