// AptiLearn AI Dynamic Study Planner Component
import { store } from '../state.js';
import { sound } from '../soundFx.js';

export function renderPlannerView() {
  const plan = store.studyPlan;

  return `
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      <!-- Top Planner Header -->
      <div class="glass-card p-6 sm:p-8 border border-cyan-500/30 bg-gradient-to-r from-slate-900/95 via-cyan-950/20 to-slate-900/95 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div class="flex items-center gap-2">
            <span class="text-xs uppercase font-bold tracking-widest text-cyan-400">Intelligent Timetable Scheduler</span>
            <span class="text-slate-500">•</span>
            <span class="text-xs text-slate-300">Adaptive Calendar</span>
          </div>
          <h1 class="text-2xl sm:text-3xl font-extrabold text-white light:text-slate-900 mt-1">Dynamic AI Study Planner</h1>
          <p class="text-xs sm:text-sm text-slate-300 light:text-slate-600 mt-1 max-w-2xl">
            Calculated around your target exam date (${plan.examDate}) and available study hours (${plan.dailyHours} hrs/day). If you miss a task, the AI reschedules it automatically without burnout.
          </p>
        </div>

        <!-- Auto-Rescheduler Action -->
        <button 
          onclick="window.App.rescheduleMissedTasks()" 
          class="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-white font-bold text-xs shadow-lg shadow-cyan-500/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-2">
          <span>⚡ Rebalance Missed Tasks</span>
        </button>
      </div>

      <!-- Schedule Breakdown List -->
      <div class="glass-card p-6 border border-slate-800 space-y-4">
        <div class="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 class="text-base font-bold text-white light:text-slate-900">Your Structured Timetable</h3>
          <span class="text-xs text-slate-400 font-mono">Dynamic Re-balancing Active</span>
        </div>

        <div class="space-y-3">
          ${plan.tasks.map(task => `
            <div class="p-4 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 transition-all ${
              task.done 
                ? 'bg-slate-950/40 border-slate-800/60 opacity-60' 
                : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
            }">
              <div class="flex items-center gap-3">
                <input 
                  type="checkbox" 
                  ${task.done ? 'checked' : ''} 
                  onchange="window.App.togglePlannerTask('${task.id}')"
                  class="w-4 h-4 rounded border-slate-700 bg-slate-950 text-cyan-500 focus:ring-0 cursor-pointer"
                />
                <div>
                  <div class="font-bold text-sm ${task.done ? 'line-through text-slate-400' : 'text-white light:text-slate-900'}">
                    ${task.title}
                  </div>
                  <div class="text-[11px] text-slate-400 mt-0.5 flex items-center gap-2">
                    <span class="font-semibold text-cyan-300">${task.day}</span>
                    <span>•</span>
                    <span>${task.time}</span>
                  </div>
                </div>
              </div>

              <div class="flex items-center gap-2">
                <span class="text-[10px] px-2 py-0.5 rounded font-semibold ${
                  task.type === 'Practice' ? 'bg-cyan-950 text-cyan-300 border border-cyan-800' :
                  task.type === 'Revision' ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                  task.type === 'Coding' ? 'bg-indigo-950 text-indigo-300 border border-indigo-800' :
                  'bg-rose-950 text-rose-300 border border-rose-800'
                }">
                  ${task.type}
                </span>
              </div>
            </div>
          `).join('')}
        </div>
      </div>

    </div>
  `;
}
