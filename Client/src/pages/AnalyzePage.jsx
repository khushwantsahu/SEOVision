import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { analysisService } from '../services/analysisService';
import ProgressUI from '../components/ProgressUI';
import { Search, ArrowRight } from 'lucide-react';

export default function AnalyzePage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { showToast } = useAuth();

  const [url, setUrl] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  // Check if initial URL passed via navigation state (e.g. from Landing or Dashboard)
  useEffect(() => {
    if (location.state?.initialUrl) {
      const initUrl = location.state.initialUrl;
      setUrl(initUrl);
      runAnalysis(initUrl);
    }
  }, [location.state]);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!url.trim()) {
      showToast('Please enter a website URL to analyze', 'error');
      return;
    }
    runAnalysis(url.trim());
  };

  const handleExampleClick = (exampleDomain) => {
    setUrl(exampleDomain);
    runAnalysis(exampleDomain);
  };

  const runAnalysis = async (targetUrl) => {
    setAnalyzing(true);
    setCurrentStep(1);

    // Step 1: Connecting to website
    const step1Timer = setTimeout(() => setCurrentStep(2), 800);
    // Step 2: Scanning website
    const step2Timer = setTimeout(() => setCurrentStep(3), 2000);

    try {
      const response = await analysisService.createAnalysis(targetUrl);

      // Step 3: AI Analysis done, Step 4: Report Ready
      setCurrentStep(4);

      if (response.success && response.data?.id) {
        showToast('Analysis completed successfully!', 'success');
        setTimeout(() => {
          navigate(`/analysis/${response.data.id}`);
        }, 600);
      } else {
        throw new Error(response.message || 'Analysis failed to complete');
      }
    } catch (err) {
      clearTimeout(step1Timer);
      clearTimeout(step2Timer);
      setAnalyzing(false);
      showToast(err.message || 'Unable to analyze website. Please check the URL and try again.', 'error');
    }
  };

  // If currently analyzing, show the exact Progress UI matching screenshot #2
  if (analyzing) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <ProgressUI url={url} currentStep={currentStep} />
      </div>
    );
  }

  // Initial Form UI matching reference screenshot #3
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 py-12 max-w-4xl mx-auto text-center">
      
      <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white font-['Outfit'] mb-3 tracking-tight">
        Analyze Any Website
      </h1>
      
      <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-xl mx-auto mb-10">
        Enter a URL to get a comprehensive AI-powered SEO audit report.
      </p>

      {/* Main Search Input Form matching screenshot #3 */}
      <div className="w-full max-w-2xl mb-8">
        <form
          onSubmit={handleFormSubmit}
          className="flex flex-col sm:flex-row items-center bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-2.5 rounded-2xl sm:rounded-full shadow-lg hover:border-blue-300 dark:hover:border-blue-700 transition-all gap-2"
        >
          <div className="flex items-center gap-3 px-4 w-full sm:w-auto flex-1">
            <Search className="w-5 h-5 text-slate-400 shrink-0" />
            <input
              type="text"
              placeholder="Enter website URL (e.g., example.com)"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full bg-transparent border-none text-slate-900 dark:text-white text-sm focus:outline-none placeholder-slate-400 py-2.5"
            />
          </div>
          <button
            type="submit"
            className="w-full sm:w-auto bg-slate-900 dark:bg-blue-600 hover:bg-slate-800 dark:hover:bg-blue-700 text-white px-8 py-3.5 rounded-xl sm:rounded-full text-sm font-semibold flex items-center justify-center gap-2 transition-all shadow-md shrink-0"
          >
            <span>Analyze</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>

      {/* Quick Example Tags matching screenshot #3 */}
      <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 flex-wrap justify-center">
        <span>Examples:</span>
        {['github.com', 'stripe.com', 'vercel.com'].map((domain) => (
          <button
            key={domain}
            onClick={() => handleExampleClick(domain)}
            className="font-medium hover:text-blue-600 dark:hover:text-blue-400 hover:underline transition-colors"
          >
            {domain}
          </button>
        ))}
      </div>

    </div>
  );
}
