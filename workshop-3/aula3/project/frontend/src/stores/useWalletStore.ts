import { create } from 'zustand'
import type { WalletState } from '../types'

interface WalletStore extends WalletState {
  connect: () => Promise<void>
  disconnect: () => void
  setPublicKey: (publicKey: string) => void
}

export const useWalletStore = create<WalletStore>((set, get) => ({
  isConnected: false,
  publicKey: null,
  network: 'testnet',
  
  connect: async () => {
    try {
      // Check if Freighter is installed
      if (typeof window !== 'undefined' && (window as any).freighter) {
        const { publicKey } = await (window as any).freighter.getPublicKey()
        set({ 
          isConnected: true, 
          publicKey,
          network: await (window as any).freighter.getNetwork() || 'testnet'
        })
      } else {
        throw new Error('Freighter wallet not found. Please install Freighter extension.')
      }
    } catch (error) {
      console.error('Failed to connect wallet:', error)
      throw error
    }
  },
  
  disconnect: () => {
    set({ 
      isConnected: false, 
      publicKey: null 
    })
  },
  
  setPublicKey: (publicKey: string) => {
    set({ publicKey })
  }
}))