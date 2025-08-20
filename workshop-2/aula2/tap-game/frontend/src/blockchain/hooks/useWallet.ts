import { Keypair } from "@stellar/stellar-sdk";

import { useState, useCallback } from "react";
import {} from "../services/StellarSDK";
import { toast } from "sonner";

export interface UseWalletReturn {
  wallet: StellarWallet | null;
  isConnected: boolean;
  isLoading: boolean;
  createWallet: () => Promise<void>;
  sendToBackend: () => Promise<void>;
  disconnect: () => void;
  formatAddress: (address: string) => string;
}

export const useWallet = (): UseWalletReturn => {
  const WALLET_STORAGE_KEY = "stellar_wallet";
  const BACKEND_URL = "http://localhost:3000";

  const saveWalletToStorage = (wallet: StellarWallet) => {
    try {
      localStorage.setItem(WALLET_STORAGE_KEY, JSON.stringify(wallet));
    } catch (error) {
      console.error("Error saving wallet to storage:", error);
      throw new Error("Failed to save wallet to storage");
    }
  };

  const getWalletFromStorage = () => {
    try {
      const walletData = localStorage.getItem(WALLET_STORAGE_KEY);
      if (!walletData) {
        return null;
      }
      return JSON.parse(walletData) as StellarWallet;
    } catch (error) {
      console.error("Error getting wallet from storage:", error);
      return null;
    }
  };

  const clearWalletFromStorage = () => {
    try {
      localStorage.removeItem(WALLET_STORAGE_KEY);
    } catch (error) {
      console.error("Error clearing wallet from storage:", error);
    }
  };

  const createKeypair = () => {
    const keypair = Keypair.random();
    const wallet: StellarWallet = {
      publicKey: keypair.publicKey(),
      secretKey: keypair.secret(),
    };

    saveWalletToStorage(wallet);
    return wallet;
  };

  const sendPublicKeyToBackend = async (publicKey: string) => {
    try {
      const response = await fetch(`${BACKEND_URL}/testnet/fund/${publicKey}`, {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return {
        success: true,
        message: data.message || "Wallet funded successfully",
        transactionHash: data.transactionHash,
      };
    } catch (error) {
      console.error("Error sending public key to backend:", error);
      return {
        success: false,
        message:
          error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  };

  const [isLoading, setIsLoading] = useState(false);
  const [wallet, setWallet] = useState<StellarWallet | null>(() => {
    const existingWallet = getWalletFromStorage();
    if (existingWallet) {
      return existingWallet;
    } else {
      return createKeypair();
    }
  });

  const createWallet = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    try {
      const newWallet = createKeypair();
      setWallet(newWallet);
      toast.success("Wallet created successfully!");
    } catch (error) {
      console.error("Error creating wallet:", error);
      toast.error("Failed to create wallet");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const sendToBackend = useCallback(async (): Promise<void> => {
    if (!wallet) {
      toast.error("No wallet available");
      return;
    }

    setIsLoading(true);
    try {
      const result: FundingResponse = await sendPublicKeyToBackend(
        wallet.publicKey
      );

      if (result.success) {
        toast.success("Public key sent to backend successfully!");
      } else {
        toast.error(`Backend error: ${result.message}`);
      }
    } catch (error) {
      console.error("Error sending to backend:", error);
      toast.error("Failed to send public key to backend");
    } finally {
      setIsLoading(false);
    }
  }, [wallet]);

  const disconnect = useCallback(() => {
    clearWalletFromStorage();
    setWallet(null);
    toast.info("Wallet desconectada");
  }, []);

  const formatAddress = useCallback((address: string) => {
    return stellarService.formatAddress(address);
  }, []);

  return {
    wallet,
    isLoading,
    isConnected: !!wallet,
    createWallet,
    sendToBackend,
    disconnect,
    formatAddress,
  };
};
