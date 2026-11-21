// LearnIQ Hackathon Judge 9-Step Guided Walkthrough Controller
import { store } from '../state.js';
import { sound } from '../soundFx.js';
import { LearnerModelEngine } from '../learnerModel.js';
import { practiceState } from './practiceView.js';

export const TOUR_STEPS = [
  {
    step: 1,
    title: "1. Diagnostic Baseline Assessment",
    summary: "The student takes an initial diagnostic test across Java and DSA topics.",
    actionName: "Launch Diagnostic Test",
    route: "diagnostic",
    execute: () => {
      window.App.switchPersona('fresh');
      window.App.startDiagnostic();
    },
    explanation: "LearnIQ evaluates prior knowledge across multiple syllabus topics to establish a baseline before adaptive drills begin."
  },
  {
    step: 2,
    title: "2. Weak Concept Identification",
    summary: "LearnIQ identifies foundational gaps in Recursion Base Cases & Array Bounds.",
    actionName: "Inspect Weak Concepts on Dashboard",
    route: "dashboard",
    execute: () => {
      window.App.switchPersona('alex');
      store.setRoute('dashboard');
    },
    explanation: "Instead of a generic percentage score, LearnIQ isolates specific cognitive deficits (e.g. Recursion mastery at 34%)."
  },
  {
    step: 3,
    title: "3. Concept Knowledge Graph Updates",
    summary: "Prerequisite dependency graph reflects live mastery states (Red = Needs Work, Green = Mastered).",
    actionName: "Explore Live Knowledge Graph",
    route: "graph",
    execute: () => {
      store.setRoute('graph');
    },
    explanation: "Notice the Red node on 'Recursion & Call Stack' with Amber on 'Arrays', showing unlocked paths and prerequisite dependencies."
  },
  {
    step: 4,
    title: "4. Targeted Question Generation",
    summary: "Adaptive Engine automatically generates targeted questions on the student's weakest concept.",
    actionName: "Generate Targeted Recursion Question",
    route: "practice",
    execute: () => {
      window.App.startAdaptivePractice('recursion');
    },
    explanation: "The system bypasses mastered concepts to focus learning time strictly where knowledge gaps exist."
  },
  {
    step: 5,
    title: "5. Student Answers Incorrectly with Stated Reasoning",
    summary: "Student chooses an incorrect distractor and enters their mental model reasoning.",
    actionName: "Simulate Mistake with Reasoning",
    route: "practice",
    execute: async () => {
      if (!practiceState.currentQuestion) {
        await practiceState.loadQuestion('recursion');
      }
      practiceState.selectedOption = 0; // "It prints 6" (fails base case)
      practiceState.studentReasoning = "I thought recursion would automatically terminate when n reached negative numbers.";
      practiceState.confidence = "High"; // Overconfidence!
      practiceState.submitAnswer();
      store.setRoute('practice');
    },
    explanation: "High confidence combined with an incorrect answer signals a deep-seated misconception rather than a careless typo."
  },
  {
    step: 6,
    title: "6. Root Misconception Detection & Counterexample",
    summary: "System pinpoints WHY the error happened and displays side-by-side counterexample code.",
    actionName: "Inspect Misconception Diagnosis",
    route: "misconceptions",
    execute: () => {
      store.setRoute('misconceptions');
    },
    explanation: "The engine classifies the mistake as 'Missing Recursion Base Case', explaining the Call Stack overflow with visual counterexamples."
  },
  {
    step: 7,
    title: "7. Learner Model Bayesian Calibration",
    summary: "Mastery score drops and consecutive mistake penalty updates the student's profile.",
    actionName: "View Updated Mastery Score",
    route: "dashboard",
    execute: () => {
      store.setRoute('dashboard');
    },
    explanation: "The Bayesian ELO model adjusts the concept mastery score dynamically, triggering scaffolding alerts."
  },
  {
    step: 8,
    title: "8. Spaced Repetition (SM-2) Queue Creation",
    summary: "The revision scheduler automatically creates an urgent retrieval task for the failed concept.",
    actionName: "Open Revision Center (Due Today)",
    route: "revision",
    execute: () => {
      store.setRoute('revision');
    },
    explanation: "SuperMemo SM-2 schedules a micro-review for today to arrest memory decay before it sets in."
  },
  {
    step: 9,
    title: "9. Mastery Demonstrated & Difficulty Scaled Up",
    summary: "After targeted remediation, the student succeeds and LearnIQ scales question difficulty to Hard!",
    actionName: "Simulate Mastery & Scale to Hard",
    route: "practice",
    execute: async () => {
      // Reward mastery
      LearnerModelEngine.recordAttempt({
        conceptId: "recursion",
        isCorrect: true,
        difficulty: "Medium",
        timeTakenSec: 18,
        confidence: "High",
        questionId: "rec_base_fix"
      });
      // Resolve misconception
      if (store.currentUser.activeMisconceptions?.[0]) {
        store.currentUser.activeMisconceptions[0].resolved = true;
      }
      await practiceState.loadQuestion("recursion");
      store.setRoute('practice');
      sound.playLevelUp();
    },
    explanation: "Consecutive correct answers elevate mastery past 75%, unlocking Hard-level challenge problems!"
  }
];

class GuidedTourController {
  constructor() {
    this.isOpen = false;
    this.currentStepIdx = 0;
  }

  open(step = 0) {
    this.isOpen = true;
    this.currentStepIdx = step;
    sound.playClick();
    store.notify();
  }

  close() {
    this.isOpen = false;
    store.notify();
  }

  goToStep(index) {
    if (index >= 0 && index < TOUR_STEPS.length) {
      this.currentStepIdx = index;
      const stepObj = TOUR_STEPS[index];
      if (stepObj.execute) {
        stepObj.execute();
      }
      sound.playClick();
      store.notify();
    }
  }

  next() {
    if (this.currentStepIdx < TOUR_STEPS.length - 1) {
      this.goToStep(this.currentStepIdx + 1);
    } else {
      this.close();
    }
  }

  prev() {
    if (this.currentStepIdx > 0) {
      this.goToStep(this.currentStepIdx - 1);
    }
  }
}

export const tourController = new GuidedTourController();

export function renderGuidedTourModal() {
  const tc = tourController;
  if (!tc.isOpen) return '';

  const current = TOUR_STEPS[tc.currentStepIdx];

  return `
    <!-- Floating Persistent Tour Bar for Judges -->
    <div id="guided-tour-bar" class="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 max-w-3xl w-[94%] bg-slate-900/95 border border-amber-500/50 rounded-2xl p-4 shadow-2xl backdrop-blur-xl animate-in slide-in-from-bottom-5 duration-300">
      
      <div class="flex items-center justify-between border-b border-slate-800 pb-2.5 mb-3">
        <div class="flex items-center gap-2">
          <span class="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping"></span>
          <span class="text-xs font-bold text-amber-300 uppercase tracking-wider">Hackathon Evaluation: 9-Step Differentiator Walkthrough</span>
        </div>
        <div class="flex items-center gap-2">
          <span class="text-xs text-slate-400 font-mono font-bold">Step ${current.step} / 9</span>
          <button onclick="window.App.closeGuidedTour()" class="w-6 h-6 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center text-xs">✕</button>
        </div>
      </div>

      <!-- Step Content -->
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h4 class="text-sm font-bold text-white flex items-center gap-2">
            <span>${current.title}</span>
          </h4>
          <p class="text-xs text-slate-300 mt-1 max-w-xl leading-relaxed">${current.summary}</p>
          <div class="text-[11px] text-amber-300/90 mt-1 font-mono">
            💡 Under the hood: ${current.explanation}
          </div>
        </div>

        <div class="flex items-center gap-2 shrink-0">
          <button 
            onclick="window.App.tourGoTo(${tc.currentStepIdx})" 
            class="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition-all">
            ${current.actionName} →
          </button>
        </div>
      </div>

      <!-- Step Stepper Pills -->
      <div class="flex items-center justify-between mt-3 pt-3 border-t border-slate-800 gap-1 overflow-x-auto pb-1">
        <div class="flex gap-1.5">
          ${TOUR_STEPS.map((s, idx) => `
            <button 
              onclick="window.App.tourGoTo(${idx})"
              class="w-7 h-7 rounded-lg text-xs font-bold transition-all ${
                tc.currentStepIdx === idx 
                  ? 'bg-amber-500 text-slate-950 font-extrabold shadow-md shadow-amber-500/30 scale-105' 
                  : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
              }">
              ${s.step}
            </button>
          `).join('')}
        </div>

        <div class="flex items-center gap-2">
          <button 
            onclick="window.App.tourPrev()" 
            ${tc.currentStepIdx === 0 ? 'disabled' : ''}
            class="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 text-xs font-semibold disabled:opacity-30">
            ← Prev
          </button>
          <button 
            onclick="window.App.tourNext()" 
            class="px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-sm">
            ${tc.currentStepIdx === TOUR_STEPS.length - 1 ? 'Finish Tour ✓' : 'Next Step →'}
          </button>
        </div>
      </div>

    </div>
  `;
}
