import { 
  Keypair, 
  Horizon,
  TransactionBuilder, 
  Networks, 
  Operation,
  Asset,
  Account
} from '@stellar/stellar-sdk';
import { StellarWallet, Player, GameResult, TransactionResult } from '../types';

// Configurações da rede Stellar
const STELLAR_CONFIG = {
  network: Networks.TESTNET,
  server: new Horizon.Server('https://horizon-testnet.stellar.org'),
  contractAddress: import.meta.env.VITE_CONTRACT_ADDRESS || 'CCOT2GXJ2ND4FSHSG22USR2244ZJDBEBQZYEBBD3DQ45BGLYVDT3WUJB'
};

class StellarService {
  private server: Horizon.Server;
  private networkPassphrase: string;

  constructor() {
    this.server = STELLAR_CONFIG.server;
    this.networkPassphrase = STELLAR_CONFIG.network;
  }

  /**
   * Formata um endereço Stellar para exibição
   */
  formatAddress(address: string): string {
    if (!address || address.length < 10) {
      return address;
    }
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  }

  /**
   * Obtém o ranking de jogadores do contrato
   */
  async getRankFromContract(): Promise<Player[]> {
    try {
      // Simulação de dados do ranking para desenvolvimento
      // Em produção, isso seria uma chamada real ao contrato Soroban
      const mockPlayers: Player[] = [
        {
          address: 'GBTESTACCOUNTADDRESSFORSTELLARNETWORK123456789',
          score: 150,
          gameTime: 10000,
          timestamp: Date.now() - 3600000
        },
        {
          address: 'GCTESTACCOUNTADDRESSFORSTELLARNETWORK987654321',
          score: 120,
          gameTime: 10000,
          timestamp: Date.now() - 7200000
        },
        {
          address: 'GDTESTACCOUNTADDRESSFORSTELLARNETWORK456789123',
          score: 95,
          gameTime: 10000,
          timestamp: Date.now() - 10800000
        }
      ];

      // Ordena por pontuação (maior para menor)
      return mockPlayers.sort((a, b) => b.score - a.score);
    } catch (error) {
      console.error('Erro ao obter ranking do contrato:', error);
      throw new Error('Falha ao carregar ranking');
    }
  }

  /**
   * Envia resultado do jogo para o contrato
   */
  async sendGameResultToContract(
    wallet: StellarWallet, 
    score: number, 
    gameTime: number
  ): Promise<boolean> {
    try {
      if (!wallet || !wallet.publicKey || !wallet.secretKey) {
        throw new Error('Wallet inválida');
      }

      // Validações básicas
      if (score < 0 || gameTime <= 0) {
        throw new Error('Dados do jogo inválidos');
      }

      // Cria o keypair a partir da secret key
      const sourceKeypair = Keypair.fromSecret(wallet.secretKey);
      
      // Carrega a conta do usuário
      const account = await this.server.loadAccount(sourceKeypair.publicKey());
      
      // Para desenvolvimento, vamos simular o envio bem-sucedido
      // Em produção, aqui seria feita a chamada real ao contrato Soroban
      console.log('Enviando resultado do jogo:', {
        publicKey: wallet.publicKey,
        score,
        gameTime,
        timestamp: Date.now()
      });

      // Simula delay de rede
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Simula sucesso (em produção seria o resultado real da transação)
      return true;
    } catch (error) {
      console.error('Erro ao enviar resultado para o contrato:', error);
      
      // Se a conta não existe, retorna false mas não falha
      if (error instanceof Error && error.message.includes('account not found')) {
        console.warn('Conta não encontrada na rede, mas continuando...');
        return true; // Para desenvolvimento, consideramos sucesso
      }
      
      return false;
    }
  }

  /**
   * Verifica se uma conta existe na rede Stellar
   */
  async accountExists(publicKey: string): Promise<boolean> {
    try {
      await this.server.loadAccount(publicKey);
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Obtém o saldo de uma conta
   */
  async getAccountBalance(publicKey: string): Promise<string> {
    try {
      const account = await this.server.loadAccount(publicKey);
      const xlmBalance = account.balances.find(
        balance => balance.asset_type === 'native'
      );
      return xlmBalance ? xlmBalance.balance : '0';
    } catch (error) {
      console.error('Erro ao obter saldo:', error);
      return '0';
    }
  }

  /**
   * Cria uma transação de pagamento simples (para testes)
   */
  async createPaymentTransaction(
    sourceKeypair: Keypair,
    destinationId: string,
    amount: string
  ): Promise<TransactionResult> {
    try {
      const account = await this.server.loadAccount(sourceKeypair.publicKey());
      
      const transaction = new TransactionBuilder(account, {
        fee: '100',
        networkPassphrase: this.networkPassphrase
      })
        .addOperation(
          Operation.payment({
            destination: destinationId,
            asset: Asset.native(),
            amount: amount
          })
        )
        .setTimeout(30)
        .build();

      transaction.sign(sourceKeypair);
      const result = await this.server.submitTransaction(transaction);

      return {
        hash: result.hash,
        success: result.successful
      };
    } catch (error) {
      console.error('Erro ao criar transação:', error);
      return {
        hash: '',
        success: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      };
    }
  }
}

// Instância singleton do serviço
export const stellarService = new StellarService();

// Exporta tipos para uso nos hooks
export type { StellarWallet, Player, GameResult, TransactionResult };