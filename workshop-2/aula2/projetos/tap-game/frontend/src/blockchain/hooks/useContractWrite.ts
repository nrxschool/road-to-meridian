import { useState } from "react";
import { toast } from "sonner";
import { useProvider } from "./useProvider";
import type { StellarWallet } from "./useWallet";

interface UseContractWrite {
  isWriteLoading: boolean;
  sendNewGame: (score: number, nickName: string) => Promise<void>;
}

export const useContractWrite = (wallet: StellarWallet): UseContractWrite => {
  const [isWriteLoading, setIsWriteLoading] = useState(false);
  const { contract, signAndSend } = useProvider();

  const sendNewGame = async (score: number, nickName: string) => {
    const id = toast.loading("Sending transaction...") as string;
    setIsWriteLoading(true);

    try {
      const tx = await contract(wallet.publicKey).new_game({
        player: wallet.publicKey,
        nickname: nickName,
        score,
        game_time: 10,
      });

      const hash = await signAndSend(tx.toXDR(), wallet);

      toast.success("Score successfully saved on contract!", {
        id,
        duration: Infinity,
        dismissible: true,
        closeButton: true,
        action: {
          label: "View on Explorer →",
          onClick: () =>
            window.open(
              `https://stellar.expert/explorer/testnet/tx/${hash}`,
              "_blank",
              "noopener,noreferrer"
            ),
        },
      });
    } catch (err) {
      console.error(err);
      toast.error("Failed to save score on contract", { id });
    } finally {
      setIsWriteLoading(false);
    }
  };

  return {
    isWriteLoading,
    sendNewGame,
  };
};
