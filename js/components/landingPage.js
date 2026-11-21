// AptiLearn AI Modern EdTech Landing Page Component
import { store } from '../state.js';

export function renderLandingPage() {
  return `
    <div class="relative overflow-hidden">
      
      <!-- Ambient Radial Backdrops -->
      <div class="absolute top-0 left-1/2 -translate-x-1/2 w-[1100px] h-[500px] bg-gradient-to-b from-cyan-600/15 via-indigo-600/10 to-transparent blur-3xl pointer-events-none"></div>
      <div class="absolute top-1/3 -left-40 w-96 h-96 bg-purple-600/10 blur-3xl pointer-events-none"></div>

      <!-- HERO SECTION -->
      <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 relative z-10 text-center">
        
        <!-- Top Pill Tag -->
        <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/80 light:bg-slate-100 border border-cyan-500/30 text-cyan-400 light:text-cyan-700 text-xs font-semibold mb-6 shadow-sm hover:border-cyan-400/50 transition-all cursor-pointer" onclick="window.App.openGuidedTour()">
          <span class="flex h-2 w-2 rounded-full bg-cyan-400 animate-ping"></span>
          <span class="font-bold">AptiLearn AI v2.5</span>
          <span class="text-slate-500">|</span>
          <span class="text-amber-400 font-bold">Hackathon 12-Step Signature Tour →</span>
        </div>

        <h1 class="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white light:text-slate-900 max-w-5xl mx-auto leading-[1.12]">
          Your Knowledge. Your Pace. <br/>
          <span class="bg-gradient-to-r from-cyan-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
            Your Personal AI Mentor.
          </span>
        </h1>

        <p class="mt-6 text-base sm:text-xl text-slate-300 light:text-slate-700 max-w-3xl mx-auto leading-relaxed">
          Unlike generic chatbots that simply regurgitate answers or static test banks that only score percentages, 
          <strong>AptiLearn AI</strong> continuously tracks your cognitive learner model, diagnoses root misconceptions, predicts exam readiness, and personalizes your path to mastery.
        </p>

        <!-- CTA Buttons -->
        <div class="mt-10 flex flex-wrap items-center justify-center gap-4">
          <button 
            onclick="window.App.openSignIn()" 
            class="px-7 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 text-white font-bold text-sm shadow-xl shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2 cursor-pointer">
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3">
              <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
              <polyline points="10 17 15 12 10 7"></polyline>
              <line x1="15" y1="12" x2="3" y2="12"></line>
            </svg>
            <span>Sign In / Login</span>
          </button>

          <button 
            onclick="window.App.startDiagnostic()" 
            class="px-6 py-3.5 rounded-xl bg-slate-900/90 light:bg-slate-100 border border-cyan-500/50 text-cyan-300 light:text-cyan-800 font-bold text-sm hover:bg-slate-800 light:hover:bg-slate-200 shadow-lg shadow-cyan-500/10 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2">
            <svg class="w-4 h-4 text-cyan-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
            <span>Take AI Diagnostic Test</span>
          </button>

          <button 
            onclick="window.App.openGuidedTour()" 
            class="px-6 py-3.5 rounded-xl bg-slate-900/90 light:bg-slate-100 border border-amber-500/50 text-amber-300 light:text-amber-700 font-bold text-sm hover:bg-slate-800 light:hover:bg-slate-200 shadow-lg shadow-amber-500/10 transition-all flex items-center gap-2">
            <svg class="w-4 h-4 text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polygon points="10 8 16 12 10 16 10 8"></polygon></svg>
            <span>12-Step Walkthrough</span>
          </button>

          <button 
            onclick="window.App.openSignUp()" 
            class="px-5 py-3.5 rounded-xl bg-slate-900 light:bg-slate-100 border border-slate-700 light:border-slate-300 text-slate-300 light:text-slate-800 hover:text-white font-semibold text-sm hover:border-slate-500 transition-all flex items-center gap-1.5">
            <span>✨</span>
            <span>Create Account</span>
          </button>
        </div>

        <!-- Metrics Strip -->
        <div class="mt-14 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          <div class="glass-card p-4 text-center">
            <div class="text-2xl sm:text-3xl font-extrabold text-cyan-400 font-mono">15+</div>
            <div class="text-xs text-slate-400 mt-1">Syllabus Concepts Graph</div>
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
            <div class="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-mono">BKT + ELO</div>
            <div class="text-xs text-slate-400 mt-1">Advanced Learner Model</div>
          </div>
        </div>

      </section>

      <!-- HOW APTILEARN WORKS (4-Step Feedback Loop) -->
      <section class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        <div class="glass-card p-6 sm:p-8 border border-cyan-500/30 shadow-2xl">
          <div class="text-center max-w-2xl mx-auto mb-8">
            <span class="text-xs font-bold text-cyan-400 uppercase tracking-widest">Autonomous Learning Loop</span>
            <h2 class="text-2xl sm:text-3xl font-extrabold text-white light:text-slate-900 mt-1">How AptiLearn AI Understands You</h2>
            <p class="text-xs sm:text-sm text-slate-400 mt-1">Every submitted answer updates your cognitive model in real-time.</p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div class="bg-slate-900/80 light:bg-slate-50 p-5 rounded-2xl border border-slate-800 light:border-slate-200">
              <div class="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-xs mb-3">1</div>
              <h4 class="font-bold text-sm text-white light:text-slate-900">AI Diagnostic Test</h4>
              <p class="text-xs text-slate-400 mt-1.5 leading-relaxed">Assesses prior knowledge across 15 Java & DSA topics to pinpoint strong foundations and missing prerequisites.</p>
            </div>

            <div class="bg-slate-900/80 light:bg-slate-50 p-5 rounded-2xl border border-slate-800 light:border-slate-200">
              <div class="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-xs mb-3">2</div>
              <h4 class="font-bold text-sm text-white light:text-slate-900">Learner Model & Graph</h4>
              <p class="text-xs text-slate-400 mt-1.5 leading-relaxed">Computes transparent concept mastery scores, updating the interactive prerequisite dependency graph.</p>
            </div>

            <div class="bg-slate-900/80 light:bg-slate-50 p-5 rounded-2xl border border-rose-500/30 bg-rose-950/10">
              <div class="w-8 h-8 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold text-xs mb-3">3</div>
              <h4 class="font-bold text-sm text-white light:text-slate-900">Misconception Detection</h4>
              <p class="text-xs text-slate-400 mt-1.5 leading-relaxed">Analyzes student-stated reasoning to uncover mental model flaws with side-by-side counterexample traces.</p>
            </div>

            <div class="bg-slate-900/80 light:bg-slate-50 p-5 rounded-2xl border border-emerald-500/30 bg-emerald-950/10">
              <div class="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs mb-3">4</div>
              <h4 class="font-bold text-sm text-white light:text-slate-900">Predictive Revision</h4>
              <p class="text-xs text-slate-400 mt-1.5 leading-relaxed">Schedules SM-2 spaced reviews right before memory decay, predicting exam readiness and topic difficulty.</p>
            </div>
          </div>
        </div>
      </section>

      <!-- COMPARISON MATRIX: AptiLearn vs ChatGPT vs Generic Test Banks -->
      <section class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div class="text-center mb-8">
          <span class="text-xs font-bold text-cyan-400 uppercase tracking-widest">Unrivaled Intelligence</span>
          <h2 class="text-3xl font-extrabold text-white light:text-slate-900 mt-1">Why AptiLearn AI Leads the Market</h2>
        </div>

        <div class="glass-card overflow-hidden border border-slate-800 light:border-slate-200">
          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs sm:text-sm">
              <thead class="bg-slate-900/90 light:bg-slate-100 text-slate-300 light:text-slate-700 border-b border-slate-800 text-[11px] uppercase tracking-wider">
                <tr>
                  <th class="py-4 px-6">Capability</th>
                  <th class="py-4 px-6 text-slate-400">Generic Chatbots</th>
                  <th class="py-4 px-6 text-slate-400">Static Question Banks</th>
                  <th class="py-4 px-6 text-cyan-400 font-bold bg-cyan-950/30">AptiLearn AI Ecosystem</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-800/70 light:divide-slate-200 text-slate-300 light:text-slate-700">
                <tr>
                  <td class="py-3.5 px-6 font-semibold text-white light:text-slate-900">Continuous Learner Model</td>
                  <td class="py-3.5 px-6 text-rose-400">❌ Stateless / Forgets context</td>
                  <td class="py-3.5 px-6 text-rose-400">❌ Raw marks only</td>
                  <td class="py-3.5 px-6 text-emerald-400 font-bold bg-cyan-950/20">✓ Continuous Bayesian Concept Calibration</td>
                </tr>
                <tr>
                  <td class="py-3.5 px-6 font-semibold text-white light:text-slate-900">Student Reasoning Misconception Analysis</td>
                  <td class="py-3.5 px-6 text-slate-400">⚠️ Only if prompted</td>
                  <td class="py-3.5 px-6 text-rose-400">❌ None (Generic key)</td>
                  <td class="py-3.5 px-6 text-emerald-400 font-bold bg-cyan-950/20">✓ Side-by-side counterexample code traces</td>
                </tr>
                <tr>
                  <td class="py-3.5 px-6 font-semibold text-white light:text-slate-900">15-Concept Prerequisite Knowledge Graph</td>
                  <td class="py-3.5 px-6 text-rose-400">❌ None</td>
                  <td class="py-3.5 px-6 text-slate-400">⚠️ Flat linear chapter lists</td>
                  <td class="py-3.5 px-6 text-emerald-400 font-bold bg-cyan-950/20">✓ Interactive visual canvas graph</td>
                </tr>
                <tr>
                  <td class="py-3.5 px-6 font-semibold text-white light:text-slate-900">AI Learning Predictor</td>
                  <td class="py-3.5 px-6 text-rose-400">❌ None</td>
                  <td class="py-3.5 px-6 text-rose-400">❌ None</td>
                  <td class="py-3.5 px-6 text-emerald-400 font-bold bg-cyan-950/20">✓ Exam readiness % & difficulty forecast</td>
                </tr>
                <tr>
                  <td class="py-3.5 px-6 font-semibold text-white light:text-slate-900">Smart Notes & Document Analyzer</td>
                  <td class="py-3.5 px-6 text-slate-400">⚠️ Text input only</td>
                  <td class="py-3.5 px-6 text-rose-400">❌ None</td>
                  <td class="py-3.5 px-6 text-emerald-400 font-bold bg-cyan-950/20">✓ Auto-generates MCQs, flashcards, Q&A</td>
                </tr>
                <tr>
                  <td class="py-3.5 px-6 font-semibold text-white light:text-slate-900">Real Exam Simulator & Coding Lab</td>
                  <td class="py-3.5 px-6 text-rose-400">❌ None</td>
                  <td class="py-3.5 px-6 text-slate-400">⚠️ Basic quiz timer</td>
                  <td class="py-3.5 px-6 text-emerald-400 font-bold bg-cyan-950/20">✓ Full mock test + Java test runner</td>
                </tr>
                <tr>
                  <td class="py-3.5 px-6 font-semibold text-white light:text-slate-900">Teacher & Parent/Mentor Portals</td>
                  <td class="py-3.5 px-6 text-rose-400">❌ None</td>
                  <td class="py-3.5 px-6 text-slate-400">⚠️ Simple gradebook</td>
                  <td class="py-3.5 px-6 text-emerald-400 font-bold bg-cyan-950/20">✓ Cohort heatmaps & consistency tracking</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <!-- TESTIMONIALS (Sample Demo Content) -->
      <section class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div class="text-center mb-8">
          <span class="text-xs font-bold text-indigo-400 uppercase tracking-widest">Learner Feedback</span>
          <h2 class="text-2xl sm:text-3xl font-extrabold text-white light:text-slate-900 mt-1">Student & Instructor Reviews</h2>
          <p class="text-xs text-slate-400">Sample evaluation testimonials from prototype cohorts.</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="glass-card p-6 border border-slate-800 light:border-slate-200 space-y-3">
            <div class="flex text-amber-400 text-sm">★★★★★</div>
            <p class="text-xs text-slate-300 light:text-slate-700 italic leading-relaxed">
              "AptiLearn didn't just tell me my recursion answer was wrong; it showed me the exact StackOverflowError execution trace and fixed my base case misunderstanding in 10 minutes!"
            </p>
            <div class="pt-2 border-t border-slate-800 text-xs">
              <div class="font-bold text-white light:text-slate-900">Rohan Mehta</div>
              <div class="text-[10px] text-slate-400">B.Tech CS Student • Cleared Tech Screening</div>
            </div>
          </div>

          <div class="glass-card p-6 border border-slate-800 light:border-slate-200 space-y-3">
            <div class="flex text-amber-400 text-sm">★★★★★</div>
            <p class="text-xs text-slate-300 light:text-slate-700 italic leading-relaxed">
              "The Teacher Heatmap revolutionized my CS201 lectures. I instantly saw 68% of my class had the exact same misconception on array boundaries before the midterm exam."
            </p>
            <div class="pt-2 border-t border-slate-800 text-xs">
              <div class="font-bold text-white light:text-slate-900">Dr. Sarah Jenkins</div>
              <div class="text-[10px] text-slate-400">University CS Faculty</div>
            </div>
          </div>

          <div class="glass-card p-6 border border-slate-800 light:border-slate-200 space-y-3">
            <div class="flex text-amber-400 text-sm">★★★★★</div>
            <p class="text-xs text-slate-300 light:text-slate-700 italic leading-relaxed">
              "Uploading my PDF lecture notes and having AptiLearn generate custom flashcards and grounded Q&A saved me 15 hours of manual note-taking before finals!"
            </p>
            <div class="pt-2 border-t border-slate-800 text-xs">
              <div class="font-bold text-white light:text-slate-900">Ananya Verma</div>
              <div class="text-[10px] text-slate-400">Placement Exam Candidate</div>
            </div>
          </div>
        </div>
      </section>

      <!-- PRICING SECTION (Sample Plans) -->
      <section class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div class="text-center mb-8">
          <span class="text-xs font-bold text-cyan-400 uppercase tracking-widest">Accessible Learning</span>
          <h2 class="text-2xl sm:text-3xl font-extrabold text-white light:text-slate-900 mt-1">Transparent Demo Plans</h2>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="glass-card p-6 border border-slate-800 text-center flex flex-col justify-between">
            <div>
              <h3 class="font-bold text-lg text-white light:text-slate-900">Free Explorer</h3>
              <div class="text-3xl font-extrabold text-white light:text-slate-900 font-mono my-3">$0</div>
              <p class="text-xs text-slate-400">Foundational adaptive practice and diagnostic tests.</p>
              <ul class="text-xs text-slate-300 light:text-slate-700 space-y-2 text-left my-4">
                <li>✓ Full Diagnostic Placement Test</li>
                <li>✓ 15-Concept Knowledge Graph</li>
                <li>✓ Basic Spaced Repetition (SM-2)</li>
              </ul>
            </div>
            <button onclick="window.App.openSignUp()" class="w-full py-2.5 rounded-xl bg-slate-800 text-xs font-bold text-slate-200 hover:text-white hover:bg-slate-700 transition-colors">Register Free Account →</button>
          </div>

          <div class="glass-card p-6 border border-cyan-500/50 bg-cyan-950/20 text-center flex flex-col justify-between shadow-xl shadow-cyan-500/10">
            <div>
              <span class="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-cyan-500 text-slate-950 font-mono">Most Popular</span>
              <h3 class="font-bold text-lg text-white light:text-slate-900 mt-2">AptiLearn Pro</h3>
              <div class="text-3xl font-extrabold text-cyan-400 font-mono my-3">$14 <span class="text-xs font-normal text-slate-400">/ mo</span></div>
              <p class="text-xs text-slate-300">Complete AI cognitive ecosystem for exam preparation.</p>
              <ul class="text-xs text-slate-300 light:text-slate-700 space-y-2 text-left my-4">
                <li>✓ All Free Explorer Features</li>
                <li>✓ AI Misconception Detection & Traces</li>
                <li>✓ Real Exam Simulator & Negative Marking</li>
                <li>✓ Interactive Java Coding Lab</li>
                <li>✓ Smart Notes & PDF Document Analyzer</li>
                <li>✓ AI Learning Predictor Forecasts</li>
              </ul>
            </div>
            <button onclick="window.App.openSignIn()" class="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-xs font-bold text-white shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all">Sign In to Pro Account →</button>
          </div>

          <div class="glass-card p-6 border border-indigo-500/40 text-center flex flex-col justify-between">
            <div>
              <h3 class="font-bold text-lg text-white light:text-slate-900">Campus & Educator</h3>
              <div class="text-3xl font-extrabold text-indigo-400 font-mono my-3">Custom</div>
              <p class="text-xs text-slate-400">Institution-wide cohort analytics & parent portals.</p>
              <ul class="text-xs text-slate-300 light:text-slate-700 space-y-2 text-left my-4">
                <li>✓ Teacher & Classroom Dashboard</li>
                <li>✓ Class-wide Misconception Heatmaps</li>
                <li>✓ At-Risk Student Intervention Alerts</li>
                <li>✓ Parent / Mentor Real-time Progress</li>
              </ul>
            </div>
            <button onclick="window.App.switchPersona('teacher')" class="w-full py-2.5 rounded-xl bg-indigo-600 text-xs font-bold text-white hover:bg-indigo-500">Teacher View →</button>
          </div>
        </div>
      </section>

      <!-- FAQ SECTION -->
      <section class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div class="text-center mb-8">
          <span class="text-xs font-bold text-cyan-400 uppercase tracking-widest">Common Questions</span>
          <h2 class="text-2xl sm:text-3xl font-extrabold text-white light:text-slate-900 mt-1">Frequently Asked Questions</h2>
        </div>

        <div class="space-y-3 text-xs sm:text-sm">
          <div class="glass-card p-4 border border-slate-800">
            <h4 class="font-bold text-white light:text-slate-900">How is AptiLearn AI different from asking ChatGPT questions?</h4>
            <p class="text-slate-300 light:text-slate-600 mt-1">ChatGPT is stateless and forgets your mistakes across sessions. AptiLearn AI maintains a persistent Bayesian Learner Model that tracks concept mastery over time, schedules SM-2 spaced revisions, and identifies underlying cognitive misconceptions.</p>
          </div>

          <div class="glass-card p-4 border border-slate-800">
            <h4 class="font-bold text-white light:text-slate-900">Does the code execution in Coding Lab run arbitrary code on the server?</h4>
            <p class="text-slate-300 light:text-slate-600 mt-1">No. For security and sandboxing compliance, code test cases are safely analyzed client-side via simulated test fixtures and static AST analysis, never executing untrusted code on production application servers.</p>
          </div>

          <div class="glass-card p-4 border border-slate-800">
            <h4 class="font-bold text-white light:text-slate-900">Can I upload my own PDF notes for analysis?</h4>
            <p class="text-slate-300 light:text-slate-600 mt-1">Yes! Use the Smart Notes section to upload any PDF or lecture text. AptiLearn will extract summaries, key concepts, auto-generate MCQs, and ground tutor Q&A in your notes.</p>
          </div>
        </div>
      </section>

      <!-- FOOTER -->
      <footer class="border-t border-slate-800/80 py-12 text-center text-xs text-slate-400">
        <div class="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div class="flex items-center gap-2">
            <span class="font-bold text-white light:text-slate-900">AptiLearn AI</span>
            <span>— "Your Knowledge. Your Pace. Your Personal AI Mentor."</span>
          </div>
          <div class="flex flex-wrap items-center gap-4">
            <button onclick="window.App.openSignIn()" class="text-cyan-400 hover:underline font-bold">Sign In</button>
            <button onclick="window.App.openSignUp()" class="text-emerald-400 hover:underline font-bold">Register</button>
            <button onclick="window.App.openGuidedTour()" class="text-amber-400 hover:underline font-semibold">12-Step Signature Tour</button>
            <button onclick="window.App.navigate('dashboard')" class="hover:text-white">Dashboard</button>
            <button onclick="window.App.navigate('coding')" class="hover:text-white">Coding Lab</button>
            <button onclick="window.App.navigate('exam')" class="hover:text-white">Exam Simulator</button>
            <button onclick="window.App.navigate('teacher')" class="hover:text-white">Teacher Portal</button>
          </div>
          <div>Built with engineering excellence for intelligent adaptive learning.</div>
        </div>
      </footer>

    </div>
  `;
}
