import React from 'react'
import { WalletConnect } from './components/web3/WalletConnect'
import { FlipperDashboard } from './components/web3/FlipperDashboard'
import { useWalletStore } from './stores/useWalletStore'

function App() {
  const { isConnected } = useWalletStore()

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#ffffff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '16px'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '448px',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px'
      }}>
        <div style={{
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px'
        }}>
          <h1 style={{
            fontSize: '30px',
            fontWeight: 'bold',
            letterSpacing: '-0.025em',
            margin: 0
          }}>
            Stellar Flipper
          </h1>
          <p style={{
            color: '#6b7280',
            margin: 0
          }}>
            A simple DApp to interact with a Stellar smart contract
          </p>
        </div>
        
        <WalletConnect />
        
        {isConnected && (
          <div style={{
            animation: 'slideInFromBottom 0.3s ease-out'
          }}>
            <FlipperDashboard />
          </div>
        )}
      </div>
    </div>
  )
}

export default App
