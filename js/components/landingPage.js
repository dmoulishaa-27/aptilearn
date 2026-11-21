// LearnIQ Premium Landing Page Component
import { store } from '../state.js';

export function renderLandingPage() {
  return `
    <div class="relative overflow-hidden">
      
      <!-- Ambient Glow Highlights -->
      <div class="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[450px] bg-gradient-to-b from-cyan-600/15 via-indigo-600/10 to-transparent blur-3xl pointer-events-none"></div>
      <div class="absolute top-1/3 -left-40 w-96 h-96 bg-purple-600/10 blur-3xl pointer-events-none"></div>

      <!-- HERO SECTION -->
      <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 relative z-10 text-center">
        
        <!-- Top Pill Tag -->
        <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/80 border border-cyan-500/30 text-cyan-300 text-xs font-semibold mb-6 shadow-sm hover:border-cyan-400/50 transition-all cursor-pointer" onclick="window.App.openGuidedTour()">
          <span class="flex h-2 w-2 rounded-full bg-cyan-400 animate-ping"></span>
          <span>Next-Gen Adaptive Learning Platform</span>
          <span class="text-slate-400">|</span>
          <span class="text-amber-400 font-bold">Judge 9-Step Walkthrough Tour →</span>
        </div>

        <h1 class="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-5xl mx-auto leading-[1.12]">
          An AI Exam Tutor That Understands <br/>
          <span class="bg-gradient-to-r from-cyan-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
            How You Actually Think.
          </span>
        </h1>

        <p class="mt-6 text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
          Traditional chatbots simply spit out answers. <strong class="text-white">LearnIQ</strong> continuously traces your cognitive model, detects root misconceptions, dynamically scales difficulty, and guarantees mastery through spaced repetition.
        </p>

        <!-- CTA Buttons -->
        <div class="mt-10 flex flex-wrap items-center justify-center gap-4">
          <button 
            onclick="window.App.startDiagnostic()" 
            class="px-7 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-white font-bold text-sm shadow-xl shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2">
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
            <span>Take Diagnostic Assessment</span>
          </button>

          <button 
            onclick="window.App.openGuidedTour()" 
            class="px-7 py-3.5 rounded-xl bg-slate-900/90 border border-amber-500/40 text-amber-300 font-bold text-sm hover:bg-slate-800 shadow-lg shadow-amber-500/10 hover:border-amber-400 transition-all flex items-center gap-2">
            <svg class="w-4 h-4 text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polygon points="10 8 16 12 10 16 10 8"></polygon></svg>
            <span>Hackathon 9-Step Demo Walkthrough</span>
          </button>

          <button 
            onclick="window.App.switchPersona('alex')" 
            class="px-6 py-3.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 hover:text-white font-semibold text-sm hover:border-slate-500 transition-all">
            Explore Alex's Learner Model →
          </button>
        </div>

        <!-- Metric Badges -->
        <div class="mt-14 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          <div class="glass-card p-4 text-center">
            <div class="text-2xl sm:text-3xl font-extrabold text-cyan-400 font-mono">100%</div>
            <div class="text-xs text-slate-400 mt-1">Adaptive Question Generation</div>
          </div>
          <div class="glass-card p-4 text-center">
            <div class="text-2xl sm:text-3xl font-extrabold text-indigo-400 font-mono">SM-2</div>
            <div class="text-xs text-slate-400 mt-1">Spaced Repetition Engine</div>
          </div>
          <div class="glass-card p-4 text-center">
            <div class="text-2xl sm:text-3xl font-extrabold text-rose-400 font-mono">Root Cause</div>
            <div class="text-xs text-slate-400 mt-1">Misconception Detection</div>
          </div>
          <div class="glass-card p-4 text-center">
            <div class="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-mono">Dynamic</div>
            <div class="text-xs text-slate-400 mt-1">Bayesian Learner Model</div>
          </div>
        </div>

      </section>

      <!-- LIVE INTERACTIVE PREVIEW CARD -->
      <section class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-10">
        <div class="glass-card p-6 sm:p-8 border border-cyan-500/30 shadow-2xl shadow-cyan-500/10">
          <div class="flex flex-col md:flex-row items-start md:items-center justify-between pb-6 border-b border-slate-800 gap-4">
            <div>
              <span class="text-xs font-bold text-cyan-400 uppercase tracking-widest">Core Architecture Demonstration</span>
              <h3 class="text-xl sm:text-2xl font-bold text-white mt-1">The Adaptive Learning Feedback Loop</h3>
              <p class="text-xs text-slate-400">See how every answer updates the student's concept mastery and schedules targeted revision.</p>
            </div>
            <div class="flex items-center gap-2">
              <button onclick="window.App.navigate('graph')" class="px-3.5 py-1.5 rounded-lg bg-cyan-950/80 border border-cyan-700/60 text-cyan-300 text-xs font-semibold hover:bg-cyan-900/80 transition-all">
                View Live Graph →
              </button>
            </div>
          </div>

          <div class="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
            <!-- Step 1 -->
            <div class="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 flex flex-col justify-between">
              <div>
                <div class="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-xs mb-3">1</div>
                <h4 class="font-bold text-sm text-white">Diagnostic Assessment</h4>
                <p class="text-xs text-slate-400 mt-1.5 leading-relaxed">Multi-topic baseline test evaluates initial strengths and identifies hidden foundational weaknesses.</p>
              </div>
              <div class="mt-4 pt-3 border-t border-slate-800/80 text-[11px] text-cyan-300 font-mono">10 Questions • Timed</div>
            </div>

            <!-- Step 2 -->
            <div class="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 flex flex-col justify-between">
              <div>
                <div class="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-xs mb-3">2</div>
                <h4 class="font-bold text-sm text-white">Bayesian Learner Model</h4>
                <p class="text-xs text-slate-400 mt-1.5 leading-relaxed">Updates mastery per concept in real time factoring in correctness, time-to-solve, and student confidence.</p>
              </div>
              <div class="mt-4 pt-3 border-t border-slate-800/80 text-[11px] text-indigo-300 font-mono">BKT + ELO Algorithm</div>
            </div>

            <!-- Step 3 -->
            <div class="bg-slate-900/80 p-5 rounded-2xl border border-rose-500/30 flex flex-col justify-between bg-rose-950/10">
              <div>
                <div class="w-8 h-8 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold text-xs mb-3">3</div>
                <h4 class="font-bold text-sm text-white">Misconception Detection</h4>
                <p class="text-xs text-slate-400 mt-1.5 leading-relaxed">Pinpoints WHY a student chose an incorrect distractor, generating step-by-step counterexamples.</p>
              </div>
              <div class="mt-4 pt-3 border-t border-rose-800/40 text-[11px] text-rose-300 font-mono">Reasoning Analysis</div>
            </div>

            <!-- Step 4 -->
            <div class="bg-slate-900/80 p-5 rounded-2xl border border-emerald-500/30 flex flex-col justify-between bg-emerald-950/10">
              <div>
                <div class="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs mb-3">4</div>
                <h4 class="font-bold text-sm text-white">Spaced Revision (SM-2)</h4>
                <p class="text-xs text-slate-400 mt-1.5 leading-relaxed">Schedules micro-review intervals right before memory decay occurs, locking concepts into long-term memory.</p>
              </div>
              <div class="mt-4 pt-3 border-t border-emerald-800/40 text-[11px] text-emerald-300 font-mono">SuperMemo SM-2 Active</div>
            </div>
          </div>
        </div>
      </section>

      <!-- COMPARISON: LearnIQ vs Traditional Prep -->
      <section class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div class="text-center mb-12">
          <span class="text-xs font-bold text-cyan-400 uppercase tracking-widest">The Competitive Advantage</span>
          <h2 class="text-3xl font-extrabold text-white mt-2">Why LearnIQ Transcends Traditional Exam Prep</h2>
        </div>

        <div class="glass-card overflow-hidden border border-slate-800">
          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs sm:text-sm">
              <thead class="bg-slate-900/90 text-slate-300 border-b border-slate-800 text-[11px] uppercase tracking-wider">
                <tr>
                  <th class="py-4 px-6">Capability</th>
                  <th class="py-4 px-6 text-slate-400">Generic Chatbots (ChatGPT)</th>
                  <th class="py-4 px-6 text-slate-400">Standard Test Banks</th>
                  <th class="py-4 px-6 text-cyan-400 font-bold bg-cyan-950/30">LearnIQ Adaptive Tutor</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-800/70 text-slate-300">
                <tr>
                  <td class="py-4 px-6 font-semibold text-white">Learner Modeling</td>
                  <td class="py-4 px-6 text-rose-400">❌ Stateless / Forgets context</td>
                  <td class="py-4 px-6 text-rose-400">❌ Only raw % marks</td>
                  <td class="py-4 px-6 text-emerald-400 font-semibold bg-cyan-950/20">✓ Continuous Bayesian Concept Mastery</td>
                </tr>
                <tr>
                  <td class="py-4 px-6 font-semibold text-white">Misconception Detection</td>
                  <td class="py-4 px-6 text-slate-400">⚠️ Only if explicitly asked</td>
                  <td class="py-4 px-6 text-rose-400">❌ None (Generic answer key)</td>
                  <td class="py-4 px-6 text-emerald-400 font-semibold bg-cyan-950/20">✓ Analyzes student reasoning & counterexamples</td>
                </tr>
                <tr>
                  <td class="py-4 px-6 font-semibold text-white">Dynamic Difficulty</td>
                  <td class="py-4 px-6 text-slate-400">⚠️ Manual prompting needed</td>
                  <td class="py-4 px-6 text-rose-400">❌ Static question order</td>
                  <td class="py-4 px-6 text-emerald-400 font-semibold bg-cyan-950/20">✓ Auto-scales based on real-time performance</td>
                </tr>
                <tr>
                  <td class="py-4 px-6 font-semibold text-white">Spaced Repetition Scheduler</td>
                  <td class="py-4 px-6 text-rose-400">❌ No scheduling capability</td>
                  <td class="py-4 px-6 text-rose-400">❌ Manual bookmarks only</td>
                  <td class="py-4 px-6 text-emerald-400 font-semibold bg-cyan-950/20">✓ Automated SuperMemo SM-2 Revision Queue</td>
                </tr>
                <tr>
                  <td class="py-4 px-6 font-semibold text-white">Curriculum Knowledge Graph</td>
                  <td class="py-4 px-6 text-rose-400">❌ No visual structure</td>
                  <td class="py-4 px-6 text-slate-400">⚠️ Linear chapter lists</td>
                  <td class="py-4 px-6 text-emerald-400 font-semibold bg-cyan-950/20">✓ Interactive prerequisite dependency graph</td>
                </tr>
                <tr>
                  <td class="py-4 px-6 font-semibold text-white">Teacher / Cohort Insights</td>
                  <td class="py-4 px-6 text-rose-400">❌ None</td>
                  <td class="py-4 px-6 text-slate-400">⚠️ Basic gradebook</td>
                  <td class="py-4 px-6 text-emerald-400 font-semibold bg-cyan-950/20">✓ Misconception heatmaps & At-Risk alerts</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <!-- TEST PERSONAS SELECTOR FOR JUDGES -->
      <section class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div class="glass-card p-6 sm:p-8 bg-gradient-to-r from-slate-900/90 to-slate-950/90 border border-indigo-500/30">
          <div class="text-center max-w-2xl mx-auto mb-8">
            <span class="text-xs font-bold text-indigo-400 uppercase tracking-widest">Instant Evaluation Hub</span>
            <h3 class="text-2xl font-bold text-white mt-1">Select a Persona to Experience LearnIQ</h3>
            <p class="text-xs text-slate-400 mt-1">Jump directly into simulated user states without registering or filling forms.</p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
            <!-- Alex -->
            <div onclick="window.App.switchPersona('alex')" class="glass-card p-5 border border-rose-500/30 hover:border-rose-400 cursor-pointer transition-all hover:-translate-y-1 bg-slate-900/80">
              <div class="flex items-center gap-3 mb-3">
                <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200" class="w-10 h-10 rounded-full object-cover border border-rose-500" alt="Alex"/>
                <div>
                  <h4 class="font-bold text-white text-sm">Alex Rivera</h4>
                  <span class="text-[10px] px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800">Needs Remediation</span>
                </div>
              </div>
              <p class="text-xs text-slate-300">Struggling with Recursion & Array Bounds. Has 2 active misconceptions and 2 revision cards due today.</p>
              <div class="mt-4 pt-3 border-t border-slate-800 flex justify-between items-center text-[11px] text-rose-400 font-semibold">
                <span>Recursion: 34% Mastery</span>
                <span>Load Alex →</span>
              </div>
            </div>

            <!-- Priya -->
            <div onclick="window.App.switchPersona('priya')" class="glass-card p-5 border border-emerald-500/30 hover:border-emerald-400 cursor-pointer transition-all hover:-translate-y-1 bg-slate-900/80">
              <div class="flex items-center gap-3 mb-3">
                <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200" class="w-10 h-10 rounded-full object-cover border border-emerald-500" alt="Priya"/>
                <div>
                  <h4 class="font-bold text-white text-sm">Priya Sharma</h4>
                  <span class="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">Advanced Learner</span>
                </div>
              </div>
              <p class="text-xs text-slate-300">88% overall mastery, preparing for FAANG interviews. Facing Hard adaptive tree & algorithm questions.</p>
              <div class="mt-4 pt-3 border-t border-slate-800 flex justify-between items-center text-[11px] text-emerald-400 font-semibold">
                <span>Trees & DP: 84% Mastery</span>
                <span>Load Priya →</span>
              </div>
            </div>

            <!-- Teacher -->
            <div onclick="window.App.switchPersona('teacher')" class="glass-card p-5 border border-indigo-500/30 hover:border-indigo-400 cursor-pointer transition-all hover:-translate-y-1 bg-slate-900/80">
              <div class="flex items-center gap-3 mb-3">
                <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200" class="w-10 h-10 rounded-full object-cover border border-indigo-500" alt="Prof. Harrison"/>
                <div>
                  <h4 class="font-bold text-white text-sm">Prof. Alan Harrison</h4>
                  <span class="text-[10px] px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800">CS Instructor</span>
                </div>
              </div>
              <p class="text-xs text-slate-300">Monitors 42 students. Views cohort difficulty heatmaps, aggregate misconceptions, and at-risk alerts.</p>
              <div class="mt-4 pt-3 border-t border-slate-800 flex justify-between items-center text-[11px] text-indigo-400 font-semibold">
                <span>42 Students Enrolled</span>
                <span>Load Teacher View →</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- FOOTER -->
      <footer class="border-t border-slate-800/80 py-12 text-center text-xs text-slate-400">
        <div class="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div class="flex items-center gap-2">
            <span class="font-bold text-white">LearnIQ</span>
            <span>— Adaptive AI Exam-Prep Tutor with a Learner Model</span>
          </div>
          <div class="flex items-center gap-4">
            <button onclick="window.App.openGuidedTour()" class="text-amber-400 hover:underline font-semibold">Judge Guided Tour</button>
            <button onclick="window.App.navigate('dashboard')" class="hover:text-white transition-colors">Student Dashboard</button>
            <button onclick="window.App.navigate('graph')" class="hover:text-white transition-colors">Knowledge Graph</button>
            <button onclick="window.App.navigate('teacher')" class="hover:text-white transition-colors">Teacher Portal</button>
          </div>
          <div>Built with precision for intelligent adaptive learning.</div>
        </div>
      </footer>

    </div>
  `;
}
