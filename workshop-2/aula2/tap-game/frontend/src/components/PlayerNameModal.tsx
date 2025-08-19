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
            <div className="text-xl font-bold" style={{
              color: 'hsl(var(--pixel-yellow))'
            }}>
              Score: {score}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-bold mb-2" style={{
                color: 'hsl(var(--pixel-white))'
              }}>
                YOUR NICKNAME:
              </label>
              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                maxLength={20}
                placeholder="Enter your name..."
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
            <div className="flex justify-center">
              <button
                type="submit"
                disabled={!nickname.trim() || isSubmitting}
                className="w-full h-12 btn-primary pixel-border font-bold text-sm disabled:opacity-50"
              >
                {isSubmitting ? 'SAVING...' : 'SAVE'}
              </button>
            </div>
          </form>


        </div>
      </div>
    </div>
  );
};

export default PlayerNameModal;