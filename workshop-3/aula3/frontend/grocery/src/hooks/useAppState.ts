import { useState } from 'react';
import type { Page } from '../types';

const allEmojis = ['😊', '🎉', '✨', '🎈', '🌟', '💫', '🔥', '💎', '🍀', '🎯', '🏆', '🎪', '🎭', '🎨', '🎵', '🎸', '🍕', '🍔', '🍰', '🍪'];

export const useAppState = () => {
  const [currentPage, setCurrentPage] = useState<Page>('grocery');
  const [showModal, setShowModal] = useState(false);
  const [showEmojiModal, setShowEmojiModal] = useState(false);
  const [editingEmojiIndex, setEditingEmojiIndex] = useState<number | null>(null);
  const [userName, setUserName] = useState('');
  const [selectedEmojis, setSelectedEmojis] = useState(['😊', '🎉', '✨']);
  const [currentNote, setCurrentNote] = useState('');
  const [notes, setNotes] = useState<string[]>([]);

  const getRandomEmojis = () => {
    const shuffled = [...allEmojis].sort(() => 0.5 - Math.random());
    setSelectedEmojis(shuffled.slice(0, 3));
  };

  const handleEmojiClick = (index: number) => {
    setEditingEmojiIndex(index);
    setShowEmojiModal(true);
  };

  const handleEmojiSelect = (emoji: string) => {
    if (editingEmojiIndex !== null) {
      const newEmojis = [...selectedEmojis];
      newEmojis[editingEmojiIndex] = emoji;
      setSelectedEmojis(newEmojis);
    }
    setShowEmojiModal(false);
    setEditingEmojiIndex(null);
  };

  const handleBuyNowClick = () => {
    setShowModal(true);
  };

  const handleModalNext = () => {
    if (userName.trim()) {
      setShowModal(false);
      setCurrentPage('notepad');
    }
  };

  const handleAddNote = () => {
    if (currentNote.trim()) {
      setNotes(prev => [...prev, currentNote.trim()]);
      setCurrentNote('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddNote();
    }
  };

  const navigateToPage = (page: Page) => {
    setCurrentPage(page);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const closeEmojiModal = () => {
    setShowEmojiModal(false);
    setEditingEmojiIndex(null);
  };

  return {
    // State
    currentPage,
    showModal,
    showEmojiModal,
    editingEmojiIndex,
    userName,
    selectedEmojis,
    currentNote,
    notes,
    allEmojis,
    
    // Setters
    setUserName,
    setCurrentNote,
    
    // Handlers
    getRandomEmojis,
    handleEmojiClick,
    handleEmojiSelect,
    handleBuyNowClick,
    handleModalNext,
    handleAddNote,
    handleKeyPress,
    navigateToPage,
    closeModal,
    closeEmojiModal,
  };
};