// AptiLearn AI Central State Store & Persistence Layer
import { DEMO_PERSONAS, SYLLABUS_CONCEPTS, BADGES_CATALOG } from './config.js';

const STORAGE_KEY = "aptilearn_app_state_v2";

class StateStore {
  constructor() {
    this.subscribers = [];
    this.currentRoute = "landing"; // 'landing', 'dashboard', 'diagnostic', 'graph', 'practice', 'misconceptions', 'revision', 'tutor', 'predictor', 'notes', 'flashcards', 'exam', 'coding', 'planner', 'teacher', 'parent', 'reports'
    this.routeParams = {};
    this.selectedConceptForModal = null;
    this.soundEnabled = true;
    this.voiceEnabled = true;
    this.theme = localStorage.getItem("aptilearn_theme") || "dark";
    this.language = localStorage.getItem("aptilearn_language") || "en"; // 'en' or 'hi'
    this.apiKey = localStorage.getItem("aptilearn_gemini_key") || "";
    this.unlockedBadges = ["streak_3", "first_diagnostic"];
    this.recentAttempts = [];
    this.diagnosticHistory = [];
    this.onboardingCompleted = true;

    // Notifications queue
    this.notifications = [
      { id: "notif_1", title: "Revision Due Today", desc: "Recursion Base Case Invariant is scheduled for recall.", time: "10m ago", read: false, type: "revision" },
      { id: "notif_2", title: "Daily Quest Ready", desc: "Solve 2 targeted recursion drills to earn +60 XP.", time: "1h ago", read: false, type: "quest" },
      { id: "notif_3", title: "Streak Maintained!", desc: "You are on a 6-day learning streak with freeze protection.", time: "4h ago", read: true, type: "streak" }
    ];

    // Study Planner Timetable
    this.studyPlan = {
      examDate: "2026-12-15",
      dailyHours: 2.0,
      tasks: [
        { id: "sp_1", day: "Today", time: "16:00 - 16:45", title: "Remediation: Recursion Base Cases", type: "Practice", done: false },
        { id: "sp_2", day: "Today", time: "17:00 - 17:30", title: "SM-2 Spaced Repetition (2 cards)", type: "Revision", done: true },
        { id: "sp_3", day: "Tomorrow", time: "16:00 - 16:45", title: "Coding Lab: In-Place Array Reversal", type: "Coding", done: false },
        { id: "sp_4", day: "Day 3", time: "18:00 - 19:00", title: "Full Simulated Mock Test 1", type: "Exam", done: false }
      ]
    };

    this.currentUser = this.loadState() || JSON.parse(JSON.stringify(DEMO_PERSONAS.alex));
    
    // Apply initial theme
    this.applyTheme(this.theme);
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
      console.warn("[AptiLearn State] Error reading from localStorage:", e);
    }
    return null;
  }

  saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.currentUser));
      this.notify();
      this.syncToServer();
    } catch (e) {
      console.error("[AptiLearn State] Save failed:", e);
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
        console.error("[AptiLearn State] Subscriber error:", e);
      }
    }
  }

  setRoute(route, params = {}) {
    this.currentRoute = route;
    this.routeParams = params;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    this.notify();
  }

  setTheme(theme) {
    this.theme = theme;
    localStorage.setItem("aptilearn_theme", theme);
    this.applyTheme(theme);
    this.notify();
  }

  applyTheme(theme) {
    if (theme === 'light') {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
      document.documentElement.classList.add('dark');
    }
  }

  setLanguage(lang) {
    this.language = lang;
    localStorage.setItem("aptilearn_language", lang);
    if (this.currentUser) {
      this.currentUser.preferredLanguage = lang;
    }
    this.notify();
  }

  toggleVoice() {
    this.voiceEnabled = !this.voiceEnabled;
    this.notify();
  }

  setApiKey(key) {
    this.apiKey = key.trim();
    localStorage.setItem("aptilearn_gemini_key", this.apiKey);
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
      } else if (this.currentUser.role === 'parent') {
        this.currentRoute = 'parent';
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
      examGoal: "Java & DSA Placement Exam 2026",
      level: "Intermediate",
      streakDays: 1,
      lastActiveDate: new Date().toISOString(),
      totalXp: 100,
      levelName: "Syntax Novice",
      diagnosticCompleted: false,
      weeklyGoalQuestions: 30,
      weeklyQuestionsDone: 0,
      studyTimeTodayMins: 15,
      preferredLanguage: this.language,
      mastery: {
        variables: 50,
        data_types: 45,
        conditionals: 45,
        loops: 40,
        functions: 35,
        arrays: 30,
        strings: 30,
        recursion: 20,
        searching: 20,
        sorting: 20,
        linked_lists: 20,
        stacks: 20,
        queues: 20,
        trees: 10,
        graphs: 5
      },
      conceptStats: {},
      activeMisconceptions: [],
      spacedRepetitionQueue: [],
      dailyQuests: [
        { id: "q1", title: "Take Placement Diagnostic", desc: "Determine your starting level", progress: 0, total: 1, xp: 150, completed: false }
      ]
    };
    this.currentRoute = role === 'teacher' ? 'teacher' : (role === 'parent' ? 'parent' : 'dashboard');
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
    
    const xp = this.currentUser.totalXp;
    if (xp > 3500) this.currentUser.levelName = "Code Grandmaster";
    else if (xp > 2400) this.currentUser.levelName = "Data Structure Knight";
    else if (xp > 1200) this.currentUser.levelName = "Algorithm Apprentice";
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
        this.addNotification({
          title: `🏆 New Badge Unlocked: ${b.title}`,
          desc: b.desc,
          type: "badge"
        });
      }
      this.saveState();
    }
  }

  addNotification(notif) {
    this.notifications.unshift({
      id: `notif_${Date.now()}`,
      time: "Just now",
      read: false,
      ...notif
    });
    this.notify();
  }

  markNotificationsRead() {
    this.notifications.forEach(n => n.read = true);
    this.notify();
  }

  toggleStudyTask(taskId) {
    const task = this.studyPlan.tasks.find(t => t.id === taskId);
    if (task) {
      task.done = !task.done;
      if (task.done) {
        this.addXp(30, `Completed study task: ${task.title}`);
      }
      this.notify();
    }
  }

  rescheduleMissedTasks() {
    // Automatically rebalances unfinished tasks across future days
    this.studyPlan.tasks.forEach(t => {
      if (!t.done && t.day === "Today") {
        t.day = "Tomorrow";
        t.time = "17:15 - 18:00 (Auto-Rescheduled)";
      }
    });
    this.addNotification({
      title: "Schedule Optimized",
      desc: "Missed tasks were automatically balanced to avoid student burnout.",
      type: "planner"
    });
    this.notify();
  }

  resetDemo() {
    localStorage.removeItem(STORAGE_KEY);
    this.currentUser = JSON.parse(JSON.stringify(DEMO_PERSONAS.alex));
    this.currentRoute = "dashboard";
    this.notify();
  }
}

export const store = new StateStore();
