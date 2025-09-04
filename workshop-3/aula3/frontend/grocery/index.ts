import React, { useState } from 'react';
import { X, ShoppingCart, Shuffle } from 'lucide-react';

const GroceryLanding = () => {
  const [showModal, setShowModal] = useState(false);
  const [userName, setUserName] = useState('');
  const [selectedEmojis, setSelectedEmojis] = useState(['😊', '🎉', '✨']);

  const allEmojis = ['😊', '🎉', '✨', '🎈', '🌟', '💫', '🔥', '💎', '🍀', '🎯', '🏆', '🎪', '🎭', '🎨', '🎵', '🎸', '🍕', '🍔', '🍰', '🍪'];

  const getRandomEmojis = () => {
    const shuffled = [...allEmojis].sort(() => 0.5 - Math.random());
    setSelectedEmojis(shuffled.slice(0, 3));
  };

  const handleEmojiChange = (index, value) => {
    const newEmojis = [...selectedEmojis];
    newEmojis[index] = value;
    setSelectedEmojis(newEmojis);
  };

  const handleBuyNowClick = () => {
    setShowModal(true);
  };

  const handleModalNext = () => {
    if (userName.trim()) {
      // Aqui você poderia redirecionar para o segundo site
      alert(`Dados coletados!\nNome: ${userName}\nEmojis: ${selectedEmojis.join(', ')}\n\nRedirecionando para o site do notepad...`);
      setShowModal(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-300 to-yellow-400 flex flex-col items-center justify-center p-8">
      <div className="max-w-md w-full text-center">
        <div className="bg-teal-500 text-white p-8 rounded-t-2xl shadow-lg">
          <h1 className="text-6xl font-bold text-yellow-300 mb-4">GROCERY</h1>
        </div>
        
        <div className="bg-white p-8 rounded-b-2xl shadow-lg border-4 border-teal-500">
          <div className="mb-6">
            <input
              type="text"
              placeholder="What do you need?"
              className="w-full p-4 border-3 border-orange-300 rounded-xl text-lg focus:outline-none focus:border-teal-500 transition-colors"
            />
          </div>
          
          <button
            onClick={handleBuyNowClick}
            className="bg-gradient-to-r from-orange-400 to-red-400 hover:from-orange-500 hover:to-red-500 text-white font-bold py-4 px-12 rounded-xl text-xl shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center gap-2 mx-auto"
          >
            <ShoppingCart size={24} />
            Buy Now
          </button>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
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

            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-semibold text-gray-700">Choose your emojis:</p>
                <button
                  onClick={getRandomEmojis}
                  className="bg-purple-400 hover:bg-purple-500 text-white px-4 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2"
                >
                  <Shuffle size={16} />
                  Random
                </button>
              </div>
              
              <div className="space-y-3">
                {selectedEmojis.map((emoji, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <span className="text-sm font-medium text-gray-600 w-16">Emoji {index + 1}:</span>
                    <input
                      type="text"
                      value={emoji}
                      onChange={(e) => handleEmojiChange(index, e.target.value)}
                      className="flex-1 p-3 border-2 border-gray-300 rounded-lg text-center text-2xl focus:outline-none focus:border-teal-500"
                      maxLength={2}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-400 hover:bg-gray-500 text-white p-3 rounded-lg flex items-center justify-center transition-colors"
              >
                <X size={20} />
              </button>
              
              <button
                onClick={handleModalNext}
                disabled={!userName.trim()}
                className="flex-1 bg-teal-500 hover:bg-teal-600 disabled:bg-gray-300 text-white py-3 px-6 rounded-lg font-bold text-lg transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GroceryLanding;