import React from 'react';

export default function ScoreGauge({ score = 0, size = 'lg', label = 'Overall SEO Score' }) {
  // Determine color based on score threshold
  const getColor = (s) => {
    if (s >= 80) return { stroke: '#10b981', text: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200' };
    if (s >= 50) return { stroke: '#f59e0b', text: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-950/40 border-amber-200' };
    return { stroke: '#ef4444', text: 'text-rose-600 dark:text-rose-400', bg: 'bg-rose-50 dark:bg-rose-950/40 border-rose-200' };
  };

  const themeColor = getColor(score);
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const isSmall = size === 'sm';

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="relative flex items-center justify-center">
        <svg
          className={`${isSmall ? 'w-24 h-24' : 'w-36 h-36'} transform -rotate-90`}
          viewBox="0 0 100 100"
        >
          {/* Background circle */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            className="stroke-slate-200 dark:stroke-slate-800"
            strokeWidth="8"
            fill="transparent"
          />
          {/* Progress circle */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            stroke={themeColor.stroke}
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        <div className="absolute flex flex-col items-center justify-center text-center">
          <span className={`${isSmall ? 'text-2xl' : 'text-4xl'} font-extrabold tracking-tight font-['Outfit'] ${themeColor.text}`}>
            {score}
          </span>
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
            / 100
          </span>
        </div>
      </div>

      {label && (
        <span className="mt-3 text-xs font-semibold text-slate-700 dark:text-slate-300">
          {label}
        </span>
      )}
    </div>
  );
}
