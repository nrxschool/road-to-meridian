import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Player } from '@/blockchain/types/blockchain';
import { useStellarWallet } from '@/blockchain/hooks/useStellarWallet';
import { SorobanService } from '@/services/SorobanService';
import { toast } from 'sonner';

interface AuthContextType {
  // Auth state
  isConnected: boolean;
  login: () => Promise<void>;
  logout: () => void;
  
  // Stellar wallet data
  address: string | undefined;
  formatAddress: (address: string) => string;
  
  // Blockchain operations
  saveScore: (score: number, nickname: string, gameTime: number) => Promise<boolean>;
  getLeaderboard: () => Promise<Player[]>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);



export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { wallet, isConnected, isLoading, createAndFundWallet, disconnect, formatAddress: stellarFormatAddress } = useStellarWallet();
  const [leaderboard, setLeaderboard] = useState<Player[]>([]);
  const [isLoadingRanking, setIsLoadingRanking] = useState(false);

  // Fetch ranking from contract on load
  useEffect(() => {
    const fetchRanking = async () => {
      try {
        setIsLoadingRanking(true);
        const ranking = await SorobanService.fetchRanking();
        setLeaderboard(ranking);
      } catch (error) {
        console.error('Error fetching ranking:', error);
      } finally {
        setIsLoadingRanking(false);
      }
    };

    fetchRanking();
  }, []);

  const login = async (): Promise<void> => {
    await createAndFundWallet();
  };

  const logout = (): void => {
    disconnect();
  };

  const formatAddress = (addr: string): string => {
    return stellarFormatAddress(addr);
  };

  const saveScore = async (score: number, nickname: string, gameTime: number): Promise<boolean> => {
    if (!wallet?.publicKey || !wallet?.secretKey) {
      toast.error('Wallet not connected');
      return false;
    }

    try {
      toast.loading('Submitting score to contract...');
      
      const txHash = await SorobanService.submitScore(
        wallet.publicKey,
        nickname,
        score,
        gameTime,
        wallet.secretKey
      );
      
      toast.dismiss();
      toast.success(`Score ${score} saved successfully!`);
      
      console.log('Transaction hash:', txHash);
      
      try {
        const updatedRanking = await SorobanService.fetchRanking();
        setLeaderboard(updatedRanking);
      } catch (error) {
        console.error('Error updating ranking:', error);
      }
      
      return true;
    } catch (error) {
      toast.dismiss();
      console.error('Error saving score:', error);
      toast.error('Failed to save score to contract');
      return false;
    }
  };

  const getLeaderboard = async (): Promise<Player[]> => {
    return leaderboard;
  };

  const value: AuthContextType = {
    isConnected,
    login,
    logout,
    address: wallet?.publicKey,
    formatAddress,
    saveScore,
    getLeaderboard,
    isLoading: isLoading || isLoadingRanking,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};