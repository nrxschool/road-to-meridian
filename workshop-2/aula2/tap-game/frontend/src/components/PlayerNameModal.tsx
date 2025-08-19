import React, { useState } from 'react';

interface PlayerNameModalProps {
  isOpen: boolean;
  onSubmit: (nickname: string) => void;
  onClose: () => void;
  score: number;
  gameTime: number;
}

const PlayerNameModal: React.FC<PlayerNameModalProps> = ({
  isOpen,
  onSubmit,
  onClose,
  score,
  gameTime
}) => {
  const [nickname, setNickname] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!nickname.trim()) {
      return;
    }

    setIsSubmitting(true);
    await onSubmit(nickname.trim());
    setIsSubmitting(false);
    setNickname('');
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setNickname('');
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="pixel-border bg-black max-w-md w-full">
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="text-center">
            <h2 className="text-xl font-bold pixel-shadow" style={{
              color: 'hsl(var(--pixel-white))'
            }}>
              GAME OVER!
            </h2>
            <div className="mt-2 text-sm" style={{
              color: 'hsl(var(--pixel-yellow))'
            }}>
              Score: {score} | Tempo: {gameTime}s
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-bold mb-2" style={{
                color: 'hsl(var(--pixel-white))'
              }}>
                SEU NICKNAME:
              </label>
              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                maxLength={20}
                placeholder="Digite seu nome..."
                className="w-full p-3 pixel-border bg-black text-white font-mono text-sm"
                style={{
                  color: 'hsl(var(--pixel-white))',
                  backgroundColor: 'hsl(var(--pixel-black))'
                }}
                disabled={isSubmitting}
                autoFocus
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleClose}
                disabled={isSubmitting}
                className="flex-1 h-12 btn-danger pixel-border font-bold text-sm disabled:opacity-50"
              >
                PULAR
              </button>
              <button
                type="submit"
                disabled={!nickname.trim() || isSubmitting}
                className="flex-1 h-12 btn-primary pixel-border font-bold text-sm disabled:opacity-50"
              >
                {isSubmitting ? 'SALVANDO...' : 'SALVAR'}
              </button>
            </div>
          </form>

          {/* Info */}
          <div className="text-xs text-center" style={{
            color: 'hsl(var(--pixel-white))'
          }}>
            Seu score será salvo no ranking!
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerNameModal;