// LearnIQ Adaptive Question Generator Engine
import { QUESTION_BANK } from './questionBank.js';
import { store } from './state.js';
import { SYLLABUS_CONCEPTS } from './config.js';

export class AdaptiveEngine {
  constructor() {
    this.askedQuestionIds = new Set();
  }

  /**
   * Selects or generates the next optimal question based on student's learner model
   * @param {string|null} targetConceptId - Specific concept requested, or null for auto-target
   * @param {string|null} preferredDifficulty - Optional difficulty override ('Easy', 'Medium', 'Hard')
   */
  async getNextQuestion(targetConceptId = null, preferredDifficulty = null) {
    const user = store.currentUser;
    const mastery = user ? (user.mastery || {}) : {};
    const conceptStats = user ? (user.conceptStats || {}) : {};

    // 1. Identify target concept if not explicitly given
    let conceptId = targetConceptId;
    if (!conceptId) {
      // Prioritize unresolved misconceptions first!
      if (user && user.activeMisconceptions && user.activeMisconceptions.length > 0) {
        const unresolved = user.activeMisconceptions.find(m => !m.resolved);
        if (unresolved) {
          conceptId = unresolved.conceptId;
        }
      }

      // Otherwise pick the concept with lowest mastery that has been started or is next in prerequisite order
      if (!conceptId) {
        let lowestScore = 999;
        SYLLABUS_CONCEPTS.forEach(c => {
          const score = mastery[c.id] ?? 0;
          if (score < lowestScore) {
            lowestScore = score;
            conceptId = c.id;
          }
        });
      }
    }

    if (!conceptId) conceptId = "recursion";

    // 2. Determine optimal difficulty level dynamically
    let difficulty = preferredDifficulty;
    if (!difficulty) {
      const currentScore = mastery[conceptId] ?? 0;
      const stats = conceptStats[conceptId];

      if (stats && stats.consecutiveMistakes >= 1) {
        // Step down or stay scaffolded
        difficulty = currentScore < 50 ? "Easy" : "Medium";
      } else if (currentScore >= 75) {
        difficulty = "Hard";
      } else if (currentScore >= 45) {
        difficulty = "Medium";
      } else {
        difficulty = "Easy";
      }
    }

    // 3. Check if Gemini API is available and enabled
    if (store.apiKey) {
      try {
        const aiQuestion = await this.generateWithGemini(conceptId, difficulty, store.apiKey);
        if (aiQuestion) {
          return aiQuestion;
        }
      } catch (err) {
        console.warn("[AdaptiveEngine] Gemini API call failed, falling back to repository:", err);
      }
    }

    // 4. Select from Question Bank matching concept & difficulty
    let candidates = QUESTION_BANK.filter(q => q.conceptId === conceptId);
    
    // Filter out recently asked questions if possible
    let unasked = candidates.filter(q => !this.askedQuestionIds.has(q.id));
    if (unasked.length === 0) {
      this.askedQuestionIds.clear(); // Reset cycle
      unasked = candidates;
    }

    // Try matching difficulty first
    let matched = unasked.filter(q => q.difficulty === difficulty);
    let chosen = matched.length > 0 ? matched[0] : (unasked.length > 0 ? unasked[0] : QUESTION_BANK[0]);

    this.askedQuestionIds.add(chosen.id);

    return {
      ...chosen,
      isAiGenerated: false,
      targetConceptName: (SYLLABUS_CONCEPTS.find(c => c.id === chosen.conceptId) || {}).name || chosen.conceptId
    };
  }

  /**
   * Real-time Gemini API question generator with structured prompt
   */
  async generateWithGemini(conceptId, difficulty, apiKey) {
    const conceptObj = SYLLABUS_CONCEPTS.find(c => c.id === conceptId) || { name: conceptId, description: "" };
    
    const prompt = `You are an expert Computer Science educator. Generate a high-quality Java & DSA multiple-choice exam question testing:
Topic: ${conceptObj.name} (${conceptObj.description})
Difficulty: ${difficulty}

Return ONLY valid JSON matching this exact structure without markdown backticks:
{
  "id": "ai_${Date.now()}",
  "conceptId": "${conceptId}",
  "difficulty": "${difficulty}",
  "title": "Short title",
  "code": "Java code snippet or null",
  "prompt": "Clear question text",
  "options": [
    { "text": "Option A text", "isCorrect": false, "reason": "Why A is wrong", "misconceptionKey": "MISCONCEPTION_TAG" },
    { "text": "Option B text", "isCorrect": true, "reason": "Why B is correct", "misconceptionKey": null },
    { "text": "Option C text", "isCorrect": false, "reason": "Why C is wrong", "misconceptionKey": "MISCONCEPTION_TAG" },
    { "text": "Option D text", "isCorrect": false, "reason": "Why D is wrong", "misconceptionKey": "MISCONCEPTION_TAG" }
  ],
  "hint1": "First conceptual hint",
  "hint2": "Second algorithmic hint",
  "explanation": "Full pedagogical explanation of the answer"
}`;

    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { responseMimeType: "application/json" }
      })
    });

    if (!res.ok) throw new Error(`Gemini HTTP error ${res.status}`);
    const data = await res.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (text) {
      const parsed = JSON.parse(text);
      parsed.isAiGenerated = true;
      parsed.targetConceptName = conceptObj.name;
      return parsed;
    }
    return null;
  }
}

export const adaptiveEngine = new AdaptiveEngine();
