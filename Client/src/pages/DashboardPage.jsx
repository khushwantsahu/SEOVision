import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { dashboardService } from '../services/dashboardService';
import StatCard from '../components/StatCard';
import {
  Search,
  ArrowRight,
  BarChart2,
  Award,
  Zap,
  Target,
  ExternalLink,
  Clock,
  Loader2
} from 'lucide-react';

export default function DashboardPage() {
  const { user, showToast } = useAuth();
  const [urlInput, setUrlInput] = useState('');
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const res = await dashboardService.getStats();
      if (res.success) {
        setStats(res.data);
      }
    } catch (err) {
      showToast(err.message || 'Failed to load dashboard data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyzeSubmit = (e) => {
    e.preventDefault();
    if (!urlInput.trim()) {
      showToast('Please enter a website URL', 'error');
      return;
    }
    navigate('/analyze', { state: { initialUrl: urlInput } });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header section matching prompt specification */}
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white font-['Outfit'] tracking-tight">
          Welcome back, {user?.name || 'User'}
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Analyze websites and improve your SEO performance.
        </p>
      </div>

      {/* Main Analyzer Input Bar */}
      <div className="saas-card p-6 bg-gradient-to-r from-blue-900 to-slate-900 text-white border-none shadow-xl">
        <h3 className="text-lg font-bold font-['Outfit'] mb-2">
          Run Instant Website Audit
        </h3>
        <p className="text-xs text-blue-200 mb-4">
          Enter any domain URL to extract technical tags, accessibility, performance, and AI optimizations.
        </p>

        <form onSubmit={handleAnalyzeSubmit} className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
            <input
              type="text"
              placeholder="Enter website URL (e.g., example.com)"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-xs rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs px-6 py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md shrink-0"
          >
            <span>Analyze</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>

      {/* Statistics Cards Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Scans"
            value={stats?.totalScans || 0}
            icon={BarChart2}
            color="blue"
            subtext="Lifetime analyses executed"
          />
          <StatCard
            title="Average SEO Score"
            value={stats?.averageScore ? `${stats.averageScore}/100` : '0/100'}
            icon={Award}
            color="emerald"
            subtext="Across all scanned sites"
          />
          <StatCard
            title="Scans Remaining Today"
            value={`${stats?.scansRemaining || 0} / ${stats?.maxDailyScans || 5}`}
            icon={Zap}
            color="amber"
            subtext={`${stats?.plan || 'FREE'} tier limit`}
          />
          <StatCard
            title="Tracked Keywords"
            value={stats?.trackedKeywordsCount || 0}
            icon={Target}
            color="purple"
            subtext="Rank positions monitored"
          />
        </div>
      )}

      {/* Recent Analyses Section */}
      <div className="saas-card p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900 dark:text-white font-['Outfit']">
            Recent Analyses
          </h3>
          <Link
            to="/history"
            className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
          >
            <span>View All History</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-10">
            <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
          </div>
        ) : !stats?.recentAnalyses || stats.recentAnalyses.length === 0 ? (
          <div className="text-center py-12 px-4 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
            <BarChart2 className="w-10 h-10 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 font-['Outfit'] mb-1">
              No analyses yet
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Enter a URL above to run your first SEO analysis.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="py-3 px-3">Domain</th>
                  <th className="py-3 px-3">SEO Score</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3">Date</th>
                  <th className="py-3 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs">
                {stats.recentAnalyses.map((item) => (
                  <tr key={item._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="py-3 px-3 font-semibold text-slate-900 dark:text-white font-mono">
                      {item.domain}
                    </td>
                    <td className="py-3 px-3">
                      <span className={`font-extrabold px-2 py-0.5 rounded-full text-xs ${
                        item.score >= 80 ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300' :
                        item.score >= 50 ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300' :
                        'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
                      }`}>
                        {item.score} / 100
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span className="inline-flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        Completed
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-500 dark:text-slate-400 font-medium">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <Link
                        to={`/analysis/${item._id}`}
                        className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1"
                      >
                        <span>View</span>
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
