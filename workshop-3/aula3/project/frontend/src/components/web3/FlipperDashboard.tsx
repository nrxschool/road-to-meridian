import React, { useEffect } from 'react'
import { AlertCircle } from 'lucide-react'
import { Button } from '../ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/Card'
import { useContractStore } from '../../stores/useContractStore'
import { useWalletStore } from '../../stores/useWalletStore'
import { getContractAddress } from '../../lib/stellar'

export const FlipperDashboard: React.FC = () => {
  const { isConnected } = useWalletStore()
  const { 
    currentState, 
    isLoading, 
    error, 
    flipState, 
    fetchState 
  } = useContractStore()

  useEffect(() => {
    if (isConnected) {
      fetchState()
    }
  }, [isConnected, fetchState])

  const handleFlip = async () => {
    await flipState()
  }

  const handleRefresh = async () => {
    await fetchState()
  }

  if (!isConnected) {
    return (
      <Card style={{ width: '100%', maxWidth: '448px' }}>
        <CardHeader style={{ textAlign: 'center' }}>
          <CardTitle>Contract Dashboard</CardTitle>
          <CardDescription>
            Please connect your wallet to interact with the contract
          </CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card style={{ width: '100%', maxWidth: '448px' }}>
      <CardHeader style={{ textAlign: 'center' }}>
        <CardTitle>
          Flipper Contract
        </CardTitle>
      </CardHeader>
      
      <CardContent style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {error && (
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
            <p style={{ fontSize: '14px' }}>{error}</p>
          </div>
        )}
        
        <div style={{
          padding: '24px',
          backgroundColor: '#f3f4f6',
          border: '2px solid #d1d5db',
          textAlign: 'center'
        }}>
          <div style={{
            fontSize: '36px',
            fontWeight: 'bold',
            marginBottom: '8px'
          }}>
            {currentState ? 'TRUE' : 'FALSE'}
          </div>
          <p style={{
            fontSize: '14px',
            color: '#6b7280'
          }}>
            Contract State
          </p>
        </div>
        
        <Button 
          onClick={handleFlip}
          disabled={isLoading}
          style={{ width: '100%' }}
          size="lg"
        >
          {isLoading ? 'Flipping...' : 'Flip State'}
        </Button>
        
        <div style={{
          fontSize: '12px',
          color: '#6b7280',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          gap: '4px'
        }}>
          <p>Click "Flip State" to toggle the contract state</p>
          <div style={{
            marginTop: '12px',
            padding: '8px',
            backgroundColor: '#f9fafb',
            border: '1px solid #e5e7eb',
            borderRadius: '4px'
          }}>
            <a 
              href={`https://stellar.expert/explorer/testnet/contract/${getContractAddress()}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontFamily: 'monospace',
                fontSize: '12px',
                wordBreak: 'break-all',
                color: '#2563eb',
                textDecoration: 'underline'
              }}
            >
              Contract: {getContractAddress()}
            </a>
          </div>
          <p>Current network: Testnet</p>
        </div>
      </CardContent>
    </Card>
  )
}