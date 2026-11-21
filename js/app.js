// LearnIQ Application Core Orchestrator & Global Router
import { store } from './state.js';
import { renderNavbar } from './components/navbar.js';
import { renderLandingPage } from './components/landingPage.js';
import { renderDashboardView } from './components/dashboardView.js';
import { renderDiagnosticView, diagnosticController } from './components/diagnosticView.js';
import { renderGraphView, initGraphCanvas, graphZoomIn, graphZoomOut, graphResetView } from './components/graphView.js';
import { renderPracticeView, practiceState } from './components/practiceView.js';
import { renderMisconceptionView } from './components/misconceptionView.js';
import { renderRevisionView, revisionController } from './components/revisionView.js';
import { renderTutorView } from './components/tutorView.js';
import { tutorEngine } from './tutorEngine.js';
import { renderTeacherView, teacherController } from './components/teacherView.js';
import { renderReportsView } from './components/reportsView.js';
import { renderAuthModal, authController } from './components/authModal.js';
import { renderGuidedTourModal, tourController } from './components/guidedTourModal.js';
import { MisconceptionEngine } from './misconceptionEngine.js';
import { sound } from './soundFx.js';

class LearnIQApp {
  constructor() {
    this.personaMenuOpen = false;
    this.mobileMenuOpen = false;
    this.init();
  }

  init() {
    // Expose global controller
    window.App = this;

    // Listen to store updates
    store.subscribe(() => {
      this.render();
    });

    // Initial render
    this.render();

    // Auto-open guided tour if URL has ?tour=true or fresh start
    if (window.location.search.includes('tour=true')) {
      setTimeout(() => this.openGuidedTour(), 500);
    }
  }

  render() {
    const navbarEl = document.getElementById('navbar-container');
    const contentEl = document.getElementById('main-content');
    const authModalEl = document.getElementById('auth-modal-container');
    const tourModalEl = document.getElementById('guided-tour-container');

    if (navbarEl) navbarEl.innerHTML = renderNavbar();
    if (authModalEl) authModalEl.innerHTML = renderAuthModal();
    if (tourModalEl) tourModalEl.innerHTML = renderGuidedTourModal();

    if (!contentEl) return;

    switch (store.currentRoute) {
      case 'landing':
        contentEl.innerHTML = renderLandingPage();
        break;
      case 'dashboard':
        contentEl.innerHTML = renderDashboardView();
        break;
      case 'diagnostic':
        contentEl.innerHTML = renderDiagnosticView();
        break;
      case 'graph':
        contentEl.innerHTML = renderGraphView();
        setTimeout(() => initGraphCanvas(), 50);
        break;
      case 'practice':
        contentEl.innerHTML = renderPracticeView();
        break;
      case 'misconceptions':
        contentEl.innerHTML = renderMisconceptionView();
        break;
      case 'revision':
        contentEl.innerHTML = renderRevisionView();
        break;
      case 'tutor':
        contentEl.innerHTML = renderTutorView();
        // Scroll messages to bottom
        setTimeout(() => {
          const container = document.getElementById('tutor-messages-container');
          if (container) container.scrollTop = container.scrollHeight;
        }, 50);
        break;
      case 'teacher':
        contentEl.innerHTML = renderTeacherView();
        break;
      case 'reports':
        contentEl.innerHTML = renderReportsView();
        break;
      default:
        contentEl.innerHTML = renderDashboardView();
    }
  }

  // Navigation
  navigate(route, params = {}) {
    sound.playClick();
    this.personaMenuOpen = false;
    this.mobileMenuOpen = false;
    store.setRoute(route, params);
  }

  // Persona Actions
  togglePersonaMenu() {
    this.personaMenuOpen = !this.personaMenuOpen;
    const menu = document.getElementById('persona-menu');
    if (menu) {
      menu.classList.toggle('hidden', !this.personaMenuOpen);
    }
  }

  toggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
    const menu = document.getElementById('mobile-menu');
    if (menu) {
      menu.classList.toggle('hidden', !this.mobileMenuOpen);
    }
  }

  switchPersona(personaKey) {
    this.togglePersonaMenu();
    sound.playLevelUp();
    store.switchPersona(personaKey);
  }

  toggleSound() {
    store.toggleSound();
  }

  // Auth & Settings
  openSettingsModal() {
    this.togglePersonaMenu();
    authController.open('settings');
  }

  closeAuthModal() {
    authController.close();
  }

  switchAuthMode(mode) {
    authController.open(mode);
  }

  setAuthEmail(val) { authController.email = val; }
  setAuthName(val) { authController.name = val; }
  setAuthGoal(val) { authController.examGoal = val; }
  setAuthLevel(val) { authController.level = val; }

  submitAuthLogin() { authController.submitLogin(); }
  submitAuthRegister() { authController.submitRegister(); }
  submitAuthForgot() { authController.submitForgot(); }
  saveApiKey(key) { authController.saveSettings(key); }

  // Diagnostic
  startDiagnostic() {
    store.setRoute('diagnostic');
  }

  startDiagnosticTest() {
    diagnosticController.startTest();
  }

  diagnosticSelectOption(optIdx) {
    diagnosticController.selectOption(optIdx);
  }

  diagnosticSetConfidence(conf) {
    diagnosticController.setConfidence(conf);
  }

  diagnosticNext() {
    diagnosticController.nextQuestion();
  }

  diagnosticPrev() {
    diagnosticController.prevQuestion();
  }

  diagnosticSubmit() {
    diagnosticController.submitAssessment();
  }

  diagnosticFinish() {
    diagnosticController.finishReport();
  }

  // Knowledge Graph
  openConceptDetail(conceptId) {
    sound.playClick();
    store.selectedConceptForModal = conceptId;
    store.notify();
  }

  closeConceptModal() {
    store.selectedConceptForModal = null;
    store.notify();
  }

  graphZoomIn() { graphZoomIn(); }
  graphZoomOut() { graphZoomOut(); }
  graphResetView() { graphResetView(); }

  // Practice Arena
  async startAdaptivePractice(conceptId = null) {
    sound.playClick();
    await practiceState.loadQuestion(conceptId);
    store.setRoute('practice');
  }

  practiceSelectOption(idx) {
    practiceState.selectOption(idx);
  }

  practiceSetReasoning(txt) {
    practiceState.studentReasoning = txt;
  }

  practiceSetConfidence(conf) {
    practiceState.setConfidence(conf);
  }

  practiceRevealHint() {
    practiceState.revealNextHint();
  }

  practiceSubmit() {
    practiceState.submitAnswer();
  }

  // Misconceptions
  resolveMisconceptionManually(id) {
    MisconceptionEngine.resolve(id);
    sound.playCorrect();
    store.notify();
  }

  // Spaced Repetition (SM-2)
  startRevisionCard(id) {
    const card = store.currentUser?.spacedRepetitionQueue?.find(c => c.id === id);
    if (card) {
      revisionController.startReview(card);
    }
  }

  flipRevisionCard() {
    revisionController.flipCard();
  }

  rateRevisionCard(q) {
    revisionController.rateRecall(q);
  }

  closeRevisionModal() {
    revisionController.closeModal();
  }

  // AI Tutor
  async askTutor(question) {
    store.setRoute('tutor');
    setTimeout(async () => {
      await tutorEngine.sendMessage(question);
      store.notify();
    }, 100);
  }

  async submitTutorChat() {
    const input = document.getElementById('tutor-chat-input');
    if (!input || !input.value.trim()) return;
    const text = input.value.trim();
    input.value = "";
    sound.playClick();
    await tutorEngine.sendMessage(text);
    store.notify();
  }

  // Teacher View
  inspectStudent(id) {
    const student = teacherController.cohortData?.atRiskStudents?.find(s => s.id === id);
    if (student) {
      teacherController.inspectStudent(student);
    }
  }

  closeStudentInspection() {
    teacherController.closeStudentModal();
  }

  // Judge Guided 9-Step Tour
  openGuidedTour() {
    tourController.open(0);
  }

  closeGuidedTour() {
    tourController.close();
  }

  tourGoTo(idx) {
    tourController.goToStep(idx);
  }

  tourNext() {
    tourController.next();
  }

  tourPrev() {
    tourController.prev();
  }
}

// Instantiate on window load
document.addEventListener('DOMContentLoaded', () => {
  new LearnIQApp();
});
