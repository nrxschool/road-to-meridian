import { useNavigationStore, useEmojiStore } from '../../stores';
import { useEmojiOperations } from '../../hooks';

const EmojiSelector = () => {
  const { showEmojiModal, closeEmojiModal } = useNavigationStore();
  const { allEmojis } = useEmojiStore();
  const { handleEmojiSelect } = useEmojiOperations();
  
  if (!showEmojiModal) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-8 max-w-lg w-full shadow-2xl">
        <h2 className="text-2xl font-bold text-center mb-6 text-teal-600">Choose an Emoji</h2>
        
        <div className="grid grid-cols-5 gap-3 mb-6">
          {allEmojis.map((emoji, index) => (
            <button
              key={index}
              onClick={() => handleEmojiSelect(emoji)}
              className="bg-gray-100 hover:bg-teal-100 p-4 rounded-lg text-center transition-colors text-3xl"
            >
              {emoji}
            </button>
          ))}
        </div>

        <div className="text-center">
          <button
            onClick={closeEmojiModal}
            className="bg-gray-400 hover:bg-gray-500 text-white py-3 px-6 rounded-lg font-bold transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmojiSelector;