import React from 'react';
import { AlertCircle, AlertTriangle, CheckCircle2, ArrowRight } from 'lucide-react';

export default function SEOIssueCard({ issue }) {
  const { title, description, category, severity, recommendation } = issue;

  const getSeverityStyle = (sev) => {
    switch (sev) {
      case 'Critical':
        return {
          border: 'border-l-4 border-l-rose-500',
          badge: 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300',
          icon: <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
        };
      case 'Warning':
        return {
          border: 'border-l-4 border-l-amber-500',
          badge: 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300',
          icon: <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
        };
      case 'Good':
      default:
        return {
          border: 'border-l-4 border-l-emerald-500',
          badge: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300',
          icon: <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
        };
    }
  };

  const style = getSeverityStyle(severity);

  return (
    <div className={`saas-card p-5 ${style.border} transition-all`}>
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex items-center gap-2">
          {style.icon}
          <h5 className="text-sm font-bold text-slate-900 dark:text-white font-['Outfit']">
            {title}
          </h5>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
            {category}
          </span>
          <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${style.badge}`}>
            {severity}
          </span>
        </div>
      </div>

      <p className="text-xs text-slate-600 dark:text-slate-300 mb-3 leading-relaxed">
        {description}
      </p>

      {recommendation && (
        <div className="bg-slate-50 dark:bg-slate-850 p-3 rounded-xl border border-slate-200/60 dark:border-slate-800 flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300">
          <ArrowRight className="w-3.5 h-3.5 text-blue-500 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-blue-600 dark:text-blue-400 mr-1">Recommendation:</span>
            {recommendation}
          </div>
        </div>
      )}
    </div>
  );
}
