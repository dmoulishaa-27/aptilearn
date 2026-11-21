// LearnIQ Top Navigation Bar
import { store } from '../state.js';
import { sound } from '../soundFx.js';

export function renderNavbar() {
  const user = store.currentUser;
  const currentRoute = store.currentRoute;
  const isTeacher = user && user.role === 'teacher';

  const navItems = isTeacher ? [
    { id: 'teacher', label: 'Cohort Overview', icon: 'users' },
    { id: 'graph', label: 'Curriculum Graph', icon: 'git-merge' },
    { id: 'reports', label: 'Class Analytics', icon: 'bar-chart-2' }
  ] : [
    { id: 'dashboard', label: 'Dashboard', icon: 'layout' },
    { id: 'graph', label: 'Knowledge Graph', icon: 'git-merge' },
    { id: 'practice', label: 'Adaptive Practice', icon: 'crosshair', badge: 'AI' },
    { id: 'misconceptions', label: 'Misconceptions', icon: 'alert-triangle', count: user?.activeMisconceptions?.filter(m => !m.resolved)?.length || 0 },
    { id: 'revision', label: 'Spaced Revision', icon: 'calendar', count: user?.spacedRepetitionQueue?.filter(c => c.dueStatus === 'Due Today')?.length || 0 },
    { id: 'tutor', label: 'AI Tutor', icon: 'message-square', badge: 'Socrates' },
    { id: 'reports', label: 'Analytics', icon: 'bar-chart-2' }
  ];

  return `
    <header class="sticky top-0 z-40 bg-slate-950/85 backdrop-blur-md border-b border-slate-800/80 px-4 lg:px-8 py-3 transition-all">
      <div class="max-w-7xl mx-auto flex items-center justify-between gap-4">
        
        <!-- Left: Logo & Brand -->
        <div class="flex items-center gap-3 cursor-pointer group" onclick="window.App.navigate('landing')">
          <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-600 to-purple-600 p-[2px] shadow-lg shadow-cyan-500/20 group-hover:shadow-cyan-500/40 transition-all">
            <div class="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <svg class="w-5 h-5 text-cyan-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
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
            <div class="flex items-center gap-2">
              <span class="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-100 to-cyan-300 bg-clip-text text-transparent">LearnIQ</span>
              <span class="text-[10px] uppercase tracking-wider font-bold px-1.5 py-0.5 rounded bg-cyan-950/80 text-cyan-400 border border-cyan-800/50">Adaptive</span>
            </div>
            <p class="text-[11px] text-slate-400 hidden sm:block">AI Exam-Prep with Learner Model</p>
          </div>
        </div>

        <!-- Center: Navigation Tabs (Desktop) -->
        <nav class="hidden lg:flex items-center gap-1 bg-slate-900/60 p-1.5 rounded-xl border border-slate-800/70">
          ${navItems.map(item => `
            <button 
              onclick="window.App.navigate('${item.id}')"
              class="flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                currentRoute === item.id 
                  ? 'bg-gradient-to-r from-cyan-600/30 to-indigo-600/30 text-cyan-300 border border-cyan-500/30 shadow-sm' 
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }">
              <span>${item.label}</span>
              ${item.badge ? `<span class="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">${item.badge}</span>` : ''}
              ${item.count ? `<span class="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">${item.count}</span>` : ''}
            </button>
          `).join('')}
        </nav>

        <!-- Right: Actions, Streaks, Personas & Walkthrough -->
        <div class="flex items-center gap-2 sm:gap-3">
          
          <!-- Judge Guided Walkthrough Button -->
          <button 
            onclick="window.App.openGuidedTour()" 
            class="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/40 text-amber-300 hover:bg-amber-500/30 text-xs font-semibold shadow-sm transition-all animate-pulse-slow">
            <svg class="w-3.5 h-3.5 text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
            <span>Judge 9-Step Tour</span>
          </button>

          <!-- Streak Counter -->
          ${!isTeacher && user ? `
            <div class="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-amber-950/30 border border-amber-800/40 text-amber-400 text-xs font-semibold" title="${user.streakDays || 1} Day Learning Streak!">
              <svg class="w-4 h-4 text-amber-400 animate-bounce" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2c1.1 0 2 .9 2 2 0 1.5-1 3-2 4-1-1-2-2.5-2-4 0-1.1.9-2 2-2zm0 6c3.31 0 6 2.69 6 6 0 3.31-2.69 6-6 6s-6-2.69-6-6c0-3.31 2.69-6 6-6z"/>
              </svg>
              <span>${user.streakDays || 1}d</span>
            </div>
          ` : ''}

          <!-- XP Pill -->
          ${!isTeacher && user ? `
            <div class="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-indigo-950/40 border border-indigo-800/40 text-indigo-300 text-xs font-semibold" title="Total Experience Points">
              <svg class="w-3.5 h-3.5 text-indigo-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
              <span>${user.totalXp || 0} XP</span>
            </div>
          ` : ''}

          <!-- Persona Quick Switcher Dropdown -->
          <div class="relative">
            <button 
              id="persona-dropdown-btn"
              onclick="window.App.togglePersonaMenu()"
              class="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs font-medium text-slate-200 transition-all">
              <img src="${user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'}" class="w-6 h-6 rounded-full object-cover border border-cyan-500/50" alt="Avatar"/>
              <span class="hidden sm:inline font-semibold">${user?.name?.split(' ')[0] || 'User'}</span>
              <svg class="w-3.5 h-3.5 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"></polyline></svg>
            </button>

            <!-- Dropdown Menu -->
            <div id="persona-menu" class="hidden absolute right-0 mt-2 w-64 bg-slate-900/95 border border-slate-800 rounded-2xl shadow-2xl p-2 z-50 backdrop-blur-xl">
              <div class="px-3 py-2 border-b border-slate-800 text-[11px] text-slate-400 font-semibold uppercase tracking-wider">
                Switch Demo Persona
              </div>
              <button onclick="window.App.switchPersona('alex')" class="w-full text-left px-3 py-2 rounded-xl text-xs hover:bg-slate-800 flex items-center justify-between transition-all ${user?.id === 'alex_rivera' ? 'text-cyan-300 bg-cyan-950/30' : 'text-slate-300'}">
                <div>
                  <div class="font-semibold text-white">Alex Rivera (Student)</div>
                  <div class="text-[10px] text-rose-400">Struggling with Recursion</div>
                </div>
                ${user?.id === 'alex_rivera' ? '<span class="text-cyan-400 font-bold">✓</span>' : ''}
              </button>

              <button onclick="window.App.switchPersona('priya')" class="w-full text-left px-3 py-2 rounded-xl text-xs hover:bg-slate-800 flex items-center justify-between transition-all ${user?.id === 'priya_sharma' ? 'text-cyan-300 bg-cyan-950/30' : 'text-slate-300'}">
                <div>
                  <div class="font-semibold text-white">Priya Sharma (Student)</div>
                  <div class="text-[10px] text-emerald-400">Advanced Mastery (88%)</div>
                </div>
                ${user?.id === 'priya_sharma' ? '<span class="text-cyan-400 font-bold">✓</span>' : ''}
              </button>

              <button onclick="window.App.switchPersona('teacher')" class="w-full text-left px-3 py-2 rounded-xl text-xs hover:bg-slate-800 flex items-center justify-between transition-all ${user?.id === 'prof_harrison' ? 'text-cyan-300 bg-cyan-950/30' : 'text-slate-300'}">
                <div>
                  <div class="font-semibold text-white">Prof. Harrison (Teacher)</div>
                  <div class="text-[10px] text-indigo-400">Cohort Analytics & Heatmap</div>
                </div>
                ${user?.id === 'prof_harrison' ? '<span class="text-cyan-400 font-bold">✓</span>' : ''}
              </button>

              <button onclick="window.App.switchPersona('fresh')" class="w-full text-left px-3 py-2 rounded-xl text-xs hover:bg-slate-800 flex items-center justify-between transition-all ${user?.id === 'new_student' ? 'text-cyan-300 bg-cyan-950/30' : 'text-slate-300'}">
                <div>
                  <div class="font-semibold text-white">Clean Slate Learner</div>
                  <div class="text-[10px] text-amber-400">Take Diagnostic from 0%</div>
                </div>
                ${user?.id === 'new_student' ? '<span class="text-cyan-400 font-bold">✓</span>' : ''}
              </button>

              <div class="mt-2 pt-2 border-t border-slate-800 flex items-center justify-between px-3 py-1">
                <button onclick="window.App.toggleSound()" class="text-[11px] text-slate-400 hover:text-white flex items-center gap-1.5">
                  <span>Sound: ${store.soundEnabled ? '🔊 On' : '🔇 Muted'}</span>
                </button>
                <button onclick="window.App.openSettingsModal()" class="text-[11px] text-cyan-400 hover:underline">
                  API Key
                </button>
              </div>
            </div>
          </div>

          <!-- Mobile Nav Toggle -->
          <button 
            onclick="window.App.toggleMobileMenu()" 
            class="lg:hidden p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white">
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
          </button>
        </div>

      </div>

      <!-- Mobile Navigation Drawer -->
      <div id="mobile-menu" class="hidden lg:hidden mt-3 pt-3 border-t border-slate-800 flex flex-col gap-1.5 pb-2">
        ${navItems.map(item => `
          <button 
            onclick="window.App.navigate('${item.id}'); window.App.toggleMobileMenu();"
            class="flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-medium ${
              currentRoute === item.id ? 'bg-cyan-950/50 text-cyan-300 border border-cyan-800/40' : 'text-slate-300 hover:bg-slate-900'
            }">
            <span>${item.label}</span>
            ${item.count ? `<span class="px-1.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 text-[10px]">${item.count}</span>` : ''}
          </button>
        `).join('')}
        <button 
          onclick="window.App.openGuidedTour(); window.App.toggleMobileMenu();" 
          class="mt-2 flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-semibold">
          ★ Judge 9-Step Walkthrough Tour
        </button>
      </div>
    </header>
  `;
}
