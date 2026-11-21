# LearnIQ – Adaptive AI Exam-Prep Tutor with a Learner Model

LearnIQ is an intelligent exam-preparation platform that understands *how* each student learns.

Unlike traditional AI chatbots that simply answer questions or static question banks that compute raw percentage marks, LearnIQ continuously models student comprehension, identifies weak concepts, detects underlying cognitive misconceptions, adjusts difficulty dynamically, and guarantees retention via SuperMemo SM-2 spaced repetition.

---

## 🌟 Key Architecture & Differentiators

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
                   ┌────────────────┴────────────────┐     │
                   ▼                                 ▼     │
      ┌─────────────────────────┐       ┌────────────────────────┐
      │ Dynamic Knowledge Graph │       │ Adaptive Question Gen  │
      └─────────────────────────┘       └────────────┬───────────┘
                                                     │
                                                     ▼
                                        ┌────────────────────────┐
                                        │ Misconception Engine   │
                                        │ (Reasoning & Traces)   │
                                        └────────────┬───────────┘
                                                     │
                                                     ▼
                                        ┌────────────────────────┐
                                        │ Spaced Repetition SM-2 │
                                        └────────────────────────┘
```

### 1. Bayesian Learner Model
- Tracks **concept-wise mastery** ($0\% - 100\%$) based on correctness, difficulty weighting, response time, and confidence calibration.
- Detects **overconfidence** (answering wrong with high confidence) to immediately trigger root cause remediation.
- Consecutive mistake tracking dampens score and activates scaffolding hints.

### 2. Interactive Concept Knowledge Graph
- Visual prerequisite dependency graph for Java & DSA (Variables, Loops, Arrays, Strings, Functions, Recursion, Searching, Sorting, Linked Lists, Stacks, Queues, Binary Trees).
- 4 Visual States:
  - 🟢 **Green (Mastered)**: Mastery $\ge 75\%$
  - 🟡 **Yellow (Learning)**: Mastery $40\% - 74\%$
  - 🔴 **Red (Needs Improvement)**: Mastery $< 40\%$ with active errors
  - ⚪ **Grey (Not Started)**: 0 attempts
- Interactive zoom, pan, and click slideover drawer with direct "Practice This Concept" drill.

### 3. Misconception Detection & Reasoning Analysis
- Pinpoints **WHY** a student failed rather than simply marking it wrong.
- Analyzes student reasoning and distractor patterns (e.g., Missing Recursion Base Case, Array Off-by-One indexing, Pass-by-Value reference mutation).
- Generates side-by-side flawed vs correct code comparisons and step-by-step execution traces.

### 4. Spaced Repetition (SuperMemo SM-2)
- Automatically schedules review micro-quizzes before memory decay occurs.
- Dynamic interval expansion based on recall quality ($1d \to 2d \to 4d \to 7d$).

### 5. AI Personal Tutor ("Socrates AI")
- Socratic questioning, beginner-friendly analogies, and progressive hints.
- Contextually aware of the student's active weak concepts and recent mistakes.

### 6. Teacher / Cohort Intelligence Portal
- Cohort average mastery and accuracy.
- Difficult concepts heatmap and aggregate misconception frequencies.
- At-Risk student alerts and individual learner model drill-down.

---

## 🚀 Quick Start & Running

Start the self-contained server with Python 3:

```bash
# In the learniq directory:
python3 server.py --port 5173
```

Open your browser to:
👉 **`http://localhost:5173`**

*(Or double-click `index.html` to run in standalone browser mode! All features run client-side with persistent storage and optional live backend sync).*

---

## 🏆 Hackathon Judge 9-Step Evaluation Tour

Click the **"Judge 9-Step Tour"** pill in the top header or landing page to step through the complete differentiated workflow:

1. **Diagnostic Assessment**: Take baseline test across topics.
2. **Weak Concept Identification**: Learner model flags Recursion & Arrays.
3. **Knowledge Graph Updates**: Visual states update to Red, Amber, Green.
4. **Targeted Question Generation**: System generates questions on weak areas.
5. **Student Reasoning Submission**: Student inputs their mental model reasoning.
6. **Misconception Detection**: System isolates root cause with code trace counterexample.
7. **Bayesian Model Calibration**: Mastery score updates dynamically.
8. **Spaced Repetition Scheduling**: SM-2 creates today's review task.
9. **Mastery Scaled Up**: After improvement, difficulty scales to Hard!
