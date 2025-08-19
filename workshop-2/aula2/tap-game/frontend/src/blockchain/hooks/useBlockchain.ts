import { useState, useCallback } from "react";
import { Player } from "../types/blockchain";
import { toast } from "sonner";

// Mock data para o leaderboard
const mockLeaderboard: Player[] = [
  { address: "cosmos1abc123def456", score: 87, rank: 1 },
  { address: "cosmos1xyz789uvw321", score: 65, rank: 2 },
  { address: "cosmos1pqr456stu789", score: 54, rank: 3 },
  { address: "cosmos1lmn987opq654", score: 42, rank: 4 },
  { address: "cosmos1hij321klm654", score: 36, rank: 5 },
];

/**
 * Hook para simular interações com a blockchain
 * Fornece funcionalidades simuladas sem dependência real da blockchain
 */
export const useBlockchain = () => {
  const [isLoading, setIsLoading] = useState(false);
  
  // Simula salvar a pontuação
  const saveScore = useCallback(
    async (score: number) => {
      setIsLoading(true);
      
      // Simula um delay de rede
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      try {
        // Simula sucesso com 90% de chance
        if (Math.random() > 0.1) {
          return true;
        } else {
          toast.error("Falha ao salvar pontuação");
          return false;
        }
      } catch (error) {
        console.error("Erro ao salvar pontuação:", error);
        toast.error("Falha ao salvar pontuação");
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // Simula obter o leaderboard
  const getLeaderboard = useCallback(async (): Promise<Player[]> => {
    // Simula um delay de rede
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Retorna o leaderboard mockado
    return [...mockLeaderboard];
  }, []);

  // Simula obter o total de jogos
  const totalGames = useCallback(async (): Promise<number> => {
    // Simula um delay de rede
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Retorna um número aleatório entre 100 e 500
    return Math.floor(Math.random() * 400) + 100;
  }, []);

  return {
    isLoading,
    saveScore,
    getLeaderboard,
    totalGames,
  };
};
