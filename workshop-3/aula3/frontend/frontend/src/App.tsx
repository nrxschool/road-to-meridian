import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import GroceryPage from './pages/GroceryPage';
import MainApp from './components/MainApp';
import UserPage from './components/UserPage';

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Rota principal - Hero com Buy Now */}
        <Route path="/" element={<GroceryPage />} />
        
        {/* Rota do notepad - sistema interno com navbar */}
        <Route path="/notepad" element={<MainApp />} />
        
        {/* Rotas dinâmicas para páginas de usuário */}
        <Route path="/:username" element={<UserPage />} />
        
        {/* Fallback para rotas não encontradas */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
