// LearnIQ Authentication & Profile Setup Modal Component
import { store } from '../state.js';
import { sound } from '../soundFx.js';

class AuthModalController {
  constructor() {
    this.isOpen = false;
    this.mode = "login"; // 'login', 'register', 'forgot', 'profile', 'settings'
    this.email = "";
    this.password = "";
    this.name = "";
    this.examGoal = "Java & DSA Placement Exam";
    this.level = "Intermediate";
    this.role = "student";
    this.message = null;
  }

  open(mode = "login") {
    this.isOpen = true;
    this.mode = mode;
    this.message = null;
    sound.playClick();
    store.notify();
  }

  close() {
    this.isOpen = false;
    this.message = null;
    store.notify();
  }

  submitLogin() {
    if (!this.email) {
      this.message = { type: "error", text: "Please enter your email." };
      store.notify();
      return;
    }
    store.loginUser(this.email, this.name || this.email.split('@')[0], this.role);
    sound.playLevelUp();
    this.close();
  }

  submitRegister() {
    if (!this.email || !this.name) {
      this.message = { type: "error", text: "Please enter your name and email." };
      store.notify();
      return;
    }
    store.loginUser(this.email, this.name, this.role);
    store.updateProfile({ examGoal: this.examGoal, level: this.level });
    sound.playLevelUp();
    this.close();
  }

  submitForgot() {
    this.message = { type: "success", text: "A password reset link has been simulated and sent to your email." };
    store.notify();
  }

  saveSettings(key) {
    store.setApiKey(key);
    this.message = { type: "success", text: "API key successfully saved to local vault!" };
    store.notify();
  }
}

export const authController = new AuthModalController();

export function renderAuthModal() {
  const ac = authController;
  if (!ac.isOpen) return '';

  return `
    <div class="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div class="glass-card max-w-md w-full p-6 sm:p-8 border border-cyan-500/40 relative animate-in zoom-in-95 duration-200">
        
        <button onclick="window.App.closeAuthModal()" class="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center text-sm">✕</button>

        <!-- Tabs -->
        <div class="flex items-center gap-2 border-b border-slate-800 pb-3 mb-6">
          <button 
            onclick="window.App.switchAuthMode('login')"
            class="px-3 py-1.5 rounded-lg text-xs font-semibold ${ac.mode === 'login' ? 'bg-cyan-950 text-cyan-300 border border-cyan-800' : 'text-slate-400 hover:text-white'}">
            Sign In
          </button>
          <button 
            onclick="window.App.switchAuthMode('register')"
            class="px-3 py-1.5 rounded-lg text-xs font-semibold ${ac.mode === 'register' ? 'bg-cyan-950 text-cyan-300 border border-cyan-800' : 'text-slate-400 hover:text-white'}">
            Create Account
          </button>
          <button 
            onclick="window.App.switchAuthMode('settings')"
            class="px-3 py-1.5 rounded-lg text-xs font-semibold ${ac.mode === 'settings' ? 'bg-cyan-950 text-cyan-300 border border-cyan-800' : 'text-slate-400 hover:text-white'}">
            API Vault
          </button>
        </div>

        ${ac.message ? `
          <div class="p-3 rounded-xl mb-4 text-xs ${ac.message.type === 'error' ? 'bg-rose-950/60 text-rose-300 border border-rose-800' : 'bg-emerald-950/60 text-emerald-300 border border-emerald-800'}">
            ${ac.message.text}
          </div>
        ` : ''}

        ${ac.mode === 'login' ? renderLoginForm(ac) : (ac.mode === 'register' ? renderRegisterForm(ac) : (ac.mode === 'settings' ? renderSettingsForm(ac) : renderForgotForm(ac)))}

      </div>
    </div>
  `;
}

function renderLoginForm(ac) {
  return `
    <div class="space-y-4">
      <div>
        <h2 class="text-xl font-bold text-white">Welcome Back to LearnIQ</h2>
        <p class="text-xs text-slate-400 mt-1">Sign in to resume your adaptive learner model.</p>
      </div>

      <div class="space-y-3">
        <div>
          <label class="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
          <input 
            type="email" 
            value="${ac.email || 'alex.rivera@student.edu'}" 
            oninput="window.App.setAuthEmail(this.value)"
            placeholder="name@example.com" 
            class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div>
          <label class="block text-xs font-semibold text-slate-300 mb-1">Password</label>
          <input 
            type="password" 
            value="••••••••••••" 
            class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div class="flex justify-between items-center text-xs">
          <label class="flex items-center gap-2 text-slate-400 cursor-pointer">
            <input type="checkbox" checked class="rounded border-slate-700 bg-slate-900 text-cyan-500">
            <span>Remember me</span>
          </label>
          <button onclick="window.App.switchAuthMode('forgot')" class="text-cyan-400 hover:underline">Forgot password?</button>
        </div>
      </div>

      <button 
        onclick="window.App.submitAuthLogin()"
        class="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-white font-bold text-xs shadow-lg shadow-cyan-500/25 hover:scale-[1.02] active:scale-[0.98] transition-all">
        Sign In to LearnIQ →
      </button>

      <div class="pt-3 border-t border-slate-800 text-center">
        <span class="text-xs text-slate-400">Or test with simulated personas:</span>
        <div class="flex justify-center gap-2 mt-2">
          <button onclick="window.App.switchPersona('alex'); window.App.closeAuthModal();" class="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-[11px] text-cyan-300 hover:border-cyan-500">Alex (Student)</button>
          <button onclick="window.App.switchPersona('teacher'); window.App.closeAuthModal();" class="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-[11px] text-indigo-300 hover:border-indigo-500">Teacher View</button>
        </div>
      </div>
    </div>
  `;
}

function renderRegisterForm(ac) {
  return `
    <div class="space-y-4">
      <div>
        <h2 class="text-xl font-bold text-white">Create Student Profile</h2>
        <p class="text-xs text-slate-400 mt-1">Calibrate your adaptive preparation plan.</p>
      </div>

      <div class="space-y-3">
        <div>
          <label class="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
          <input 
            type="text" 
            placeholder="Jordan Lee" 
            oninput="window.App.setAuthName(this.value)"
            class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div>
          <label class="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
          <input 
            type="email" 
            placeholder="jordan@example.com" 
            oninput="window.App.setAuthEmail(this.value)"
            class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div>
          <label class="block text-xs font-semibold text-slate-300 mb-1">Primary Exam Goal</label>
          <select 
            onchange="window.App.setAuthGoal(this.value)"
            class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500">
            <option value="Java & DSA Placement Exam 2026">Java & DSA Placement Exam 2026</option>
            <option value="FAANG Senior Coding Interview">FAANG Senior Coding Interview</option>
            <option value="University CS201 Midterm Prep">University CS201 Midterm Prep</option>
            <option value="AP Computer Science A Exam">AP Computer Science A Exam</option>
          </select>
        </div>

        <div>
          <label class="block text-xs font-semibold text-slate-300 mb-1">Starting Level</label>
          <select 
            onchange="window.App.setAuthLevel(this.value)"
            class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500">
            <option value="Beginner">Beginner (Foundations & Syntax)</option>
            <option value="Intermediate" selected>Intermediate (Loops, Recursion, Arrays)</option>
            <option value="Advanced">Advanced (Data Structures, Sorting, Trees)</option>
          </select>
        </div>
      </div>

      <button 
        onclick="window.App.submitAuthRegister()"
        class="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-white font-bold text-xs shadow-lg shadow-cyan-500/25 hover:scale-[1.02] active:scale-[0.98] transition-all">
        Complete Profile & Begin Diagnostic →
      </button>
    </div>
  `;
}

function renderForgotForm(ac) {
  return `
    <div class="space-y-4">
      <div>
        <h2 class="text-xl font-bold text-white">Reset Password</h2>
        <p class="text-xs text-slate-400 mt-1">Enter your email to receive recovery instructions.</p>
      </div>

      <div>
        <label class="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
        <input 
          type="email" 
          placeholder="name@example.com" 
          class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
        />
      </div>

      <button 
        onclick="window.App.submitAuthForgot()"
        class="w-full py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-md transition-all">
        Send Reset Link
      </button>

      <div class="text-center pt-2">
        <button onclick="window.App.switchAuthMode('login')" class="text-xs text-slate-400 hover:text-white">
          ← Back to Sign In
        </button>
      </div>
    </div>
  `;
}

function renderSettingsForm(ac) {
  return `
    <div class="space-y-4">
      <div>
        <h2 class="text-xl font-bold text-white">AI Engine & API Vault</h2>
        <p class="text-xs text-slate-400 mt-1">Optional: Provide a Gemini API key for live dynamic LLM question & tutor generation. If omitted, LearnIQ uses its built-in pedagogical engine.</p>
      </div>

      <div>
        <label class="block text-xs font-semibold text-slate-300 mb-1">Gemini API Key</label>
        <input 
          id="settings-api-key"
          type="password" 
          value="${store.apiKey}"
          placeholder="AIzaSy..." 
          class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
        />
      </div>

      <button 
        onclick="window.App.saveApiKey(document.getElementById('settings-api-key').value)"
        class="w-full py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-md transition-all">
        Save API Key
      </button>
    </div>
  `;
}
