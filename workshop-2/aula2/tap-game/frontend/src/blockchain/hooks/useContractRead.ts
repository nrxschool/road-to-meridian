import { useState, useCallback } from 'react';
import { stellarService, Player } from '../services/StellarSDK';
import { toast } from 'sonner';

export interface UseContractReadReturn {
  isLoading: boolean;
  data: Player[];
  getRanking: () => Promise<Player[]>;
  refetch: () => Promise<void>;
}

export const useContractRead = (): UseContractReadReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<Player[]>([]);

  const getRanking = useCallback(async (): Promise<Player[]> => {
    setIsLoading(true);
    try {
      const players = await stellarService.getRankFromContract();
      setData(players);
      return players;
    } catch (error) {
      console.error('Error getting ranking:', error);
      toast.error('Failed to get ranking');
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refetch = useCallback(async (): Promise<void> => {
    await getRanking();
  }, [getRanking]);

  return {
    isLoading,
    data,
    getRanking,
    refetch,
  };
};