import { useMemo } from "react";
import type { StellarWallet } from "./useWallet";
import { Client } from "@/blockchain/lib";
import { Keypair, Networks } from "@stellar/stellar-sdk";

export interface UseProviderReturn {
  contract: () => Client;
  signAndSend: (tx: any, wallet: StellarWallet) => Promise<any>;
}

export const useProvider = (): UseProviderReturn => {
  const CONTRACT_ADDRESS = "CDK2HVUG7226QJFO5JL6S2WWB5V4UNQ3VUPKLKKQ6GWWFCZW7Y3ZAZNJ";
  const SOROBAN_RPC_ENDPOINT = "https://soroban-testnet.stellar.org";

  const contract = () => {
    return new Client({
      contractId: CONTRACT_ADDRESS,
      networkPassphrase: Networks.TESTNET,
      rpcUrl: SOROBAN_RPC_ENDPOINT,
    });
  };

  const signAndSend = async (tx: any, wallet: StellarWallet) => {
    const keypair = Keypair.fromSecret(wallet.secretKey);
    return tx.signAndSend({ keypair });
  };

  return { contract, signAndSend };
};
