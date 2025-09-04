import { create } from 'zustand';
import type { Page } from '../types';

interface NavigationState {
  currentPage: Page;
  showModal: boolean;
  showEmojiModal: boolean;
  editingEmojiIndex: number | null;
  navigateToPage: (page: Page) => void;
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