import React from 'react';
import { Search, Calendar, FileText } from 'lucide-react';
import { useNotesStore } from '../stores';

const NotesPage: React.FC = () => {
  const { notes } = useNotesStore();
  const [searchTerm, setSearchTerm] = React.useState('');

  // Filtrar notas baseado no termo de busca
  const filteredNotes = notes.filter((note: string) => 
    note.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (index: number) => {
    // Mock: criar datas baseadas no índice (mais recentes primeiro)
    const date = new Date();
    date.setHours(date.getHours() - index);
    return date.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 pb-20">
      <div className="max-w-4xl mx-auto p-4">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <FileText className="text-blue-600" size={32} />
              <div>
                <h1 className="text-3xl font-bold text-gray-800">Minhas Notas</h1>
                <p className="text-gray-600">{notes.length} nota{notes.length !== 1 ? 's' : ''} criada{notes.length !== 1 ? 's' : ''}</p>
              </div>
            </div>
          </div>

          {/* Barra de busca */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar nas suas notas..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Lista de Notas */}
        {filteredNotes.length === 0 ? (
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            {searchTerm ? (
              <div>
                <Search className="mx-auto text-gray-400 mb-4" size={48} />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">Nenhuma nota encontrada</h3>
                <p className="text-gray-500">Tente buscar por outros termos ou limpe o filtro.</p>
              </div>
            ) : (
              <div>
                <FileText className="mx-auto text-gray-400 mb-4" size={48} />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">Nenhuma nota ainda</h3>
                <p className="text-gray-500">Vá para a aba Home para criar sua primeira nota!</p>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredNotes.map((note: string, index: number) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-200"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <Calendar size={16} />
                    <span>{formatDate(notes.length - 1 - index)}</span>
                  </div>
                  <div className="text-xs text-gray-400">
                    {note.length} caractere{note.length !== 1 ? 's' : ''}
                  </div>
                </div>
                
                <div className="prose max-w-none">
                  <p className="text-gray-800 leading-relaxed">{note}</p>
                </div>
                
                {/* Indicador visual para notas longas */}
                {note.length > 200 && (
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      Nota longa
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Estatísticas no final */}
        {filteredNotes.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-6 mt-6">
            <h3 className="text-lg font-semibold mb-4">📊 Estatísticas</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{filteredNotes.length}</div>
                <div className="text-sm text-gray-600">Notas {searchTerm ? 'encontradas' : 'totais'}</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {filteredNotes.reduce((acc: number, note: string) => acc + note.length, 0)}
                </div>
                <div className="text-sm text-gray-600">Caracteres</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {Math.round(filteredNotes.reduce((acc: number, note: string) => acc + note.length, 0) / filteredNotes.length) || 0}
                </div>
                <div className="text-sm text-gray-600">Média/nota</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {Math.max(...filteredNotes.map((note: string) => note.length), 0)}
                </div>
                <div className="text-sm text-gray-600">Maior nota</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotesPage;