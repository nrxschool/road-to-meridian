import { create } from 'zustand';
import type { Page, DynamicPage } from '../types';

interface NavigationState {
  currentPage: DynamicPage;
  showModal: boolean;
  showEmojiModal: boolean;
  editingEmojiIndex: number | null;
  navigateToPage: (page: Page) => void;
  setCurrentPage: (page: DynamicPage) => void;
  openModal: () => void;
  closeModal: () => void;
  openEmojiModal: (index?: number) => void;
  closeEmojiModal: () => void;
  reset: () => void;
}

export const useNavigationStore = create<NavigationState>((set) => ({
  currentPage: 'grocery',
  showModal: false,
  showEmojiModal: false,
  editingEmojiIndex: null,
  
  navigateToPage: (page: Page) => set({ currentPage: page }),
  
  setCurrentPage: (page: DynamicPage) => set({ currentPage: page }),
  
  openModal: () => set({ showModal: true }),
  
  closeModal: () => set({ showModal: false }),
  
  openEmojiModal: (index?: number) => 
    set({ 
      showEmojiModal: true, 
      editingEmojiIndex: index ?? null 
    }),
  
  closeEmojiModal: () => 
    set({ 
      showEmojiModal: false, 
      editingEmojiIndex: null 
    }),
  
  reset: () => 
    set({ 
      currentPage: 'grocery',
      showModal: false,
      showEmojiModal: false,
      editingEmojiIndex: null
    }),
}));