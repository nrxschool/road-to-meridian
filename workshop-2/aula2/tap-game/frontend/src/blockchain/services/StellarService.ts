import * as StellarSdk from '@stellar/stellar-sdk';

export interface StellarWallet {
  publicKey: string;
  secretKey: string;
}

export interface FundingResponse {
  success: boolean;
  message: string;
  publicKey?: string;
  transactionHash?: string;
  balance?: string;
  error?: string;
}

export class StellarService {
  private static readonly BACKEND_URL = 'http://localhost:3001';
  private static readonly HORIZON_URL = 'https://horizon-testnet.stellar.org';
  private server: StellarSdk.Horizon.Server;

  constructor() {
    this.server = new StellarSdk.Horizon.Server(StellarService.HORIZON_URL);
  }

  /**
   * Cria uma nova wallet Stellar
   */
  createWallet(): StellarWallet {
    const keypair = StellarSdk.Keypair.random();
    return {
      publicKey: keypair.publicKey(),
      secretKey: keypair.secret()
    };
  }

  /**
   * Chama o backend para financiar a wallet na testnet
   */
  async fundWallet(publicKey: string): Promise<FundingResponse> {
    try {
      const response = await fetch(`${StellarService.BACKEND_URL}/testnet/fund/${publicKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (response.ok) {
        return data;
      } else {
        return {
          success: false,
          message: data.error || 'Erro ao financiar wallet',
          error: data.error
        };
      }
    } catch (error) {
      console.error('Erro ao chamar backend de funding:', error);
      return {
        success: false,
        message: 'Erro de conexão com o backend',
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      };
    }
  }

  /**
   * Verifica o saldo de uma conta
   */
  async getBalance(publicKey: string): Promise<string> {
    try {
      const account = await this.server.loadAccount(publicKey);
      const balance = account.balances.find(b => b.asset_type === 'native');
      return balance ? balance.balance : '0';
    } catch (error) {
      console.error('Erro ao verificar saldo:', error);
      return '0';
    }
  }

  /**
   * Verifica se uma conta existe
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
   * Formata um endereço Stellar para exibição
   */
  formatAddress(address: string): string {
    if (address.length <= 8) return address;
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  }

  /**
   * Valida se uma chave pública Stellar é válida
   */
  isValidPublicKey(publicKey: string): boolean {
    try {
      StellarSdk.Keypair.fromPublicKey(publicKey);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Salva wallet no localStorage (apenas para desenvolvimento)
   */
  saveWalletToStorage(wallet: StellarWallet): void {
    localStorage.setItem('stellar_wallet', JSON.stringify(wallet));
  }

  /**
   * Recupera wallet do localStorage
   */
  getWalletFromStorage(): StellarWallet | null {
    try {
      const stored = localStorage.getItem('stellar_wallet');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  }

  /**
   * Remove wallet do localStorage
   */
  clearWalletFromStorage(): void {
    localStorage.removeItem('stellar_wallet');
  }
}

// Instância singleton
export const stellarService = new StellarService();