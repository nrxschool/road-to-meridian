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
            <h1 className="text-4xl font-bold pixel-shadow mb-4">
              TAP GAME
            </h1>
            <p className="text-lg text-gray-300">
              Tap fast!⚡️
            </p>
          </div>
          
          <button 
            onClick={handleLogin}
            disabled={isLoading}
            className="w-full h-16 btn-primary pixel-border text-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Connecting...' : 'Enter'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default WalletLogin;