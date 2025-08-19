import { useState } from 'react';

/**
 * Hook para simular conexão da carteira
 * Fornece funcionalidades simuladas sem dependência real da Abstraxion
 */
export const useWallet = () => {
  // Endereço simulado de carteira
  const mockAddress = 'cosmos1mock123address456789abcdef';
  
  // Estado para controlar se está conectado
  const [isConnected, setIsConnected] = useState(false);

  const connect = () => {
    setIsConnected(true);
  };

  const disconnect = () => {
    setIsConnected(false);
  };

  // Formata o endereço para exibição
  const formatAddress = (address: string) => {
    if (address.length <= 8) return address;
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  return {
    address: isConnected ? mockAddress : undefined,
    isConnected,
    client: null, // Não precisamos mais do cliente real
    connect,
    disconnect,
    formatAddress,
  };
};