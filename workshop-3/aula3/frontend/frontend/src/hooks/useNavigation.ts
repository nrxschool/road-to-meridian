import { useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();

  const handleBuyNowClick = () => {
    openModal();
  };

  const handleModalNext = () => {
    if (userName.trim()) {
      closeModal();
      // Redirecionar para a página do notepad
      navigate('/notepad');
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