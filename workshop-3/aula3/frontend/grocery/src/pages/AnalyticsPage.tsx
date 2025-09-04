import { TrendingUp } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Button from '../components/ui/Button';
import { useAuthStore } from '../stores';
import { useAnalytics, useNavigation } from '../hooks';
import type { AnalyticsData } from '../types';

const AnalyticsPage = () => {
  const { userName, selectedEmojis } = useAuthStore();
  const { navigateToPage } = useNavigation();
  const {
    analyticsData,
    totalNotes,
    totalCharacters,
    averageCharacters,
    longestNote,
    shortestNote
  } = useAnalytics();

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
                data={analyticsData}
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
                <span>{totalNotes} notas analisadas</span>
              </div>
            </div>
          </div>
          
          <div className="text-center">
            <Button
              onClick={() => navigateToPage('notepad')}
              variant="primary"
              size="lg"
            >
              Voltar ao Bloco de Notas
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;