// AptiLearn AI Real Exam Simulator Component
import { store } from '../state.js';
import { QUESTION_BANK } from '../questionBank.js';
import { sound } from '../soundFx.js';

class ExamSimulatorController {
  constructor() {
    this.status = "idle"; // 'idle', 'in_exam', 'results'
    this.durationSec = 900; // 15 mins default mock
    this.timeRemainingSec = 900;
    this.timerInterval = null;
    this.currentIndex = 0;
    this.negativeMarking = true; // -0.25 on wrong
    
    // Pick 6 comprehensive questions across syllabus
    this.questions = QUESTION_BANK.slice(0, 6);
    this.answers = {}; // qIndex -> optionIndex
    this.reviewFlags = {}; // qIndex -> boolean
    this.results = null;
  }

  startExam(timed = true) {
    this.status = "in_exam";
    this.currentIndex = 0;
    this.answers = {};
    this.reviewFlags = {};
    this.timeRemainingSec = 900;
    this.results = null;

    if (timed) {
      if (this.timerInterval) clearInterval(this.timerInterval);
      this.timerInterval = setInterval(() => {
        if (this.timeRemainingSec > 0) {
          this.timeRemainingSec--;
          const el = document.getElementById("exam-timer-display");
          if (el) {
            const m = Math.floor(this.timeRemainingSec / 60);
            const s = this.timeRemainingSec % 60;
            el.innerText = `${m}:${s < 10 ? '0' : ''}${s}`;
          }
        } else {
          clearInterval(this.timerInterval);
          this.submitExam();
        }
      }, 1000);
    }

    sound.playClick();
    window.App.render();
  }

  selectOption(optIdx) {
    this.answers[this.currentIndex] = optIdx;
    sound.playClick();
    window.App.render();
  }

  toggleReviewFlag() {
    this.reviewFlags[this.currentIndex] = !this.reviewFlags[this.currentIndex];
    sound.playClick();
    window.App.render();
  }

  goToQuestion(idx) {
    if (idx >= 0 && idx < this.questions.length) {
      this.currentIndex = idx;
      window.App.render();
    }
  }

  nextQuestion() {
    if (this.currentIndex < this.questions.length - 1) {
      this.currentIndex++;
      window.App.render();
    }
  }

  prevQuestion() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      window.App.render();
    }
  }

  submitExam() {
    if (this.timerInterval) clearInterval(this.timerInterval);

    let correctCount = 0;
    let incorrectCount = 0;
    let unattemptedCount = 0;
    let rawScore = 0;

    this.questions.forEach((q, idx) => {
      const selected = this.answers[idx];
      if (selected === undefined) {
        unattemptedCount++;
      } else if (q.options[selected]?.isCorrect) {
        correctCount++;
        rawScore += 1.0;
      } else {
        incorrectCount++;
        rawScore -= (this.negativeMarking ? 0.25 : 0);
      }
    });

    const totalQuestions = this.questions.length;
    const accuracy = correctCount + incorrectCount > 0 
      ? Math.round((correctCount / (correctCount + incorrectCount)) * 100) 
      : 0;

    this.results = {
      rawScore: Math.max(0, Math.round(rawScore * 100) / 100),
      maxScore: totalQuestions,
      correctCount,
      incorrectCount,
      unattemptedCount,
      accuracy,
      negativeDeduction: Math.round(incorrectCount * 0.25 * 100) / 100,
      submittedAt: new Date().toLocaleTimeString()
    };

    this.status = "results";
    store.addXp(120, "Completed Full Simulated Mock Exam");
    store.unlockBadge("exam_warrior");
    sound.playLevelUp();
    window.App.render();
  }

  exitExam() {
    if (this.timerInterval) clearInterval(this.timerInterval);
    this.status = "idle";
    window.App.render();
  }
}

export const examController = new ExamSimulatorController();

export function renderExamSimulatorView() {
  const ec = examController;

  if (ec.status === "idle") {
    return renderExamLobby(ec);
  } else if (ec.status === "in_exam") {
    return renderExamActive(ec);
  } else {
    return renderExamResults(ec);
  }
}

function renderExamLobby(ec) {
  return `
    <div class="max-w-4xl mx-auto px-4 py-12 space-y-8">
      
      <div class="glass-card p-8 border border-indigo-500/30 text-center space-y-6">
        <div class="w-16 h-16 rounded-2xl bg-indigo-500/20 text-indigo-400 mx-auto flex items-center justify-center font-bold text-2xl shadow-lg shadow-indigo-500/20">
          ⏱️
        </div>

        <div>
          <span class="text-xs font-bold text-indigo-400 uppercase tracking-widest">High-Stakes Examination Environment</span>
          <h1 class="text-3xl font-extrabold text-white light:text-slate-900 mt-1">Real Exam Simulator (Java & DSA Mock Bar)</h1>
          <p class="text-xs sm:text-sm text-slate-300 light:text-slate-600 mt-2 max-w-xl mx-auto leading-relaxed">
            Experience realistic exam conditions: countdown pressure, question navigation grid, mark-for-review flags, negative marking deductions, and detailed post-test score analysis.
          </p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center max-w-2xl mx-auto pt-4 border-t border-slate-800">
          <div class="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
            <div class="text-[10px] text-slate-400 uppercase font-semibold">Total Questions</div>
            <div class="text-xl font-bold text-white mt-1">6 Multi-Topic</div>
          </div>
          <div class="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
            <div class="text-[10px] text-slate-400 uppercase font-semibold">Time Limit</div>
            <div class="text-xl font-bold text-cyan-400 mt-1">15 Minutes</div>
          </div>
          <div class="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
            <div class="text-[10px] text-slate-400 uppercase font-semibold">Marking Scheme</div>
            <div class="text-xl font-bold text-rose-400 mt-1">+1.0 / -0.25</div>
          </div>
        </div>

        <div class="flex justify-center gap-4 pt-4">
          <button 
            onclick="window.App.startSimulatedExam(true)"
            class="px-8 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-white font-bold text-sm shadow-xl shadow-cyan-500/25 hover:scale-105 active:scale-95 transition-all">
            Launch Mock Exam Now →
          </button>
        </div>
      </div>

    </div>
  `;
}

function renderExamActive(ec) {
  const q = ec.questions[ec.currentIndex];
  const selectedOpt = ec.answers[ec.currentIndex];
  const isFlagged = ec.reviewFlags[ec.currentIndex];

  return `
    <div class="max-w-6xl mx-auto px-4 py-6 space-y-6">
      
      <!-- Top Exam Bar with Countdown Timer & Controls -->
      <div class="glass-card p-4 border border-indigo-500/30 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <span class="text-xs font-bold text-white light:text-slate-900">Question ${ec.currentIndex + 1} of ${ec.questions.length}</span>
          <span class="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">${q.difficulty}</span>
        </div>

        <div class="flex items-center gap-4">
          <div class="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-900 border border-cyan-500/40 text-cyan-300 font-mono text-xs font-extrabold">
            <span>⏱️ Time:</span>
            <span id="exam-timer-display">15:00</span>
          </div>

          <button 
            onclick="window.App.submitSimulatedExam()"
            class="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md">
            Finish & Submit Exam ✓
          </button>
        </div>
      </div>

      <!-- Main Layout: Question Left (3 Cols), Palette Right (1 Col) -->
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        <!-- Left: Question Card -->
        <div class="lg:col-span-3 glass-card p-6 sm:p-8 space-y-6 border border-slate-800">
          <div>
            <h3 class="text-base font-bold text-white light:text-slate-900 leading-snug">${q.title}</h3>
            <p class="text-xs sm:text-sm text-slate-200 light:text-slate-700 mt-2 leading-relaxed">${q.prompt}</p>
          </div>

          ${q.code ? `
            <div class="rounded-xl bg-slate-950 p-4 border border-slate-800 font-mono text-xs text-cyan-300 overflow-x-auto">
              <pre><code>${q.code}</code></pre>
            </div>
          ` : ''}

          <!-- Options -->
          <div class="space-y-3">
            ${q.options.map((opt, oIdx) => `
              <div 
                onclick="window.App.examSelectOption(${oIdx})"
                class="p-4 rounded-xl border text-xs sm:text-sm font-medium cursor-pointer transition-all ${
                  selectedOpt === oIdx 
                    ? 'bg-cyan-950/60 border-cyan-400 text-cyan-200 shadow-md' 
                    : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700'
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

          <!-- Bottom Action Buttons -->
          <div class="flex items-center justify-between pt-4 border-t border-slate-800">
            <button 
              onclick="window.App.examToggleReview()"
              class="px-3.5 py-2 rounded-xl text-xs font-semibold border ${
                isFlagged ? 'bg-amber-950 text-amber-300 border-amber-600' : 'bg-slate-900 text-slate-300 border-slate-800'
              }">
              ${isFlagged ? '★ Flagged for Review' : '☆ Mark for Review'}
            </button>

            <div class="flex items-center gap-2">
              <button 
                onclick="window.App.examPrev()" 
                ${ec.currentIndex === 0 ? 'disabled' : ''}
                class="px-4 py-2 rounded-xl bg-slate-900 text-slate-300 border border-slate-800 text-xs font-semibold disabled:opacity-30">
                ← Previous
              </button>
              <button 
                onclick="window.App.examNext()" 
                ${ec.currentIndex === ec.questions.length - 1 ? 'disabled' : ''}
                class="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold disabled:opacity-30">
                Save & Next →
              </button>
            </div>
          </div>

        </div>

        <!-- Right: Question Navigation Palette -->
        <div class="lg:col-span-1 glass-card p-5 border border-slate-800 space-y-4">
          <div class="text-xs font-bold text-slate-400 uppercase tracking-wider">Question Palette</div>
          
          <div class="grid grid-cols-3 gap-2">
            ${ec.questions.map((_, idx) => {
              const isAns = ec.answers[idx] !== undefined;
              const isRev = ec.reviewFlags[idx];
              const isCurr = ec.currentIndex === idx;

              let btnStyle = "bg-slate-900 text-slate-400 border-slate-800";
              if (isCurr) btnStyle = "border-white ring-2 ring-cyan-500 text-white";
              else if (isRev) btnStyle = "bg-amber-950/80 text-amber-300 border-amber-600";
              else if (isAns) btnStyle = "bg-emerald-950/80 text-emerald-300 border-emerald-600";

              return `
                <button 
                  onclick="window.App.examGoTo(${idx})"
                  class="py-2.5 rounded-lg border text-xs font-mono font-bold transition-all ${btnStyle}">
                  ${idx + 1}
                </button>
              `;
            }).join('')}
          </div>

          <div class="pt-3 border-t border-slate-800 space-y-1.5 text-[11px] text-slate-400">
            <div class="flex items-center gap-2">
              <span class="w-3 h-3 rounded bg-emerald-500"></span>
              <span>Answered</span>
            </div>
            <div class="flex items-center gap-2">
              <span class="w-3 h-3 rounded bg-amber-500"></span>
              <span>Marked for Review</span>
            </div>
            <div class="flex items-center gap-2">
              <span class="w-3 h-3 rounded bg-slate-800"></span>
              <span>Unattempted</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  `;
}

function renderExamResults(ec) {
  const r = ec.results;
  if (!r) return '';

  return `
    <div class="max-w-4xl mx-auto px-4 py-10 space-y-8">
      
      <!-- Results Card -->
      <div class="glass-card p-8 border border-emerald-500/30 text-center space-y-6">
        <span class="text-xs font-bold text-emerald-400 uppercase tracking-widest">Mock Exam Completed</span>
        <h1 class="text-3xl font-extrabold text-white light:text-slate-900">Score & Performance Analysis</h1>

        <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-800">
          <div class="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
            <div class="text-[10px] text-slate-400 uppercase font-semibold">Raw Score</div>
            <div class="text-2xl font-extrabold text-cyan-400 font-mono mt-1">${r.rawScore} / ${r.maxScore}</div>
          </div>
          <div class="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
            <div class="text-[10px] text-slate-400 uppercase font-semibold">Cognitive Accuracy</div>
            <div class="text-2xl font-extrabold text-emerald-400 font-mono mt-1">${r.accuracy}%</div>
          </div>
          <div class="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
            <div class="text-[10px] text-slate-400 uppercase font-semibold">Negative Deduction</div>
            <div class="text-2xl font-extrabold text-rose-400 font-mono mt-1">-${r.negativeDeduction}</div>
          </div>
          <div class="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
            <div class="text-[10px] text-slate-400 uppercase font-semibold">XP Earned</div>
            <div class="text-2xl font-extrabold text-amber-400 font-mono mt-1">+120 XP</div>
          </div>
        </div>

        <div class="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 text-left space-y-2">
          <div class="font-bold text-white flex items-center gap-1.5">
            <span>💡 AI Exam Feedback:</span>
          </div>
          <p>
            You performed strongly in syntax and control flow. However, deductions occurred on recursive call-stack limits. 
            Reviewing your <strong>Personal Mistake Notebook</strong> will prevent this penalty on actual exam day!
          </p>
        </div>

        <div class="flex justify-center gap-4 pt-2">
          <button 
            onclick="window.App.exitExamSimulator()"
            class="px-6 py-2.5 rounded-xl bg-slate-800 text-white text-xs font-bold hover:bg-slate-700">
            Back to Dashboard
          </button>
          <button 
            onclick="window.App.navigate('misconceptions')"
            class="px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-md">
            Review Mistakes in Notebook →
          </button>
        </div>
      </div>

    </div>
  `;
}
