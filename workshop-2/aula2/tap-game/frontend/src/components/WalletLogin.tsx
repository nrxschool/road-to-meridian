import React from 'react';
import { useAuth } from '@/contexts/XionContext';

const WalletLogin: React.FC = () => {
  const { isConnected, login, isLoading } = useAuth();

  const handleLogin = async () => {
    await login();
  };

  if (isConnected) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 pixel-bg" style={{
      backgroundColor: 'hsl(var(--pixel-black))'
    }}>
      <div className="w-full max-w-md pixel-border" style={{
        backgroundColor: 'hsl(var(--pixel-black))'
      }}>
        <div className="text-center space-y-8 p-8">
          {/* Logo */}
          <div className="mx-auto w-24 h-24 flex items-center justify-center">
            <img 
              src="/logo512x512.png" 
              alt="Logo" 
              className="w-full h-full object-contain"
            />
          </div>
          
          {/* Título */}
          <div>
            <h1 className="text-2xl font-bold pixel-shadow mb-3" style={{
              color: 'hsl(var(--pixel-white))'
            }}>
              TAP-TO-EARN
            </h1>
            <div className="text-xs" style={{
              color: 'hsl(var(--pixel-yellow))'
            }}>
              ▲ BLOCKCHAIN GAME ▲
            </div>
          </div>
          
          {/* Descrição */}
          <div className="text-sm" style={{
            color: 'hsl(var(--pixel-white))'
          }}>
            BYPASS LOGIN
          </div>
          
          {/* Botão de conexão */}
          <button 
            onClick={handleLogin}
            disabled={isLoading}
            className="w-full h-16 btn-primary pixel-border text-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              boxShadow: '4px 4px 0px hsl(var(--pixel-black))'
            }}
          >
            {isLoading ? 'CRIANDO WALLET...' : 'CONNECT WALLET'}
          </button>
          
          {/* Footer */}
          <div className="text-xs" style={{
            color: 'hsl(var(--pixel-white))'
          }}>
            POWERED BY BYPASS
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalletLogin;