// LearnIQ Studio 3.0 Left Docked Sidebar Component
import { store } from '../state.js';
import { sound } from '../soundFx.js';

export function renderSidebar() {
  const user = store.currentUser;
  const currentRoute = store.currentRoute;
  const activeMisconceptionsCount = user?.activeMisconceptions?.filter(m => !m.resolved)?.length || 0;
  const dueRevisionCount = user?.spacedRepetitionQueue?.filter(c => c.dueStatus === 'Due Today')?.length || 0;

  const workspaceNav = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊', subtitle: 'Learner Model' },
    { id: 'graph', label: 'Concept DAG', icon: '🕸️', subtitle: '15-Node Syllabus' },
    { id: 'practice', label: 'Adaptive', icon: '⚡', subtitle: 'Targeted Drills', badge: 'AI' },
    { id: 'misconceptions', label: 'Misconcept', icon: '🛡️', subtitle: 'Bug Detection', count: activeMisconceptionsCount },
    { id: 'revision', label: 'Spaced SM-2', icon: '🧠', subtitle: 'Memory Recall', count: dueRevisionCount },
    { id: 'coding', label: 'Coding Lab', icon: '💻', subtitle: 'Java AST Sandbox', badge: 'Java' },
    { id: 'exam', label: 'Exam Sim', icon: '⏱️', subtitle: '15-Min Mock Test', badge: 'Mock' },
    { id: 'notes', label: 'Smart Notes', icon: '📄', subtitle: 'PDF Analyzer' },
    { id: 'flashcards', label: 'Flashcards', icon: '📇', subtitle: '3D Flip Deck' },
    { id: 'predictor', label: 'Predictor', icon: '🔮', subtitle: 'Readiness Score' },
    { id: 'planner', label: 'Planner', icon: '📅', subtitle: 'Adaptive Schedule' }
  ];

  const intelligenceNav = [
    { id: 'tutor', label: 'AI Copilot', icon: '💬', subtitle: 'Socrates Mentor', badge: 'Live' },
    { id: 'diagnostic', label: 'Diagnostic', icon: '⏱️', subtitle: 'Baseline Placement' },
    { id: 'teacher', label: 'Teacher UI', icon: '🎓', subtitle: 'Cohort Heatmap' },
    { id: 'parent', label: 'Parent UI', icon: '👩‍👧', subtitle: 'Consistency Matrix' },
    { id: 'reports', label: 'Reports', icon: '📈', subtitle: 'PDF Diagnostics' }
  ];

  return `
    <div class="w-64 h-screen bg-[#070b14] dark:bg-[#070b14] light:bg-white border-r border-slate-800/80 light:border-slate-200 flex flex-col justify-between text-slate-300 light:text-slate-800 select-none shadow-xl">
      
      <!-- Top Branding & Persona Switcher -->
      <div class="p-3.5 border-b border-slate-800/80 light:border-slate-200">
        
        <!-- Logo -->
        <div class="flex items-center justify-between cursor-pointer group mb-3" onclick="window.App.navigate('landing')">
          <div class="flex items-center gap-2.5">
            <div class="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-600 to-purple-600 p-[2px] shadow-lg shadow-cyan-500/25">
              <div class="w-full h-full bg-[#070b14] dark:bg-[#070b14] light:bg-white rounded-[10px] flex items-center justify-center">
                <svg class="w-4 h-4 text-cyan-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3">
                  <path d="M12 2v8"></path>
                  <path d="m4.93 10.93 1.41 1.41"></path>
                  <path d="M2 18h2"></path>
                  <path d="M20 18h2"></path>
                  <path d="m19.07 10.93-1.41 1.41"></path>
                  <path d="M22 22H2"></path>
                  <path d="m8 22 4-10 4 10"></path>
                </svg>
              </div>
            </div>
            <div>
              <div class="flex items-center gap-1.5">
                <span class="text-sm font-extrabold tracking-tight text-white light:text-slate-900 font-sans">LEARNIQ</span>
                <span class="text-[9px] font-mono px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-400 border border-cyan-800/60 font-bold">STUDIO 3.0</span>
              </div>
              <p class="text-[10px] text-slate-400">Adaptive Cognitive OS</p>
            </div>
          </div>
        </div>

        <!-- Persona Switcher Capsule -->
        <div class="relative">
          <button 
            id="sidebar-persona-btn"
            onclick="window.App.togglePersonaMenu()"
            class="w-full flex items-center justify-between p-2 rounded-xl bg-[#0b1120] dark:bg-[#0b1120] light:bg-slate-100 border border-slate-800 light:border-slate-300 hover:border-cyan-500/60 transition-all text-left">
            <div class="flex items-center gap-2 min-w-0">
              <img src="${user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'}" class="w-6 h-6 rounded-lg object-cover border border-cyan-500/50 shrink-0" alt="Avatar"/>
              <div class="min-w-0">
                <div class="text-xs font-bold text-white light:text-slate-900 truncate">${user?.name || 'Alex Chen'}</div>
                <div class="text-[10px] text-cyan-400 flex items-center gap-1">
                  <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span class="truncate">${user?.role === 'teacher' ? 'Faculty Mode' : (user?.role === 'parent' ? 'Mentor Mode' : 'Learner')}</span>
                </div>
              </div>
            </div>
            <span class="text-xs text-slate-400 shrink-0">▾</span>
          </button>

          <!-- Dropdown Menu for Persona Switcher -->
          <div id="persona-menu" class="hidden absolute left-0 right-0 top-12 mt-1 bg-[#0b1120]/95 dark:bg-[#0b1120]/95 light:bg-white border border-slate-800 light:border-slate-300 rounded-2xl shadow-2xl p-2 z-50 backdrop-blur-xl">
            <div class="px-2 py-1 text-[9px] uppercase font-bold text-slate-400 border-b border-slate-800/70 pb-1 mb-1">
              Select Persona
            </div>
            <button onclick="window.App.switchPersona('alex')" class="w-full text-left p-2 rounded-xl text-xs hover:bg-slate-800 light:hover:bg-slate-100 flex items-center justify-between ${user?.id === 'alex_rivera' ? 'text-cyan-400 bg-cyan-950/40' : 'text-slate-300 light:text-slate-800'}">
              <div>
                <div class="font-bold">Alex Chen (Student)</div>
                <div class="text-[9px] text-rose-400">Needs Recursion Remediation</div>
              </div>
              ${user?.id === 'alex_rivera' ? '✓' : ''}
            </button>
            <button onclick="window.App.switchPersona('priya')" class="w-full text-left p-2 rounded-xl text-xs hover:bg-slate-800 light:hover:bg-slate-100 flex items-center justify-between ${user?.id === 'priya_sharma' ? 'text-cyan-400 bg-cyan-950/40' : 'text-slate-300 light:text-slate-800'}">
              <div>
                <div class="font-bold">Priya Sharma (Student)</div>
                <div class="text-[9px] text-emerald-400">Advanced Mastery (88%)</div>
              </div>
              ${user?.id === 'priya_sharma' ? '✓' : ''}
            </button>
            <button onclick="window.App.switchPersona('teacher')" class="w-full text-left p-2 rounded-xl text-xs hover:bg-slate-800 light:hover:bg-slate-100 flex items-center justify-between ${user?.id === 'prof_harrison' ? 'text-indigo-400 bg-indigo-950/40' : 'text-slate-300 light:text-slate-800'}">
              <div>
                <div class="font-bold">Prof. Harrison (Teacher)</div>
                <div class="text-[9px] text-indigo-400">Cohort Heatmap View</div>
              </div>
              ${user?.id === 'prof_harrison' ? '✓' : ''}
            </button>
            <button onclick="window.App.switchPersona('parent')" class="w-full text-left p-2 rounded-xl text-xs hover:bg-slate-800 light:hover:bg-slate-100 flex items-center justify-between ${user?.id === 'eleanor_rivera' ? 'text-pink-400 bg-pink-950/40' : 'text-slate-300 light:text-slate-800'}">
              <div>
                <div class="font-bold">Eleanor (Parent/Mentor)</div>
                <div class="text-[9px] text-pink-400">Consistency View</div>
              </div>
              ${user?.id === 'eleanor_rivera' ? '✓' : ''}
            </button>
            <div class="border-t border-slate-800/60 pt-1 mt-1">
              <button onclick="window.App.openSignIn()" class="w-full text-left p-1.5 rounded-lg text-xs font-semibold text-cyan-400 hover:bg-cyan-950/40 flex items-center gap-1.5">
                <span>🔑</span>
                <span>Sign In / Custom Login</span>
              </button>
              <button onclick="window.App.signOut()" class="w-full text-left p-1.5 rounded-lg text-xs font-semibold text-rose-400 hover:bg-rose-950/40 flex items-center gap-1.5">
                <span>🚪</span>
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>

      </div>

      <!-- Scrollable Navigation Items -->
      <div class="flex-1 overflow-y-auto px-2.5 py-3 space-y-4">
        
        <!-- WORKSPACE Section -->
        <div>
          <div class="px-2 pb-1.5 text-[9px] uppercase tracking-wider font-extrabold text-slate-500 light:text-slate-400 flex items-center justify-between">
            <span>─ WORKSPACE ─</span>
            <span class="font-mono text-[8px] text-slate-600">SYS</span>
          </div>
          <div class="space-y-0.5">
            ${workspaceNav.map(item => `
              <button 
                onclick="window.App.navigate('${item.id}')"
                class="w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  currentRoute === item.id 
                    ? 'nav-link-active bg-cyan-950/50 text-cyan-300 shadow-sm' 
                    : 'text-slate-300 light:text-slate-700 hover:bg-slate-900/80 light:hover:bg-slate-100 hover:text-white'
                }">
                <div class="flex items-center gap-2.5 min-w-0">
                  <span class="text-sm shrink-0">${item.icon}</span>
                  <div class="text-left min-w-0">
                    <div class="truncate">${item.label}</div>
                  </div>
                </div>
                <div class="flex items-center gap-1 shrink-0">
                  ${item.badge ? `<span class="text-[8px] font-bold px-1.5 py-0.2 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">${item.badge}</span>` : ''}
                  ${item.count ? `<span class="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">${item.count}</span>` : ''}
                </div>
              </button>
            `).join('')}
          </div>
        </div>

        <!-- INTELLIGENCE Section -->
        <div>
          <div class="px-2 pb-1.5 text-[9px] uppercase tracking-wider font-extrabold text-slate-500 light:text-slate-400 flex items-center justify-between">
            <span>─ INTELLIGENCE ─</span>
            <span class="font-mono text-[8px] text-slate-600">AI</span>
          </div>
          <div class="space-y-0.5">
            ${intelligenceNav.map(item => `
              <button 
                onclick="window.App.navigate('${item.id}')"
                class="w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  currentRoute === item.id 
                    ? 'nav-link-active bg-cyan-950/50 text-cyan-300 shadow-sm' 
                    : 'text-slate-300 light:text-slate-700 hover:bg-slate-900/80 light:hover:bg-slate-100 hover:text-white'
                }">
                <div class="flex items-center gap-2.5 min-w-0">
                  <span class="text-sm shrink-0">${item.icon}</span>
                  <div class="text-left min-w-0">
                    <div class="truncate">${item.label}</div>
                  </div>
                </div>
                ${item.badge ? `<span class="text-[8px] font-bold px-1.5 py-0.2 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">${item.badge}</span>` : ''}
              </button>
            `).join('')}
          </div>
        </div>

      </div>

      <!-- Bottom Studio Actions & Preferences -->
      <div class="p-3 border-t border-slate-800/80 light:border-slate-200 bg-[#070b14] dark:bg-[#070b14] light:bg-slate-50">
        
        <!-- Instant 9-Step Tour CTA -->
        <button 
          onclick="window.App.openGuidedTour()" 
          class="w-full mb-2.5 py-2 px-3 rounded-xl bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-amber-500/20 border border-amber-500/40 text-amber-300 hover:bg-amber-500/30 text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all animate-pulse-slow">
          <span>⭐</span>
          <span>9-Step Judge Tour</span>
        </button>

        <!-- Preference Toggles: Language, Voice & Theme -->
        <div class="flex items-center justify-between gap-1 text-xs">
          
          <button 
            onclick="window.App.toggleLanguage()" 
            class="px-2 py-1 rounded-lg bg-slate-900 light:bg-white border border-slate-800 light:border-slate-300 text-[11px] font-semibold text-slate-300 light:text-slate-700 hover:border-cyan-500"
            title="Switch Language (English / Hindi)">
            ${store.language === 'hi' ? '🇮🇳 हिंदी' : '🇬🇧 EN'}
          </button>

          <button 
            onclick="window.App.toggleVoice()" 
            class="p-1.5 rounded-lg bg-slate-900 light:bg-white border border-slate-800 light:border-slate-300 text-xs ${store.voiceEnabled ? 'text-cyan-400' : 'text-slate-500'} hover:border-cyan-500"
            title="Toggle Voice Read-Aloud">
            ${store.voiceEnabled ? '🔊' : '🔇'}
          </button>

          <button 
            onclick="window.App.toggleTheme()" 
            class="p-1.5 rounded-lg bg-slate-900 light:bg-white border border-slate-800 light:border-slate-300 text-xs text-slate-300 light:text-slate-700 hover:border-cyan-500"
            title="Toggle Light / Dark Mode">
            ${store.theme === 'light' ? '☀️' : '🌙'}
          </button>

          <button 
            onclick="window.App.openSignIn()" 
            class="px-2.5 py-1 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-[11px] font-bold shadow-sm"
            title="Sign In">
            Sign In
          </button>

        </div>

      </div>

    </div>
  `;
}
