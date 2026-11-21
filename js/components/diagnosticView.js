// LearnIQ Diagnostic Assessment & Baseline Knowledge Evaluation
import { store } from '../state.js';
import { QUESTION_BANK } from '../questionBank.js';
import { SYLLABUS_CONCEPTS } from '../config.js';
import { LearnerModelEngine } from '../learnerModel.js';
import { sound } from '../soundFx.js';

export class DiagnosticController {
  constructor() {
    this.isActive = false;
    this.currentStep = "intro"; // 'intro', 'testing', 'report'
    this.subject = "Java & Data Structures";
    this.timerEnabled = true;
    this.timeRemainingSec = 600; // 10 minutes
    this.timerInterval = null;
    this.currentIndex = 0;
    this.answers = {}; // qIndex -> optionIndex
    this.confidenceLevels = {}; // qIndex -> 'Low' | 'Medium' | 'High'
    this.evaluated = false;
    this.reportData = null;

    // Pick 8 representative questions across syllabus
    this.questions = [
      QUESTION_BANK.find(q => q.id === "var_01") || QUESTION_BANK[0],
      QUESTION_BANK.find(q => q.id === "loop_01") || QUESTION_BANK[1],
      QUESTION_BANK.find(q => q.id === "arr_01") || QUESTION_BANK[2],
      QUESTION_BANK.find(q => q.id === "rec_01") || QUESTION_BANK[3],
      QUESTION_BANK.find(q => q.id === "ll_01") || QUESTION_BANK[4],
      QUESTION_BANK.find(q => q.id === "sq_01") || QUESTION_BANK[5],
      QUESTION_BANK.find(q => q.id === "srch_01") || QUESTION_BANK[6],
      QUESTION_BANK.find(q => q.id === "tree_01") || QUESTION_BANK[7]
    ];
  }

  startTest() {
    this.isActive = true;
    this.currentStep = "testing";
    this.currentIndex = 0;
    this.answers = {};
    this.confidenceLevels = {};
    this.timeRemainingSec = 600;

    if (this.timerEnabled) {
      this.startTimer();
    }
    sound.playClick();
    store.notify();
  }

  startTimer() {
    if (this.timerInterval) clearInterval(this.timerInterval);
    this.timerInterval = setInterval(() => {
      if (this.timeRemainingSec > 0) {
        this.timeRemainingSec--;
        const el = document.getElementById("diag-timer-display");
        if (el) {
          const mins = Math.floor(this.timeRemainingSec / 60);
          const secs = this.timeRemainingSec % 60;
          el.innerText = `${mins}:${secs < 10 ? '0' : ''}${secs}`;
        }
      } else {
        clearInterval(this.timerInterval);
        this.submitAssessment();
      }
    }, 1000);
  }

  selectOption(optIndex) {
    this.answers[this.currentIndex] = optIndex;
    sound.playClick();
    store.notify();
  }

  setConfidence(conf) {
    this.confidenceLevels[this.currentIndex] = conf;
    store.notify();
  }

  nextQuestion() {
    if (this.currentIndex < this.questions.length - 1) {
      this.currentIndex++;
      store.notify();
    }
  }

  prevQuestion() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      store.notify();
    }
  }

  submitAssessment() {
    if (this.timerInterval) clearInterval(this.timerInterval);

    let correctCount = 0;
    const conceptBreakdown = {};

    this.questions.forEach((q, idx) => {
      const selected = this.answers[idx];
      const isCorrect = selected !== undefined && q.options[selected]?.isCorrect === true;
      if (isCorrect) correctCount++;

      // Update learner model directly for each question
      LearnerModelEngine.recordAttempt({
        conceptId: q.conceptId,
        isCorrect: isCorrect,
        difficulty: q.difficulty,
        timeTakenSec: 45,
        confidence: this.confidenceLevels[idx] || "Medium",
        questionId: q.id
      });

      if (!conceptBreakdown[q.conceptId]) {
        conceptBreakdown[q.conceptId] = { correct: 0, total: 0 };
      }
      conceptBreakdown[q.conceptId].total++;
      if (isCorrect) conceptBreakdown[q.conceptId].correct++;
    });

    const user = store.currentUser;
    user.diagnosticCompleted = true;
    store.unlockBadge("first_diagnostic");

    const pct = Math.round((correctCount / this.questions.length) * 100);
    const startingLevel = pct >= 75 ? "Advanced Track" : (pct >= 50 ? "Intermediate Track" : "Foundational Track");

    this.reportData = {
      scorePct: pct,
      correctCount,
      totalQuestions: this.questions.length,
      startingLevel,
      conceptBreakdown
    };

    this.currentStep = "report";
    sound.playLevelUp();
    store.saveState();
  }

  finishReport() {
    this.currentStep = "intro";
    this.isActive = false;
    store.setRoute("graph");
  }
}

export const diagnosticController = new DiagnosticController();

export function renderDiagnosticView() {
  const dc = diagnosticController;

  if (dc.currentStep === "intro") {
    return renderDiagnosticIntro(dc);
  } else if (dc.currentStep === "testing") {
    return renderDiagnosticTesting(dc);
  } else {
    return renderDiagnosticReport(dc);
  }
}

function renderDiagnosticIntro(dc) {
  return `
    <div class="max-w-4xl mx-auto px-4 py-12">
      <div class="glass-card p-8 border border-cyan-500/30">
        <div class="text-center max-w-2xl mx-auto">
          <div class="w-14 h-14 rounded-2xl bg-cyan-500/20 text-cyan-400 mx-auto flex items-center justify-center mb-4 shadow-lg shadow-cyan-500/20">
            <svg class="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
          </div>
          <h1 class="text-3xl font-extrabold text-white">Initial Diagnostic Assessment</h1>
          <p class="text-slate-300 text-sm mt-2">
            Establish your knowledge baseline across Java syntax, control flow, and data structures.
            Your results calibrate the Intelligent Learner Model and personalize the Concept Knowledge Graph.
          </p>
        </div>

        <div class="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-slate-800">
          <div class="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-center">
            <div class="text-xs text-slate-400 uppercase font-semibold">Questions</div>
            <div class="text-xl font-bold text-white mt-1">8 Multi-Topic</div>
          </div>
          <div class="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-center">
            <div class="text-xs text-slate-400 uppercase font-semibold">Time Limit</div>
            <div class="text-xl font-bold text-cyan-400 mt-1">10 Minutes</div>
          </div>
          <div class="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-center">
            <div class="text-xs text-slate-400 uppercase font-semibold">Format</div>
            <div class="text-xl font-bold text-indigo-400 mt-1">Adaptive MCQ + Code</div>
          </div>
        </div>

        <div class="mt-8 flex justify-center">
          <button 
            onclick="window.App.startDiagnosticTest()" 
            class="px-8 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-white font-bold text-sm shadow-xl shadow-cyan-500/30 hover:scale-105 active:scale-95 transition-all">
            Begin Diagnostic Assessment Now →
          </button>
        </div>
      </div>
    </div>
  `;
}

function renderDiagnosticTesting(dc) {
  const q = dc.questions[dc.currentIndex];
  const selectedOpt = dc.answers[dc.currentIndex];
  const confidence = dc.confidenceLevels[dc.currentIndex] || "Medium";

  return `
    <div class="max-w-4xl mx-auto px-4 py-8 space-y-6">
      
      <!-- Top Test Header -->
      <div class="glass-card p-4 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <span class="text-xs font-bold text-cyan-400 uppercase tracking-widest">Diagnostic Question ${dc.currentIndex + 1} of ${dc.questions.length}</span>
          <span class="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300">${q.difficulty}</span>
        </div>
        
        <div class="flex items-center gap-4">
          <div class="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-900 border border-cyan-500/30 text-cyan-300 font-mono text-xs font-bold">
            <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 14 14"></polyline></svg>
            <span id="diag-timer-display">10:00</span>
          </div>
        </div>
      </div>

      <!-- Question Card -->
      <div class="glass-card p-6 sm:p-8 space-y-6">
        <div>
          <h2 class="text-lg font-bold text-white">${q.title}</h2>
          <p class="text-sm text-slate-300 mt-2">${q.prompt}</p>
        </div>

        ${q.code ? `
          <div class="rounded-xl bg-slate-950 p-4 border border-slate-800 font-mono text-xs text-cyan-300 overflow-x-auto">
            <pre><code>${escapeHtml(q.code)}</code></pre>
          </div>
        ` : ''}

        <!-- Options -->
        <div class="space-y-3">
          ${q.options.map((opt, oIdx) => `
            <div 
              onclick="window.App.diagnosticSelectOption(${oIdx})"
              class="p-4 rounded-xl border text-xs sm:text-sm font-medium cursor-pointer transition-all ${
                selectedOpt === oIdx 
                  ? 'bg-cyan-950/60 border-cyan-400 text-cyan-200 shadow-md shadow-cyan-500/10' 
                  : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-900'
              }">
              <div class="flex items-start gap-3">
                <span class="w-6 h-6 rounded-full border flex items-center justify-center shrink-0 text-xs font-bold ${
                  selectedOpt === oIdx ? 'border-cyan-400 bg-cyan-500 text-slate-950' : 'border-slate-700 text-slate-400'
                }">
                  ${String.fromCharCode(65 + oIdx)}
                </span>
                <span class="mt-0.5 leading-relaxed">${opt.text}</span>
              </div>
            </div>
          `).join('')}
        </div>

        <!-- Confidence Selector -->
        <div class="pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>Confidence in your answer:</span>
          <div class="flex gap-2">
            ${['Low', 'Medium', 'High'].map(c => `
              <button 
                onclick="window.App.diagnosticSetConfidence('${c}')"
                class="px-2.5 py-1 rounded-lg text-xs font-semibold border ${
                  confidence === c ? 'bg-indigo-600 text-white border-indigo-500' : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                }">
                ${c}
              </button>
            `).join('')}
          </div>
        </div>

        <!-- Navigation Buttons -->
        <div class="flex items-center justify-between pt-4 border-t border-slate-800">
          <button 
            onclick="window.App.diagnosticPrev()"
            ${dc.currentIndex === 0 ? 'disabled' : ''}
            class="px-4 py-2 rounded-xl bg-slate-900 text-slate-300 border border-slate-800 text-xs font-semibold disabled:opacity-30 disabled:cursor-not-allowed">
            ← Previous
          </button>

          ${dc.currentIndex === dc.questions.length - 1 ? `
            <button 
              onclick="window.App.diagnosticSubmit()"
              class="px-6 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/20 transition-all">
              Submit Assessment & Generate Report ✓
            </button>
          ` : `
            <button 
              onclick="window.App.diagnosticNext()"
              class="px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-md shadow-cyan-600/20 transition-all">
              Next Question →
            </button>
          `}
        </div>

      </div>

    </div>
  `;
}

function renderDiagnosticReport(dc) {
  const rep = dc.reportData;
  if (!rep) return '';

  return `
    <div class="max-w-4xl mx-auto px-4 py-10 space-y-8">
      
      <!-- Report Header Card -->
      <div class="glass-card p-8 border border-cyan-500/30 text-center relative overflow-hidden">
        <span class="text-xs font-bold text-cyan-400 uppercase tracking-widest">Diagnostic Report</span>
        <h1 class="text-3xl font-extrabold text-white mt-1">Initial Knowledge Assessment Complete!</h1>
        
        <div class="mt-6 flex justify-center items-center gap-8">
          <div>
            <div class="text-4xl font-extrabold text-cyan-400 font-mono">${rep.scorePct}%</div>
            <div class="text-xs text-slate-400 mt-1">Accuracy (${rep.correctCount}/${rep.totalQuestions})</div>
          </div>
          <div class="h-10 w-[1px] bg-slate-800"></div>
          <div>
            <div class="text-2xl font-extrabold text-indigo-400 font-mono">${rep.startingLevel}</div>
            <div class="text-xs text-slate-400 mt-1">Recommended Starting Track</div>
          </div>
        </div>

        <p class="text-xs sm:text-sm text-slate-300 mt-6 max-w-xl mx-auto">
          We have initialized your Concept Knowledge Graph and activated the Bayesian Learner Model. 
          Your prioritized weak areas have been scheduled for adaptive drills and spaced repetition!
        </p>

        <div class="mt-8 flex justify-center gap-4">
          <button 
            onclick="window.App.diagnosticFinish()"
            class="px-7 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-white font-bold text-xs shadow-xl shadow-cyan-500/25 hover:scale-105 transition-all">
            Open Concept Knowledge Graph →
          </button>
        </div>
      </div>

    </div>
  `;
}

function escapeHtml(text) {
  if (!text) return '';
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
