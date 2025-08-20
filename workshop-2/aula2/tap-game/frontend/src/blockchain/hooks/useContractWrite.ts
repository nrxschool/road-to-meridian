import { useState, useCallback } from 'react';
import { stellarService, StellarWallet } from '../services/StellarSDK';
import { toast } from 'sonner';

export interface UseContractWriteReturn {
  isLoading: boolean;
  sendGameResult: (wallet: StellarWallet, score: number, gameTime: number) => Promise<boolean>;
}

export const useContractWrite = (): UseContractWriteReturn => {
  const [isLoading, setIsLoading] = useState(false);

  const sendGameResult = useCallback(async (wallet: StellarWallet, score: number, gameTime: number): Promise<boolean> => {
    if (!wallet) {
      toast.error('No wallet available');
      return false;
    }
    
    setIsLoading(true);
    try {
      const success = await stellarService.sendGameResultToContract(wallet, score, gameTime);
      
      if (success) {
        toast.success('Game result sent successfully!');
      } else {
        toast.error('Failed to send game result');
      }
      
      return success;
    } catch (error) {
      console.error('Error sending game result:', error);
      toast.error('Failed to send game result');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    isLoading,
    sendGameResult,
  };
};