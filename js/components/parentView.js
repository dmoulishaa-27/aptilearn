// AptiLearn AI Parent / Mentor Progress Portal Component
import { store } from '../state.js';
import { LearnerModelEngine } from '../learnerModel.js';

export function renderParentView() {
  const user = store.currentUser;
  // If in parent persona, student is Alex Rivera
  const studentMetrics = {
    name: "Alex Rivera",
    streakDays: 6,
    totalMinutesThisWeek: 215,
    studyConsistencyScore: 92, // %
    overallMastery: 62,
    accuracy: 64,
    upcomingExam: "Java & DSA Placement Exam (Dec 15, 2026)",
    revisionCompletion: "88% Completed On-Time",
    needsSupportIn: ["Recursion Base Cases (34% Mastery)", "Binary Tree Traversals (28% Mastery)"],
    strengthAreas: ["Variables & Data Types (90%)", "Conditionals & Logic (84%)", "Loops & Iteration (78%)"]
  };

  return `
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      <!-- Parent Portal Header -->
      <div class="glass-card p-6 sm:p-8 border border-pink-500/30 bg-gradient-to-r from-slate-900/90 via-pink-950/20 to-slate-900/90 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div class="flex items-center gap-2">
            <span class="text-xs uppercase font-bold tracking-widest text-pink-400">Parent & Mentor Oversight</span>
            <span class="text-slate-500">•</span>
            <span class="text-xs text-slate-300">Authorized Student: ${studentMetrics.name}</span>
          </div>
          <h1 class="text-2xl sm:text-3xl font-extrabold text-white light:text-slate-900 mt-1">Student Consistency & Growth Portal</h1>
          <p class="text-xs sm:text-sm text-slate-300 light:text-slate-600 mt-1 max-w-2xl">
            Review your student's learning momentum, revision consistency, and target examination readiness without interrupting their practice flow.
          </p>
        </div>

        <button onclick="window.App.switchPersona('alex')" class="px-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs font-semibold text-slate-300 hover:text-white transition-all">
          ← Switch to Student View
        </button>
      </div>

      <!-- High-Level Metric Cards -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="glass-card p-5">
          <div class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Weekly Study Time</div>
          <div class="text-3xl font-extrabold text-white light:text-slate-900 font-mono mt-1">${studentMetrics.totalMinutesThisWeek}m</div>
          <div class="text-[11px] text-emerald-400 mt-2">Target: 180m/week (Exceeded!)</div>
        </div>

        <div class="glass-card p-5">
          <div class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Consistency Score</div>
          <div class="text-3xl font-extrabold text-cyan-400 font-mono mt-1">${studentMetrics.studyConsistencyScore}%</div>
          <div class="text-[11px] text-slate-400 mt-2">6 Active Days this week</div>
        </div>

        <div class="glass-card p-5">
          <div class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Revision Reliability</div>
          <div class="text-3xl font-extrabold text-indigo-400 font-mono mt-1">${studentMetrics.revisionCompletion}</div>
          <div class="text-[11px] text-slate-400 mt-2">SM-2 Spaced Recall Tasks</div>
        </div>

        <div class="glass-card p-5 border border-pink-500/20 bg-pink-950/10">
          <div class="text-xs font-semibold text-pink-400 uppercase tracking-wider">Target Examination</div>
          <div class="text-base font-bold text-white light:text-slate-900 mt-1 truncate">Placement 2026</div>
          <div class="text-[11px] text-pink-300 mt-2">Dec 15, 2026 (24 days remaining)</div>
        </div>
      </div>

      <!-- 2-COL GRID: Strengths vs Areas Needing Encouragement -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        <!-- Strengths -->
        <div class="glass-card p-6 border border-emerald-500/30 space-y-4">
          <div class="flex items-center gap-2 text-emerald-400 font-bold text-sm uppercase tracking-wider">
            <span>✓ Demonstrated Strengths</span>
          </div>
          <p class="text-xs text-slate-400">Concepts where ${studentMetrics.name} exhibits mastery and high retrieval speed.</p>
          
          <div class="space-y-2.5">
            ${studentMetrics.strengthAreas.map(s => `
              <div class="p-3 rounded-xl bg-slate-900/80 light:bg-slate-50 border border-slate-800 text-xs flex justify-between">
                <span class="font-medium text-white light:text-slate-900">${s}</span>
                <span class="text-emerald-400 font-bold font-mono">Mastered</span>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Areas Needing Support -->
        <div class="glass-card p-6 border border-rose-500/30 space-y-4">
          <div class="flex items-center gap-2 text-rose-400 font-bold text-sm uppercase tracking-wider">
            <span>⚠️ Areas Requiring Encouragement</span>
          </div>
          <p class="text-xs text-slate-400">Concepts with current active misconceptions scheduled for scaffolded practice.</p>

          <div class="space-y-2.5">
            ${studentMetrics.needsSupportIn.map(w => `
              <div class="p-3 rounded-xl bg-slate-900/80 light:bg-slate-50 border border-slate-800 text-xs flex justify-between">
                <span class="font-medium text-white light:text-slate-900">${w}</span>
                <span class="text-rose-400 font-bold font-mono">In Remediation</span>
              </div>
            `).join('')}
          </div>

          <div class="p-3 rounded-xl bg-indigo-950/40 border border-indigo-700/50 text-[11px] text-indigo-200">
            <strong>Mentor Tip:</strong> Encourage Alex to complete today's 15-minute targeted drill on base cases without focusing strictly on mock test marks.
          </div>
        </div>

      </div>

    </div>
  `;
}
