import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { useProvider } from './useProvider';

export interface Player {
  address: string;
  score: number;
  rank: number;
  nickname: string;
}

export interface UseContractReadReturn {
  isReadLoading: boolean;
  data: Player[];
  getRanking: () => Promise<Player[]>;
  refreshRank: () => Promise<void>;
}

export const useContractRead = (): UseContractReadReturn => {
  const [isReadLoading, setIsReadLoading] = useState(false);
  const [data, setData] = useState<Player[]>([]);
  const { contract } = useProvider();

  const getRanking = useCallback(async (): Promise<Player[]> => {
    setIsReadLoading(true);

    try {
      const assembledTx = await contract().get_rank();
      const rank = (assembledTx.result || []).map((g, idx) => ({
        address: g.player,
        nickname: g.nickname,
        score: Number(g.score),
        rank: idx + 1,
      }));

      setData(rank);
      return rank;
    } catch (error) {
      console.error('Error getting ranking:', error);
      toast.error('Failed to get ranking');
      return [];
    } finally {
      setIsReadLoading(false);
    }
  }, [contract]);

  const refreshRank = useCallback(async (): Promise<void> => {
    await getRanking();
  }, [getRanking]);

  return {
    isReadLoading,
    data,
    getRanking,
    refreshRank,
  };
};
