import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/StellarContext";
import { Player } from "@/blockchain/types/blockchain";
import { toast } from "sonner";
import PlayerNameModal from "./PlayerNameModal";

/**
 * Tap-to-Earn Game - 8-bit Minimalist Style
 * Click game with countdown timer
 */
const Counter: React.FC = () => {
  const {
    address,
    logout,
    formatAddress,
    saveScore,
    getLeaderboard,
    isLoading,
  } = useAuth();
  const [count, setCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);
  const [gameActive, setGameActive] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [finalScore, setFinalScore] = useState<number | null>(null);
  const [gameTime, setGameTime] = useState(0);
  const [showNameModal, setShowNameModal] = useState(false);
  const [leaderboard, setLeaderboard] = useState<Player[]>([]);

  useEffect(() => {
    const loadData = async () => {
      const players = await getLeaderboard();
      setLeaderboard(players);
    };
    loadData();
  }, [address, getLeaderboard]);

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

  const endGame = useCallback(() => {
    setGameActive(false);
    setFinalScore(count);
    setGameTime(10 - timeLeft);
    setShowNameModal(true);
  }, [count, timeLeft]);

  const handleSaveScore = useCallback(
    async (nickname: string) => {
      const gameTimeUsed = 10 - timeLeft;
      const success = await saveScore(count, nickname, gameTimeUsed);

      if (success) {
        const players = await getLeaderboard();
        setLeaderboard(players);
      }

      setShowNameModal(false);
    },
    [count, timeLeft, saveScore, getLeaderboard]
  );

  const handleCloseModal = useCallback(() => {
    setShowNameModal(false);
  }, []);

  const startGame = () => {
    setCount(0);
    setTimeLeft(10);
    setGameActive(true);
    setGameStarted(true);
    setFinalScore(null);
  };

  const resetGame = () => {
    setCount(0);
    setTimeLeft(10);
    setGameActive(false);
    setGameStarted(false);
    setFinalScore(null);
  };

  const handleClick = () => {
    if (gameActive) {
      setCount((prev) => prev + 1);
    }
  };

  return (
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
                onClick={logout}
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
                {isLoading ? (
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
                  disabled={isLoading}
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
                          <span>{player.nickname || "Anonymous"}</span>
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

      {/* Modal to capture player name */}
      <PlayerNameModal
        isOpen={showNameModal}
        onSubmit={handleSaveScore}
        onClose={handleCloseModal}
        score={finalScore || 0}
        gameTime={gameTime}
      />
    </div>
  );
};

export default Counter;
