// LearnIQ Studio 3.0 Global Command Palette (⌘K)
import { store } from '../state.js';
import { sound } from '../soundFx.js';

class CommandPaletteController {
  constructor() {
    this.isOpen = false;
    this.query = "";
    this.selectedIndex = 0;
    this.initKeyboardListeners();
  }

  initKeyboardListeners() {
    window.addEventListener('keydown', (e) => {
      // ⌘K or Ctrl+K toggle
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        this.toggle();
      } else if (e.key === 'Escape' && this.isOpen) {
        this.close();
      } else if (this.isOpen) {
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          this.navigateDown();
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          this.navigateUp();
        } else if (e.key === 'Enter') {
          e.preventDefault();
          this.executeSelected();
        }
      }
    });
  }

  open() {
    this.isOpen = true;
    this.query = "";
    this.selectedIndex = 0;
    sound.playClick();
    store.notify();
    setTimeout(() => {
      const input = document.getElementById('command-palette-input');
      if (input) input.focus();
    }, 50);
  }

  close() {
    this.isOpen = false;
    this.query = "";
    store.notify();
  }

  toggle() {
    if (this.isOpen) this.close();
    else this.open();
  }

  setQuery(q) {
    this.query = q;
    this.selectedIndex = 0;
    store.notify();
  }

  navigateDown() {
    const list = this.getFilteredCommands();
    if (list.length === 0) return;
    this.selectedIndex = (this.selectedIndex + 1) % list.length;
    store.notify();
  }

  navigateUp() {
    const list = this.getFilteredCommands();
    if (list.length === 0) return;
    this.selectedIndex = (this.selectedIndex - 1 + list.length) % list.length;
    store.notify();
  }

  executeSelected() {
    const list = this.getFilteredCommands();
    if (list.length > 0 && list[this.selectedIndex]) {
      const cmd = list[this.selectedIndex];
      cmd.action();
      this.close();
    }
  }

  getFilteredCommands() {
    const all = [
      // Workspace Views
      { id: 'dash', title: 'Dashboard', desc: 'Bayesian EMA Learner Model & Cognitive Matrix', icon: '📊', group: 'Workspace', action: () => window.App.navigate('dashboard') },
      { id: 'dag', title: 'Concept DAG', desc: '15-Node Prerequisite Knowledge Graph', icon: '🕸️', group: 'Workspace', action: () => window.App.navigate('graph') },
      { id: 'adapt', title: 'Adaptive Arena', desc: 'Dynamic difficulty scaling & scaffolded hints', icon: '⚡', group: 'Workspace', action: () => window.App.navigate('practice') },
      { id: 'misc', title: 'Misconception Lab', desc: 'Cognitive bug detector & side-by-side traces', icon: '🛡️', group: 'Workspace', action: () => window.App.navigate('misconceptions') },
      { id: 'sm2', title: 'Spaced SM-2', desc: 'SuperMemo memory retention review session', icon: '🧠', group: 'Workspace', action: () => window.App.navigate('revision') },
      { id: 'code', title: 'Coding Lab', desc: 'Interactive Java AST sandbox & test runner', icon: '💻', group: 'Workspace', action: () => window.App.navigate('coding') },
      { id: 'exam', title: 'Exam Simulator', desc: '15-Minute timed mock test with negative marking', icon: '⏱️', group: 'Workspace', action: () => window.App.navigate('exam') },
      { id: 'notes', title: 'Smart Notes', desc: 'PDF upload, summary & grounded Q&A', icon: '📄', group: 'Workspace', action: () => window.App.navigate('notes') },
      { id: 'cards', title: 'Flashcards', desc: '3D interactive flip deck with recall rating', icon: '📇', group: 'Workspace', action: () => window.App.navigate('flashcards') },
      { id: 'pred', title: 'AI Predictor', desc: 'Exam readiness score & topic difficulty forecast', icon: '🔮', group: 'Workspace', action: () => window.App.navigate('predictor') },
      { id: 'plan', title: 'Study Planner', desc: '7-Day timetable with missed-task auto-rebalancing', icon: '📅', group: 'Workspace', action: () => window.App.navigate('planner') },

      // Intelligence & Tools
      { id: 'tutor', title: 'AI Copilot (Socrates)', desc: 'Socratic dialogue with 5 Explain It Again modes', icon: '💬', group: 'Intelligence', action: () => window.App.navigate('tutor') },
      { id: 'diag', title: 'Diagnostic Assessment', desc: 'Baseline knowledge evaluation across 15 topics', icon: '⏱️', group: 'Intelligence', action: () => window.App.navigate('diagnostic') },
      { id: 'teach', title: 'Teacher UI', desc: 'Cohort heatmap, misconception metrics & at-risk list', icon: '🎓', group: 'Intelligence', action: () => window.App.navigate('teacher') },
      { id: 'parent', title: 'Parent Portal', desc: 'Weekly consistency, study hours & plain-language notes', icon: '👩‍👧', group: 'Intelligence', action: () => window.App.navigate('parent') },
      { id: 'rep', title: 'Analytics Report', desc: 'Printable PDF-ready cognitive evaluation summary', icon: '📈', group: 'Intelligence', action: () => window.App.navigate('reports') },

      // Quick Actions
      { id: 'tour', title: '⭐ 9-Step Judge Workflow Tour', desc: 'Automated high-speed walkthrough for evaluators', icon: '⭐', group: 'Actions', action: () => window.App.openGuidedTour() },
      { id: 'clr_err', title: 'Clear All Active Errors', desc: 'Remediate all flagged misconceptions immediately', icon: '✓', group: 'Actions', action: () => window.App.clearAllMisconceptions() },
      { id: 'signin', title: 'Sign In / Switch Account', desc: 'Access Google auth, email login & credentials', icon: '🔑', group: 'Actions', action: () => window.App.openSignIn() },
      { id: 'alex', title: 'Switch Persona: Alex Chen (Student)', desc: 'Intermediate learner with recursion focus', icon: '🎓', group: 'Personas', action: () => window.App.switchPersona('alex') },
      { id: 'priya', title: 'Switch Persona: Priya Sharma (Advanced)', desc: 'High-mastery profile (88% concept retention)', icon: '🚀', group: 'Personas', action: () => window.App.switchPersona('priya') },
      { id: 'prof', title: 'Switch Persona: Prof. Harrison (Teacher)', desc: 'Educator view with cohort heatmap analytics', icon: '👨‍🏫', group: 'Personas', action: () => window.App.switchPersona('teacher') },
      { id: 'theme', title: 'Toggle Theme (Dark / Light)', desc: 'Switch visual palette mode', icon: '🌓', group: 'Preferences', action: () => window.App.toggleTheme() },
      { id: 'lang', title: 'Switch Language (EN / HI)', desc: 'Toggle English and Hindi localization', icon: '🌐', group: 'Preferences', action: () => window.App.toggleLanguage() },
      { id: 'voice', title: 'Toggle Voice Read-Aloud', desc: 'Enable/disable SpeechSynthesis narration', icon: '🔊', group: 'Preferences', action: () => window.App.toggleVoice() }
    ];

    if (!this.query.trim()) return all;
    const q = this.query.toLowerCase().trim();
    return all.filter(item => 
      item.title.toLowerCase().includes(q) || 
      item.desc.toLowerCase().includes(q) || 
      item.group.toLowerCase().includes(q)
    );
  }
}

export const commandPalette = new CommandPaletteController();

export function renderCommandPalette() {
  const cp = commandPalette;
  if (!cp.isOpen) return '';

  const commands = cp.getFilteredCommands();

  return `
    <div class="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-start justify-center pt-20 px-4 animate-in fade-in duration-150">
      
      <!-- Backdrop Click to Close -->
      <div class="fixed inset-0" onclick="window.App.closeCommandPalette()"></div>

      <!-- Palette Box -->
      <div class="relative w-full max-w-2xl bg-slate-900/95 dark:bg-[#0b1120]/95 light:bg-white border border-cyan-500/40 rounded-2xl shadow-2xl overflow-hidden z-10 animate-in zoom-in-95 duration-150">
        
        <!-- Search Input Bar -->
        <div class="flex items-center gap-3 px-4 py-3.5 border-b border-slate-800 light:border-slate-200">
          <svg class="w-5 h-5 text-cyan-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          <input 
            id="command-palette-input"
            type="text"
            value="${cp.query}"
            oninput="window.App.setCommandPaletteQuery(this.value)"
            placeholder="Type a command, concept, or jump to view (e.g. 'Recursion', 'Coding Lab', 'Tour')..."
            class="w-full bg-transparent text-sm text-white light:text-slate-900 placeholder-slate-400 focus:outline-none"
          />
          <div class="flex items-center gap-1.5 shrink-0">
            <span class="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">ESC</span>
          </div>
        </div>

        <!-- Command List -->
        <div class="max-h-96 overflow-y-auto p-2 space-y-1">
          ${commands.length === 0 ? `
            <div class="p-8 text-center text-slate-400 text-xs">
              No matching commands found for <span class="text-cyan-400 font-mono">"${cp.query}"</span>
            </div>
          ` : commands.map((cmd, idx) => `
            <div 
              onclick="window.App.executeCommand(${idx})"
              class="flex items-center justify-between p-2.5 rounded-xl text-xs cursor-pointer transition-all ${
                idx === cp.selectedIndex 
                  ? 'bg-gradient-to-r from-cyan-950/70 to-indigo-950/70 text-cyan-300 border border-cyan-500/40 shadow-sm' 
                  : 'text-slate-300 light:text-slate-700 hover:bg-slate-800/60 light:hover:bg-slate-100'
              }">
              <div class="flex items-center gap-3 min-w-0">
                <span class="text-base shrink-0">${cmd.icon}</span>
                <div class="min-w-0">
                  <div class="font-bold text-white light:text-slate-900 truncate">${cmd.title}</div>
                  <div class="text-[11px] text-slate-400 light:text-slate-500 truncate">${cmd.desc}</div>
                </div>
              </div>
              <div class="flex items-center gap-2 shrink-0">
                <span class="text-[9px] uppercase tracking-wider font-extrabold px-1.5 py-0.5 rounded bg-slate-800/80 text-slate-400 border border-slate-700">${cmd.group}</span>
                ${idx === cp.selectedIndex ? `<span class="text-xs text-cyan-400 font-mono">↵</span>` : ''}
              </div>
            </div>
          `).join('')}
        </div>

        <!-- Palette Footer -->
        <div class="px-4 py-2 border-t border-slate-800 light:border-slate-200 bg-slate-950/60 light:bg-slate-50 flex items-center justify-between text-[11px] text-slate-500">
          <div class="flex items-center gap-3">
            <span>Navigation: <kbd class="px-1 rounded bg-slate-800 text-slate-300">↑</kbd> <kbd class="px-1 rounded bg-slate-800 text-slate-300">↓</kbd></span>
            <span>Select: <kbd class="px-1 rounded bg-slate-800 text-slate-300">↵</kbd></span>
            <span>Close: <kbd class="px-1 rounded bg-slate-800 text-slate-300">ESC</kbd></span>
          </div>
          <div>LearnIQ Studio 3.0</div>
        </div>

      </div>
    </div>
  `;
}
