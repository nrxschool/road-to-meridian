import { create } from 'zustand'
import type { ContractState } from '../types'
import { getContractAddress, CONTRACT_METHODS } from '../lib/stellar'
import { launchtubeService } from '../lib/launchtube'
import { PasskeySigner } from '../lib/passkey-signer'
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
    const { isLoading, currentState } = get()
    if (isLoading) return

    set({ isLoading: true, error: null })

    try {
      const contractAddress = getContractAddress()
      const credentialId = localStorage.getItem('passkey_credential_id')
      if (!credentialId) {
        throw new Error('No passkey credential found')
      }

      const walletStore = useWalletStore.getState()
      if (!walletStore.publicKey) {
        throw new Error('No public key available')
      }

      // Initialize PasskeySigner with the stored credential
      const signer = new PasskeySigner({
        credentialId: credentialId!,
        publicKey: walletStore.publicKey
      })

      // Para demonstração, vamos simular a transação
      // Em um ambiente real, você construiria a transação XDR usando Stellar SDK
      console.log('Flipping contract state for address:', contractAddress)
      
      // Simular delay de transação
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Update local state
      const newState = !currentState
      set({ currentState: newState })
      localStorage.setItem(`contract_state_${contractAddress}`, JSON.stringify(newState))
      
      console.log('State flipped successfully to:', newState)
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
      
      // Como o Launchtube não tem endpoint para leitura de estado,
      // vamos simular o estado do contrato localmente
      const storedState = localStorage.getItem(`contract_state_${contractAddress}`)
      if (storedState !== null) {
        set({ currentState: JSON.parse(storedState) })
      } else {
        // Estado inicial padrão
        set({ currentState: false })
        localStorage.setItem(`contract_state_${contractAddress}`, 'false')
      }
      
    } catch (error) {
      console.error('Fetch state error:', error)
      set({ currentState: false })
    } finally {
      set({ isLoading: false })
    }
  }
}))