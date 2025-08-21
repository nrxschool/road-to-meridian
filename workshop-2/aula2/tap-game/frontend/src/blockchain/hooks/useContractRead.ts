import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useContract } from '../providers/ContractProvider';

export interface Player {
  address: string;
  score: number;
  rank: number;
  nickname: string;
}

export interface UseContractReadReturn {
  isReadLoading: boolean;
  rank: Player[];
  refreshRank: () => void;
}

export const useContractRead = (): UseContractReadReturn => {
  const { contract } = useContract();

  const { data: rank = [], isLoading: isReadLoading, refetch: refreshRank } = useQuery({
    queryKey: ['ranking'],
    queryFn: async () => {
      try {
        const assembledTx = await contract().get_rank();
        return (assembledTx.result || []).map((g, idx) => ({
          address: g.player,
          nickname: g.nickname,
          score: Number(g.score),
          rank: idx + 1,
        }));
      } catch (error) {
        console.error('Error getting ranking:', error);
        toast.error('Failed to get ranking');
        return [];
      }
    },
  });

  return {
    isReadLoading,
    rank,
    refreshRank,
  };
};
