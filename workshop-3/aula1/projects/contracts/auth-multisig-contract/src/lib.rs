#![no_std]
use soroban_sdk::{
    contract, contractimpl, contracttype, Address, Env, Vec,
};

#[derive(Clone, Debug, Eq, PartialEq)]
#[contracttype]
pub enum DataKey {
    Signers,
    RequiredSignatures,
    Balance(Address),
    ProposalCounter,
    Proposal(u64), // proposal_id
    ProposalApprovals(u64), // proposal_id -> Vec<Address>
}

#[derive(Clone, Debug, Eq, PartialEq)]
#[contracttype]
pub struct Proposal {
    pub id: u64,
    pub proposer: Address,
    pub action_type: u32, // 0=Transfer, 1=Mint, 2=Burn, 3=AddSigner, 4=RemoveSigner, 5=ChangeRequired
    pub from_addr: Option<Address>,
    pub to_addr: Option<Address>,
    pub amount: Option<u64>,
    pub signer_addr: Option<Address>,
    pub new_required: Option<u32>,
    pub executed: bool,
}

#[contract]
pub struct AuthMultisigContract;

#[contractimpl]
impl AuthMultisigContract {
    /// Inicializa o contrato multisig com signers e número de assinaturas requeridas
    pub fn initialize(env: Env, signers: Vec<Address>, required_signatures: u32) {
        if signers.len() < required_signatures {
            panic!("Required signatures cannot exceed number of signers");
        }
        
        if required_signatures == 0 {
            panic!("Required signatures must be at least 1");
        }
        
        env.storage().instance().set(&DataKey::Signers, &signers);
        env.storage().instance().set(&DataKey::RequiredSignatures, &required_signatures);
        env.storage().instance().set(&DataKey::ProposalCounter, &0u64);
    }
    
    /// Obtém a lista de signers
    pub fn get_signers(env: Env) -> Vec<Address> {
        env.storage().instance()
            .get(&DataKey::Signers)
            .expect("Contract not initialized")
    }
    
    /// Obtém o número de assinaturas requeridas
    pub fn get_required_signatures(env: Env) -> u32 {
        env.storage().instance()
            .get(&DataKey::RequiredSignatures)
            .expect("Contract not initialized")
    }
    
    /// Verifica se um endereço é um signer
    pub fn is_signer(env: Env, address: Address) -> bool {
        let signers = Self::get_signers(env);
        signers.contains(&address)
    }
    
    /// Define saldo (apenas para demonstração - normalmente seria via proposta)
    pub fn set_balance(env: Env, user: Address, amount: u64) {
        // Para simplicidade, permite que qualquer signer defina saldo inicial
        let _caller = env.current_contract_address(); // Simplificado para demo
        env.storage().persistent().set(&DataKey::Balance(user), &amount);
    }
    
    /// Obtém saldo
    pub fn get_balance(env: Env, user: Address) -> u64 {
        env.storage().persistent()
            .get(&DataKey::Balance(user))
            .unwrap_or(0)
    }
    
    /// Cria uma nova proposta de transferência
    pub fn create_transfer_proposal(env: Env, proposer: Address, from: Address, to: Address, amount: u64) -> u64 {
        Self::create_proposal_internal(env, proposer, 0, Some(from), Some(to), Some(amount), None, None)
    }
    
    /// Cria uma nova proposta de mint
    pub fn create_mint_proposal(env: Env, proposer: Address, to: Address, amount: u64) -> u64 {
        Self::create_proposal_internal(env, proposer, 1, None, Some(to), Some(amount), None, None)
    }
    
    /// Cria uma nova proposta de burn
    pub fn create_burn_proposal(env: Env, proposer: Address, from: Address, amount: u64) -> u64 {
        Self::create_proposal_internal(env, proposer, 2, Some(from), None, Some(amount), None, None)
    }
    
    /// Cria uma nova proposta para adicionar signer
    pub fn create_add_signer_proposal(env: Env, proposer: Address, new_signer: Address) -> u64 {
        Self::create_proposal_internal(env, proposer, 3, None, None, None, Some(new_signer), None)
    }
    
    /// Cria uma nova proposta para remover signer
    pub fn create_remove_signer_proposal(env: Env, proposer: Address, signer: Address) -> u64 {
        Self::create_proposal_internal(env, proposer, 4, None, None, None, Some(signer), None)
    }
    
    /// Cria uma nova proposta para alterar assinaturas requeridas
    pub fn create_change_required_proposal(env: Env, proposer: Address, new_required: u32) -> u64 {
        Self::create_proposal_internal(env, proposer, 5, None, None, None, None, Some(new_required))
    }
    
    /// Função interna para criar propostas
    fn create_proposal_internal(env: Env, proposer: Address, action_type: u32, from_addr: Option<Address>, to_addr: Option<Address>, amount: Option<u64>, signer_addr: Option<Address>, new_required: Option<u32>) -> u64 {
        proposer.require_auth();
        
        if !Self::is_signer(env.clone(), proposer.clone()) {
            panic!("Only signers can create proposals");
        }
        
        let mut counter: u64 = env.storage().instance()
            .get(&DataKey::ProposalCounter)
            .unwrap_or(0);
        
        counter += 1;
        
        let proposal = Proposal {
            id: counter,
            proposer,
            action_type,
            from_addr,
            to_addr,
            amount,
            signer_addr,
            new_required,
            executed: false,
        };
        
        env.storage().persistent().set(&DataKey::Proposal(counter), &proposal);
        env.storage().instance().set(&DataKey::ProposalCounter, &counter);
        
        // Inicializa lista de aprovações vazia
        let empty_approvals: Vec<Address> = Vec::new(&env);
        env.storage().persistent().set(&DataKey::ProposalApprovals(counter), &empty_approvals);
        
        counter
    }
    
    /// Aprova uma proposta
    pub fn approve_proposal(env: Env, signer: Address, proposal_id: u64) {
        signer.require_auth();
        
        if !Self::is_signer(env.clone(), signer.clone()) {
            panic!("Only signers can approve proposals");
        }
        
        let proposal: Proposal = env.storage().persistent()
            .get(&DataKey::Proposal(proposal_id))
            .expect("Proposal not found");
            
        if proposal.executed {
            panic!("Proposal already executed");
        }
        
        let mut approvals: Vec<Address> = env.storage().persistent()
            .get(&DataKey::ProposalApprovals(proposal_id))
            .unwrap_or(Vec::new(&env));
            
        // Verifica se já aprovou
        if approvals.contains(&signer) {
            panic!("Signer already approved this proposal");
        }
        
        approvals.push_back(signer);
        env.storage().persistent().set(&DataKey::ProposalApprovals(proposal_id), &approvals);
    }
    
    /// Executa uma proposta se tiver assinaturas suficientes
    pub fn execute_proposal(env: Env, executor: Address, proposal_id: u64) {
        executor.require_auth();
        
        if !Self::is_signer(env.clone(), executor) {
            panic!("Only signers can execute proposals");
        }
        
        let mut proposal: Proposal = env.storage().persistent()
            .get(&DataKey::Proposal(proposal_id))
            .expect("Proposal not found");
            
        if proposal.executed {
            panic!("Proposal already executed");
        }
        
        let approvals: Vec<Address> = env.storage().persistent()
            .get(&DataKey::ProposalApprovals(proposal_id))
            .unwrap_or(Vec::new(&env));
            
        let required_signatures = Self::get_required_signatures(env.clone());
        
        if approvals.len() < required_signatures {
            panic!("Insufficient approvals");
        }
        
        // Executa a ação baseada no tipo
        match proposal.action_type {
            0 => { // Transfer
                let from = proposal.from_addr.as_ref().unwrap().clone();
                let to = proposal.to_addr.as_ref().unwrap().clone();
                let amount = proposal.amount.unwrap();
                
                let from_balance = Self::get_balance(env.clone(), from.clone());
                if from_balance < amount {
                    panic!("Insufficient balance for transfer");
                }
                
                let to_balance = Self::get_balance(env.clone(), to.clone());
                
                env.storage().persistent().set(&DataKey::Balance(from), &(from_balance - amount));
                env.storage().persistent().set(&DataKey::Balance(to), &(to_balance + amount));
            },
            1 => { // Mint
                let to = proposal.to_addr.as_ref().unwrap().clone();
                let amount = proposal.amount.unwrap();
                
                let current_balance = Self::get_balance(env.clone(), to.clone());
                env.storage().persistent().set(&DataKey::Balance(to), &(current_balance + amount));
            },
            2 => { // Burn
                let from = proposal.from_addr.as_ref().unwrap().clone();
                let amount = proposal.amount.unwrap();
                
                let current_balance = Self::get_balance(env.clone(), from.clone());
                if current_balance < amount {
                    panic!("Insufficient balance for burn");
                }
                env.storage().persistent().set(&DataKey::Balance(from), &(current_balance - amount));
            },
            3 => { // AddSigner
                let new_signer = proposal.signer_addr.as_ref().unwrap().clone();
                
                let mut signers = Self::get_signers(env.clone());
                if !signers.contains(&new_signer) {
                    signers.push_back(new_signer);
                    env.storage().instance().set(&DataKey::Signers, &signers);
                }
            },
            4 => { // RemoveSigner
                let signer = proposal.signer_addr.as_ref().unwrap().clone();
                
                let signers = Self::get_signers(env.clone());
                let required = Self::get_required_signatures(env.clone());
                
                if signers.len() <= required {
                    panic!("Cannot remove signer: would make contract unusable");
                }
                
                // Remove o signer
                let mut new_signers = Vec::new(&env);
                for s in signers.iter() {
                    if s != signer {
                        new_signers.push_back(s);
                    }
                }
                env.storage().instance().set(&DataKey::Signers, &new_signers);
            },
            5 => { // ChangeRequiredSignatures
                let new_required = proposal.new_required.unwrap();
                
                let signers = Self::get_signers(env.clone());
                if new_required > signers.len() as u32 {
                    panic!("Required signatures cannot exceed number of signers");
                }
                if new_required == 0 {
                    panic!("Required signatures must be at least 1");
                }
                env.storage().instance().set(&DataKey::RequiredSignatures, &new_required);
            },
            _ => panic!("Invalid action type"),
        }
        
        // Marca proposta como executada
        proposal.executed = true;
        env.storage().persistent().set(&DataKey::Proposal(proposal_id), &proposal);
    }
    
    /// Obtém informações de uma proposta
    pub fn get_proposal(env: Env, proposal_id: u64) -> Proposal {
        env.storage().persistent()
            .get(&DataKey::Proposal(proposal_id))
            .expect("Proposal not found")
    }
    
    /// Obtém aprovações de uma proposta
    pub fn get_proposal_approvals(env: Env, proposal_id: u64) -> Vec<Address> {
        env.storage().persistent()
            .get(&DataKey::ProposalApprovals(proposal_id))
            .unwrap_or(Vec::new(&env))
    }
    
    /// Obtém o contador de propostas
    pub fn get_proposal_counter(env: Env) -> u64 {
        env.storage().instance()
            .get(&DataKey::ProposalCounter)
            .unwrap_or(0)
    }
}

#[cfg(test)]
mod test {
    use super::*;
    use soroban_sdk::{testutils::Address as _, Address, Env};

    #[test]
    fn test_initialization() {
        let env = Env::default();
        let contract_id = env.register_contract(None, AuthMultisigContract);
        let client = AuthMultisigContractClient::new(&env, &contract_id);
        
        let signer1 = Address::generate(&env);
        let signer2 = Address::generate(&env);
        let signer3 = Address::generate(&env);
        
        let mut signers = Vec::new(&env);
        signers.push_back(signer1.clone());
        signers.push_back(signer2.clone());
        signers.push_back(signer3.clone());
        
        client.initialize(&signers, &2);
        
        assert_eq!(client.get_signers(), signers);
        assert_eq!(client.get_required_signatures(), 2);
        assert!(client.is_signer(&signer1));
        assert!(client.is_signer(&signer2));
        assert!(client.is_signer(&signer3));
    }
    
    #[test]
    fn test_multisig_transfer() {
        let env = Env::default();
        let contract_id = env.register_contract(None, AuthMultisigContract);
        let client = AuthMultisigContractClient::new(&env, &contract_id);
        
        let signer1 = Address::generate(&env);
        let signer2 = Address::generate(&env);
        let signer3 = Address::generate(&env);
        let user = Address::generate(&env);
        let recipient = Address::generate(&env);
        
        let mut signers = Vec::new(&env);
        signers.push_back(signer1.clone());
        signers.push_back(signer2.clone());
        signers.push_back(signer3.clone());
        
        client.initialize(&signers, &2);
        client.set_balance(&user, &1000);
        
        // Cria proposta de transferência
        let action = ProposalAction::Transfer {
            from: user.clone(),
            to: recipient.clone(),
            amount: 500,
        };
        
        let proposal_id = client.create_proposal(&signer1, &action);
        assert_eq!(proposal_id, 1);
        
        // Primeira aprovação
        client.approve_proposal(&signer1, &proposal_id);
        
        // Segunda aprovação (suficiente para executar)
        client.approve_proposal(&signer2, &proposal_id);
        
        // Executa proposta
        client.execute_proposal(&signer1, &proposal_id);
        
        // Verifica saldos
        assert_eq!(client.get_balance(&user), 500);
        assert_eq!(client.get_balance(&recipient), 500);
        
        // Verifica que proposta foi executada
        let proposal = client.get_proposal(&proposal_id);
        assert!(proposal.executed);
    }
    
    #[test]
    fn test_multisig_mint() {
        let env = Env::default();
        let contract_id = env.register_contract(None, AuthMultisigContract);
        let client = AuthMultisigContractClient::new(&env, &contract_id);
        
        let signer1 = Address::generate(&env);
        let signer2 = Address::generate(&env);
        let signer3 = Address::generate(&env);
        let user = Address::generate(&env);
        
        let mut signers = Vec::new(&env);
        signers.push_back(signer1.clone());
        signers.push_back(signer2.clone());
        signers.push_back(signer3.clone());
        
        client.initialize(&signers, &2);
        
        // Cria proposta de mint
        let action = ProposalAction::Mint {
            to: user.clone(),
            amount: 1000,
        };
        
        let proposal_id = client.create_proposal(&signer1, &action);
        
        // Duas aprovações
        client.approve_proposal(&signer2, &proposal_id);
        client.approve_proposal(&signer3, &proposal_id);
        
        // Executa
        client.execute_proposal(&signer1, &proposal_id);
        
        assert_eq!(client.get_balance(&user), 1000);
    }
    
    #[test]
    fn test_add_remove_signer() {
        let env = Env::default();
        let contract_id = env.register_contract(None, AuthMultisigContract);
        let client = AuthMultisigContractClient::new(&env, &contract_id);
        
        let signer1 = Address::generate(&env);
        let signer2 = Address::generate(&env);
        let signer3 = Address::generate(&env);
        let new_signer = Address::generate(&env);
        
        let mut signers = Vec::new(&env);
        signers.push_back(signer1.clone());
        signers.push_back(signer2.clone());
        signers.push_back(signer3.clone());
        
        client.initialize(&signers, &2);
        
        // Adiciona novo signer
        let add_action = ProposalAction::AddSigner {
            new_signer: new_signer.clone(),
        };
        
        let proposal_id = client.create_proposal(&signer1, &add_action);
        client.approve_proposal(&signer2, &proposal_id);
        client.execute_proposal(&signer1, &proposal_id);
        
        assert!(client.is_signer(&new_signer));
        
        // Remove signer
        let remove_action = ProposalAction::RemoveSigner {
            signer: signer3.clone(),
        };
        
        let proposal_id2 = client.create_proposal(&signer1, &remove_action);
        client.approve_proposal(&signer2, &proposal_id2);
        client.execute_proposal(&signer1, &proposal_id2);
        
        assert!(!client.is_signer(&signer3));
    }
    
    #[test]
    #[should_panic(expected = "Insufficient approvals")]
    fn test_insufficient_approvals() {
        let env = Env::default();
        let contract_id = env.register_contract(None, AuthMultisigContract);
        let client = AuthMultisigContractClient::new(&env, &contract_id);
        
        let signer1 = Address::generate(&env);
        let signer2 = Address::generate(&env);
        let signer3 = Address::generate(&env);
        
        let mut signers = Vec::new(&env);
        signers.push_back(signer1.clone());
        signers.push_back(signer2.clone());
        signers.push_back(signer3.clone());
        
        client.initialize(&signers, &2);
        
        let action = ProposalAction::Mint {
            to: signer1.clone(),
            amount: 100,
        };
        
        let proposal_id = client.create_proposal(&signer1, &action);
        
        // Apenas uma aprovação (insuficiente)
        client.approve_proposal(&signer2, &proposal_id);
        
        // Deve falhar
        client.execute_proposal(&signer1, &proposal_id);
    }
}