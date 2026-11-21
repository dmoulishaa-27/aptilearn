// LearnIQ Comprehensive Java & DSA Question Repository with Distractor Explanations & Misconceptions
export const QUESTION_BANK = [
  // --- RECURSION ---
  {
    id: "rec_01",
    conceptId: "recursion",
    difficulty: "Medium",
    title: "Understanding Recursive Base Cases",
    code: `public class RecursionTest {
    public static int mystery(int n) {
        // Line A: Note missing condition
        return n + mystery(n - 1);
    }
    public static void main(String[] args) {
        System.out.println(mystery(3));
    }
}`,
    prompt: "What happens when `mystery(3)` is executed in Java?",
    options: [
      { text: "It prints 6.", isCorrect: false, reason: "Incorrect. While 3 + 2 + 1 = 6, the method has no base case to stop when n reaches 1 or 0.", misconceptionKey: "RECURSION_MISSING_BASE_CASE" },
      { text: "It throws a java.lang.StackOverflowError at runtime.", isCorrect: true, reason: "Correct! Because there is no base case, the method calls itself infinitely (mystery(3) -> mystery(2) -> mystery(1) -> mystery(0) -> mystery(-1)...) until the JVM call stack memory is exhausted.", misconceptionKey: null },
      { text: "It prints 0.", isCorrect: false, reason: "Incorrect. The method cannot evaluate to 0 because it never finishes its recursive calls.", misconceptionKey: "RECURSION_MISSING_BASE_CASE" },
      { text: "It causes a compile-time error.", isCorrect: false, reason: "Incorrect. The code is syntactically valid Java; the infinite call stack occurs at runtime.", misconceptionKey: "SYNTAX_VS_RUNTIME_CONFUSION" }
    ],
    hint1: "Look closely at Line A. How does the function know when to stop calling itself?",
    hint2: "Without a terminating condition (base case), new stack frames are pushed indefinitely.",
    explanation: "Every recursive algorithm MUST have at least one base case where it returns a concrete value without making another recursive call. Without `if (n <= 0) return 0;`, the JVM exceeds thread stack capacity, throwing StackOverflowError."
  },
  {
    id: "rec_02",
    conceptId: "recursion",
    difficulty: "Hard",
    title: "Call Stack Execution Order & Post-Recursion Code",
    code: `public class TraceDemo {
    public static void printPattern(int n) {
        if (n <= 0) return;
        System.out.print(n + " ");
        printPattern(n - 1);
        System.out.print(n + " ");
    }
    public static void main(String[] args) {
        printPattern(3);
    }
}`,
    prompt: "What exact output is printed when `printPattern(3)` runs?",
    options: [
      { text: "3 2 1 1 2 3 ", isCorrect: true, reason: "Correct! The first print prints during the descent (3 2 1), the base case returns, and then the second print executes during call stack unwinding (1 2 3).", misconceptionKey: null },
      { text: "3 2 1 ", isCorrect: false, reason: "Incorrect. You overlooked the second print statement after the recursive call, which executes when each stack frame unwinds.", misconceptionKey: "UNWINDING_STACK_MISCONCEPTION" },
      { text: "3 3 2 2 1 1 ", isCorrect: false, reason: "Incorrect. The recursive call happens between the two print statements, so print 2 cannot happen until all child calls finish.", misconceptionKey: "SYNCHRONOUS_EXECUTION_MISCONCEPTION" },
      { text: "1 2 3 3 2 1 ", isCorrect: false, reason: "Incorrect. The pre-recursive print occurs first, starting with the initial argument n = 3, not 1.", misconceptionKey: "RECURSIVE_DESCENT_ORDER" }
    ],
    hint1: "Code before the recursive call runs on the way down; code after runs on the way back up as stack frames return.",
    hint2: "Trace n=1 first: prints '1 ', calls printPattern(0) which returns, then prints '1 '.",
    explanation: "A recursive call suspends the current stack frame. Lines after the recursive call resume in reverse order (LIFO) as functions return."
  },
  {
    id: "rec_base_fix",
    conceptId: "recursion",
    difficulty: "Easy",
    title: "Targeted Fix: Writing the Correct Base Case",
    code: `// We want sumToN(3) to return 3 + 2 + 1 = 6
public static int sumToN(int n) {
    // ??? WHICH BASE CASE BELONGS HERE ???
    return n + sumToN(n - 1);
}`,
    prompt: "Which statement properly completes the base case to calculate the sum from 1 to n?",
    options: [
      { text: "if (n <= 0) return 0;", isCorrect: true, reason: "Correct! When n reaches 0, returning 0 terminates the recursion and adds the neutral additive identity.", misconceptionKey: null },
      { text: "if (n == 0) return n - 1;", isCorrect: false, reason: "Incorrect. Returning -1 will corrupt the sum by subtracting 1.", misconceptionKey: "BASE_CASE_VALUE_ERROR" },
      { text: "if (n == 1) return sumToN(n);", isCorrect: false, reason: "Incorrect. Calling sumToN(n) repeats the same call infinitely with n=1.", misconceptionKey: "RECURSION_MISSING_BASE_CASE" },
      { text: "while (n > 0) return n;", isCorrect: false, reason: "Incorrect. A base case uses conditional 'if', not a 'while' loop which returns immediately.", misconceptionKey: "LOOP_VS_RECURSION_CONFUSION" }
    ],
    hint1: "What is the smallest input that needs no calculation? The sum of numbers up to 0 is 0.",
    hint2: "The base case must return a literal value, never a recursive call.",
    explanation: "Base cases establish the floor of the recursion. For summation, 0 is the additive identity: `if (n <= 0) return 0;`."
  },

  // --- ARRAYS & MEMORY ---
  {
    id: "arr_01",
    conceptId: "arrays",
    difficulty: "Medium",
    title: "Array Boundary & Indexing",
    code: `public class ArrayBounds {
    public static void main(String[] args) {
        int[] data = new int[5];
        for (int i = 0; i <= data.length; i++) {
            data[i] = i * 2;
        }
    }
}`,
    prompt: "What will happen when this program is executed?",
    options: [
      { text: "It initializes the array with [0, 2, 4, 6, 8, 10].", isCorrect: false, reason: "Incorrect. An array of size 5 can only hold 5 elements, not 6.", misconceptionKey: "ARRAY_OFF_BY_ONE" },
      { text: "Throws ArrayIndexOutOfBoundsException at i = 5.", isCorrect: true, reason: "Correct! An array of length 5 has valid indices 0, 1, 2, 3, 4. The condition 'i <= data.length' checks index 5, which is out of bounds.", misconceptionKey: null },
      { text: "It compiles and runs without error.", isCorrect: false, reason: "Incorrect. Java performs strict runtime bounds checking.", misconceptionKey: "ARRAY_OFF_BY_ONE" },
      { text: "Compile-time error: invalid array length comparison.", isCorrect: false, reason: "Incorrect. 'i <= data.length' is syntactically valid; the boundary error occurs at runtime.", misconceptionKey: "SYNTAX_VS_RUNTIME_CONFUSION" }
    ],
    hint1: "Notice the loop condition: is it 'i < data.length' or 'i <= data.length'?",
    hint2: "In Java, an array of size N has indices from 0 up to N-1.",
    explanation: "Arrays are 0-indexed. Using `<=` with `.length` causes the loop to attempt accessing index 5 on an array with length 5, triggering an `ArrayIndexOutOfBoundsException`."
  },
  {
    id: "arr_02",
    conceptId: "arrays",
    difficulty: "Hard",
    title: "Array References & In-Place Mutation",
    code: `public class ArrayMutation {
    public static void modify(int[] a, int x) {
        a[0] = 99;
        a = new int[]{1, 2, 3};
        x = 50;
    }
    public static void main(String[] args) {
        int[] arr = {10, 20, 30};
        int val = 5;
        modify(arr, val);
        System.out.println(arr[0] + ", " + val);
    }
}`,
    prompt: "What does this code print?",
    options: [
      { text: "99, 5", isCorrect: true, reason: "Correct! Java is strictly pass-by-value. Mutating a[0] alters the caller's array object, but reassigning the local parameter 'a' to a new array and reassigning 'x' does not affect the caller's variables.", misconceptionKey: null },
      { text: "1, 50", isCorrect: false, reason: "Incorrect. You assumed reassigning 'a' to a new array changes the caller's reference, and that primitive 'x' passed by reference.", misconceptionKey: "PASS_BY_VALUE_REFERENCE_CONFUSION" },
      { text: "10, 5", isCorrect: false, reason: "Incorrect. a[0] = 99 modified the actual array in the heap before the reassignment.", misconceptionKey: "OBJECT_MUTATION_CONFUSION" },
      { text: "99, 50", isCorrect: false, reason: "Incorrect. Primitive 'int val' is passed by value (copied); modifying 'x' inside the method has zero effect on 'val'.", misconceptionKey: "PRIMITIVE_PASS_BY_REFERENCE" }
    ],
    hint1: "Java is strictly pass-by-value. For objects, the reference (memory address) is passed by value.",
    hint2: "Reassigning the variable 'a' inside modify() changes only the local parameter pointer, not the caller's variable.",
    explanation: "Mutating object contents through a reference parameter updates the underlying object. Reassigning the parameter variable itself re-points a local copy, leaving the original variable unchanged."
  },

  // --- VARIABLES & FUNCTIONS ---
  {
    id: "var_01",
    conceptId: "variables",
    difficulty: "Easy",
    title: "Primitive Type Overflow & Integer Range",
    code: `public class Overflow {
    public static void main(String[] args) {
        int max = Integer.MAX_VALUE;
        int result = max + 1;
        System.out.println(result);
    }
}`,
    prompt: "What is the output of this code snippet?",
    options: [
      { text: "Integer.MIN_VALUE (-2147483648)", isCorrect: true, reason: "Correct! In Java, 32-bit signed two's complement integers wrap around to MIN_VALUE upon overflow without throwing an exception.", misconceptionKey: null },
      { text: "2147483648", isCorrect: false, reason: "Incorrect. Standard 32-bit int cannot represent 2^31; it overflows and wraps around.", misconceptionKey: "INTEGER_OVERFLOW_IGNORANCE" },
      { text: "Throws an ArithmeticException.", isCorrect: false, reason: "Incorrect. Standard integer addition does not throw on overflow in Java (only integer division by zero throws ArithmeticException).", misconceptionKey: "EXCEPTION_MISCONCEPTION" },
      { text: "Infinity", isCorrect: false, reason: "Incorrect. Integers do not support IEEE 754 Infinity representations; that applies only to float and double.", misconceptionKey: "FLOATING_POINT_SEMANTICS" }
    ],
    hint1: "Java integers use two's complement binary representation. What happens at 0111...1111 + 1?",
    hint2: "Adding 1 turns the sign bit to 1 (1000...0000), representing the lowest negative number.",
    explanation: "Integer.MAX_VALUE is (2^31 - 1). Adding 1 flips the sign bit in two's complement representation, wrapping around to Integer.MIN_VALUE (-2147483648)."
  },

  // --- LOOPS ---
  {
    id: "loop_01",
    conceptId: "loops",
    difficulty: "Medium",
    title: "Nested Loops & Time Complexity Invariant",
    code: `int count = 0;
for (int i = 0; i < n; i++) {
    for (int j = i; j < n; j++) {
        count++;
    }
}`,
    prompt: "How many times does `count++` execute in terms of n?",
    options: [
      { text: "n * (n + 1) / 2", isCorrect: true, reason: "Correct! When i=0, inner loop runs n times; when i=1, runs n-1 times; down to 1. The sum from 1 to n is n(n+1)/2, giving O(n^2) complexity.", misconceptionKey: null },
      { text: "n * n", isCorrect: false, reason: "Incorrect. The inner loop starts at j = i, not j = 0, so it does not perform n * n iterations.", misconceptionKey: "INDEPENDENT_NESTED_LOOP_ASSUMPTION" },
      { text: "n * log(n)", isCorrect: false, reason: "Incorrect. Neither loop increments by multiplication or division; both increment by +1.", misconceptionKey: "LOGARITHMIC_STEP_CONFUSION" },
      { text: "2 * n", isCorrect: false, reason: "Incorrect. This is a nested loop, not two sequential loops.", misconceptionKey: "SEQUENTIAL_VS_NESTED_LOOPS" }
    ],
    hint1: "Write out the number of iterations for i = 0, 1, 2, ..., n-1.",
    hint2: "The arithmetic series sum 1 + 2 + ... + n equals n(n+1)/2.",
    explanation: "Because j starts at i, the inner loop iterations decrease: n + (n-1) + ... + 1 = n*(n+1)/2."
  },

  // --- LINKED LISTS ---
  {
    id: "ll_01",
    conceptId: "linked_lists",
    difficulty: "Hard",
    title: "Pointer Reversal & Null Check Safety",
    code: `class ListNode {
    int val;
    ListNode next;
    ListNode(int val) { this.val = val; }
}

public static ListNode reverseList(ListNode head) {
    ListNode prev = null;
    ListNode curr = head;
    while (curr != null) {
        ListNode nextTemp = curr.next; // Step 1
        curr.next = prev;              // Step 2
        prev = curr;                   // Step 3
        curr = nextTemp;               // Step 4
    }
    return prev;
}`,
    prompt: "Why is saving `ListNode nextTemp = curr.next;` at Step 1 strictly necessary before Step 2?",
    options: [
      { text: "Because Step 2 overwrites curr.next, losing the reference to the remaining chain.", isCorrect: true, reason: "Correct! If curr.next is pointed backwards to prev without caching its forward reference, the rest of the list becomes orphaned and inaccessible in memory.", misconceptionKey: null },
      { text: "To avoid a NullPointerException on Step 3.", isCorrect: false, reason: "Incorrect. Step 3 simply sets prev = curr, which is valid regardless of nextTemp.", misconceptionKey: "POINTER_DEREFERENCE_MISCONCEPTION" },
      { text: "To create a deep copy of the next node.", isCorrect: false, reason: "Incorrect. It copies a reference, not a deep copy of the node object.", misconceptionKey: "SHALLOW_VS_DEEP_COPY" },
      { text: "It is not necessary; curr.next can be accessed after step 2.", isCorrect: false, reason: "Incorrect. Once curr.next is set to prev, its old forward value is destroyed if not saved.", misconceptionKey: "POINTER_OVERWRITE_CONFUSION" }
    ],
    hint1: "What does `curr.next = prev` do to the existing link?",
    hint2: "Once you change an object's pointer, you lose access to where it previously pointed unless saved first.",
    explanation: "Pointers in singly linked lists are one-way streets. Overwriting `curr.next` severs the connection to the remainder of the list unless saved in a temporary reference."
  },

  // --- STACKS & QUEUES ---
  {
    id: "sq_01",
    conceptId: "stacks_queues",
    difficulty: "Medium",
    title: "Stack LIFO Evaluation for Parentheses Matching",
    code: `// Valid Parentheses Algorithm
Deque<Character> stack = new ArrayDeque<>();
for (char c : "({[]})".toCharArray()) {
    if (c == '(' || c == '{' || c == '[') stack.push(c);
    else {
        if (stack.isEmpty() || !matches(stack.pop(), c)) return false;
    }
}`,
    prompt: "Why is a Stack (LIFO) the optimal data structure for matching nested delimiters?",
    options: [
      { text: "Because the most recently opened bracket must be the first one closed.", isCorrect: true, reason: "Correct! In nested expressions, the innermost opening bracket (last opened) must match the immediate next closing bracket (first closed) — an exact match for LIFO semantics.", misconceptionKey: null },
      { text: "Because Stacks sort items in alphabetical order automatically.", isCorrect: false, reason: "Incorrect. Stacks do not sort items; they order by insertion time.", misconceptionKey: "DATA_STRUCTURE_PURPOSE_CONFUSION" },
      { text: "Because Queues cannot store character types.", isCorrect: false, reason: "Incorrect. Queues can store any object type including Character.", misconceptionKey: "GENERIC_TYPE_LIMITATION_FALLACY" },
      { text: "Because Stacks use O(1) total memory regardless of string length.", isCorrect: false, reason: "Incorrect. In the worst case of all opening brackets '((((', stack memory scales as O(N).", misconceptionKey: "COMPLEXITY_CONFUSION" }
    ],
    hint1: "Think about the rule: inner brackets must be closed before outer brackets.",
    hint2: "Last-In (innermost) must be First-Out.",
    explanation: "Parentheses syntax has a recursive nested structure. The most recently opened bracket must match the earliest closing bracket encountered, which is the definition of LIFO."
  },

  // --- SEARCHING ---
  {
    id: "srch_01",
    conceptId: "searching",
    difficulty: "Medium",
    title: "Binary Search Midpoint Overflow Invariant",
    code: `// Calculating midpoint between low and high:
int mid1 = (low + high) / 2;
int mid2 = low + (high - low) / 2;`,
    prompt: "Why is `mid2` strongly preferred over `mid1` in competitive programming and production systems?",
    options: [
      { text: "If low + high exceeds Integer.MAX_VALUE, mid1 overflows into a negative integer, causing ArrayIndexOutOfBoundsException.", isCorrect: true, reason: "Correct! When low + high > 2^31 - 1, the sum becomes negative in two's complement. mid2 subtracts first, staying strictly within positive bounds.", misconceptionKey: null },
      { text: "mid2 runs in O(1) time while mid1 runs in O(log N).", isCorrect: false, reason: "Incorrect. Both are simple arithmetic expressions that execute in O(1) constant time.", misconceptionKey: "TIME_COMPLEXITY_OF_OPERATIONS" },
      { text: "mid1 causes a compile-time precision error.", isCorrect: false, reason: "Incorrect. Both compile cleanly in Java.", misconceptionKey: "SYNTAX_VS_RUNTIME_CONFUSION" },
      { text: "mid2 rounds towards negative infinity while mid1 rounds towards zero.", isCorrect: false, reason: "Incorrect. For positive integers, both expressions yield mathematically identical results when not overflowing.", misconceptionKey: "INTEGER_DIVISION_ROUNDING" }
    ],
    hint1: "What happens when both low and high are very large positive numbers (e.g., 1.5 billion each)?",
    hint2: "Their sum exceeds 2,147,483,647 (Integer.MAX_VALUE).",
    explanation: "This was a famous bug in Java's `java.util.Arrays.binarySearch` for nearly a decade! When arrays contain billions of elements, `low + high` overflows to a negative integer."
  },

  // --- SORTING ---
  {
    id: "sort_01",
    conceptId: "sorting",
    difficulty: "Hard",
    title: "Merge Sort Space Complexity Invariant",
    code: `// Merge Sort divides array into halves, sorts recursively, then merges.`,
    prompt: "Why does standard Merge Sort require O(N) auxiliary space, unlike QuickSort's O(log N)?",
    options: [
      { text: "Merging two sorted subarrays requires an auxiliary array buffer of size N to compare and copy elements.", isCorrect: true, reason: "Correct! The merge step needs external scratch buffer memory of size N to merge two ordered sequences without overwriting unvisited values.", misconceptionKey: null },
      { text: "Merge Sort creates N recursive stack frames at the same time.", isCorrect: false, reason: "Incorrect. The call tree has depth log2(N), so stack space is O(log N); the O(N) space comes from the merge buffer array.", misconceptionKey: "CALL_STACK_VS_HEAP_MEMORY" },
      { text: "QuickSort does not use recursion.", isCorrect: false, reason: "Incorrect. Standard QuickSort is recursive with O(log N) stack depth.", misconceptionKey: "ALGORITHM_STRUCTURE_CONFUSION" },
      { text: "Merge Sort duplicates every element into a HashMap.", isCorrect: false, reason: "Incorrect. Merge Sort uses arrays, not hash tables.", misconceptionKey: "DATA_STRUCTURE_MISCONCEPTION" }
    ],
    hint1: "Think about the merge step: can you merge two adjacent sorted sublists in-place in O(N) time?",
    hint2: "Without an auxiliary array, shifting elements in-place takes O(N^2) time.",
    explanation: "Standard Merge Sort needs an auxiliary array of size N to merge elements in linear time. Hence, auxiliary space complexity is O(N)."
  },

  // --- BINARY TREES ---
  {
    id: "tree_01",
    conceptId: "binary_trees",
    difficulty: "Hard",
    title: "Binary Search Tree Invariant & Validation",
    code: `class TreeNode {
    int val;
    TreeNode left, right;
    TreeNode(int val) { this.val = val; }
}

public static boolean isValidBST(TreeNode root) {
    return validate(root, null, null);
}
private static boolean validate(TreeNode node, Integer min, Integer max) {
    if (node == null) return true;
    if ((min != null && node.val <= min) || (max != null && node.val >= max)) return false;
    return validate(node.left, min, node.val) && validate(node.right, node.val, max);
}`,
    prompt: "Why does checking only `node.left.val < node.val && node.right.val > node.val` locally fail to validate a true BST?",
    options: [
      { text: "Because a BST requires all nodes in the left subtree to be strictly less than the ancestor, not just direct children.", isCorrect: true, reason: "Correct! A tree like [10, 5, 15, null, null, 6, 20] satisfies local child comparisons, but 6 is in the right subtree of 10 while being < 10, violating BST invariants.", misconceptionKey: null },
      { text: "Because Binary Search Trees do not have a left child.", isCorrect: false, reason: "Incorrect. BST nodes can have both left and right children.", misconceptionKey: "BST_DEFINITION_CONFUSION" },
      { text: "Because local checks cause a StackOverflowError.", isCorrect: false, reason: "Incorrect. Local checks won't cause stack overflow; they simply produce false positives.", misconceptionKey: "RUNTIME_ERROR_VS_LOGIC_ERROR" },
      { text: "Because BST traversal must be iterative.", isCorrect: false, reason: "Incorrect. Recursive traversal is standard and elegant for BST validation.", misconceptionKey: "ITERATION_VS_RECURSION_FALLACY" }
    ],
    hint1: "Can a node in the right subtree of the root have a value smaller than the root?",
    hint2: "The BST property is a global subtree invariant, not merely a local parent-child condition.",
    explanation: "In a valid BST, every single node in the right subtree of root must be strictly greater than root. A local check on node.right only checks its immediate parent, missing deeper violations."
  }
];
