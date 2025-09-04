import { useNavigationStore, useAuthStore } from '../stores';
import type { Page } from '../types';

export const useNavigation = () => {
  const {
    currentPage,
    showModal,
    showEmojiModal,
    navigateToPage,
    openModal,
    closeModal,
    closeEmojiModal,
  } = useNavigationStore();
  
  const { userName } = useAuthStore();

  const handleBuyNowClick = () => {
    openModal();
  };

  const handleModalNext = () => {
    if (userName.trim()) {
      closeModal();
      navigateToPage('notepad');
    }
  };

  const handleNavigateToPage = (page: Page) => {
    navigateToPage(page);
  };

  return {
    // State
    currentPage,
    showModal,
    showEmojiModal,
    
    // Actions
    handleBuyNowClick,
    handleModalNext,
    handleNavigateToPage,
    navigateToPage: handleNavigateToPage,
    closeModal,
    closeEmojiModal,
  };
};