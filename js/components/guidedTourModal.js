// AptiLearn AI Signature Hackathon 12-Step Guided Demonstration Controller
import { store } from '../state.js';
import { sound } from '../soundFx.js';
import { LearnerModelEngine } from '../learnerModel.js';
import { practiceState } from './practiceView.js';
import { tutorEngine } from '../tutorEngine.js';

export const TOUR_STEPS = [
  {
    step: 1,
    title: "1. Student Registration & Goal Calibration",
    summary: "Student registers and selects Java & Data Structures for Placement Exam Prep.",
    actionName: "Simulate Registration",
    route: "dashboard",
    execute: () => {
      window.App.switchPersona('fresh');
      store.updateProfile({ examGoal: "Java & DSA Placement Exam 2026", level: "Intermediate" });
      store.setRoute('dashboard');
    },
    explanation: "AptiLearn initializes an empty learner profile with zero assumptions, awaiting diagnostic placement data."
  },
  {
    step: 2,
    title: "2. AI Placement Diagnostic Assessment",
    summary: "Student takes initial multi-topic placement test to establish baseline knowledge.",
    actionName: "Launch Diagnostic Test",
    route: "diagnostic",
    execute: () => {
      window.App.startDiagnostic();
    },
    explanation: "Multi-topic assessment evaluates prior competence across foundational syntax and algorithms."
  },
  {
    step: 3,
    title: "3. Strong & Weak Concepts Isolated",
    summary: "AptiLearn identifies Arrays as strong (90%) and Recursion as weak (34%).",
    actionName: "View Evaluated Profile (Alex)",
    route: "dashboard",
    execute: () => {
      window.App.switchPersona('alex');
      store.setRoute('dashboard');
    },
    explanation: "Transparent Bayesian modeling distinguishes strong foundational recall from severe cognitive deficits."
  },
  {
    step: 4,
    title: "4. Knowledge Graph Updates Automatically",
    summary: "15-concept prerequisite graph reflects live states: Green for Arrays, Red for Recursion.",
    actionName: "Inspect Live Graph",
    route: "graph",
    execute: () => {
      store.setRoute('graph');
    },
    explanation: "Notice the Red node on Recursion (34%) while prerequisite Foundations are Green, highlighting an isolated algorithm block."
  },
  {
    step: 5,
    title: "5. Targeted Personalized Learning Session",
    summary: "AI Adaptive Engine generates a scaffolded session on the student's weakest concept (Recursion).",
    actionName: "Generate Targeted Question",
    route: "practice",
    execute: async () => {
      await practiceState.loadQuestion('recursion');
      store.setRoute('practice');
    },
    explanation: "The engine bypasses mastered topics to maximize student study efficiency."
  },
  {
    step: 6,
    title: "6. Student Submits Answer & Thought Process",
    summary: "Student selects Option A and enters reasoning: 'Thought it terminates automatically'.",
    actionName: "Simulate Mistake with Reasoning",
    route: "practice",
    execute: async () => {
      if (!practiceState.currentQuestion) {
        await practiceState.loadQuestion('recursion');
      }
      practiceState.selectedOption = 0; // "It prints 6"
      practiceState.studentReasoning = "I thought recursion would automatically terminate when n reached negative numbers.";
      practiceState.confidence = "High"; // Overconfidence!
      practiceState.submitAnswer();
      store.setRoute('practice');
    },
    explanation: "High confidence combined with an incorrect answer signals a deep-seated cognitive bug rather than a careless typo."
  },
  {
    step: 7,
    title: "7. Misconception Detector Identifies Root Cause",
    summary: "AI pinpoints: 'Missing Base Case in Recursion' causing JVM StackOverflowError.",
    actionName: "View Counterexample in Notebook",
    route: "misconceptions",
    execute: () => {
      store.setRoute('misconceptions');
    },
    explanation: "Instead of simply marking it wrong, AptiLearn isolates why the student chose that option and shows flawed vs correct code."
  },
  {
    step: 8,
    title: "8. AI Explains Concept Simply (Explain It Again)",
    summary: "Socrates AI Mentor explains the base case using the Russian Nesting Doll analogy.",
    actionName: "Ask Socrates to Explain Simply",
    route: "tutor",
    execute: async () => {
      store.setRoute('tutor');
      await tutorEngine.explainItAgain('analogy', 'Recursion');
    },
    explanation: "Adapting explanation style to the student's mastery level bridges conceptual gaps faster."
  },
  {
    step: 9,
    title: "9. Bayesian Learner Model Dynamically Recalibrates",
    summary: "Mastery score adjusts dynamically, consecutive mistake count updates, and scaffolding triggers.",
    actionName: "View Calibrated Learner State",
    route: "dashboard",
    execute: () => {
      store.setRoute('dashboard');
    },
    explanation: "Bayesian ELO updates reflect empirical performance after every single question attempt."
  },
  {
    step: 10,
    title: "10. Revision Center Schedules Spaced Recall (SM-2)",
    summary: "Scheduler generates an urgent micro-review task due today before memory decay sets in.",
    actionName: "Inspect Today's Revision Queue",
    route: "revision",
    execute: () => {
      store.setRoute('revision');
    },
    explanation: "SuperMemo SM-2 algorithm calculates personalized intervals (1d -> 2d -> 4d) to cement memory."
  },
  {
    step: 11,
    title: "11. Student Demonstrates Improvement on Next Attempt",
    summary: "Student answers the remediation base-case question correctly with guard condition.",
    actionName: "Simulate Correct Remediation Answer",
    route: "practice",
    execute: async () => {
      LearnerModelEngine.recordAttempt({
        conceptId: "recursion",
        isCorrect: true,
        difficulty: "Medium",
        timeTakenSec: 16,
        confidence: "High",
        questionId: "rec_base_fix"
      });
      if (store.currentUser.activeMisconceptions?.[0]) {
        store.currentUser.activeMisconceptions[0].resolved = true;
      }
      await practiceState.loadQuestion("recursion");
      store.setRoute('practice');
      sound.playLevelUp();
    },
    explanation: "Mastery jumps from 32% to 48%, resolving the active misconception record."
  },
  {
    step: 12,
    title: "12. Dashboard Displays Measurable Improvement",
    summary: "Measurable mastery growth reflected on Knowledge Graph, Predictor readiness, and Study Plan!",
    actionName: "View Measurable Progress",
    route: "dashboard",
    execute: () => {
      store.setRoute('dashboard');
      sound.playLevelUp();
    },
    explanation: "The feedback loop is complete: from gap identification to diagnosis, Socratic explanation, remediation, and verified retention!"
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
    window.App.render();
  }

  close() {
    this.isOpen = false;
    window.App.render();
  }

  goToStep(index) {
    if (index >= 0 && index < TOUR_STEPS.length) {
      this.currentStepIdx = index;
      const stepObj = TOUR_STEPS[index];
      if (stepObj.execute) {
        stepObj.execute();
      }
      sound.playClick();
      window.App.render();
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
    <div id="guided-tour-bar" class="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 max-w-4xl w-[95%] bg-slate-900/95 border border-amber-500/50 rounded-2xl p-4 shadow-2xl backdrop-blur-xl animate-in slide-in-from-bottom-5 duration-300">
      
      <div class="flex items-center justify-between border-b border-slate-800 pb-2.5 mb-3">
        <div class="flex items-center gap-2">
          <span class="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping"></span>
          <span class="text-xs font-bold text-amber-300 uppercase tracking-wider">AptiLearn AI: Signature 12-Step Hackathon Walkthrough</span>
        </div>
        <div class="flex items-center gap-2">
          <span class="text-xs text-slate-400 font-mono font-bold">Step ${current.step} / 12</span>
          <button onclick="window.App.closeGuidedTour()" class="w-6 h-6 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center text-xs">✕</button>
        </div>
      </div>

      <!-- Step Content -->
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h4 class="text-sm font-bold text-white flex items-center gap-2">
            <span>${current.title}</span>
          </h4>
          <p class="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">${current.summary}</p>
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
        <div class="flex gap-1">
          ${TOUR_STEPS.map((s, idx) => `
            <button 
              onclick="window.App.tourGoTo(${idx})"
              class="w-6 h-6 rounded-lg text-[11px] font-bold transition-all ${
                tc.currentStepIdx === idx 
                  ? 'bg-amber-500 text-slate-950 font-extrabold shadow-md shadow-amber-500/30 scale-105' 
                  : 'bg-slate-800 text-slate-400 hover:text-white'
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
