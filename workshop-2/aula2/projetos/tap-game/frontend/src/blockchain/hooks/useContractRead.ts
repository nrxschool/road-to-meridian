import { useProvider } from "./useProvider";
import { useState } from "react";
import { toast } from "sonner";

export interface Player {
  address: string;
  score: number;
  rank: number;
  nickname: string;
}

export interface UseContractReadReturn {
  isReadLoading: boolean;
  rank: Player[];
  getRanking: () => Promise<Player[]>;
  refreshRank: () => Promise<void>;
}

export const useContractRead = (): UseContractReadReturn => {
  const [isReadLoading, setIsReadLoading] = useState(false);
  const [rank, setRank] = useState<Player[]>([]);
  const { contract } = useProvider();

  const getRanking = async (): Promise<Player[]> => {
    setIsReadLoading(true);

    try {
      const assembledTx = await contract().get_rank();
      console.log(assembledTx);
      const players = ((await assembledTx.simulate()).result || []).map(
        (g) => ({
          address: g.player,
          nickname: g.nickname,
          score: Number(g.score.toString()),
        })
      );

      const rank = players
        .sort((a, b) => b.score - a.score)
        .map((player, idx) => ({
          ...player,
          rank: idx + 1,
        }));
      console.log(rank);

      setRank(rank);
      return rank;
    } catch (error) {
      console.error("Error getting ranking:", error);
      toast.error("Failed to get ranking");
      return [];
    } finally {
      setIsReadLoading(false);
    }
  };

  const refreshRank = async (): Promise<void> => {
    await getRanking();
  };

  return {
    isReadLoading,
    rank,
    getRanking,
    refreshRank,
  };
};
