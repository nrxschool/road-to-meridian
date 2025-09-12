// Stellar Network Configuration
export const STELLAR_CONFIG = {
  // Testnet RPC URL
  rpcUrl: 'https://soroban-testnet.stellar.org',
  
  // Network passphrase for testnet
  networkPassphrase: 'Test SDF Network ; September 2015',
  
  // Deployed Flipper Contract Address
  contractAddress: 'CDCXOUO6NPG4ZTDE2XHUXXC7NX2DKBYQC4DR76IN2MAOGQFGKAOK67Q6'
}

// Contract method names
export const CONTRACT_METHODS = {
  GET_STATE: 'get',
  FLIP_STATE: 'flip'
} as const

// Helper function to get contract address
export const getContractAddress = (): string => {
  return STELLAR_CONFIG.contractAddress
}

// Helper function to get network config
export const getNetworkConfig = () => {
  return {
    rpcUrl: STELLAR_CONFIG.rpcUrl,
    networkPassphrase: STELLAR_CONFIG.networkPassphrase
  }
}