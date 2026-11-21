// LearnIQ Central State Store & Persistence Layer
import { DEMO_PERSONAS, SYLLABUS_CONCEPTS, BADGES_CATALOG } from './config.js';

const STORAGE_KEY = "learniq_app_state_v1";

class StateStore {
  constructor() {
    this.subscribers = [];
    this.currentRoute = "landing"; // 'landing', 'dashboard', 'diagnostic', 'graph', 'practice', 'misconceptions', 'revision', 'tutor', 'teacher', 'reports'
    this.routeParams = {};
    this.selectedConceptForModal = null;
    this.soundEnabled = true;
    this.apiKey = localStorage.getItem("learniq_gemini_key") || "";
    this.unlockedBadges = ["streak_3", "first_diagnostic"];
    this.recentAttempts = [];
    this.diagnosticHistory = [];

    this.currentUser = this.loadState() || JSON.parse(JSON.stringify(DEMO_PERSONAS.alex));
    
    // Auto-sync with server if available
    this.syncWithServer();
  }

  loadState() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.id) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn("[LearnIQ State] Error reading from localStorage:", e);
    }
    return null;
  }

  saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.currentUser));
      // Notify subscribers
      this.notify();
      // Asynchronously sync with Python server
      this.syncToServer();
    } catch (e) {
      console.error("[LearnIQ State] Save failed:", e);
    }
  }

  async syncWithServer() {
    try {
      const res = await fetch("/api/state");
      if (res.ok) {
        const data = await res.json();
        if (data && data.state && data.state.id) {
          // If server state exists, we can merge or use it
          console.log("[LearnIQ] Synced with backend server state.");
        }
      }
    } catch (err) {
      // Offline / standalone mode - perfectly fine
    }
  }

  async syncToServer() {
    try {
      await fetch("/api/sync-state", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(this.currentUser)
      });
    } catch (err) {
      // Standalone mode fallback
    }
  }

  subscribe(callback) {
    this.subscribers.push(callback);
    return () => {
      this.subscribers = this.subscribers.filter(fn => fn !== callback);
    };
  }

  notify() {
    for (const sub of this.subscribers) {
      try {
        sub(this);
      } catch (e) {
        console.error("[LearnIQ State] Subscriber error:", e);
      }
    }
  }

  setRoute(route, params = {}) {
    this.currentRoute = route;
    this.routeParams = params;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    this.notify();
  }

  setApiKey(key) {
    this.apiKey = key.trim();
    localStorage.setItem("learniq_gemini_key", this.apiKey);
    this.notify();
  }

  toggleSound() {
    this.soundEnabled = !this.soundEnabled;
    this.notify();
  }

  switchPersona(personaKey) {
    if (DEMO_PERSONAS[personaKey]) {
      this.currentUser = JSON.parse(JSON.stringify(DEMO_PERSONAS[personaKey]));
      if (this.currentUser.role === 'teacher') {
        this.currentRoute = 'teacher';
      } else {
        this.currentRoute = 'dashboard';
      }
      this.saveState();
    }
  }

  loginUser(email, name, role = "student") {
    this.currentUser = {
      id: "user_" + Date.now(),
      name: name || "Student",
      email: email,
      role: role,
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
      examGoal: "Java & DSA Placement Exam",
      level: "Intermediate",
      streakDays: 1,
      lastActiveDate: new Date().toISOString(),
      totalXp: 100,
      levelName: "Syntax Novice",
      diagnosticCompleted: false,
      weeklyGoalQuestions: 30,
      weeklyQuestionsDone: 0,
      mastery: {
        variables: 50,
        conditionals: 45,
        loops: 40,
        functions: 35,
        arrays: 30,
        strings: 30,
        recursion: 20,
        searching: 20,
        sorting: 20,
        linked_lists: 20,
        stacks_queues: 20,
        binary_trees: 10
      },
      conceptStats: {},
      activeMisconceptions: [],
      spacedRepetitionQueue: []
    };
    this.currentRoute = role === 'teacher' ? 'teacher' : 'dashboard';
    this.saveState();
  }

  logout() {
    this.currentRoute = "landing";
    this.notify();
  }

  updateProfile(data) {
    if (!this.currentUser) return;
    this.currentUser = { ...this.currentUser, ...data };
    this.saveState();
  }

  addXp(amount, reason = "") {
    if (!this.currentUser) return;
    this.currentUser.totalXp = (this.currentUser.totalXp || 0) + amount;
    
    // Update level title based on total XP
    const xp = this.currentUser.totalXp;
    if (xp > 3000) this.currentUser.levelName = "Code Grandmaster";
    else if (xp > 2000) this.currentUser.levelName = "Data Structure Knight";
    else if (xp > 1000) this.currentUser.levelName = "Algorithm Apprentice";
    else if (xp > 500) this.currentUser.levelName = "Logic Explorer";
    else this.currentUser.levelName = "Syntax Novice";

    this.saveState();
  }

  unlockBadge(badgeId) {
    if (!this.unlockedBadges.includes(badgeId)) {
      this.unlockedBadges.push(badgeId);
      const b = BADGES_CATALOG.find(x => x.id === badgeId);
      if (b) {
        this.addXp(b.xp, `Badge unlocked: ${b.title}`);
      }
      this.saveState();
    }
  }

  resetDemo() {
    localStorage.removeItem(STORAGE_KEY);
    this.currentUser = JSON.parse(JSON.stringify(DEMO_PERSONAS.alex));
    this.currentRoute = "dashboard";
    this.notify();
  }
}

export const store = new StateStore();
