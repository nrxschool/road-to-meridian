import { useStellarWallet } from './blockchain/hooks/useStellarWallet';
import WalletLogin from './components/WalletLogin';
import Play from './components/Play';
import { ToasterProvider } from './components/ToasterProvider';

const App = () => {
  const { isConnected } = useStellarWallet();

  return (
    <ToasterProvider>
      <div className="min-h-screen pixel-bg">
        {isConnected ? (
          <Play onDisconnect={() => {}} />
        ) : (
          <WalletLogin onConnect={() => {}} />
        )}
      </div>
    </ToasterProvider>
  );
};

export default App;
