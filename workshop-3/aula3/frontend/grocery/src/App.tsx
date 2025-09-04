import { useNavigationStore } from './stores';
import GroceryPage from './pages/GroceryPage';
import NotepadPage from './pages/NotepadPage';
import NotesListPage from './pages/NotesListPage';
import AnalyticsPage from './pages/AnalyticsPage';

const App = () => {
  const { currentPage } = useNavigationStore();

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'grocery':
        return <GroceryPage />;
      case 'notepad':
        return <NotepadPage />;
      case 'notesList':
        return <NotesListPage />;
      case 'analytics':
        return <AnalyticsPage />;
      default:
        return null;
    }
  };

  return renderCurrentPage();
};

export default App;
