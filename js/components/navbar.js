// AptiLearn AI Top Navigation Bar & Action Shell
import { store } from '../state.js';
import { sound } from '../soundFx.js';

export function renderNavbar() {
  const user = store.currentUser;
  const currentRoute = store.currentRoute;
  const unreadNotifs = store.notifications.filter(n => !n.read).length;
  const isTeacher = user && user.role === 'teacher';
  const isParent = user && user.role === 'parent';

  const navItems = isTeacher ? [
    { id: 'teacher', label: 'Cohort Overview', icon: 'users' },
    { id: 'graph', label: 'Curriculum Graph', icon: 'git-merge' },
    { id: 'reports', label: 'Class Analytics', icon: 'bar-chart-2' }
  ] : (isParent ? [
    { id: 'parent', label: 'Student Progress', icon: 'heart' },
    { id: 'predictor', label: 'Readiness Forecast', icon: 'trending-up' },
    { id: 'reports', label: 'Weekly Summary', icon: 'file-text' }
  ] : [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'graph', label: 'Knowledge Graph' },
    { id: 'practice', label: 'Adaptive Practice', badge: 'AI' },
    { id: 'coding', label: 'Coding Lab', badge: 'Java' },
    { id: 'exam', label: 'Exam Simulator', badge: 'Mock' },
    { id: 'misconceptions', label: 'Mistakes', count: user?.activeMisconceptions?.filter(m => !m.resolved)?.length || 0 },
    { id: 'revision', label: 'Revision', count: user?.spacedRepetitionQueue?.filter(c => c.dueStatus === 'Due Today')?.length || 0 },
    { id: 'notes', label: 'Smart Notes' },
    { id: 'flashcards', label: 'Flashcards' },
    { id: 'tutor', label: 'AI Tutor', badge: 'Socrates' },
    { id: 'predictor', label: 'Predictor' },
    { id: 'planner', label: 'Planner' },
    { id: 'reports', label: 'Analytics' }
  ]);

  return `
    <header class="sticky top-0 z-40 bg-slate-950/90 dark:bg-slate-950/90 light:bg-white/95 backdrop-blur-md border-b border-slate-800/80 light:border-slate-200 px-3 lg:px-6 py-2.5 transition-all">
      <div class="max-w-[1600px] mx-auto flex items-center justify-between gap-3">
        
        <!-- Left: Logo & Brand -->
        <div class="flex items-center gap-3 cursor-pointer group shrink-0" onclick="window.App.navigate('landing')">
          <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-600 to-purple-600 p-[2px] shadow-lg shadow-cyan-500/20 group-hover:shadow-cyan-500/40 transition-all">
            <div class="w-full h-full bg-slate-950 dark:bg-slate-950 light:bg-white rounded-[10px] flex items-center justify-center">
              <svg class="w-5 h-5 text-cyan-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3">
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
              <span class="text-lg font-bold tracking-tight bg-gradient-to-r from-white via-slate-100 to-cyan-300 light:from-slate-900 light:to-indigo-600 bg-clip-text text-transparent">AptiLearn AI</span>
              <span class="text-[9px] uppercase tracking-wider font-extrabold px-1.5 py-0.2 rounded bg-cyan-950/80 text-cyan-400 border border-cyan-800/60">Adaptive</span>
            </div>
            <p class="text-[10px] text-slate-400 hidden sm:block italic font-sans">"Your Knowledge. Your Pace. Your Personal AI Mentor."</p>
          </div>
        </div>

        <!-- Center: Navigation Tabs (Desktop Scrolling Nav) -->
        <nav class="hidden xl:flex items-center gap-1 bg-slate-900/60 light:bg-slate-100 p-1 rounded-xl border border-slate-800/70 light:border-slate-200 overflow-x-auto max-w-2xl">
          ${navItems.map(item => `
            <button 
              onclick="window.App.navigate('${item.id}')"
              class="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                currentRoute === item.id 
                  ? 'bg-gradient-to-r from-cyan-600/30 to-indigo-600/30 text-cyan-300 border border-cyan-500/40 shadow-sm' 
                  : 'text-slate-300 light:text-slate-700 hover:text-white light:hover:text-black hover:bg-slate-800/60 light:hover:bg-slate-200'
              }">
              <span>${item.label}</span>
              ${item.badge ? `<span class="text-[8px] font-bold px-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">${item.badge}</span>` : ''}
              ${item.count ? `<span class="text-[9px] font-bold px-1.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">${item.count}</span>` : ''}
            </button>
          `).join('')}
        </nav>

        <!-- Right: Actions, Streaks, Language, Theme & Tour -->
        <div class="flex items-center gap-1.5 sm:gap-2.5">
          
          <!-- Hackathon 12-Step Signature Tour Button -->
          <button 
            onclick="window.App.openGuidedTour()" 
            class="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/40 text-amber-300 hover:bg-amber-500/30 text-xs font-bold shadow-sm transition-all animate-pulse-slow">
            <svg class="w-3.5 h-3.5 text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
            <span>12-Step Demo</span>
          </button>

          <!-- Language Selector Toggle -->
          <button 
            onclick="window.App.toggleLanguage()" 
            class="px-2 py-1 rounded-lg bg-slate-900 light:bg-slate-100 border border-slate-800 light:border-slate-300 text-xs font-semibold text-slate-300 light:text-slate-700 hover:border-cyan-500 transition-colors"
            title="Switch Language: English / Hindi">
            ${store.language === 'hi' ? '🇮🇳 हिंदी' : '🇬🇧 EN'}
          </button>

          <!-- Voice Read-Aloud Toggle -->
          <button 
            onclick="window.App.toggleVoice()" 
            class="p-1.5 rounded-lg bg-slate-900 light:bg-slate-100 border border-slate-800 light:border-slate-300 text-xs font-semibold ${store.voiceEnabled ? 'text-cyan-400' : 'text-slate-500'} hover:border-cyan-500 transition-colors"
            title="Toggle Voice Read-Aloud (Speech Synthesis)">
            ${store.voiceEnabled ? '🔊' : '🔇'}
          </button>

          <!-- Theme Toggle (Dark / Light) -->
          <button 
            onclick="window.App.toggleTheme()" 
            class="p-1.5 rounded-lg bg-slate-900 light:bg-slate-100 border border-slate-800 light:border-slate-300 text-xs font-semibold text-slate-300 light:text-slate-700 hover:border-cyan-500 transition-colors"
            title="Toggle Light / Dark Mode">
            ${store.theme === 'light' ? '☀️' : '🌙'}
          </button>

          <!-- Notifications Bell -->
          <div class="relative">
            <button 
              onclick="window.App.toggleNotificationMenu()" 
              class="relative p-1.5 rounded-lg bg-slate-900 light:bg-slate-100 border border-slate-800 light:border-slate-300 text-slate-300 light:text-slate-700 hover:border-cyan-500 transition-colors"
              title="Notifications">
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
              ${unreadNotifs > 0 ? `<span class="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping"></span><span class="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-rose-500 text-[8px] text-white flex items-center justify-center font-bold"></span>` : ''}
            </button>

            <!-- Notifications Dropdown -->
            <div id="notifications-menu" class="hidden absolute right-0 mt-2 w-80 bg-slate-900/95 dark:bg-slate-900/95 light:bg-white border border-slate-800 light:border-slate-300 rounded-2xl shadow-2xl p-3 z-50 backdrop-blur-xl">
              <div class="flex items-center justify-between pb-2 border-b border-slate-800 light:border-slate-200">
                <span class="text-xs font-bold text-white light:text-slate-900 uppercase">In-App Notifications</span>
                <button onclick="window.App.markAllNotificationsRead()" class="text-[10px] text-cyan-400 hover:underline">Mark all read</button>
              </div>
              <div class="space-y-2 mt-2 max-h-60 overflow-y-auto">
                ${store.notifications.map(n => `
                  <div class="p-2 rounded-xl bg-slate-950/60 light:bg-slate-50 border border-slate-800/80 light:border-slate-200 text-xs">
                    <div class="font-semibold text-white light:text-slate-900">${n.title}</div>
                    <div class="text-[11px] text-slate-400 light:text-slate-600 mt-0.5">${n.desc}</div>
                    <div class="text-[9px] text-slate-500 mt-1">${n.time}</div>
                  </div>
                `).join('')}
              </div>
            </div>
          </div>

          <!-- Streak Counter -->
          ${user?.role === 'student' ? `
            <div class="flex items-center gap-1 px-2 py-1 rounded-xl bg-amber-950/40 border border-amber-800/50 text-amber-400 text-xs font-bold" title="${user.streakDays || 1} Day Learning Streak!">
              <span>🔥</span>
              <span>${user.streakDays || 1}d</span>
            </div>
          ` : ''}

          <!-- XP Pill -->
          ${user?.role === 'student' ? `
            <div class="hidden lg:flex items-center gap-1 px-2 py-1 rounded-xl bg-indigo-950/40 border border-indigo-800/50 text-indigo-300 text-xs font-bold" title="Total XP">
              <span>⚡</span>
              <span>${user.totalXp || 0} XP</span>
            </div>
          ` : ''}

          <!-- Persona Selector Dropdown -->
          <div class="relative">
            <button 
              id="persona-dropdown-btn"
              onclick="window.App.togglePersonaMenu()"
              class="flex items-center gap-1.5 p-1 sm:px-2 sm:py-1 rounded-xl bg-slate-900 light:bg-slate-100 border border-slate-800 light:border-slate-300 text-xs font-medium text-slate-200 light:text-slate-800 hover:border-slate-600 transition-all">
              <img src="${user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'}" class="w-6 h-6 rounded-full object-cover border border-cyan-500/60" alt="Avatar"/>
              <span class="hidden sm:inline font-bold">${user?.name?.split(' ')[0] || 'User'}</span>
              <svg class="w-3 h-3 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"></polyline></svg>
            </button>

            <!-- Dropdown Menu -->
            <div id="persona-menu" class="hidden absolute right-0 mt-2 w-64 bg-slate-900/95 dark:bg-slate-900/95 light:bg-white border border-slate-800 light:border-slate-300 rounded-2xl shadow-2xl p-2.5 z-50 backdrop-blur-xl">
              <div class="px-2 py-1.5 border-b border-slate-800 light:border-slate-200 text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                Select Persona / Role
              </div>
              
              <button onclick="window.App.switchPersona('alex')" class="w-full text-left px-2.5 py-2 rounded-xl text-xs hover:bg-slate-800 light:hover:bg-slate-100 flex items-center justify-between transition-all ${user?.id === 'alex_rivera' ? 'text-cyan-400 bg-cyan-950/40' : 'text-slate-300 light:text-slate-800'}">
                <div>
                  <div class="font-bold">Alex Rivera (Student)</div>
                  <div class="text-[10px] text-rose-400">Needs Recursion Remediation</div>
                </div>
                ${user?.id === 'alex_rivera' ? '<span class="text-cyan-400 font-bold">✓</span>' : ''}
              </button>

              <button onclick="window.App.switchPersona('priya')" class="w-full text-left px-2.5 py-2 rounded-xl text-xs hover:bg-slate-800 light:hover:bg-slate-100 flex items-center justify-between transition-all ${user?.id === 'priya_sharma' ? 'text-cyan-400 bg-cyan-950/40' : 'text-slate-300 light:text-slate-800'}">
                <div>
                  <div class="font-bold">Priya Sharma (Student)</div>
                  <div class="text-[10px] text-emerald-400">Advanced Mastery (88%)</div>
                </div>
                ${user?.id === 'priya_sharma' ? '<span class="text-cyan-400 font-bold">✓</span>' : ''}
              </button>

              <button onclick="window.App.switchPersona('teacher')" class="w-full text-left px-2.5 py-2 rounded-xl text-xs hover:bg-slate-800 light:hover:bg-slate-100 flex items-center justify-between transition-all ${user?.id === 'prof_harrison' ? 'text-indigo-400 bg-indigo-950/40' : 'text-slate-300 light:text-slate-800'}">
                <div>
                  <div class="font-bold">Prof. Harrison (Teacher)</div>
                  <div class="text-[10px] text-indigo-400">Cohort Heatmap & At-Risk</div>
                </div>
                ${user?.id === 'prof_harrison' ? '<span class="text-indigo-400 font-bold">✓</span>' : ''}
              </button>

              <button onclick="window.App.switchPersona('parent')" class="w-full text-left px-2.5 py-2 rounded-xl text-xs hover:bg-slate-800 light:hover:bg-slate-100 flex items-center justify-between transition-all ${user?.id === 'eleanor_rivera' ? 'text-pink-400 bg-pink-950/40' : 'text-slate-300 light:text-slate-800'}">
                <div>
                  <div class="font-bold">Eleanor (Parent/Mentor)</div>
                  <div class="text-[10px] text-pink-400">Weekly Consistency & Support</div>
                </div>
                ${user?.id === 'eleanor_rivera' ? '<span class="text-pink-400 font-bold">✓</span>' : ''}
              </button>

              <button onclick="window.App.switchPersona('fresh')" class="w-full text-left px-2.5 py-2 rounded-xl text-xs hover:bg-slate-800 light:hover:bg-slate-100 flex items-center justify-between transition-all ${user?.id === 'new_student' ? 'text-cyan-400 bg-cyan-950/40' : 'text-slate-300 light:text-slate-800'}">
                <div>
                  <div class="font-bold">Clean Slate Learner</div>
                  <div class="text-[10px] text-amber-400">Take Diagnostic from 0%</div>
                </div>
                ${user?.id === 'new_student' ? '<span class="text-cyan-400 font-bold">✓</span>' : ''}
              </button>

              <div class="mt-2 pt-2 border-t border-slate-800 light:border-slate-200 flex items-center justify-between px-2">
                <button onclick="window.App.openSettingsModal()" class="text-[11px] text-cyan-400 hover:underline">
                  API Key Vault
                </button>
                <button onclick="window.App.openOnboarding()" class="text-[11px] text-slate-400 hover:text-white">
                  Onboarding Survey
                </button>
              </div>
            </div>
          </div>

          <!-- Mobile Hamburger -->
          <button 
            onclick="window.App.toggleMobileMenu()" 
            class="xl:hidden p-1.5 rounded-xl bg-slate-900 light:bg-slate-100 border border-slate-800 light:border-slate-300 text-slate-400 hover:text-white">
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
          </button>

        </div>

      </div>

      <!-- Mobile Navigation Drawer -->
      <div id="mobile-menu" class="hidden xl:hidden mt-2 pt-2 border-t border-slate-800 light:border-slate-200 grid grid-cols-2 sm:grid-cols-3 gap-1.5 pb-2">
        ${navItems.map(item => `
          <button 
            onclick="window.App.navigate('${item.id}'); window.App.toggleMobileMenu();"
            class="flex items-center justify-between px-3 py-1.5 rounded-lg text-xs font-semibold ${
              currentRoute === item.id ? 'bg-cyan-950/50 text-cyan-300 border border-cyan-800' : 'text-slate-300 light:text-slate-700 hover:bg-slate-900 light:hover:bg-slate-200'
            }">
            <span>${item.label}</span>
            ${item.count ? `<span class="px-1.5 py-0.2 rounded-full bg-rose-500/20 text-rose-300 text-[10px]">${item.count}</span>` : ''}
          </button>
        `).join('')}
        <button 
          onclick="window.App.openGuidedTour(); window.App.toggleMobileMenu();" 
          class="col-span-2 sm:col-span-3 mt-1 py-1.5 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-bold text-center">
          ★ Hackathon 12-Step Signature Tour
        </button>
      </div>
    </header>
  `;
}
