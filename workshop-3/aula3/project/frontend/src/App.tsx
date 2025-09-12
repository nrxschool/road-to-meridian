import React from 'react'
import { WalletConnect } from './components/web3/WalletConnect'
import { FlipperDashboard } from './components/web3/FlipperDashboard'
import { useWalletStore } from './stores/useWalletStore'

function App() {
  const { isConnected } = useWalletStore()

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">
            Stellar Flipper
          </h1>
          <p className="text-gray-600">
            A simple DApp to interact with a Stellar smart contract
          </p>
        </div>
        
        <WalletConnect />
        
        {isConnected && (
          <div className="animate-in slide-in-from-bottom-4 duration-300">
            <FlipperDashboard />
          </div>
        )}
      </div>
    </div>
  )
}

export default App
