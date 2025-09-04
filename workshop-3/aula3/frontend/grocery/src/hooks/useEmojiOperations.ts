import { useAuthStore, useEmojiStore, useNavigationStore } from '../stores';

export const useEmojiOperations = () => {
  const { selectedEmojis, updateEmoji, getRandomEmojis } = useAuthStore();
  const { getAllEmojis } = useEmojiStore();
  const { editingEmojiIndex, openEmojiModal, closeEmojiModal } = useNavigationStore();

  const allEmojis = getAllEmojis();

  const handleEmojiClick = (index: number) => {
    openEmojiModal(index);
  };

  const handleEmojiSelect = (emoji: string) => {
    if (editingEmojiIndex !== null) {
      updateEmoji(editingEmojiIndex, emoji);
    }
    closeEmojiModal();
  };

  const handleRandomEmojis = () => {
    getRandomEmojis();
  };

  return {
    // State
    selectedEmojis,
    allEmojis,
    editingEmojiIndex,
    
    // Actions
    handleEmojiClick,
    handleEmojiSelect,
    handleRandomEmojis,
    updateEmoji,
  };
};