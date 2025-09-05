export type Page = 'grocery' | 'notepad' | 'notesList' | 'analytics' | 'home' | 'notes' | 'profile';
export type DynamicPage = Page | string; // Suporte para páginas dinâmicas como '/joao'
export type BottomNavPage = 'home' | 'notes' | 'profile';

export interface AppState {
  currentPage: DynamicPage;
  showModal: boolean;
  showEmojiModal: boolean;
  editingEmojiIndex: number | null;
  userName: string;
  selectedEmojis: string[];
  currentNote: string;
  notes: string[];
}

export interface Note {
  content: string;
  timestamp: string;
  id: string;
}

export interface UserData {
  userName: string;
  selectedEmojis: string[];
  notes: Note[];
  createdAt: string;
  lastVisit: string;
}

export interface UserPageProps {
  username: string;
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
  onNavigate: (page: DynamicPage) => void;
}

export interface AnalyticsData {
  name: string;
  avgChars: number;
  lastNoteChars: number;
}

export interface StellarWallet {
  publicKey: string;
  shortKey: string;
  balance?: string;
  isConnected: boolean;
}

export interface ProfileMenuItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  description: string;
}