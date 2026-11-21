// LearnIQ Misconception Analysis & Remediation Center Component
import { store } from '../state.js';
import { MisconceptionEngine } from '../misconceptionEngine.js';

export function renderMisconceptionView() {
  const user = store.currentUser;
  const misconceptions = user?.activeMisconceptions || [];
  const activeList = misconceptions.filter(m => !m.resolved);
  const resolvedList = misconceptions.filter(m => m.resolved);

  return `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      <!-- Center Header -->
      <div class="glass-card p-6 sm:p-8 border border-rose-500/25 bg-gradient-to-r from-slate-900/90 via-rose-950/20 to-slate-900/90 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div class="flex items-center gap-2">
            <span class="text-xs uppercase font-bold tracking-widest text-rose-400">Diagnostic Cognitive Diagnostics</span>
            <span class="text-slate-500">•</span>
            <span class="text-xs text-slate-300">Root Cause Engine</span>
          </div>
          <h1 class="text-2xl sm:text-3xl font-extrabold text-white mt-1">Misconception Analysis & Remediation</h1>
          <p class="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
            AptiLearn AI identifies <em>why</em> you chose incorrect options, pinpoints underlying cognitive bugs, and generates targeted counterexamples to cement proper mental models.
          </p>
        </div>

        <div class="flex flex-wrap items-center gap-3">
          ${activeList.length > 0 ? `
            <button 
              onclick="window.App.clearAllMisconceptions()" 
              class="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-500/25 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
              title="Mark all detected misconceptions as resolved and clear active errors">
              <span>✓</span>
              <span>Clear All Active Errors</span>
            </button>
          ` : ''}
          <div class="p-3 rounded-2xl bg-rose-950/50 border border-rose-800/60 text-center min-w-[90px]">
            <div class="text-2xl font-extrabold text-rose-400 font-mono">${activeList.length}</div>
            <div class="text-[10px] text-slate-400 uppercase font-semibold">Active Bugs</div>
          </div>
          <div class="p-3 rounded-2xl bg-emerald-950/50 border border-emerald-800/60 text-center min-w-[90px]">
            <div class="text-2xl font-extrabold text-emerald-400 font-mono">${resolvedList.length}</div>
            <div class="text-[10px] text-slate-400 uppercase font-semibold">Resolved</div>
          </div>
        </div>
      </div>

      <!-- Active Misconceptions List -->
      <div class="space-y-6">
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-bold text-white flex items-center gap-2">
            <span class="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse"></span>
            <span>Active Misconceptions Requiring Remediation (${activeList.length})</span>
          </h3>
        </div>

        ${activeList.length === 0 ? `
          <div class="glass-card p-8 text-center text-slate-400 border border-slate-800">
            <svg class="w-12 h-12 text-emerald-400 mx-auto mb-2 opacity-80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
            <p class="font-semibold text-white">No Active Misconceptions!</p>
            <p class="text-xs mt-1">All flagged conceptual bugs have been remediated through targeted practice.</p>
          </div>
        ` : `
          <div class="grid grid-cols-1 gap-6">
            ${activeList.map(item => `
              <div class="glass-card p-6 border border-rose-500/30 bg-slate-900/90 space-y-4">
                
                <div class="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
                  <div class="flex items-center gap-2">
                    <span class="text-xs font-bold px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800">${item.severity}</span>
                    <span class="text-xs font-semibold text-cyan-400">${item.conceptName}</span>
                  </div>
                  <span class="text-[11px] text-slate-400">Detected: ${new Date(item.detectedAt).toLocaleDateString()}</span>
                </div>

                <div>
                  <h4 class="text-base font-bold text-white">${item.title}</h4>
                  <p class="text-xs text-slate-300 mt-1 leading-relaxed">${item.explanation}</p>
                </div>

                ${item.studentReasoning ? `
                  <div class="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300">
                    <span class="text-slate-400 font-semibold">Your Stated Reasoning:</span> "${item.studentReasoning}"
                  </div>
                ` : ''}

                <!-- Side by side comparison -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div class="rounded-xl bg-slate-950 p-3.5 border border-rose-900/60 font-mono text-xs text-rose-300">
                    <div class="text-[10px] text-rose-400 font-bold uppercase mb-1.5 flex items-center gap-1.5">
                      <span>✗ Flawed Approach / Pitfall</span>
                    </div>
                    <pre><code>${escapeHtml(item.counterExample?.incorrectCode || '')}</code></pre>
                  </div>

                  <div class="rounded-xl bg-slate-950 p-3.5 border border-emerald-900/60 font-mono text-xs text-emerald-300">
                    <div class="text-[10px] text-emerald-400 font-bold uppercase mb-1.5 flex items-center gap-1.5">
                      <span>✓ Correct Mental Model</span>
                    </div>
                    <pre><code>${escapeHtml(item.counterExample?.correctCode || '')}</code></pre>
                  </div>
                </div>

                ${item.counterExample?.trace ? `
                  <div class="p-2.5 rounded-lg bg-cyan-950/40 border border-cyan-800/40 text-xs text-cyan-300">
                    <strong>Step-by-step Trace:</strong> ${item.counterExample.trace}
                  </div>
                ` : ''}

                <div class="flex items-center justify-between pt-3 border-t border-slate-800">
                  <button 
                    onclick="window.App.resolveMisconceptionManually('${item.id}')"
                    class="text-xs text-slate-400 hover:text-white hover:underline">
                    Mark as Understood
                  </button>

                  <button 
                    onclick="window.App.startAdaptivePractice('${item.conceptId}')"
                    class="px-5 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-indigo-600 text-white font-bold text-xs shadow-lg shadow-rose-600/25 hover:scale-105 transition-all">
                    Launch Targeted Remediation Exercise →
                  </button>
                </div>

              </div>
            `).join('')}
          </div>
        `}
      </div>

      <!-- Resolved Misconceptions Archive -->
      ${resolvedList.length > 0 ? `
        <div class="space-y-4 pt-6 border-t border-slate-800">
          <h3 class="text-base font-bold text-emerald-400 flex items-center gap-2">
            <span>✓ Resolved Misconceptions (${resolvedList.length})</span>
          </h3>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            ${resolvedList.map(item => `
              <div class="glass-card p-4 border border-emerald-500/20 bg-emerald-950/10 space-y-2">
                <div class="flex items-center justify-between text-xs">
                  <span class="font-bold text-white">${item.title}</span>
                  <span class="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">Remediated</span>
                </div>
                <p class="text-xs text-slate-300 line-clamp-2">${item.explanation}</p>
                <div class="text-[10px] text-slate-500">Resolved at: ${new Date(item.resolvedAt || item.detectedAt).toLocaleDateString()}</div>
              </div>
            `).join('')}
          </div>
        </div>
      ` : ''}

    </div>
  `;
}

function escapeHtml(text) {
  if (!text) return '';
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
