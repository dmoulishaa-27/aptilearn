// LearnIQ Socratic AI Personal Tutor Engine
import { store } from './state.js';
import { SYLLABUS_CONCEPTS } from './config.js';
import { LearnerModelEngine } from './learnerModel.js';

export class TutorEngine {
  constructor() {
    this.history = [
      {
        id: "msg_init",
        sender: "tutor",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        text: "Hello! I am Socrates, your LearnIQ Personal AI Tutor. I track your mastery across Java and Data Structures. How can I assist your prep today?",
        quickChips: [
          "Why did I fail Recursion Base Cases?",
          "Give me an intuitive analogy for Stacks vs Queues",
          "Explain Java pass-by-value vs reference",
          "Test me on Binary Search boundaries"
        ]
      }
    ];
  }

  getMessages() {
    return this.history;
  }

  async sendMessage(userText) {
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    // Add user message
    this.history.push({
      id: `usr_${Date.now()}`,
      sender: "user",
      timestamp: timeStr,
      text: userText
    });

    const user = store.currentUser;
    const metrics = LearnerModelEngine.getOverallMetrics(user);
    const weakList = metrics.weakConcepts.map(c => c.name);

    // Call server or Gemini or local Socratic rule engine
    let tutorResponse = "";

    try {
      if (store.apiKey) {
        tutorResponse = await this.callGeminiTutor(userText, user, weakList);
      } else {
        // Try Python server
        const res = await fetch("/api/tutor", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: userText,
            context: {
              studentName: user.name,
              weakConcepts: weakList,
              totalQuestions: metrics.totalAttempts,
              accuracy: metrics.overallAccuracy
            }
          })
        });

        if (res.ok) {
          const data = await res.json();
          tutorResponse = data.response;
        } else {
          tutorResponse = this.generateLocalSocraticResponse(userText, weakList, user);
        }
      }
    } catch (e) {
      tutorResponse = this.generateLocalSocraticResponse(userText, weakList, user);
    }

    this.history.push({
      id: `tut_${Date.now()}`,
      sender: "tutor",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: tutorResponse
    });

    return tutorResponse;
  }

  async callGeminiTutor(userText, user, weakList) {
    const systemPrompt = `You are Socrates, a compassionate and expert Computer Science AI tutor for LearnIQ.
Student Profile:
Name: ${user.name}
Target Goal: ${user.examGoal}
Current Level: ${user.level}
Known Weak Concepts: ${weakList.join(", ") || "Recursion"}

Pedagogical Principles:
1. Socratic method: encourage understanding over raw answers.
2. If the student asks for the answer to a problem, provide progressive hints and analogies first.
3. Keep code examples concise and beginner-friendly Java.
4. Relate concepts to memory structure (Call Stack, Heap).`;

    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${store.apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          { role: "user", parts: [{ text: `${systemPrompt}\n\nStudent asks: ${userText}` }] }
        ]
      })
    });

    if (res.ok) {
      const data = await res.json();
      return data.candidates?.[0]?.content?.parts?.[0]?.text || "Let's explore that concept together!";
    }
    throw new Error("Gemini API error");
  }

  generateLocalSocraticResponse(query, weakConcepts, user) {
    const q = query.toLowerCase();
    const weakStr = weakConcepts.length > 0 ? weakConcepts.join(", ") : "Recursion and Arrays";

    if (q.includes("recursion") || q.includes("base case") || q.includes("fail")) {
      return `I noticed your learner model flagged a challenge with **Recursion Base Cases**!

Think of recursion like peeling an onion:
- Each layer is a method call awaiting the inside layer to finish.
- The solid center of the onion is your **Base Case**.

If you forget the base case, Java tries to peel layers forever until it runs out of memory, throwing a \`StackOverflowError\`.

**Socratic Question for you**:
If you write a method \`int countdown(int n)\`, what condition must be checked *before* calling \`countdown(n - 1)\`?`;
    }

    if (q.includes("pass-by-value") || q.includes("reference") || q.includes("parameter")) {
      return `This is one of the most famous stumbling blocks in Java!

Java is **strictly 100% pass-by-value**:
1. When you pass a primitive (\`int\`, \`boolean\`), Java copies the raw value.
2. When you pass an Object or Array, Java copies the **reference pointer** (the remote control).

You can use the remote control to change the TV channel (\`arr[0] = 99;\`), but if you throw away your remote and buy a new one (\`arr = new int[5];\`), the caller still has their original remote pointing to their original TV!`;
    }

    if (q.includes("stack") || q.includes("queue")) {
      return `Here is a crisp mental model:

- **Stack = Cafeteria Trays (LIFO)**:
  Last tray placed on top is the first one picked up.
  Primary operations: \`push()\`, \`pop()\` both in O(1).
  Great for: undo history, parenthesis matching, depth-first traversal.

- **Queue = Ticket Line (FIFO)**:
  First person to arrive is the first person served.
  Primary operations: \`offer()\` (enqueue), \`poll()\` (dequeue) both in O(1).
  Great for: breadth-first search, printer spooling.`;
    }

    if (q.includes("binary search") || q.includes("mid")) {
      return `In Binary Search, the search space halves every iteration, giving **O(log N)** time!

Watch out for the midpoint overflow bug:
\`\`\`java
// DANGEROUS: If low and high are near 2 billion, low + high overflows to negative!
int mid = (low + high) / 2;

// SAFE: Subtract first, ensuring the calculation stays positive:
int mid = low + (high - low) / 2;
\`\`\`

Would you like to try a practice challenge on this right now?`;
    }

    return `That's a thoughtful question! Based on your recent learning data, your strongest area is **Variables & Conditionals**, while your priority growth area is **${weakStr}**.

When tackling algorithmic problems, I recommend the 3-step diagnostic framework:
1. State the input constraints and edge cases (e.g. empty array, 0, null).
2. Trace a small manual example on paper.
3. Formulate the invariant condition.

What specific problem or code snippet would you like to break down together?`;
  }
}

export const tutorEngine = new TutorEngine();
