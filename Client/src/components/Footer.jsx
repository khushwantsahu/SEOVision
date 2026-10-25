import React from 'react';
import { Link } from 'react-router-dom';
import { BarChart2, ShieldCheck, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-slate-950 border-t border-slate-200/80 dark:border-slate-800 py-10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center">
                <BarChart2 className="w-4 h-4 stroke-[2.5]" />
              </div>
              <span className="font-bold text-lg text-slate-900 dark:text-white font-['Outfit']">
                SEO Vision
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mb-4">
              Intelligent SEO Tracking Analyzer built for modern websites and SaaS platforms. MCA 3rd-Semester Project.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-400 dark:text-slate-500">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>SSRF Protected & Secure Architecture</span>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-slate-200 uppercase tracking-wider mb-3">
              Quick Links
            </h4>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
              <li><Link to="/dashboard" className="hover:text-blue-600 dark:hover:text-blue-400">Dashboard</Link></li>
              <li><Link to="/analyze" className="hover:text-blue-600 dark:hover:text-blue-400">Website Analyzer</Link></li>
              <li><Link to="/rank-tracker" className="hover:text-blue-600 dark:hover:text-blue-400">Rank Tracker</Link></li>
              <li><Link to="/history" className="hover:text-blue-600 dark:hover:text-blue-400">Analysis History</Link></li>
              <li><Link to="/pricing" className="hover:text-blue-600 dark:hover:text-blue-400">Pricing & Plans</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-slate-200 uppercase tracking-wider mb-3">
              Stack & Tech
            </h4>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
              <li>React + Vite Frontend</li>
              <li>Node.js + Express REST API</li>
              <li>MongoDB & Mongoose DB</li>
              <li>Tailwind CSS Design System</li>
              <li>Google Gemini AI Engine</li>
            </ul>
          </div>

        </div>

        <div className="pt-6 border-t border-slate-100 dark:border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400">
          <p>© {new Date().getFullYear()} SEO Vision. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Built with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for MCA MCA Project Presentation
          </p>
        </div>
      </div>
    </footer>
  );
}
