import React from 'react';
import { useAuth } from '@/contexts/StellarContext';

const WalletLogin: React.FC = () => {
  const { isConnected, login, isLoading } = useAuth();

  const handleLogin = async () => {
    await login();
  };

  if (isConnected) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 pixel-bg">
      <div className="w-full max-w-md pixel-border">
        <div className="text-center space-y-8 p-8">
          <div className="mx-auto w-24 h-24 flex items-center justify-center">
            <img 
              src="/logo512x512.png" 
              alt="Logo" 
              className="w-full h-full object-contain"
            />
          </div>
          
          <div>
            <h1 className="text-2xl font-bold pixel-shadow mb-3">
              TAP-TO-EARN
            </h1>
            <div className="text-xs text-yellow-400">
              ▲ BLOCKCHAIN GAME ▲
            </div>
          </div>
          
          <button 
            onClick={handleLogin}
            disabled={isLoading}
            className="w-full h-16 btn-primary pixel-border text-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'CREATING WALLET...' : 'LOG IN'}
          </button>
          
          <div className="text-xs">
            POWERED BY STELLAR
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalletLogin;