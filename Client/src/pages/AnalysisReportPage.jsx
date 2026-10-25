import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { analysisService } from '../services/analysisService';
import { useAuth } from '../context/AuthContext';
import ScoreGauge from '../components/ScoreGauge';
import CategoryScoreCard from '../components/CategoryScoreCard';
import SEOIssueCard from '../components/SEOIssueCard';
import RecommendationCard from '../components/RecommendationCard';
import {
  Globe,
  ArrowLeft,
  Share2,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Zap,
  Shield,
  FileText,
  Key,
  ExternalLink,
  Copy,
  Loader2
} from 'lucide-react';

export default function AnalysisReportPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useAuth();

  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchReport();
  }, [id]);

  const fetchReport = async () => {
    try {
      setLoading(true);
      const res = await analysisService.getAnalysisById(id);
      if (res.success) {
        setReport(res.data);
      }
    } catch (err) {
      showToast(err.message || 'Failed to load SEO report', 'error');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this analysis report?')) {
      try {
        await analysisService.deleteAnalysis(id);
        showToast('Analysis report deleted successfully', 'info');
        navigate('/history');
      } catch (err) {
        showToast(err.message || 'Failed to delete report', 'error');
      }
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    showToast('Report URL copied to clipboard!', 'success');
  };

  if (loading) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-3" />
        <p className="text-xs text-slate-500 font-medium">Loading report data...</p>
      </div>
    );
  }

  if (!report) return null;

  const { score, categoryScores, seoData, issues, recommendations, aiInsights, keywords } = report;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Breadcrumb & Action bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyLink}
            className="flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-all"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>Copy Link</span>
          </button>
          <button
            onClick={handleDelete}
            className="flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 hover:bg-rose-100 rounded-xl transition-all"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete</span>
          </button>
        </div>
      </div>

      {/* Main Overview Header Card */}
      <div className="saas-card p-6 sm:p-8 bg-white dark:bg-slate-900 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="space-y-3 text-center md:text-left flex-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 text-xs font-semibold">
            <Globe className="w-3.5 h-3.5" />
            <span>SEO Vision Report</span>
          </div>

          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white font-['Outfit'] tracking-tight">
            {report.domain}
          </h1>

          <a
            href={report.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-blue-600 dark:text-blue-400 font-mono hover:underline inline-flex items-center gap-1 break-all"
          >
            {report.url}
            <ExternalLink className="w-3 h-3" />
          </a>

          <p className="text-xs text-slate-500 dark:text-slate-400">
            Analyzed on {new Date(report.createdAt).toLocaleString()}
          </p>
        </div>

        {/* Score Radial Gauge */}
        <div className="shrink-0">
          <ScoreGauge score={score} label="Overall Audit Score" />
        </div>
      </div>

      {/* Category Scores Breakdown Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <CategoryScoreCard title="Technical" score={categoryScores?.technical || 0} description="HTTPS, canonical, robots.txt, sitemap" />
        <CategoryScoreCard title="On-Page" score={categoryScores?.onPage || 0} description="Title length, meta description, H1 tags" />
        <CategoryScoreCard title="Performance" score={categoryScores?.performance || 0} description="Server response time and HTML size" />
        <CategoryScoreCard title="Accessibility" score={categoryScores?.accessibility || 0} description="Viewport tag, HTML lang, image alt text" />
        <CategoryScoreCard title="Content" score={categoryScores?.content || 0} description="Heading structure and internal links" />
        <CategoryScoreCard title="Best Practices" score={categoryScores?.bestPractices || 0} description="Mobile optimization and security" />
      </div>

      {/* Tab Nav Menu */}
      <div className="border-b border-slate-200 dark:border-slate-800 flex gap-4 overflow-x-auto pb-1 text-xs font-bold">
        {[
          { id: 'overview', label: `Issues Detected (${issues?.length || 0})`, icon: AlertTriangle },
          { id: 'ai', label: 'AI Recommendations', icon: Sparkles },
          { id: 'technical', label: 'Technical Details', icon: Shield },
          { id: 'keywords', label: 'Extracted Keywords', icon: Key }
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 py-2.5 px-3 border-b-2 transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400'
                  : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Issues Detected */}
      {activeTab === 'overview' && (
        <div className="space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white font-['Outfit']">
            All Audit Findings & Vulnerabilities
          </h3>
          {issues && issues.length > 0 ? (
            <div className="space-y-3">
              {issues.map((issue, idx) => (
                <SEOIssueCard key={idx} issue={issue} />
              ))}
            </div>
          ) : (
            <div className="saas-card p-6 text-center text-xs text-slate-500">
              No critical issues detected! Your site meets recommended baseline standards.
            </div>
          )}
        </div>
      )}

      {/* Tab 2: AI Recommendations */}
      {activeTab === 'ai' && (
        <div className="space-y-6">
          
          {/* AI Summary Banner */}
          <div className="saas-card p-6 bg-gradient-to-r from-blue-900 to-indigo-950 text-white border-none shadow-xl space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <h3 className="text-base font-bold font-['Outfit']">
                AI Executive Summary
              </h3>
            </div>
            <p className="text-xs text-blue-100 leading-relaxed">
              {aiInsights?.summary || 'No AI summary generated for this scan.'}
            </p>
          </div>

          {/* Title & Meta Recommendations */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="saas-card p-5 space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                Suggested Title Tag
              </span>
              <p className="text-xs font-mono font-semibold text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
                {aiInsights?.suggestedTitle || seoData?.title}
              </p>
            </div>

            <div className="saas-card p-5 space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                Suggested Meta Description
              </span>
              <p className="text-xs font-mono text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
                {aiInsights?.suggestedMetaDescription || seoData?.metaDescription}
              </p>
            </div>
          </div>

          {/* Actionable Steps & Content Tips */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="saas-card p-6 space-y-3">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white font-['Outfit'] flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                Actionable Optimization Steps
              </h4>
              <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                {aiInsights?.actionableSteps?.map((step, idx) => (
                  <li key={idx} className="flex items-start gap-2 bg-slate-50 dark:bg-slate-850 p-2.5 rounded-lg">
                    <span className="font-bold text-blue-600 dark:text-blue-400">{idx + 1}.</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="saas-card p-6 space-y-3">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white font-['Outfit'] flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-500" />
                Content & Keyword Tips
              </h4>
              <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                {aiInsights?.contentTips?.map((tip, idx) => (
                  <li key={idx} className="flex items-start gap-2 bg-slate-50 dark:bg-slate-850 p-2.5 rounded-lg">
                    <span className="font-bold text-purple-600 dark:text-purple-400">•</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

        </div>
      )}

      {/* Tab 3: Technical Details */}
      {activeTab === 'technical' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="saas-card p-6 space-y-4">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white font-['Outfit']">
              Crawled Technical Factors
            </h4>
            <dl className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
              <div className="py-2.5 flex justify-between">
                <dt className="text-slate-500">HTTPS Encryption</dt>
                <dd className="font-semibold text-slate-900 dark:text-white">{seoData?.isHttps ? 'Yes (Secure)' : 'No (HTTP)'}</dd>
              </div>
              <div className="py-2.5 flex justify-between">
                <dt className="text-slate-500">Canonical Tag</dt>
                <dd className="font-mono text-slate-900 dark:text-white truncate max-w-xs">{seoData?.canonicalUrl || 'Missing'}</dd>
              </div>
              <div className="py-2.5 flex justify-between">
                <dt className="text-slate-500">Robots.txt File</dt>
                <dd className="font-semibold text-slate-900 dark:text-white">{seoData?.hasRobotsTxt ? 'Present' : 'Missing'}</dd>
              </div>
              <div className="py-2.5 flex justify-between">
                <dt className="text-slate-500">XML Sitemap</dt>
                <dd className="font-semibold text-slate-900 dark:text-white">{seoData?.hasSitemap ? 'Present' : 'Missing'}</dd>
              </div>
              <div className="py-2.5 flex justify-between">
                <dt className="text-slate-500">Mobile Viewport</dt>
                <dd className="font-semibold text-slate-900 dark:text-white">{seoData?.viewport ? 'Configured' : 'Missing'}</dd>
              </div>
              <div className="py-2.5 flex justify-between">
                <dt className="text-slate-500">HTML Lang Attribute</dt>
                <dd className="font-semibold text-slate-900 dark:text-white">{seoData?.htmlLang || 'Missing'}</dd>
              </div>
            </dl>
          </div>

          <div className="saas-card p-6 space-y-4">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white font-['Outfit']">
              Performance & Resource Counts
            </h4>
            <dl className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
              <div className="py-2.5 flex justify-between">
                <dt className="text-slate-500">Server Response Time</dt>
                <dd className="font-bold text-slate-900 dark:text-white">{seoData?.performanceMetrics?.responseTimeMs} ms</dd>
              </div>
              <div className="py-2.5 flex justify-between">
                <dt className="text-slate-500">HTML Document Size</dt>
                <dd className="font-bold text-slate-900 dark:text-white">{Math.round((seoData?.performanceMetrics?.htmlSizeBytes || 0) / 1024)} KB</dd>
              </div>
              <div className="py-2.5 flex justify-between">
                <dt className="text-slate-500">Total Images</dt>
                <dd className="font-semibold text-slate-900 dark:text-white">{seoData?.images?.total || 0} ({seoData?.images?.missingAlt || 0} missing ALT)</dd>
              </div>
              <div className="py-2.5 flex justify-between">
                <dt className="text-slate-500">Internal Links</dt>
                <dd className="font-semibold text-slate-900 dark:text-white">{seoData?.links?.internal || 0}</dd>
              </div>
              <div className="py-2.5 flex justify-between">
                <dt className="text-slate-500">External Links</dt>
                <dd className="font-semibold text-slate-900 dark:text-white">{seoData?.links?.external || 0}</dd>
              </div>
            </dl>
          </div>
        </div>
      )}

      {/* Tab 4: Keywords */}
      {activeTab === 'keywords' && (
        <div className="saas-card p-6 space-y-4">
          <h4 className="text-sm font-bold text-slate-900 dark:text-white font-['Outfit']">
            Extracted Top Keywords & Frequencies
          </h4>
          {keywords && keywords.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 font-bold text-slate-400 uppercase tracking-wider">
                    <th className="py-3 px-3">Keyword</th>
                    <th className="py-3 px-3">Frequency</th>
                    <th className="py-3 px-3">Estimated Density</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {keywords.map((kw, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                      <td className="py-3 px-3 font-semibold text-slate-900 dark:text-white">{kw.keyword}</td>
                      <td className="py-3 px-3 text-slate-600 dark:text-slate-300">{kw.frequency} times</td>
                      <td className="py-3 px-3 font-mono text-blue-600 dark:text-blue-400 font-bold">{kw.density}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-xs text-slate-400">No keyword text extracted from this page.</p>
          )}
        </div>
      )}

    </div>
  );
}
