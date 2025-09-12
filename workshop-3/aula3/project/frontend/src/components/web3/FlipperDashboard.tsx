import React, { useEffect } from 'react'
import { ToggleLeft, ToggleRight, RefreshCw, AlertCircle } from 'lucide-react'
import { Button } from '../ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/Card'
import { useContractStore } from '../../stores/useContractStore'
import { useWalletStore } from '../../stores/useWalletStore'
import { getContractAddress } from '../../lib/stellar'
import { cn } from '../../lib/utils'

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
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle>Contract Dashboard</CardTitle>
          <CardDescription>
            Please connect your wallet to interact with the contract
          </CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2">
          {currentState ? (
            <ToggleRight className="h-6 w-6 text-green-600" />
          ) : (
            <ToggleLeft className="h-6 w-6 text-gray-400" />
          )}
          Flipper Contract
        </CardTitle>
        <CardDescription>
          Current state: {currentState ? 'ON' : 'OFF'}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {error && (
          <div className="flex items-center gap-2 p-3 bg-red-50 border-2 border-red-200 text-red-800">
            <AlertCircle className="h-4 w-4" />
            <p className="text-sm">{error}</p>
          </div>
        )}
        
        <div className="p-6 bg-gray-100 border-2 border-gray-300 text-center">
          <div className="text-4xl font-bold mb-2">
            {currentState ? 'TRUE' : 'FALSE'}
          </div>
          <p className="text-sm text-gray-600">
            Contract State
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button 
            onClick={handleFlip}
            disabled={isLoading}
            className="flex-1"
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
            <RefreshCw className={cn('h-4 w-4', isLoading && 'animate-spin')} />
          </Button>
        </div>
        
        <div className="text-xs text-gray-600 text-center space-y-1">
          <p>Click "Flip State" to toggle the contract state</p>
          <div className="mt-3 p-2 bg-gray-50 border border-gray-200 rounded">
            <p className="font-mono text-xs break-all">
              Contract: {getContractAddress()}
            </p>
          </div>
          <p>Current network: Testnet</p>
        </div>
      </CardContent>
    </Card>
  )
}