import React from 'react';
import { useAuth } from '../context/AuthContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function Toast() {
  const { toast } = useAuth();

  if (!toast) return null;

  const getStyle = (type) => {
    switch (type) {
      case 'success':
        return {
          bg: 'bg-emerald-900/90 border-emerald-700 text-emerald-100',
          icon: <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
        };
      case 'error':
        return {
          bg: 'bg-rose-900/90 border-rose-700 text-rose-100',
          icon: <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
        };
      case 'info':
      default:
        return {
          bg: 'bg-slate-900/90 border-slate-700 text-slate-100',
          icon: <Info className="w-5 h-5 text-blue-400 shrink-0" />
        };
    }
  };

  const style = getStyle(toast.type);

  return (
    <div className="fixed bottom-5 right-5 z-50 animate-bounce-subtle max-w-sm">
      <div
        className={`flex items-center gap-3 px-4 py-3 rounded-2xl border shadow-xl backdrop-blur-md text-xs font-medium ${style.bg}`}
      >
        {style.icon}
        <span className="flex-1 leading-snug">{toast.message}</span>
      </div>
    </div>
  );
}
