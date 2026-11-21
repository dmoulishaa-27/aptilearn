// LearnIQ Misconception Detection & Reasoning Analysis Engine
import { store } from './state.js';
import { SYLLABUS_CONCEPTS } from './config.js';

export const MISCONCEPTION_KNOWLEDGE_BASE = {
  RECURSION_MISSING_BASE_CASE: {
    title: "Missing or Omitted Recursion Base Case",
    category: "Control Flow & Recursion",
    severity: "Critical",
    explanation: "You recognized the recursive formula, but omitted the terminating condition. A recursive function has no built-in intuition to stop. In Java, each recursive call allocates a new stack frame; without an explicit base case guard (e.g. `if (n <= 1) return 1;`), it runs until the JVM exhausts thread stack memory and crashes with `java.lang.StackOverflowError`.",
    counterExample: {
      incorrectCode: "// Problematic: No base case\nint sum(int n) {\n    return n + sum(n - 1); // Continues into negative infinity\n}",
      correctCode: "// Correct: Guard condition at Line 1\nint sum(int n) {\n    if (n <= 0) return 0; // Terminating Base Case\n    return n + sum(n - 1);\n}",
      trace: "sum(2) -> 2 + sum(1) -> 2 + 1 + sum(0) -> returns 0 -> unwinds cleanly to 3."
    },
    targetedExercise: "Write a recursive countdown method with a base case at n == 0.",
    recommendedQuizId: "rec_base_fix"
  },
  ARRAY_OFF_BY_ONE: {
    title: "Array Index Boundary Hazard (Length vs Last Index)",
    category: "Data Structures & Memory",
    severity: "Moderate",
    explanation: "In Java, arrays use zero-based indexing. For an array of size N, valid indices are `0, 1, 2, ..., N - 1`. Accessing `array[array.length]` or looping with `i <= array.length` attempts to read an index that does not exist, triggering an `ArrayIndexOutOfBoundsException`.",
    counterExample: {
      incorrectCode: "int[] arr = new int[5];\nfor (int i = 0; i <= arr.length; i++) { // Crash at i = 5\n    System.out.println(arr[i]);\n}",
      correctCode: "int[] arr = new int[5];\nfor (int i = 0; i < arr.length; i++) {  // Safe: stops at index 4\n    System.out.println(arr[i]);\n}",
      trace: "Array length is 5. Valid indices are 0 to 4. Index 5 causes out-of-bounds exception."
    },
    targetedExercise: "Fix loop boundary conditions on a 2D matrix traversal.",
    recommendedQuizId: "arr_01"
  },
  PASS_BY_VALUE_REFERENCE_CONFUSION: {
    title: "Confusion Between Object Reference Mutation vs Variable Reassignment",
    category: "Java Language Semantics",
    severity: "High",
    explanation: "Java is strictly pass-by-value. When an object reference is passed to a method, the method receives a copy of the reference pointer. You can mutate the contents of the object (`arr[0] = 99;`), but reassigning the parameter variable (`arr = new int[5];`) only alters the local method variable, leaving the caller's variable untouched.",
    counterExample: {
      incorrectCode: "void reset(int[] a) {\n    a = new int[]{0, 0}; // Only repoints local parameter 'a'!\n}",
      correctCode: "void reset(int[] a) {\n    Arrays.fill(a, 0);   // Mutates heap object contents in-place\n}",
      trace: "Caller array address remains identical in caller stack frame."
    },
    targetedExercise: "Differentiate parameter mutation from local variable reassignment.",
    recommendedQuizId: "arr_02"
  },
  UNWINDING_STACK_MISCONCEPTION: {
    title: "Overlooking Call Stack Unwinding Phase",
    category: "Algorithms & Execution Flow",
    severity: "Moderate",
    explanation: "When a recursive call is made, execution on the current frame pauses until all descendant calls finish. Any statements placed after the recursive call will execute in reverse order as the stack frames unwind.",
    counterExample: {
      incorrectCode: "// Expecting only top-down printing\nprint(n);\nrecurse(n - 1);\nprint(n); // Executes in reverse when returning!",
      correctCode: "// Explicitly separate descending phase from ascending phase",
      trace: "Descending phase: 3, 2, 1 -> Base case -> Ascending unwinding: 1, 2, 3."
    },
    targetedExercise: "Trace call stack frames of a pre-order vs post-order recursive tree traversal.",
    recommendedQuizId: "rec_02"
  },
  POINTER_OVERWRITE_CONFUSION: {
    title: "Orphaning Linked List Chains via Premature Pointer Assignment",
    category: "Data Structures",
    severity: "High",
    explanation: "In singly linked lists, each node only knows about its immediate next node. Assigning `curr.next = prev` immediately severs the link to the rest of the list. You must always cache the forward link in a temporary pointer (`ListNode nextTemp = curr.next;`) before reassigning.",
    counterExample: {
      incorrectCode: "curr.next = prev; // Lost reference to rest of chain!\ncurr = curr.next;",
      correctCode: "ListNode nextTemp = curr.next; // Cache first!\ncurr.next = prev;\ncurr = nextTemp;",
      trace: "Without caching, the rest of the list is garbage-collected."
    },
    targetedExercise: "Implement linked list cycle detection without severing node links.",
    recommendedQuizId: "ll_01"
  }
};

export class MisconceptionEngine {
  /**
   * Analyzes an incorrect answer and student reasoning to diagnose root misconception
   */
  static diagnose({ question, selectedOptionIndex, studentReasoning = "" }) {
    if (!question || !question.options) return null;
    const option = question.options[selectedOptionIndex];
    if (!option || option.isCorrect) return null;

    let key = option.misconceptionKey;
    const reasoningLower = studentReasoning.toLowerCase();

    // Semantic keyword analysis on student's self-entered reasoning
    if (reasoningLower.includes("stop") && (reasoningLower.includes("automatic") || reasoningLower.includes("negative"))) {
      key = "RECURSION_MISSING_BASE_CASE";
    } else if (reasoningLower.includes("size") && (reasoningLower.includes("5th") || reasoningLower.includes("out of bound"))) {
      key = "ARRAY_OFF_BY_ONE";
    } else if (reasoningLower.includes("pass by reference") || reasoningLower.includes("reassign")) {
      key = "PASS_BY_VALUE_REFERENCE_CONFUSION";
    }

    const template = (key && MISCONCEPTION_KNOWLEDGE_BASE[key]) 
      ? MISCONCEPTION_KNOWLEDGE_BASE[key] 
      : {
          title: `Logical Invariant Gap in ${question.title || "Concept"}`,
          category: "Conceptual Logic",
          severity: "Moderate",
          explanation: option.reason || "The selected answer reflects a misunderstanding of the execution invariants.",
          counterExample: {
            incorrectCode: question.code || "// Flawed approach",
            correctCode: "// Corrected invariant implementation",
            trace: question.explanation || "Revisit the prerequisites."
          },
          targetedExercise: "Review the fundamental definitions and trace step-by-step.",
          recommendedQuizId: question.id
        };

    const user = store.currentUser;
    if (!user.activeMisconceptions) user.activeMisconceptions = [];

    // Create unique record
    const misconceptionRecord = {
      id: `misc_${Date.now()}`,
      conceptId: question.conceptId,
      conceptName: (SYLLABUS_CONCEPTS.find(c => c.id === question.conceptId) || {}).name || question.conceptId,
      title: template.title,
      severity: template.severity,
      detectedAt: new Date().toISOString(),
      resolved: false,
      studentReasoning: studentReasoning || "Selected incorrect distractor.",
      explanation: template.explanation,
      counterExample: template.counterExample,
      remediationQuizId: template.recommendedQuizId || question.id
    };

    // Add to state if not duplicate title
    const existing = user.activeMisconceptions.find(m => m.title === template.title && !m.resolved);
    if (!existing) {
      user.activeMisconceptions.unshift(misconceptionRecord);
      store.saveState();
    }

    return misconceptionRecord;
  }

  /**
   * Resolves an active misconception after student demonstrates mastery in remediation
   */
  static resolve(misconceptionId) {
    const user = store.currentUser;
    if (!user || !user.activeMisconceptions) return;

    const target = user.activeMisconceptions.find(m => m.id === misconceptionId);
    if (target) {
      target.resolved = true;
      target.resolvedAt = new Date().toISOString();
      store.addXp(120, `Resolved misconception: ${target.title}`);
      store.saveState();
    }
  }
}
