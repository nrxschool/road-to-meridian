import React, { useState } from 'react';
import { Plus, BookOpen } from 'lucide-react';

const NotepadApp = () => {
  const [currentPage, setCurrentPage] = useState('notepad');
  const [currentNote, setCurrentNote] = useState('');
  const [notes, setNotes] = useState([]);
  
  // Simulando dados que viriam do primeiro site
  const [userName] = useState('Lucas'); // Nome que viria do primeiro site
  const [userEmojis] = useState(['😊', '🎉', '✨']); // Emojis que viriam do primeiro site

  const handleAddNote = () => {
    if (currentNote.trim()) {
      setNotes([...notes, currentNote.trim()]);
      setCurrentNote('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleAddNote();
    }
  };

  // Notes List Page
  if (currentPage === 'notesList') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-300 to-yellow-400 p-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-teal-500 text-white p-6 rounded-t-2xl shadow-lg">
            <h1 className="text-4xl font-bold text-yellow-300 text-center">
              {userName}'s Notes
            </h1>
          </div>
          
          <div className="bg-white rounded-b-2xl shadow-lg border-4 border-teal-500 min-h-96 p-6">
            {notes.length === 0 ? (
              <div className="text-center text-gray-500 text-xl mt-12">
                <div className="mb-4 text-6xl">📝</div>
                <p>No notes yet!</p>
                <p className="text-lg">Go back to add some notes.</p>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-lg font-semibold text-gray-700 mb-4">
                  Total notes: {notes.length}
                </p>
                {notes.map((note, index) => (
                  <div key={index} className="bg-gradient-to-r from-pink-100 to-blue-100 p-4 rounded-xl border-l-4 border-teal-400 shadow-sm">
                    <div className="flex items-start gap-3">
                      <span className="text-2xl flex-shrink-0">
                        {userEmojis[index % userEmojis.length]}
                      </span>
                      <div className="flex-1">
                        <p className="text-sm text-gray-500 mb-1">Note #{index + 1}</p>
                        <p className="text-lg text-gray-800">{note}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            <div className="mt-8 text-center">
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

  // Notepad Page (Main)
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-300 to-yellow-400 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-teal-500 text-white p-6 rounded-t-2xl shadow-lg">
          <h1 className="text-4xl font-bold text-yellow-300 text-center">
            {userName}'s Notes
          </h1>
          <div className="text-center mt-2">
            <span className="text-2xl">{userEmojis.join(' ')}</span>
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
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                <p className="text-sm text-gray-600 mb-2">Quick Stats:</p>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="bg-white p-3 rounded-lg shadow-sm">
                    <p className="text-2xl font-bold text-teal-600">{notes.length}</p>
                    <p className="text-sm text-gray-600">Total Notes</p>
                  </div>
                  <div className="bg-white p-3 rounded-lg shadow-sm">
                    <p className="text-2xl font-bold text-orange-600">
                      {Math.round(notes.reduce((acc, note) => acc + note.length, 0) / notes.length) || 0}
                    </p>
                    <p className="text-sm text-gray-600">Avg. Length</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotepadApp;