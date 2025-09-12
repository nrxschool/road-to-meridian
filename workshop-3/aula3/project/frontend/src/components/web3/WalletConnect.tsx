import React, { useState, useEffect } from 'react'
import { Wallet, AlertCircle, Key, ExternalLink } from 'lucide-react'
import { Button } from '../ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/Card'
import { useWalletStore } from '../../stores/useWalletStore'
import { usePasskey } from '../../hooks/usePasskey'
import { TouchIDSetup } from '../TouchIDSetup'

export const WalletConnect: React.FC = () => {
  const { isConnected, publicKey, connect, disconnect } = useWalletStore()
  const { 
    createPasskey, 
    authenticatePasskey, 
    isLoading, 
    error: passkeyError, 
    credential,
    isSupported,
    clearError 
  } = usePasskey()
  const [username, setUsername] = useState('')
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showTouchIDSetup, setShowTouchIDSetup] = useState(false)

  // Auto-connect when credential is available from saved passkey
  useEffect(() => {
    if (credential && credential.publicKey && !isConnected) {
      connect(credential.publicKey)
    }
  }, [credential, isConnected, connect])

  const handleConnect = async () => {
    try {
      setError(null)
      setShowTouchIDSetup(false)
      clearError()
      await authenticatePasskey()
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to connect wallet'
      if (errorMessage.includes('biometric') || errorMessage.includes('TouchID') || errorMessage.includes('user verification')) {
        setShowTouchIDSetup(true)
      } else {
        setError(errorMessage)
      }
    }
  }

  const handleCreateWallet = async () => {
    if (!username.trim()) {
      setError('Please enter a username')
      return
    }
    
    try {
      setError(null)
      setShowTouchIDSetup(false)
      clearError()
      await createPasskey()
      setShowCreateForm(false)
      setUsername('')
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create wallet'
      if (errorMessage.includes('biometric') || errorMessage.includes('TouchID') || errorMessage.includes('user verification')) {
        setShowTouchIDSetup(true)
      } else {
        setError(errorMessage)
      }
    }
  }

  const handleDisconnect = () => {
    try {
      // Clear wallet store state
      disconnect()
      
      // Clear all passkey related data from localStorage
      localStorage.removeItem('passkey_credential_id')
      localStorage.removeItem('passkey_public_key')
      localStorage.removeItem('flipper_state')
      
      // Clear any errors
      setError(null)
      clearError()
      
      // Reset component state
      setShowCreateForm(false)
      setShowTouchIDSetup(false)
      setUsername('')
    } catch (err) {
      console.error('Error during disconnect:', err)
      setError('Failed to disconnect properly')
    }
  }

  if (isConnected && publicKey) {
    return (
      <Card style={{ width: '100%', maxWidth: '448px' }}>
        <CardHeader style={{ textAlign: 'center' }}>
          <CardTitle style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <Key style={{ height: '24px', width: '24px' }} />
            Passkey Wallet Connected
          </CardTitle>
          <CardDescription>
            Connected to Stellar Network with Passkey
          </CardDescription>
        </CardHeader>
        <CardContent style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{
            padding: '16px',
            backgroundColor: '#f3f4f6',
            border: '2px solid #d1d5db'
          }}>
            <p style={{ fontSize: '14px', fontWeight: '500', marginBottom: '4px' }}>Wallet Address:</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <p style={{
                fontSize: '12px',
                fontFamily: 'monospace',
                wordBreak: 'break-all',
                flex: 1
              }}>
                {publicKey.slice(0, 8)}...{publicKey.slice(-8)}
              </p>
              <Button
                onClick={() => window.open(`https://stellar.expert/explorer/testnet/account/${publicKey}`, '_blank')}
                variant="outline"
                size="sm"
                style={{ padding: '4px 8px', minWidth: 'auto' }}
                title="View on Stellar Expert"
              >
                <ExternalLink style={{ height: '14px', width: '14px' }} />
              </Button>
            </div>
          </div>
          <Button 
            onClick={handleDisconnect}
            variant="outline"
            style={{ width: '100%' }}
          >
            Disconnect Wallet
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card style={{ width: '100%', maxWidth: '448px' }}>
      <CardHeader style={{ textAlign: 'center' }}>
        <CardTitle style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
          <Key style={{ height: '24px', width: '24px' }} />
          Connect Passkey Wallet
        </CardTitle>
        <CardDescription>
          Connect with your passkey or create a new wallet to interact with the Flipper contract
        </CardDescription>
      </CardHeader>
      <CardContent style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {!isSupported && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px',
            backgroundColor: '#fef2f2',
            border: '2px solid #fecaca',
            color: '#991b1b'
          }}>
            <AlertCircle style={{ height: '16px', width: '16px' }} />
            <p style={{ fontSize: '14px' }}>Touch ID não é suportado neste dispositivo/navegador</p>
          </div>
        )}
        
        {(error || passkeyError) && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px',
            backgroundColor: '#fef2f2',
            border: '2px solid #fecaca',
            color: '#991b1b'
          }}>
            <AlertCircle style={{ height: '16px', width: '16px' }} />
            <p style={{ fontSize: '14px' }}>{error || passkeyError}</p>
          </div>
        )}
        
        {showTouchIDSetup && (
          <TouchIDSetup 
            onRetry={() => {
              setShowTouchIDSetup(false)
              setError(null)
            }}
          />
        )}
        
        {showCreateForm ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <input
              type="text"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={{
                padding: '12px',
                border: '2px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px'
              }}
            />
            <div style={{ display: 'flex', gap: '8px' }}>
              <Button 
                onClick={handleCreateWallet}
                disabled={isLoading || !username.trim()}
                style={{ flex: 1 }}
              >
                {isLoading ? 'Creating...' : 'Create Wallet'}
              </Button>
              <Button 
                onClick={() => setShowCreateForm(false)}
                variant="outline"
                style={{ flex: 1 }}
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <Button 
              onClick={handleConnect}
              disabled={isLoading || !isSupported}
              style={{ width: '100%' }}
              size="lg"
            >
              {isLoading ? 'Connecting...' : 'Connect with Touch ID'}
            </Button>
            
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              margin: '8px 0'
            }}>
              <div style={{ flex: 1, height: '1px', backgroundColor: '#e5e7eb' }} />
              <span style={{ fontSize: '12px', color: '#6b7280' }}>or</span>
              <div style={{ flex: 1, height: '1px', backgroundColor: '#e5e7eb' }} />
            </div>
            
            <Button 
              onClick={() => setShowCreateForm(true)}
              variant="outline"
              disabled={!isSupported}
              style={{ width: '100%' }}
              size="lg"
            >
              Create New Wallet
            </Button>
          </div>
        )}
        
        <p style={{
          fontSize: '12px',
          color: '#6b7280',
          textAlign: 'center'
        }}>
          {isSupported 
            ? 'Touch ID wallets use your device\'s biometric authentication for secure access'
            : 'Touch ID requires a compatible device and browser'
          }
        </p>
      </CardContent>
    </Card>
  )
}