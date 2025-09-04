import { useNotesStore } from '../stores';
import type { AnalyticsData } from '../types';

export const useAnalytics = () => {
  const { notes, getAverageNoteLength, getLastNoteLength } = useNotesStore();

  const getAnalyticsData = (): AnalyticsData[] => {
    return notes.map((note, index) => {
      const notesUpToIndex = notes.slice(0, index + 1);
      const avgChars = Math.round(
        notesUpToIndex.reduce((acc, n) => acc + n.length, 0) / (index + 1)
      );
      
      return {
        name: `Nota ${index + 1}`,
        avgChars,
        lastNoteChars: note.length,
      };
    });
  };

  const getTotalNotes = () => notes.length;
  
  const getTotalCharacters = () => 
    notes.reduce((acc, note) => acc + note.length, 0);
  
  const getAverageCharacters = () => {
    if (notes.length === 0) return 0;
    return Math.round(getTotalCharacters() / notes.length);
  };
  
  const getLongestNote = () => {
    if (notes.length === 0) return { note: '', length: 0, index: -1 };
    let longest = { note: notes[0], length: notes[0].length, index: 0 };
    
    notes.forEach((note, index) => {
      if (note.length > longest.length) {
        longest = { note, length: note.length, index };
      }
    });
    
    return longest;
  };
  
  const getShortestNote = () => {
    if (notes.length === 0) return { note: '', length: 0, index: -1 };
    let shortest = { note: notes[0], length: notes[0].length, index: 0 };
    
    notes.forEach((note, index) => {
      if (note.length < shortest.length) {
        shortest = { note, length: note.length, index };
      }
    });
    
    return shortest;
  };

  return {
    // Data
    analyticsData: getAnalyticsData(),
    
    // Statistics
    totalNotes: getTotalNotes(),
    totalCharacters: getTotalCharacters(),
    averageCharacters: getAverageCharacters(),
    longestNote: getLongestNote(),
    shortestNote: getShortestNote(),
    
    // Store methods
    currentAverageLength: getAverageNoteLength(),
    lastNoteLength: getLastNoteLength(),
  };
};