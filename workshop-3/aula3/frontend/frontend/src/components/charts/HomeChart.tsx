import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useAnalytics } from '../../hooks';

interface HomeChartProps {
  className?: string;
}

const HomeChart: React.FC<HomeChartProps> = ({ className = '' }) => {
  const { analyticsData } = useAnalytics();

  if (analyticsData.length === 0) {
    return (
      <div className={`bg-white rounded-lg shadow-lg p-6 ${className}`}>
        <h3 className="text-lg font-semibold mb-4">📈 Evolução das Notas</h3>
        <div className="text-center py-8 text-gray-500">
          <div className="text-4xl mb-2">📊</div>
          <p>Adicione algumas notas para ver o gráfico!</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow-lg p-6 ${className}`}>
      <h3 className="text-lg font-semibold mb-4">📈 Evolução das Notas</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={analyticsData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="name" 
            tick={{ fontSize: 12 }}
          />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip 
            formatter={(value: number, name: string) => [
              value,
              name === 'avgChars' ? 'Média de Caracteres' : 'Caracteres da Última Nota'
            ]}
            labelFormatter={(label) => `${label}`}
          />
          <Line 
            type="monotone" 
            dataKey="avgChars" 
            stroke="#8884d8" 
            strokeWidth={2}
            name="avgChars"
            dot={{ fill: '#8884d8', strokeWidth: 2, r: 4 }}
          />
          <Line 
            type="monotone" 
            dataKey="lastNoteChars" 
            stroke="#82ca9d" 
            strokeWidth={2}
            name="lastNoteChars"
            dot={{ fill: '#82ca9d', strokeWidth: 2, r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
      
      {/* Legenda personalizada */}
      <div className="flex justify-center space-x-6 mt-4">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
          <span className="text-sm text-gray-600">Média de Caracteres por Nota</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <span className="text-sm text-gray-600">Caracteres da Última Nota</span>
        </div>
      </div>
    </div>
  );
};

export default HomeChart;