// This file provides backward compatibility during refactoring
// Uses new modular hooks internally

import { useAuthStore } from '../stores';
import { useNoteOperations } from './useNoteOperations';
import { useEmojiOperations } from './useEmojiOperations';
import { useNavigation } from './useNavigation';

export const useAppState = () => {
  // Use new modular hooks
  const { userName, setUserName } = useAuthStore();
  const noteOps = useNoteOperations();
  const emojiOps = useEmojiOperations();
  const navigation = useNavigation();

  return {
    // Navigation state
    currentPage: navigation.currentPage,
    showModal: navigation.showModal,
    showEmojiModal: navigation.showEmojiModal,
    
    // User state
    userName,
    selectedEmojis: emojiOps.selectedEmojis,
    
    // Notes state
    currentNote: noteOps.currentNote,
    notes: noteOps.notes,
    
    // Emoji state
    allEmojis: emojiOps.allEmojis,
    
    // Setters
    setUserName,
    setCurrentNote: noteOps.handleNoteChange,
    
    // Handlers
    getRandomEmojis: emojiOps.handleRandomEmojis,
    handleEmojiClick: emojiOps.handleEmojiClick,
    handleEmojiSelect: emojiOps.handleEmojiSelect,
    handleBuyNowClick: navigation.handleBuyNowClick,
    handleModalNext: navigation.handleModalNext,
    handleAddNote: noteOps.handleAddNote,
    handleKeyPress: noteOps.handleKeyPress,
    navigateToPage: navigation.navigateToPage,
    closeModal: navigation.closeModal,
    closeEmojiModal: navigation.closeEmojiModal,
  };
};