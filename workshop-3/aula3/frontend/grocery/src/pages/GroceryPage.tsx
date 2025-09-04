import { ShoppingCart } from 'lucide-react';
import Button from '../components/ui/Button';
import UserModal from '../components/modals/UserModal';
import EmojiSelector from '../components/modals/EmojiSelector';
import { useNavigation } from '../hooks';

const GroceryPage = () => {
  const { handleBuyNowClick } = useNavigation();
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-300 to-yellow-400 flex flex-col items-center justify-center p-8">
      <div className="max-w-md w-full text-center">
        <div className="bg-teal-500 text-white p-8 rounded-t-2xl shadow-lg">
          <h1 className="text-6xl font-bold text-yellow-300 mb-4">GROCERY</h1>
        </div>
        
        <div className="bg-white p-8 rounded-b-2xl shadow-lg border-4 border-teal-500">
          <Button
            onClick={handleBuyNowClick}
            variant="gradient"
            size="lg"
            className="mx-auto"
          >
            <ShoppingCart size={24} />
            Buy Now
          </Button>
        </div>
      </div>

      <UserModal />
      <EmojiSelector />
    </div>
  );
};

export default GroceryPage;