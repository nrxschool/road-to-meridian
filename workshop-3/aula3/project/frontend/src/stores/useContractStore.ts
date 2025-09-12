import { create } from 'zustand'
import type { ContractState } from '../types'
import { getContractAddress, CONTRACT_METHODS } from '../lib/stellar'
import { useWalletStore } from './useWalletStore'

interface ContractStore extends ContractState {
  setState: (state: boolean) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  flipState: () => Promise<void>
  fetchState: () => Promise<void>
}

export const useContractStore = create<ContractStore>((set, get) => ({
  currentState: false,
  isLoading: false,
  error: null,
  
  setState: (state: boolean) => {
    set({ currentState: state })
  },
  
  setLoading: (loading: boolean) => {
    set({ isLoading: loading })
  },
  
  setError: (error: string | null) => {
    set({ error })
  },
  
  flipState: async () => {
    try {
      set({ isLoading: true, error: null })
      
      const walletStore = useWalletStore.getState()
      if (!walletStore.isConnected || !walletStore.publicKey) {
        throw new Error('Wallet not connected')
      }
      
      const contractAddress = getContractAddress()
      const currentState = get().currentState
      
      console.log(`Flipping contract state for address: ${contractAddress}`)
      console.log(`Current state: ${currentState}, flipping to: ${!currentState}`)
      
      // TODO: Implement actual passkey transaction signing
      // For now, simulate the flip with a delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Flip the local state
      set({ currentState: !currentState })
      
    } catch (error) {
      console.error('Flip state error:', error)
      set({ error: error instanceof Error ? error.message : 'Failed to flip state' })
    } finally {
      set({ isLoading: false })
    }
  },
  
  fetchState: async () => {
    try {
      set({ isLoading: true, error: null })
      
      const contractAddress = getContractAddress()
      
      console.log(`Fetching contract state from address: ${contractAddress}`)
      console.log(`Method: ${CONTRACT_METHODS.GET_STATE}`)
      
      // TODO: Implement actual contract state fetching with passkey
      // For now, simulate fetching with a delay
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Simulate random state for demo purposes
      const simulatedState = Math.random() > 0.5
      set({ currentState: simulatedState })
      
    } catch (error) {
      console.error('Fetch state error:', error)
      set({ error: error instanceof Error ? error.message : 'Failed to fetch state' })
    } finally {
      set({ isLoading: false })
    }
  }
}))