import { useState, useCallback } from 'react';
import { stellarService, StellarWallet, FundingResponse } from '../services/StellarService';
import { toast } from 'sonner';

export interface UseStellarWalletReturn {
  wallet: StellarWallet | null;
  isLoading: boolean;
  isConnected: boolean;
  createAndFundWallet: () => Promise<boolean>;
  disconnect: () => void;
  formatAddress: (address: string) => string;
}

export const useStellarWallet = (): UseStellarWalletReturn => {
  const [wallet, setWallet] = useState<StellarWallet | null>(() => {
    return stellarService.getWalletFromStorage();
  });
  const [isLoading, setIsLoading] = useState(false);

  const createAndFundWallet = useCallback(async (): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      toast.info('Creating new Stellar wallet...');
      const newWallet = stellarService.createWallet();
      
      toast.info('Funding wallet on testnet...');
      const fundingResult: FundingResponse = await stellarService.fundWallet(newWallet.publicKey);
      
      if (fundingResult.success) {
        stellarService.saveWalletToStorage(newWallet);
        setWallet(newWallet);
        
        toast.success('Wallet created and funded successfully!');
        return true;
      } else {
        console.error('Wallet funding failed:', fundingResult.message);
        toast.error(`Error funding wallet: ${fundingResult.message}`);
        return false;
      }
    } catch (error) {
      console.error('Error creating and funding wallet:', error);
      toast.error('Error creating wallet. Please try again.');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const disconnect = useCallback(() => {
    stellarService.clearWalletFromStorage();
    setWallet(null);
    toast.info('Wallet disconnected');
  }, []);

  const formatAddress = useCallback((address: string) => {
    return stellarService.formatAddress(address);
  }, []);

  return {
    wallet,
    isLoading,
    isConnected: !!wallet,
    createAndFundWallet,
    disconnect,
    formatAddress,
  };
};