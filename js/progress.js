/* ===================================================
   progress.js - Progress tracking logic
   =================================================== */

const Progress = {

  POINTS: {
    CORRECT_ANSWER: 10,
    STREAK_BONUS: 2,       // bonus per streak point
    FIRST_TRY_BONUS: 5,    // correct on first attempt
    FACT_QUESTION_BONUS: 15,
    TOPIC_COMPLETE_BONUS: 50
  },

  UNLOCK_THRESHOLD: 70,

  /**
   * Calculate points for a correct answer
   */
  calcPoints(streak, isFirstTry) {
    let pts = this.POINTS.CORRECT_ANSWER;
    if (streak > 1) pts += Math.floor(streak * this.POINTS.STREAK_BONUS);
    if (isFirstTry) pts += this.POINTS.FIRST_TRY_BONUS;
    return pts;
  },

  /**
   * Get subtopic score as percentage
   */
  getSubtopicScore(data, topic, subtopic) {
    const tp = data.topicProgress?.[topic]?.[subtopic];
    if (!tp || !tp.totalAttempts) return 0;
    return Math.round((tp.correctAnswers / tp.totalAttempts) * 100);
  },

  /**
   * Get overall accuracy
   */
  getAccuracy(data) {
    if (!data.stats.totalAttempts) return null;
    return Math.round((data.stats.totalCorrect / data.stats.totalAttempts) * 100);
  },

  /**
   * Get subtopic completion percentage (cards done)
   */
  getCompletion(data, topic, subtopic) {
    const tp = data.topicProgress?.[topic]?.[subtopic];
    if (!tp) return 0;
    const total = tp.cardsTotal || 20;
    return Utils.clamp(Math.round((tp.cardsCompleted / total) * 100), 0, 100);
  },

  /**
   * Check if subtopic can be unlocked
   */
  canUnlock(data, topic, subtopic) {
    const order = ['matter', 'energy', 'biology'];
    const idx = order.indexOf(subtopic);
    if (idx === 0) return true;
    const prev = order[idx - 1];
    const prevTp = data.topicProgress?.[topic]?.[prev];
    if (!prevTp) return false;
    return prevTp.score >= this.UNLOCK_THRESHOLD || prevTp.status === 'completed';
  }
};
