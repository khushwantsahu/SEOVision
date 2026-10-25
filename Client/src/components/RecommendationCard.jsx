import React from 'react';
import { Sparkles, CheckSquare } from 'lucide-react';

export default function RecommendationCard({ recommendation }) {
  const { title, description, category, impact } = recommendation;

  const getImpactBadge = (imp) => {
    switch (imp) {
      case 'High':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300';
      case 'Medium':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300';
      default:
        return 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300';
    }
  };

  return (
    <div className="saas-card p-5 border-l-4 border-l-blue-500">
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <h5 className="text-sm font-bold text-slate-900 dark:text-white font-['Outfit']">
            {title}
          </h5>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
            {category}
          </span>
          <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${getImpactBadge(impact)}`}>
            {impact} Impact
          </span>
        </div>
      </div>
      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
        {description}
      </p>
    </div>
  );
}
