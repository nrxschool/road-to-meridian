import React, { useState } from 'react';
import { X, ShoppingCart, Shuffle, Plus, BookOpen, TrendingUp } from 'lucide-react';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

type Page = 'grocery' | 'notepad' | 'notesList' | 'analytics';

const App = () => {
  const [currentPage, setCurrentPage] = useState<Page>('grocery');
  const [showModal, setShowModal] = useState(false);
  const [showEmojiModal, setShowEmojiModal] = useState(false);
  const [editingEmojiIndex, setEditingEmojiIndex] = useState<number | null>(null);
  const [userName, setUserName] = useState('');
  const [selectedEmojis, setSelectedEmojis] = useState(['😊', '🎉', '✨']);
  const [currentNote, setCurrentNote] = useState('');
  const [notes, setNotes] = useState<string[]>([]);
  const [animationParent] = useAutoAnimate();

  const allEmojis = ['😊', '🎉', '✨', '🎈', '🌟', '💫', '🔥', '💎', '🍀', '🎯', '🏆', '🎪', '🎭', '🎨', '🎵', '🎸', '🍕', '🍔', '🍰', '🍪'];

  const getRandomEmojis = () => {
    const shuffled = [...allEmojis].sort(() => 0.5 - Math.random());
    setSelectedEmojis(shuffled.slice(0, 3));
  };

  const handleEmojiClick = (index: number) => {
    setEditingEmojiIndex(index);
    setShowEmojiModal(true);
  };

  const handleEmojiSelect = (emoji: string) => {
    if (editingEmojiIndex !== null) {
      const newEmojis = [...selectedEmojis];
      newEmojis[editingEmojiIndex] = emoji;
      setSelectedEmojis(newEmojis);
    }
    setShowEmojiModal(false);
    setEditingEmojiIndex(null);
  };



  const handleBuyNowClick = () => {
    setShowModal(true);
  };

  const handleModalNext = () => {
    if (userName.trim()) {
      setShowModal(false);
      setCurrentPage('notepad');
    }
  };

  const handleAddNote = () => {
    if (currentNote.trim()) {
      setNotes(prev => [...prev, currentNote.trim()]);
      setCurrentNote('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddNote();
    }
  };

  // Grocery Page
  if (currentPage === 'grocery') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-300 to-yellow-400 flex flex-col items-center justify-center p-8">
        <div className="max-w-md w-full text-center">
          <div className="bg-teal-500 text-white p-8 rounded-t-2xl shadow-lg">
            <h1 className="text-6xl font-bold text-yellow-300 mb-4">GROCERY</h1>
          </div>
          
          <div className="bg-white p-8 rounded-b-2xl shadow-lg border-4 border-teal-500">
            <button
              onClick={handleBuyNowClick}
              className="bg-gradient-to-r from-orange-400 to-red-400 hover:from-orange-500 hover:to-red-500 text-white font-bold py-4 px-12 rounded-xl text-xl shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center gap-2 mx-auto"
            >
              <ShoppingCart size={24} />
              Buy Now
            </button>
          </div>
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
              <h2 className="text-2xl font-bold text-center mb-6 text-teal-600">Your Details</h2>
              
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Name:</label>
                <input
                  type="text"
                  placeholder="Enter your name"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="w-full p-4 border-3 border-teal-300 rounded-xl text-lg focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="mb-8">
                <div className="text-center mb-4">
                  <p className="text-lg font-bold text-gray-800 mb-4">Your emojis:</p>
                  <button
                    onClick={getRandomEmojis}
                    className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-xl font-bold transition-colors flex items-center gap-2 mx-auto shadow-lg"
                  >
                    <Shuffle size={18} />
                    Random
                  </button>
                </div>
                
                <div className="flex justify-center gap-6 mt-6">
                  {selectedEmojis.map((emoji, index) => (
                    <button
                      key={index}
                      onClick={() => handleEmojiClick(index)}
                      className="bg-gradient-to-br from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 p-6 rounded-2xl text-center transition-all duration-200 cursor-pointer shadow-md hover:shadow-lg transform hover:scale-105"
                    >
                      <div className="text-4xl mb-3">{emoji}</div>
                      <span className="text-sm font-semibold text-gray-600">Emoji {index + 1}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="bg-red-500 hover:bg-red-600 text-white p-3 rounded-lg flex items-center justify-center transition-colors shadow-lg"
                >
                  <X size={20} />
                </button>
                
                <button
                  onClick={handleModalNext}
                  disabled={!userName.trim()}
                  className="flex-1 bg-teal-500 hover:bg-teal-600 disabled:bg-gray-300 text-white py-3 px-6 rounded-lg font-bold text-lg transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Emoji Selection Modal */}
        {showEmojiModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl p-8 max-w-lg w-full shadow-2xl">
              <h2 className="text-2xl font-bold text-center mb-6 text-teal-600">Choose an Emoji</h2>
              
              <div className="grid grid-cols-5 gap-3 mb-6">
                {allEmojis.map((emoji, index) => (
                  <button
                    key={index}
                    onClick={() => handleEmojiSelect(emoji)}
                    className="bg-gray-100 hover:bg-teal-100 p-4 rounded-lg text-center transition-colors text-3xl"
                  >
                    {emoji}
                  </button>
                ))}
              </div>

              <div className="text-center">
                <button
                  onClick={() => setShowEmojiModal(false)}
                  className="bg-gray-400 hover:bg-gray-500 text-white py-3 px-6 rounded-lg font-bold transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Notes List Page
  if (currentPage === 'notesList') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-300 to-yellow-400 p-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-teal-500 text-white p-6 rounded-t-2xl shadow-lg">
            <h1 className="text-4xl font-bold text-yellow-300 text-center">
              {userName}'s Notes
            </h1>
            <div className="text-center mt-2">
              <span className="text-2xl">{selectedEmojis.join(' ')}</span>
            </div>
          </div>
          
          <div className="bg-white rounded-b-2xl shadow-lg border-4 border-teal-500 p-6 min-h-96">
            <h2 className="text-2xl font-bold text-center mb-6 text-teal-600">All Notes</h2>
            
            {notes.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No notes yet!</p>
                <p className="text-gray-400 text-sm mt-2">Go back to add your first note.</p>
              </div>
            ) : (
              <div ref={animationParent} className="space-y-4 mb-8">
                {notes.map((note, index) => (
                  <div key={index} className="bg-gradient-to-r from-teal-50 to-orange-50 p-4 rounded-xl border-l-4 border-teal-400 shadow-sm">
                    <div className="flex items-start gap-3">
                      <div className="bg-teal-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-500 mb-1">Note #{index + 1}</p>
                        <p className="text-lg text-gray-800">{note}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            <div className="text-center">
              <button
                onClick={() => setCurrentPage('notepad')}
                className="bg-teal-500 hover:bg-teal-600 text-white py-3 px-8 rounded-xl font-bold text-lg transition-colors shadow-lg"
              >
                Back to Notepad
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Analytics Page
  if (currentPage === 'analytics') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-300 to-yellow-400 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-teal-500 text-white p-6 rounded-t-2xl shadow-lg">
            <h1 className="text-4xl font-bold text-yellow-300 text-center">
              📊 Análises de {userName}
            </h1>
            <div className="text-center mt-2">
              <span className="text-2xl">{selectedEmojis.join(' ')}</span>
            </div>
          </div>
          
          <div className="bg-white rounded-b-2xl shadow-lg border-4 border-teal-500 p-6">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-800 mb-2">Evolução das suas notas ao longo do tempo</h3>
              <p className="text-sm text-gray-600">Acompanhe o crescimento e padrões das suas anotações</p>
            </div>
            
            <div className="h-80 w-full mb-6">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={notes.map((note, index) => ({
                    name: `Nota ${index + 1}`,
                    avgChars: Math.round(notes.slice(0, index + 1).reduce((acc, n) => acc + n.length, 0) / (index + 1)),
                    lastNoteChars: note.length
                  }))}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 20,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#666' }}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#666' }}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <defs>
                    <linearGradient id="fillAvgChars" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                    </linearGradient>
                    <linearGradient id="fillLastNoteChars" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <Area
                    type="monotone"
                    dataKey="avgChars"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    fill="url(#fillAvgChars)"
                    fillOpacity={0.6}
                    name="Média de Caracteres"
                  />
                  <Area
                    type="monotone"
                    dataKey="lastNoteChars"
                    stroke="#f59e0b"
                    strokeWidth={2}
                    fill="url(#fillLastNoteChars)"
                    fillOpacity={0.6}
                    name="Caracteres da Última Nota"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            
            <div className="mb-6 pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="text-gray-600">Média de Caracteres</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                    <span className="text-gray-600">Caracteres da Última Nota</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-green-600 font-medium">
                  <TrendingUp className="h-4 w-4" />
                  <span>{notes.length} notas analisadas</span>
                </div>
              </div>
            </div>
            
            <div className="text-center">
              <button
                onClick={() => setCurrentPage('notepad')}
                className="bg-teal-500 hover:bg-teal-600 text-white py-3 px-8 rounded-xl font-bold text-lg transition-colors shadow-lg"
              >
                Voltar ao Bloco de Notas
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Notepad Page
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-300 to-yellow-400 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-teal-500 text-white p-6 rounded-t-2xl shadow-lg">
          <h1 className="text-4xl font-bold text-yellow-300 text-center">
            {userName}'s Notes
          </h1>
          <div className="text-center mt-2">
            <span className="text-2xl">{selectedEmojis.join(' ')}</span>
          </div>
        </div>
        
        <div className="bg-white rounded-b-2xl shadow-lg border-4 border-teal-500 p-6 min-h-96">
          <div className="mb-8">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Add a new note:
            </label>
            <div className="flex gap-3 items-center">
              <input
                type="text"
                placeholder="Type your note here..."
                value={currentNote}
                onChange={(e) => setCurrentNote(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1 p-4 border-3 border-orange-300 rounded-xl text-lg focus:outline-none focus:border-teal-500 transition-colors"
              />
              <button
                onClick={handleAddNote}
                disabled={!currentNote.trim()}
                className="bg-teal-500 hover:bg-teal-600 disabled:bg-gray-300 text-white p-4 rounded-xl transition-colors shadow-lg"
              >
                <Plus size={24} />
              </button>
            </div>
            <p className="text-sm text-gray-500 mt-2">Press Enter or click + to add note</p>
          </div>

          <div className="text-center space-y-4">
            <button
              onClick={() => setCurrentPage('notesList')}
              className="bg-gradient-to-r from-purple-400 to-pink-400 hover:from-purple-500 hover:to-pink-500 text-white py-4 px-8 rounded-xl font-bold text-lg shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center gap-2 mx-auto"
            >
              <BookOpen size={24} />
              See Notes ({notes.length})
            </button>

            {notes.length > 0 && (
              <button
                onClick={() => setCurrentPage('analytics')}
                className="bg-gradient-to-r from-blue-400 to-purple-400 hover:from-blue-500 hover:to-purple-500 text-white py-4 px-8 rounded-xl font-bold text-lg shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center gap-2 mx-auto"
              >
                <TrendingUp size={24} />
                Ver Análises ({notes.length})
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
