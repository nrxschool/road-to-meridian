import React, { useState } from 'react';
import { useStellarWallet } from '@/blockchain/hooks/useStellarWallet';
import WalletLogin from '@/components/WalletLogin';
import Counter from '@/components/Counter';

const Index = () => {
  const { isConnected } = useStellarWallet();
  const [showGame, setShowGame] = useState(false);

  const handleConnect = () => {
    setShowGame(true);
  };

  const handleDisconnect = () => {
    setShowGame(false);
  };

  const shouldShowGame = isConnected && showGame;

  return (
    <div className="min-h-screen pixel-bg" style={{
      backgroundColor: 'hsl(var(--pixel-black))'
    }}>
      {shouldShowGame ? (
        <Counter onDisconnect={handleDisconnect} />
      ) : (
        <WalletLogin onConnect={handleConnect} />
      )}
    </div>
  );
};

export default Index;
