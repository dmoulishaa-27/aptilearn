// AptiLearn AI Smart Flashcards Component (3D Flip & Spaced Recall)
import { store } from '../state.js';
import { sound } from '../soundFx.js';

class FlashcardsViewController {
  constructor() {
    this.cards = [
      { id: "fc_1", concept: "Recursion", front: "What is the critical role of a base case in Java recursion?", back: "It provides the non-recursive terminating condition that stops recursion and halts StackOverflowError.", difficulty: "Medium" },
      { id: "fc_2", concept: "Arrays", front: "In Java, what is the maximum valid index of an array of length N?", back: "Index N - 1. Attempting to access array[N] triggers an ArrayIndexOutOfBoundsException.", difficulty: "Easy" },
      { id: "fc_3", concept: "Java Memory", front: "Where do primitive variables declared inside a method reside?", back: "Inside the thread's JVM Call Stack frame. Objects and array elements live in the Heap.", difficulty: "Medium" },
      { id: "fc_4", concept: "Binary Search", front: "Why is mid = low + (high - low) / 2 preferred over (low + high) / 2?", back: "To prevent 32-bit integer overflow when (low + high) exceeds 2^31 - 1 (Integer.MAX_VALUE).", difficulty: "Hard" },
      { id: "fc_5", concept: "Trees", front: "What is the global invariant of a valid Binary Search Tree?", back: "Every single node in the left subtree must be < Root, and every single node in the right subtree must be > Root.", difficulty: "Hard" }
    ];
    this.currentIndex = 0;
    this.isFlipped = false;
    this.reviewedCount = 2;
    this.dailyGoal = 5;
  }

  flip() {
    this.isFlipped = !this.isFlipped;
    sound.playClick();
    window.App.render();
  }

  rateCard(difficultyRating) {
    this.reviewedCount++;
    store.addXp(15, `Reviewed flashcard (${difficultyRating})`);
    sound.playCorrect();

    if (this.currentIndex < this.cards.length - 1) {
      this.currentIndex++;
      this.isFlipped = false;
    } else {
      this.currentIndex = 0;
      this.isFlipped = false;
    }
    window.App.render();
  }

  next() {
    if (this.currentIndex < this.cards.length - 1) {
      this.currentIndex++;
      this.isFlipped = false;
      sound.playClick();
      window.App.render();
    }
  }

  prev() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.isFlipped = false;
      sound.playClick();
      window.App.render();
    }
  }
}

export const flashcardController = new FlashcardsViewController();

export function renderFlashcardsView() {
  const fc = flashcardController;
  const current = fc.cards[fc.currentIndex];

  return `
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      <!-- Flashcards Header -->
      <div class="glass-card p-6 border border-indigo-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span class="text-xs uppercase font-bold tracking-widest text-indigo-400">Memory Reinforcement</span>
          <h1 class="text-2xl font-extrabold text-white light:text-slate-900 mt-1">Smart 3D Flashcards</h1>
          <p class="text-xs text-slate-400">Spaced recall drill derived from your weak topics.</p>
        </div>

        <div class="flex items-center gap-2">
          <div class="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300">
            <span>Goal: </span>
            <strong class="text-cyan-400">${fc.reviewedCount} / ${fc.dailyGoal} Reviewed</strong>
          </div>
        </div>
      </div>

      <!-- 3D Interactive Card -->
      <div class="max-w-xl mx-auto my-6">
        <div 
          onclick="window.App.flipFlashcardDeck()"
          class="w-full min-h-[260px] p-8 rounded-3xl bg-gradient-to-br ${
            fc.isFlipped 
              ? 'from-indigo-950/95 via-slate-900/95 to-slate-950 border-indigo-500/50 shadow-indigo-500/10' 
              : 'from-slate-900/95 via-cyan-950/20 to-slate-950 border-cyan-500/40 shadow-cyan-500/10'
          } border shadow-2xl flex flex-col justify-between cursor-pointer hover:scale-[1.01] transition-all">
          
          <div class="flex justify-between items-center text-[10px] uppercase font-bold tracking-wider text-slate-400">
            <span class="px-2 py-0.5 rounded bg-slate-800 text-cyan-300">${current.concept}</span>
            <span class="text-cyan-400">Click to Flip ↻</span>
          </div>

          <div class="py-6 text-center">
            <h3 class="text-lg sm:text-xl font-bold text-white light:text-slate-900 leading-relaxed">
              ${fc.isFlipped ? current.back : current.front}
            </h3>
          </div>

          <div class="flex items-center justify-between text-[11px] text-slate-500">
            <span>Difficulty: <strong class="text-amber-400">${current.difficulty}</strong></span>
            <span>Card ${fc.currentIndex + 1} of ${fc.cards.length}</span>
          </div>
        </div>
      </div>

      <!-- Recall Rating Buttons (When Flipped) -->
      ${fc.isFlipped ? `
        <div class="max-w-md mx-auto space-y-2 animate-in fade-in duration-200">
          <div class="text-xs text-center text-slate-400">How difficult was this concept to recall?</div>
          <div class="grid grid-cols-3 gap-2">
            <button onclick="window.App.rateFlashcardDeck('Difficult')" class="py-2.5 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 font-bold text-xs hover:bg-rose-900/60">
              Difficult (1d)
            </button>
            <button onclick="window.App.rateFlashcardDeck('Medium')" class="py-2.5 rounded-xl bg-amber-950/60 border border-amber-800 text-amber-300 font-bold text-xs hover:bg-amber-900/60">
              Medium (3d)
            </button>
            <button onclick="window.App.rateFlashcardDeck('Easy')" class="py-2.5 rounded-xl bg-emerald-950/60 border border-emerald-800 text-emerald-300 font-bold text-xs hover:bg-emerald-900/60">
              Easy (7d)
            </button>
          </div>
        </div>
      ` : `
        <div class="flex justify-center">
          <button 
            onclick="window.App.flipFlashcardDeck()"
            class="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md">
            Reveal Answer ↻
          </button>
        </div>
      `}

      <!-- Navigation Stepper -->
      <div class="flex items-center justify-between max-w-xl mx-auto pt-4 border-t border-slate-800">
        <button 
          onclick="window.App.prevFlashcardDeck()" 
          ${fc.currentIndex === 0 ? 'disabled' : ''}
          class="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold disabled:opacity-30">
          ← Previous
        </button>

        <span class="text-xs text-slate-400 font-mono">${fc.currentIndex + 1} / ${fc.cards.length}</span>

        <button 
          onclick="window.App.nextFlashcardDeck()" 
          ${fc.currentIndex === fc.cards.length - 1 ? 'disabled' : ''}
          class="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold disabled:opacity-30">
          Next →
        </button>
      </div>

    </div>
  `;
}
