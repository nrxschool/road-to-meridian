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

// Mock data for leaderboard (será substituído pelo contrato)
const MOCK_LEADERBOARD: Player[] = [
  { address: 'GABC1234567890ABCDEF1234567890ABCDEF123456', score: 9999, rank: 1, nickname: 'CryptoKing' },
  { address: 'GDEF2345678901BCDEF2345678901BCDEF234567A', score: 8888, rank: 2, nickname: 'TapMaster' },
  { address: 'GHIJ3456789012CDEF3456789012CDEF345678BC', score: 7777, rank: 3, nickname: 'SpeedTapper' },
  { address: 'GKLM4567890123DEF4567890123DEF456789CDE', score: 6666, rank: 4, nickname: 'ClickHero' },
  { address: 'GNOP5678901234EF5678901234EF567890DEFG', score: 5555, rank: 5, nickname: 'GamePro' },
];

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { wallet, isConnected, isLoading, createAndFundWallet, disconnect, formatAddress: stellarFormatAddress } = useStellarWallet();
  const [leaderboard, setLeaderboard] = useState<Player[]>(MOCK_LEADERBOARD);
  const [isLoadingRanking, setIsLoadingRanking] = useState(false);

  // Busca o ranking do contrato ao carregar
  useEffect(() => {
    const fetchRanking = async () => {
      try {
        setIsLoadingRanking(true);
        const ranking = await SorobanService.fetchRanking();
        setLeaderboard(ranking);
      } catch (error) {
        console.error('Error fetching ranking:', error);
        // Mantém o mock data em caso de erro
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
      toast.error('Wallet não conectada');
      return false;
    }

    try {
      toast.loading('Enviando score para o contrato...');
      
      // Envia o score para o contrato Soroban
      const txHash = await SorobanService.submitScore(
        wallet.publicKey,
        nickname,
        score,
        gameTime,
        wallet.secretKey
      );
      
      toast.dismiss();
      toast.success(`Score ${score} salvo com sucesso!`);
      
      console.log('Transaction hash:', txHash);
      
      // Atualiza o ranking após enviar o score
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
      toast.error('Erro ao salvar score no contrato');
      return false;
    }
  };

  const getLeaderboard = async (): Promise<Player[]> => {
    // TODO: Buscar do contrato Soroban
    // Por enquanto, retornar mock data
    await new Promise(resolve => setTimeout(resolve, 500));
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