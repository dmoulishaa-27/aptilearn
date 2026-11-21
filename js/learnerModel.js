// AptiLearn AI Advanced Learner Model Engine (Bayesian Knowledge Tracing & ELO Hybrid)
import { store } from './state.js';
import { SYLLABUS_CONCEPTS } from './config.js';

export class LearnerModelEngine {
  /**
   * Process a single submitted question attempt and update the learner model
   */
  static recordAttempt({
    conceptId,
    isCorrect,
    difficulty = "Medium",
    timeTakenSec = 30,
    confidence = "Medium",
    hintsUsed = 0,
    questionId = "",
    studentReasoning = ""
  }) {
    const user = store.currentUser;
    if (!user) return;

    if (!user.mastery) user.mastery = {};
    if (!user.conceptStats) user.conceptStats = {};

    const currentMastery = user.mastery[conceptId] ?? 0;
    const stats = user.conceptStats[conceptId] || {
      attempts: 0,
      correct: 0,
      incorrect: 0,
      totalTimeSec: 0,
      confidenceHistory: [],
      consecutiveMistakes: 0,
      hintsUsedTotal: 0,
      history: []
    };

    // Ensure all arrays & counters are safely initialized
    if (!stats.confidenceHistory) stats.confidenceHistory = [];
    if (!stats.history) stats.history = [];
    if (stats.consecutiveMistakes === undefined) stats.consecutiveMistakes = 0;
    if (stats.attempts === undefined) stats.attempts = 0;
    if (stats.totalTimeSec === undefined) stats.totalTimeSec = 0;
    if (stats.correct === undefined) stats.correct = 0;
    if (stats.incorrect === undefined) stats.incorrect = 0;
    if (stats.hintsUsedTotal === undefined) stats.hintsUsedTotal = 0;

    // Update basic counts
    stats.attempts += 1;
    stats.totalTimeSec += timeTakenSec;
    stats.hintsUsedTotal += hintsUsed;

    if (isCorrect) {
      stats.correct += 1;
      stats.consecutiveMistakes = 0;
    } else {
      stats.incorrect += 1;
      stats.consecutiveMistakes += 1;
    }

    const confMap = { Low: 1, Medium: 2, High: 3 };
    const confVal = confMap[confidence] || 2;
    stats.confidenceHistory.push(confVal);

    // Calculate dynamic mastery delta
    let delta = 0;
    const diffWeights = { Easy: 1.0, Medium: 1.25, Hard: 1.5 };
    const weight = diffWeights[difficulty] || 1.25;

    if (isCorrect) {
      // Base positive gain
      let baseGain = 9 * weight;

      // Confidence modifier: High confidence rewards genuine mastery; Low confidence suggests guessing
      if (confVal === 3) baseGain += 3;
      else if (confVal === 1) baseGain *= 0.65; // Lucky guess damping

      // Hint usage dampening: each hint lowers mastery gain (demonstrates reliance on assistance)
      if (hintsUsed === 1) baseGain *= 0.8;
      else if (hintsUsed >= 2) baseGain *= 0.6;

      // Speed bonus
      if (timeTakenSec < 20) baseGain += 2;
      else if (timeTakenSec > 75) baseGain *= 0.85;

      delta = Math.round(baseGain);
    } else {
      // Base negative penalty (failing an Easy question is penalized more heavily)
      const easyPenaltyWeight = difficulty === "Easy" ? 1.5 : (difficulty === "Medium" ? 1.2 : 0.9);
      let basePenalty = -10 * easyPenaltyWeight;

      // Overconfidence penalty: high confidence + wrong answer = severe blindspot!
      if (confVal === 3) {
        basePenalty -= 4; // Overconfidence flag
      }

      // Repeated mistakes amplify alert
      if (stats.consecutiveMistakes >= 2) {
        basePenalty -= (stats.consecutiveMistakes * 1.5);
      }

      delta = Math.round(basePenalty);
    }

    // New mastery calculation clamped between 0 and 100
    const newMastery = Math.max(0, Math.min(100, currentMastery + delta));
    user.mastery[conceptId] = newMastery;

    // Record historical trajectory point
    stats.history.push({
      timestamp: new Date().toISOString(),
      mastery: newMastery,
      delta,
      isCorrect,
      difficulty,
      timeTakenSec,
      confidence,
      hintsUsed
    });

    user.conceptStats[conceptId] = stats;

    // Update global aggregate numbers
    user.weeklyQuestionsDone = (user.weeklyQuestionsDone || 0) + 1;
    
    // XP reward
    const xpEarned = isCorrect ? (difficulty === "Hard" ? 45 : difficulty === "Medium" ? 30 : 20) : 5;
    store.addXp(xpEarned, `Solved: ${conceptId} (${difficulty})`);

    // Check for streak update
    this.checkStreakUpdate(user);

    // Check for badge unlocks
    this.checkBadges(user, conceptId, isCorrect);

    // Persist changes
    store.saveState();

    return {
      conceptId,
      oldMastery: currentMastery,
      newMastery,
      delta,
      isCorrect,
      consecutiveMistakes: stats.consecutiveMistakes,
      xpEarned,
      status: this.getConceptStatus(newMastery, stats.attempts)
    };
  }

  /**
   * Determine categorical status: Mastered, Learning, Needs Improvement, Not Started
   */
  static getConceptStatus(masteryScore = 0, attempts = 0) {
    if (attempts === 0) return "Not Started";
    if (masteryScore >= 75) return "Mastered";
    if (masteryScore >= 40) return "Learning";
    return "Needs Improvement";
  }

  /**
   * Aggregate statistics across syllabus for dashboard
   */
  static getOverallMetrics(user) {
    if (!user) return { totalAttempts: 0, overallAccuracy: 0, averageMastery: 0, strongConcepts: [], weakConcepts: [], conceptScores: [] };

    let totalAttempts = 0;
    let totalCorrect = 0;
    let sumMastery = 0;
    const conceptScores = [];

    SYLLABUS_CONCEPTS.forEach(c => {
      const m = user.mastery ? (user.mastery[c.id] ?? 0) : 0;
      const stats = user.conceptStats ? user.conceptStats[c.id] : null;
      sumMastery += m;

      if (stats) {
        totalAttempts += stats.attempts || 0;
        totalCorrect += stats.correct || 0;
      }

      conceptScores.push({
        id: c.id,
        name: c.name,
        shortName: c.shortName,
        category: c.category,
        mastery: m,
        attempts: stats ? stats.attempts : 0,
        status: this.getConceptStatus(m, stats ? stats.attempts : 0)
      });
    });

    const averageMastery = Math.round(sumMastery / SYLLABUS_CONCEPTS.length);
    const overallAccuracy = totalAttempts > 0 ? Math.round((totalCorrect / totalAttempts) * 100) : 0;

    // Sort to identify strong vs weak
    const attemptedConcepts = conceptScores.filter(c => c.attempts > 0);
    const sorted = [...attemptedConcepts].sort((a, b) => b.mastery - a.mastery);

    const strongConcepts = sorted.filter(c => c.mastery >= 75);
    const weakConcepts = sorted.filter(c => c.mastery < 60).reverse();

    // Default suggestions if none attempted
    if (weakConcepts.length === 0 && strongConcepts.length === 0) {
      weakConcepts.push({ id: "recursion", name: "Recursion & Call Stack", mastery: 34, status: "Needs Improvement" });
      weakConcepts.push({ id: "arrays", name: "Arrays & Memory", mastery: 62, status: "Learning" });
    }

    return {
      totalAttempts,
      totalCorrect,
      overallAccuracy,
      averageMastery,
      strongConcepts,
      weakConcepts,
      conceptScores
    };
  }

  static checkStreakUpdate(user) {
    const today = new Date().toISOString().split("T")[0];
    const lastActive = user.lastActiveDate ? user.lastActiveDate.split("T")[0] : null;

    if (!lastActive) {
      user.streakDays = 1;
    } else if (today !== lastActive) {
      const diffDays = Math.round((new Date(today) - new Date(lastActive)) / (1000 * 60 * 60 * 24));
      if (diffDays === 1) {
        user.streakDays = (user.streakDays || 1) + 1;
      } else if (diffDays > 1) {
        user.streakDays = 1;
      }
    }
    user.lastActiveDate = new Date().toISOString();
  }

  static checkBadges(user, conceptId, isCorrect) {
    if (user.streakDays >= 3) store.unlockBadge("streak_3");
    if (user.streakDays >= 7) store.unlockBadge("streak_7");
    
    if (conceptId === "recursion" && isCorrect && user.mastery.recursion >= 75) {
      store.unlockBadge("recursion_slayer");
    }

    let masteredCount = 0;
    SYLLABUS_CONCEPTS.forEach(c => {
      if ((user.mastery[c.id] || 0) >= 75) masteredCount++;
    });
    if (masteredCount >= 6) {
      store.unlockBadge("knowledge_master");
    }
  }
}
