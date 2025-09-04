export type Page = 'grocery' | 'notepad' | 'notesList' | 'analytics';

export interface AppState {
  currentPage: Page;
  showModal: boolean;
  showEmojiModal: boolean;
  editingEmojiIndex: number | null;
  userName: string;
  selectedEmojis: string[];
  currentNote: string;
  notes: string[];
}

export interface EmojiSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (emoji: string) => void;
  allEmojis: string[];
}

export interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNext: () => void;
  userName: string;
  setUserName: (name: string) => void;
  selectedEmojis: string[];
  onEmojiClick: (index: number) => void;
  onRandomEmojis: () => void;
}

export interface PageProps {
  userName: string;
  selectedEmojis: string[];
  notes: string[];
  currentNote: string;
  setCurrentNote: (note: string) => void;
  onAddNote: () => void;
  onNavigate: (page: Page) => void;
}

export interface AnalyticsData {
  name: string;
  avgChars: number;
  lastNoteChars: number;
}