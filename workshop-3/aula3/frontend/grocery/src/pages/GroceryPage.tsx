import { ShoppingCart } from 'lucide-react';
import Button from '../components/ui/Button';
import UserModal from '../components/modals/UserModal';
import EmojiSelector from '../components/modals/EmojiSelector';

interface GroceryPageProps {
  showModal: boolean;
  showEmojiModal: boolean;
  userName: string;
  selectedEmojis: string[];
  allEmojis: string[];
  onBuyNowClick: () => void;
  onModalNext: () => void;
  onCloseModal: () => void;
  onCloseEmojiModal: () => void;
  onSetUserName: (name: string) => void;
  onEmojiClick: (index: number) => void;
  onEmojiSelect: (emoji: string) => void;
  onRandomEmojis: () => void;
}

const GroceryPage = ({
  showModal,
  showEmojiModal,
  userName,
  selectedEmojis,
  allEmojis,
  onBuyNowClick,
  onModalNext,
  onCloseModal,
  onCloseEmojiModal,
  onSetUserName,
  onEmojiClick,
  onEmojiSelect,
  onRandomEmojis,
}: GroceryPageProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-300 to-yellow-400 flex flex-col items-center justify-center p-8">
      <div className="max-w-md w-full text-center">
        <div className="bg-teal-500 text-white p-8 rounded-t-2xl shadow-lg">
          <h1 className="text-6xl font-bold text-yellow-300 mb-4">GROCERY</h1>
        </div>
        
        <div className="bg-white p-8 rounded-b-2xl shadow-lg border-4 border-teal-500">
          <Button
            onClick={onBuyNowClick}
            variant="gradient"
            size="lg"
            className="mx-auto"
          >
            <ShoppingCart size={24} />
            Buy Now
          </Button>
        </div>
      </div>

      <UserModal
        isOpen={showModal}
        onClose={onCloseModal}
        onNext={onModalNext}
        userName={userName}
        setUserName={onSetUserName}
        selectedEmojis={selectedEmojis}
        onEmojiClick={onEmojiClick}
        onRandomEmojis={onRandomEmojis}
      />

      <EmojiSelector
        isOpen={showEmojiModal}
        onClose={onCloseEmojiModal}
        onSelect={onEmojiSelect}
        allEmojis={allEmojis}
      />
    </div>
  );
};

export default GroceryPage;