// LearnIQ Studio 3.0 Learner Model Dashboard Component
import { store } from '../state.js';
import { LearnerModelEngine } from '../learnerModel.js';
import { LearningPredictorEngine } from '../predictorEngine.js';
import { SYLLABUS_CONCEPTS } from '../config.js';

let radarChartInstance = null;

export function renderDashboardView() {
  const user = store.currentUser;
  const metrics = LearnerModelEngine.getOverallMetrics(user);
  const pred = LearningPredictorEngine.generatePredictions(user);

  // Top 12 concepts for active breakdown
  const activeTopics = SYLLABUS_CONCEPTS.slice(0, 12).map(c => {
    const mastery = user?.mastery ? (user.mastery[c.id] ?? 50) : 50;
    let status = "Learning";
    let statusColor = "amber";
    if (mastery >= 75) {
      status = "Mastered";
      statusColor = "emerald";
    } else if (mastery < 45) {
      status = "Needs Attention";
      statusColor = "rose";
    }
    return {
      ...c,
      mastery,
      status,
      statusColor
    };
  });

  return `
    <div class="max-w-[1600px] mx-auto space-y-6">
      
      <!-- TOP ACTION & TELEMETRY STRIP -->
      <div class="glass-card p-4 sm:p-5 border border-cyan-500/30 bg-gradient-to-r from-slate-900/90 via-[#0b1120] to-slate-900/90 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div class="flex items-center gap-2">
            <span class="text-xs uppercase font-extrabold tracking-widest text-cyan-400 font-mono">STUDIO 3.0</span>
            <span class="text-slate-500">•</span>
            <span class="text-xs text-slate-300 font-medium">${user?.examGoal || 'Java & DSA Placement Exam 2026'}</span>
          </div>
          <h1 class="text-xl sm:text-2xl font-extrabold text-white mt-0.5">
            Learner Model Dashboard <span class="text-sm font-mono font-normal text-cyan-400">(Bayesian EMA Cognitive Matrix)</span>
          </h1>
        </div>

        <!-- Telemetry Badges -->
        <div class="flex flex-wrap items-center gap-2 sm:gap-3 text-xs">
          <div class="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-950/50 border border-amber-800/60 text-amber-300 font-bold">
            <span>🔥</span>
            <span>Current Streak: ${user?.streakDays || 5} Days</span>
          </div>
          <div class="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-950/50 border border-indigo-800/60 text-indigo-300 font-bold font-mono">
            <span>⚡</span>
            <span>XP: ${user?.totalXp || 1420}</span>
          </div>
          <div class="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-950/50 border border-purple-800/60 text-purple-300 font-bold">
            <span>🏆</span>
            <span>Rank: ${user?.levelName || 'Master Scholar'}</span>
          </div>
        </div>
      </div>

      <!-- MAIN COGNITIVE GRID: RADAR CHART + ACTIVE MASTERY BREAKDOWN (12 TOPICS) -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        <!-- LEFT: Cognitive Radar Chart (Chart.js High-DPI) -->
        <div class="lg:col-span-5 glass-card p-5 sm:p-6 border border-slate-800 flex flex-col justify-between space-y-4">
          <div class="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <div class="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-2">
                <span class="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
                <span>Cognitive Radar Chart</span>
              </div>
              <p class="text-[11px] text-slate-400 mt-0.5">Chart.js High-DPI • Multi-Axis Balance</p>
            </div>
            <span class="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">EMA: 0.65</span>
          </div>

          <!-- Radar Chart Canvas Container -->
          <div class="relative w-full h-72 sm:h-80 flex items-center justify-center">
            <canvas id="cognitive-radar-chart"></canvas>
          </div>

          <!-- Radar Subtitle Metrics -->
          <div class="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800 text-center text-xs">
            <div class="p-2 rounded-xl bg-slate-950/70 border border-slate-800">
              <div class="text-[10px] text-slate-400 uppercase">Avg Mastery</div>
              <div class="text-sm font-bold text-cyan-400 font-mono mt-0.5">${metrics.averageMastery}%</div>
            </div>
            <div class="p-2 rounded-xl bg-slate-950/70 border border-slate-800">
              <div class="text-[10px] text-slate-400 uppercase">Accuracy</div>
              <div class="text-sm font-bold text-emerald-400 font-mono mt-0.5">${metrics.overallAccuracy}%</div>
            </div>
            <div class="p-2 rounded-xl bg-slate-950/70 border border-slate-800">
              <div class="text-[10px] text-slate-400 uppercase">Readiness</div>
              <div class="text-sm font-bold text-indigo-400 font-mono mt-0.5">${pred.examReadinessScore ?? pred.readinessScore ?? 64}%</div>
            </div>
          </div>
        </div>

        <!-- RIGHT: Active Mastery Breakdown (12 Topics) -->
        <div class="lg:col-span-7 glass-card p-5 sm:p-6 border border-slate-800 flex flex-col justify-between space-y-4">
          <div class="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <div class="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
                <span>Active Mastery Breakdown</span>
                <span class="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-300">12 Topics</span>
              </div>
              <p class="text-[11px] text-slate-400 mt-0.5">Continuously weighted by response latency & confidence</p>
            </div>
            
            <button 
              onclick="window.App.startAdaptivePractice()" 
              class="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-sm transition-all flex items-center gap-1.5">
              <span>⚡</span>
              <span>Launch Drill</span>
            </button>
          </div>

          <!-- 12-Topic Scrollable List -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[360px] overflow-y-auto pr-1">
            ${activeTopics.map(t => `
              <div class="p-3 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between space-y-2">
                <div class="flex items-center justify-between text-xs">
                  <span class="font-bold text-white truncate max-w-[160px]">${t.name}</span>
                  <span class="text-[10px] font-bold px-2 py-0.5 rounded ${
                    t.statusColor === 'emerald' 
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' 
                      : (t.statusColor === 'amber' ? 'bg-amber-950 text-amber-300 border border-amber-800' : 'bg-rose-950 text-rose-300 border border-rose-800')
                  }">
                    ${t.status}
                  </span>
                </div>

                <!-- Progress Bar -->
                <div>
                  <div class="flex items-center justify-between text-[11px] text-slate-400 mb-1 font-mono">
                    <span>Mastery Level</span>
                    <span class="font-bold ${t.mastery >= 75 ? 'text-emerald-400' : (t.mastery >= 45 ? 'text-amber-400' : 'text-rose-400')}">${t.mastery}%</span>
                  </div>
                  <div class="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                    <div class="h-full rounded-full transition-all duration-500 ${
                      t.mastery >= 75 ? 'bg-gradient-to-r from-emerald-500 to-teal-400' : (t.mastery >= 45 ? 'bg-gradient-to-r from-amber-500 to-orange-400' : 'bg-gradient-to-r from-rose-500 to-red-400')
                    }" style="width: ${t.mastery}%"></div>
                  </div>
                </div>

                <!-- Quick Action Trigger -->
                <div class="flex items-center justify-between pt-1 text-[10px]">
                  <span class="text-slate-500">${t.difficulty} • ${t.category}</span>
                  <button 
                    onclick="window.App.startAdaptivePractice('${t.id}')"
                    class="text-cyan-400 hover:underline font-semibold">
                    Practice →
                  </button>
                </div>
              </div>
            `).join('')}
          </div>

          <!-- Bottom Notice -->
          <div class="p-3 rounded-xl bg-indigo-950/30 border border-indigo-800/40 text-xs text-indigo-300 flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span class="text-sm">💡</span>
              <span><strong>Recursion (42%)</strong> is currently flagged as your primary cognitive bottleneck.</span>
            </div>
            <button onclick="window.App.startAdaptivePractice('recursion')" class="font-bold underline text-white">Start Fix →</button>
          </div>

        </div>

      </div>

      <!-- WORKSPACE QUICK LAUNCH ROW -->
      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <button 
          onclick="window.App.navigate('graph')"
          class="p-3.5 rounded-2xl bg-[#0b1120] border border-slate-800 hover:border-cyan-500 text-left transition-all hover:scale-[1.02] shadow-sm">
          <div class="text-xl mb-1">🕸️</div>
          <div class="font-bold text-xs text-white">Concept DAG</div>
          <div class="text-[10px] text-slate-400 mt-0.5">15 Nodes Graph</div>
        </button>

        <button 
          onclick="window.App.navigate('coding')"
          class="p-3.5 rounded-2xl bg-[#0b1120] border border-slate-800 hover:border-emerald-500 text-left transition-all hover:scale-[1.02] shadow-sm">
          <div class="text-xl mb-1">💻</div>
          <div class="font-bold text-xs text-white">Coding Lab</div>
          <div class="text-[10px] text-slate-400 mt-0.5">Java AST Runner</div>
        </button>

        <button 
          onclick="window.App.navigate('exam')"
          class="p-3.5 rounded-2xl bg-[#0b1120] border border-slate-800 hover:border-amber-500 text-left transition-all hover:scale-[1.02] shadow-sm">
          <div class="text-xl mb-1">⏱️</div>
          <div class="font-bold text-xs text-white">Exam Simulator</div>
          <div class="text-[10px] text-slate-400 mt-0.5">15-Min Mock Test</div>
        </button>

        <button 
          onclick="window.App.navigate('misconceptions')"
          class="p-3.5 rounded-2xl bg-[#0b1120] border border-slate-800 hover:border-rose-500 text-left transition-all hover:scale-[1.02] shadow-sm">
          <div class="text-xl mb-1">🛡️</div>
          <div class="font-bold text-xs text-white">Misconceptions</div>
          <div class="text-[10px] text-slate-400 mt-0.5">Bug Traces & Fix</div>
        </button>

        <button 
          onclick="window.App.navigate('revision')"
          class="p-3.5 rounded-2xl bg-[#0b1120] border border-slate-800 hover:border-purple-500 text-left transition-all hover:scale-[1.02] shadow-sm">
          <div class="text-xl mb-1">🧠</div>
          <div class="font-bold text-xs text-white">Spaced SM-2</div>
          <div class="text-[10px] text-slate-400 mt-0.5">Memory Retention</div>
        </button>

        <button 
          onclick="window.App.navigate('tutor')"
          class="p-3.5 rounded-2xl bg-[#0b1120] border border-slate-800 hover:border-indigo-500 text-left transition-all hover:scale-[1.02] shadow-sm">
          <div class="text-xl mb-1">💬</div>
          <div class="font-bold text-xs text-white">AI Copilot</div>
          <div class="text-[10px] text-slate-400 mt-0.5">Socrates Mentor</div>
        </button>
      </div>

    </div>
  `;
}

// Initializes Chart.js High-DPI Radar Chart
export function initCognitiveRadarChart() {
  const canvas = document.getElementById('cognitive-radar-chart');
  if (!canvas || typeof Chart === 'undefined') return;

  if (radarChartInstance) {
    radarChartInstance.destroy();
  }

  const user = store.currentUser;
  const mastery = user?.mastery || {};

  // Compute 6 cognitive axes
  const foundations = Math.round(((mastery.variables || 50) + (mastery.data_types || 45) + (mastery.functions || 55)) / 3);
  const controlFlow = Math.round(((mastery.conditionals || 60) + (mastery.loops || 55)) / 2);
  const dataStructures = Math.round(((mastery.arrays || 50) + (mastery.strings || 60) + (mastery.linked_lists || 40)) / 3);
  const algorithms = Math.round(((mastery.recursion || 35) + (mastery.searching || 55) + (mastery.sorting || 50)) / 3);
  const memoryModels = Math.round(((mastery.data_types || 50) + (mastery.functions || 60)) / 2);
  const dynamicLogic = Math.round(((mastery.trees || 20) + (mastery.graphs || 20) + (mastery.stacks || 50)) / 3);

  const ctx = canvas.getContext('2d');

  radarChartInstance = new Chart(ctx, {
    type: 'radar',
    data: {
      labels: [
        'Foundations',
        'Control Flow',
        'Data Structures',
        'Algorithms',
        'Memory Models',
        'Dynamic Logic'
      ],
      datasets: [
        {
          label: 'Current Mastery',
          data: [foundations, controlFlow, dataStructures, algorithms, memoryModels, dynamicLogic],
          backgroundColor: 'rgba(56, 189, 248, 0.25)',
          borderColor: '#38bdf8',
          borderWidth: 2,
          pointBackgroundColor: '#38bdf8',
          pointBorderColor: '#ffffff',
          pointHoverRadius: 6,
          pointRadius: 4
        },
        {
          label: 'Target Goal',
          data: [90, 90, 85, 80, 85, 75],
          backgroundColor: 'rgba(99, 102, 241, 0.08)',
          borderColor: 'rgba(99, 102, 241, 0.6)',
          borderWidth: 1.5,
          borderDash: [4, 4],
          pointRadius: 0
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: 'bottom',
          labels: {
            color: '#94a3b8',
            font: {
              family: 'Plus Jakarta Sans',
              size: 11
            },
            boxWidth: 12
          }
        },
        tooltip: {
          backgroundColor: '#070b14',
          titleColor: '#38bdf8',
          bodyColor: '#ffffff',
          borderColor: '#38bdf8',
          borderWidth: 1
        }
      },
      scales: {
        r: {
          min: 0,
          max: 100,
          ticks: {
            stepSize: 20,
            color: '#64748b',
            backdropColor: 'transparent',
            font: {
              size: 9
            }
          },
          grid: {
            color: 'rgba(255, 255, 255, 0.08)'
          },
          angleLines: {
            color: 'rgba(255, 255, 255, 0.08)'
          },
          pointLabels: {
            color: '#cbd5e1',
            font: {
              family: 'Plus Jakarta Sans',
              size: 11,
              weight: 'bold'
            }
          }
        }
      }
    }
  });
}
