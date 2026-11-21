// AptiLearn AI Configuration, 15-Concept Syllabus, Personas & Presets
export const SYLLABUS_CONCEPTS = [
  {
    id: "variables",
    name: "Variables & Primitive Types",
    shortName: "Variables",
    category: "Foundations",
    description: "Primitive types (byte, short, int, long, float, double, char, boolean), wrapper classes, type casting, and stack allocation.",
    prerequisites: [],
    x: 80,
    y: 160,
    estimatedMinutes: 25,
    difficulty: "Easy"
  },
  {
    id: "data_types",
    name: "Data Types & Memory Model",
    shortName: "Data Types",
    category: "Foundations",
    description: "Stack vs Heap memory, reference variables, object headers, primitive default values, and immutable wrapper caches.",
    prerequisites: ["variables"],
    x: 200,
    y: 100,
    estimatedMinutes: 30,
    difficulty: "Easy"
  },
  {
    id: "conditionals",
    name: "Conditional Statements & Logic",
    shortName: "Conditionals",
    category: "Control Flow",
    description: "Boolean logic, if-else branches, switch expressions, short-circuit evaluation (&&, ||), and ternary operators.",
    prerequisites: ["variables"],
    x: 200,
    y: 220,
    estimatedMinutes: 25,
    difficulty: "Easy"
  },
  {
    id: "loops",
    name: "Loops & Iteration",
    shortName: "Loops",
    category: "Control Flow",
    description: "for, enhanced for, while, do-while loops, loop invariants, break/continue semantics, and nested loop complexity.",
    prerequisites: ["conditionals"],
    x: 320,
    y: 160,
    estimatedMinutes: 35,
    difficulty: "Easy"
  },
  {
    id: "arrays",
    name: "Arrays & Memory Contiguity",
    shortName: "Arrays",
    category: "Data Structures",
    description: "Fixed contiguous memory allocation, 0-based indexing (0 to length - 1), bounds checking, and multidimensional matrices.",
    prerequisites: ["loops", "data_types"],
    x: 440,
    y: 100,
    estimatedMinutes: 45,
    difficulty: "Medium"
  },
  {
    id: "strings",
    name: "Strings & String Pool",
    shortName: "Strings",
    category: "Data Structures",
    description: "String constant pool, immutability, StringBuilder vs StringBuffer, character indexing, and memory footprint.",
    prerequisites: ["arrays"],
    x: 560,
    y: 100,
    estimatedMinutes: 30,
    difficulty: "Medium"
  },
  {
    id: "functions",
    name: "Methods, Scope & Pass-by-Value",
    shortName: "Functions",
    category: "Foundations",
    description: "Method signatures, pass-by-value semantics for primitives and object references, variable scope, and method overloading.",
    prerequisites: ["conditionals", "data_types"],
    x: 320,
    y: 280,
    estimatedMinutes: 40,
    difficulty: "Medium"
  },
  {
    id: "recursion",
    name: "Recursion & Call Stack",
    shortName: "Recursion",
    category: "Algorithms",
    description: "Base case termination, recursive descent and unwinding, activation stack frames, StackOverflowError, divide-and-conquer.",
    prerequisites: ["functions", "conditionals"],
    x: 440,
    y: 280,
    estimatedMinutes: 60,
    difficulty: "Hard"
  },
  {
    id: "searching",
    name: "Searching Algorithms",
    shortName: "Searching",
    category: "Algorithms",
    description: "Linear search O(N), Binary search O(log N), invariant boundaries, mid calculation avoiding overflow (low + (high - low)/2).",
    prerequisites: ["arrays", "recursion"],
    x: 560,
    y: 220,
    estimatedMinutes: 45,
    difficulty: "Medium"
  },
  {
    id: "sorting",
    name: "Sorting Algorithms",
    shortName: "Sorting",
    category: "Algorithms",
    description: "Bubble, Selection, Insertion Sort (O(N^2)), Merge Sort (O(N log N) divide & conquer), Quick Sort partition (O(N log N)).",
    prerequisites: ["arrays", "recursion"],
    x: 680,
    y: 220,
    estimatedMinutes: 65,
    difficulty: "Hard"
  },
  {
    id: "linked_lists",
    name: "Linked Lists & Pointers",
    shortName: "Linked Lists",
    category: "Data Structures",
    description: "Singly and doubly linked lists, node references, pointer manipulation, fast & slow pointer cycle detection, dummy head technique.",
    prerequisites: ["functions", "data_types"],
    x: 440,
    y: 420,
    estimatedMinutes: 60,
    difficulty: "Hard"
  },
  {
    id: "stacks",
    name: "Stacks (LIFO)",
    shortName: "Stacks",
    category: "Data Structures",
    description: "Last-In, First-Out semantics, ArrayDeque vs Stack, monotonic stacks, parenthesis matching, infix to postfix parsing.",
    prerequisites: ["linked_lists", "arrays"],
    x: 580,
    y: 360,
    estimatedMinutes: 45,
    difficulty: "Medium"
  },
  {
    id: "queues",
    name: "Queues (FIFO) & Deques",
    shortName: "Queues",
    category: "Data Structures",
    description: "First-In, First-Out semantics, circular queues, priority queues (min/max heap), sliding window maximum, BFS buffers.",
    prerequisites: ["linked_lists", "arrays"],
    x: 580,
    y: 480,
    estimatedMinutes: 45,
    difficulty: "Medium"
  },
  {
    id: "trees",
    name: "Binary Trees & BST",
    shortName: "Trees",
    category: "Data Structures",
    description: "Binary Tree node structures, recursive traversals (preorder, inorder, postorder, level-order), BST search and validate invariants.",
    prerequisites: ["recursion", "linked_lists"],
    x: 720,
    y: 360,
    estimatedMinutes: 75,
    difficulty: "Hard"
  },
  {
    id: "graphs",
    name: "Graphs & Traversals (BFS/DFS)",
    shortName: "Graphs",
    category: "Data Structures",
    description: "Adjacency matrix vs list, Breadth-First Search (queue), Depth-First Search (recursion/stack), cycle detection, topological sort.",
    prerequisites: ["trees", "queues", "stacks"],
    x: 840,
    y: 420,
    estimatedMinutes: 90,
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
    streakDays: 6,
    lastActiveDate: new Date().toISOString(),
    totalXp: 1680,
    levelName: "Algorithm Apprentice",
    diagnosticCompleted: true,
    weeklyGoalQuestions: 35,
    weeklyQuestionsDone: 24,
    studyTimeTodayMins: 42,
    targetScore: "95% Target Percentile",
    educationLevel: "Undergraduate (B.Tech CS 3rd Year)",
    institution: "Institute of Technology",
    preferredLanguage: "en", // 'en' or 'hi'
    // Pre-loaded realistic learner model state
    mastery: {
      variables: 90,
      data_types: 85,
      conditionals: 84,
      loops: 78,
      functions: 80,
      arrays: 62,
      strings: 75,
      recursion: 34,      // Critical weakness!
      searching: 66,
      sorting: 48,
      linked_lists: 44,
      stacks: 64,
      queues: 58,
      trees: 28,          // Needs improvement!
      graphs: 15          // Not started / minimal
    },
    conceptStats: {
      recursion: { attempts: 10, correct: 3, totalTimeSec: 520, confidenceAvg: 1.6, consecutiveMistakes: 2, lastErrorReason: "Forgot base case" },
      arrays: { attempts: 14, correct: 9, totalTimeSec: 410, confidenceAvg: 2.2, consecutiveMistakes: 0, lastErrorReason: "Off-by-one index length" },
      variables: { attempts: 12, correct: 11, totalTimeSec: 180, confidenceAvg: 2.9, consecutiveMistakes: 0, lastErrorReason: null },
      data_types: { attempts: 8, correct: 7, totalTimeSec: 160, confidenceAvg: 2.7, consecutiveMistakes: 0, lastErrorReason: null },
      conditionals: { attempts: 10, correct: 9, totalTimeSec: 190, confidenceAvg: 2.8, consecutiveMistakes: 0, lastErrorReason: null },
      loops: { attempts: 12, correct: 9, totalTimeSec: 320, confidenceAvg: 2.4, consecutiveMistakes: 0, lastErrorReason: "Infinite loop condition" },
      functions: { attempts: 9, correct: 7, totalTimeSec: 240, confidenceAvg: 2.6, consecutiveMistakes: 0, lastErrorReason: null },
      strings: { attempts: 8, correct: 6, totalTimeSec: 210, confidenceAvg: 2.3, consecutiveMistakes: 0, lastErrorReason: null },
      searching: { attempts: 7, correct: 5, totalTimeSec: 230, confidenceAvg: 2.2, consecutiveMistakes: 0, lastErrorReason: null },
      sorting: { attempts: 6, correct: 3, totalTimeSec: 360, confidenceAvg: 1.8, consecutiveMistakes: 1, lastErrorReason: "Partition pivot placement" },
      linked_lists: { attempts: 8, correct: 4, totalTimeSec: 420, confidenceAvg: 1.7, consecutiveMistakes: 1, lastErrorReason: "Null pointer dereference" },
      stacks: { attempts: 7, correct: 5, totalTimeSec: 260, confidenceAvg: 2.2, consecutiveMistakes: 0, lastErrorReason: null },
      queues: { attempts: 6, correct: 4, totalTimeSec: 250, confidenceAvg: 2.1, consecutiveMistakes: 0, lastErrorReason: null },
      trees: { attempts: 5, correct: 1, totalTimeSec: 340, confidenceAvg: 1.4, consecutiveMistakes: 2, lastErrorReason: "Base case check for null leaf" },
      graphs: { attempts: 2, correct: 0, totalTimeSec: 180, confidenceAvg: 1.2, consecutiveMistakes: 2, lastErrorReason: "Visited set omitted in BFS" }
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
        studentReasoning: "I thought the recursion would automatically terminate when n became negative because there's no math left to compute.",
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
        remediationQuizId: "arr_01"
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
    ],
    dailyQuests: [
      { id: "q1", title: "Targeted Recursion Drill", desc: "Solve 2 questions on base cases", progress: 1, total: 2, xp: 60, completed: false },
      { id: "q2", title: "Spaced Reviewer", desc: "Complete today's SM-2 flashcard queue", progress: 2, total: 2, xp: 50, completed: true },
      { id: "q3", title: "Cognitive Accuracy Sprint", desc: "Score 80%+ on an adaptive quiz", progress: 0, total: 1, xp: 80, completed: false }
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
    streakDays: 15,
    lastActiveDate: new Date().toISOString(),
    totalXp: 4120,
    levelName: "Data Structure Knight",
    diagnosticCompleted: true,
    weeklyGoalQuestions: 40,
    weeklyQuestionsDone: 36,
    studyTimeTodayMins: 65,
    targetScore: "Top 0.5% Percentile",
    educationLevel: "Post-Graduate / Industry Professional",
    institution: "Tech University Alumni",
    preferredLanguage: "en",
    mastery: {
      variables: 95,
      data_types: 94,
      conditionals: 96,
      loops: 92,
      functions: 94,
      arrays: 90,
      strings: 88,
      recursion: 85,
      searching: 89,
      sorting: 84,
      linked_lists: 82,
      stacks: 88,
      queues: 86,
      trees: 80,
      graphs: 74
    },
    conceptStats: {},
    activeMisconceptions: [],
    spacedRepetitionQueue: [],
    dailyQuests: [
      { id: "qp1", title: "Graph Cycle Detection", desc: "Implement topological sort in Coding Lab", progress: 1, total: 1, xp: 100, completed: true },
      { id: "qp2", title: "Full Mock Exam", desc: "Complete 1 full-length simulated exam", progress: 1, total: 1, xp: 150, completed: true }
    ]
  },
  teacher: {
    id: "prof_harrison",
    name: "Prof. Alan Harrison",
    email: "a.harrison@university.edu",
    role: "teacher",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200",
    examGoal: "CS201 Data Structures & Algorithms (Fall Cohort)",
    level: "Course Director",
    totalStudents: 42,
    preferredLanguage: "en"
  },
  parent: {
    id: "eleanor_rivera",
    name: "Eleanor Rivera (Parent/Mentor)",
    email: "eleanor.rivera@mentor.org",
    role: "parent",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200",
    linkedStudentName: "Alex Rivera",
    linkedStudentId: "alex_rivera",
    preferredLanguage: "en"
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
    studyTimeTodayMins: 10,
    targetScore: "90% Goal",
    educationLevel: "Undergraduate (1st Year)",
    institution: "State University",
    preferredLanguage: "en",
    mastery: {
      variables: 0,
      data_types: 0,
      conditionals: 0,
      loops: 0,
      functions: 0,
      arrays: 0,
      strings: 0,
      recursion: 0,
      searching: 0,
      sorting: 0,
      linked_lists: 0,
      stacks: 0,
      queues: 0,
      trees: 0,
      graphs: 0
    },
    conceptStats: {},
    activeMisconceptions: [],
    spacedRepetitionQueue: [],
    dailyQuests: [
      { id: "qf1", title: "Complete Placement Diagnostic", desc: "Take the 10-minute diagnostic test", progress: 0, total: 1, xp: 150, completed: false }
    ]
  }
};

export const BADGES_CATALOG = [
  { id: "first_diagnostic", title: "Diagnostic Pioneer", desc: "Completed the initial diagnostic assessment", icon: "sparkles", xp: 150 },
  { id: "recursion_slayer", title: "Recursion Conqueror", desc: "Resolved a base case misconception and answered 3 recursion questions correctly", icon: "terminal", xp: 300 },
  { id: "streak_3", title: "Consistency Spark", desc: "Maintained a 3-day active learning streak", icon: "flame", xp: 200 },
  { id: "streak_7", title: "Habit Master", desc: "Maintained a 7-day learning streak", icon: "zap", xp: 500 },
  { id: "accuracy_90", title: "Precision Engineer", desc: "Achieved 90%+ accuracy in a practice run", icon: "target", xp: 250 },
  { id: "knowledge_master", title: "Knowledge Champion", desc: "Mastered at least 6 concepts in the Knowledge Graph", icon: "award", xp: 400 },
  { id: "spaced_rep_hero", title: "Memory Architect", desc: "Completed 5 spaced repetition reviews on schedule", icon: "calendar", xp: 250 },
  { id: "deep_thinker", title: "Reflective Learner", desc: "Provided reasoning explanation for 5 challenging questions", icon: "brain", xp: 200 },
  { id: "code_ninja", title: "Coding Lab Hero", desc: "Passed all test cases for a Java coding lab problem", icon: "code", xp: 350 },
  { id: "exam_warrior", title: "Exam Ace", desc: "Completed a full simulated mock test under time pressure", icon: "clock", xp: 450 }
];

export const PRELOADED_DOCUMENTS = [
  {
    id: "doc_recursion_notes",
    title: "Java Recursion, Memory Frames & Base Cases.pdf",
    category: "Algorithms & Java Internals",
    size: "1.4 MB",
    uploadedAt: "2026-11-20",
    summary: "Comprehensive guide to recursion in Java. Explains JVM Call Stack activation records, the strict necessity of base cases to prevent StackOverflowError, recursive descent versus stack unwinding, and divide-and-conquer paradigms.",
    keyConcepts: ["Base Case Invariant", "JVM Call Stack", "StackOverflowError", "Divide & Conquer", "Tail Call Optimization"],
    content: `Chapter 4: The Mechanics of Recursion in Java
A recursive method solves a problem by calling a smaller sub-instance of itself.
Key Components:
1. The Base Case: A terminating condition where the method returns an immediate value without making another self-invocation. Without an explicit base case, the JVM pushes new activation frames until memory is exhausted, throwing java.lang.StackOverflowError.
2. The Recursive Step: Moving toward the base case by decreasing problem size (e.g. n - 1 or n / 2).
3. The Unwinding Phase: After the base case returns, execution resumes in reverse order (LIFO) for any instructions following the recursive call.`
  },
  {
    id: "doc_trees_bst",
    title: "Binary Trees & BST Invariant Deep-Dive.pdf",
    category: "Data Structures",
    size: "2.1 MB",
    uploadedAt: "2026-11-18",
    summary: "Detailed review of binary trees, recursive traversals (Pre-order, In-order, Post-order, Level-order), and the critical subtree invariant of Binary Search Trees.",
    keyConcepts: ["BST Invariant", "In-order Traversal", "Subtree Range Validation", "Tree Height O(log N) vs O(N)"],
    content: `Binary Search Tree (BST) Properties:
For every node X in a valid BST:
1. All node values in the LEFT subtree of X must be STRICTLY LESS than X.val.
2. All node values in the RIGHT subtree of X must be STRICTLY GREATER than X.val.
Common Student Pitfall: Validating only local child pointers (node.left.val < node.val) is insufficient. You must maintain global (min, max) bounds across all ancestors.`
  }
];

export const CODING_LAB_PROBLEMS = [
  {
    id: "code_sum_recursion",
    title: "Recursive Sum with Guard Base Case",
    conceptId: "recursion",
    difficulty: "Easy",
    description: "Write a recursive function `sum(int n)` that calculates the sum of integers from 1 to n. Return 0 if n <= 0.",
    starterCode: `public class Solution {
    public static int sum(int n) {
        // TODO: Write your base case and recursive call
        
    }
}`,
    solutionCode: `public class Solution {
    public static int sum(int n) {
        if (n <= 0) return 0;
        return n + sum(n - 1);
    }
}`,
    testCases: [
      { input: "3", expected: "6", description: "sum(3) -> 3 + 2 + 1" },
      { input: "5", expected: "15", description: "sum(5) -> 15" },
      { input: "0", expected: "0", description: "sum(0) -> 0 (base case)" }
    ]
  },
  {
    id: "code_array_reverse",
    title: "In-Place Array Reversal",
    conceptId: "arrays",
    difficulty: "Medium",
    description: "Reverse an array of integers in-place in O(N) time and O(1) auxiliary space using two pointers.",
    starterCode: `public class Solution {
    public static void reverse(int[] nums) {
        // TODO: Two pointer reversal
        
    }
}`,
    solutionCode: `public class Solution {
    public static void reverse(int[] nums) {
        int left = 0, right = nums.length - 1;
        while (left < right) {
            int temp = nums[left];
            nums[left] = nums[right];
            nums[right] = temp;
            left++;
            right--;
        }
    }
}`,
    testCases: [
      { input: "[1, 2, 3, 4, 5]", expected: "[5, 4, 3, 2, 1]", description: "Odd length array" },
      { input: "[10, 20]", expected: "[20, 10]", description: "Even length array" }
    ]
  }
];
