import { useState } from "react";
import { toast } from "sonner";
import { useProvider } from "./useProvider";
import type { StellarWallet } from "./useWallet";

interface UseContractWrite {
  isWriteLoading: boolean;
  sendNewGame: (score: number, nickName: string) => Promise<string>;
}

export const useContractWrite = (wallet: StellarWallet): UseContractWrite => {
  const [isWriteLoading, setIsWriteLoading] = useState(false);
  const { contract, signAndSend } = useProvider();
  

  const sendNewGame = async (
    score: number,
    nickName: string
  ): Promise<string> => {
    const id = toast.loading("Sending transaction...") as string;
    setIsWriteLoading(true);

    try {
      const tx = await contract(wallet.publicKey).new_game({
        player: wallet.publicKey,
        nickname: nickName,
        score,
        game_time: 10,
      })
      
      const result = await signAndSend(tx.toXDR(), wallet)
      
      console.log('Transaction result:', result)
      toast.success("Score successfully saved on contract!", { id });
      return result && result.hash ? result.hash : "Transaction completed";
    } catch (err) {
      console.error(err);
      toast.error("Failed to save score on contract", { id });
      return "";
    } finally {
      setIsWriteLoading(false);
    }
  };

  return {
    isWriteLoading,
    sendNewGame,
  };
};