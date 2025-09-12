export interface WalletState {
  isConnected: boolean
  publicKey: string | null
  network: string
}

export interface ContractState {
  currentState: boolean
  isLoading: boolean
  error: string | null
}

export interface FlipperContract {
  state: () => Promise<boolean>
  flip: () => Promise<void>
}