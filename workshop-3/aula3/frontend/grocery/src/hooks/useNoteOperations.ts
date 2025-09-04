import { useNotesStore } from '../stores';

export const useNoteOperations = () => {
  const {
    notes,
    currentNote,
    setCurrentNote,
    addNote,
    clearCurrentNote,
    deleteNote,
    clearAllNotes,
    getNotesCount,
    getAverageNoteLength,
    getLastNoteLength,
  } = useNotesStore();

  const handleAddNote = () => {
    if (currentNote.trim()) {
      addNote(currentNote);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddNote();
    }
  };

  const handleNoteChange = (note: string) => {
    setCurrentNote(note);
  };

  return {
    // State
    notes,
    currentNote,
    notesCount: getNotesCount(),
    
    // Actions
    handleAddNote,
    handleKeyPress,
    handleNoteChange,
    deleteNote,
    clearAllNotes,
    clearCurrentNote,
    
    // Computed values
    averageNoteLength: getAverageNoteLength(),
    lastNoteLength: getLastNoteLength(),
  };
};