// LearnIQ Adaptive Practice Arena Component
import { store } from '../state.js';
import { adaptiveEngine } from '../adaptiveEngine.js';
import { LearnerModelEngine } from '../learnerModel.js';
import { MisconceptionEngine } from '../misconceptionEngine.js';
import { sound } from '../soundFx.js';
import { SYLLABUS_CONCEPTS } from '../config.js';

class PracticeArenaState {
  constructor() {
    this.currentQuestion = null;
    this.selectedOption = null;
    this.studentReasoning = "";
    this.confidence = "Medium";
    this.isSubmitted = false;
    this.revealedHintLevel = 0; // 0: none, 1: hint1, 2: hint2
    this.startTime = Date.now();
    this.lastResult = null;
    this.detectedMisconception = null;
    this.difficultyAdjustmentMessage = null;
    this.targetConceptId = null;
  }

  async loadQuestion(conceptId = null) {
    this.targetConceptId = conceptId;
    this.selectedOption = null;
    this.studentReasoning = "";
    this.confidence = "Medium";
    this.isSubmitted = false;
    this.revealedHintLevel = 0;
    this.lastResult = null;
    this.detectedMisconception = null;
    this.difficultyAdjustmentMessage = null;
    this.startTime = Date.now();

    this.currentQuestion = await adaptiveEngine.getNextQuestion(conceptId);
    store.notify();
  }

  selectOption(idx) {
    if (this.isSubmitted) return;
    this.selectedOption = idx;
    sound.playClick();
    store.notify();
  }

  setConfidence(conf) {
    if (this.isSubmitted) return;
    this.confidence = conf;
    store.notify();
  }

  revealNextHint() {
    if (this.revealedHintLevel < 2) {
      this.revealedHintLevel++;
      sound.playClick();
      store.notify();
    }
  }

  submitAnswer() {
    if (this.selectedOption === null || !this.currentQuestion || this.isSubmitted) return;

    const timeSpent = Math.max(5, Math.round((Date.now() - this.startTime) / 1000));
    const chosenOption = this.currentQuestion.options[this.selectedOption];
    const isCorrect = chosenOption.isCorrect;

    // 1. Update Learner Model
    const result = LearnerModelEngine.recordAttempt({
      conceptId: this.currentQuestion.conceptId,
      isCorrect,
      difficulty: this.currentQuestion.difficulty,
      timeTakenSec: timeSpent,
      confidence: this.confidence,
      questionId: this.currentQuestion.id,
      studentReasoning: this.studentReasoning
    });
    this.lastResult = result;
    this.isSubmitted = true;

    if (isCorrect) {
      sound.playCorrect();
      // Check if difficulty steps up
      if (result.newMastery >= 75 && this.currentQuestion.difficulty !== "Hard") {
        this.difficultyAdjustmentMessage = "Mastery Level Up! Dynamic difficulty adjusted up to Hard questions.";
      }
    } else {
      sound.playIncorrect();
      // 2. Trigger Misconception Detection
      this.detectedMisconception = MisconceptionEngine.diagnose({
        question: this.currentQuestion,
        selectedOptionIndex: this.selectedOption,
        studentReasoning: this.studentReasoning
      });

      if (result.consecutiveMistakes >= 2) {
        this.difficultyAdjustmentMessage = "Scaffold Alert: Providing foundation-strengthening questions and progressive hints.";
      }
    }

    store.notify();
  }
}

export const practiceState = new PracticeArenaState();

export function renderPracticeView() {
  const ps = practiceState;
  const q = ps.currentQuestion;

  if (!q) {
    return `
      <div class="max-w-4xl mx-auto px-4 py-16 text-center">
        <div class="glass-card p-8">
          <div class="animate-spin w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p class="text-sm text-slate-300">Generating adaptive question aligned with your learner model...</p>
        </div>
      </div>
    `;
  }

  const conceptName = (SYLLABUS_CONCEPTS.find(c => c.id === q.conceptId) || {}).name || q.conceptId;

  return `
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      <!-- Top Arena Header -->
      <div class="glass-card p-5 flex flex-wrap items-center justify-between gap-4 border border-cyan-500/20">
        <div>
          <div class="flex items-center gap-2">
            <span class="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800">
              ${q.isAiGenerated ? 'Gemini AI' : 'Adaptive Bank'}
            </span>
            <span class="text-xs font-semibold text-slate-300">${conceptName}</span>
          </div>
          <h1 class="text-xl font-extrabold text-white mt-1">${q.title}</h1>
        </div>

        <div class="flex items-center gap-2">
          <span class="text-xs px-2.5 py-1 rounded-lg font-bold ${
            q.difficulty === 'Hard' ? 'bg-rose-950 text-rose-400 border border-rose-800' :
            q.difficulty === 'Medium' ? 'bg-amber-950 text-amber-400 border border-amber-800' :
            'bg-emerald-950 text-emerald-400 border border-emerald-800'
          }">
            ${q.difficulty} Level
          </span>
          <button onclick="window.App.startAdaptivePractice()" class="px-3 py-1 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-300 hover:text-white" title="Pick another random question">
            Skip / Next ↻
          </button>
        </div>
      </div>

      <!-- Question & Code Card -->
      <div class="glass-card p-6 sm:p-8 space-y-6">
        <div>
          <p class="text-sm sm:text-base text-slate-200 leading-relaxed">${q.prompt}</p>
        </div>

        ${q.code ? `
          <div class="rounded-xl bg-slate-950 p-4 border border-slate-800 font-mono text-xs sm:text-sm text-cyan-300 overflow-x-auto shadow-inner">
            <pre><code>${escapeHtml(q.code)}</code></pre>
          </div>
        ` : ''}

        <!-- Progressive Hints Section -->
        <div>
          <div class="flex items-center justify-between mb-2">
            <span class="text-xs font-bold text-slate-400 uppercase tracking-wider">Scaffolded Hints</span>
            ${!ps.isSubmitted && ps.revealedHintLevel < 2 ? `
              <button 
                onclick="window.App.practiceRevealHint()" 
                class="text-xs text-amber-400 hover:underline flex items-center gap-1 font-semibold">
                <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
                <span>Reveal ${ps.revealedHintLevel === 0 ? 'Conceptual Clue (Hint 1)' : 'Algorithmic Hint (Hint 2)'}</span>
              </button>
            ` : ''}
          </div>

          ${ps.revealedHintLevel >= 1 ? `
            <div class="p-3 rounded-xl bg-amber-950/30 border border-amber-800/40 text-xs text-amber-200 mb-2">
              <strong>Hint 1:</strong> ${q.hint1}
            </div>
          ` : ''}

          ${ps.revealedHintLevel >= 2 ? `
            <div class="p-3 rounded-xl bg-amber-950/50 border border-amber-700/60 text-xs text-amber-100">
              <strong>Hint 2:</strong> ${q.hint2}
            </div>
          ` : ''}
        </div>

        <!-- Options List -->
        <div class="space-y-3">
          <div class="text-xs font-bold text-slate-400 uppercase tracking-wider">Select Your Answer</div>
          ${q.options.map((opt, oIdx) => {
            const isSelected = ps.selectedOption === oIdx;
            let optStyle = "bg-slate-900/70 border-slate-800 text-slate-300 hover:border-slate-700";

            if (ps.isSubmitted) {
              if (opt.isCorrect) {
                optStyle = "bg-emerald-950/70 border-emerald-500 text-emerald-200 shadow-lg shadow-emerald-500/10";
              } else if (isSelected && !opt.isCorrect) {
                optStyle = "bg-rose-950/70 border-rose-500 text-rose-200 shadow-lg shadow-rose-500/10";
              }
            } else if (isSelected) {
              optStyle = "bg-cyan-950/60 border-cyan-400 text-cyan-200 shadow-md shadow-cyan-500/10";
            }

            return `
              <div 
                onclick="window.App.practiceSelectOption(${oIdx})"
                class="p-4 rounded-xl border text-xs sm:text-sm font-medium cursor-pointer transition-all ${optStyle}">
                <div class="flex items-start gap-3">
                  <span class="w-6 h-6 rounded-full border flex items-center justify-center shrink-0 text-xs font-bold ${
                    isSelected ? 'border-cyan-400 bg-cyan-500 text-slate-950' : 'border-slate-700 text-slate-400'
                  }">
                    ${String.fromCharCode(65 + oIdx)}
                  </span>
                  <div class="grow">
                    <div class="leading-relaxed">${opt.text}</div>
                    ${ps.isSubmitted ? `
                      <div class="mt-2 pt-2 border-t border-slate-800 text-xs ${opt.isCorrect ? 'text-emerald-300' : 'text-slate-400'}">
                        <strong>${opt.isCorrect ? '✓ Why this is correct: ' : '✗ Why this is incorrect: '}</strong>
                        ${opt.reason}
                      </div>
                    ` : ''}
                  </div>
                </div>
              </div>
            `;
          }).join('')}
        </div>

        <!-- Student Reasoning Input (For Misconception Detection) -->
        ${!ps.isSubmitted ? `
          <div class="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
            <div class="flex items-center justify-between text-xs">
              <label for="student-reasoning-input" class="font-semibold text-slate-300 flex items-center gap-1.5">
                <svg class="w-4 h-4 text-cyan-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                <span>Explain your thinking / reasoning (Optional, helps AI detect misconceptions):</span>
              </label>
            </div>
            <textarea 
              id="student-reasoning-input"
              rows="2"
              placeholder="e.g., I picked this because I assumed the recursion would terminate automatically..."
              oninput="window.App.practiceSetReasoning(this.value)"
              class="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500">${ps.studentReasoning}</textarea>
          </div>
        ` : ''}

        <!-- Confidence Selector & Submit Row -->
        ${!ps.isSubmitted ? `
          <div class="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4">
            <div class="flex items-center gap-2 text-xs text-slate-400">
              <span>Confidence:</span>
              <div class="flex gap-1.5">
                ${['Low', 'Medium', 'High'].map(c => `
                  <button 
                    onclick="window.App.practiceSetConfidence('${c}')"
                    class="px-2.5 py-1 rounded-lg text-xs font-semibold border ${
                      ps.confidence === c ? 'bg-indigo-600 text-white border-indigo-500' : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                    }">
                    ${c}
                  </button>
                `).join('')}
              </div>
            </div>

            <button 
              onclick="window.App.practiceSubmit()"
              ${ps.selectedOption === null ? 'disabled' : ''}
              class="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-white font-bold text-xs shadow-lg shadow-cyan-500/25 hover:scale-105 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed transition-all">
              Submit Answer & Evaluate
            </button>
          </div>
        ` : ''}

      </div>

      <!-- RESULTS & MISCONCEPTION DETECTION DRAWER -->
      ${ps.isSubmitted ? renderResultsPanel(ps) : ''}

    </div>
  `;
}

function renderResultsPanel(ps) {
  const res = ps.lastResult;
  if (!res) return '';
  const isCorrect = res?.isCorrect;
  const misc = ps.detectedMisconception;

  return `
    <div class="glass-card p-6 sm:p-8 space-y-6 border ${isCorrect ? 'border-emerald-500/40 bg-emerald-950/10' : 'border-rose-500/40 bg-rose-950/10'} animate-in fade-in slide-in-from-bottom-4 duration-300">
      
      <!-- Banner -->
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl ${isCorrect ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'} flex items-center justify-center font-bold">
            ${isCorrect ? '✓' : '✗'}
          </div>
          <div>
            <h3 class="text-lg font-bold text-white">${isCorrect ? 'Correct Answer!' : 'Incorrect – Root Misconception Identified'}</h3>
            <p class="text-xs text-slate-300">
              Mastery Score updated: <strong class="text-white">${res.oldMastery}%</strong> → <strong class="${isCorrect ? 'text-emerald-400' : 'text-rose-400'}">${res.newMastery}%</strong> (${res.delta >= 0 ? '+' : ''}${res.delta}%)
            </p>
          </div>
        </div>

        <div class="text-right">
          <span class="text-xs font-bold text-amber-400 font-mono">+${res.xpEarned} XP</span>
        </div>
      </div>

      <!-- Difficulty Adjustment Alert -->
      ${ps.difficultyAdjustmentMessage ? `
        <div class="p-3 rounded-xl bg-indigo-950/50 border border-indigo-700/50 text-xs text-indigo-200 flex items-center gap-2">
          <span>⚡ ${ps.difficultyAdjustmentMessage}</span>
        </div>
      ` : ''}

      <!-- Detailed Misconception Diagnostic Card (If Incorrect) -->
      ${misc ? `
        <div class="p-5 rounded-2xl bg-slate-900/90 border border-rose-500/40 space-y-4">
          <div class="flex items-center justify-between border-b border-slate-800 pb-3">
            <div class="flex items-center gap-2">
              <span class="text-xs font-bold text-rose-400 uppercase tracking-widest">Why You Made This Mistake</span>
              <span class="text-xs px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800">${misc.severity}</span>
            </div>
            <span class="text-[11px] text-slate-400">Added to Revision Queue (SM-2)</span>
          </div>

          <h4 class="text-base font-bold text-white">${misc.title}</h4>
          <p class="text-xs text-slate-300 leading-relaxed">${misc.explanation}</p>

          <!-- Side-by-side Counterexample -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div class="rounded-xl bg-slate-950 p-3 border border-rose-900/60 font-mono text-[11px] text-rose-300">
              <div class="text-[10px] text-rose-400 font-bold uppercase mb-1">Flawed Execution:</div>
              <pre><code>${escapeHtml(misc.counterExample?.incorrectCode || '')}</code></pre>
            </div>
            <div class="rounded-xl bg-slate-950 p-3 border border-emerald-900/60 font-mono text-[11px] text-emerald-300">
              <div class="text-[10px] text-emerald-400 font-bold uppercase mb-1">Corrected Execution:</div>
              <pre><code>${escapeHtml(misc.counterExample?.correctCode || '')}</code></pre>
            </div>
          </div>

          <div class="text-xs text-cyan-300 bg-cyan-950/40 p-2.5 rounded-lg border border-cyan-800/40">
            <strong>Code Trace:</strong> ${misc.counterExample?.trace || ''}
          </div>
        </div>
      ` : ''}

      <!-- Next Actions -->
      <div class="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-800">
        <button 
          onclick="window.App.askTutor('Can you explain this problem and my mistake in simple terms?')"
          class="px-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 hover:text-white text-xs font-semibold flex items-center gap-2">
          <span>Ask Socrates AI Tutor →</span>
        </button>

        <div class="flex items-center gap-3">
          <button 
            onclick="window.App.navigate('graph')"
            class="px-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 text-xs font-semibold hover:text-white">
            View Graph Update
          </button>
          <button 
            onclick="window.App.startAdaptivePractice('${ps.currentQuestion.conceptId}')"
            class="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-white font-bold text-xs shadow-lg shadow-cyan-500/25 hover:scale-105 transition-all">
            Next Adaptive Question →
          </button>
        </div>
      </div>

    </div>
  `;
}

function escapeHtml(text) {
  if (!text) return '';
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
