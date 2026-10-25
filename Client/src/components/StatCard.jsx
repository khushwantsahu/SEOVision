import React from 'react';

export default function StatCard({ title, value, icon: Icon, subtext, color = 'blue' }) {
  const colorMap = {
    blue: 'bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400',
    emerald: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400',
    purple: 'bg-purple-50 text-purple-600 dark:bg-purple-950/50 dark:text-purple-400',
    amber: 'bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400'
  };

  return (
    <div className="saas-card p-5 flex items-center justify-between">
      <div>
        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1">
          {title}
        </span>
        <span className="text-2xl font-extrabold text-slate-900 dark:text-white font-['Outfit']">
          {value}
        </span>
        {subtext && (
          <span className="text-xs text-slate-400 dark:text-slate-500 block mt-1">
            {subtext}
          </span>
        )}
      </div>

      {Icon && (
        <div className={`w-12 h-12 rounded-2xl ${colorMap[color] || colorMap.blue} flex items-center justify-center shrink-0`}>
          <Icon className="w-6 h-6 stroke-[2]" />
        </div>
      )}
    </div>
  );
}
