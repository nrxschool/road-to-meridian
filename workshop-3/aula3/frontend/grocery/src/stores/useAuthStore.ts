import { create } from 'zustand';

interface AuthState {
  userName: string;
  selectedEmojis: string[];
  setUserName: (name: string) => void;
  setSelectedEmojis: (emojis: string[]) => void;
  updateEmoji: (index: number, emoji: string) => void;
  getRandomEmojis: () => void;
  reset: () => void;
}

const allEmojis = ['😊', '🎉', '✨', '🎈', '🌟', '💫', '🔥', '💎', '🍀', '🎯', '🏆', '🎪', '🎭', '🎨', '🎵', '🎸', '🍕', '🍔', '🍰', '🍪'];

const getRandomEmojisArray = (): string[] => {
  const shuffled = [...allEmojis].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, 3);
};

export const useAuthStore = create<AuthState>((set) => ({
  userName: '',
  selectedEmojis: ['😊', '🎉', '✨'],
  
  setUserName: (name: string) => set({ userName: name }),
  
  setSelectedEmojis: (emojis: string[]) => set({ selectedEmojis: emojis }),
  
  updateEmoji: (index: number, emoji: string) => 
    set((state) => {
      const newEmojis = [...state.selectedEmojis];
      newEmojis[index] = emoji;
      return { selectedEmojis: newEmojis };
    }),
  
  getRandomEmojis: () => set({ selectedEmojis: getRandomEmojisArray() }),
  
  reset: () => set({ userName: '', selectedEmojis: ['😊', '🎉', '✨'] }),
}));