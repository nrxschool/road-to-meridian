// Stellar Network Configuration
export const STELLAR_CONFIG = {
  // Testnet RPC URL
  rpcUrl: import.meta.env.VITE_RPC_URL || 'https://soroban-testnet.stellar.org',
  
  // Network passphrase for testnet
  networkPassphrase: import.meta.env.VITE_NETWORK_PASSPHRASE || 'Test SDF Network ; October 2022',
  
  // Deployed Flipper Contract Address
  contractAddress: import.meta.env.VITE_FLIPPER_CONTRACT_ID || 'CDCXOUO6NPG4ZTDE2XHUXXC7NX2DKBYQC4DR76IN2MAOGQFGKAOK67Q6',
  
  // Launchtube Configuration
  launchtubeUrl: import.meta.env.VITE_LAUNCHTUBE_URL || 'https://testnet.launchtube.xyz',
  launchtubeJwt: import.meta.env.VITE_LAUNCHTUBE_JWT
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