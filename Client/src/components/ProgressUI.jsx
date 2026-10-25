import React from 'react';
import { CheckCircle2, Loader2, Sparkles, FileText, Globe } from 'lucide-react';

export default function ProgressUI({ url, currentStep = 2 }) {
  // Steps configuration matching exact reference screenshot #2
  const steps = [
    {
      id: 1,
      title: 'Connecting to browser',
      desc: 'Creating cloud browser session...',
      icon: Globe
    },
    {
      id: 2,
      title: 'Scanning website',
      desc: 'Extracting meta tags, links, images...',
      icon: FileText
    },
    {
      id: 3,
      title: 'AI Analysis',
      desc: 'Gemini is analyzing your SEO data...',
      icon: Sparkles
    },
    {
      id: 4,
      title: 'Report Ready',
      desc: 'Your SEO report is complete!',
      icon: CheckCircle2
    }
  ];

  return (
    <div className="max-w-xl mx-auto py-12 px-4 flex flex-col items-center justify-center">
      {/* Top Spinner */}
      <div className="mb-6 relative flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin stroke-[2.5]" />
      </div>

      {/* Title & URL */}
      <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white font-['Outfit'] mb-1 text-center">
        Analyzing Your Website
      </h2>
      <p className="text-sm font-mono text-slate-500 dark:text-slate-400 mb-8 text-center break-all">
        {url}
      </p>

      {/* Progress Steps List */}
      <div className="w-full space-y-3.5">
        {steps.map((step) => {
          const isDone = currentStep > step.id;
          const isActive = currentStep === step.id;
          const isPending = currentStep < step.id;

          return (
            <div
              key={step.id}
              className={`p-4 rounded-2xl border transition-all flex items-center justify-between ${
                isActive
                  ? 'bg-slate-900 text-white dark:bg-slate-800 dark:text-white border-slate-900 dark:border-slate-700 shadow-md scale-[1.02]'
                  : isDone
                  ? 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 text-slate-700 dark:text-slate-200'
                  : 'bg-slate-50/60 dark:bg-slate-950/40 border-slate-100 dark:border-slate-900 text-slate-400 dark:text-slate-600 opacity-60'
              }`}
            >
              <div className="flex items-center gap-3.5">
                {/* Step Status Badge */}
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                    isActive
                      ? 'bg-blue-600 text-white'
                      : isDone
                      ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400'
                      : 'bg-slate-200/60 text-slate-400 dark:bg-slate-800 dark:text-slate-600'
                  }`}
                >
                  {isDone ? (
                    <CheckCircle2 className="w-5 h-5 stroke-[2.5]" />
                  ) : isActive ? (
                    <step.icon className="w-5 h-5 animate-pulse" />
                  ) : (
                    <step.icon className="w-5 h-5" />
                  )}
                </div>

                <div>
                  <h4
                    className={`text-sm font-bold font-['Outfit'] ${
                      isActive ? 'text-white' : 'text-slate-900 dark:text-slate-100'
                    }`}
                  >
                    {step.title}
                  </h4>
                  <p
                    className={`text-xs ${
                      isActive ? 'text-slate-300' : 'text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    {step.desc}
                  </p>
                </div>
              </div>

              {/* Status Spinner / Check */}
              {isActive && (
                <Loader2 className="w-5 h-5 text-white animate-spin shrink-0" />
              )}
            </div>
          );
        })}
      </div>

      <p className="text-xs text-slate-400 dark:text-slate-500 mt-8 text-center">
        This may take 15-30 seconds depending on the website.
      </p>
    </div>
  );
}
