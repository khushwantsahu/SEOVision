import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Search,
  ArrowRight,
  Sparkles,
  Zap,
  Target,
  ShieldCheck,
  TrendingUp,
  BarChart3,
  Check
} from 'lucide-react';

export default function LandingPage() {
  const [url, setUrl] = useState('');
  const navigate = useNavigate();
  const { isAuthenticated, showToast } = useAuth();

  const handleAnalyze = (e) => {
    e.preventDefault();
    if (!url.trim()) {
      showToast('Please enter a website URL to analyze', 'error');
      return;
    }

    if (isAuthenticated) {
      navigate('/analyze', { state: { initialUrl: url } });
    } else {
      navigate('/register', { state: { initialUrl: url } });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-between overflow-hidden">
      
      {/* Hero Section matching screenshot #4 */}
      <section className="relative pt-16 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full text-center">
        
        {/* Background Ambient Glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-blue-400/10 dark:bg-blue-600/10 blur-3xl rounded-full -z-10" />

        {/* Top Badge matching reference screenshot */}
        <div className="inline-flex items-center gap-2 bg-blue-50 dark:bg-blue-950/60 border border-blue-200/80 dark:border-blue-800/60 px-4 py-1.5 rounded-full text-xs font-semibold text-blue-700 dark:text-blue-300 mb-8 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping" />
          <span>AI-Powered SEO Intelligence</span>
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight font-['Outfit'] max-w-4xl mx-auto leading-tight mb-6">
          Analyze & Boost Your <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            SEO Rankings
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
          Get instant AI-powered SEO audits for any website. Uncover hidden issues, optimize performance, and outrank your competition.
        </p>

        {/* Main URL Input Box matching reference screenshot */}
        <div className="max-w-2xl mx-auto mb-6">
          <form
            onSubmit={handleAnalyze}
            className="flex flex-col sm:flex-row items-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-2 rounded-2xl sm:rounded-full shadow-lg hover:border-blue-300 dark:hover:border-blue-700 transition-all gap-2"
          >
            <div className="flex items-center gap-3 px-4 w-full sm:w-auto flex-1">
              <Search className="w-5 h-5 text-slate-400 shrink-0" />
              <input
                type="text"
                placeholder="Enter website URL (e.g., example.com)"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full bg-transparent border-none text-slate-900 dark:text-white text-sm focus:outline-none placeholder-slate-400 py-2"
              />
            </div>
            <button
              type="submit"
              className="w-full sm:w-auto bg-slate-900 dark:bg-blue-600 hover:bg-slate-800 dark:hover:bg-blue-700 text-white px-7 py-3 rounded-xl sm:rounded-full text-sm font-semibold flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-blue-500/20 shrink-0"
            >
              <span>Analyze</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Supporting subtext */}
        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
          Free analysis • No credit card required • 5 analyses per day
        </p>
      </section>

      {/* Feature Grid Section */}
      <section className="py-16 bg-white dark:bg-slate-900/60 border-y border-slate-200/80 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white font-['Outfit'] mb-3">
              Everything You Need for SEO Dominance
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Powerful tools designed to monitor, analyze, and boost your search engine performance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="saas-card p-6">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white font-['Outfit'] mb-2">
                Real-Time Web Crawler
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Inspect title length, meta tags, H1-H6 headers, internal links, image alt coverage, HTTPS status, and page speed metrics instantly.
              </p>
            </div>

            <div className="saas-card p-6">
              <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white font-['Outfit'] mb-2">
                AI Recommendations
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Receive actionable recommendations, optimized title tags, and meta descriptions generated directly from your website's actual audit findings.
              </p>
            </div>

            <div className="saas-card p-6">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white font-['Outfit'] mb-2">
                Keyword Rank Tracker
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Track target keyword positions on Google search over time with historical rank charts and position improvement indicators.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 max-w-5xl mx-auto text-center">
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-3xl p-10 sm:p-14 shadow-2xl relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-3xl font-extrabold font-['Outfit'] mb-4">
              Ready to Upgrade Your SEO Strategy?
            </h2>
            <p className="text-sm text-slate-300 max-w-xl mx-auto mb-8">
              Join SEO Vision today and start auditing websites with intelligent AI insights.
            </p>
            <Link
              to={isAuthenticated ? "/dashboard" : "/register"}
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm px-8 py-3.5 rounded-full shadow-lg transition-all"
            >
              <span>Get Started Free</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
