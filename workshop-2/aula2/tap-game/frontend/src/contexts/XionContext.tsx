import React, { createContext, useContext, ReactNode, useState } from 'react';
import { Player } from '@/blockchain/types/blockchain';

interface AuthContextType {
  // Auth state
  isConnected: boolean;
  login: () => void;
  logout: () => void;
  
  // Mock wallet data
  address: string | undefined;
  formatAddress: (address: string) => string;
  
  // Mock blockchain operations
  saveScore: (score: number) => Promise<boolean>;
  getLeaderboard: () => Promise<Player[]>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock data for demonstration
const MOCK_ADDRESS = 'bypass1234567890abcdef1234567890abcdef12345678';
const MOCK_LEADERBOARD: Player[] = [
  { address: 'bypass1111111111111111111111111111111111111111', score: 9999, rank: 1 },
  { address: 'bypass2222222222222222222222222222222222222222', score: 8888, rank: 2 },
  { address: 'bypass3333333333333333333333333333333333333333', score: 7777, rank: 3 },
  { address: 'bypass4444444444444444444444444444444444444444', score: 6666, rank: 4 },
  { address: 'bypass5555555555555555555555555555555555555555', score: 5555, rank: 5 },
];

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [leaderboard, setLeaderboard] = useState<Player[]>(MOCK_LEADERBOARD);

  const login = () => {
    setIsConnected(true);
  };

  const logout = () => {
    setIsConnected(false);
  };

  const formatAddress = (address: string) => {
    if (address.length <= 8) return address;
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  const saveScore = async (score: number): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Add user's score to leaderboard and re-sort
    const newEntry: Player = {
      address: MOCK_ADDRESS,
      score,
      rank: 0 // Will be calculated after sorting
    };
    
    const updatedLeaderboard = [...leaderboard, newEntry]
      .sort((a, b) => b.score - a.score)
      .map((player, index) => ({
        ...player,
        rank: index + 1
      }))
      .slice(0, 10); // Keep top 10
    
    setLeaderboard(updatedLeaderboard);
    setIsLoading(false);
    
    return true;
  };

  const getLeaderboard = async (): Promise<Player[]> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return leaderboard;
  };

  const value: AuthContextType = {
    isConnected,
    login,
    logout,
    address: isConnected ? MOCK_ADDRESS : undefined,
    formatAddress,
    saveScore,
    getLeaderboard,
    isLoading,
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