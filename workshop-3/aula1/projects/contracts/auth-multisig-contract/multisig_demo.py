#!/usr/bin/env python3
"""
Demonstração do Contrato Multisig (2 de 3 assinaturas)
Mostra como funciona autenticação com múltiplas assinaturas
"""

import stellar_sdk
from stellar_sdk import Keypair, Network, SorobanServer, TransactionBuilder
import time
import json

class MultisigDemo:
    def __init__(self):
        # Configuração da rede Stellar (Testnet)
        self.network = Network.TESTNET_NETWORK_PASSPHRASE
        self.soroban_server = SorobanServer("https://soroban-testnet.stellar.org")
        
        # Keypairs para os 3 signers
        self.signer1 = Keypair.random()
        self.signer2 = Keypair.random()
        self.signer3 = Keypair.random()
        
        # Usuários para demonstração
        self.user1 = Keypair.random()
        self.user2 = Keypair.random()
        
        # ID do contrato (será definido após deploy)
        self.contract_id = None
        
        print('🔐 === DEMO MULTISIG (2 de 3) ===')
        print(f'Signer 1: {self.signer1.public_key[:8]}...')
        print(f'Signer 2: {self.signer2.public_key[:8]}...')
        print(f'Signer 3: {self.signer3.public_key[:8]}...')
        print(f'User 1: {self.user1.public_key[:8]}...')
        print(f'User 2: {self.user2.public_key[:8]}...')
        
    def fund_accounts(self):
        """Financia todas as contas na testnet"""
        print('\n💰 Financiando contas na testnet...')
        
        accounts = [
            self.signer1.public_key,
            self.signer2.public_key,
            self.signer3.public_key,
            self.user1.public_key,
            self.user2.public_key
        ]
        
        for account in accounts:
            try:
                import requests
                response = requests.get(f"https://friendbot.stellar.org?addr={account}")
                if response.status_code == 200:
                    print(f"✅ Financiado: {account[:8]}...")
                else:
                    print(f"❌ Erro: {account[:8]}...")
            except Exception as e:
                print(f"❌ Erro de rede: {e}")
                
    def deploy_contract(self):
        """Simula deploy do contrato multisig"""
        print('\n📦 Fazendo deploy do contrato multisig...')
        
        # Simula deploy
        self.contract_id = 'CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQAHHAGK6Z62'
        print(f'✅ Contrato deployado: {self.contract_id}')
        
        # Simula inicialização
        print('🔧 Inicializando contrato multisig...')
        signers = [self.signer1.public_key, self.signer2.public_key, self.signer3.public_key]
        print(f'📞 initialize(signers: {len(signers)}, required: 2)')
        print('✅ Contrato inicializado: 2 de 3 assinaturas requeridas')
        
    def demonstrate_proposal_creation(self):
        """Demonstra criação de propostas"""
        print('\n📝 === CRIAÇÃO DE PROPOSTAS ===')
        
        # Signer1 cria proposta de mint
        print('🏭 Signer1 criando proposta de mint...')
        print('⚠️  Requer autenticação do Signer1')
        print('✍️  Signer1 assinando proposta...')
        print(f'📞 create_proposal(proposer: signer1, action: Mint(to: user1, amount: 1000))')
        print('✅ Proposta #1 criada: Mint 1000 tokens para User1')
        
        # Signer2 cria proposta de transferência
        print('\n💸 Signer2 criando proposta de transferência...')
        print('⚠️  Requer autenticação do Signer2')
        print('✍️  Signer2 assinando proposta...')
        print(f'📞 create_proposal(proposer: signer2, action: Transfer(from: user1, to: user2, amount: 300))')
        print('✅ Proposta #2 criada: Transferir 300 tokens de User1 para User2')
        
        print('\n📊 Estado atual:')
        print('   Proposta #1: Mint - 0/2 aprovações')
        print('   Proposta #2: Transfer - 0/2 aprovações')
        
    def demonstrate_approval_process(self):
        """Demonstra processo de aprovação"""
        print('\n✅ === PROCESSO DE APROVAÇÃO ===')
        
        # Aprovações para Proposta #1 (Mint)
        print('🎯 Aprovando Proposta #1 (Mint)...')
        
        # Primeira aprovação
        print('\n1️⃣ Signer2 aprovando Proposta #1...')
        print('⚠️  Requer autenticação do Signer2')
        print('✍️  Signer2 assinando aprovação...')
        print('📞 approve_proposal(signer: signer2, proposal_id: 1)')
        print('✅ Aprovação registrada (1/2)')
        
        # Segunda aprovação
        print('\n2️⃣ Signer3 aprovando Proposta #1...')
        print('⚠️  Requer autenticação do Signer3')
        print('✍️  Signer3 assinando aprovação...')
        print('📞 approve_proposal(signer: signer3, proposal_id: 1)')
        print('✅ Aprovação registrada (2/2) - SUFICIENTE PARA EXECUÇÃO!')
        
        print('\n📊 Estado da Proposta #1:')
        print('   Aprovações: [signer2, signer3]')
        print('   Status: Pronta para execução (2/2 aprovações)')
        
    def demonstrate_execution(self):
        """Demonstra execução de propostas"""
        print('\n⚡ === EXECUÇÃO DE PROPOSTAS ===')
        
        # Execução da Proposta #1
        print('🚀 Executando Proposta #1 (Mint)...')
        print('⚠️  Requer autenticação de um signer')
        print('✍️  Signer1 assinando execução...')
        print('📞 execute_proposal(executor: signer1, proposal_id: 1)')
        
        print('\n🔍 Verificando aprovações...')
        print('   ✅ Aprovações suficientes: 2/2')
        print('   ✅ Proposta não executada anteriormente')
        print('   ✅ Executor é um signer válido')
        
        print('\n💫 Executando ação de Mint...')
        print('   📊 Saldo User1 antes: 0')
        print('   🏭 Mintando 1000 tokens para User1')
        print('   📊 Saldo User1 depois: 1000')
        print('   ✅ Proposta #1 marcada como executada')
        
    def demonstrate_partial_approval(self):
        """Demonstra proposta com aprovações insuficientes"""
        print('\n⚠️  === APROVAÇÕES INSUFICIENTES ===')
        
        # Tentativa de aprovação da Proposta #2
        print('🎯 Tentando aprovar Proposta #2 (Transfer)...')
        
        # Apenas uma aprovação
        print('\n1️⃣ Signer1 aprovando Proposta #2...')
        print('📞 approve_proposal(signer: signer1, proposal_id: 2)')
        print('✅ Aprovação registrada (1/2)')
        
        # Tentativa de execução prematura
        print('\n🚫 Tentando executar com aprovações insuficientes...')
        print('📞 execute_proposal(executor: signer1, proposal_id: 2)')
        print('\n🔍 Verificando aprovações...')
        print('   ❌ Aprovações insuficientes: 1/2')
        print('   🚫 EXECUÇÃO NEGADA: Precisa de mais uma aprovação')
        
        print('\n📊 Estado da Proposta #2:')
        print('   Aprovações: [signer1]')
        print('   Status: Aguardando mais aprovações (1/2)')
        
    def demonstrate_governance_actions(self):
        """Demonstra ações de governança"""
        print('\n🏛️  === AÇÕES DE GOVERNANÇA ===')
        
        # Proposta para adicionar novo signer
        print('👥 Criando proposta para adicionar novo signer...')
        new_signer = Keypair.random()
        print(f'🆕 Novo signer: {new_signer.public_key[:8]}...')
        
        print('📞 create_proposal(proposer: signer1, action: AddSigner(new_signer))')
        print('✅ Proposta #3 criada: Adicionar novo signer')
        
        # Aprovações para adicionar signer
        print('\n✅ Aprovando adição de signer...')
        print('📞 approve_proposal(signer: signer2, proposal_id: 3)')
        print('📞 approve_proposal(signer: signer3, proposal_id: 3)')
        print('📞 execute_proposal(executor: signer1, proposal_id: 3)')
        print('✅ Novo signer adicionado! Agora temos 4 signers (ainda 2/4 requerido)')
        
        # Proposta para mudar requisito de assinaturas
        print('\n🔢 Criando proposta para mudar requisito...')
        print('📞 create_proposal(proposer: signer2, action: ChangeRequiredSignatures(3))')
        print('✅ Proposta #4 criada: Mudar para 3 de 4 assinaturas')
        
        print('\n✅ Aprovando mudança de requisito...')
        print('📞 approve_proposal(signer: signer1, proposal_id: 4)')
        print('📞 approve_proposal(signer: signer3, proposal_id: 4)')
        print('📞 execute_proposal(executor: signer2, proposal_id: 4)')
        print('✅ Requisito alterado! Agora precisa de 3 de 4 assinaturas')
        
    def demonstrate_security_features(self):
        """Demonstra recursos de segurança"""
        print('\n🛡️  === RECURSOS DE SEGURANÇA ===')
        
        print('🔒 Tentativas de acesso não autorizado:')
        
        # Usuário não-signer tentando criar proposta
        print('\n❌ User1 (não-signer) tentando criar proposta:')
        print('📞 create_proposal(proposer: user1, action: Mint(...))')
        print('🚫 FALHA: Apenas signers podem criar propostas')
        
        # Tentativa de aprovação dupla
        print('\n❌ Signer1 tentando aprovar a mesma proposta duas vezes:')
        print('📞 approve_proposal(signer: signer1, proposal_id: 1)')
        print('🚫 FALHA: Signer já aprovou esta proposta')
        
        # Tentativa de execução de proposta já executada
        print('\n❌ Tentando executar proposta já executada:')
        print('📞 execute_proposal(executor: signer1, proposal_id: 1)')
        print('🚫 FALHA: Proposta já foi executada')
        
        # Tentativa de remoção que tornaria contrato inutilizável
        print('\n❌ Tentando remover signer que tornaria contrato inutilizável:')
        print('📞 create_proposal(action: RemoveSigner(...)) # com apenas 2 signers restantes')
        print('📞 execute_proposal(...)')
        print('🚫 FALHA: Não pode remover - tornaria contrato inutilizável')
        
        print('\n✅ Todas as verificações de segurança funcionaram!')
        
    def demonstrate_multisig_benefits(self):
        """Demonstra benefícios do multisig"""
        print('\n🌟 === BENEFÍCIOS DO MULTISIG ===')
        
        print('🔐 Segurança aprimorada:')
        print('• 🔑 Nenhum signer único pode executar ações sozinho')
        print('• 🛡️  Proteção contra chaves comprometidas')
        print('• 👥 Decisões coletivas para ações importantes')
        print('• 🚫 Previne ações maliciosas de insiders')
        
        print('\n🏛️  Governança descentralizada:')
        print('• 📊 Votação transparente em propostas')
        print('• ⏰ Processo deliberativo para mudanças')
        print('• 📝 Histórico auditável de todas as decisões')
        print('• 🔄 Capacidade de evoluir a governança')
        
        print('\n💼 Casos de uso:')
        print('• 🏦 Tesouraria de DAOs')
        print('• 🏢 Contas corporativas multi-assinatura')
        print('• 💰 Fundos de investimento descentralizados')
        print('• 🔒 Cofres de alta segurança')
        
    def demonstrate_implementation_details(self):
        """Demonstra detalhes de implementação"""
        print('\n💻 === DETALHES DE IMPLEMENTAÇÃO ===')
        
        print('🔧 Estrutura do contrato:')
        print('''
// Rust - Soroban
#[contracttype]
pub struct Proposal {
    pub id: u64,
    pub proposer: Address,
    pub action: ProposalAction,
    pub executed: bool,
}

#[contracttype]
pub enum ProposalAction {
    Transfer { from: Address, to: Address, amount: u64 },
    Mint { to: Address, amount: u64 },
    AddSigner { new_signer: Address },
    // ...
}
''')
        
        print('🔐 Verificação de autenticação:')
        print('''
// Verificação de signer
if !Self::is_signer(env.clone(), proposer.clone()) {
    panic!("Only signers can create proposals");
}

// Verificação de aprovações suficientes
if approvals.len() < required_signatures {
    panic!("Insufficient approvals");
}
''')
        
        print('📊 Fluxo de execução:')
        print('1. 📝 Signer cria proposta')
        print('2. ✅ Outros signers aprovam')
        print('3. 🔍 Sistema verifica aprovações suficientes')
        print('4. ⚡ Ação é executada automaticamente')
        print('5. 🔒 Proposta é marcada como executada')
        
    def run_demo(self):
        """Executa a demonstração completa"""
        try:
            self.fund_accounts()
            self.deploy_contract()
            self.demonstrate_proposal_creation()
            self.demonstrate_approval_process()
            self.demonstrate_execution()
            self.demonstrate_partial_approval()
            self.demonstrate_governance_actions()
            self.demonstrate_security_features()
            self.demonstrate_multisig_benefits()
            self.demonstrate_implementation_details()
            
            print('\n🎉 === DEMONSTRAÇÃO CONCLUÍDA ===')
            print('\n📚 Pontos importantes sobre Multisig:')
            print('• 🔐 Requer múltiplas assinaturas para ações críticas')
            print('• 🏛️  Permite governança descentralizada e transparente')
            print('• 🛡️  Protege contra chaves comprometidas ou ações maliciosas')
            print('• 📊 Fornece auditabilidade completa de decisões')
            print('• 🔄 Permite evolução da estrutura de governança')
            print('• ⚡ Execução automática quando critérios são atendidos')
            
        except Exception as error:
            print(f'❌ Erro na demonstração: {error}')

if __name__ == "__main__":
    demo = MultisigDemo()
    demo.run_demo()