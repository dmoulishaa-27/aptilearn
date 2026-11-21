// LearnIQ Spaced Repetition Revision Center Component (SuperMemo SM-2)
import { store } from '../state.js';
import { SpacedRepetitionScheduler } from '../spacedRepetition.js';
import { sound } from '../soundFx.js';

class RevisionSessionController {
  constructor() {
    this.activeCard = null;
    this.showAnswer = false;
  }

  startReview(card) {
    this.activeCard = card;
    this.showAnswer = false;
    sound.playClick();
    store.notify();
  }

  flipCard() {
    this.showAnswer = true;
    sound.playClick();
    store.notify();
  }

  rateRecall(quality) {
    if (!this.activeCard) return;
    SpacedRepetitionScheduler.processReview(this.activeCard.id, quality);
    sound.playCorrect();
    this.activeCard = null;
    this.showAnswer = false;
    store.notify();
  }

  closeModal() {
    this.activeCard = null;
    this.showAnswer = false;
    store.notify();
  }
}

export const revisionController = new RevisionSessionController();

export function renderRevisionView() {
  const user = store.currentUser;
  const { dueToday, upcoming } = SpacedRepetitionScheduler.getQueuePartition(user);
  const activeReview = revisionController.activeCard;

  return `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      <!-- Revision Header -->
      <div class="glass-card p-6 sm:p-8 border border-amber-500/25 bg-gradient-to-r from-slate-900/90 via-amber-950/20 to-slate-900/90 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div class="flex items-center gap-2">
            <span class="text-xs uppercase font-bold tracking-widest text-amber-400">Memory Consolidation</span>
            <span class="text-slate-500">•</span>
            <span class="text-xs text-slate-300">SuperMemo SM-2 Algorithm</span>
          </div>
          <h1 class="text-2xl sm:text-3xl font-extrabold text-white mt-1">Spaced Repetition Center</h1>
          <p class="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
            Combat the Ebbinghaus Forgetting Curve. High-yield concept retrieval scheduled right before memory decay occurs.
          </p>
        </div>

        <div class="flex items-center gap-4">
          <div class="p-3 rounded-2xl bg-amber-950/50 border border-amber-800/60 text-center min-w-[100px]">
            <div class="text-2xl font-extrabold text-amber-400 font-mono">${dueToday.length}</div>
            <div class="text-[10px] text-slate-400 uppercase font-semibold">Due Today</div>
          </div>
          <div class="p-3 rounded-2xl bg-slate-900 border border-slate-800 text-center min-w-[100px]">
            <div class="text-2xl font-extrabold text-indigo-400 font-mono">${upcoming.length}</div>
            <div class="text-[10px] text-slate-400 uppercase font-semibold">Upcoming</div>
          </div>
        </div>
      </div>

      <!-- TODAY'S REVISION QUEUE -->
      <div class="space-y-4">
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-bold text-white flex items-center gap-2">
            <span class="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse"></span>
            <span>Today's Active Retrieval Tasks (${dueToday.length})</span>
          </h3>
          <span class="text-xs text-slate-400 font-mono">Prioritizes past incorrect concepts</span>
        </div>

        ${dueToday.length === 0 ? `
          <div class="glass-card p-8 text-center text-slate-400 border border-slate-800">
            <svg class="w-12 h-12 text-emerald-400 mx-auto mb-2 opacity-80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 14 14"></polyline></svg>
            <p class="font-semibold text-white">All Caught Up for Today!</p>
            <p class="text-xs mt-1">No pending memory decays. Check back tomorrow or launch an adaptive practice drill.</p>
          </div>
        ` : `
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            ${dueToday.map(card => `
              <div class="glass-card p-5 border border-amber-500/30 bg-slate-900/90 flex flex-col justify-between hover:border-amber-400 transition-all">
                <div>
                  <div class="flex items-center justify-between text-xs mb-2">
                    <span class="text-[10px] px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800 font-semibold">Due Today</span>
                    <span class="text-slate-400 font-mono text-[11px]">Interval: ${card.intervalDays}d</span>
                  </div>
                  <h4 class="font-bold text-white text-sm mt-1">${card.title}</h4>
                  <p class="text-xs text-slate-300 mt-2 line-clamp-3">${card.prompt}</p>
                </div>

                <div class="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
                  <span class="text-[10px] text-slate-400">Repetition #${card.repetition || 0}</span>
                  <button 
                    onclick="window.App.startRevisionCard('${card.id}')"
                    class="px-4 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20 transition-all">
                    Review Flashcard →
                  </button>
                </div>
              </div>
            `).join('')}
          </div>
        `}
      </div>

      <!-- UPCOMING REVISION CALENDAR -->
      <div class="space-y-4 pt-6 border-t border-slate-800">
        <h3 class="text-base font-bold text-white flex items-center gap-2">
          <span>Upcoming Scheduled Reviews (${upcoming.length})</span>
        </h3>

        <div class="glass-card overflow-hidden border border-slate-800">
          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs sm:text-sm">
              <thead class="bg-slate-900 text-slate-400 text-[11px] uppercase tracking-wider border-b border-slate-800">
                <tr>
                  <th class="py-3 px-6">Concept Topic</th>
                  <th class="py-3 px-6">Next Review Date</th>
                  <th class="py-3 px-6">Interval (SM-2)</th>
                  <th class="py-3 px-6">Ease Factor</th>
                  <th class="py-3 px-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-800/60 text-slate-300">
                ${upcoming.map(card => `
                  <tr>
                    <td class="py-3 px-6 font-semibold text-white">${card.title}</td>
                    <td class="py-3 px-6 text-amber-300">${card.dueDate || 'Tomorrow'}</td>
                    <td class="py-3 px-6 font-mono">${card.intervalDays} days</td>
                    <td class="py-3 px-6 font-mono">${card.easeFactor || 2.5}</td>
                    <td class="py-3 px-6 text-right">
                      <button onclick="window.App.startRevisionCard('${card.id}')" class="text-xs text-cyan-400 hover:underline">
                        Review Early
                      </button>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- ACTIVE REVIEW FLASHCARD MODAL -->
      ${activeReview ? renderFlashcardModal(activeReview, revisionController.showAnswer) : ''}

    </div>
  `;
}

function renderFlashcardModal(card, isFlipped) {
  return `
    <div class="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div class="glass-card max-w-lg w-full p-6 sm:p-8 border border-amber-500/40 relative animate-in zoom-in-95 duration-200 space-y-6">
        
        <div class="flex items-center justify-between border-b border-slate-800 pb-3">
          <span class="text-xs font-bold text-amber-400 uppercase tracking-widest">Spaced Repetition Review</span>
          <button onclick="window.App.closeRevisionModal()" class="w-7 h-7 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center text-xs">✕</button>
        </div>

        <div>
          <span class="text-xs text-slate-400 font-semibold">${card.title}</span>
          <h2 class="text-lg font-bold text-white mt-1 leading-snug">${card.prompt}</h2>
        </div>

        ${isFlipped ? `
          <div class="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 animate-in fade-in duration-200">
            <div class="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">Concept Verification / Answer</div>
            <p class="text-xs sm:text-sm text-slate-200 leading-relaxed">${card.answer}</p>
          </div>

          <!-- SM-2 Quality Rating Buttons -->
          <div class="space-y-2 pt-2">
            <div class="text-xs text-center text-slate-400">Rate your recall ease (calculates next interval):</div>
            <div class="grid grid-cols-4 gap-2">
              <button onclick="window.App.rateRevisionCard(1)" class="p-2.5 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 hover:bg-rose-900/60 text-xs font-bold text-center">
                Again <br/><span class="text-[10px] text-slate-400 font-normal">1 Day</span>
              </button>
              <button onclick="window.App.rateRevisionCard(2)" class="p-2.5 rounded-xl bg-amber-950/60 border border-amber-800 text-amber-300 hover:bg-amber-900/60 text-xs font-bold text-center">
                Hard <br/><span class="text-[10px] text-slate-400 font-normal">2 Days</span>
              </button>
              <button onclick="window.App.rateRevisionCard(3)" class="p-2.5 rounded-xl bg-cyan-950/60 border border-cyan-800 text-cyan-300 hover:bg-cyan-900/60 text-xs font-bold text-center">
                Good <br/><span class="text-[10px] text-slate-400 font-normal">4 Days</span>
              </button>
              <button onclick="window.App.rateRevisionCard(4)" class="p-2.5 rounded-xl bg-emerald-950/60 border border-emerald-800 text-emerald-300 hover:bg-emerald-900/60 text-xs font-bold text-center">
                Easy <br/><span class="text-[10px] text-slate-400 font-normal">7 Days</span>
              </button>
            </div>
          </div>
        ` : `
          <button 
            onclick="window.App.flipRevisionCard()" 
            class="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition-all">
            Show Answer & Test Recall
          </button>
        `}

      </div>
    </div>
  `;
}
