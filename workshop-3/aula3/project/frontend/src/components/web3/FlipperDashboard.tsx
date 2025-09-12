import React, { useEffect } from 'react'
import { ToggleLeft, ToggleRight, RefreshCw, AlertCircle } from 'lucide-react'
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
        <CardTitle style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
          {currentState ? (
            <ToggleRight style={{ height: '24px', width: '24px', color: '#059669' }} />
          ) : (
            <ToggleLeft style={{ height: '24px', width: '24px', color: '#9ca3af' }} />
          )}
          Flipper Contract
        </CardTitle>
        <CardDescription>
          Current state: {currentState ? 'ON' : 'OFF'}
        </CardDescription>
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
        
        <div style={{ display: 'flex', gap: '8px' }}>
          <Button 
            onClick={handleFlip}
            disabled={isLoading}
            style={{ flex: 1 }}
            size="lg"
          >
            {isLoading ? 'Flipping...' : 'Flip State'}
          </Button>
          
          <Button 
            onClick={handleRefresh}
            disabled={isLoading}
            variant="outline"
            size="lg"
          >
            <RefreshCw style={{
              height: '16px',
              width: '16px',
              animation: isLoading ? 'spin 1s linear infinite' : 'none'
            }} />
          </Button>
        </div>
        
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
            <p style={{
              fontFamily: 'monospace',
              fontSize: '12px',
              wordBreak: 'break-all'
            }}>
              Contract: {getContractAddress()}
            </p>
          </div>
          <p>Current network: Testnet</p>
        </div>
      </CardContent>
    </Card>
  )
}