import { create } from 'zustand'
import type { WalletState } from '../types'

interface WalletStore extends WalletState {
  connect: (publicKey: string) => void
  disconnect: () => void
  setPublicKey: (publicKey: string) => void
}

export const useWalletStore = create<WalletStore>((set, get) => ({
  isConnected: false,
  publicKey: null,
  network: 'testnet',
  
  connect: (publicKey: string) => {
    set({ 
      isConnected: true, 
      publicKey,
      network: 'testnet'
    })
  },
  
  disconnect: () => {
    set({ 
      isConnected: false, 
      publicKey: null 
    })
  },
  
  setPublicKey: (publicKey: string) => {
    set({ 
      publicKey,
      isConnected: !!publicKey
    })
  }
}))