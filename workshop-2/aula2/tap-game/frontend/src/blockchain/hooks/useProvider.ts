import type { StellarWallet } from "./useWallet";
import { Client, networks } from "@/blockchain/lib";
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

    const sendResult = await sorobanServer.sendTransaction(transaction);
    console.log("Send transaction result:", sendResult);

    if (sendResult.status === 'PENDING') {
      let getTxResult;
      while (true) {
        getTxResult = await sorobanServer.getTransaction(sendResult.hash);
        console.log("Get transaction result:", getTxResult);
        if (getTxResult.status !== 'PENDING') {
          break;
        }
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      return getTxResult;
    } else {
      return sendResult;
    }
  };

  return { contract, sorobanServer, signAndSend };
};
