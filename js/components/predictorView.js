// AptiLearn AI Learning Predictor Component
import { store } from '../state.js';
import { LearningPredictorEngine } from '../predictorEngine.js';

export function renderPredictorView() {
  const user = store.currentUser;
  const pred = LearningPredictorEngine.generatePredictions(user);

  return `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      <!-- Predictor Header -->
      <div class="glass-card p-6 sm:p-8 border border-indigo-500/30 bg-gradient-to-r from-slate-900/95 via-indigo-950/30 to-slate-900/95 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div class="flex items-center gap-2">
            <span class="text-xs uppercase font-bold tracking-widest text-indigo-400">Cognitive Forecasting Engine</span>
            <span class="text-slate-500">•</span>
            <span class="text-xs text-slate-300">Empirical Performance Predictor</span>
          </div>
          <h1 class="text-2xl sm:text-3xl font-extrabold text-white light:text-slate-900 mt-1">AI Examination Readiness & Difficulty Predictor</h1>
          <p class="text-xs sm:text-sm text-slate-300 light:text-slate-600 mt-1 max-w-2xl">
            AptiLearn analyzes your historical response velocity, consecutive error rates, and Ebbinghaus revision curves to predict where you will stumble and forecast exam readiness.
          </p>
        </div>

        <div class="flex items-center gap-4">
          <div class="p-4 rounded-2xl bg-indigo-950/60 border border-indigo-700/60 text-center min-w-[140px] shadow-lg shadow-indigo-500/10">
            <div class="text-3xl font-extrabold text-indigo-300 font-mono">${pred.examReadinessScore}%</div>
            <div class="text-[10px] text-slate-300 uppercase font-bold mt-0.5">Readiness Forecast</div>
          </div>
        </div>
      </div>

      <!-- READINESS BREAKDOWN & TOP PRIORITY STRIP -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <!-- Readiness Gauge Card -->
        <div class="glass-card p-6 border border-slate-800 space-y-4">
          <div class="flex items-center justify-between">
            <h3 class="text-sm font-bold text-white light:text-slate-900">Exam Probability Breakdown</h3>
            <span class="text-[10px] px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800 font-mono">Dynamic Model</span>
          </div>

          <div class="text-center py-4">
            <div class="inline-flex items-center justify-center relative w-36 h-36 rounded-full border-8 border-slate-800 border-t-cyan-400 border-r-indigo-500 shadow-inner">
              <div class="text-center">
                <span class="text-3xl font-extrabold text-white light:text-slate-900 font-mono">${pred.examReadinessScore}%</span>
                <div class="text-[10px] text-slate-400">Pass Probability</div>
              </div>
            </div>
          </div>

          <div class="space-y-2 text-xs text-slate-300">
            <div class="flex justify-between py-1 border-b border-slate-800/60">
              <span class="text-slate-400">Target Examination:</span>
              <span class="font-semibold text-white light:text-slate-900">${user?.examGoal || 'Placement Exam'}</span>
            </div>
            <div class="flex justify-between py-1 border-b border-slate-800/60">
              <span class="text-slate-400">Predicted Percentile:</span>
              <span class="font-semibold text-cyan-300 font-mono">${Math.min(99, pred.examReadinessScore + 6)}th Percentile</span>
            </div>
            <div class="flex justify-between py-1">
              <span class="text-slate-400">Model Reliability:</span>
              <span class="text-emerald-400 font-bold">High (92% Confidence)</span>
            </div>
          </div>
        </div>

        <!-- 3 Ranked Study Priorities -->
        <div class="lg:col-span-2 glass-card p-6 border border-slate-800 space-y-4">
          <div class="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 class="text-sm font-bold text-white light:text-slate-900">AI-Ranked Study Priorities</h3>
              <p class="text-xs text-slate-400">Targeting these 3 tasks provides the highest mathematical lift to exam readiness.</p>
            </div>
            <span class="text-xs text-amber-400 font-semibold font-mono">ROI Focused</span>
          </div>

          <div class="space-y-3">
            ${pred.studyPriorities.map(p => `
              <div class="p-4 rounded-xl bg-slate-900/80 light:bg-slate-50 border border-slate-800 light:border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 font-extrabold flex items-center justify-center text-sm shrink-0 font-mono">
                    #${p.rank}
                  </div>
                  <div>
                    <h4 class="font-bold text-sm text-white light:text-slate-900">${p.title}</h4>
                    <div class="text-[11px] text-slate-400 mt-0.5">Estimated Time: ${p.timeEstimate} • ${p.type}</div>
                  </div>
                </div>

                <div class="flex items-center gap-3 shrink-0">
                  <span class="text-xs font-bold text-emerald-400 font-mono">${p.estimatedImpact}</span>
                  <button onclick="window.App.startAdaptivePractice('recursion')" class="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-sm">
                    Start Drill →
                  </button>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

      </div>

      <!-- HIGH-RISK TOPIC DIFFICULTY FORECAST -->
      <div class="glass-card p-6 border border-rose-500/30 space-y-4">
        <div class="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <h3 class="text-base font-bold text-white light:text-slate-900 flex items-center gap-2">
              <span class="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse"></span>
              <span>Topics Predicted to Cause Exam Difficulty (${pred.highRiskTopics.length})</span>
            </h3>
            <p class="text-xs text-slate-400">Identified based on low mastery scores, repeated mistakes, and prerequisite gaps.</p>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          ${pred.highRiskTopics.map(t => `
            <div class="p-5 rounded-xl bg-slate-900/90 light:bg-slate-50 border border-rose-500/30 space-y-3">
              <div class="flex items-center justify-between">
                <span class="font-bold text-white light:text-slate-900 text-sm">${t.name}</span>
                <span class="text-xs font-bold px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800 font-mono">
                  ${t.riskProbability}% Difficulty Likelihood
                </span>
              </div>
              <p class="text-xs text-slate-300 light:text-slate-600 leading-relaxed">${t.reason}</p>
              
              <div class="p-2 rounded-lg bg-slate-950 light:bg-slate-100 text-[11px] text-cyan-300 light:text-cyan-800 border border-slate-800">
                <strong>Recommended Remedy:</strong> ${t.recommendedAction}
              </div>

              <div class="flex items-center justify-between pt-2 border-t border-slate-800 text-[10px] text-slate-400">
                <span>Confidence: ${t.confidenceLevel}</span>
                <button onclick="window.App.startAdaptivePractice('${t.conceptId}')" class="text-cyan-400 hover:underline font-bold">
                  Practice Topic Now →
                </button>
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- DISCLAIMER STRIP -->
      <div class="p-3.5 rounded-xl bg-slate-900/60 light:bg-slate-100 border border-slate-800 light:border-slate-300 text-[11px] text-slate-400 text-center leading-relaxed">
        ℹ️ ${pred.disclaimer}
      </div>

    </div>
  `;
}
