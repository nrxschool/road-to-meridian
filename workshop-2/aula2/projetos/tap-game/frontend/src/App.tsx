import { useWallet } from "./blockchain/hooks/useWallet";
import WalletLogin from "./components/WalletLogin";
import Play from "./components/Play";
import { ToasterProvider } from "./components/ToasterProvider";

const App = () => {
  const { isConnected, disconnect, connect, isLoading, wallet } = useWallet();

  return (
    <ToasterProvider>
      <div className="min-h-screen pixel-bg">
        {isConnected ? (
          <Play onDisconnect={() => disconnect()} wallet={wallet} />
        ) : (
          <WalletLogin onConnect={connect} isLoading={isLoading} />
        )}
      </div>
    </ToasterProvider>
  );
};

export default App;
