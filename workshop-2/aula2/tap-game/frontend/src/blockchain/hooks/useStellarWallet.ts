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
    // Verificar se já existe uma wallet no localStorage
    const existingWallet = stellarService.getWalletFromStorage();
    if (existingWallet) {
      setWallet(existingWallet);
      toast.info('Wallet já existe e foi carregada!');
      return true;
    }

    setIsLoading(true);
    
    try {
      toast.info('Criando nova Stellar wallet...');
      const newWallet = stellarService.createWallet();
      
      toast.info('Financiando wallet na testnet...');
      const fundingResult: FundingResponse = await stellarService.fundWallet(newWallet.publicKey);
      
      if (fundingResult.success) {
        stellarService.saveWalletToStorage(newWallet);
        setWallet(newWallet);
        
        toast.success('Wallet criada e financiada com sucesso!');
        return true;
      } else {
        console.error('Falha no financiamento da wallet:', fundingResult.message);
        toast.error(`Erro ao financiar wallet: ${fundingResult.message}`);
        return false;
      }
    } catch (error) {
      console.error('Erro ao criar e financiar wallet:', error);
      toast.error('Erro ao criar wallet. Tente novamente.');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);



  const disconnect = useCallback(() => {
    stellarService.clearWalletFromStorage();
    setWallet(null);
    toast.info('Wallet desconectada');
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