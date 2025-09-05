import React from 'react';
import BottomNavigation from './BottomNavigation';
import HomePage from '../pages/HomePage';
import NotesPage from '../pages/NotesPage';
import ProfilePage from '../pages/ProfilePage';
import type { BottomNavPage } from '../types';

const MainApp: React.FC = () => {
  const [currentPage, setCurrentPage] = React.useState<BottomNavPage>('home');

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage />;
      case 'notes':
        return <NotesPage />;
      case 'profile':
        return <ProfilePage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="relative">
      {renderCurrentPage()}
      
      <BottomNavigation 
        currentPage={currentPage} 
        onPageChange={setCurrentPage} 
      />
    </div>
  );
};

export default MainApp;