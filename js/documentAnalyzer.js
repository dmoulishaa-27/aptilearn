// AptiLearn AI Smart Notes & Document Analyzer Engine
import { PRELOADED_DOCUMENTS } from './config.js';
import { store } from './state.js';

export class DocumentAnalyzerEngine {
  constructor() {
    this.documents = JSON.parse(JSON.stringify(PRELOADED_DOCUMENTS));
    this.activeDocumentId = this.documents[0].id;
  }

  getDocuments() {
    return this.documents;
  }

  getActiveDocument() {
    return this.documents.find(d => d.id === this.activeDocumentId) || this.documents[0];
  }

  setActiveDocument(id) {
    this.activeDocumentId = id;
    store.notify();
  }

  addUploadedDocument(name, textContent) {
    const newDoc = {
      id: `doc_${Date.now()}`,
      title: name,
      category: "Uploaded Notes",
      size: `${Math.round(textContent.length / 1024 * 10) / 10} KB`,
      uploadedAt: new Date().toISOString().split("T")[0],
      summary: `Automated summary of ${name}: Covers key algorithmic paradigms, code structures, and definitions extracted from student notes.`,
      keyConcepts: ["Extracted Concept 1", "Core Definition", "Algorithmic Invariant"],
      content: textContent
    };
    this.documents.unshift(newDoc);
    this.activeDocumentId = newDoc.id;
    store.addXp(40, `Uploaded and analyzed document: ${name}`);
    store.notify();
    return newDoc;
  }

  generateMCQs(doc) {
    if (!doc) doc = this.getActiveDocument();
    return [
      {
        id: `mcq_doc_${Date.now()}_1`,
        prompt: `Based on '${doc.title}': What is the primary role of the base case in a recursive function?`,
        options: [
          { text: "To terminate recursion and prevent StackOverflowError", isCorrect: true, explanation: "Correct! The base case provides the termination condition that unwinds stack frames." },
          { text: "To allocate heap memory for the return value", isCorrect: false, explanation: "Incorrect. Return primitives and pointers live in stack frames, not separate heap blocks." },
          { text: "To increase time complexity to O(N log N)", isCorrect: false, explanation: "Incorrect. The base case halts execution, preventing infinite time complexity." },
          { text: "To duplicate input arrays", isCorrect: false, explanation: "Incorrect. Base cases do not duplicate arrays." }
        ]
      },
      {
        id: `mcq_doc_${Date.now()}_2`,
        prompt: `According to the document text, what happens during the 'Unwinding Phase' of recursion?`,
        options: [
          { text: "Instructions placed after the recursive call execute in reverse LIFO order", isCorrect: true, explanation: "Correct! Stack frames are popped off the call stack in Last-In First-Out order." },
          { text: "The JVM restarts the entire method from line 1", isCorrect: false, explanation: "Incorrect. Only active suspended stack frames resume." },
          { text: "All local variables are converted into static variables", isCorrect: false, explanation: "Incorrect. Local variable scope is strictly frame-specific." }
        ]
      }
    ];
  }

  generateFlashcards(doc) {
    if (!doc) doc = this.getActiveDocument();
    return [
      {
        id: `fc_doc_1`,
        front: "What causes a StackOverflowError in Java recursion?",
        back: "A missing, misplaced, or unreachable base case causing infinite activation frames on the JVM call stack.",
        category: doc.title
      },
      {
        id: `fc_doc_2`,
        front: "What is the global invariant of a valid Binary Search Tree (BST)?",
        back: "All nodes in the left subtree must be < Root, and all nodes in the right subtree must be > Root across all ancestor levels.",
        category: doc.title
      },
      {
        id: `fc_doc_3`,
        front: "Difference between Stack (LIFO) and Queue (FIFO)?",
        back: "Stack removes the most recently added item (top). Queue removes the earliest added item (front).",
        category: doc.title
      }
    ];
  }

  answerQuestionGrounded(question, doc) {
    if (!doc) doc = this.getActiveDocument();
    const q = question.toLowerCase();

    if (q.includes("base case") || q.includes("stop") || q.includes("terminate")) {
      return `**Grounded in ${doc.title} (Section 1.1)**:
According to the document, the Base Case is the mandatory terminating guard condition. Without it, the method invokes itself recursively without bound, causing the JVM thread stack memory to overflow (\`java.lang.StackOverflowError\`). The document advises writing the base case at line 1 of your method.`;
    } else if (q.includes("bst") || q.includes("tree") || q.includes("invariant")) {
      return `**Grounded in ${doc.title} (Chapter 5)**:
The document emphasizes that a valid BST requires *every* node in the right subtree to exceed the root, not merely local children (\`node.left.val < node.val\`). A global \`validate(node, min, max)\` range check is mandatory.`;
    } else {
      return `**Grounded in ${doc.title}**:
"${doc.summary}"

Key takeaway: Review the foundational concepts highlighted in this document: **${doc.keyConcepts.join(", ")}**. Would you like me to generate flashcards or practice questions from this chapter?`;
    }
  }
}

export const documentAnalyzer = new DocumentAnalyzerEngine();
