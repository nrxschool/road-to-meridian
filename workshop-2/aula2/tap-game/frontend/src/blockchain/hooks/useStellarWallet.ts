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
  downloadSeed: () => void;
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

  const downloadSeed = useCallback(() => {
    if (!wallet) {
      toast.error('Nenhuma wallet encontrada para baixar');
      return;
    }

    const seedData = `Stellar Wallet Seed\n\nPublic Key: ${wallet.publicKey}\nSecret Key: ${wallet.secretKey}\n\nIMPORTANTE: Mantenha esta seed em segurança. Qualquer pessoa com acesso a ela pode controlar sua wallet.\n\nData: ${new Date().toLocaleString()}`;
    
    const blob = new Blob([seedData], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `stellar-wallet-seed-${Date.now()}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(url);
    toast.success('Seed da wallet baixada com sucesso!');
  }, [wallet]);

  const disconnect = useCallback(() => {
    // Baixar seed antes de remover do localStorage
    if (wallet) {
      downloadSeed();
    }
    
    stellarService.clearWalletFromStorage();
    setWallet(null);
    toast.info('Wallet desconectada e seed baixada');
  }, [wallet, downloadSeed]);

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
    downloadSeed,
  };
};