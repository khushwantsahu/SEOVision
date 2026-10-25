import React, { useState, useEffect } from 'react';
import { rankService } from '../services/rankService';
import { useAuth } from '../context/AuthContext';
import KeywordTable from '../components/KeywordTable';
import RankChart from '../components/RankChart';
import Modal from '../components/Modal';
import {
  Target,
  Plus,
  Search,
  Filter,
  ArrowUpDown,
  Loader2,
  TrendingUp,
  Globe,
  Sparkles
} from 'lucide-react';

export default function RankTrackerPage() {
  const { showToast } = useAuth();
  const [keywords, setKeywords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedKeyword, setSelectedKeyword] = useState(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newKeyword, setNewKeyword] = useState('');
  const [newTargetUrl, setNewTargetUrl] = useState('');
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    fetchKeywords();
  }, [searchQuery, statusFilter]);

  const fetchKeywords = async () => {
    try {
      setLoading(true);
      const res = await rankService.getKeywords(searchQuery, statusFilter);
      if (res.success) {
        setKeywords(res.data);
        if (res.data.length > 0 && !selectedKeyword) {
          setSelectedKeyword(res.data[0]);
        }
      }
    } catch (err) {
      showToast(err.message || 'Failed to fetch tracked keywords', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleAddKeywordSubmit = async (e) => {
    e.preventDefault();
    if (!newKeyword.trim() || !newTargetUrl.trim()) {
      showToast('Please enter both keyword and target website URL', 'error');
      return;
    }

    setAdding(true);
    try {
      const res = await rankService.addKeyword({
        keyword: newKeyword.trim(),
        targetUrl: newTargetUrl.trim()
      });
      if (res.success) {
        showToast('Keyword added for rank tracking!', 'success');
        setNewKeyword('');
        setNewTargetUrl('');
        setIsModalOpen(false);
        fetchKeywords();
      }
    } catch (err) {
      showToast(err.message || 'Failed to add keyword', 'error');
    } finally {
      setAdding(false);
    }
  };

  const handleRefresh = async (id) => {
    try {
      showToast('Re-checking ranking position...', 'info');
      const res = await rankService.refreshRank(id);
      if (res.success) {
        showToast('Position updated successfully!', 'success');
        fetchKeywords();
      }
    } catch (err) {
      showToast(err.message || 'Failed to update rank', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to stop tracking this keyword?')) {
      try {
        await rankService.deleteKeyword(id);
        showToast('Tracked keyword deleted', 'info');
        if (selectedKeyword?._id === id) {
          setSelectedKeyword(null);
        }
        fetchKeywords();
      } catch (err) {
        showToast(err.message || 'Failed to delete keyword', 'error');
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Header matching reference screenshot #1 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white font-['Outfit'] tracking-tight">
            Rank Tracker
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Track your keyword rankings on Google — updated daily.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-slate-900 dark:bg-blue-600 hover:bg-slate-800 dark:hover:bg-blue-700 text-white font-semibold text-xs px-5 py-2.5 rounded-full flex items-center justify-center gap-2 transition-all shadow-md self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Track Keyword</span>
        </button>
      </div>

      {/* Filter & Search Bar matching screenshot #1 */}
      <div className="flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
          <input
            type="text"
            placeholder="Search keywords or domains..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/30"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:flex-none">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-full px-4 py-2.5 focus:outline-none appearance-none pr-8 cursor-pointer"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="unranked">Unranked</option>
            </select>
            <Filter className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-3.5 pointer-events-none" />
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-4 py-2.5 rounded-full text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 shrink-0">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <span>Newest First</span>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      {loading ? (
        <div className="saas-card p-12 flex flex-col items-center justify-center">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-2" />
          <p className="text-xs text-slate-400">Loading tracked keywords...</p>
        </div>
      ) : keywords.length === 0 ? (
        /* Empty State Card matching screenshot #1 */
        <div className="saas-card py-16 px-6 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800/80 text-slate-400 dark:text-slate-500 flex items-center justify-center mb-4">
            <Target className="w-8 h-8 stroke-[1.5]" />
          </div>

          <h3 className="text-lg font-bold text-slate-900 dark:text-white font-['Outfit'] mb-1">
            No keywords tracked yet
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mb-6">
            Add your first keyword and URL to start tracking your Google rankings.
          </p>

          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-slate-900 dark:bg-blue-600 hover:bg-slate-800 dark:hover:bg-blue-700 text-white font-semibold text-xs px-6 py-3 rounded-xl transition-all shadow-md"
          >
            Track Your First Keyword
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          
          {/* Recharts Ranking History Visualization */}
          {selectedKeyword && (
            <div className="saas-card p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider block">
                    Position History
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white font-['Outfit']">
                    "{selectedKeyword.keyword}" on {selectedKeyword.targetUrl}
                  </h3>
                </div>

                <div className="text-right">
                  <span className="text-xs text-slate-400 block">Current Rank</span>
                  <span className="text-2xl font-extrabold text-slate-900 dark:text-white font-['Outfit']">
                    #{selectedKeyword.currentPosition}
                  </span>
                </div>
              </div>

              <RankChart history={selectedKeyword.history} />
            </div>
          )}

          {/* Keywords Table */}
          <div className="saas-card p-6">
            <h3 className="text-base font-bold text-slate-900 dark:text-white font-['Outfit'] mb-4">
              All Tracked Keywords ({keywords.length})
            </h3>
            <KeywordTable
              keywords={keywords}
              onRefresh={handleRefresh}
              onDelete={handleDelete}
              onSelect={(kw) => setSelectedKeyword(kw)}
            />
          </div>

        </div>
      )}

      {/* Modal for Adding New Keyword */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add Keyword for Rank Tracking"
      >
        <form onSubmit={handleAddKeywordSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Target Keyword
            </label>
            <input
              type="text"
              required
              placeholder="e.g., best seo analyzer software"
              value={newKeyword}
              onChange={(e) => setNewKeyword(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/30"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Target Website Domain / URL
            </label>
            <input
              type="text"
              required
              placeholder="e.g., example.com"
              value={newTargetUrl}
              onChange={(e) => setNewTargetUrl(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/30"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={adding}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 shadow-md disabled:opacity-50"
            >
              {adding ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Start Tracking'}
            </button>
          </div>
        </form>
      </Modal>

    </div>
  );
}
