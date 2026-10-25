import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  BarChart2,
  Search,
  Target,
  History,
  Moon,
  Sun,
  LogOut,
  User as UserIcon,
  Sparkles
} from 'lucide-react';

export default function Navbar() {
  const { isAuthenticated, user, logout, theme, toggleTheme } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Left: Brand Logo matching screenshot layout */}
        <Link to={isAuthenticated ? "/dashboard" : "/"} className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-blue-600 dark:bg-blue-600 text-white flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
            <BarChart2 className="w-5 h-5 stroke-[2.5]" />
          </div>
          <span className="font-extrabold text-xl tracking-tight text-slate-900 dark:text-white font-['Outfit']">
            SEO Vision
          </span>
        </Link>

        {/* Center: Nav Pill Capsule matching reference screenshots */}
        {isAuthenticated && (
          <nav className="hidden md:flex nav-tab-container">
            <Link
              to="/dashboard"
              className={`nav-tab-item ${isActive('/dashboard') ? 'nav-tab-active' : ''}`}
            >
              <BarChart2 className="w-4 h-4" />
              <span>Dashboard</span>
            </Link>

            <Link
              to="/analyze"
              className={`nav-tab-item ${isActive('/analyze') ? 'nav-tab-active' : ''}`}
            >
              <Search className="w-4 h-4" />
              <span>Analyze</span>
            </Link>

            <Link
              to="/rank-tracker"
              className={`nav-tab-item ${isActive('/rank-tracker') ? 'nav-tab-active' : ''}`}
            >
              <Target className="w-4 h-4" />
              <span>Rank Tracker</span>
            </Link>

            <Link
              to="/history"
              className={`nav-tab-item ${isActive('/history') ? 'nav-tab-active' : ''}`}
            >
              <History className="w-4 h-4" />
              <span>History</span>
            </Link>
          </nav>
        )}

        {/* Right Action Items */}
        <div className="flex items-center gap-3">
          {/* Dark Mode Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
            title="Toggle theme"
            aria-label="Toggle dark mode"
          >
            {theme === 'dark' ? (
              <Sun className="w-5 h-5 text-amber-400" />
            ) : (
              <Moon className="w-5 h-5 text-slate-600" />
            )}
          </button>

          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              {/* User Profile Badge matching screenshot pill */}
              <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 px-3 py-1 rounded-full text-xs font-semibold text-slate-700 dark:text-slate-200">
                <div className="w-5 h-5 rounded-full bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 flex items-center justify-center text-[10px] font-bold uppercase">
                  {user?.name ? user.name[0] : 'U'}
                </div>
                <span>{user?.name || 'User'}</span>
                <span className="bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 px-1.5 py-0.5 rounded text-[10px] uppercase font-bold tracking-wide">
                  {user?.plan || 'FREE'}
                </span>
              </div>

              {/* Logout Button */}
              <button
                onClick={() => {
                  logout();
                  navigate('/login');
                }}
                className="flex items-center gap-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white px-2.5 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/pricing"
                className="hidden sm:flex items-center gap-1 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline mr-2"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Pricing
              </Link>
              <Link
                to="/login"
                className="text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white px-3 py-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                Log In
              </Link>
              <Link
                to="/register"
                className="bg-slate-900 dark:bg-blue-600 hover:bg-slate-800 dark:hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2 rounded-full transition-all shadow-sm"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>

      </div>

      {/* Mobile Nav Bar tabs */}
      {isAuthenticated && (
        <div className="md:hidden flex items-center justify-around border-t border-slate-200/80 dark:border-slate-800 px-2 py-1.5 bg-white dark:bg-slate-950">
          <Link
            to="/dashboard"
            className={`flex flex-col items-center gap-0.5 text-[11px] font-medium p-1 ${isActive('/dashboard') ? 'text-blue-600 font-bold' : 'text-slate-500'}`}
          >
            <BarChart2 className="w-4 h-4" />
            Dashboard
          </Link>
          <Link
            to="/analyze"
            className={`flex flex-col items-center gap-0.5 text-[11px] font-medium p-1 ${isActive('/analyze') ? 'text-blue-600 font-bold' : 'text-slate-500'}`}
          >
            <Search className="w-4 h-4" />
            Analyze
          </Link>
          <Link
            to="/rank-tracker"
            className={`flex flex-col items-center gap-0.5 text-[11px] font-medium p-1 ${isActive('/rank-tracker') ? 'text-blue-600 font-bold' : 'text-slate-500'}`}
          >
            <Target className="w-4 h-4" />
            Rank Tracker
          </Link>
          <Link
            to="/history"
            className={`flex flex-col items-center gap-0.5 text-[11px] font-medium p-1 ${isActive('/history') ? 'text-blue-600 font-bold' : 'text-slate-500'}`}
          >
            <History className="w-4 h-4" />
            History
          </Link>
        </div>
      )}
    </header>
  );
}
