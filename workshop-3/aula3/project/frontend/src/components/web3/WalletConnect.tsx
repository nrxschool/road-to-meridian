import React, { useState, useEffect } from 'react'
import { Wallet, AlertCircle, Key } from 'lucide-react'
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

  useEffect(() => {
    // Try to reconnect on component mount
    const tryReconnect = async () => {
      const savedCredentialId = localStorage.getItem('passkey_credential_id')
      const savedPublicKey = localStorage.getItem('passkey_public_key')
      if (savedCredentialId && savedPublicKey) {
        connect(savedPublicKey)
      }
    }
    tryReconnect()
  }, [connect])

  // Auto-connect when credential is available
  useEffect(() => {
    if (credential && !isConnected) {
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
    disconnect()
    localStorage.removeItem('passkey_credential_id')
    localStorage.removeItem('passkey_public_key')
    setError(null)
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
            <p style={{ fontSize: '14px', fontWeight: '500', marginBottom: '4px' }}>Contract Address:</p>
            <p style={{
              fontSize: '12px',
              fontFamily: 'monospace',
              wordBreak: 'break-all'
            }}>
              {publicKey.slice(0, 8)}...{publicKey.slice(-8)}
            </p>
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