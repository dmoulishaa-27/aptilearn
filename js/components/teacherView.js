// LearnIQ Teacher / Educator Cohort Analytics Dashboard Component
import { store } from '../state.js';

class TeacherDashboardController {
  constructor() {
    this.selectedStudent = null;
    this.cohortData = null;
  }

  async loadCohort() {
    try {
      const res = await fetch('/api/teacher/cohort');
      if (res.ok) {
        this.cohortData = await res.json();
      }
    } catch (e) {
      // Offline fallback
    }

    if (!this.cohortData) {
      this.cohortData = {
        totalStudents: 42,
        classAverageMastery: 68.4,
        classAccuracy: 73.1,
        atRiskCount: 4,
        mostDifficultConcepts: [
          { concept: "Recursion & Call Stack", avgMastery: 38.5, errorRate: 61.5, flaggedMisconceptions: 29 },
          { concept: "Linked Lists & Pointers", avgMastery: 45.2, errorRate: 54.8, flaggedMisconceptions: 22 },
          { concept: "Stacks & Queues", avgMastery: 56.0, errorRate: 44.0, flaggedMisconceptions: 16 },
          { concept: "Binary Search", avgMastery: 62.1, errorRate: 37.9, flaggedMisconceptions: 14 },
          { concept: "Arrays & Bounds", avgMastery: 69.8, errorRate: 30.2, flaggedMisconceptions: 11 }
        ],
        commonMisconceptions: [
          { name: "Missing Recursion Base Case", count: 28, concept: "Recursion", severity: "Critical" },
          { name: "Array Off-by-One Length vs Index", count: 24, concept: "Arrays", severity: "Moderate" },
          { name: "NullPointerException on Empty Linked List", count: 19, concept: "Linked Lists", severity: "High" },
          { name: "Pass-by-Value Reference Mutation Confusion", count: 15, concept: "Functions", severity: "Moderate" },
          { name: "Stack Overflow from Infinite Loop Recursion", count: 13, concept: "Recursion", severity: "High" }
        ],
        atRiskStudents: [
          { id: "s101", name: "Marcus Vance", email: "marcus@campus.edu", weakestConcept: "Recursion", mastery: 32, misconceptions: 4, lastActive: "2 hours ago", status: "Needs Immediate Intervention" },
          { id: "s102", name: "Elena Rostova", email: "elena@campus.edu", weakestConcept: "Linked Lists", mastery: 39, misconceptions: 3, lastActive: "Yesterday", status: "Needs Review" },
          { id: "s103", name: "David Kim", email: "dkim@campus.edu", weakestConcept: "Recursion", mastery: 36, misconceptions: 3, lastActive: "3 hours ago", status: "Struggling with Base Cases" },
          { id: "s104", name: "Chloe Bennett", email: "chloeb@campus.edu", weakestConcept: "Sorting", mastery: 44, misconceptions: 2, lastActive: "4 hours ago", status: "Declining Accuracy" }
        ]
      };
    }
  }

  inspectStudent(student) {
    this.selectedStudent = student;
    store.notify();
  }

  closeStudentModal() {
    this.selectedStudent = null;
    store.notify();
  }
}

export const teacherController = new TeacherDashboardController();

export function renderTeacherView() {
  if (!teacherController.cohortData) {
    teacherController.loadCohort();
  }
  const data = teacherController.cohortData;
  const inspected = teacherController.selectedStudent;

  return `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      <!-- Top Educator Banner -->
      <div class="glass-card p-6 sm:p-8 border border-indigo-500/25 bg-gradient-to-r from-slate-900/90 via-indigo-950/30 to-slate-900/90 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div class="flex items-center gap-2">
            <span class="text-xs uppercase font-bold tracking-widest text-indigo-400">Instructor Intelligence Portal</span>
            <span class="text-slate-500">•</span>
            <span class="text-xs text-slate-300">CS201 Data Structures Cohort</span>
          </div>
          <h1 class="text-2xl sm:text-3xl font-extrabold text-white mt-1">Classroom Cognitive Heatmap</h1>
          <p class="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
            Real-time aggregate learner analytics. Identify class-wide conceptual roadblocks, track common misconceptions, and intervene early.
          </p>
        </div>

        <button onclick="window.App.switchPersona('alex')" class="px-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs font-semibold text-slate-300 hover:text-white transition-all">
          ← Switch Back to Student View
        </button>
      </div>

      <!-- Cohort Summary Metrics (4 Cards) -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="glass-card p-5">
          <div class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Enrolled Learners</div>
          <div class="text-3xl font-extrabold text-white font-mono mt-1">${data.totalStudents}</div>
          <div class="text-[11px] text-emerald-400 mt-2">Active Cohort (Fall 2026)</div>
        </div>

        <div class="glass-card p-5">
          <div class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Class Average Mastery</div>
          <div class="text-3xl font-extrabold text-cyan-400 font-mono mt-1">${data.classAverageMastery}%</div>
          <div class="text-[11px] text-slate-400 mt-2">Target benchmark: 75%</div>
        </div>

        <div class="glass-card p-5">
          <div class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Overall Accuracy</div>
          <div class="text-3xl font-extrabold text-indigo-400 font-mono mt-1">${data.classAccuracy}%</div>
          <div class="text-[11px] text-slate-400 mt-2">Across 1,280 attempts</div>
        </div>

        <div class="glass-card p-5 border border-rose-500/30 bg-rose-950/10">
          <div class="text-xs font-semibold text-rose-400 uppercase tracking-wider">At-Risk Students</div>
          <div class="text-3xl font-extrabold text-rose-400 font-mono mt-1">${data.atRiskCount}</div>
          <div class="text-[11px] text-rose-300 mt-2">Require targeted intervention</div>
        </div>
      </div>

      <!-- 2-COL GRID: Difficult Concepts vs Common Misconceptions -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        <!-- Difficult Concepts Bar Chart -->
        <div class="glass-card p-6 space-y-4">
          <div class="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 class="text-base font-bold text-white">Most Difficult Concepts in Class</h3>
              <p class="text-xs text-slate-400">Ranked by lowest class average mastery score</p>
            </div>
            <span class="text-xs px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800 font-semibold">Priority</span>
          </div>

          <div class="space-y-3.5">
            ${data.mostDifficultConcepts.map(c => `
              <div>
                <div class="flex items-center justify-between text-xs mb-1">
                  <span class="font-medium text-white">${c.concept}</span>
                  <span class="text-rose-400 font-mono font-bold">${c.avgMastery}% Avg Mastery (${c.errorRate}% Error Rate)</span>
                </div>
                <div class="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div class="bg-gradient-to-r from-rose-500 to-amber-500 h-2 rounded-full" style="width: ${c.avgMastery}%"></div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Common Misconceptions Breakdown -->
        <div class="glass-card p-6 space-y-4">
          <div class="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 class="text-base font-bold text-white">Top Misconceptions Triggered</h3>
              <p class="text-xs text-slate-400">Aggregated cognitive blindspots across cohort</p>
            </div>
            <span class="text-xs text-indigo-400 font-mono font-semibold">Frequencies</span>
          </div>

          <div class="space-y-2.5">
            ${data.commonMisconceptions.map(m => `
              <div class="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between text-xs">
                <div>
                  <div class="font-semibold text-white">${m.name}</div>
                  <div class="text-[10px] text-slate-400">${m.concept} • <span class="${m.severity === 'Critical' ? 'text-rose-400' : 'text-amber-400'}">${m.severity} Severity</span></div>
                </div>
                <div class="text-right">
                  <div class="text-base font-bold text-rose-400 font-mono">${m.count}</div>
                  <div class="text-[9px] text-slate-500 uppercase">Students</div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

      </div>

      <!-- AT-RISK STUDENTS INTERVENTION TABLE -->
      <div class="glass-card overflow-hidden border border-rose-500/30">
        <div class="p-6 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h3 class="text-base font-bold text-white flex items-center gap-2">
              <span class="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
              <span>Learners Requiring Additional Support (At-Risk Alerts)</span>
            </h3>
            <p class="text-xs text-slate-400">Students with 2+ unresolved misconceptions or overall mastery under 45%</p>
          </div>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs sm:text-sm">
            <thead class="bg-slate-900 text-slate-400 text-[11px] uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th class="py-3 px-6">Student Name</th>
                <th class="py-3 px-6">Weakest Concept</th>
                <th class="py-3 px-6">Concept Mastery</th>
                <th class="py-3 px-6">Active Misconceptions</th>
                <th class="py-3 px-6">Status Alert</th>
                <th class="py-3 px-6 text-right">Drill-Down</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-800/60 text-slate-300">
              ${data.atRiskStudents.map(s => `
                <tr class="hover:bg-slate-900/40 transition-colors">
                  <td class="py-3.5 px-6 font-semibold text-white">
                    <div>${s.name}</div>
                    <div class="text-[10px] text-slate-500">${s.email}</div>
                  </td>
                  <td class="py-3.5 px-6 font-medium text-cyan-300">${s.weakestConcept}</td>
                  <td class="py-3.5 px-6 font-mono font-bold text-rose-400">${s.mastery}%</td>
                  <td class="py-3.5 px-6 font-mono font-semibold text-amber-400">${s.misconceptions} bugs</td>
                  <td class="py-3.5 px-6">
                    <span class="text-[10px] px-2 py-0.5 rounded font-semibold bg-rose-950 text-rose-300 border border-rose-800">
                      ${s.status}
                    </span>
                  </td>
                  <td class="py-3.5 px-6 text-right">
                    <button onclick="window.App.inspectStudent('${s.id}')" class="px-3 py-1.5 rounded-lg bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-300 border border-indigo-500/30 text-xs font-semibold transition-all">
                      Inspect Learner Model →
                    </button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <!-- STUDENT DRILL-DOWN MODAL -->
      ${inspected ? renderStudentDrillDownModal(inspected) : ''}

    </div>
  `;
}

function renderStudentDrillDownModal(student) {
  return `
    <div class="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div class="glass-card max-w-lg w-full p-6 sm:p-8 border border-indigo-500/40 relative animate-in zoom-in-95 duration-200 space-y-4">
        
        <div class="flex items-center justify-between border-b border-slate-800 pb-3">
          <span class="text-xs font-bold text-indigo-400 uppercase tracking-widest">Individual Learner Model Drill-Down</span>
          <button onclick="window.App.closeStudentInspection()" class="w-7 h-7 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center text-xs">✕</button>
        </div>

        <div>
          <h2 class="text-xl font-bold text-white">${student.name}</h2>
          <p class="text-xs text-slate-400">${student.email} • Last active: ${student.lastActive}</p>
        </div>

        <div class="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
          <div class="flex justify-between">
            <span class="text-slate-400">Weakest Focus Concept:</span>
            <span class="text-rose-400 font-bold">${student.weakestConcept}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-slate-400">Mastery Score:</span>
            <span class="text-white font-mono font-bold">${student.mastery}%</span>
          </div>
          <div class="flex justify-between">
            <span class="text-slate-400">Active Misconceptions:</span>
            <span class="text-amber-400 font-bold">${student.misconceptions} flagged</span>
          </div>
          <div class="flex justify-between">
            <span class="text-slate-400">Recommended Action:</span>
            <span class="text-cyan-300 font-semibold">Assign Scaffolded Base-Case Remediation</span>
          </div>
        </div>

        <div class="flex justify-end gap-3 pt-3 border-t border-slate-800">
          <button onclick="window.App.closeStudentInspection()" class="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold">
            Close
          </button>
          <button onclick="window.App.switchPersona('alex'); window.App.closeStudentInspection();" class="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md">
            Simulate Student View →
          </button>
        </div>

      </div>
    </div>
  `;
}
