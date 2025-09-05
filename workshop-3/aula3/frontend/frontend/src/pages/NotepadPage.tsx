import { Plus, BookOpen, TrendingUp } from 'lucide-react';
import Button from '../components/ui/Button';
import { useAuthStore } from '../stores';
import { useNoteOperations, useNavigation } from '../hooks';

const NotepadPage = () => {
  const { userName, selectedEmojis } = useAuthStore();
  const { currentNote, notes, handleAddNote, handleKeyPress, handleNoteChange } = useNoteOperations();
  const { navigateToPage } = useNavigation();
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
              onChange={(e) => handleNoteChange(e.target.value)}
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
            <Button
              onClick={() => navigateToPage('notesList')}
              variant="gradient"
              size="lg"
              className="mx-auto bg-gradient-to-r from-purple-400 to-pink-400 hover:from-purple-500 hover:to-pink-500"
            >
              <BookOpen size={24} />
              See Notes ({notes.length})
            </Button>

            {notes.length > 0 && (
              <Button
                onClick={() => navigateToPage('analytics')}
                variant="gradient"
                size="lg"
                className="mx-auto bg-gradient-to-r from-blue-400 to-purple-400 hover:from-blue-500 hover:to-purple-500"
              >
                <TrendingUp size={24} />
                Ver Análises ({notes.length})
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotepadPage;