import React, { useState } from 'react'
import { Wallet, AlertCircle } from 'lucide-react'
import { Button } from '../ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/Card'
import { useWalletStore } from '../../stores/useWalletStore'
import { cn } from '../../lib/utils'

export const WalletConnect: React.FC = () => {
  const { isConnected, publicKey, connect, disconnect } = useWalletStore()
  const [isConnecting, setIsConnecting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleConnect = async () => {
    try {
      setIsConnecting(true)
      setError(null)
      await connect()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to connect wallet')
    } finally {
      setIsConnecting(false)
    }
  }

  const handleDisconnect = () => {
    disconnect()
    setError(null)
  }

  if (isConnected && publicKey) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2">
            <Wallet className="h-6 w-6" />
            Wallet Connected
          </CardTitle>
          <CardDescription>
            Connected to Stellar Network
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-gray-100 border-2 border-gray-300">
            <p className="text-sm font-medium mb-1">Public Key:</p>
            <p className="text-xs font-mono break-all">
              {publicKey.slice(0, 8)}...{publicKey.slice(-8)}
            </p>
          </div>
          <Button 
            onClick={handleDisconnect}
            variant="outline"
            className="w-full"
          >
            Disconnect Wallet
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2">
          <Wallet className="h-6 w-6" />
          Connect Wallet
        </CardTitle>
        <CardDescription>
          Connect your Freighter wallet to interact with the Flipper contract
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <div className="flex items-center gap-2 p-3 bg-red-50 border-2 border-red-200 text-red-800">
            <AlertCircle className="h-4 w-4" />
            <p className="text-sm">{error}</p>
          </div>
        )}
        
        <Button 
          onClick={handleConnect}
          disabled={isConnecting}
          className="w-full"
          size="lg"
        >
          {isConnecting ? 'Connecting...' : 'Connect Freighter Wallet'}
        </Button>
        
        <p className="text-xs text-gray-600 text-center">
          Don't have Freighter? {' '}
          <a 
            href="https://freighter.app/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="underline hover:no-underline"
          >
            Install here
          </a>
        </p>
      </CardContent>
    </Card>
  )
}