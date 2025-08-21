import React, { createContext, useContext } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Client, networks } from '@/blockchain/lib';
import { rpc } from '@stellar/stellar-sdk';

import type { StellarWallet } from '../hooks/useWallet';

type ContractContextType = {
  contract: (publicKey?: string) => Client;
  sorobanServer: rpc.Server;
  signAndSend: (xdr: string, wallet: StellarWallet) => Promise<any>;
};

const ContractContext = createContext<ContractContextType | undefined>(undefined);

export const ContractProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const queryClient = new QueryClient();

  const SOROBAN_RPC_ENDPOINT = 'https://soroban-testnet.stellar.org';
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

  const signAndSend = async (xdr: string, wallet: StellarWallet) => {
    // Implementation same as before, using Keypair and transaction signing
    // (copy from useProvider)
    const { Keypair, Transaction } = await import('@stellar/stellar-sdk');
    const keypair = Keypair.fromSecret(wallet.secretKey);
    const transaction = new Transaction(xdr, networks.testnet.networkPassphrase);
    transaction.sign(keypair);
    const result = await sorobanServer.sendTransaction(transaction);
    return result;
  };

  const value = { contract, sorobanServer, signAndSend };

  return (
    <ContractContext.Provider value={value}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </ContractContext.Provider>
  );
};

export const useContract = () => {
  const context = useContext(ContractContext);
  if (!context) {
    throw new Error('useContract must be used within a ContractProvider');
  }
  return context;
};