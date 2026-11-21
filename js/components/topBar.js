// LearnIQ Studio 3.0 Top Action Bar Component
import { store } from '../state.js';

export function renderTopBar() {
  const user = store.currentUser;
  const currentRoute = store.currentRoute;
  const unreadNotifs = store.notifications.filter(n => !n.read).length;

  const routeNames = {
    landing: 'Home Landing',
    dashboard: 'Learner Model Dashboard',
    graph: 'Concept Knowledge DAG',
    practice: 'Adaptive Question Arena',
    misconceptions: 'Misconception Analysis Lab',
    revision: 'Spaced Repetition (SM-2)',
    coding: 'Java Coding Lab Sandbox',
    exam: 'Real Mock Exam Simulator',
    notes: 'Smart Notes & PDF Analyzer',
    flashcards: '3D Flashcard Deck',
    predictor: 'AI Exam Readiness Predictor',
    planner: 'Dynamic Study Planner',
    tutor: 'Socrates AI Copilot',
    diagnostic: 'Diagnostic Placement Test',
    teacher: 'Teacher Cohort Heatmap',
    parent: 'Parent / Mentor Portal',
    reports: 'Cognitive Analytics Report'
  };

  const currentTitle = routeNames[currentRoute] || 'Dashboard';

  return `
    <div class="h-14 px-4 sm:px-6 bg-[#070b14]/90 dark:bg-[#070b14]/90 light:bg-white/95 backdrop-blur-md border-b border-slate-800/80 light:border-slate-200 flex items-center justify-between gap-4 select-none">
      
      <!-- Left: Mobile Toggle + Breadcrumbs + Cognitive EMA Status Dot -->
      <div class="flex items-center gap-3 min-w-0">
        
        <!-- Mobile Sidebar Toggle -->
        <button 
          onclick="window.App.toggleSidebarDrawer()"
          class="xl:hidden p-1.5 rounded-lg bg-slate-900 light:bg-slate-100 border border-slate-800 light:border-slate-300 text-slate-400 hover:text-white">
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
        </button>

        <!-- Breadcrumbs -->
        <div class="hidden sm:flex items-center gap-2 text-xs font-medium text-slate-400">
          <span class="hover:text-cyan-400 cursor-pointer" onclick="window.App.navigate('dashboard')">Studio 3.0</span>
          <span>/</span>
          <span class="text-slate-500 uppercase text-[10px] tracking-wider font-bold">Workspace</span>
          <span>/</span>
          <span class="text-white light:text-slate-900 font-bold truncate">${currentTitle}</span>
        </div>

        <!-- Cognitive EMA 0.65 Status Dot -->
        <div class="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan-950/60 light:bg-cyan-50 border border-cyan-800/60 light:border-cyan-200 text-cyan-300 light:text-cyan-800 text-[11px] font-mono shrink-0 shadow-sm" title="Continuous Bayesian Exponential Moving Average of understanding">
          <span class="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
          <span class="font-bold">Cognitive EMA: 0.65</span>
        </div>

      </div>

      <!-- Center: ⌘K Command Search Bar Trigger -->
      <div class="hidden md:flex flex-1 max-w-md mx-2">
        <button 
          onclick="window.App.openCommandPalette()"
          class="w-full flex items-center justify-between px-3.5 py-1.5 rounded-xl bg-[#0b1120] dark:bg-[#0b1120] light:bg-slate-100 border border-slate-800 light:border-slate-300 hover:border-cyan-500/60 text-slate-400 hover:text-slate-200 transition-all text-xs group shadow-inner">
          <div class="flex items-center gap-2">
            <svg class="w-3.5 h-3.5 text-slate-400 group-hover:text-cyan-400 transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            <span class="font-normal">Search concepts, tools, or press</span>
          </div>
          <div class="flex items-center gap-1">
            <kbd class="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 light:bg-slate-200 text-slate-300 light:text-slate-700 border border-slate-700 light:border-slate-300 shadow-sm">⌘K</kbd>
          </div>
        </button>
      </div>

      <!-- Right: Live Streak, XP, Rank, Tour CTA & Notifications -->
      <div class="flex items-center gap-2 sm:gap-3 shrink-0">
        
        <!-- Current Streak -->
        <div class="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-950/40 border border-amber-800/50 text-amber-400 text-xs font-bold" title="${user?.streakDays || 5} Day Streak!">
          <span>🔥</span>
          <span class="font-mono">${user?.streakDays || 5}d</span>
        </div>

        <!-- XP Badge -->
        <div class="hidden lg:flex items-center gap-1 px-2.5 py-1 rounded-xl bg-indigo-950/40 border border-indigo-800/50 text-indigo-300 text-xs font-bold font-mono" title="Total XP Earned">
          <span>⚡</span>
          <span>${user?.totalXp || 1420} XP</span>
        </div>

        <!-- Rank Pill -->
        <div class="hidden xl:flex items-center gap-1 px-2.5 py-1 rounded-xl bg-purple-950/40 border border-purple-800/50 text-purple-300 text-xs font-bold" title="Cognitive Rank">
          <span>🏆</span>
          <span>${user?.levelName || 'Master Scholar'}</span>
        </div>

        <!-- 9-Step Judge Workflow Tour CTA Button -->
        <button 
          onclick="window.App.openGuidedTour()" 
          class="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-slate-950 font-extrabold text-xs shadow-md shadow-amber-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer">
          <span>⭐</span>
          <span class="hidden sm:inline">9-Step Judge Tour</span>
        </button>

        <!-- Notification Bell -->
        <div class="relative">
          <button 
            onclick="window.App.toggleNotificationMenu()" 
            class="relative p-1.5 rounded-xl bg-slate-900 light:bg-slate-100 border border-slate-800 light:border-slate-300 text-slate-400 hover:text-white transition-colors"
            title="Notifications">
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
            ${unreadNotifs > 0 ? `<span class="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping"></span><span class="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-rose-500 text-[8px] text-white flex items-center justify-center font-bold"></span>` : ''}
          </button>

          <!-- Dropdown -->
          <div id="notifications-menu" class="hidden absolute right-0 mt-2 w-80 bg-[#0b1120]/95 dark:bg-[#0b1120]/95 light:bg-white border border-slate-800 light:border-slate-300 rounded-2xl shadow-2xl p-3 z-50 backdrop-blur-xl">
            <div class="flex items-center justify-between pb-2 border-b border-slate-800 light:border-slate-200">
              <span class="text-xs font-bold text-white light:text-slate-900 uppercase">System Telemetry</span>
              <button onclick="window.App.markAllNotificationsRead()" class="text-[10px] text-cyan-400 hover:underline">Mark all read</button>
            </div>
            <div class="space-y-2 mt-2 max-h-60 overflow-y-auto">
              ${store.notifications.map(n => `
                <div class="p-2 rounded-xl bg-slate-950/60 light:bg-slate-50 border border-slate-800/80 light:border-slate-200 text-xs">
                  <div class="font-semibold text-white light:text-slate-900">${n.title}</div>
                  <div class="text-[11px] text-slate-400 light:text-slate-600 mt-0.5">${n.desc}</div>
                  <div class="text-[9px] text-slate-500 mt-1 font-mono">${n.time}</div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>

      </div>

    </div>
  `;
}
