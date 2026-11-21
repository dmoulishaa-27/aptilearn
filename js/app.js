// LearnIQ Studio 3.0 Core Orchestrator & Global Router
import { store } from './state.js';
import { renderSidebar } from './components/sidebar.js';
import { renderTopBar } from './components/topBar.js';
import { renderCommandPalette, commandPalette } from './components/commandPalette.js';
import { renderLandingPage } from './components/landingPage.js';
import { renderDashboardView, initCognitiveRadarChart } from './components/dashboardView.js';
import { renderDiagnosticView, diagnosticController } from './components/diagnosticView.js';
import { renderGraphView, initGraphCanvas, graphZoomIn, graphZoomOut, graphResetView } from './components/graphView.js';
import { renderPracticeView, practiceState } from './components/practiceView.js';
import { renderMisconceptionView } from './components/misconceptionView.js';
import { renderRevisionView, revisionController } from './components/revisionView.js';
import { renderTutorView, tutorEngine } from './components/tutorView.js';
import { renderPredictorView } from './components/predictorView.js';
import { renderNotesView, notesController } from './components/notesView.js';
import { renderFlashcardsView, flashcardController } from './components/flashcardsView.js';
import { renderExamSimulatorView, examController } from './components/examSimulatorView.js';
import { renderCodingLabView, codingController } from './components/codingLabView.js';
import { renderPlannerView } from './components/plannerView.js';
import { renderTeacherView, teacherController } from './components/teacherView.js';
import { renderParentView } from './components/parentView.js';
import { renderReportsView } from './components/reportsView.js';
import { renderAuthModal, authController } from './components/authModal.js';
import { renderOnboardingModal, onboardingController } from './components/onboardingModal.js';
import { renderGuidedTourModal, tourController } from './components/guidedTourModal.js';
import { MisconceptionEngine } from './misconceptionEngine.js';
import { sound } from './soundFx.js';

class AptiLearnApp {
  constructor() {
    this.personaMenuOpen = false;
    this.sidebarDrawerOpen = false;
    this.notifMenuOpen = false;
    this.init();
  }

  init() {
    window.App = this;

    store.subscribe(() => {
      this.render();
    });

    this.render();

    if (window.location.search.includes('tour=true')) {
      setTimeout(() => this.openGuidedTour(), 500);
    }
  }

  render() {
    const sidebarEl = document.getElementById('sidebar-container');
    const topbarEl = document.getElementById('topbar-container');
    const contentEl = document.getElementById('main-content');
    const cmdPaletteEl = document.getElementById('command-palette-container');
    const authModalEl = document.getElementById('auth-modal-container');
    const tourModalEl = document.getElementById('guided-tour-container');
    const onbModalEl = document.getElementById('onboarding-modal-container');

    if (sidebarEl) sidebarEl.innerHTML = renderSidebar();
    if (topbarEl) topbarEl.innerHTML = renderTopBar();
    if (cmdPaletteEl) cmdPaletteEl.innerHTML = renderCommandPalette();
    if (authModalEl) authModalEl.innerHTML = renderAuthModal();
    if (tourModalEl) tourModalEl.innerHTML = renderGuidedTourModal();
    if (onbModalEl) onbModalEl.innerHTML = renderOnboardingModal();

    if (!contentEl) return;

    switch (store.currentRoute) {
      case 'landing':
        contentEl.innerHTML = renderLandingPage();
        break;
      case 'dashboard':
        contentEl.innerHTML = renderDashboardView();
        setTimeout(() => initCognitiveRadarChart(), 60);
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
      case 'coding':
        contentEl.innerHTML = renderCodingLabView();
        break;
      case 'exam':
        contentEl.innerHTML = renderExamSimulatorView();
        break;
      case 'misconceptions':
        contentEl.innerHTML = renderMisconceptionView();
        break;
      case 'revision':
        contentEl.innerHTML = renderRevisionView();
        break;
      case 'notes':
        contentEl.innerHTML = renderNotesView();
        break;
      case 'flashcards':
        contentEl.innerHTML = renderFlashcardsView();
        break;
      case 'tutor':
        contentEl.innerHTML = renderTutorView();
        setTimeout(() => {
          const container = document.getElementById('tutor-messages-container');
          if (container) container.scrollTop = container.scrollHeight;
        }, 50);
        break;
      case 'predictor':
        contentEl.innerHTML = renderPredictorView();
        break;
      case 'planner':
        contentEl.innerHTML = renderPlannerView();
        break;
      case 'teacher':
        contentEl.innerHTML = renderTeacherView();
        break;
      case 'parent':
        contentEl.innerHTML = renderParentView();
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
    this.notifMenuOpen = false;
    store.setRoute(route, params);
  }

  // UI Theme, Language & Voice
  toggleTheme() {
    const next = store.theme === 'dark' ? 'light' : 'dark';
    store.setTheme(next);
  }

  toggleLanguage() {
    const next = store.language === 'en' ? 'hi' : 'en';
    store.setLanguage(next);
    sound.playClick();
  }

  toggleVoice() {
    store.toggleVoice();
    sound.playClick();
  }

  // Persona Actions
  togglePersonaMenu() {
    this.personaMenuOpen = !this.personaMenuOpen;
    const menu = document.getElementById('persona-menu');
    if (menu) menu.classList.toggle('hidden', !this.personaMenuOpen);
  }

  toggleSidebarDrawer() {
    this.sidebarDrawerOpen = !this.sidebarDrawerOpen;
    const sb = document.getElementById('sidebar-container');
    if (sb) {
      sb.classList.toggle('hidden', !this.sidebarDrawerOpen);
    }
  }

  // Command Palette (⌘K)
  openCommandPalette() {
    commandPalette.open();
  }

  closeCommandPalette() {
    commandPalette.close();
  }

  setCommandPaletteQuery(q) {
    commandPalette.setQuery(q);
  }

  executeCommand(idx) {
    commandPalette.selectedIndex = idx;
    commandPalette.executeSelected();
  }

  toggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
    const menu = document.getElementById('mobile-menu');
    if (menu) menu.classList.toggle('hidden', !this.mobileMenuOpen);
  }

  toggleNotificationMenu() {
    this.notifMenuOpen = !this.notifMenuOpen;
    const menu = document.getElementById('notifications-menu');
    if (menu) menu.classList.toggle('hidden', !this.notifMenuOpen);
  }

  markAllNotificationsRead() {
    store.markNotificationsRead();
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
  openSignIn() {
    this.personaMenuOpen = false;
    authController.open('login');
  }

  openSignUp() {
    this.personaMenuOpen = false;
    authController.open('register');
  }

  openForgotPassword() {
    this.personaMenuOpen = false;
    authController.open('forgot');
  }

  signOut() {
    this.personaMenuOpen = false;
    store.logout();
    sound.playClick();
    store.addNotification({
      title: "Signed Out",
      desc: "You have signed out of your account.",
      type: "auth"
    });
  }

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
  setAuthPassword(val) { authController.password = val; }
  setAuthName(val) { authController.name = val; }
  setAuthGoal(val) { authController.examGoal = val; }
  setAuthLevel(val) { authController.level = val; }
  setAuthRole(val) { authController.role = val; authController.message = null; store.notify(); }
  toggleShowPassword() { authController.toggleShowPassword(); }
  loginWithGoogle() { authController.loginWithGoogle(); }
  quickPersonaLogin(key) { authController.quickPersonaLogin(key); }

  submitAuthLogin() { authController.submitLogin(); }
  submitAuthRegister() { authController.submitRegister(); }
  submitAuthForgot() { authController.submitForgot(); }
  saveApiKey(key) { authController.saveSettings(key); }

  // Onboarding
  openOnboarding() {
    this.togglePersonaMenu();
    onboardingController.open();
  }

  closeOnboarding() {
    onboardingController.close();
  }

  setOnboardingField(field, val) {
    onboardingController[field] = val;
  }

  saveOnboarding() {
    onboardingController.save();
  }

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

  clearAllMisconceptions() {
    MisconceptionEngine.resolveAll();
    sound.playLevelUp();
    store.addNotification({
      title: "All Errors Cleared",
      desc: "All active misconceptions and cognitive bugs have been remediated.",
      type: "misconception"
    });
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

  // AI Tutor & Explain It Again
  async askTutor(question) {
    store.setRoute('tutor');
    setTimeout(async () => {
      await tutorEngine.sendMessage(question);
      store.notify();
    }, 100);
  }

  async tutorExplainMode(mode) {
    sound.playClick();
    await tutorEngine.explainItAgain(mode);
    store.notify();
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

  // Smart Notes
  setDocTab(tab) {
    notesController.setTab(tab);
  }

  selectDoc(id) {
    notesController.setActiveDocument(id);
  }

  handleDocUpload(e) {
    notesController.handleFileUpload(e);
  }

  askDocQuestion(q) {
    notesController.askDocument(q);
  }

  selectDocMCQ(qIdx, oIdx) {
    notesController.selectMCQOption(qIdx, oIdx);
  }

  flipDocFlashcard() {
    notesController.flipFlashcard();
  }

  nextDocFlashcard() {
    notesController.nextFlashcard();
  }

  prevDocFlashcard() {
    notesController.prevFlashcard();
  }

  // Smart Flashcards Deck
  flipFlashcardDeck() {
    flashcardController.flip();
  }

  rateFlashcardDeck(rating) {
    flashcardController.rateCard(rating);
  }

  nextFlashcardDeck() {
    flashcardController.next();
  }

  prevFlashcardDeck() {
    flashcardController.prev();
  }

  // Real Exam Simulator
  startSimulatedExam(timed) {
    examController.startExam(timed);
  }

  examSelectOption(optIdx) {
    examController.selectOption(optIdx);
  }

  examToggleReview() {
    examController.toggleReviewFlag();
  }

  examGoTo(idx) {
    examController.goToQuestion(idx);
  }

  examNext() {
    examController.nextQuestion();
  }

  examPrev() {
    examController.prevQuestion();
  }

  submitSimulatedExam() {
    examController.submitExam();
  }

  exitExamSimulator() {
    examController.exitExam();
  }

  // Coding Lab
  selectCodingProblem(id) {
    codingController.selectProblem(id);
  }

  updateCodeLab(code) {
    codingController.updateCode(code);
  }

  revealCodingHint() {
    codingController.revealHint();
  }

  runCodingLab() {
    codingController.runCode();
  }

  clearCodingLabResults() {
    codingController.clearResults();
  }

  // Study Planner
  togglePlannerTask(taskId) {
    store.toggleStudyTask(taskId);
  }

  rescheduleMissedTasks() {
    store.rescheduleMissedTasks();
    sound.playLevelUp();
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

  // Judge Guided 12-Step Tour
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

document.addEventListener('DOMContentLoaded', () => {
  new AptiLearnApp();
});
