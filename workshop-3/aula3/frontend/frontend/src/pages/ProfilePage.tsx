import React from 'react';
import { Settings, Shield, LogOut, Copy, Eye, EyeOff } from 'lucide-react';
import { useAuthStore } from '../stores';
import type { ProfileMenuItem } from '../types';

const ProfilePage: React.FC = () => {
  const { userName, selectedEmojis } = useAuthStore();
  const [showFullAddress, setShowFullAddress] = React.useState(false);

  // Mock Stellar wallet data with more realistic values
  const stellarWallet = {
    address: 'GCKFBEIYTKP6RCZNVPH73XL7XFWTEOAO7EUIYCIMHBFW6FVBD5PQJAHH',
    balance: '2,847.93',
    network: 'Mainnet'
  };

  // Generate a shortened address for display
  const getShortAddress = (address: string) => {
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  const formatAddress = (address: string) => {
    if (showFullAddress) return address;
    return `${address.slice(0, 8)}...${address.slice(-8)}`;
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      // Aqui você pode adicionar uma notificação de sucesso
    } catch (err) {
      console.error('Erro ao copiar:', err);
    }
  };

  const profileMenuItems: ProfileMenuItem[] = [
    {
      id: 'settings',
      label: 'Configurações',
      icon: Settings,
      description: 'Personalize suas preferências'
    },
    {
      id: 'security',
      label: 'Segurança',
      icon: Shield,
      description: 'Gerencie sua segurança e privacidade'
    },
    {
      id: 'logout',
      label: 'Sair',
      icon: LogOut,
      description: 'Desconectar da aplicação'
    }
  ];

  const handleMenuClick = (itemId: string) => {
    switch (itemId) {
      case 'settings':
        // Implementar navegação para configurações
        console.log('Abrir configurações');
        break;
      case 'security':
        // Implementar navegação para segurança
        console.log('Abrir segurança');
        break;
      case 'logout':
        // Implementar logout
        console.log('Fazer logout');
        break;
      default:
        break;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 pb-20">
      <div className="max-w-4xl mx-auto p-4">
        {/* Header do Perfil */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center space-x-4 mb-4">
            <div className="text-6xl">{selectedEmojis.join('')}</div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">{userName}</h1>
              <p className="text-gray-600">Membro desde hoje</p>
            </div>
          </div>
        </div>

        {/* Carteira Stellar */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <span className="mr-2">🌟</span>
            Carteira Stellar
          </h2>
          
          <div className="space-y-4">
            {/* Endereço */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">Endereço</span>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setShowFullAddress(!showFullAddress)}
                    className="p-1 text-gray-500 hover:text-gray-700"
                  >
                    {showFullAddress ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                  <button
                    onClick={() => copyToClipboard(stellarWallet.address)}
                    className="p-1 text-gray-500 hover:text-gray-700"
                  >
                    <Copy size={16} />
                  </button>
                </div>
              </div>
              <p className="font-mono text-sm text-gray-800 break-all">
                {showFullAddress ? stellarWallet.address : getShortAddress(stellarWallet.address)}
              </p>
            </div>

            {/* Saldo */}
            <div className="bg-gray-50 rounded-lg p-4">
              <span className="text-sm font-medium text-gray-600">Saldo</span>
              <p className="text-2xl font-bold text-green-600">
                {stellarWallet.balance} XLM
              </p>
            </div>

            {/* Rede */}
            <div className="bg-gray-50 rounded-lg p-4">
              <span className="text-sm font-medium text-gray-600">Rede</span>
              <p className="text-lg font-semibold text-blue-600">
                <span className={`inline-block w-2 h-2 rounded-full mr-2 ${
                  stellarWallet.network === 'Mainnet' ? 'bg-green-500' : 'bg-yellow-500'
                }`}></span>
                {stellarWallet.network}
              </p>
            </div>
          </div>
        </div>

        {/* Menu de Opções */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Opções</h2>
          <div className="space-y-2">
            {profileMenuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => handleMenuClick(item.id)}
                  className={`w-full flex items-center justify-between p-4 rounded-lg transition-colors hover:bg-gray-50 ${
                    item.id === 'logout' 
                      ? 'text-red-600 hover:bg-red-50' 
                      : 'text-gray-700'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon size={24} />
                    <div className="text-left">
                      <p className="font-medium">{item.label}</p>
                      <p className="text-sm text-gray-500">{item.description}</p>
                    </div>
                  </div>
                  <div className="text-gray-400">›</div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;