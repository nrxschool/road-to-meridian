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
  private static readonly HORIZON_URL = import.meta.env.VITE_RPC_ENDPOINT || 'https://horizon-testnet.stellar.org';
  private server: StellarSdk.Horizon.Server;

  constructor() {
    this.server = new StellarSdk.Horizon.Server(StellarService.HORIZON_URL);
  }

  /**
   * Creates a new Stellar wallet
   */
  createWallet(): StellarWallet {
    const keypair = StellarSdk.Keypair.random();
    return {
      publicKey: keypair.publicKey(),
      secretKey: keypair.secret()
    };
  }

  /**
   * Calls backend to fund wallet on testnet
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
        console.error('Funding failed:', data.error);
        return {
          success: false,
          message: data.error || 'Failed to fund wallet',
          error: data.error
        };
      }
    } catch (error) {
      console.error('Error calling funding backend:', error);
      return {
        success: false,
        message: 'Backend connection error',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Checks account balance
   */
  async getBalance(publicKey: string): Promise<string> {
    try {
      const account = await this.server.loadAccount(publicKey);
      const balance = account.balances.find(b => b.asset_type === 'native');
      return balance ? balance.balance : '0';
    } catch (error) {
      console.error('Error checking balance:', error);
      return '0';
    }
  }

  /**
   * Checks if account exists
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
   * Formats Stellar address for display
   */
  formatAddress(address: string): string {
    if (address.length <= 8) return address;
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  }

  /**
   * Validates if Stellar public key is valid
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
   * Saves wallet to localStorage (development only)
   */
  saveWalletToStorage(wallet: StellarWallet): void {
    localStorage.setItem('stellar_wallet', JSON.stringify(wallet));
  }

  /**
   * Retrieves wallet from localStorage
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
   * Removes wallet from localStorage
   */
  clearWalletFromStorage(): void {
    localStorage.removeItem('stellar_wallet');
  }
}

// Instância singleton
export const stellarService = new StellarService();