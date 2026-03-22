/* ===================================================
   achievements.js - Badge and streak system
   =================================================== */

const Achievements = {

  BADGES: [
    {
      id: 'first-correct',
      name: 'First Steps!',
      description: 'Got your first answer correct',
      icon: '🌟',
      trigger: { type: 'totalCorrect', value: 1 }
    },
    {
      id: 'streak-5',
      name: 'On Fire!',
      description: '5 correct answers in a row',
      icon: '🔥',
      trigger: { type: 'streak', value: 5 }
    },
    {
      id: 'streak-10',
      name: 'Unstoppable!',
      description: '10 correct answers in a row',
      icon: '⚡',
      trigger: { type: 'streak', value: 10 }
    },
    {
      id: 'streak-25',
      name: 'Genius Mode!',
      description: '25 correct answers in a row',
      icon: '🧠',
      trigger: { type: 'streak', value: 25 }
    },
    {
      id: 'topic-complete-matter',
      name: 'Matter Master',
      description: 'Completed Matter & States',
      icon: '⚗️',
      trigger: { type: 'topicComplete', topic: 'science', subtopic: 'matter' }
    },
    {
      id: 'topic-complete-energy',
      name: 'Energy Expert',
      description: 'Completed Energy & Forces',
      icon: '⚡',
      trigger: { type: 'topicComplete', topic: 'science', subtopic: 'energy' }
    },
    {
      id: 'topic-complete-biology',
      name: 'Bio Scientist',
      description: 'Completed Biology & Life',
      icon: '🧬',
      trigger: { type: 'topicComplete', topic: 'science', subtopic: 'biology' }
    },
    {
      id: 'perfect-session',
      name: 'Perfect Score!',
      description: '100% correct in a session',
      icon: '💎',
      trigger: { type: 'perfectSession' }
    },
    {
      id: 'comeback',
      name: 'Never Give Up!',
      description: 'Got it right after 3 wrong',
      icon: '💪',
      trigger: { type: 'comeback', value: 3 }
    },
    {
      id: 'cards-50',
      name: 'Explorer',
      description: 'Completed 50 cards total',
      icon: '🔭',
      trigger: { type: 'totalCards', value: 50 }
    },
    {
      id: 'cards-100',
      name: 'Science Cadet',
      description: 'Completed 100 cards total',
      icon: '🚀',
      trigger: { type: 'totalCards', value: 100 }
    },
    {
      id: 'score-500',
      name: 'Point Collector',
      description: 'Earned 500 total points',
      icon: '⭐',
      trigger: { type: 'totalScore', value: 500 }
    }
  ],

  /**
   * Check all achievement triggers and return newly earned ones
   */
  check(data, context = {}) {
    const earned = data.achievements.earned || [];
    const newBadges = [];

    for (const badge of this.BADGES) {
      if (earned.includes(badge.id)) continue;

      let triggered = false;
      const t = badge.trigger;

      switch (t.type) {
        case 'totalCorrect':
          triggered = data.stats.totalCorrect >= t.value;
          break;
        case 'streak':
          triggered = data.stats.streakCurrent >= t.value;
          break;
        case 'topicComplete':
          triggered = data.topicProgress?.[t.topic]?.[t.subtopic]?.status === 'completed';
          break;
        case 'perfectSession':
          triggered = context.sessionCorrect > 0 &&
            context.sessionAttempts > 0 &&
            context.sessionCorrect === context.sessionAttempts;
          break;
        case 'comeback':
          triggered = context.consecutiveWrong >= t.value && context.justCorrect;
          break;
        case 'totalCards':
          triggered = data.stats.totalCardsCompleted >= t.value;
          break;
        case 'totalScore':
          triggered = (data.stats.totalScore || 0) >= t.value;
          break;
      }

      if (triggered) {
        newBadges.push(badge);
        earned.push(badge.id);
      }
    }

    if (newBadges.length > 0) {
      data.achievements.earned = earned;
      Storage.save(data);
    }

    return newBadges;
  },

  /**
   * Get badge definition by id
   */
  getById(id) {
    return this.BADGES.find(b => b.id === id);
  },

  /**
   * Get all earned badge objects from data
   */
  getEarned(data) {
    return (data.achievements.earned || [])
      .map(id => this.getById(id))
      .filter(Boolean);
  }
};
