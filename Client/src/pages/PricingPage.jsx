import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { subscriptionService } from '../services/subscriptionService';
import { Check, Sparkles, Zap, Shield, Loader2 } from 'lucide-react';

export default function PricingPage() {
  const { user, updateUser, isAuthenticated, showToast } = useAuth();
  const [upgrading, setUpgrading] = useState(false);

  const handleUpgrade = async () => {
    if (!isAuthenticated) {
      showToast('Please sign in or register to upgrade your plan', 'info');
      return;
    }

    if (user?.plan === 'PRO') {
      showToast('You are already subscribed to the PRO plan!', 'info');
      return;
    }

    setUpgrading(true);
    try {
      const res = await subscriptionService.checkout('PRO');
      if (res.success) {
        showToast('Successfully upgraded to PRO Plan!', 'success');
        updateUser({ ...user, plan: 'PRO' });
      }
    } catch (err) {
      showToast(err.message || 'Upgrade checkout failed', 'error');
    } finally {
      setUpgrading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center space-y-12">
      
      {/* Title */}
      <div className="max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Simple, Transparent Pricing</span>
        </div>

        <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white font-['Outfit'] tracking-tight">
          Choose the Perfect Plan for Your SEO Vision
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Scale your website audits and keyword tracking with our AI-powered analyzer.
        </p>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto text-left">
        
        {/* FREE Tier Card */}
        <div className="saas-card p-8 flex flex-col justify-between border-slate-200 dark:border-slate-800">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Starter
              </span>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                Free Forever
              </span>
            </div>

            <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white font-['Outfit'] mb-1">
              FREE
            </h3>
            <div className="text-3xl font-extrabold text-slate-900 dark:text-white font-['Outfit'] mb-6">
              $0 <span className="text-xs font-normal text-slate-400">/ month</span>
            </div>

            <ul className="space-y-3 text-xs text-slate-600 dark:text-slate-300 mb-8">
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>5 Website Scans per day</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Deterministic 0-100 SEO scoring</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Technical & On-Page Issue Detection</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Keyword Rank Tracking (Up to 5 keywords)</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Analysis History Log</span>
              </li>
            </ul>
          </div>

          <button
            disabled
            className="w-full py-3 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-xs font-semibold rounded-xl text-center cursor-not-allowed"
          >
            {user?.plan === 'FREE' ? 'Current Active Plan' : 'Free Included'}
          </button>
        </div>

        {/* PRO Tier Card */}
        <div className="saas-card p-8 flex flex-col justify-between border-2 border-blue-600 dark:border-blue-500 relative shadow-xl bg-white dark:bg-slate-900">
          <div className="absolute -top-3 right-6 bg-blue-600 text-white text-[10px] font-extrabold uppercase px-3 py-1 rounded-full shadow-md">
            Recommended
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                Professional
              </span>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-300">
                PRO Plan
              </span>
            </div>

            <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white font-['Outfit'] mb-1">
              PRO
            </h3>
            <div className="text-3xl font-extrabold text-slate-900 dark:text-white font-['Outfit'] mb-6">
              $29 <span className="text-xs font-normal text-slate-400">/ month</span>
            </div>

            <ul className="space-y-3 text-xs text-slate-600 dark:text-slate-300 mb-8">
              <li className="flex items-center gap-2.5 font-semibold text-slate-900 dark:text-white">
                <Check className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                <span>100 Website Scans per day</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                <span>Gemini AI Insights & Recommendations</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                <span>Unlimited Keyword Rank Tracking</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                <span>Historical Position Recharts Graphs</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                <span>Priority Crawling Speed & Full History</span>
              </li>
            </ul>
          </div>

          <button
            onClick={handleUpgrade}
            disabled={upgrading || user?.plan === 'PRO'}
            className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-2 transition-all shadow-md disabled:opacity-50"
          >
            {upgrading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : user?.plan === 'PRO' ? (
              'You Are Currently PRO'
            ) : (
              'Upgrade to PRO Now'
            )}
          </button>
        </div>

      </div>

    </div>
  );
}
