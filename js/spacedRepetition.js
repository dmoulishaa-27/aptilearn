// LearnIQ Spaced Repetition System (SuperMemo SM-2 Algorithm)
import { store } from './state.js';
import { SYLLABUS_CONCEPTS } from './config.js';

export class SpacedRepetitionScheduler {
  /**
   * Applies the SM-2 algorithm to update a revision card after review
   * @param {string} cardId - Unique card identifier
   * @param {number} quality - Recall rating: 1 (Again), 2 (Hard), 3 (Good), 4 (Easy)
   */
  static processReview(cardId, quality) {
    const user = store.currentUser;
    if (!user || !user.spacedRepetitionQueue) return;

    const card = user.spacedRepetitionQueue.find(c => c.id === cardId);
    if (!card) return;

    let { intervalDays = 1, repetition = 0, easeFactor = 2.5 } = card;

    // SM-2 calculation
    if (quality < 2) {
      // Failed / Again: reset interval
      repetition = 0;
      intervalDays = 1;
    } else {
      // Successful recall
      if (repetition === 0) {
        intervalDays = 1;
      } else if (repetition === 1) {
        intervalDays = quality === 4 ? 4 : 2;
      } else {
        const factor = quality === 4 ? easeFactor * 1.3 : (quality === 2 ? 1.2 : easeFactor);
        intervalDays = Math.round(intervalDays * factor);
      }
      repetition += 1;
    }

    // Adjust ease factor
    // quality scaled to 0..5 scale for formula: 1->1, 2->3, 3->4, 4->5
    const qMapped = quality === 1 ? 1 : (quality === 2 ? 3 : (quality === 3 ? 4 : 5));
    easeFactor = easeFactor + (0.1 - (5 - qMapped) * (0.08 + (5 - qMapped) * 0.02));
    if (easeFactor < 1.3) easeFactor = 1.3;

    // Calculate next due date
    const nextDate = new Date();
    nextDate.setDate(nextDate.getDate() + intervalDays);
    const nextDueStr = nextDate.toISOString().split("T")[0];

    card.intervalDays = intervalDays;
    card.repetition = repetition;
    card.easeFactor = parseFloat(easeFactor.toFixed(2));
    card.dueDate = nextDueStr;
    card.lastReviewed = new Date().toISOString();
    card.dueStatus = intervalDays === 1 ? "Due Tomorrow" : `Due in ${intervalDays} days`;

    store.addXp(20, `Spaced review: ${card.title}`);
    store.saveState();

    return card;
  }

  /**
   * Checks student's active learner model and generates new revision cards for weak concepts
   */
  static autoScheduleWeakConcepts() {
    const user = store.currentUser;
    if (!user) return;
    if (!user.spacedRepetitionQueue) user.spacedRepetitionQueue = [];

    const existingConceptIds = new Set(user.spacedRepetitionQueue.map(c => c.conceptId));

    // Find concepts with mastery < 60% that don't have a revision card yet
    SYLLABUS_CONCEPTS.forEach(concept => {
      const mastery = user.mastery ? (user.mastery[concept.id] ?? 0) : 0;
      const stats = user.conceptStats ? user.conceptStats[concept.id] : null;

      if (mastery < 60 && stats && stats.attempts > 0 && !existingConceptIds.has(concept.id)) {
        user.spacedRepetitionQueue.push({
          id: `rev_auto_${concept.id}_${Date.now()}`,
          conceptId: concept.id,
          title: `${concept.shortName}: Core Invariant Review`,
          dueStatus: "Due Today",
          dueDate: new Date().toISOString().split("T")[0],
          intervalDays: 1,
          easeFactor: 2.1,
          repetition: 0,
          prompt: `What is the primary operational invariant and time complexity for ${concept.name}?`,
          answer: concept.description
        });
      }
    });

    store.saveState();
  }

  /**
   * Returns items partitioned into: due today, upcoming
   */
  static getQueuePartition(user) {
    if (!user || !user.spacedRepetitionQueue) return { dueToday: [], upcoming: [] };
    const today = new Date().toISOString().split("T")[0];

    const dueToday = [];
    const upcoming = [];

    user.spacedRepetitionQueue.forEach(card => {
      if (!card.dueDate || card.dueDate <= today) {
        dueToday.push({ ...card, dueStatus: "Due Today" });
      } else {
        upcoming.push(card);
      }
    });

    return { dueToday, upcoming };
  }
}
