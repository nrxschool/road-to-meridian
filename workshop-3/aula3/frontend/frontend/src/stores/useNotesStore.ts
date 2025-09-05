import { create } from 'zustand';

interface NotesState {
  notes: string[];
  currentNote: string;
  setCurrentNote: (note: string) => void;
  addNote: (note: string) => void;
  clearCurrentNote: () => void;
  deleteNote: (index: number) => void;
  clearAllNotes: () => void;
  getNotesCount: () => number;
  getAverageNoteLength: () => number;
  getLastNoteLength: () => number;
}

export const useNotesStore = create<NotesState>((set, get) => ({
  notes: [],
  currentNote: '',
  
  setCurrentNote: (note: string) => set({ currentNote: note }),
  
  addNote: (note: string) => {
    const trimmedNote = note.trim();
    if (trimmedNote) {
      set((state) => ({
        notes: [...state.notes, trimmedNote],
        currentNote: ''
      }));
    }
  },
  
  clearCurrentNote: () => set({ currentNote: '' }),
  
  deleteNote: (index: number) => 
    set((state) => ({
      notes: state.notes.filter((_, i) => i !== index)
    })),
  
  clearAllNotes: () => set({ notes: [], currentNote: '' }),
  
  getNotesCount: () => get().notes.length,
  
  getAverageNoteLength: () => {
    const { notes } = get();
    if (notes.length === 0) return 0;
    const totalLength = notes.reduce((acc, note) => acc + note.length, 0);
    return Math.round(totalLength / notes.length);
  },
  
  getLastNoteLength: () => {
    const { notes } = get();
    return notes.length > 0 ? notes[notes.length - 1].length : 0;
  },
}));