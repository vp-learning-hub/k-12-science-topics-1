/* ===================================================
   storage.js - localStorage wrapper
   =================================================== */

const STORAGE_KEY = 'stemKidsProgress';
const SESSION_CARDS = 20;

const Storage = {

  /**
   * Initialize or load existing progress
   */
  init() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const data = this.createNewUser();
      this.save(data);
      return data;
    }
    try {
      return JSON.parse(raw);
    } catch (e) {
      const data = this.createNewUser();
      this.save(data);
      return data;
    }
  },

  /**
   * Save progress to localStorage
   */
  save(data) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.warn('Storage save failed:', e);
    }
  },

  /**
   * Create a fresh user progress object
   */
  createNewUser() {
    return {
      userId: Utils.uuid(),
      createdAt: new Date().toISOString(),

      // Unlock mode: true = locked progression, false = free access
      lockMode: true,

      // Current learning state
      currentTopic: 'science',
      currentSubtopic: 'matter',
      currentCardIndex: 0,

      // Session tracking
      session: {
        startedAt: new Date().toISOString(),
        cardsViewed: 0,
        cardsSinceLastFact: 0,
        correctThisSession: 0,
        attemptsThisSession: 0,
        sessionCards: SESSION_CARDS
      },

      // Cumulative stats
      stats: {
        totalCardsCompleted: 0,
        totalCorrect: 0,
        totalAttempts: 0,
        totalScore: 0,
        streakCurrent: 0,
        streakBest: 0,
        totalTimeMinutes: 0
      },

      // Progress per topic/subtopic
      topicProgress: {
        science: {
          matter: {
            status: 'available',
            score: 0,
            cardsCompleted: 0,
            cardsTotal: SESSION_CARDS,
            correctAnswers: 0,
            totalAttempts: 0,
            currentCard: 0
          },
          energy: {
            status: 'locked',
            unlockAfter: 'matter',
            score: 0,
            cardsCompleted: 0,
            cardsTotal: SESSION_CARDS,
            correctAnswers: 0,
            totalAttempts: 0,
            currentCard: 0
          },
          biology: {
            status: 'locked',
            unlockAfter: 'energy',
            score: 0,
            cardsCompleted: 0,
            cardsTotal: SESSION_CARDS,
            correctAnswers: 0,
            totalAttempts: 0,
            currentCard: 0
          }
        }
      },

      // Achievements
      achievements: {
        earned: [],
        pending: [],
        displayed: []
      },

      // Preferences
      preferences: {
        theme: 'scifi',
        soundEnabled: true,
        animationsEnabled: true
      }
    };
  },

  /**
   * Get progress data (alias for init if already loaded)
   */
  get() {
    return this.init();
  },

  /**
   * Update specific nested field
   */
  updateField(path, value) {
    const data = this.init();
    const parts = path.split('.');
    let obj = data;
    for (let i = 0; i < parts.length - 1; i++) {
      if (obj[parts[i]] === undefined) obj[parts[i]] = {};
      obj = obj[parts[i]];
    }
    obj[parts[parts.length - 1]] = value;
    this.save(data);
    return data;
  },

  /**
   * Reset all progress
   */
  reset() {
    localStorage.removeItem(STORAGE_KEY);
    return this.init();
  },

  /**
   * Update subtopic progress after answering a card
   */
  recordAnswer(topic, subtopic, wasCorrect, pointsEarned) {
    const data = this.init();
    const tp = data.topicProgress[topic][subtopic];

    tp.totalAttempts = (tp.totalAttempts || 0) + 1;
    if (wasCorrect) {
      tp.correctAnswers = (tp.correctAnswers || 0) + 1;
    }

    // Update score as accuracy percentage
    tp.score = Math.round((tp.correctAnswers / tp.totalAttempts) * 100);

    // Global stats
    data.stats.totalAttempts++;
    data.stats.totalScore = (data.stats.totalScore || 0) + pointsEarned;
    if (wasCorrect) {
      data.stats.totalCorrect++;
      data.stats.streakCurrent++;
      if (data.stats.streakCurrent > data.stats.streakBest) {
        data.stats.streakBest = data.stats.streakCurrent;
      }
    } else {
      data.stats.streakCurrent = 0;
    }

    // Session stats
    data.session.attemptsThisSession++;
    if (wasCorrect) data.session.correctThisSession++;

    this.save(data);
    return data;
  },

  /**
   * Advance to next card in a subtopic
   */
  advanceCard(topic, subtopic) {
    const data = this.init();
    const tp = data.topicProgress[topic][subtopic];
    tp.currentCard = (tp.currentCard || 0) + 1;
    tp.cardsCompleted = Math.max(tp.cardsCompleted || 0, tp.currentCard);
    data.session.cardsViewed++;
    data.session.cardsSinceLastFact++;
    data.stats.totalCardsCompleted++;

    // Mark complete if done
    if (tp.currentCard >= SESSION_CARDS) {
      tp.status = 'completed';
      tp.completedAt = new Date().toISOString();
    }

    this.save(data);
    return data;
  },

  /**
   * Record a fact break viewed
   */
  recordFactViewed(topic, subtopic) {
    const data = this.init();
    data.session.cardsSinceLastFact = 0;
    this.save(data);
    return data;
  },

  /**
   * Check and unlock next subtopics based on score threshold.
   * Also re-locks topics that haven't been earned when switching back to locked mode.
   */
  checkUnlocks(data) {
    const UNLOCK_THRESHOLD = 70;
    const order = ['matter', 'energy', 'biology'];
    const tp = data.topicProgress.science;

    for (let i = 1; i < order.length; i++) {
      const prev = order[i - 1];
      const curr = order[i];
      const earned = tp[prev].score >= UNLOCK_THRESHOLD || tp[prev].status === 'completed';

      if (!data.lockMode) {
        // Free mode: unlock all locked topics
        if (tp[curr].status === 'locked') {
          tp[curr].status = 'available';
        }
      } else {
        // Locked mode: unlock only if earned; re-lock if not earned and not completed
        if (earned) {
          if (tp[curr].status === 'locked') {
            tp[curr].status = 'available';
          }
        } else {
          // Re-lock if topic hasn't been started (no cards completed)
          if (tp[curr].status !== 'completed' && (tp[curr].cardsCompleted || 0) === 0) {
            tp[curr].status = 'locked';
          }
        }
      }
    }
    this.save(data);
    return data;
  },

  /**
   * Toggle lock mode
   */
  toggleLockMode() {
    const data = this.init();
    data.lockMode = !data.lockMode;
    // Apply unlocks immediately if switching to free mode
    this.save(data);
    return this.checkUnlocks(data);
  }
};
