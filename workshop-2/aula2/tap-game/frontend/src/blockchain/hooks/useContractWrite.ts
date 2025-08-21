import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useContract } from '../providers/ContractProvider';
import type { StellarWallet } from './useWallet';

interface UseContractWrite {
  isWriteLoading: boolean;
  sendNewGame: (score: number, nickName: string) => Promise<string>;
}

export const useContractWrite = (wallet: StellarWallet): UseContractWrite => {
  const { contract, signAndSend } = useContract();

  const { mutateAsync: sendNewGame, isPending: isWriteLoading } = useMutation({
    mutationFn: async ({ score, nickName }: { score: number; nickName: string }) => {
      const id = toast.loading('Sending transaction...') as string;
      try {
        const tx = await contract(wallet.publicKey).new_game({
          player: wallet.publicKey,
          nickname: nickName,
          score,
          game_time: 10,
        });
        const result = await signAndSend(tx, wallet);
        console.log('Transaction result:', result);
        toast.success('Score successfully saved on contract!', { id });
        return result && result.hash ? result.hash : 'Transaction completed';
      } catch (err) {
        console.error(err);
        toast.error('Failed to save score on contract', { id });
        throw err;
      }
    },
  });

  return {
    isWriteLoading,
    sendNewGame: (score, nickName) => sendNewGame({ score, nickName }),
  };
};
