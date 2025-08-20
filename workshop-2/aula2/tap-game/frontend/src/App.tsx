import { useWallet } from "./blockchain/hooks/useWallet";
import WalletLogin from "./components/WalletLogin";
import Play from "./components/Play";
import { ToasterProvider } from "./components/ToasterProvider";

const App = () => {
  const { isConnected, disconnect } = useWallet();

  return (
    <ToasterProvider>
      <div className="min-h-screen pixel-bg">
        {isConnected ? (
          <Play onDisconnect={() => disconnect()} />
        ) : (
          <WalletLogin onConnect={() => {}} />
        )}
      </div>
    </ToasterProvider>
  );
};

export default App;
