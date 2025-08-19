import React from 'react';
import { useAuth } from '@/contexts/XionContext';
import WalletLogin from '@/components/WalletLogin';
import Counter from '@/components/Counter';

const Index = () => {
  const { isConnected } = useAuth();

  return (
    <div className="min-h-screen pixel-bg" style={{
      backgroundColor: 'hsl(var(--pixel-black))'
    }}>
      {isConnected ? <Counter /> : <WalletLogin />}
    </div>
  );
};

export default Index;
