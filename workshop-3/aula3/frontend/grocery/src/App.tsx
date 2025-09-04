import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useNavigationStore } from './stores';
import GroceryPage from './pages/GroceryPage';
import NotepadPage from './pages/NotepadPage';
import NotesListPage from './pages/NotesListPage';
import AnalyticsPage from './pages/AnalyticsPage';
import UserPage from './components/UserPage';
import { useEffect } from 'react';

// Componente wrapper para páginas internas que usa o sistema Zustand
const InternalPageWrapper = () => {
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
        return <GroceryPage />; // Fallback para grocery
    }
  };

  return renderCurrentPage();
};

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Rota principal - sistema interno com Zustand */}
        <Route path="/" element={<InternalPageWrapper />} />
        
        {/* Rotas dinâmicas para páginas de usuário */}
        <Route path="/:username" element={<UserPage />} />
        
        {/* Fallback para rotas não encontradas */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
