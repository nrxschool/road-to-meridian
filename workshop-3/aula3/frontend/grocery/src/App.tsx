import { useAppState } from './hooks/useAppState';
import GroceryPage from './pages/GroceryPage';
import NotepadPage from './pages/NotepadPage';
import NotesListPage from './pages/NotesListPage';
import AnalyticsPage from './pages/AnalyticsPage';

const App = () => {
  const {
    currentPage,
    showModal,
    showEmojiModal,
    userName,
    selectedEmojis,
    currentNote,
    notes,
    allEmojis,
    setUserName,
    setCurrentNote,
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
  } = useAppState();

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'grocery':
         return (
           <GroceryPage
              userName={userName}
              selectedEmojis={selectedEmojis}
              showModal={showModal}
              showEmojiModal={showEmojiModal}
              allEmojis={allEmojis}
              onSetUserName={setUserName}
              onRandomEmojis={getRandomEmojis}
              onEmojiClick={handleEmojiClick}
              onEmojiSelect={handleEmojiSelect}
              onBuyNowClick={handleBuyNowClick}
              onModalNext={handleModalNext}
              onCloseModal={closeModal}
              onCloseEmojiModal={closeEmojiModal}
            />
         );
      case 'notepad':
         return (
           <NotepadPage
              userName={userName}
              selectedEmojis={selectedEmojis}
              currentNote={currentNote}
              notes={notes}
              onSetCurrentNote={setCurrentNote}
              onAddNote={handleAddNote}
              onKeyPress={handleKeyPress}
              onNavigate={navigateToPage}
            />
         );
      case 'notesList':
         return (
           <NotesListPage
              userName={userName}
              selectedEmojis={selectedEmojis}
              notes={notes}
              onNavigate={navigateToPage}
            />
         );
      case 'analytics':
         return (
           <AnalyticsPage
              userName={userName}
              selectedEmojis={selectedEmojis}
              notes={notes}
              onNavigate={navigateToPage}
            />
         );
      default:
        return null;
    }
  };

  return renderCurrentPage();
};

export default App;
