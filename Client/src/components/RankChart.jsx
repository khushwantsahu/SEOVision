import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';

export default function RankChart({ history = [] }) {
  if (!history || history.length === 0) {
    return (
      <div className="h-48 flex items-center justify-center text-xs text-slate-400">
        No ranking history recorded yet.
      </div>
    );
  }

  // Format data for Recharts
  const data = history.map((item, idx) => ({
    name: new Date(item.checkedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
    position: item.position
  }));

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.15} />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 11, fill: '#64748b' }}
            stroke="#94a3b8"
          />
          <YAxis
            reversed // Rank 1 is top position
            domain={[1, 50]}
            tick={{ fontSize: 11, fill: '#64748b' }}
            stroke="#94a3b8"
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#0f172a',
              borderColor: '#1e293b',
              borderRadius: '12px',
              color: '#fff',
              fontSize: '12px'
            }}
            formatter={(value) => [`Rank #${value}`, 'Position']}
          />
          <Line
            type="monotone"
            dataKey="position"
            stroke="#2563eb"
            strokeWidth={3}
            dot={{ r: 4, fill: '#2563eb', strokeWidth: 2, stroke: '#ffffff' }}
            activeDot={{ r: 6, fill: '#1d4ed8' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
