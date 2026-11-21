// LearnIQ Concept Knowledge Graph View & Concept Detail Drawer Component
import { store } from '../state.js';
import { SYLLABUS_CONCEPTS } from '../config.js';
import { KnowledgeGraphVisualizer } from '../knowledgeGraph.js';
import { LearnerModelEngine } from '../learnerModel.js';

let graphInstance = null;

export function renderGraphView() {
  const selectedConcept = store.selectedConceptForModal 
    ? SYLLABUS_CONCEPTS.find(c => c.id === store.selectedConceptForModal) 
    : null;

  return `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      <!-- Graph Header & Visual Legend -->
      <div class="glass-card p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border border-cyan-500/20">
        <div>
          <div class="flex items-center gap-2">
            <span class="text-xs uppercase font-bold tracking-widest text-cyan-400">Curriculum Architecture</span>
            <span class="text-slate-500">•</span>
            <span class="text-xs text-slate-400">Java & Data Structures Syllabus</span>
          </div>
          <h1 class="text-2xl font-extrabold text-white mt-1">Concept Knowledge Graph</h1>
          <p class="text-xs text-slate-300">
            Interactive prerequisite dependencies. Node color indicates your real-time mastery state from the Learner Model.
          </p>
        </div>

        <!-- Legend Pill -->
        <div class="flex flex-wrap items-center gap-3 p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs">
          <div class="flex items-center gap-1.5">
            <span class="w-3 h-3 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50"></span>
            <span class="text-slate-300">Mastered (≥75%)</span>
          </div>
          <div class="flex items-center gap-1.5">
            <span class="w-3 h-3 rounded-full bg-amber-500 shadow-sm shadow-amber-500/50"></span>
            <span class="text-slate-300">Learning (40-74%)</span>
          </div>
          <div class="flex items-center gap-1.5">
            <span class="w-3 h-3 rounded-full bg-rose-500 shadow-sm shadow-rose-500/50"></span>
            <span class="text-slate-300">Needs Work (&lt;40%)</span>
          </div>
          <div class="flex items-center gap-1.5">
            <span class="w-3 h-3 rounded-full bg-slate-600"></span>
            <span class="text-slate-400">Not Started</span>
          </div>
        </div>
      </div>

      <!-- Canvas Container with floating zoom controls -->
      <div class="relative glass-card overflow-hidden border border-slate-800" style="min-height: 560px;">
        
        <canvas id="knowledge-graph-canvas" class="w-full h-full block"></canvas>

        <!-- Floating Zoom / Pan Controls -->
        <div class="absolute bottom-4 right-4 flex items-center gap-2 bg-slate-900/90 backdrop-blur-md p-1.5 rounded-xl border border-slate-800 shadow-lg z-20">
          <button onclick="window.App.graphZoomIn()" class="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center font-bold text-sm" title="Zoom In">+</button>
          <button onclick="window.App.graphZoomOut()" class="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center font-bold text-sm" title="Zoom Out">-</button>
          <button onclick="window.App.graphResetView()" class="px-2.5 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300" title="Reset View">Reset</button>
        </div>

        <!-- Help hint banner -->
        <div class="absolute top-4 left-4 pointer-events-none text-[11px] text-slate-400 bg-slate-950/70 backdrop-blur px-3 py-1.5 rounded-lg border border-slate-800/80">
          💡 Click any concept node to view mastery stats, prerequisites & launch targeted practice. Drag to pan.
        </div>

      </div>

      <!-- Concept Detail Slideover Modal / Drawer -->
      ${selectedConcept ? renderConceptDrawer(selectedConcept) : ''}

    </div>
  `;
}

function renderConceptDrawer(concept) {
  const user = store.currentUser;
  const mastery = user && user.mastery ? (user.mastery[concept.id] ?? 0) : 0;
  const stats = user && user.conceptStats ? user.conceptStats[concept.id] : null;
  const attempts = stats ? stats.attempts : 0;
  const status = LearnerModelEngine.getConceptStatus(mastery, attempts);

  // Prerequisites information
  const prereqObjects = concept.prerequisites.map(pid => {
    const c = SYLLABUS_CONCEPTS.find(x => x.id === pid);
    const m = user?.mastery ? (user.mastery[pid] ?? 0) : 0;
    return { name: c?.name || pid, mastery: m, isMastered: m >= 75 };
  });

  // Active misconceptions for this concept
  const relatedMisconceptions = user?.activeMisconceptions?.filter(m => m.conceptId === concept.id) || [];

  return `
    <div class="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div class="glass-card max-w-lg w-full p-6 sm:p-8 border border-cyan-500/40 relative animate-in fade-in zoom-in-95 duration-200">
        
        <!-- Close Button -->
        <button 
          onclick="window.App.closeConceptModal()" 
          class="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center text-sm">
          ✕
        </button>

        <div class="flex items-start gap-4 mb-4">
          <div class="w-12 h-12 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-lg shrink-0">
            ${concept.shortName.charAt(0)}
          </div>
          <div>
            <span class="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-slate-800 text-cyan-400 border border-slate-700">${concept.category}</span>
            <h2 class="text-xl font-bold text-white mt-1">${concept.name}</h2>
            <p class="text-xs text-slate-300 mt-1">${concept.description}</p>
          </div>
        </div>

        <!-- Mastery Meter -->
        <div class="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 my-4 space-y-2">
          <div class="flex items-center justify-between">
            <span class="text-xs font-semibold text-slate-400">Current Concept Mastery</span>
            <span class="text-lg font-extrabold text-white font-mono">${mastery}%</span>
          </div>
          <div class="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
            <div class="h-2.5 rounded-full ${
              mastery >= 75 ? 'bg-emerald-500' : (mastery >= 40 ? 'bg-amber-500' : 'bg-rose-500')
            }" style="width: ${mastery}%"></div>
          </div>
          <div class="flex justify-between text-[11px] text-slate-400 pt-1">
            <span>Status: <strong class="${mastery >= 75 ? 'text-emerald-400' : (mastery >= 40 ? 'text-amber-400' : 'text-rose-400')}">${status}</strong></span>
            <span>Attempts: ${attempts} (${stats?.correct || 0} correct)</span>
          </div>
        </div>

        <!-- Prerequisites Section -->
        <div class="mb-4">
          <div class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Prerequisites</div>
          ${prereqObjects.length > 0 ? `
            <div class="space-y-1.5">
              ${prereqObjects.map(p => `
                <div class="flex items-center justify-between p-2 rounded-lg bg-slate-900/60 border border-slate-800 text-xs">
                  <span class="text-slate-300">${p.name}</span>
                  <span class="font-semibold ${p.isMastered ? 'text-emerald-400' : 'text-amber-400'}">
                    ${p.mastery}% ${p.isMastered ? '✓' : '(In Progress)'}
                  </span>
                </div>
              `).join('')}
            </div>
          ` : '<div class="text-xs text-slate-500 italic">Foundational topic with no prerequisites.</div>'}
        </div>

        <!-- Misconceptions Flagged -->
        ${relatedMisconceptions.length > 0 ? `
          <div class="p-3 rounded-xl bg-rose-950/40 border border-rose-500/30 text-xs text-rose-300 mb-4">
            <div class="font-bold mb-1 flex items-center gap-1.5">
              <span>⚠ ${relatedMisconceptions.length} Active Misconception Detected</span>
            </div>
            <div>${relatedMisconceptions[0].title}</div>
          </div>
        ` : ''}

        <!-- Actions -->
        <div class="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
          <button onclick="window.App.closeConceptModal()" class="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold">
            Close
          </button>
          <button 
            onclick="window.App.startAdaptivePractice('${concept.id}'); window.App.closeConceptModal();" 
            class="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-white font-bold text-xs shadow-lg shadow-cyan-500/20 hover:scale-105 transition-all">
            Practice ${concept.shortName} Now →
          </button>
        </div>

      </div>
    </div>
  `;
}

export function initGraphCanvas() {
  const canvas = document.getElementById('knowledge-graph-canvas');
  if (canvas) {
    graphInstance = new KnowledgeGraphVisualizer(canvas, (node) => {
      store.selectedConceptForModal = node.id;
      store.notify();
    });
  }
}

export function graphZoomIn() {
  if (graphInstance) graphInstance.zoomIn();
}

export function graphZoomOut() {
  if (graphInstance) graphInstance.zoomOut();
}

export function graphResetView() {
  if (graphInstance) graphInstance.resetView();
}
