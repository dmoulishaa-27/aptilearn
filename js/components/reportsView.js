// LearnIQ Reports & Analytics Component (Printable / PDF Ready)
import { store } from '../state.js';
import { LearnerModelEngine } from '../learnerModel.js';
import { SYLLABUS_CONCEPTS } from '../config.js';

export function renderReportsView() {
  const user = store.currentUser;
  const metrics = LearnerModelEngine.getOverallMetrics(user);

  return `
    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      <!-- Top Action Bar -->
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 no-print">
        <div>
          <span class="text-xs uppercase font-bold tracking-widest text-cyan-400">Cognitive Diagnostics</span>
          <h1 class="text-2xl sm:text-3xl font-extrabold text-white mt-1">Weekly Performance & Mastery Report</h1>
          <p class="text-xs text-slate-300">Generated on ${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
        </div>

        <button 
          onclick="window.print()" 
          class="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-white font-bold text-xs shadow-lg shadow-cyan-500/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-2">
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>
          <span>Print / Save as PDF</span>
        </button>
      </div>

      <!-- Printable Report Container -->
      <div class="glass-card p-6 sm:p-10 border border-slate-800 space-y-8 bg-slate-900/90 text-slate-200">
        
        <!-- Header in Report -->
        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-slate-800 gap-4">
          <div>
            <div class="text-xl font-bold text-white flex items-center gap-2">
              <span class="text-cyan-400 font-mono">AptiLearn AI</span>
              <span>Learner Model Evaluation</span>
            </div>
            <p class="text-xs text-slate-400 mt-1">Learner: <strong class="text-white">${user?.name}</strong> (${user?.email})</p>
            <p class="text-xs text-slate-400">Exam Target: <strong class="text-white">${user?.examGoal}</strong></p>
          </div>

          <div class="text-right">
            <div class="text-xs text-slate-400 uppercase font-semibold">Evaluation Status</div>
            <div class="text-sm font-bold text-emerald-400 font-mono mt-0.5">Active Continuous Calibration</div>
            <div class="text-[11px] text-slate-400">Current Streak: ${user?.streakDays || 1} Days</div>
          </div>
        </div>

        <!-- Metric Summary 4-Col Grid -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div class="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
            <div class="text-[11px] text-slate-400 uppercase font-semibold">Overall Mastery</div>
            <div class="text-2xl font-extrabold text-cyan-400 font-mono mt-1">${metrics.averageMastery}%</div>
          </div>
          <div class="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
            <div class="text-[11px] text-slate-400 uppercase font-semibold">Questions Solved</div>
            <div class="text-2xl font-extrabold text-white font-mono mt-1">${metrics.totalAttempts}</div>
          </div>
          <div class="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
            <div class="text-[11px] text-slate-400 uppercase font-semibold">Cognitive Accuracy</div>
            <div class="text-2xl font-extrabold text-emerald-400 font-mono mt-1">${metrics.overallAccuracy}%</div>
          </div>
          <div class="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
            <div class="text-[11px] text-slate-400 uppercase font-semibold">XP Earned</div>
            <div class="text-2xl font-extrabold text-amber-400 font-mono mt-1">${user?.totalXp || 0}</div>
          </div>
        </div>

        <!-- Concept Mastery Breakdown Table -->
        <div class="space-y-3">
          <h3 class="text-sm font-bold text-white uppercase tracking-wider">Concept-Wise Mastery & Calibration</h3>
          
          <div class="overflow-x-auto rounded-xl border border-slate-800">
            <table class="w-full text-left text-xs">
              <thead class="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                <tr>
                  <th class="py-3 px-4">Concept</th>
                  <th class="py-3 px-4">Mastery Score</th>
                  <th class="py-3 px-4">Attempts</th>
                  <th class="py-3 px-4">State</th>
                  <th class="py-3 px-4">Recommendation</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-800/60">
                ${SYLLABUS_CONCEPTS.map(c => {
                  const m = user?.mastery ? (user.mastery[c.id] ?? 0) : 0;
                  const stats = user?.conceptStats ? user.conceptStats[c.id] : null;
                  const attempts = stats ? stats.attempts : 0;
                  const status = LearnerModelEngine.getConceptStatus(m, attempts);

                  let rec = "Maintain via periodic review";
                  if (status === "Needs Improvement") rec = "Priority: Complete scaffolded base-case drills";
                  else if (status === "Learning") rec = "Practice Medium difficulty problems";
                  else if (status === "Not Started") rec = "Unlock prerequisite foundations";

                  return `
                    <tr>
                      <td class="py-2.5 px-4 font-semibold text-white">${c.name}</td>
                      <td class="py-2.5 px-4 font-mono font-bold ${m >= 75 ? 'text-emerald-400' : (m >= 40 ? 'text-amber-400' : 'text-rose-400')}">${m}%</td>
                      <td class="py-2.5 px-4 text-slate-300 font-mono">${attempts}</td>
                      <td class="py-2.5 px-4">
                        <span class="text-[10px] font-semibold px-2 py-0.5 rounded ${
                          status === 'Mastered' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' :
                          status === 'Learning' ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                          status === 'Needs Improvement' ? 'bg-rose-950 text-rose-300 border border-rose-800' :
                          'bg-slate-800 text-slate-400'
                        }">
                          ${status}
                        </span>
                      </td>
                      <td class="py-2.5 px-4 text-slate-300">${rec}</td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
          </div>
        </div>

        <!-- PERSONALIZED NEXT-WEEK STUDY PLAN -->
        <div class="space-y-3 pt-4 border-t border-slate-800">
          <div class="flex items-center justify-between">
            <h3 class="text-sm font-bold text-white uppercase tracking-wider">AI Personalized Next-Week Study Plan</h3>
            <span class="text-xs text-indigo-400 font-semibold font-mono">Dynamic Adaptive Schedule</span>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <!-- Day 1 & 2 -->
            <div class="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div class="font-bold text-cyan-400">Day 1 & 2: Remediation Phase</div>
              <p class="text-slate-300 text-[11px] leading-relaxed">
                Focus strictly on resolving the <strong>Recursion Base Case</strong> misconception and reviewing array length bounds (0 to N-1).
              </p>
              <div class="text-[10px] text-slate-500 font-mono">Target: 8 scaffolded drills • 20 mins/day</div>
            </div>

            <!-- Day 3 & 4 -->
            <div class="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div class="font-bold text-indigo-400">Day 3 & 4: Consolidation Phase</div>
              <p class="text-slate-300 text-[11px] leading-relaxed">
                Complete spaced repetition queue for Stacks and Queues. Practice Binary Search boundary invariants.
              </p>
              <div class="text-[10px] text-slate-500 font-mono">Target: 3 SM-2 flash reviews • 15 mins/day</div>
            </div>

            <!-- Day 5 & 6 -->
            <div class="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div class="font-bold text-emerald-400">Day 5 & 6: Mastery Challenge</div>
              <p class="text-slate-300 text-[11px] leading-relaxed">
                Take Hard adaptive questions on Linked Lists and Binary Trees to elevate overall mastery past the 75% threshold.
              </p>
              <div class="text-[10px] text-slate-500 font-mono">Target: 10 Hard questions • 25 mins/day</div>
            </div>
          </div>
        </div>

      </div>

    </div>
  `;
}
