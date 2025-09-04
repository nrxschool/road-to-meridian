import { create } from 'zustand';

interface EmojiState {
  allEmojis: string[];
  getAllEmojis: () => string[];
  getRandomEmojis: (count?: number) => string[];
}

const defaultEmojis = [
  '😊', '🎉', '✨', '🎈', '🌟', '💫', '🔥', '💎', 
  '🍀', '🎯', '🏆', '🎪', '🎭', '🎨', '🎵', '🎸', 
  '🍕', '🍔', '🍰', '🍪'
];

export const useEmojiStore = create<EmojiState>((set, get) => ({
  allEmojis: defaultEmojis,
  
  getAllEmojis: () => get().allEmojis,
  
  getRandomEmojis: (count = 3) => {
    const { allEmojis } = get();
    const shuffled = [...allEmojis].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  },
}));