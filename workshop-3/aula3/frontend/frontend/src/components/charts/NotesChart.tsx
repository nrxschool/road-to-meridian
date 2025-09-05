import React from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import type { UserData } from '../../types';

interface NotesChartProps {
  userData: UserData;
}

interface ChartData {
  date: string;
  count: number;
  characters: number;
}

interface CharacterDistribution {
  range: string;
  count: number;
  color: string;
}

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#8dd1e1'];

const NotesChart: React.FC<NotesChartProps> = ({ userData }) => {
  // Processar dados para gráfico de linha (evolução temporal)
  const timelineData: ChartData[] = React.useMemo(() => {
    const dataMap = new Map<string, { count: number; characters: number }>();
    
    userData.notes.forEach((note) => {
      const date = new Date(note.timestamp).toLocaleDateString('pt-BR');
      const existing = dataMap.get(date) || { count: 0, characters: 0 };
      dataMap.set(date, {
        count: existing.count + 1,
        characters: existing.characters + note.content.length,
      });
    });

    return Array.from(dataMap.entries())
      .map(([date, data]) => ({ date, ...data }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [userData.notes]);

  // Processar dados para gráfico de barras (distribuição de caracteres)
  const characterDistribution: CharacterDistribution[] = React.useMemo(() => {
    const ranges = [
      { min: 0, max: 50, label: '0-50', color: COLORS[0] },
      { min: 51, max: 100, label: '51-100', color: COLORS[1] },
      { min: 101, max: 200, label: '101-200', color: COLORS[2] },
      { min: 201, max: 500, label: '201-500', color: COLORS[3] },
      { min: 501, max: Infinity, label: '500+', color: COLORS[4] },
    ];

    const distribution = ranges.map((range) => ({
      range: range.label,
      count: userData.notes.filter(
        (note) => note.content.length >= range.min && note.content.length <= range.max
      ).length,
      color: range.color,
    }));

    return distribution.filter((item) => item.count > 0);
  }, [userData.notes]);

  // Estatísticas gerais
  const stats = React.useMemo(() => {
    const totalNotes = userData.notes.length;
    const totalCharacters = userData.notes.reduce((sum, note) => sum + note.content.length, 0);
    const avgCharacters = totalNotes > 0 ? Math.round(totalCharacters / totalNotes) : 0;
    const longestNote = Math.max(...userData.notes.map(note => note.content.length), 0);
    
    return { totalNotes, totalCharacters, avgCharacters, longestNote };
  }, [userData.notes]);

  if (userData.notes.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">📊 Estatísticas das Notas</h3>
        <p className="text-gray-500 text-center py-8">
          Nenhuma nota encontrada. Comece a escrever para ver suas estatísticas!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Estatísticas Gerais */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">📊 Estatísticas Gerais</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.totalNotes}</div>
            <div className="text-sm text-gray-600">Total de Notas</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{stats.totalCharacters}</div>
            <div className="text-sm text-gray-600">Caracteres Escritos</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{stats.avgCharacters}</div>
            <div className="text-sm text-gray-600">Média por Nota</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">{stats.longestNote}</div>
            <div className="text-sm text-gray-600">Nota Mais Longa</div>
          </div>
        </div>
      </div>

      {/* Gráfico de Evolução Temporal */}
      {timelineData.length > 1 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">📈 Evolução das Notas</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={timelineData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip 
                labelFormatter={(value) => `Data: ${value}`}
                formatter={(value, name) => [
                  value,
                  name === 'count' ? 'Notas' : 'Caracteres'
                ]}
              />
              <Line 
                type="monotone" 
                dataKey="count" 
                stroke="#8884d8" 
                strokeWidth={2}
                name="count"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Gráfico de Distribuição de Caracteres */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">📊 Distribuição por Tamanho</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={characterDistribution}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="range" />
            <YAxis />
            <Tooltip 
              formatter={(value) => [value, 'Quantidade de Notas']}
              labelFormatter={(value) => `Caracteres: ${value}`}
            />
            <Bar dataKey="count">
              {characterDistribution.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Gráfico de Pizza - Distribuição Percentual */}
      {characterDistribution.length > 1 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">🥧 Distribuição Percentual</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={characterDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ range, percent }) => `${range}: ${((percent || 0) * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="count"
              >
                {characterDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [value, 'Notas']} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default NotesChart;