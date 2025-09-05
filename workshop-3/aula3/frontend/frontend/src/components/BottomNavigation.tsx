import React from 'react';
import { Home, FileText, User } from 'lucide-react';
import type { BottomNavPage } from '../types';

interface BottomNavigationProps {
  currentPage: BottomNavPage;
  onPageChange: (page: BottomNavPage) => void;
}

const BottomNavigation: React.FC<BottomNavigationProps> = ({ currentPage, onPageChange }) => {
  const navItems = [
    {
      id: 'home' as BottomNavPage,
      label: 'Home',
      icon: Home,
    },
    {
      id: 'notes' as BottomNavPage,
      label: 'Notas',
      icon: FileText,
    },
    {
      id: 'profile' as BottomNavPage,
      label: 'Perfil',
      icon: User,
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
      <div className="flex justify-around items-center py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onPageChange(item.id)}
              className={`flex flex-col items-center justify-center py-2 px-4 rounded-lg transition-colors ${
                isActive
                  ? 'text-green-600 bg-green-50'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Icon size={24} className="mb-1" />
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNavigation;