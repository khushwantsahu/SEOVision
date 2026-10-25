import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { analysisService } from '../services/analysisService';
import { useAuth } from '../context/AuthContext';
import {
  History,
  Search,
  ArrowUpDown,
  ExternalLink,
  Trash2,
  BarChart2,
  Loader2,
  Globe
} from 'lucide-react';

export default function HistoryPage() {
  const { showToast } = useAuth();
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    fetchHistory();
  }, [search, sortBy]);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const res = await analysisService.getAnalyses(search, sortBy);
      if (res.success) {
        setAnalyses(res.data);
      }
    } catch (err) {
      showToast(err.message || 'Failed to fetch history', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, domain) => {
    if (window.confirm(`Delete analysis report for ${domain}?`)) {
      try {
        await analysisService.deleteAnalysis(id);
        showToast('Analysis deleted', 'info');
        fetchHistory();
      } catch (err) {
        showToast(err.message || 'Failed to delete analysis', 'error');
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white font-['Outfit'] tracking-tight">
          Analysis History & Insights
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Review all previous website audits and track score improvements over time.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
          <input
            type="text"
            placeholder="Search domain or URL history..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/30"
          />
        </div>

        <div className="relative w-full sm:w-auto">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full sm:w-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-full px-4 py-2.5 focus:outline-none cursor-pointer appearance-none pr-8"
          >
            <option value="newest">Sort: Newest First</option>
            <option value="oldest">Sort: Oldest First</option>
            <option value="score_desc">Sort: Highest Score</option>
            <option value="score_asc">Sort: Lowest Score</option>
          </select>
          <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-3.5 pointer-events-none" />
        </div>
      </div>

      {/* Main List */}
      {loading ? (
        <div className="saas-card p-12 flex flex-col items-center justify-center">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-2" />
          <p className="text-xs text-slate-400">Loading analysis history...</p>
        </div>
      ) : analyses.length === 0 ? (
        <div className="saas-card py-16 px-6 text-center flex flex-col items-center justify-center">
          <History className="w-12 h-12 text-slate-300 dark:text-slate-700 mb-3" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-white font-['Outfit'] mb-1">
            No history found
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mb-6">
            You haven't run any website analyses yet matching your query.
          </p>
          <Link
            to="/analyze"
            className="bg-slate-900 dark:bg-blue-600 text-white font-semibold text-xs px-6 py-3 rounded-xl"
          >
            Run Your First Analysis
          </Link>
        </div>
      ) : (
        <div className="saas-card p-6">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  <th className="py-3.5 px-4">Domain</th>
                  <th className="py-3.5 px-4">Overall Score</th>
                  <th className="py-3.5 px-4">Technical</th>
                  <th className="py-3.5 px-4">On-Page</th>
                  <th className="py-3.5 px-4">Scan Date</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs">
                {analyses.map((item) => (
                  <tr key={item._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="py-4 px-4 font-semibold text-slate-900 dark:text-white font-mono">
                      <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4 text-blue-500 shrink-0" />
                        <span>{item.domain}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`font-extrabold px-2.5 py-1 rounded-lg text-xs ${
                        item.score >= 80 ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300' :
                        item.score >= 50 ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300' :
                        'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
                      }`}>
                        {item.score} / 100
                      </span>
                    </td>
                    <td className="py-4 px-4 text-slate-600 dark:text-slate-300 font-medium">
                      {item.categoryScores?.technical || 0}%
                    </td>
                    <td className="py-4 px-4 text-slate-600 dark:text-slate-300 font-medium">
                      {item.categoryScores?.onPage || 0}%
                    </td>
                    <td className="py-4 px-4 text-slate-500 dark:text-slate-400">
                      {new Date(item.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                    </td>
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/analysis/${item._id}`}
                          className="px-3 py-1.5 bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-semibold rounded-lg hover:bg-blue-100 flex items-center gap-1"
                        >
                          <span>View Report</span>
                          <ExternalLink className="w-3 h-3" />
                        </Link>
                        <button
                          onClick={() => handleDelete(item._id, item.domain)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                          title="Delete record"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}
