import type { StellarWallet } from "./useWallet";
import { Client, networks } from "@/blockchain/lib/src";
import { Keypair, Transaction, rpc } from "@stellar/stellar-sdk";

export interface UseProviderReturn {
  contract: (publicKey?: string) => Client;
  sorobanServer: rpc.Server;
  signAndSend: (tx: any, wallet: StellarWallet) => Promise<any>;
}

export const useProvider = (): UseProviderReturn => {
  const SOROBAN_RPC_ENDPOINT = "https://soroban-testnet.stellar.org";
  const sorobanServer = new rpc.Server(SOROBAN_RPC_ENDPOINT);

  const contract = (publicKey?: string) => {
    const options: any = {
      contractId: networks.testnet.contractId,
      networkPassphrase: networks.testnet.networkPassphrase,
      rpcUrl: SOROBAN_RPC_ENDPOINT,
    };

    if (publicKey) {
      options.publicKey = publicKey;
    }

    return new Client(options);
  };

  const signAndSend = async (tx: string, wallet: StellarWallet) => {
    const keypair = Keypair.fromSecret(wallet.secretKey);
    const transaction = new Transaction(
      tx,
      networks.testnet.networkPassphrase
    );
    console.log("Signing transaction");
    transaction.sign(keypair);

    const result = await sorobanServer.sendTransaction(transaction);
    console.log("Send transaction result:", result);

    let status = result.status as string
    while (status === "PENDING") {
      const txResult = await sorobanServer.getTransaction(result.hash);
      status = txResult.status as string;
      console.log("Transaction status:", status);
    } 
    await new Promise(resolve => setTimeout(resolve, 2000));

    return result.hash
  };

  return { contract, sorobanServer, signAndSend };
};
