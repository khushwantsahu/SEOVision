import React from 'react';
import { ArrowUp, ArrowDown, Minus, RefreshCw, Trash2, Globe, ExternalLink } from 'lucide-react';

export default function KeywordTable({ keywords = [], onRefresh, onDelete, onSelect }) {
  if (keywords.length === 0) {
    return null;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider bg-slate-50/50 dark:bg-slate-900/50">
            <th className="py-3.5 px-4 rounded-l-xl">Keyword</th>
            <th className="py-3.5 px-4">Target Domain</th>
            <th className="py-3.5 px-4">Position</th>
            <th className="py-3.5 px-4">Best</th>
            <th className="py-3.5 px-4">Change</th>
            <th className="py-3.5 px-4 text-right rounded-r-xl">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs">
          {keywords.map((kw) => {
            const change = (kw.previousPosition || kw.currentPosition) - kw.currentPosition;
            let changeBadge = (
              <span className="flex items-center gap-0.5 text-slate-400">
                <Minus className="w-3.5 h-3.5" /> 0
              </span>
            );

            if (change > 0) {
              changeBadge = (
                <span className="flex items-center gap-0.5 text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full">
                  <ArrowUp className="w-3.5 h-3.5" /> +{change}
                </span>
              );
            } else if (change < 0) {
              changeBadge = (
                <span className="flex items-center gap-0.5 text-rose-600 dark:text-rose-400 font-bold bg-rose-50 dark:bg-rose-950/40 px-2 py-0.5 rounded-full">
                  <ArrowDown className="w-3.5 h-3.5" /> {change}
                </span>
              );
            }

            return (
              <tr
                key={kw._id}
                className="hover:bg-slate-50/80 dark:hover:bg-slate-900/60 transition-colors group cursor-pointer"
                onClick={() => onSelect && onSelect(kw)}
              >
                <td className="py-4 px-4 font-semibold text-slate-900 dark:text-white">
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-blue-500 shrink-0" />
                    <span>{kw.keyword}</span>
                  </div>
                </td>
                <td className="py-4 px-4 text-slate-600 dark:text-slate-400 font-mono">
                  <a
                    href={kw.targetUrl.startsWith('http') ? kw.targetUrl : `https://${kw.targetUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-blue-600 flex items-center gap-1"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {kw.targetUrl}
                    <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                </td>
                <td className="py-4 px-4">
                  <span className="inline-flex items-center justify-center font-extrabold text-sm text-slate-900 dark:text-white font-['Outfit'] bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg">
                    #{kw.currentPosition}
                  </span>
                </td>
                <td className="py-4 px-4 text-slate-500 font-medium">
                  #{kw.bestPosition || kw.currentPosition}
                </td>
                <td className="py-4 px-4">{changeBadge}</td>
                <td className="py-4 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={() => onRefresh && onRefresh(kw._id)}
                      className="p-1.5 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                      title="Re-check position"
                    >
                      <RefreshCw className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete && onDelete(kw._id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                      title="Delete keyword"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
