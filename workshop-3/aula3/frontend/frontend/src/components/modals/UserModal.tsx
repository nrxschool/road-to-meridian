import { X, Shuffle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useNavigation, useEmojiOperations } from '../../hooks';
import { useAuthStore, useNavigationStore } from '../../stores';
import type { UserData } from '../../types';

const UserModal = () => {
  const navigate = useNavigate();
  const { showModal, closeModal } = useNavigation();
  const { userName, selectedEmojis, setUserName } = useAuthStore();
  const {
    handleEmojiClick,
    handleRandomEmojis
  } = useEmojiOperations();

  const handlePurchase = () => {
    if (!userName.trim()) return;

    // Criar dados do usuário
    const userData: UserData = {
      userName: userName.trim(),
      selectedEmojis: [...selectedEmojis],
      notes: [],
      createdAt: new Date().toISOString(),
      lastVisit: new Date().toISOString()
    };

    // Salvar no localStorage
    const userKey = `user_${userName.toLowerCase().replace(/\s+/g, '-')}`;
    localStorage.setItem(userKey, JSON.stringify(userData));

    // Fechar modal
    closeModal();

    // Redirecionar para página personalizada
    const username = userName.toLowerCase().replace(/\s+/g, '-');
    navigate(`/${username}`);
  };
  
  if (!showModal) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
        <h2 className="text-2xl font-bold text-center mb-6 text-teal-600">Your Details</h2>
        
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Name:</label>
          <input
            type="text"
            placeholder="Enter your name"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            className="w-full p-4 border-3 border-teal-300 rounded-xl text-lg focus:outline-none focus:border-teal-500"
          />
        </div>

        <div className="mb-8">
          <div className="text-center mb-4">
            <p className="text-lg font-bold text-gray-800 mb-4">Your emojis:</p>
            <button
              onClick={handleRandomEmojis}
              className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-xl font-bold transition-colors flex items-center gap-2 mx-auto shadow-lg"
            >
              <Shuffle size={18} />
              Random
            </button>
          </div>
          
          <div className="flex justify-center gap-6 mt-6">
            {selectedEmojis.map((emoji, index) => (
              <button
                key={index}
                onClick={() => handleEmojiClick(index)}
                className="bg-gradient-to-br from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 p-6 rounded-2xl text-center transition-all duration-200 cursor-pointer shadow-md hover:shadow-lg transform hover:scale-105"
              >
                <div className="text-4xl mb-3">{emoji}</div>
                <span className="text-sm font-semibold text-gray-600">Emoji {index + 1}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={closeModal}
            className="bg-red-500 hover:bg-red-600 text-white p-3 rounded-lg flex items-center justify-center transition-colors shadow-lg"
          >
            <X size={20} />
          </button>
          
          <button
            onClick={handlePurchase}
            disabled={!userName.trim()}
            className="flex-1 bg-teal-500 hover:bg-teal-600 disabled:bg-gray-300 text-white py-3 px-6 rounded-lg font-bold text-lg transition-colors"
          >
            🛒 Comprar Bloco de Notas
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserModal;