import { useState } from 'react';

/**
 * Hook to simulate wallet functionalities
 * Provides simulated functionalities for development
 */
export const useWallet = () => {
  // Simulated wallet address
  const mockAddress = 'cosmos1mock123address456789abcdef';
  
  // State to control connection status
  const [isConnected, setIsConnected] = useState(false);

  const connect = () => {
    setIsConnected(true);
  };

  const disconnect = () => {
    setIsConnected(false);
  };

  // Format address for display
  const formatAddress = (address: string) => {
    if (address.length <= 8) return address;
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  return {
    address: isConnected ? mockAddress : undefined,
    isConnected,
    client: null, // No longer need the real client
    connect,
    disconnect,
    formatAddress,
  };
};