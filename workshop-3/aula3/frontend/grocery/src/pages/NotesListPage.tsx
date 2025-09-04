import { useAutoAnimate } from '@formkit/auto-animate/react';
import Button from '../components/ui/Button';
import type { Page } from '../types';

interface NotesListPageProps {
  userName: string;
  selectedEmojis: string[];
  notes: string[];
  onNavigate: (page: Page) => void;
}

const NotesListPage = ({
  userName,
  selectedEmojis,
  notes,
  onNavigate,
}: NotesListPageProps) => {
  const [animationParent] = useAutoAnimate();

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
            <Button
              onClick={() => onNavigate('notepad')}
              variant="primary"
              size="lg"
            >
              Back to Notepad
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotesListPage;