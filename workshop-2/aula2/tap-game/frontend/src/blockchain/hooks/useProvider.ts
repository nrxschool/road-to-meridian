import { useMemo } from 'react';
import { Client, Networks, Keypair } from '../lib/src/index';
import type { StellarWallet } from './useWallet';

export interface UseProviderReturn {
  client: Client;
  signAndSend: (tx: any, wallet: StellarWallet) => Promise<any>;
}

export const useProvider = (): UseProviderReturn => {
  const CONTRACT_ID = import.meta.env.VITE_CONTRACT_ADDRESS as string;
  const RPC_URL = import.meta.env.VITE_RPC_ENDPOINT as string;

  if (!CONTRACT_ID || !RPC_URL) {
    throw new Error('Missing environment variables VITE_CONTRACT_ADDRESS/VITE_RPC_ENDPOINT');
  }

  const client = useMemo(() => {
    return new Client({
      contractId: CONTRACT_ID,
      networkPassphrase: Networks.TESTNET,
      rpcUrl: RPC_URL,
    });
  }, [CONTRACT_ID, RPC_URL]);

  const signAndSend = async (tx: any, wallet: StellarWallet) => {
    const keypair = Keypair.fromSecret(wallet.secretKey);
    return tx.signAndSend({ keypair });
  };

  return { client, signAndSend };
};