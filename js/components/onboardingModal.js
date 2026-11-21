// AptiLearn AI Student Onboarding Modal Component
import { store } from '../state.js';
import { sound } from '../soundFx.js';

class OnboardingModalController {
  constructor() {
    this.isOpen = false;
    this.step = 1;
    this.name = "Alex Rivera";
    this.educationLevel = "Undergraduate (B.Tech CS)";
    this.institution = "Institute of Technology";
    this.subjects = ["Java & Data Structures"];
    this.targetExam = "Java & DSA Placement Exam 2026";
    this.knowledgeLevel = "Intermediate";
    this.dailyStudyTime = "2 Hours / Day";
    this.targetScore = "95% Target Percentile";
    this.language = "en";
  }

  open() {
    this.isOpen = true;
    this.step = 1;
    sound.playClick();
    window.App.render();
  }

  close() {
    this.isOpen = false;
    window.App.render();
  }

  save() {
    store.updateProfile({
      name: this.name,
      educationLevel: this.educationLevel,
      institution: this.institution,
      examGoal: this.targetExam,
      level: this.knowledgeLevel,
      targetScore: this.targetScore,
      preferredLanguage: this.language
    });
    store.setLanguage(this.language);
    sound.playLevelUp();
    this.close();
  }
}

export const onboardingController = new OnboardingModalController();

export function renderOnboardingModal() {
  const oc = onboardingController;
  if (!oc.isOpen) return '';

  return `
    <div class="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div class="glass-card max-w-lg w-full p-6 sm:p-8 border border-cyan-500/40 relative animate-in zoom-in-95 duration-200 space-y-5">
        
        <button onclick="window.App.closeOnboarding()" class="absolute top-4 right-4 w-7 h-7 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center text-xs">✕</button>

        <div class="border-b border-slate-800 pb-3">
          <span class="text-xs font-bold text-cyan-400 uppercase tracking-widest">Personalization Profile Setup</span>
          <h2 class="text-xl font-bold text-white light:text-slate-900 mt-1">Calibrate Your AptiLearn AI Mentor</h2>
          <p class="text-xs text-slate-400 mt-1">Tell us about your examination targets so the learner model tailors your roadmap.</p>
        </div>

        <div class="space-y-3.5 text-xs">
          <div>
            <label class="block font-semibold text-slate-300 mb-1">Your Full Name</label>
            <input 
              type="text" 
              value="${oc.name}" 
              oninput="window.App.setOnboardingField('name', this.value)"
              class="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label class="block font-semibold text-slate-300 mb-1">Education Level</label>
              <select 
                onchange="window.App.setOnboardingField('educationLevel', this.value)"
                class="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-cyan-500">
                <option value="Undergraduate (B.Tech CS)" selected>Undergraduate (College)</option>
                <option value="High School / AP CS">High School / AP CS</option>
                <option value="Post-Graduate / Professional">Industry Professional</option>
              </select>
            </div>

            <div>
              <label class="block font-semibold text-slate-300 mb-1">Institution / Class</label>
              <input 
                type="text" 
                value="${oc.institution}" 
                oninput="window.App.setOnboardingField('institution', this.value)"
                class="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label class="block font-semibold text-slate-300 mb-1">Target Examination</label>
              <input 
                type="text" 
                value="${oc.targetExam}" 
                oninput="window.App.setOnboardingField('targetExam', this.value)"
                class="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label class="block font-semibold text-slate-300 mb-1">Knowledge Level</label>
              <select 
                onchange="window.App.setOnboardingField('knowledgeLevel', this.value)"
                class="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-cyan-500">
                <option value="Beginner">Beginner (Foundations)</option>
                <option value="Intermediate" selected>Intermediate (Loops, DSA)</option>
                <option value="Advanced">Advanced (Trees, Graphs)</option>
              </select>
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label class="block font-semibold text-slate-300 mb-1">Daily Available Study Time</label>
              <select 
                onchange="window.App.setOnboardingField('dailyStudyTime', this.value)"
                class="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-cyan-500">
                <option value="1 Hour / Day">1 Hour / Day</option>
                <option value="2 Hours / Day" selected>2 Hours / Day</option>
                <option value="3+ Hours / Day">3+ Hours / Day</option>
              </select>
            </div>

            <div>
              <label class="block font-semibold text-slate-300 mb-1">Explanation Language</label>
              <select 
                onchange="window.App.setOnboardingField('language', this.value)"
                class="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-cyan-500">
                <option value="en" selected>English</option>
                <option value="hi">हिंदी (Hindi + Tech Terms)</option>
              </select>
            </div>
          </div>
        </div>

        <div class="flex justify-end gap-3 pt-3 border-t border-slate-800">
          <button onclick="window.App.closeOnboarding()" class="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold">
            Cancel
          </button>
          <button 
            onclick="window.App.saveOnboarding()" 
            class="px-6 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-white font-bold text-xs shadow-md shadow-cyan-500/20 hover:scale-105 transition-all">
            Save Profile & Calibrate Model →
          </button>
        </div>

      </div>
    </div>
  `;
}
