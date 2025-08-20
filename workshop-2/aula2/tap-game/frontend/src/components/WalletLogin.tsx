import React from "react";
import { useWallet } from "../blockchain/hooks/useWallet";

const WalletLogin: React.FC<{ onConnect: () => void; isLoading: boolean }> = ({ onConnect, isLoading }) => {

  return (
    <div className="min-h-screen flex items-center justify-center p-4 pixel-bg">
      <div className="w-full max-w-md pixel-border">
        <div className="text-center space-y-8 p-8">
          <div className="mx-auto w-24 h-24 flex items-center justify-center">
            <img
              src="/logo512x512.png"
              alt="Logo"
              className="w-full h-full object-contain"
            />
          </div>

          <div>
            <h1 className="text-4xl font-bold pixel-shadow mb-4">TAP GAME</h1>
            <p className="text-lg text-gray-300">fast and furious ⚡️</p>
          </div>

          {isLoading ? (
            <div className="w-full h-16 bg-gray-200 rounded-lg overflow-hidden pixel-border">
              <div
                className="h-full bg-blue-500 transition-all duration-300 ease-out animate-pulse"
                style={{ width: "70%" }}
              >
                <div className="h-full flex items-center justify-center text-white font-bold">
                  Connecting...
                </div>
              </div>
            </div>
          ) : (
            <button
              onClick={onConnect}
              className="w-full h-16 btn-primary pixel-border text-xl font-bold"
            >
              Enter
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default WalletLogin;
