import React, { useState, useEffect, useCallback } from "react";
import { useContractWrite } from "../blockchain/hooks/useContractWrite";
import { useContractRead } from "../blockchain/hooks/useContractRead";
import { toast } from "sonner";
import { StellarWallet } from "@/blockchain/hooks/useWallet";


interface Player {
  address: string;
  score: number;
  rank: number;
  nickname: string;
}

interface PlayProps {
  onDisconnect: () => void;
}

/**
 * Tap-to-Earn Game - Versão Minimalista
 * Jogo de cliques com timer de 10 segundos
 */
const Play: React.FC<PlayProps & { wallet: StellarWallet }> = ({
  onDisconnect,
  wallet,
}) => {
  const { getRanking, refreshRank, data: leaderboard, isReadLoading }  = useContractRead();
  const { sendNewGame, isWriteLoading } = useContractWrite(wallet);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameActive, setGameActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(10);
  const [count, setCount] = useState(0);
  const [showNicknameModal, setShowNicknameModal] = useState(false);
  const [nickname, setNickname] = useState("");

  // Carregar ranking do smartcontract
  useEffect(() => {
    getRanking();
  }, [getRanking]);

  // Timer do jogo
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (gameActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0 && gameActive) {
      endGame();
    }
    return () => clearInterval(interval);
  }, [gameActive, timeLeft]);

  const saveScore = async () => {
    if (nickname) {
      sendNewGame(count, nickname);
      setShowNicknameModal(false);
    } else {
      setShowNicknameModal(true);
    }
  };

  const endGame = useCallback(async () => {
    setGameActive(false);
    setShowNicknameModal(true);
  }, []);

  const startGame = () => {
    setCount(0);
    setTimeLeft(10);
    setGameActive(true);
    setGameStarted(true);
  };

  const resetGame = () => {
    setCount(0);
    setTimeLeft(10);
    setGameActive(false);
    setGameStarted(false);
  };

  const handleClick = () => {
    if (gameActive) {
      setCount((prev) => prev + 1);
    }
  };

  return (
    <>
    <div
      className="min-h-screen flex items-center justify-center p-4 pixel-bg"
      style={{
        backgroundColor: "hsl(var(--pixel-black))",
      }}
    >
      <div className="w-full max-w-sm">
        <div
          className="pixel-border"
          style={{
            backgroundColor: "hsl(var(--pixel-black))",
          }}
        >
          <div className="p-6 text-center space-y-6">
            {/* Header com botão X */}
            <div className="flex justify-between items-center">
              <h1
                className="text-3xl font-bold pixel-shadow"
                style={{
                  color: "hsl(var(--pixel-white))",
                }}
              >
                TAP GAME
              </h1>
              <button
                onClick={onDisconnect}
                className="w-10 h-10 flex items-center justify-center pixel-border btn-danger text-lg font-bold"
              >
                ×
              </button>
            </div>

            {gameStarted && (
              <div
                className="text-2xl font-bold"
                style={{
                  color: "hsl(var(--pixel-yellow))",
                }}
              >
                Time: {timeLeft}s
              </div>
            )}

            <div
              className="pixel-border p-4"
              style={{
                backgroundColor: "hsl(var(--pixel-white))",
                color: "hsl(var(--pixel-black))",
              }}
            >
              <div className="text-5xl font-bold">{count}</div>
              <div className="text-sm mt-1">Score</div>
            </div>

            {!gameStarted ? (
              <button
                onClick={startGame}
                className="w-full h-16 btn-success pixel-border text-xl font-bold"
              >
                Start Game
              </button>
            ) : gameActive ? (
              <button
                onClick={handleClick}
                className="w-48 h-48 btn-danger pixel-border text-4xl font-bold rounded-full mx-auto"
              >
                TAP
              </button>
            ) : (
              <div className="space-y-4">
                {isWriteLoading ? (
                  <div
                    className="text-lg animate-pulse"
                    style={{
                      color: "hsl(var(--pixel-yellow))",
                    }}
                  >
                    Saving...
                  </div>
                ) : (
                  <div
                    className="text-lg font-bold"
                    style={{
                      color: "hsl(var(--pixel-green))",
                    }}
                  >
                    Score saved!
                  </div>
                )}
                <button
                  onClick={startGame}
                  disabled={isWriteLoading}
                  className="w-full h-16 btn-warning pixel-border text-xl font-bold disabled:opacity-50"
                >
                  Play Again
                </button>
              </div>
            )}

            <div className="space-y-3">
              <h2
                className="text-xl font-bold pixel-shadow"
                style={{
                  color: "hsl(var(--pixel-white))",
                }}
              >
                Rank
              </h2>

              <div className="space-y-2">
                {leaderboard.length > 0 ? (
                  leaderboard.slice(0, 5).map((player, index) => {
                    return (
                      <div
                        key={`${player.address}-${player.rank}-${index}`}
                        className="pixel-border p-3"
                        style={{
                          backgroundColor: "#606060",
                          color: "#ffffff",
                        }}
                      >
                        <div className="text-sm font-bold flex justify-between">
                          <span>#{player.rank}</span>
                          <span>{player.score} pts</span>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div
                    className="pixel-border p-3"
                    style={{
                      backgroundColor: "#606060",
                      color: "#ffffff",
                    }}
                  >
                    <div className="text-sm font-bold text-center">
                      Loading ranking...
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* Modal de Nickname */}
    {showNicknameModal && (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div 
          className="pixel-border p-6 w-full max-w-sm"
          style={{
            backgroundColor: "hsl(var(--pixel-black))",
          }}
        >
          <div className="text-center space-y-4">
            <h2 
              className="text-2xl font-bold pixel-shadow"
              style={{
                color: "hsl(var(--pixel-yellow))",
              }}
            >
              CONGRATS!
            </h2>
            <h3
              className="text-xl font-bold"
              style={{
                color: "hsl(var(--pixel-white))",
              }}
            >
              {count} Score!
            </h3>
            
            <input
              type="text"
              placeholder="enter your nickname"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              className="w-full p-3 pixel-border text-center"
              style={{
                backgroundColor: "hsl(var(--pixel-white))",
                color: "hsl(var(--pixel-black))",
              }}
            />
            <button
              onClick={saveScore}
              disabled={isWriteLoading}
              className="w-full h-12 btn-success pixel-border text-lg font-bold disabled:opacity-50"
            >
              Save onchain!
            </button>
          </div>
        </div>
      </div>
    )}
    </>
  );
};

export default Play;
