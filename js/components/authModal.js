// AptiLearn AI Authentication & Student Profile Setup Modal Component
import { store } from '../state.js';
import { sound } from '../soundFx.js';
import { DEMO_PERSONAS } from '../config.js';

class AuthModalController {
  constructor() {
    this.isOpen = false;
    this.mode = "login"; // 'login', 'register', 'forgot', 'settings'
    this.email = "";
    this.password = "";
    this.name = "";
    this.examGoal = "Java & DSA Placement Exam 2026";
    this.level = "Intermediate";
    this.role = "student";
    this.showPassword = false;
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

  toggleShowPassword() {
    this.showPassword = !this.showPassword;
    store.notify();
  }

  submitLogin() {
    const email = (this.email || "alex.rivera@student.edu").trim();
    if (!email) {
      this.message = { type: "error", text: "Please enter your email address to sign in." };
      store.notify();
      return;
    }

    // Match existing persona if available
    let personaMatched = null;
    if (email.toLowerCase().includes("priya")) personaMatched = DEMO_PERSONAS.priya;
    else if (email.toLowerCase().includes("harrison") || email.toLowerCase().includes("teacher")) personaMatched = DEMO_PERSONAS.teacher;
    else if (email.toLowerCase().includes("eleanor") || email.toLowerCase().includes("parent")) personaMatched = DEMO_PERSONAS.parent;
    else if (email.toLowerCase().includes("alex")) personaMatched = DEMO_PERSONAS.alex;

    if (personaMatched) {
      store.currentUser = JSON.parse(JSON.stringify(personaMatched));
      store.currentRoute = personaMatched.role === 'teacher' ? 'teacher' : (personaMatched.role === 'parent' ? 'parent' : 'dashboard');
      store.saveState();
    } else {
      store.loginUser(email, this.name || email.split('@')[0], this.role);
    }

    sound.playLevelUp();
    store.addNotification({
      title: "Welcome Back!",
      desc: `Successfully authenticated as ${store.currentUser?.name}.`,
      type: "auth"
    });
    this.close();
  }

  submitRegister() {
    const name = (this.name || "").trim();
    const email = (this.email || "").trim();

    if (!name || !email) {
      this.message = { type: "error", text: "Please provide both your full name and email." };
      store.notify();
      return;
    }

    store.loginUser(email, name, this.role);
    store.updateProfile({
      examGoal: this.examGoal,
      level: this.level
    });

    sound.playLevelUp();
    store.addNotification({
      title: "Account Created!",
      desc: `Welcome to AptiLearn AI, ${name}. Your adaptive baseline has been initialized.`,
      type: "auth"
    });
    this.close();
  }

  loginWithGoogle() {
    sound.playLevelUp();
    store.loginUser("alex.rivera@gmail.com", "Alex Rivera", "student");
    store.addNotification({
      title: "Google Authentication Successful",
      desc: "Authenticated securely via Google Identity Services.",
      type: "auth"
    });
    this.close();
  }

  quickPersonaLogin(personaKey) {
    sound.playLevelUp();
    store.switchPersona(personaKey);
    store.addNotification({
      title: "Demo Profile Loaded",
      desc: `Signed in as ${store.currentUser?.name} (${store.currentUser?.role}).`,
      type: "auth"
    });
    this.close();
  }

  submitForgot() {
    if (!this.email) {
      this.message = { type: "error", text: "Please enter your email address to receive reset instructions." };
      store.notify();
      return;
    }
    this.message = { type: "success", text: `A password reset link has been dispatched to ${this.email}. Check your inbox!` };
    store.notify();
  }

  saveSettings(key) {
    store.setApiKey(key);
    this.message = { type: "success", text: "Gemini API key successfully saved to local vault!" };
    store.notify();
  }
}

export const authController = new AuthModalController();

export function renderAuthModal() {
  const ac = authController;
  if (!ac.isOpen) return '';

  return `
    <div class="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div class="glass-card max-w-md w-full p-6 sm:p-8 border border-cyan-500/40 relative animate-in zoom-in-95 duration-200 my-8 shadow-2xl">
        
        <!-- Close Button -->
        <button 
          onclick="window.App.closeAuthModal()" 
          class="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center text-sm transition-colors">
          ✕
        </button>

        <!-- Header Tabs -->
        <div class="flex items-center gap-1.5 border-b border-slate-800 pb-3 mb-5">
          <button 
            onclick="window.App.switchAuthMode('login')"
            class="px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              ac.mode === 'login' 
                ? 'bg-cyan-950 text-cyan-300 border border-cyan-700/60 shadow-sm' 
                : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
            }">
            Sign In
          </button>
          <button 
            onclick="window.App.switchAuthMode('register')"
            class="px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              ac.mode === 'register' 
                ? 'bg-cyan-950 text-cyan-300 border border-cyan-700/60 shadow-sm' 
                : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
            }">
            Create Account
          </button>
          <button 
            onclick="window.App.switchAuthMode('settings')"
            class="px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              ac.mode === 'settings' 
                ? 'bg-cyan-950 text-cyan-300 border border-cyan-700/60 shadow-sm' 
                : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
            }">
            API Vault
          </button>
        </div>

        <!-- Feedback Alerts -->
        ${ac.message ? `
          <div class="p-3 rounded-xl mb-4 text-xs flex items-center gap-2 ${
            ac.message.type === 'error' 
              ? 'bg-rose-950/60 text-rose-300 border border-rose-800' 
              : 'bg-emerald-950/60 text-emerald-300 border border-emerald-800'
          }">
            <span>${ac.message.type === 'error' ? '⚠️' : '✓'}</span>
            <span>${ac.message.text}</span>
          </div>
        ` : ''}

        <!-- Active View -->
        ${ac.mode === 'login' ? renderLoginForm(ac) : (ac.mode === 'register' ? renderRegisterForm(ac) : (ac.mode === 'settings' ? renderSettingsForm(ac) : renderForgotForm(ac)))}

      </div>
    </div>
  `;
}

function renderLoginForm(ac) {
  return `
    <div class="space-y-4">
      <div>
        <h2 class="text-xl font-extrabold text-white">Sign In to AptiLearn AI</h2>
        <p class="text-xs text-slate-400 mt-1">Access your personalized learner model, streaks & recommendations.</p>
      </div>

      <!-- Quick 1-Click Google Sign In -->
      <button 
        type="button"
        onclick="window.App.loginWithGoogle()"
        class="w-full py-2.5 px-4 rounded-xl bg-slate-900 border border-slate-700 text-xs font-semibold text-slate-200 hover:bg-slate-800 hover:text-white flex items-center justify-center gap-2 transition-all shadow-sm">
        <svg class="w-4 h-4" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
        </svg>
        <span>Continue with Google</span>
      </button>

      <div class="flex items-center gap-2 my-2">
        <div class="h-px bg-slate-800 grow"></div>
        <span class="text-[10px] uppercase font-bold text-slate-500">Or with Email</span>
        <div class="h-px bg-slate-800 grow"></div>
      </div>

      <div class="space-y-3">
        <div>
          <label class="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
          <input 
            type="email" 
            value="${ac.email || 'alex.rivera@student.edu'}" 
            oninput="window.App.setAuthEmail(this.value)"
            placeholder="student@university.edu" 
            class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div>
          <div class="flex items-center justify-between mb-1">
            <label class="block text-xs font-semibold text-slate-300">Password</label>
            <button type="button" onclick="window.App.switchAuthMode('forgot')" class="text-[11px] text-cyan-400 hover:underline">Forgot?</button>
          </div>
          <div class="relative">
            <input 
              type="${ac.showPassword ? 'text' : 'password'}" 
              value="${ac.password || 'password123'}" 
              oninput="window.App.setAuthPassword(this.value)"
              placeholder="••••••••••••" 
              class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 pr-10"
            />
            <button 
              type="button" 
              onclick="window.App.toggleShowPassword()" 
              class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs">
              ${ac.showPassword ? '👁️' : '🔒'}
            </button>
          </div>
        </div>

        <div class="flex items-center justify-between text-xs pt-1">
          <label class="flex items-center gap-2 text-slate-400 cursor-pointer">
            <input type="checkbox" checked class="rounded border-slate-700 bg-slate-900 text-cyan-500 focus:ring-0">
            <span>Remember this device</span>
          </label>
        </div>
      </div>

      <button 
        type="button"
        onclick="window.App.submitAuthLogin()"
        class="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 text-white font-bold text-xs shadow-lg shadow-cyan-500/25 hover:scale-[1.01] active:scale-[0.99] transition-all">
        Sign In to AptiLearn AI →
      </button>

      <!-- Instant 1-Click Persona Quick Logins -->
      <div class="pt-3 border-t border-slate-800 text-center">
        <span class="text-[11px] text-slate-400 font-medium">Or log in instantly with demo credentials:</span>
        <div class="grid grid-cols-2 gap-2 mt-2">
          <button 
            type="button"
            onclick="window.App.quickPersonaLogin('alex')" 
            class="px-2.5 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 text-[11px] text-cyan-300 hover:border-cyan-500 text-left flex items-center gap-2 transition-colors">
            <span class="text-sm">🎓</span>
            <div class="overflow-hidden">
              <div class="font-bold truncate">Alex (Student)</div>
              <div class="text-[9px] text-slate-400">Intermediate</div>
            </div>
          </button>

          <button 
            type="button"
            onclick="window.App.quickPersonaLogin('priya')" 
            class="px-2.5 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 text-[11px] text-emerald-300 hover:border-emerald-500 text-left flex items-center gap-2 transition-colors">
            <span class="text-sm">🚀</span>
            <div class="overflow-hidden">
              <div class="font-bold truncate">Priya (Advanced)</div>
              <div class="text-[9px] text-slate-400">88% Mastery</div>
            </div>
          </button>

          <button 
            type="button"
            onclick="window.App.quickPersonaLogin('teacher')" 
            class="px-2.5 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 text-[11px] text-indigo-300 hover:border-indigo-500 text-left flex items-center gap-2 transition-colors">
            <span class="text-sm">👨‍🏫</span>
            <div class="overflow-hidden">
              <div class="font-bold truncate">Prof. Harrison</div>
              <div class="text-[9px] text-slate-400">Teacher View</div>
            </div>
          </button>

          <button 
            type="button"
            onclick="window.App.quickPersonaLogin('parent')" 
            class="px-2.5 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 text-[11px] text-pink-300 hover:border-pink-500 text-left flex items-center gap-2 transition-colors">
            <span class="text-sm">👩‍👧</span>
            <div class="overflow-hidden">
              <div class="font-bold truncate">Eleanor (Parent)</div>
              <div class="text-[9px] text-slate-400">Consistency View</div>
            </div>
          </button>
        </div>
      </div>
    </div>
  `;
}

function renderRegisterForm(ac) {
  return `
    <div class="space-y-4">
      <div>
        <h2 class="text-xl font-extrabold text-white">Create Your Account</h2>
        <p class="text-xs text-slate-400 mt-1">Set up your personalized AI learner profile.</p>
      </div>

      <!-- Account Role Picker -->
      <div>
        <label class="block text-xs font-semibold text-slate-300 mb-1.5">I am registering as a:</label>
        <div class="grid grid-cols-3 gap-2">
          <button 
            type="button" 
            onclick="window.App.setAuthRole('student')" 
            class="py-2 px-2 rounded-xl text-xs font-bold border text-center transition-all ${
              ac.role === 'student' 
                ? 'bg-cyan-950 text-cyan-300 border-cyan-500 shadow-sm' 
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
            }">
            🎓 Student
          </button>
          <button 
            type="button" 
            onclick="window.App.setAuthRole('teacher')" 
            class="py-2 px-2 rounded-xl text-xs font-bold border text-center transition-all ${
              ac.role === 'teacher' 
                ? 'bg-indigo-950 text-indigo-300 border-indigo-500 shadow-sm' 
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
            }">
            👨‍🏫 Educator
          </button>
          <button 
            type="button" 
            onclick="window.App.setAuthRole('parent')" 
            class="py-2 px-2 rounded-xl text-xs font-bold border text-center transition-all ${
              ac.role === 'parent' 
                ? 'bg-pink-950 text-pink-300 border-pink-500 shadow-sm' 
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
            }">
            👩‍👧 Parent
          </button>
        </div>
      </div>

      <div class="space-y-3">
        <div>
          <label class="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
          <input 
            type="text" 
            placeholder="Jordan Lee" 
            value="${ac.name}"
            oninput="window.App.setAuthName(this.value)"
            class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div>
          <label class="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
          <input 
            type="email" 
            placeholder="jordan@example.com" 
            value="${ac.email}"
            oninput="window.App.setAuthEmail(this.value)"
            class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        ${ac.role === 'student' ? `
          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1">Primary Exam Target</label>
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
            <label class="block text-xs font-semibold text-slate-300 mb-1">Self-Assessed Knowledge Level</label>
            <select 
              onchange="window.App.setAuthLevel(this.value)"
              class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500">
              <option value="Beginner">Beginner (Foundations & Syntax)</option>
              <option value="Intermediate" selected>Intermediate (Loops, Recursion, Arrays)</option>
              <option value="Advanced">Advanced (Data Structures, Sorting, Trees)</option>
            </select>
          </div>
        ` : ''}
      </div>

      <button 
        type="button"
        onclick="window.App.submitAuthRegister()"
        class="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 text-white font-bold text-xs shadow-lg shadow-cyan-500/25 hover:scale-[1.01] active:scale-[0.99] transition-all">
        Complete Registration & Launch Platform →
      </button>

      <div class="text-center pt-1 text-xs text-slate-400">
        Already have an account? 
        <button type="button" onclick="window.App.switchAuthMode('login')" class="text-cyan-400 font-semibold hover:underline">Sign In here</button>
      </div>
    </div>
  `;
}

function renderForgotForm(ac) {
  return `
    <div class="space-y-4">
      <div>
        <h2 class="text-xl font-extrabold text-white">Reset Password</h2>
        <p class="text-xs text-slate-400 mt-1">Enter your email and we'll send you recovery instructions.</p>
      </div>

      <div>
        <label class="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
        <input 
          type="email" 
          value="${ac.email}"
          oninput="window.App.setAuthEmail(this.value)"
          placeholder="name@example.com" 
          class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
        />
      </div>

      <button 
        type="button"
        onclick="window.App.submitAuthForgot()"
        class="w-full py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-md transition-all">
        Send Password Reset Link
      </button>

      <div class="text-center pt-2">
        <button type="button" onclick="window.App.switchAuthMode('login')" class="text-xs text-slate-400 hover:text-white transition-colors">
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
        <h2 class="text-xl font-extrabold text-white">AI Engine & API Vault</h2>
        <p class="text-xs text-slate-400 mt-1">Optional: Provide a Gemini API key for live dynamic LLM question & tutor generation. If omitted, AptiLearn AI uses its built-in pedagogical engine.</p>
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
        type="button"
        onclick="window.App.saveApiKey(document.getElementById('settings-api-key').value)"
        class="w-full py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-md transition-all">
        Save API Key
      </button>
    </div>
  `;
}
