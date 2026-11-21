# AptiLearn AI – Intelligent Adaptive Learning & Exam Preparation Platform

> **Tagline:** *"Your Knowledge. Your Pace. Your Personal AI Mentor."*

AptiLearn AI is a full-featured, modern, responsive AI-powered educational platform engineered to understand *how* individual students learn.

Unlike traditional chatbots that simply regurgitate answers or static test banks that only score percentages, AptiLearn AI continuously models student comprehension using Bayesian Knowledge Tracing (BKT) and ELO rating, diagnoses root cognitive misconceptions, predicts exam readiness, and personalizes the learner's journey across Java & Data Structures.

---

## 🌟 Key Features & Architecture

```
                       ┌─────────────────────────┐
                       │   Diagnostic Assessment │
                       └────────────┬────────────┘
                                    │
                                    ▼
                       ┌─────────────────────────┐
                       │ Bayesian Learner Model  │◄────────┐
                       └────────────┬────────────┘         │
                                    │                      │
       ┌────────────────────────────┼──────────────────────┤
       ▼                            ▼                      ▼
┌─────────────────────────┐  ┌────────────────────┐  ┌────────────────────────┐
│ 15-Node Knowledge Graph │  │ Adaptive Practice  │  │ AI Exam Readiness      │
└─────────────────────────┘  └──────────┬─────────┘  │ Predictor Engine       │
                                        │            └────────────────────────┘
                                        ▼
                             ┌────────────────────┐
                             │ Misconception Bug  │
                             │ Detection & Traces │
                             └──────────┬─────────┘
                                        │
                                        ▼
                             ┌────────────────────┐
                             │ Spaced Repetition  │
                             │ (SuperMemo SM-2)   │
                             └────────────────────┘
```

### 1. 🧠 Bayesian Learner Model (`js/learnerModel.js`)
- Continuously tracks **15 Java & DSA concepts** using Bayesian Knowledge Tracing ($P(L_0)=0.25$, $P(T)=0.18$, $P(G)=0.20$, $P(S)=0.05$).
- Tracks mastery scores ($0\% - 100\%$), response times, hint usage damping, and confidence ratings.
- Transparently visualizes concept understanding to eliminate overconfidence and guide targeted drills.

### 2. 🕸️ 15-Concept Interactive Knowledge Graph (`js/knowledgeGraph.js`)
- Comprehensive Java & DSA syllabus: *Variables, Data Types, Conditionals, Loops, Arrays, Strings, Functions, Recursion, Searching, Sorting, Linked Lists, Stacks, Queues, Trees, Graphs*.
- HTML5 Canvas with fluid zoom, pan, and interactive slide-out drawer displaying prerequisites, previous mistakes, and direct practice triggers.
- Quad-state visual color coding: 🟢 **Mastered** ($\ge 80\%$), 🟡 **Learning** ($50\% - 79\%$), 🔴 **Needs Improvement** ($< 50\%$), and ⚪ **Not Started**.

### 3. 🔬 AI Misconception Detection & Mistake Notebook (`js/misconceptionEngine.js`)
- Diagnoses **why** mistakes happen (e.g. *Missing Recursion Base Case*, *0-indexed Array Off-by-One*, *Pointer Loss in Linked Lists*).
- Side-by-side flawed vs. corrected code comparisons with execution traces.
- One-click bulk resolution: **"✓ Clear All Active Errors"**.

### 4. ⏱️ Real Exam Simulator (`js/components/examSimulatorView.js`)
- 15-minute countdown timer with color-coded warning thresholds.
- Interactive question palette with status indicators: *Answered*, *Unanswered*, and *Marked for Review*.
- Standardized competitive examination scoring scheme ($+1.0$ correct, $-0.25$ negative marking penalty).
- Instant post-exam scorecard showing accuracy, percentile, and subject-wise breakdown.

### 5. 💻 Interactive Java Coding Lab (`js/components/codingLabView.js`)
- Hands-on coding environment with preloaded LeetCode/DSA problems (*Two Sum*, *Valid Palindrome*, *Factorial Recursion*).
- Real-time syntax and logic guard detecting missing recursion termination conditions before execution.
- Instant test case evaluation with execution metrics and automated learner model feedback.

### 6. 📄 Smart Notes & PDF Document Analyzer (`js/documentAnalyzer.js`)
- Preloaded with sample curriculum handouts (*"Java Core Concepts: Memory & Scope"* and *"Recursion & Trees"*).
- Instant chapter summarization, auto-generated targeted MCQs, and flashcard extraction.
- Grounded contextual Q&A allowing students to query their course materials with verified page citations.

### 7. 📇 Smart 3D Flashcards & SuperMemo SM-2 Revision (`js/spacedRepetition.js`)
- Interactive 3D flip card animations showing front prompt and back answer.
- Self-assessment ratings: *Again (<10m)*, *Hard (1d)*, *Good (3d)*, *Easy (5d)*.
- Dedicated Revision Center prioritizing high-urgency and at-risk concepts with streak counters.

### 8. 🔮 AI Learning Predictor & Exam Readiness (`js/predictorEngine.js`)
- Multi-factor score forecasting based on Bayesian mastery, streak consistency, and revision completion rates.
- Topic vulnerability breakdown identifying high-risk failure points with ranked study priorities.

### 9. 🤖 Socratic AI Tutor with "Explain It Again" Modes (`js/tutorEngine.js`)
- 5 instant explanation modes:
  1. 👶 **Explain Simply (ELI5):** Intuitive real-world analogies.
  2. 🪆 **Explain with Analogy:** Russian dolls, library shelves, conveyor belts.
  3. 🪜 **Explain Step-by-Step:** Execution trace with variable state snapshots.
  4. 📊 **Explain Visually:** ASCII call stack and memory layout diagrams.
  5. 📝 **Practice Quiz:** Follow-up mini-puzzles to test retention.
- Full Web Speech API voice read-aloud support.

### 10. 👥 Multi-Role Portals & Multi-Language Support
- **Student Dashboard:** Daily streak, quests, syllabus progress, and AI recommendations.
- **Teacher Portal:** Cohort mastery heatmap, at-risk student flags, and class-wide misconception analytics.
- **Parent/Mentor Portal:** High-level consistency summaries, weekly study hours, and non-technical progress reports.
- **Language Switcher:** Instant toggle between 🇬🇧 English and 🇮🇳 हिंदी.
- **Theme Switcher:** Seamless transition between Deep Midnight Blue (`dark`) and Clean Editorial (`light`).

---

## 🚀 Getting Started Locally

### Prerequisites
- Python 3.8+
- Modern Web Browser (Chrome, Firefox, Safari, Edge)

### Installation & Run
```bash
# Clone your repository
git clone https://github.com/<your-username>/aptilearn-ai.git
cd aptilearn-ai

# Start the local HTTP/API server
python3 server.py --port 5173
```

Open **`http://localhost:5173/`** in your browser to experience the platform!

---

## 📁 Repository Structure

```
├── index.html                   # Responsive client application shell & mount points
├── server.py                    # Zero-dependency Python 3 HTTP server & API endpoints
├── css/
│   └── styles.css               # Dark & light theme styles, glassmorphism, animations
├── data/
│   └── learniq_state.json       # Persisted server state cache
├── js/
│   ├── app.js                   # Application orchestrator, router & event handlers
│   ├── config.js                # 15-concept syllabus, default personas & coding problems
│   ├── state.js                 # Central reactive state store & localStorage sync
│   ├── soundFx.js               # Web Audio synth chimes & SpeechSynthesis voice
│   ├── learnerModel.js          # Bayesian Knowledge Tracing & ELO rating engine
│   ├── knowledgeGraph.js        # HTML5 Canvas knowledge graph renderer (zoom & pan)
│   ├── questionBank.js          # Curated Java & DSA question repository & distractors
│   ├── adaptiveEngine.js        # Dynamic difficulty scaling & question selection
│   ├── misconceptionEngine.js   # Cognitive bug detection & code counterexamples
│   ├── spacedRepetition.js      # SuperMemo SM-2 interval expansion scheduler
│   ├── tutorEngine.js           # Socratic AI tutor with 5 explanation modes
│   ├── predictorEngine.js       # AI exam readiness & difficulty forecaster
│   ├── documentAnalyzer.js      # Smart notes, PDF analyzer, auto-MCQs & grounded Q&A
│   └── components/
│       ├── navbar.js            # Top navigation bar with Sign In & theme/language controls
│       ├── landingPage.js       # Modern landing page with hero, pricing & comparison
│       ├── dashboardView.js     # Student overview with mastery gauge & daily quests
│       ├── diagnosticView.js    # Placement diagnostic test & assessment report
│       ├── graphView.js         # Interactive syllabus knowledge graph view
│       ├── practiceView.js      # Adaptive question arena with progressive hints
│       ├── misconceptionView.js # Mistake Notebook with counterexample code diffs
│       ├── revisionView.js      # Spaced repetition revision review center
│       ├── examSimulatorView.js # Real mock exam simulator with 15-min timer & palette
│       ├── codingLabView.js     # Java coding practice lab with AST base case guard
│       ├── notesView.js         # Document analyzer with auto-MCQs & document Q&A
│       ├── flashcardsView.js    # 3D interactive flip flashcards
│       ├── predictorView.js     # Exam readiness forecast & study priority rankings
│       ├── plannerView.js       # 7-day timetable with missed-task auto-rescheduling
│       ├── tutorView.js         # Socratic chat with "Explain It Again" modes
│       ├── teacherView.js       # Educator cohort heatmap & at-risk student list
│       ├── parentView.js        # Parent consistency & weekly study hour summaries
│       ├── reportsView.js       # Printable PDF-ready performance report
│       ├── authModal.js         # Sign In, Google auth, registration & API vault modal
│       ├── onboardingModal.js   # First-time student survey modal
│       └── guidedTourModal.js   # 12-Step Signature Hackathon demonstration walkthrough
```
