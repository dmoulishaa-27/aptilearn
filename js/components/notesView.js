// AptiLearn AI Smart Notes & Document Analyzer Component
import { documentAnalyzer } from '../documentAnalyzer.js';
import { sound } from '../soundFx.js';

class NotesViewController {
  constructor() {
    this.activeTab = "summary"; // 'summary', 'mcqs', 'flashcards', 'chat'
    this.chatQuestion = "";
    this.chatAnswer = null;
    this.generatedMCQs = null;
    this.selectedMCQAnswers = {};
    this.generatedFlashcards = null;
    this.activeFlashcardIndex = 0;
    this.flashcardFlipped = false;
  }

  setTab(tab) {
    this.activeTab = tab;
    sound.playClick();
    if (tab === 'mcqs' && !this.generatedMCQs) {
      this.generatedMCQs = documentAnalyzer.generateMCQs();
    }
    if (tab === 'flashcards' && !this.generatedFlashcards) {
      this.generatedFlashcards = documentAnalyzer.generateFlashcards();
    }
    window.App.render();
  }

  handleFileUpload(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target.result;
      documentAnalyzer.addUploadedDocument(file.name, text || "Sample extracted lecture content on data structures.");
      this.generatedMCQs = null;
      this.generatedFlashcards = null;
      this.chatAnswer = null;
      sound.playLevelUp();
      window.App.render();
    };
    reader.readAsText(file);
  }

  askDocument(question) {
    if (!question.trim()) return;
    this.chatQuestion = question;
    this.chatAnswer = documentAnalyzer.answerQuestionGrounded(question);
    sound.playClick();
    window.App.render();
  }

  selectMCQOption(qIndex, oIndex) {
    this.selectedMCQAnswers[qIndex] = oIndex;
    sound.playClick();
    window.App.render();
  }

  flipFlashcard() {
    this.flashcardFlipped = !this.flashcardFlipped;
    sound.playClick();
    window.App.render();
  }

  nextFlashcard() {
    if (this.generatedFlashcards && this.activeFlashcardIndex < this.generatedFlashcards.length - 1) {
      this.activeFlashcardIndex++;
      this.flashcardFlipped = false;
      sound.playClick();
      window.App.render();
    }
  }

  prevFlashcard() {
    if (this.activeFlashcardIndex > 0) {
      this.activeFlashcardIndex--;
      this.flashcardFlipped = false;
      sound.playClick();
      window.App.render();
    }
  }
}

export const notesController = new NotesViewController();

export function renderNotesView() {
  const nc = notesController;
  const docs = documentAnalyzer.getDocuments();
  const currentDoc = documentAnalyzer.getActiveDocument();

  return `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      <!-- Notes Header -->
      <div class="glass-card p-6 sm:p-8 border border-cyan-500/30 bg-gradient-to-r from-slate-900/90 via-cyan-950/20 to-slate-900/90 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div class="flex items-center gap-2">
            <span class="text-xs uppercase font-bold tracking-widest text-cyan-400">Grounded Document Intelligence</span>
            <span class="text-slate-500">•</span>
            <span class="text-xs text-slate-300">Smart Notes & PDF Analyzer</span>
          </div>
          <h1 class="text-2xl sm:text-3xl font-extrabold text-white light:text-slate-900 mt-1">Study Notes & Document AI Center</h1>
          <p class="text-xs sm:text-sm text-slate-300 light:text-slate-600 mt-1 max-w-2xl">
            Upload course slides, chapter PDFs, or lecture notes. AptiLearn extracts core concepts, auto-generates practice MCQs & flashcards, and answers questions grounded strictly in your content.
          </p>
        </div>

        <!-- Upload File Button -->
        <div>
          <label class="cursor-pointer px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-white font-bold text-xs shadow-lg shadow-cyan-500/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-2">
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
            <span>Upload Notes / PDF</span>
            <input type="file" accept=".pdf,.txt,.md" class="hidden" onchange="window.App.handleDocUpload(event)"/>
          </label>
        </div>
      </div>

      <!-- MAIN DOCUMENT WORKBENCH -->
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        <!-- Left: Document Selector -->
        <div class="lg:col-span-1 space-y-4">
          <div class="glass-card p-4 border border-slate-800 space-y-3">
            <div class="flex items-center justify-between">
              <span class="text-xs font-bold text-slate-400 uppercase tracking-wider">Your Documents</span>
              <span class="text-[10px] text-cyan-400 font-mono">${docs.length} Active</span>
            </div>

            <div class="space-y-2">
              ${docs.map(d => `
                <div 
                  onclick="window.App.selectDoc('${d.id}')"
                  class="p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                    currentDoc.id === d.id 
                      ? 'bg-cyan-950/60 border-cyan-400 text-white shadow-md' 
                      : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700'
                  }">
                  <div class="font-bold truncate">${d.title}</div>
                  <div class="text-[10px] text-slate-400 mt-1 flex justify-between">
                    <span>${d.category}</span>
                    <span>${d.size}</span>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Document Key Concept Tags -->
          <div class="glass-card p-4 border border-slate-800 space-y-2">
            <span class="text-xs font-bold text-slate-400 uppercase tracking-wider">Extracted Concepts</span>
            <div class="flex flex-wrap gap-1.5 mt-2">
              ${currentDoc.keyConcepts.map(c => `
                <span class="text-[10px] px-2 py-0.5 rounded bg-indigo-950/70 text-indigo-300 border border-indigo-800 font-medium">
                  # ${c}
                </span>
              `).join('')}
            </div>
          </div>
        </div>

        <!-- Right 3 Cols: Analysis, MCQs, Flashcards, Grounded Q&A -->
        <div class="lg:col-span-3 space-y-4">
          
          <!-- Sub-tabs bar -->
          <div class="glass-card p-2 border border-slate-800 flex flex-wrap gap-1">
            <button 
              onclick="window.App.setDocTab('summary')"
              class="px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                nc.activeTab === 'summary' ? 'bg-cyan-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }">
              📄 Chapter Summary
            </button>
            <button 
              onclick="window.App.setDocTab('mcqs')"
              class="px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                nc.activeTab === 'mcqs' ? 'bg-cyan-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }">
              🎯 Generated MCQs (2)
            </button>
            <button 
              onclick="window.App.setDocTab('flashcards')"
              class="px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                nc.activeTab === 'flashcards' ? 'bg-cyan-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }">
              🗂️ Smart Flashcards (3)
            </button>
            <button 
              onclick="window.App.setDocTab('chat')"
              class="px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                nc.activeTab === 'chat' ? 'bg-cyan-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }">
              💬 Grounded Q&A Chat
            </button>
          </div>

          <!-- Tab 1: Summary -->
          ${nc.activeTab === 'summary' ? `
            <div class="glass-card p-6 border border-slate-800 space-y-4 animate-in fade-in duration-200">
              <div class="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 class="text-base font-bold text-white light:text-slate-900">${currentDoc.title}</h3>
                <span class="text-xs text-slate-400">Uploaded: ${currentDoc.uploadedAt}</span>
              </div>

              <div>
                <h4 class="text-xs font-bold text-cyan-400 uppercase tracking-wider mb-1">Executive Summary</h4>
                <p class="text-xs sm:text-sm text-slate-200 light:text-slate-700 leading-relaxed">${currentDoc.summary}</p>
              </div>

              <div class="pt-3 border-t border-slate-800">
                <h4 class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Full Extracted Text Snippet</h4>
                <div class="p-4 rounded-xl bg-slate-950 light:bg-slate-50 border border-slate-800 text-xs font-mono text-slate-300 light:text-slate-800 leading-relaxed whitespace-pre-wrap">
                  ${currentDoc.content}
                </div>
              </div>

              <div class="flex justify-end gap-3 pt-2">
                <button onclick="window.App.setDocTab('mcqs')" class="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md">
                  Test Knowledge with Auto-Generated MCQs →
                </button>
              </div>
            </div>
          ` : ''}

          <!-- Tab 2: Auto-Generated MCQs -->
          ${nc.activeTab === 'mcqs' ? renderDocMCQs(nc, currentDoc) : ''}

          <!-- Tab 3: Generated Flashcards -->
          ${nc.activeTab === 'flashcards' ? renderDocFlashcards(nc, currentDoc) : ''}

          <!-- Tab 4: Grounded Q&A Chat -->
          ${nc.activeTab === 'chat' ? renderDocChat(nc, currentDoc) : ''}

        </div>

      </div>

    </div>
  `;
}

function renderDocMCQs(nc, doc) {
  const mcqs = nc.generatedMCQs || documentAnalyzer.generateMCQs(doc);

  return `
    <div class="glass-card p-6 border border-slate-800 space-y-6 animate-in fade-in duration-200">
      <div class="flex items-center justify-between border-b border-slate-800 pb-3">
        <div>
          <h3 class="text-base font-bold text-white light:text-slate-900">Auto-Generated Document MCQs</h3>
          <p class="text-xs text-slate-400">Questions synthesized directly from the text of '${doc.title}'.</p>
        </div>
        <span class="text-xs px-2.5 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800 font-mono">2 Questions</span>
      </div>

      <div class="space-y-6">
        ${mcqs.map((q, idx) => {
          const selected = nc.selectedMCQAnswers[idx];
          return `
            <div class="p-5 rounded-xl bg-slate-900/80 light:bg-slate-50 border border-slate-800 space-y-3">
              <h4 class="font-bold text-sm text-white light:text-slate-900">${idx + 1}. ${q.prompt}</h4>
              
              <div class="space-y-2">
                ${q.options.map((opt, oIdx) => {
                  const isSelected = selected === oIdx;
                  let optStyle = "bg-slate-950 light:bg-white border-slate-800 text-slate-300";
                  if (isSelected) {
                    optStyle = opt.isCorrect 
                      ? "bg-emerald-950/70 border-emerald-500 text-emerald-200" 
                      : "bg-rose-950/70 border-rose-500 text-rose-200";
                  }
                  return `
                    <div 
                      onclick="window.App.selectDocMCQ(${idx}, ${oIdx})"
                      class="p-3 rounded-lg border text-xs cursor-pointer transition-all ${optStyle}">
                      <div class="flex items-start gap-2">
                        <span class="font-bold text-slate-400">${String.fromCharCode(65 + oIdx)}.</span>
                        <div class="grow">
                          <div>${opt.text}</div>
                          ${isSelected ? `
                            <div class="mt-1.5 pt-1.5 border-t border-slate-800 text-[11px] ${opt.isCorrect ? 'text-emerald-400' : 'text-slate-400'}">
                              ${opt.explanation}
                            </div>
                          ` : ''}
                        </div>
                      </div>
                    </div>
                  `;
                }).join('')}
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;
}

function renderDocFlashcards(nc, doc) {
  const cards = nc.generatedFlashcards || documentAnalyzer.generateFlashcards(doc);
  const currentCard = cards[nc.activeFlashcardIndex];
  const isFlipped = nc.flashcardFlipped;

  return `
    <div class="glass-card p-6 border border-slate-800 space-y-6 animate-in fade-in duration-200">
      <div class="flex items-center justify-between border-b border-slate-800 pb-3">
        <div>
          <h3 class="text-base font-bold text-white light:text-slate-900">Extracted Key Concept Flashcards</h3>
          <p class="text-xs text-slate-400">Card ${nc.activeFlashcardIndex + 1} of ${cards.length}</p>
        </div>
        <span class="text-xs text-indigo-400 font-mono font-bold">Interactive 3D Flip</span>
      </div>

      <!-- 3D Card Container -->
      <div class="max-w-md mx-auto my-6">
        <div 
          onclick="window.App.flipDocFlashcard()"
          class="w-full min-h-[220px] p-8 rounded-2xl bg-gradient-to-br ${
            isFlipped ? 'from-indigo-950/90 to-slate-900/95 border-indigo-500/50' : 'from-slate-900/90 to-slate-950/90 border-cyan-500/40'
          } border shadow-2xl flex flex-col justify-between cursor-pointer hover:scale-[1.02] transition-all">
          
          <div class="flex justify-between items-center text-[10px] uppercase font-bold tracking-wider text-slate-400">
            <span>${isFlipped ? 'Answer / Verification' : 'Question Prompt'}</span>
            <span class="text-cyan-400">Click to flip ↻</span>
          </div>

          <div class="py-6 text-center">
            <h4 class="text-base sm:text-lg font-bold text-white leading-relaxed">
              ${isFlipped ? currentCard.back : currentCard.front}
            </h4>
          </div>

          <div class="text-[10px] text-center text-slate-500">
            Grounded in: ${doc.title}
          </div>
        </div>
      </div>

      <!-- Stepper Controls -->
      <div class="flex items-center justify-between max-w-md mx-auto pt-2">
        <button 
          onclick="window.App.prevDocFlashcard()" 
          ${nc.activeFlashcardIndex === 0 ? 'disabled' : ''}
          class="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold disabled:opacity-30">
          ← Previous Card
        </button>

        <span class="text-xs text-slate-400 font-mono">${nc.activeFlashcardIndex + 1} / ${cards.length}</span>

        <button 
          onclick="window.App.nextDocFlashcard()" 
          ${nc.activeFlashcardIndex === cards.length - 1 ? 'disabled' : ''}
          class="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold disabled:opacity-30">
          Next Card →
        </button>
      </div>
    </div>
  `;
}

function renderDocChat(nc, doc) {
  return `
    <div class="glass-card p-6 border border-slate-800 space-y-4 animate-in fade-in duration-200">
      <div class="border-b border-slate-800 pb-3">
        <h3 class="text-base font-bold text-white light:text-slate-900">Ask Doubts Grounded in '${doc.title}'</h3>
        <p class="text-xs text-slate-400">Answers are extracted strictly from the provided text to avoid hallucinations.</p>
      </div>

      <!-- Suggested document questions -->
      <div class="flex flex-wrap gap-2 text-xs">
        <button onclick="window.App.askDocQuestion('Why is the base case strictly necessary?')" class="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white">
          "Why is the base case strictly necessary?" →
        </button>
        <button onclick="window.App.askDocQuestion('What happens during stack unwinding?')" class="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white">
          "What happens during stack unwinding?" →
        </button>
      </div>

      <!-- Answer Card -->
      ${nc.chatAnswer ? `
        <div class="p-4 rounded-xl bg-slate-950 border border-cyan-500/30 text-xs text-slate-200 space-y-2 animate-in fade-in duration-200">
          <div class="font-bold text-cyan-400 flex items-center justify-between">
            <span>Grounded Document Response</span>
            <button onclick="sound.speak(document.getElementById('doc-ans-text').innerText)" class="text-[11px] text-slate-400 hover:text-white">🔊 Read aloud</button>
          </div>
          <p id="doc-ans-text" class="leading-relaxed whitespace-pre-wrap">${nc.chatAnswer}</p>
        </div>
      ` : ''}

      <!-- Question Input -->
      <div class="flex items-center gap-2 pt-2">
        <input 
          id="doc-chat-input"
          type="text" 
          placeholder="Ask a question about this chapter..."
          onkeydown="if(event.key === 'Enter') window.App.askDocQuestion(this.value)"
          class="grow bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
        />
        <button 
          onclick="window.App.askDocQuestion(document.getElementById('doc-chat-input').value)"
          class="px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-md">
          Ask AI
        </button>
      </div>
    </div>
  `;
}
