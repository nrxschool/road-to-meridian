import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { UserPageProps, UserData, Note } from '../types';
import { useNavigationStore } from '../stores/useNavigationStore';
import NotesChart from './charts/NotesChart';

const UserPage: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [currentNote, setCurrentNote] = useState('');
  const { setCurrentPage } = useNavigationStore();

  useEffect(() => {
    if (!username) {
      navigate('/');
      return;
    }

    // Carregar dados do usuário do localStorage
    const savedUserData = localStorage.getItem(`user_${username}`);
    if (savedUserData) {
      const parsedData: UserData = JSON.parse(savedUserData);
      // Atualizar última visita
      parsedData.lastVisit = new Date().toISOString();
      setUserData(parsedData);
      localStorage.setItem(`user_${username}`, JSON.stringify(parsedData));
    } else {
      // Usuário não encontrado, redirecionar para grocery
      navigate('/');
    }

    // Atualizar página atual no store
    setCurrentPage(username);
  }, [username, navigate, setCurrentPage]);

  const handleAddNote = () => {
    if (!userData || !currentNote.trim()) return;

    const newNote: Note = {
      id: Date.now().toString(),
      content: currentNote.trim(),
      timestamp: new Date().toISOString()
    };

    const updatedUserData: UserData = {
      ...userData,
      notes: [...userData.notes, newNote],
      lastVisit: new Date().toISOString()
    };

    setUserData(updatedUserData);
    localStorage.setItem(`user_${username}`, JSON.stringify(updatedUserData));
    setCurrentNote('');
  };

  const handleBackToGrocery = () => {
    navigate('/');
  };

  if (!userData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando página do usuário...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="text-4xl">
                {userData.selectedEmojis.join('')}
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">
                  Olá, {userData.userName}! 👋
                </h1>
                <p className="text-gray-600">
                  Bem-vindo à sua página personalizada
                </p>
              </div>
            </div>
            <button
              onClick={handleBackToGrocery}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              🏪 Voltar ao Grocery
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{userData.notes.length}</div>
            <div className="text-gray-600">Notas Criadas</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {userData.notes.reduce((acc, note) => acc + note.content.length, 0)}
            </div>
            <div className="text-gray-600">Caracteres Escritos</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">
              {new Date(userData.createdAt).toLocaleDateString('pt-BR')}
            </div>
            <div className="text-gray-600">Membro Desde</div>
          </div>
        </div>

        {/* Add Note Section */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">✍️ Adicionar Nova Nota</h2>
          <div className="flex space-x-4">
            <input
              type="text"
              value={currentNote}
              onChange={(e) => setCurrentNote(e.target.value)}
              placeholder="Digite sua nota aqui..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              onKeyPress={(e) => e.key === 'Enter' && handleAddNote()}
            />
            <button
              onClick={handleAddNote}
              disabled={!currentNote.trim()}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              Adicionar
            </button>
          </div>
        </div>

        {/* Charts Section */}
        <NotesChart userData={userData} />

        {/* Notes List */}
        <div className="bg-white rounded-lg shadow-lg p-6 mt-6">
          <h2 className="text-xl font-semibold mb-4">📝 Suas Notas</h2>
          {userData.notes.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <div className="text-4xl mb-2">📝</div>
              <p>Você ainda não tem notas.</p>
              <p>Adicione sua primeira nota acima!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {userData.notes.map((note, index) => (
                <div
                  key={note.id}
                  className="p-4 bg-gray-50 rounded-lg border-l-4 border-green-500"
                >
                  <div className="flex justify-between items-start">
                    <p className="text-gray-800 flex-1">{note.content}</p>
                    <div className="text-xs text-gray-500 ml-4 text-right">
                      <div>Nota #{index + 1}</div>
                      <div>{new Date(note.timestamp).toLocaleString('pt-BR')}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserPage;