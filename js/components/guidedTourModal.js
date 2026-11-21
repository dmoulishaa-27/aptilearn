// LearnIQ Studio 3.0 Signature 9-Step Judge Workflow Tour
import { store } from '../state.js';
import { sound } from '../soundFx.js';
import { practiceState } from './practiceView.js';
import { tutorEngine } from '../tutorEngine.js';

export const TOUR_STEPS = [
  {
    step: 1,
    title: "1. Studio 3.0 Cockpit & Bayesian EMA Matrix",
    summary: "High-DPI Cognitive Radar Chart & real-time Bayesian Knowledge Tracing with EMA: 0.65.",
    actionName: "Load Cockpit Dashboard",
    route: "dashboard",
    execute: () => {
      window.App.switchPersona('alex');
      store.setRoute('dashboard');
    },
    explanation: "Tracks multi-dimensional mastery across Foundations, Control Flow, Data Structures, Algorithms, Memory Models, and Dynamic Logic."
  },
  {
    step: 2,
    title: "2. 15-Node Concept DAG (Prerequisite Graph)",
    summary: "Visual prerequisite graph reflects live states: Green (Mastered), Yellow (Learning), Red (Needs Attention).",
    actionName: "Inspect Live Concept DAG",
    route: "graph",
    execute: () => {
      store.setRoute('graph');
      setTimeout(() => {
        store.selectedConceptForModal = "recursion";
        store.notify();
      }, 300);
    },
    explanation: "Clicking any node reveals syllabus prerequisites, previous error patterns, and instant practice drills."
  },
  {
    step: 3,
    title: "3. Adaptive Arena (Targeted Scaffolding)",
    summary: "Dynamic difficulty scaling identifies Recursion as Alex's primary bottleneck and serves targeted questions.",
    actionName: "Load Targeted Recursion Drill",
    route: "practice",
    execute: async () => {
      await practiceState.loadQuestion('recursion');
      store.setRoute('practice');
    },
    explanation: "Unlike static test banks, AptiLearn AI dynamically recalibrates question difficulty based on prior answer confidence and latency."
  },
  {
    step: 4,
    title: "4. Misconception Lab (Root Cause & Code Traces)",
    summary: "Detects WHY the mistake happened (Missing Base Case Guard) with side-by-side counterexample traces.",
    actionName: "Open Misconception Lab",
    route: "misconceptions",
    execute: () => {
      store.setRoute('misconceptions');
    },
    explanation: "Extracts student cognitive bugs and generates side-by-side buggy code vs correct mental model comparisons."
  },
  {
    step: 5,
    title: "5. Interactive Java Coding Lab (AST Guard)",
    summary: "Live sandboxed coding editor with real-time AST base case guard and automated test fixtures.",
    actionName: "Launch Java Coding Lab",
    route: "coding",
    execute: () => {
      store.setRoute('coding');
      setTimeout(() => {
        window.App.runCodingLab();
      }, 300);
    },
    explanation: "Validates code logic client-side and safely guards against infinite recursive StackOverflowError before execution."
  },
  {
    step: 6,
    title: "6. Real Mock Exam Simulator (15-Min Timer)",
    summary: "Timed examination simulator with multi-topic question palette, review flags, and negative marking.",
    actionName: "Launch 15-Min Mock Exam",
    route: "exam",
    execute: () => {
      store.setRoute('exam');
      setTimeout(() => {
        window.App.startSimulatedExam(true);
      }, 200);
    },
    explanation: "Full competitive test conditions with instant post-exam analytics and subject percentile ranking."
  },
  {
    step: 7,
    title: "7. Spaced Repetition (SuperMemo SM-2)",
    summary: "Mathematical memory scheduler preventing knowledge decay via Leitner interval expansion.",
    actionName: "Open Spaced SM-2 Review",
    route: "revision",
    execute: () => {
      store.setRoute('revision');
    },
    explanation: "Calculates optimal recall intervals (1d, 3d, 7d, 14d) based on student self-rated recall quality."
  },
  {
    step: 8,
    title: "8. Socrates AI Copilot (5 Explanation Modes)",
    summary: "Socratic AI dialogue featuring 5 'Explain It Again' modes: ELI5, Analogy, Step-by-Step, Visual Stack, and Quiz.",
    actionName: "Chat with Socrates Copilot",
    route: "tutor",
    execute: async () => {
      store.setRoute('tutor');
      setTimeout(async () => {
        await tutorEngine.sendMessage("Why do I get a StackOverflowError in recursion?");
        store.notify();
      }, 200);
    },
    explanation: "Adapts pedagogical depth to student mastery level and supports Web Speech API audio voice read-aloud."
  },
  {
    step: 9,
    title: "9. Teacher UI & Cohort Analytics",
    summary: "Faculty dashboard displaying class average mastery, at-risk student flags, and class-wide misconception heatmaps.",
    actionName: "Switch to Teacher Cohort View",
    route: "teacher",
    execute: () => {
      window.App.switchPersona('teacher');
      store.setRoute('teacher');
    },
    explanation: "Empowers educators with actionable cohort telemetry, identifying systemic misconceptions before exams."
  }
];

class GuidedTourController {
  constructor() {
    this.isOpen = false;
    this.currentStepIndex = 0;
  }

  open(stepIdx = 0) {
    this.isOpen = true;
    this.currentStepIndex = stepIdx;
    sound.playLevelUp();
    this.executeCurrentStep();
    store.notify();
  }

  close() {
    this.isOpen = false;
    sound.playClick();
    store.notify();
  }

  goToStep(idx) {
    if (idx >= 0 && idx < TOUR_STEPS.length) {
      this.currentStepIndex = idx;
      sound.playClick();
      this.executeCurrentStep();
      store.notify();
    }
  }

  next() {
    if (this.currentStepIndex < TOUR_STEPS.length - 1) {
      this.goToStep(this.currentStepIndex + 1);
    } else {
      this.close();
    }
  }

  prev() {
    if (this.currentStepIndex > 0) {
      this.goToStep(this.currentStepIndex - 1);
    }
  }

  executeCurrentStep() {
    const s = TOUR_STEPS[this.currentStepIndex];
    if (s && s.execute) {
      try {
        s.execute();
      } catch (e) {
        console.warn("[Tour Execution]:", e);
      }
    }
  }
}

export const tourController = new GuidedTourController();

export function renderGuidedTourModal() {
  const tc = tourController;
  if (!tc.isOpen) return '';

  const s = TOUR_STEPS[tc.currentStepIndex];
  const isFirst = tc.currentStepIndex === 0;
  const isLast = tc.currentStepIndex === TOUR_STEPS.length - 1;

  return `
    <div id="guided-tour-bar" class="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:w-[500px] z-50 animate-in slide-in-from-bottom-6 duration-200 shadow-2xl">
      <div class="glass-card p-5 border border-amber-500/50 bg-[#0b1120]/95 backdrop-blur-xl space-y-3.5 shadow-2xl">
        
        <!-- Header -->
        <div class="flex items-center justify-between pb-2 border-b border-slate-800">
          <div class="flex items-center gap-2">
            <span class="text-amber-400 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 font-mono">
              <span>⭐</span>
              <span>9-Step Judge Workflow Tour</span>
            </span>
            <span class="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-950 text-amber-300 border border-amber-700/60 font-bold">
              Step ${s.step} / ${TOUR_STEPS.length}
            </span>
          </div>

          <button 
            onclick="window.App.closeGuidedTour()" 
            class="text-slate-400 hover:text-white text-xs p-1 rounded hover:bg-slate-800 transition-colors">
            ✕ Close
          </button>
        </div>

        <!-- Step Title & Summary -->
        <div>
          <h4 class="text-sm font-extrabold text-white leading-snug">${s.title}</h4>
          <p class="text-xs text-amber-200/90 mt-1 leading-relaxed">${s.summary}</p>
        </div>

        <!-- Pedagogical Explanations -->
        <div class="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/80 text-[11px] text-slate-300 leading-relaxed">
          <strong class="text-cyan-400 font-semibold font-mono">Evaluation Note:</strong> ${s.explanation}
        </div>

        <!-- Step Navigation Progress Bar -->
        <div class="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
          <div class="h-full bg-gradient-to-r from-amber-400 to-orange-500 transition-all duration-300" style="width: ${((tc.currentStepIndex + 1) / TOUR_STEPS.length) * 100}%"></div>
        </div>

        <!-- Actions -->
        <div class="flex items-center justify-between pt-1">
          <button 
            onclick="window.App.tourPrev()" 
            ${isFirst ? 'disabled class="opacity-30 cursor-not-allowed text-xs text-slate-400"' : 'class="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white transition-all"'}>
            ← Previous
          </button>

          <div class="flex items-center gap-1.5">
            ${TOUR_STEPS.map((step, idx) => `
              <button 
                onclick="window.App.tourGoTo(${idx})"
                class="w-2 h-2 rounded-full transition-all ${idx === tc.currentStepIndex ? 'bg-amber-400 w-4' : 'bg-slate-700 hover:bg-slate-500'}"
                title="${step.title}">
              </button>
            `).join('')}
          </div>

          <button 
            onclick="window.App.tourNext()" 
            class="px-4 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-extrabold text-xs shadow-md transition-all">
            ${isLast ? 'Complete Tour ✓' : 'Next Step →'}
          </button>
        </div>

      </div>
    </div>
  `;
}
