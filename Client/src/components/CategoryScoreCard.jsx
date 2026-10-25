import React from 'react';
import { Shield, FileText, Zap, Eye, AlignLeft, Award } from 'lucide-react';

const categoryIcons = {
  Technical: Shield,
  'On-Page': FileText,
  Performance: Zap,
  Accessibility: Eye,
  Content: AlignLeft,
  'Best Practices': Award
};

export default function CategoryScoreCard({ title, score = 0, description }) {
  const IconComponent = categoryIcons[title] || Shield;

  const getScoreColor = (s) => {
    if (s >= 80) return { bg: 'bg-emerald-500', text: 'text-emerald-600 dark:text-emerald-400', badge: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300' };
    if (s >= 50) return { bg: 'bg-amber-500', text: 'text-amber-600 dark:text-amber-400', badge: 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300' };
    return { bg: 'bg-rose-500', text: 'text-rose-600 dark:text-rose-400', badge: 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300' };
  };

  const style = getScoreColor(score);

  return (
    <div className="saas-card p-5 hover:border-slate-300 dark:hover:border-slate-700 transition-all">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center">
            <IconComponent className="w-4 h-4 stroke-[2]" />
          </div>
          <h4 className="text-sm font-bold text-slate-900 dark:text-white font-['Outfit']">
            {title}
          </h4>
        </div>
        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${style.badge}`}>
          {score} / 100
        </span>
      </div>

      <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 mb-2 overflow-hidden">
        <div
          className={`h-2 rounded-full transition-all duration-700 ${style.bg}`}
          style={{ width: `${score}%` }}
        />
      </div>

      {description && (
        <p className="text-xs text-slate-500 dark:text-slate-400">
          {description}
        </p>
      )}
    </div>
  );
}
