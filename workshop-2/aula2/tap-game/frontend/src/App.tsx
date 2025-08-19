import { Toaster } from "sonner";
import { useStellarWallet } from "@/blockchain/hooks/useStellarWallet";
import WalletLogin from "@/components/WalletLogin";
import Play from "@/components/Play";

const App = () => {
  const { isConnected } = useStellarWallet();

  return (
    <>
      <Toaster position="top-center" expand={true} />
      <div className="min-h-screen pixel-bg">
        {isConnected ? (
          <Play onDisconnect={() => {}} />
        ) : (
          <WalletLogin onConnect={() => {}} />
        )}
      </div>
    </>
  );
};

export default App;
