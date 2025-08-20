import type { StellarWallet } from "./useWallet";
import { Client, networks } from "@/blockchain/lib";
import { Keypair } from "@stellar/stellar-sdk";

export interface UseProviderReturn {
  contract: () => Client;
  signAndSend: (tx: any, wallet: StellarWallet) => Promise<any>;
}

export const useProvider = (): UseProviderReturn => {
  const SOROBAN_RPC_ENDPOINT = "https://soroban-testnet.stellar.org";

  const contract = () => {
    return new Client({
      contractId: networks.testnet.contractId,
      networkPassphrase: networks.testnet.networkPassphrase,
      rpcUrl: SOROBAN_RPC_ENDPOINT,
    });
  };

  const signAndSend = async (tx: any, wallet: StellarWallet) => {
    const keypair = Keypair.fromSecret(wallet.secretKey);
    return tx.signAndSend({ keypair });
  };

  return { contract, signAndSend };
};
