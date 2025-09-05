import React from 'react';
import { Plus, FileText, Calendar, User } from 'lucide-react';
import { useAuthStore, useNotesStore } from '../stores';
import { useAnalytics } from '../hooks';
import HomeChart from '../components/charts/HomeChart';

const HomePage: React.FC = () => {
  const { userName, selectedEmojis } = useAuthStore();
  const { notes, addNote } = useNotesStore();
  const { totalNotes, totalCharacters, averageCharacters } = useAnalytics();
  const [newNote, setNewNote] = React.useState('');

  const handleAddNote = () => {
    if (newNote.trim()) {
      addNote(newNote.trim());
      setNewNote('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAddNote();
    }
  };

  // Get join date (mock for now)
  const joinDate = new Date('2024-01-15').toLocaleDateString('pt-BR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  // Get last 3 notes for preview
  const recentNotes = notes.slice(-3).reverse();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 pb-20">
      <div className="max-w-4xl mx-auto p-4">
        {/* Header com informações do usuário */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="text-4xl">{selectedEmojis.join('')}</div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">Olá, {userName}! 👋</h1>
                <p className="text-gray-600">Bem-vindo ao seu bloco de notas</p>
              </div>
            </div>
          </div>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{totalNotes}</div>
            <div className="text-gray-600">Notas Criadas</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{totalCharacters}</div>
            <div className="text-gray-600">Caracteres Escritos</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">{joinDate}</div>
            <div className="text-gray-600">Membro Desde</div>
          </div>
        </div>

        {/* Gráfico de Evolução */}
        <HomeChart className="mb-6" />

        {/* Input para nova nota */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">✍️ Adicionar Nova Nota</h2>
          <div className="flex space-x-4">
            <input
              type="text"
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Digite sua nota aqui..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <button
              onClick={handleAddNote}
              disabled={!newNote.trim()}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
            >
              <Plus size={20} />
              <span>Adicionar</span>
            </button>
          </div>
          <p className="text-sm text-gray-500 mt-2">Pressione Enter ou clique em Adicionar para salvar sua nota</p>
        </div>

        {/* Últimas notas (preview) */}
        {notes.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-6 mt-6">
            <h2 className="text-xl font-semibold mb-4">📝 Últimas Notas</h2>
            <div className="space-y-3">
              {recentNotes.map((note: string, index: number) => (
                <div
                  key={index}
                  className="p-3 bg-gray-50 rounded-lg border-l-4 border-green-500"
                >
                  <p className="text-gray-800">{note}</p>
                </div>
              ))}
            </div>
            {notes.length > 3 && (
              <p className="text-center text-gray-500 mt-4">
                E mais {notes.length - 3} notas... Vá para a aba Notas para ver todas.
               </p>
             )}
           </div>
         )}
      </div>
    </div>
  );
};

export default HomePage;