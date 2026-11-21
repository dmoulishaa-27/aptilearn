// AptiLearn AI Socratic Personal Tutor Engine with "Explain It Again" Modes
import { store } from './state.js';
import { LearnerModelEngine } from './learnerModel.js';

export class TutorEngine {
  constructor() {
    this.history = [
      {
        id: "msg_init",
        sender: "tutor",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        text: "Hello! I am Socrates, your AptiLearn AI Mentor. I continuously track your mastery across Java and Data Structures. You can ask me any doubt, or use the 'Explain It Again' modes to simplify any concept!",
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

  async explainItAgain(mode, topic = "Recursion") {
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    let explanation = "";

    if (mode === "simple") {
      explanation = `🎈 **Explain Simply (ELI5 Style)**:
Think of recursion like counting people in a long line.
You tap the shoulder of the person ahead of you and ask: "What position are you in?"
They tap the person ahead of them, and so on...
Until someone reaches the very front (the **Base Case**). The front person says: "I am #1!"
Now everyone can add +1 as the message travels back to you.
If there was no one at the front of the line, you'd keep asking forever!`;
    } else if (mode === "analogy") {
      explanation = `🌍 **Real-Life Analogy**:
Imagine Russian Nesting Dolls (Matryoshka).
Opening each doll is a recursive step: \`open(doll)\`.
Inside each doll is a slightly smaller doll: \`open(doll - 1)\`.
The **Base Case** is the smallest solid wooden doll at the center. Once you reach it, you stop opening and start closing them back up.
Without the solid doll, you'd be stuck in an infinite void!`;
    } else if (mode === "step_by_step") {
      explanation = `🔍 **Step-by-Step Code Trace**:
Let's trace \`factorial(3)\`:
\`\`\`
1. factorial(3) calls 3 * factorial(2)  [Frame 1 pushed]
2. factorial(2) calls 2 * factorial(1)  [Frame 2 pushed]
3. factorial(1) calls 1 * factorial(0)  [Frame 3 pushed]
4. BASE CASE: if (n <= 0) return 1      [Returns 1]
--- STACK UNWINDING PHASE ---
5. Frame 3 computes: 1 * 1 = 1          [Popped]
6. Frame 2 computes: 2 * 1 = 2          [Popped]
7. Frame 1 computes: 3 * 2 = 6          [Result: 6]
\`\`\``;
    } else if (mode === "visual") {
      explanation = `🖼️ **Visual Mental Model (Call Stack)**:
\`\`\`
  +-------------------------------+
  | Frame 3: fact(1) -> returns 1 |  <-- Top of Stack (Unwinds First)
  +-------------------------------+
  | Frame 2: fact(2) -> waiting   |
  +-------------------------------+
  | Frame 1: fact(3) -> waiting   |  <-- Main entry (Unwinds Last)
  +-------------------------------+
       JVM THREAD CALL STACK
\`\`\`
Each recursive call adds a box on top of the stack. Base case prevents memory overflow!`;
    } else if (mode === "quiz") {
      explanation = `🎯 **Practice Challenge for You**:
\`\`\`java
public static int mystery(int n) {
    if (n == 1) return 1;
    return n + mystery(n - 2);
}
\`\`\`
**Question**: What happens if we call \`mystery(4)\`? Does the base case ever get reached, or will it cause a StackOverflowError?`;
    }

    this.history.push({
      id: `tut_mode_${Date.now()}`,
      sender: "tutor",
      timestamp: timeStr,
      text: explanation
    });

    store.notify();
    return explanation;
  }

  async sendMessage(userText) {
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    this.history.push({
      id: `usr_${Date.now()}`,
      sender: "user",
      timestamp: timeStr,
      text: userText
    });

    const user = store.currentUser;
    const metrics = LearnerModelEngine.getOverallMetrics(user);
    const weakList = metrics.weakConcepts.map(c => c.name);

    let tutorResponse = "";

    try {
      if (store.apiKey) {
        tutorResponse = await this.callGeminiTutor(userText, user, weakList);
      } else {
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
    const systemPrompt = `You are Socrates, a compassionate and expert Computer Science AI tutor for AptiLearn AI.
Student: ${user.name}, Goal: ${user.examGoal}, Level: ${user.level}, Known Weak Topics: ${weakList.join(", ") || "Recursion"}
Language: ${user.preferredLanguage === 'hi' ? 'Hindi / Hinglish explanation with standard Java technical terms' : 'English'}`;

    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${store.apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: `${systemPrompt}\n\nStudent asks: ${userText}` }] }]
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

    if (store.language === 'hi') {
      return `नमस्ते ${user.name}! AptiLearn AI में आपका स्वागत है।

मैंने आपके Learner Model में देखा कि आपका **Recursion** थोड़ा कमजोर है।
Recursion में **Base Case** सबसे जरूरी चीज़ होती है। अगर आप Base Case नहीं लिखेंगे, तो Java का Call Stack भर जाएगा और \`StackOverflowError\` आ जाएगा!

क्या आप चाहते हैं कि मैं इसे एक आसान उदाहरण के साथ समझाऊं? नीचे 'Explain Simply' बटन दबाएं!`;
    }

    if (q.includes("recursion") || q.includes("base case") || q.includes("fail")) {
      return `I noticed your learner model flagged a challenge with **Recursion Base Cases**!

Think of recursion like peeling an onion:
- Each layer is a method call awaiting the inside layer to finish.
- The solid center of the onion is your **Base Case**.

If you forget the base case, Java tries to peel layers forever until it runs out of memory, throwing a \`StackOverflowError\`.

**Socratic Question for you**:
If you write a method \`int countdown(int n)\`, what condition must be checked *before* calling \`countdown(n - 1)\`? Use the 'Explain It Again' buttons below to see different explanation styles!`;
    }

    if (q.includes("pass-by-value") || q.includes("reference") || q.includes("parameter")) {
      return `Java is **strictly 100% pass-by-value**:
1. When you pass a primitive (\`int\`, \`boolean\`), Java copies the raw value.
2. When you pass an Object or Array, Java copies the **reference pointer** (the remote control).

You can use the remote control to change the TV channel (\`arr[0] = 99;\`), but if you buy a new remote (\`arr = new int[5];\`), the caller still has their original remote pointing to their original TV!`;
    }

    return `That's a thoughtful question! Based on your recent learning data, your strongest area is **Variables & Conditionals**, while your priority growth area is **${weakStr}**.

What specific problem or code snippet would you like to break down together?`;
  }
}

export const tutorEngine = new TutorEngine();
