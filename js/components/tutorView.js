// AptiLearn AI Socratic AI Personal Tutor Chat Component with Explain It Again Selector
import { store } from '../state.js';
import { tutorEngine } from '../tutorEngine.js';
import { LearnerModelEngine } from '../learnerModel.js';
import { sound } from '../soundFx.js';

export { tutorEngine };

export function renderTutorView() {
  const user = store.currentUser;
  const metrics = LearnerModelEngine.getOverallMetrics(user);
  const messages = tutorEngine.getMessages();

  return `
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        <!-- Left Sidebar: Learner Context & Quick Prompts -->
        <div class="lg:col-span-1 space-y-4">
          
          <div class="glass-card p-4 border border-indigo-500/25">
            <div class="flex items-center gap-3 mb-3">
              <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 p-[2px]">
                <div class="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center font-bold text-cyan-400">
                  AI
                </div>
              </div>
              <div>
                <h3 class="text-sm font-bold text-white light:text-slate-900">Socrates Mentor</h3>
                <span class="text-[10px] text-emerald-400 flex items-center gap-1">
                  <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  Active Learner Context
                </span>
              </div>
            </div>

            <div class="pt-2 border-t border-slate-800 space-y-2 text-xs">
              <div class="flex justify-between text-slate-400">
                <span>Student:</span>
                <span class="text-white light:text-slate-900 font-semibold">${user?.name?.split(' ')[0] || 'User'}</span>
              </div>
              <div class="flex justify-between text-slate-400">
                <span>Mastery:</span>
                <span class="text-cyan-400 font-bold font-mono">${metrics.averageMastery}%</span>
              </div>
              <div class="flex justify-between text-slate-400">
                <span>Language:</span>
                <span class="text-indigo-300 font-semibold">${store.language === 'hi' ? 'हिंदी' : 'English'}</span>
              </div>
            </div>
          </div>

          <!-- Explain It Again Quick Panel -->
          <div class="glass-card p-4 border border-cyan-500/30 space-y-2">
            <span class="text-xs font-bold text-cyan-400 uppercase tracking-wider">Explain It Again Mode</span>
            <p class="text-[11px] text-slate-400">Select an alternate explanation style for complex topics:</p>
            <div class="space-y-1.5 mt-2">
              <button onclick="window.App.tutorExplainMode('simple')" class="w-full text-left p-2 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-[11px] text-slate-300 hover:text-white border border-slate-800">
                🎈 Explain Simply (ELI5)
              </button>
              <button onclick="window.App.tutorExplainMode('analogy')" class="w-full text-left p-2 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-[11px] text-slate-300 hover:text-white border border-slate-800">
                🌍 Explain with Analogy
              </button>
              <button onclick="window.App.tutorExplainMode('step_by_step')" class="w-full text-left p-2 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-[11px] text-slate-300 hover:text-white border border-slate-800">
                🔍 Explain Step-by-Step
              </button>
              <button onclick="window.App.tutorExplainMode('visual')" class="w-full text-left p-2 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-[11px] text-slate-300 hover:text-white border border-slate-800">
                🖼️ Explain Visually (Stack)
              </button>
              <button onclick="window.App.tutorExplainMode('quiz')" class="w-full text-left p-2 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-[11px] text-slate-300 hover:text-white border border-slate-800">
                🎯 Give Practice Question
              </button>
            </div>
          </div>

          <!-- Weak Areas Chip List -->
          <div class="glass-card p-4 border border-slate-800 space-y-2">
            <span class="text-xs font-bold text-slate-400 uppercase tracking-wider">Target Weak Topics</span>
            <div class="flex flex-wrap gap-1.5 mt-2">
              ${metrics.weakConcepts.map(c => `
                <span class="text-[10px] px-2 py-0.5 rounded bg-rose-950/60 text-rose-300 border border-rose-800 font-medium">
                  ${c.name} (${c.mastery}%)
                </span>
              `).join('')}
            </div>
          </div>

        </div>

        <!-- Right 3 Cols: Chat Window -->
        <div class="lg:col-span-3 glass-card p-6 flex flex-col justify-between border border-indigo-500/20" style="min-height: 600px;">
          
          <!-- Messages Scroll Area -->
          <div id="tutor-messages-container" class="space-y-4 overflow-y-auto pr-2" style="max-height: 480px;">
            ${messages.map(m => `
              <div class="flex items-start gap-3 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}">
                ${m.sender === 'tutor' ? `
                  <div class="w-8 h-8 rounded-xl bg-indigo-600/30 text-indigo-400 flex items-center justify-center shrink-0 font-bold text-xs mt-1">
                    AI
                  </div>
                ` : ''}

                <div class="max-w-xl p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                  m.sender === 'user'
                    ? 'bg-gradient-to-r from-cyan-600 to-indigo-600 text-white rounded-tr-none shadow-md shadow-cyan-500/10'
                    : 'bg-slate-900/90 text-slate-200 border border-slate-800 rounded-tl-none shadow-sm'
                }">
                  <div class="whitespace-pre-wrap">${formatMessageText(m.text)}</div>
                  <div class="flex items-center justify-between text-[10px] mt-2 opacity-60">
                    ${m.sender === 'tutor' ? `
                      <button onclick="sound.speak(\`${escapeQuotes(m.text)}\`)" class="text-cyan-400 hover:underline">🔊 Listen</button>
                    ` : '<span></span>'}
                    <span>${m.timestamp}</span>
                  </div>
                </div>

                ${m.sender === 'user' ? `
                  <img src="${user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'}" class="w-8 h-8 rounded-xl object-cover shrink-0 mt-1 border border-cyan-500/40" alt="Student"/>
                ` : ''}
              </div>
            `).join('')}
          </div>

          <!-- Chat Input Bar -->
          <div class="mt-4 pt-4 border-t border-slate-800 flex items-center gap-2">
            <input 
              id="tutor-chat-input"
              type="text" 
              placeholder="Ask Socrates anything about Java, algorithms, or your mistakes..."
              onkeydown="if(event.key === 'Enter') window.App.submitTutorChat()"
              class="grow bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
            />
            <button 
              onclick="window.App.submitTutorChat()"
              class="px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-white font-bold text-xs shadow-lg shadow-cyan-500/20 hover:scale-105 active:scale-95 transition-all">
              Send
            </button>
          </div>

        </div>

      </div>

    </div>
  `;
}

function formatMessageText(text) {
  if (!text) return '';
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/```([\s\S]*?)```/g, '<div class="p-2.5 rounded-lg bg-slate-950 font-mono text-[11px] text-cyan-300 my-2 overflow-x-auto"><pre><code>$1</code></pre></div>')
    .replace(/`([^`]+)`/g, '<code class="bg-slate-950 px-1 py-0.5 rounded text-cyan-300 font-mono text-[11px]">$1</code>');
}

function escapeQuotes(text) {
  if (!text) return '';
  return text.replace(/`/g, '\\`').replace(/"/g, '&quot;');
}
