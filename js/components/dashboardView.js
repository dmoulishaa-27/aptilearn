// LearnIQ Student Dashboard Component
import { store } from '../state.js';
import { LearnerModelEngine } from '../learnerModel.js';
import { SYLLABUS_CONCEPTS } from '../config.js';

export function renderDashboardView() {
  const user = store.currentUser;
  const metrics = LearnerModelEngine.getOverallMetrics(user);

  // Time-of-day greeting
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : (hour < 18 ? "Good afternoon" : "Good evening");

  // Unresolved misconceptions count
  const unresolvedMisconceptions = user?.activeMisconceptions?.filter(m => !m.resolved) || [];
  
  // Due spaced revision items
  const dueReviews = user?.spacedRepetitionQueue?.filter(c => c.dueStatus === "Due Today") || [];

  return `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      <!-- WELCOME HERO BANNER -->
      <div class="glass-card p-6 sm:p-8 bg-gradient-to-r from-slate-900/95 via-indigo-950/40 to-slate-900/95 border border-cyan-500/25 relative overflow-hidden">
        <div class="absolute -right-10 -bottom-10 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div>
            <div class="flex items-center gap-2">
              <span class="text-xs uppercase font-bold tracking-widest text-cyan-400">Adaptive Learner Profile</span>
              <span class="text-slate-400">•</span>
              <span class="text-xs font-semibold text-slate-300">${user?.examGoal || 'Java & DSA Exam Prep'}</span>
            </div>
            <h1 class="text-2xl sm:text-3xl font-extrabold text-white mt-1">
              ${greeting}, <span class="bg-gradient-to-r from-white via-cyan-200 to-indigo-300 bg-clip-text text-transparent">${user?.name || 'Student'}</span>!
            </h1>
            <p class="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
              ${metrics.averageMastery < 50 
                ? "Your learner model detected foundational gaps in Recursion & Arrays. Let's tackle them today to accelerate your readiness!" 
                : "You are making steady progress! Your mastery is strong in core foundations. Keep maintaining your daily streak!"}
            </p>
          </div>

          <div class="flex flex-wrap items-center gap-3">
            <button 
              onclick="window.App.startAdaptivePractice()" 
              class="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-white font-bold text-xs shadow-lg shadow-cyan-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2">
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
              <span>Targeted Practice</span>
            </button>

            <button 
              onclick="window.App.navigate('revision')" 
              class="px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 hover:text-white font-semibold text-xs hover:border-slate-500 transition-all flex items-center gap-2">
              <svg class="w-4 h-4 text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
              <span>Spaced Revision (${dueReviews.length})</span>
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
            <div class="w-7 h-7 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
            </div>
          </div>
          <div class="text-2xl sm:text-3xl font-extrabold text-white font-mono">${metrics.averageMastery}%</div>
          <div class="w-full bg-slate-800 rounded-full h-1.5 mt-3 overflow-hidden">
            <div class="bg-gradient-to-r from-cyan-500 to-indigo-500 h-1.5 rounded-full" style="width: ${metrics.averageMastery}%"></div>
          </div>
          <div class="text-[11px] text-slate-400 mt-2 flex justify-between">
            <span>Syllabus Coverage</span>
            <span class="text-cyan-400 font-semibold">${metrics.averageMastery >= 75 ? 'Mastered' : metrics.averageMastery >= 40 ? 'Learning' : 'Needs Work'}</span>
          </div>
        </div>

        <!-- Questions Attempted -->
        <div class="glass-card p-5">
          <div class="flex items-center justify-between text-slate-400 mb-2">
            <span class="text-xs font-semibold uppercase tracking-wider">Questions Solved</span>
            <div class="w-7 h-7 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 14 14"></polyline></svg>
            </div>
          </div>
          <div class="text-2xl sm:text-3xl font-extrabold text-white font-mono">${metrics.totalAttempts}</div>
          <div class="text-[11px] text-slate-400 mt-3 flex items-center gap-1.5">
            <span class="text-emerald-400 font-semibold">Weekly Goal:</span>
            <span>${user?.weeklyQuestionsDone || 0} / ${user?.weeklyGoalQuestions || 30} done</span>
          </div>
        </div>

        <!-- Accuracy Percentage -->
        <div class="glass-card p-5">
          <div class="flex items-center justify-between text-slate-400 mb-2">
            <span class="text-xs font-semibold uppercase tracking-wider">Cognitive Accuracy</span>
            <div class="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
            </div>
          </div>
          <div class="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-mono">${metrics.overallAccuracy}%</div>
          <div class="text-[11px] text-slate-400 mt-3">
            <span>${metrics.totalCorrect} correct of ${metrics.totalAttempts} answers</span>
          </div>
        </div>

        <!-- Current Learning Streak -->
        <div class="glass-card p-5">
          <div class="flex items-center justify-between text-slate-400 mb-2">
            <span class="text-xs font-semibold uppercase tracking-wider">Daily Streak</span>
            <div class="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2c1.1 0 2 .9 2 2 0 1.5-1 3-2 4-1-1-2-2.5-2-4 0-1.1.9-2 2-2zm0 6c3.31 0 6 2.69 6 6 0 3.31-2.69 6-6 6s-6-2.69-6-6c0-3.31 2.69-6 6-6z"/></svg>
            </div>
          </div>
          <div class="text-2xl sm:text-3xl font-extrabold text-amber-400 font-mono">${user?.streakDays || 1} Days</div>
          <div class="text-[11px] text-slate-400 mt-3 flex items-center gap-1.5">
            <span class="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>Streak Active (Freeze Protected)</span>
          </div>
        </div>

      </div>

      <!-- RECOMMENDED LEARNING ACTIONS (Priority Alert Bar) -->
      ${unresolvedMisconceptions.length > 0 ? `
        <div class="p-4 rounded-2xl bg-rose-950/40 border border-rose-500/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0">
              <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
            </div>
            <div>
              <div class="text-xs font-bold text-rose-400 uppercase tracking-wider">Active Misconception Detected</div>
              <div class="text-sm font-semibold text-white">${unresolvedMisconceptions[0].title} (${unresolvedMisconceptions[0].conceptName})</div>
              <div class="text-xs text-slate-300 mt-0.5 line-clamp-1">${unresolvedMisconceptions[0].explanation}</div>
            </div>
          </div>
          <button 
            onclick="window.App.navigate('misconceptions')" 
            class="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shrink-0 shadow-lg shadow-rose-600/30 transition-all">
            Review & Fix Misconception →
          </button>
        </div>
      ` : ''}

      <!-- MAIN 2-COLUMN DASHBOARD GRID -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <!-- Left 2 Cols: Knowledge Mastery Breakdown & Progress Charts -->
        <div class="lg:col-span-2 space-y-8">
          
          <!-- Concept Mastery Breakdown Chart -->
          <div class="glass-card p-6">
            <div class="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
              <div>
                <h3 class="text-base font-bold text-white">Syllabus Concept Mastery Breakdown</h3>
                <p class="text-xs text-slate-400">Calculated via Bayesian Knowledge Tracing after each attempt.</p>
              </div>
              <button onclick="window.App.navigate('graph')" class="text-xs text-cyan-400 hover:underline font-semibold">
                Open Knowledge Graph →
              </button>
            </div>

            <!-- Horizontal Bars for Concepts -->
            <div class="space-y-4">
              ${SYLLABUS_CONCEPTS.slice(0, 7).map(concept => {
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
                    <div class="flex items-center justify-between text-xs mb-1.5">
                      <span class="font-medium text-slate-200 cursor-pointer hover:text-cyan-400 transition-colors" onclick="window.App.openConceptDetail('${concept.id}')">${concept.name}</span>
                      <div class="flex items-center gap-2">
                        <span class="text-[10px] px-2 py-0.5 rounded-full font-semibold ${badgeClass}">${status}</span>
                        <span class="font-mono font-bold text-slate-100">${score}%</span>
                      </div>
                    </div>
                    <div class="w-full bg-slate-800/80 rounded-full h-2 overflow-hidden">
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
              <button onclick="window.App.navigate('graph')" class="text-cyan-400 font-semibold hover:underline">View All 12 Concepts</button>
            </div>
          </div>

          <!-- Strong vs Weak Concepts Cards -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            <!-- Strong Concepts -->
            <div class="glass-card p-5 border border-emerald-500/20 bg-emerald-950/10">
              <div class="flex items-center gap-2 mb-3 text-emerald-400 font-bold text-xs uppercase tracking-wider">
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
                <span>Strong Concepts (Mastered)</span>
              </div>
              <div class="space-y-2">
                ${metrics.strongConcepts.length > 0 ? metrics.strongConcepts.slice(0, 3).map(c => `
                  <div class="flex items-center justify-between p-2 rounded-lg bg-slate-900/60 border border-slate-800 text-xs">
                    <span class="text-slate-200 font-medium">${c.name}</span>
                    <span class="text-emerald-400 font-mono font-bold">${c.mastery}%</span>
                  </div>
                `).join('') : '<div class="text-xs text-slate-400 italic">Complete practice questions to build strong concepts.</div>'}
              </div>
            </div>

            <!-- Weak Concepts -->
            <div class="glass-card p-5 border border-rose-500/20 bg-rose-950/10">
              <div class="flex items-center gap-2 mb-3 text-rose-400 font-bold text-xs uppercase tracking-wider">
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"></polygon><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                <span>Priority Growth Areas</span>
              </div>
              <div class="space-y-2">
                ${metrics.weakConcepts.length > 0 ? metrics.weakConcepts.slice(0, 3).map(c => `
                  <div class="flex items-center justify-between p-2 rounded-lg bg-slate-900/60 border border-slate-800 text-xs cursor-pointer hover:border-rose-500/50 transition-colors" onclick="window.App.startAdaptivePractice('${c.id}')">
                    <span class="text-slate-200 font-medium">${c.name}</span>
                    <span class="text-rose-400 font-mono font-bold">${c.mastery}% (Practice →)</span>
                  </div>
                `).join('') : '<div class="text-xs text-slate-400 italic">No weak concepts flagged!</div>'}
              </div>
            </div>

          </div>

        </div>

        <!-- Right Col: Upcoming Revision, AI Tutor Teaser & Recent Activity -->
        <div class="space-y-8">
          
          <!-- Upcoming Revision Card (SM-2) -->
          <div class="glass-card p-6 border border-amber-500/25">
            <div class="flex items-center justify-between mb-4">
              <div class="flex items-center gap-2">
                <div class="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
                  <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                </div>
                <h3 class="text-sm font-bold text-white">Spaced Revision Queue</h3>
              </div>
              <span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-950 text-amber-300 border border-amber-800">SM-2 Active</span>
            </div>

            <p class="text-xs text-slate-300 mb-4">Concepts scheduled for retrieval practice right before memory decay occurs.</p>

            <div class="space-y-2.5">
              ${user?.spacedRepetitionQueue?.slice(0, 3).map(item => `
                <div class="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between text-xs">
                  <div>
                    <div class="font-semibold text-white">${item.title}</div>
                    <div class="text-[10px] text-slate-400">Interval: ${item.intervalDays || 1} day(s)</div>
                  </div>
                  <span class="text-[10px] font-bold px-2 py-0.5 rounded ${
                    item.dueStatus === 'Due Today' ? 'bg-amber-950/80 text-amber-400 border border-amber-800' : 'bg-slate-800 text-slate-400'
                  }">
                    ${item.dueStatus}
                  </span>
                </div>
              `).join('') || '<div class="text-xs text-slate-400">No scheduled reviews.</div>'}
            </div>

            <button 
              onclick="window.App.navigate('revision')" 
              class="w-full mt-4 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold transition-all">
              Launch Revision Center →
            </button>
          </div>

          <!-- AI Tutor Quick Prompt Card -->
          <div class="glass-card p-6 border border-indigo-500/25 bg-gradient-to-br from-indigo-950/20 to-slate-900/80">
            <div class="flex items-center gap-3 mb-3">
              <div class="w-9 h-9 rounded-xl bg-indigo-600/30 text-indigo-400 flex items-center justify-center font-bold">
                <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
              </div>
              <div>
                <h4 class="text-sm font-bold text-white">Socrates AI Tutor</h4>
                <p class="text-[11px] text-indigo-300">Ready to break down difficult concepts</p>
              </div>
            </div>

            <div class="space-y-2 mt-4">
              <button onclick="window.App.askTutor('Why do I keep getting StackOverflowError in recursion?')" class="w-full text-left p-2.5 rounded-lg bg-slate-900/90 border border-slate-800 text-xs text-slate-200 hover:border-indigo-500 hover:text-white transition-all">
                "Why do I keep getting StackOverflowError?" →
              </button>
              <button onclick="window.App.askTutor('Give me a simple real-world analogy for Stacks vs Queues')" class="w-full text-left p-2.5 rounded-lg bg-slate-900/90 border border-slate-800 text-xs text-slate-200 hover:border-indigo-500 hover:text-white transition-all">
                "Real-world analogy for Stacks vs Queues" →
              </button>
            </div>

            <button onclick="window.App.navigate('tutor')" class="w-full mt-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition-all">
              Open Full AI Tutor Chat
            </button>
          </div>

        </div>

      </div>

    </div>
  `;
}
