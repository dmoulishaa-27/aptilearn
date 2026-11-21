// LearnIQ Configuration, Syllabus Structure & Personas
export const SYLLABUS_CONCEPTS = [
  {
    id: "variables",
    name: "Variables & Data Types",
    shortName: "Variables",
    category: "Foundations",
    description: "Primitive types, reference types, type casting, memory allocation, and wrapper classes in Java.",
    prerequisites: [],
    x: 100,
    y: 200,
    estimatedMinutes: 25,
    difficulty: "Easy"
  },
  {
    id: "conditionals",
    name: "Conditionals & Logic",
    shortName: "Conditionals",
    category: "Control Flow",
    description: "Boolean logic, if-else chains, switch statements, short-circuit evaluation, and ternary operators.",
    prerequisites: ["variables"],
    x: 240,
    y: 120,
    estimatedMinutes: 30,
    difficulty: "Easy"
  },
  {
    id: "loops",
    name: "Loops & Iteration",
    shortName: "Loops",
    category: "Control Flow",
    description: "for, while, do-while loops, nested loops, break/continue statements, and off-by-one boundary hazards.",
    prerequisites: ["conditionals"],
    x: 380,
    y: 120,
    estimatedMinutes: 35,
    difficulty: "Easy"
  },
  {
    id: "functions",
    name: "Methods & Scope",
    shortName: "Functions",
    category: "Foundations",
    description: "Method signatures, pass-by-value vs reference passing, parameter passing, return values, variable shadowing.",
    prerequisites: ["variables"],
    x: 240,
    y: 280,
    estimatedMinutes: 40,
    difficulty: "Medium"
  },
  {
    id: "arrays",
    name: "Arrays & Memory",
    shortName: "Arrays",
    category: "Data Structures",
    description: "Contiguous memory allocation, indexing (0 to length - 1), bounds checking, multidimensional arrays.",
    prerequisites: ["loops"],
    x: 520,
    y: 120,
    estimatedMinutes: 45,
    difficulty: "Medium"
  },
  {
    id: "strings",
    name: "Strings & Immutability",
    shortName: "Strings",
    category: "Data Structures",
    description: "String pool, immutability, StringBuilder vs StringBuffer, character indexing, substring operations.",
    prerequisites: ["arrays"],
    x: 660,
    y: 120,
    estimatedMinutes: 30,
    difficulty: "Medium"
  },
  {
    id: "recursion",
    name: "Recursion & Call Stack",
    shortName: "Recursion",
    category: "Algorithms",
    description: "Base cases, recursive step, call stack frames, StackOverflowError, divide and conquer.",
    prerequisites: ["functions", "conditionals"],
    x: 420,
    y: 280,
    estimatedMinutes: 60,
    difficulty: "Hard"
  },
  {
    id: "searching",
    name: "Searching Algorithms",
    shortName: "Searching",
    category: "Algorithms",
    description: "Linear search O(N), Binary search O(log N), invariant boundaries, mid calculation avoiding integer overflow.",
    prerequisites: ["arrays", "recursion"],
    x: 580,
    y: 240,
    estimatedMinutes: 45,
    difficulty: "Medium"
  },
  {
    id: "sorting",
    name: "Sorting Algorithms",
    shortName: "Sorting",
    category: "Algorithms",
    description: "Comparison sorts: Bubble, Selection, Insertion, Merge Sort (divide & conquer), Quick Sort partition.",
    prerequisites: ["arrays", "recursion"],
    x: 720,
    y: 240,
    estimatedMinutes: 65,
    difficulty: "Hard"
  },
  {
    id: "linked_lists",
    name: "Linked Lists & Pointers",
    shortName: "Linked Lists",
    category: "Data Structures",
    description: "Singly and doubly linked lists, node references, pointer manipulation, cycle detection, edge null cases.",
    prerequisites: ["functions", "variables"],
    x: 400,
    y: 420,
    estimatedMinutes: 60,
    difficulty: "Hard"
  },
  {
    id: "stacks_queues",
    name: "Stacks & Queues",
    shortName: "Stacks & Queues",
    category: "Data Structures",
    description: "LIFO vs FIFO semantics, Deque, monotonic stacks, queue buffer implementations, parenthesis matching.",
    prerequisites: ["linked_lists", "arrays"],
    x: 580,
    y: 400,
    estimatedMinutes: 50,
    difficulty: "Medium"
  },
  {
    id: "binary_trees",
    name: "Binary Trees & BST",
    shortName: "Binary Trees",
    category: "Data Structures",
    description: "Hierarchical structures, inorder/preorder/postorder recursive traversals, Binary Search Tree invariants.",
    prerequisites: ["recursion", "linked_lists"],
    x: 750,
    y: 380,
    estimatedMinutes: 75,
    difficulty: "Hard"
  }
];

export const DEMO_PERSONAS = {
  alex: {
    id: "alex_rivera",
    name: "Alex Rivera",
    email: "alex.rivera@student.edu",
    role: "student",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
    examGoal: "Java & DSA Placement Exam 2026",
    level: "Intermediate",
    streakDays: 5,
    lastActiveDate: new Date().toISOString(),
    totalXp: 1420,
    levelName: "Algorithm Apprentice",
    diagnosticCompleted: true,
    weeklyGoalQuestions: 30,
    weeklyQuestionsDone: 19,
    // Pre-loaded realistic learner model state
    mastery: {
      variables: 88,
      conditionals: 82,
      loops: 74,
      functions: 76,
      arrays: 58,
      strings: 72,
      recursion: 34,      // Needs improvement!
      searching: 64,
      sorting: 46,
      linked_lists: 42,
      stacks_queues: 60,
      binary_trees: 25     // Needs improvement!
    },
    conceptStats: {
      recursion: { attempts: 8, correct: 2, totalTimeSec: 410, confidenceAvg: 1.6, lastErrorReason: "Forgot base case" },
      arrays: { attempts: 12, correct: 7, totalTimeSec: 360, confidenceAvg: 2.1, lastErrorReason: "Off-by-one index length" },
      variables: { attempts: 10, correct: 9, totalTimeSec: 150, confidenceAvg: 2.9, lastErrorReason: null },
      conditionals: { attempts: 9, correct: 8, totalTimeSec: 180, confidenceAvg: 2.7, lastErrorReason: null },
      loops: { attempts: 11, correct: 8, totalTimeSec: 290, confidenceAvg: 2.4, lastErrorReason: "Infinite loop condition" },
      functions: { attempts: 8, correct: 6, totalTimeSec: 220, confidenceAvg: 2.5, lastErrorReason: null },
      strings: { attempts: 7, correct: 5, totalTimeSec: 190, confidenceAvg: 2.3, lastErrorReason: null },
      searching: { attempts: 6, correct: 4, totalTimeSec: 210, confidenceAvg: 2.2, lastErrorReason: null },
      sorting: { attempts: 5, correct: 2, totalTimeSec: 320, confidenceAvg: 1.8, lastErrorReason: "Partition pivot placement" },
      linked_lists: { attempts: 7, correct: 3, totalTimeSec: 390, confidenceAvg: 1.7, lastErrorReason: "Null pointer dereference" },
      stacks_queues: { attempts: 6, correct: 4, totalTimeSec: 240, confidenceAvg: 2.2, lastErrorReason: null },
      binary_trees: { attempts: 4, correct: 1, totalTimeSec: 280, confidenceAvg: 1.3, lastErrorReason: "Base case check for null leaf" }
    },
    activeMisconceptions: [
      {
        id: "misc_rec_01",
        conceptId: "recursion",
        conceptName: "Recursion & Call Stack",
        title: "Missing Base Case in Recursion",
        severity: "Critical",
        detectedAt: "2026-11-20T10:14:00Z",
        resolved: false,
        studentReasoning: "I thought the recursion would automatically stop when n became negative because there's no math left to do.",
        explanation: "Recursion has no 'automatic' awareness of mathematical intent. Unless you explicitly code an exit condition (e.g., `if (n <= 1) return 1;`), the Java Virtual Machine keeps pushing new activation frames onto the call stack until memory is exhausted (StackOverflowError).",
        counterExample: {
          incorrectCode: "int sum(int n) {\n  return n + sum(n - 1); // No check! Crashes at n < 0\n}",
          correctCode: "int sum(int n) {\n  if (n <= 0) return 0; // Guard condition: BASE CASE\n  return n + sum(n - 1);\n}",
          trace: "sum(2) -> sum(1) -> sum(0) stops! Returns 0."
        },
        remediationQuizId: "rec_base_fix"
      },
      {
        id: "misc_arr_01",
        conceptId: "arrays",
        conceptName: "Arrays & Memory",
        title: "Array Index Out of Bounds (Length vs Last Index)",
        severity: "Moderate",
        detectedAt: "2026-11-19T16:45:00Z",
        resolved: false,
        studentReasoning: "If an array has size 5, array[5] should be the 5th element.",
        explanation: "Java arrays are 0-indexed. An array of size N stores items from index `0` up to index `N - 1`. Attempting to read `array[array.length]` always throws an `ArrayIndexOutOfBoundsException`.",
        counterExample: {
          incorrectCode: "int[] arr = new int[5];\nSystem.out.println(arr[5]); // Crash! Valid indices are 0,1,2,3,4",
          correctCode: "int[] arr = new int[5];\nSystem.out.println(arr[arr.length - 1]); // Last element!",
          trace: "Length = 5. Indices: [0, 1, 2, 3, 4]. index 5 does not exist."
        },
        remediationQuizId: "arr_bounds_fix"
      }
    ],
    spacedRepetitionQueue: [
      {
        id: "rev_01",
        conceptId: "recursion",
        title: "Recursion: Base Case Invariant",
        dueStatus: "Due Today",
        dueDate: new Date().toISOString().split("T")[0],
        intervalDays: 1,
        easeFactor: 1.9,
        repetition: 1,
        prompt: "Why must a recursive function always have a base case?",
        answer: "To provide a terminating condition that halts further recursive calls, unwinds the call stack, and prevents StackOverflowError."
      },
      {
        id: "rev_02",
        conceptId: "arrays",
        title: "Array 0-Index Boundary",
        dueStatus: "Due Today",
        dueDate: new Date().toISOString().split("T")[0],
        intervalDays: 2,
        easeFactor: 2.2,
        repetition: 2,
        prompt: "What is the highest valid index in an array declared as `int[] nums = new int[10];`?",
        answer: "Index 9 (i.e. nums.length - 1)."
      },
      {
        id: "rev_03",
        conceptId: "linked_lists",
        title: "Null Pointer Prevention in Singly Linked List",
        dueStatus: "Upcoming (Tomorrow)",
        dueDate: new Date(Date.now() + 86400000).toISOString().split("T")[0],
        intervalDays: 3,
        easeFactor: 2.4,
        repetition: 2,
        prompt: "What condition must be verified before executing `current = current.next`?",
        answer: "`current != null`"
      }
    ]
  },
  priya: {
    id: "priya_sharma",
    name: "Priya Sharma",
    email: "priya.s@techprep.io",
    role: "student",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200",
    examGoal: "Senior Software Engineer FAANG Coding Bar",
    level: "Advanced",
    streakDays: 14,
    lastActiveDate: new Date().toISOString(),
    totalXp: 3890,
    levelName: "Data Structure Knight",
    diagnosticCompleted: true,
    weeklyGoalQuestions: 40,
    weeklyQuestionsDone: 34,
    mastery: {
      variables: 95,
      conditionals: 96,
      loops: 92,
      functions: 94,
      arrays: 90,
      strings: 88,
      recursion: 85,
      searching: 89,
      sorting: 84,
      linked_lists: 80,
      stacks_queues: 86,
      binary_trees: 78
    },
    conceptStats: {},
    activeMisconceptions: [],
    spacedRepetitionQueue: []
  },
  teacher: {
    id: "prof_harrison",
    name: "Prof. Alan Harrison",
    email: "a.harrison@university.edu",
    role: "teacher",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200",
    examGoal: "CS201 Data Structures & Algorithms (Fall Cohort)",
    level: "Instructor",
    totalStudents: 42
  },
  fresh: {
    id: "new_student",
    name: "Jordan Lee",
    email: "jordan@example.com",
    role: "student",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200",
    examGoal: "College Midterm Exam Prep",
    level: "Beginner",
    streakDays: 1,
    lastActiveDate: new Date().toISOString(),
    totalXp: 50,
    levelName: "Syntax Novice",
    diagnosticCompleted: false,
    weeklyGoalQuestions: 25,
    weeklyQuestionsDone: 0,
    mastery: {
      variables: 0,
      conditionals: 0,
      loops: 0,
      functions: 0,
      arrays: 0,
      strings: 0,
      recursion: 0,
      searching: 0,
      sorting: 0,
      linked_lists: 0,
      stacks_queues: 0,
      binary_trees: 0
    },
    conceptStats: {},
    activeMisconceptions: [],
    spacedRepetitionQueue: []
  }
};

export const BADGES_CATALOG = [
  { id: "first_diagnostic", title: "Diagnostic Pioneer", desc: "Completed the initial diagnostic assessment", icon: "sparkles", xp: 150 },
  { id: "recursion_slayer", title: "Recursion Conqueror", desc: "Resolved a base case misconception and answered 3 recursion questions correctly", icon: "terminal", xp: 300 },
  { id: "streak_3", title: "Consistency Spark", desc: "Maintained a 3-day active learning streak", icon: "flame", xp: 200 },
  { id: "streak_7", title: "Habit Master", desc: "Maintained a 7-day learning streak", icon: "zap", xp: 500 },
  { id: "accuracy_90", title: "Precision Engineer", desc: "Achieved 90%+ accuracy in a 10-question practice run", icon: "target", xp: 250 },
  { id: "knowledge_master", title: "Knowledge Champion", desc: "Mastered at least 5 concepts in the Knowledge Graph", icon: "award", xp: 400 },
  { id: "spaced_rep_hero", title: "Memory Architect", desc: "Completed 5 spaced repetition reviews on schedule", icon: "calendar", xp: 250 },
  { id: "deep_thinker", title: "Reflective Learner", desc: "Provided reasoning explanation for 5 challenging questions", icon: "brain", xp: 200 }
];
