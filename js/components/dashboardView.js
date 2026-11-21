// AptiLearn AI Personalized Student Dashboard Component
import { store } from '../state.js';
import { LearnerModelEngine } from '../learnerModel.js';
import { LearningPredictorEngine } from '../predictorEngine.js';
import { SYLLABUS_CONCEPTS } from '../config.js';

export function renderDashboardView() {
  const user = store.currentUser;
  const metrics = LearnerModelEngine.getOverallMetrics(user);
  const pred = LearningPredictorEngine.generatePredictions(user);

  // Time of day greeting
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : (hour < 18 ? "Good afternoon" : "Good evening");

  const unresolvedMisconceptions = user?.activeMisconceptions?.filter(m => !m.resolved) || [];
  const dueReviews = user?.spacedRepetitionQueue?.filter(c => c.dueStatus === "Due Today") || [];

  return `
    <div class="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      <!-- WELCOME HERO BANNER -->
      <div class="glass-card p-6 sm:p-8 bg-gradient-to-r from-slate-900/95 via-indigo-950/40 to-slate-900/95 border border-cyan-500/25 relative overflow-hidden">
        <div class="absolute -right-10 -bottom-10 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div>
            <div class="flex items-center gap-2">
              <span class="text-xs uppercase font-bold tracking-widest text-cyan-400">AptiLearn Cognitive Engine</span>
              <span class="text-slate-400">•</span>
              <span class="text-xs font-semibold text-slate-300">${user?.examGoal || 'Placement Exam 2026'}</span>
            </div>
            <h1 class="text-2xl sm:text-3xl font-extrabold text-white light:text-slate-900 mt-1">
              ${greeting}, <span class="bg-gradient-to-r from-white via-cyan-200 to-indigo-300 light:from-slate-900 light:to-indigo-600 bg-clip-text text-transparent">${user?.name || 'Student'}</span>!
            </h1>
            <p class="text-xs sm:text-sm text-slate-300 light:text-slate-600 mt-1 max-w-2xl">
              ${metrics.averageMastery < 65 
                ? "Your learner model detected priority foundational gaps in Recursion & Trees. Let's tackle them today to elevate your exam readiness!" 
                : "Outstanding consistency! Your core foundations are solid. Continue daily spaced recall to prevent memory decay."}
            </p>
          </div>

          <div class="flex flex-wrap items-center gap-3">
            <button 
              onclick="window.App.startAdaptivePractice()" 
              class="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-white font-bold text-xs shadow-lg shadow-cyan-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2">
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
              <span>Targeted Drill</span>
            </button>

            <button 
              onclick="window.App.navigate('coding')" 
              class="px-4 py-2.5 rounded-xl bg-slate-900 light:bg-slate-100 border border-slate-700 light:border-slate-300 text-slate-200 light:text-slate-800 hover:text-white font-semibold text-xs hover:border-slate-500 transition-all flex items-center gap-2">
              <span>💻 Coding Lab</span>
            </button>

            <button 
              onclick="window.App.navigate('exam')" 
              class="px-4 py-2.5 rounded-xl bg-slate-900 light:bg-slate-100 border border-slate-700 light:border-slate-300 text-slate-200 light:text-slate-800 hover:text-white font-semibold text-xs hover:border-slate-500 transition-all flex items-center gap-2">
              <span>⏱️ Mock Exam</span>
            </button>
          </div>
        </div>
      </div>

      <!-- KEY METRICS ROW (4 Cards) -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <!-- Overall Mastery -->
        <div class="glass-card p-5">
          <div class="flex items-center justify-between text-slate-400 mb-2">
            <span class="text-xs font-semibold uppercase tracking-wider">Overall Mastery</span>
            <div class="w-7 h-7 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-xs font-bold font-mono">BKT</div>
          </div>
          <div class="text-2xl sm:text-3xl font-extrabold text-white light:text-slate-900 font-mono">${metrics.averageMastery}%</div>
          <div class="w-full bg-slate-800 rounded-full h-1.5 mt-3 overflow-hidden">
            <div class="bg-gradient-to-r from-cyan-500 to-indigo-500 h-1.5 rounded-full" style="width: ${metrics.averageMastery}%"></div>
          </div>
          <div class="text-[11px] text-slate-400 mt-2 flex justify-between">
            <span>Syllabus Coverage</span>
            <span class="text-cyan-400 font-bold">${metrics.averageMastery >= 75 ? 'Mastered' : metrics.averageMastery >= 40 ? 'Learning' : 'Needs Work'}</span>
          </div>
        </div>

        <!-- Predicted Exam Readiness -->
        <div class="glass-card p-5 border border-indigo-500/25">
          <div class="flex items-center justify-between text-slate-400 mb-2">
            <span class="text-xs font-semibold uppercase tracking-wider">Predicted Readiness</span>
            <div class="w-7 h-7 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-xs">🎯</div>
          </div>
          <div class="text-2xl sm:text-3xl font-extrabold text-indigo-400 font-mono">${pred.examReadinessScore}%</div>
          <div class="text-[11px] text-slate-400 mt-3 flex items-center justify-between">
            <span>Forecast: <strong>Pass Probability</strong></span>
            <button onclick="window.App.navigate('predictor')" class="text-cyan-400 hover:underline">View details →</button>
          </div>
        </div>

        <!-- Cognitive Accuracy -->
        <div class="glass-card p-5">
          <div class="flex items-center justify-between text-slate-400 mb-2">
            <span class="text-xs font-semibold uppercase tracking-wider">Cognitive Accuracy</span>
            <div class="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs">✓</div>
          </div>
          <div class="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-mono">${metrics.overallAccuracy}%</div>
          <div class="text-[11px] text-slate-400 mt-3">
            <span>${metrics.totalCorrect} correct of ${metrics.totalAttempts} total attempts</span>
          </div>
        </div>

        <!-- Daily Streak -->
        <div class="glass-card p-5">
          <div class="flex items-center justify-between text-slate-400 mb-2">
            <span class="text-xs font-semibold uppercase tracking-wider">Daily Streak</span>
            <div class="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center text-xs">🔥</div>
          </div>
          <div class="text-2xl sm:text-3xl font-extrabold text-amber-400 font-mono">${user?.streakDays || 1} Days</div>
          <div class="text-[11px] text-slate-400 mt-3 flex items-center gap-1.5">
            <span class="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>Freeze Protected • Streak Shield</span>
          </div>
        </div>

      </div>

      <!-- ACTIVE MISCONCEPTION ALERT BAR (If Any) -->
      ${unresolvedMisconceptions.length > 0 ? `
        <div class="p-4 rounded-2xl bg-rose-950/40 border border-rose-500/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0">
              ⚠️
            </div>
            <div>
              <div class="text-xs font-bold text-rose-400 uppercase tracking-wider">Active Misconception Flagged</div>
              <div class="text-sm font-semibold text-white light:text-slate-900">${unresolvedMisconceptions[0].title} (${unresolvedMisconceptions[0].conceptName})</div>
              <div class="text-xs text-slate-300 light:text-slate-600 mt-0.5 line-clamp-1">${unresolvedMisconceptions[0].explanation}</div>
            </div>
          </div>
          <button 
            onclick="window.App.navigate('misconceptions')" 
            class="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shrink-0 shadow-lg shadow-rose-600/30 transition-all">
            Review in Mistake Notebook →
          </button>
        </div>
      ` : ''}

      <!-- 2-COLUMN MAIN DASHBOARD GRID -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <!-- Left 2 Cols: 15-Concept Mastery & Daily Quests -->
        <div class="lg:col-span-2 space-y-8">
          
          <!-- Syllabus Mastery Breakdown Chart (15 Concepts) -->
          <div class="glass-card p-6 border border-slate-800">
            <div class="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
              <div>
                <h3 class="text-base font-bold text-white light:text-slate-900">Java & DSA Syllabus Mastery Breakdown</h3>
                <p class="text-xs text-slate-400">Continuous Bayesian calculation across all 15 curriculum topics.</p>
              </div>
              <button onclick="window.App.navigate('graph')" class="text-xs text-cyan-400 hover:underline font-semibold">
                Open Knowledge Graph →
              </button>
            </div>

            <!-- Horizontal Bars for Concepts -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              ${SYLLABUS_CONCEPTS.slice(0, 10).map(concept => {
                const score = user?.mastery ? (user.mastery[concept.id] ?? 0) : 0;
                const status = LearnerModelEngine.getConceptStatus(score, user?.conceptStats?.[concept.id]?.attempts || 0);
                
                let barColor = "from-slate-600 to-slate-500";
                let badgeClass = "badge-not-started";
                if (status === "Mastered") {
                  barColor = "from-emerald-500 to-teal-400";
                  badgeClass = "badge-mastered";
                } else if (status === "Learning") {
                  barColor = "from-amber-500 to-yellow-400";
                  badgeClass = "badge-learning";
                } else if (status === "Needs Improvement") {
                  barColor = "from-rose-500 to-red-400";
                  badgeClass = "badge-improvement";
                }

                return `
                  <div>
                    <div class="flex items-center justify-between text-xs mb-1">
                      <span class="font-medium text-slate-200 light:text-slate-800 cursor-pointer hover:text-cyan-400 transition-colors" onclick="window.App.openConceptDetail('${concept.id}')">${concept.name}</span>
                      <span class="font-mono font-bold text-slate-100 light:text-slate-900">${score}%</span>
                    </div>
                    <div class="w-full bg-slate-800/80 light:bg-slate-200 rounded-full h-2 overflow-hidden">
                      <div class="bg-gradient-to-r ${barColor} h-2 rounded-full transition-all duration-700" style="width: ${score}%"></div>
                    </div>
                  </div>
                `;
              }).join('')}
            </div>

            <div class="mt-6 pt-4 border-t border-slate-800 flex justify-between items-center text-xs text-slate-400">
              <span class="flex items-center gap-2">
                <span class="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Mastered (≥75%)
                <span class="w-2.5 h-2.5 rounded-full bg-amber-500 ml-2"></span> Learning (40-74%)
                <span class="w-2.5 h-2.5 rounded-full bg-rose-500 ml-2"></span> Needs Work (&lt;40%)
              </span>
              <button onclick="window.App.navigate('graph')" class="text-cyan-400 font-semibold hover:underline">View All 15 Nodes in Graph</button>
            </div>
          </div>

          <!-- Daily Quests & Gamification Card -->
          <div class="glass-card p-6 border border-slate-800 space-y-4">
            <div class="flex items-center justify-between border-b border-slate-800 pb-3">
              <div class="flex items-center gap-2">
                <span class="text-sm font-bold text-white light:text-slate-900">Today's Learning Quests</span>
                <span class="text-[10px] px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800 font-mono">+190 XP Total</span>
              </div>
              <span class="text-xs text-slate-400">Resets daily at midnight</span>
            </div>

            <div class="space-y-3">
              ${(user?.dailyQuests || []).map(q => `
                <div class="p-3.5 rounded-xl bg-slate-900/80 light:bg-slate-50 border border-slate-800 light:border-slate-200 flex items-center justify-between text-xs">
                  <div class="flex items-center gap-3">
                    <span class="text-base">${q.completed ? '✅' : '⏳'}</span>
                    <div>
                      <div class="font-bold text-white light:text-slate-900 ${q.completed ? 'line-through text-slate-400' : ''}">${q.title}</div>
                      <div class="text-[11px] text-slate-400">${q.desc}</div>
                    </div>
                  </div>
                  <div class="flex items-center gap-3">
                    <span class="font-mono text-amber-400 font-bold">+${q.xp} XP</span>
                    <span class="text-[11px] text-slate-400 font-mono">${q.progress}/${q.total}</span>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>

        </div>

        <!-- Right Col: Today's Tasks & AI Study Planner Snippet -->
        <div class="space-y-6">
          
          <!-- Today's Study Planner Card -->
          <div class="glass-card p-6 border border-cyan-500/20 space-y-4">
            <div class="flex items-center justify-between border-b border-slate-800 pb-2">
              <div class="flex items-center gap-2">
                <span class="text-xs font-bold text-cyan-400 uppercase tracking-wider">Today's Timetable</span>
              </div>
              <button onclick="window.App.navigate('planner')" class="text-xs text-slate-400 hover:text-white">View Full Plan →</button>
            </div>

            <div class="space-y-2.5">
              ${store.studyPlan.tasks.slice(0, 3).map(task => `
                <div class="p-3 rounded-xl bg-slate-900/80 light:bg-slate-50 border border-slate-800 flex items-center justify-between text-xs">
                  <div class="flex items-center gap-2">
                    <input 
                      type="checkbox" 
                      ${task.done ? 'checked' : ''} 
                      onchange="window.App.togglePlannerTask('${task.id}')"
                      class="rounded border-slate-700 bg-slate-950 text-cyan-500 cursor-pointer"
                    />
                    <span class="${task.done ? 'line-through text-slate-500' : 'text-slate-200 light:text-slate-800 font-medium'}">${task.title}</span>
                  </div>
                  <span class="text-[10px] text-slate-400 font-mono">${task.time.split(' ')[0]}</span>
                </div>
              `).join('')}
            </div>

            <button 
              onclick="window.App.rescheduleMissedTasks()" 
              class="w-full py-2 rounded-xl bg-cyan-950/60 hover:bg-cyan-900/60 border border-cyan-800/60 text-cyan-300 text-xs font-semibold transition-all">
              ⚡ Rebalance Missed Tasks
            </button>
          </div>

          <!-- Spaced Repetition (SM-2) Queue Card -->
          <div class="glass-card p-6 border border-amber-500/25 space-y-4">
            <div class="flex items-center justify-between border-b border-slate-800 pb-2">
              <div class="flex items-center gap-2">
                <span class="text-xs font-bold text-amber-400 uppercase tracking-wider">Spaced Revision</span>
              </div>
              <span class="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800">SM-2 Active</span>
            </div>

            <p class="text-xs text-slate-300 light:text-slate-600">Recall sessions scheduled to prevent memory decay.</p>

            <div class="space-y-2">
              ${user?.spacedRepetitionQueue?.slice(0, 2).map(item => `
                <div class="p-3 rounded-xl bg-slate-900/80 light:bg-slate-50 border border-slate-800 flex items-center justify-between text-xs">
                  <div>
                    <div class="font-semibold text-white light:text-slate-900">${item.title}</div>
                    <div class="text-[10px] text-slate-400">Interval: ${item.intervalDays || 1}d</div>
                  </div>
                  <span class="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-950 text-amber-400 border border-amber-800">
                    ${item.dueStatus}
                  </span>
                </div>
              `).join('') || '<div class="text-xs text-slate-400">No scheduled reviews.</div>'}
            </div>

            <button 
              onclick="window.App.navigate('revision')" 
              class="w-full py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition-all">
              Launch Revision Center →
            </button>
          </div>

          <!-- Socrates Quick Doubt Solver -->
          <div class="glass-card p-6 border border-indigo-500/25 bg-gradient-to-br from-indigo-950/20 to-slate-900/80 space-y-3">
            <div class="flex items-center gap-2.5">
              <span class="text-base">💬</span>
              <div>
                <h4 class="text-sm font-bold text-white light:text-slate-900">Socrates AI Tutor</h4>
                <p class="text-[11px] text-indigo-300">Explain It Again & Doubt Solver</p>
              </div>
            </div>

            <div class="space-y-1.5">
              <button onclick="window.App.askTutor('Why do I keep getting StackOverflowError in recursion?')" class="w-full text-left p-2 rounded-lg bg-slate-900 light:bg-white border border-slate-800 text-xs text-slate-200 light:text-slate-700 hover:border-indigo-500">
                "Why do I get StackOverflowError?" →
              </button>
              <button onclick="window.App.askTutor('Give me a simple real-world analogy for Stacks vs Queues')" class="w-full text-left p-2 rounded-lg bg-slate-900 light:bg-white border border-slate-800 text-xs text-slate-200 light:text-slate-700 hover:border-indigo-500">
                "Real-world analogy for Stacks" →
              </button>
            </div>

            <button onclick="window.App.navigate('tutor')" class="w-full py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md">
              Open Full AI Tutor Chat
            </button>
          </div>

        </div>

      </div>

    </div>
  `;
}
