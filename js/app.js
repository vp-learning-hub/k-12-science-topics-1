/* ===================================================
   app.js - Main learning page controller
   Orchestrates card flow, scoring, achievements
   =================================================== */

const App = {
  CARDS_BETWEEN_FACTS: 5,
  SESSION_CARDS: 20,

  state: {
    data: null,
    topic: 'science',
    subtopic: 'matter',
    cards: [],
    currentIndex: 0,
    sessionScore: 0,
    sessionStreak: 0,
    sessionCorrect: 0,
    sessionAttempts: 0,
    consecutiveWrong: 0,
    seenFacts: [],
    newBadges: []
  },

  async init() {
    // Read topic/subtopic from URL params
    const topic = Utils.getParam('topic') || 'science';
    const subtopic = Utils.getParam('subtopic') || 'matter';
    this.state.topic = topic;
    this.state.subtopic = subtopic;

    // Load persisted data
    this.state.data = Storage.init();

    // Resume card index from saved state
    const saved = this.state.data.topicProgress?.[topic]?.[subtopic];
    if (saved && saved.currentCard > 0 && saved.status !== 'completed') {
      this.state.currentIndex = saved.currentCard;
      this.state.sessionScore = 0; // Session score starts fresh
    }

    // Reset fact counter at the start of each session visit so we don't
    // immediately inject a fact card on resume due to a stale persisted value.
    this.state.data.session.cardsSinceLastFact = 0;
    Storage.save(this.state.data);

    // Load cards for this subtopic
    try {
      this.state.cards = await this.loadCards(topic, subtopic);
    } catch (e) {
      console.error('Failed to load cards:', e);
      document.getElementById('cardLoading').textContent =
        'Failed to load cards. Please refresh.';
      return;
    }

    // Update header
    this.updateHeader();

    // Apply preferences
    this.applyPreferences();

    // Setup settings panel
    this.setupSettings();

    // Start rendering
    this.renderCurrent();

    // Start session timer
    this.sessionStart = Date.now();
  },

  async loadCards(topic, subtopic) {
    const response = await fetch(`data/${topic}/${subtopic}.json`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return response.json();
  },

  updateHeader() {
    const breadcrumb = document.getElementById('topicBreadcrumb');
    if (breadcrumb) {
      const labels = { matter: 'Matter & States', energy: 'Energy & Forces', biology: 'Biology & Life' };
      breadcrumb.textContent = `Science → ${labels[this.state.subtopic] || Utils.capitalize(this.state.subtopic)}`;
    }

    const subtopicIcon = document.getElementById('subtopicIcon');
    const subtopicName = document.getElementById('subtopicName');
    const icons = { matter: '⚗️', energy: '⚡', biology: '🧬' };
    const names = { matter: 'Matter', energy: 'Energy', biology: 'Biology' };
    if (subtopicIcon) subtopicIcon.textContent = icons[this.state.subtopic] || '🔬';
    if (subtopicName) subtopicName.textContent = names[this.state.subtopic] || Utils.capitalize(this.state.subtopic);
  },

  applyPreferences() {
    const prefs = this.state.data.preferences;
    const soundToggle = document.getElementById('soundToggle');
    const animToggle = document.getElementById('animToggle');
    if (soundToggle) soundToggle.checked = prefs.soundEnabled !== false;
    if (animToggle) animToggle.checked = prefs.animationsEnabled !== false;
  },

  setupSettings() {
    const settingsBtn = document.getElementById('settingsBtn');
    const settingsPanel = document.getElementById('settingsPanel');
    const closeSettings = document.getElementById('closeSettings');
    const settingsOverlay = document.getElementById('settingsOverlay');
    const resetBtn = document.getElementById('resetProgress');
    const soundToggle = document.getElementById('soundToggle');
    const animToggle = document.getElementById('animToggle');

    if (settingsBtn) settingsBtn.addEventListener('click', () => Utils.show(settingsPanel));
    if (closeSettings) closeSettings.addEventListener('click', () => Utils.hide(settingsPanel));
    if (settingsOverlay) settingsOverlay.addEventListener('click', () => Utils.hide(settingsPanel));

    if (soundToggle) {
      soundToggle.addEventListener('change', () => {
        this.state.data.preferences.soundEnabled = soundToggle.checked;
        Storage.save(this.state.data);
      });
    }

    if (animToggle) {
      animToggle.addEventListener('change', () => {
        this.state.data.preferences.animationsEnabled = animToggle.checked;
        Storage.save(this.state.data);
      });
    }

    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        if (confirm('Reset ALL progress? This cannot be undone.')) {
          Storage.reset();
          window.location.href = 'index.html';
        }
      });
    }

    // Replay button
    const replayBtn = document.getElementById('replayBtn');
    if (replayBtn) {
      replayBtn.addEventListener('click', () => {
        window.location.reload();
      });
    }
  },

  /**
   * Determine next card: content or fact break
   */
  getNextCardData() {
    const cardsSinceFact = this.state.data.session.cardsSinceLastFact;

    // Inject a fact break every 5 content cards
    if (cardsSinceFact > 0 && cardsSinceFact % this.CARDS_BETWEEN_FACTS === 0) {
      const fact = Facts.getFactForSubtopic(this.state.subtopic, this.state.seenFacts);
      if (fact) {
        this.state.seenFacts.push(fact.id);
        return { ...fact, _isFact: true };
      }
    }

    // Return current content card
    if (this.state.currentIndex < this.state.cards.length) {
      return this.state.cards[this.state.currentIndex];
    }

    return null;
  },

  renderCurrent() {
    // Check if session is complete
    if (this.state.currentIndex >= this.SESSION_CARDS) {
      this.showSessionComplete();
      return;
    }

    const cardData = this.getNextCardData();
    if (!cardData) {
      this.showSessionComplete();
      return;
    }

    // Update progress bar
    this.updateProgressBar();

    // Render the card
    const stage = document.getElementById('cardStage');
    Cards.render(cardData, stage, (result) => this.onCardComplete(result));
  },

  onCardComplete(result) {
    if (result.type === 'fact') {
      // Fact viewed - reset fact counter
      Storage.recordFactViewed(this.state.topic, this.state.subtopic);
      this.state.data = Storage.get();
      this.renderCurrent();
      return;
    }

    if (result.type === 'concept') {
      // Concepts just advance, no scoring
      this.state.data = Storage.advanceCard(this.state.topic, this.state.subtopic);
      this.state.currentIndex++;
      this.renderCurrent();
      return;
    }

    if (result.type === 'practice') {
      const { correct, wrongCount } = result;
      const isFirstTry = wrongCount === 0;

      // Calculate points
      let points = 0;
      if (correct) {
        points = Progress.calcPoints(this.state.data.stats.streakCurrent + 1, isFirstTry);
        this.state.sessionScore += points;
        this.state.sessionCorrect++;
        this.state.consecutiveWrong = 0;
      } else {
        this.state.consecutiveWrong++;
      }
      this.state.sessionAttempts++;

      // Record answer in storage
      this.state.data = Storage.recordAnswer(
        this.state.topic,
        this.state.subtopic,
        correct,
        points
      );

      // Advance card
      this.state.data = Storage.advanceCard(this.state.topic, this.state.subtopic);
      this.state.currentIndex++;

      // Check achievements
      const context = {
        sessionCorrect: this.state.sessionCorrect,
        sessionAttempts: this.state.sessionAttempts,
        consecutiveWrong: this.state.consecutiveWrong,
        justCorrect: correct
      };
      const newBadges = Achievements.check(this.state.data, context);
      this.state.newBadges.push(...newBadges);

      if (newBadges.length > 0) {
        newBadges.forEach(b => {
          this.showAchievement(b);
          if (this.state.data.preferences.soundEnabled) {
            setTimeout(() => Utils.playAchievement(), 200);
          }
        });
      }

      // Check unlocks
      this.state.data = Storage.checkUnlocks(this.state.data);

      // Update UI
      this.updateGamificationBar();

      // Next card
      this.renderCurrent();
    }
  },

  updateProgressBar() {
    const fill = document.getElementById('sessionProgressFill');
    const label = document.getElementById('sessionProgressLabel');
    const pct = Utils.clamp((this.state.currentIndex / this.SESSION_CARDS) * 100, 0, 100);
    if (fill) fill.style.width = `${pct}%`;
    if (label) label.textContent = `${this.state.currentIndex} / ${this.SESSION_CARDS} cards`;
  },

  updateGamificationBar() {
    const streakEl = document.getElementById('streakCount');
    const scoreEl = document.getElementById('scoreCount');

    if (streakEl) {
      const newStreak = this.state.data.stats.streakCurrent;
      if (parseInt(streakEl.textContent) !== newStreak) {
        streakEl.textContent = newStreak;
        streakEl.classList.add('streak-pop');
        setTimeout(() => streakEl.classList.remove('streak-pop'), 400);
      }
    }

    if (scoreEl) {
      Utils.animateCount(scoreEl, parseInt(scoreEl.textContent) || 0, this.state.sessionScore, 400);
    }
  },

  showAchievement(badge) {
    const popup = document.getElementById('achievementPopup');
    if (!popup) return;

    document.getElementById('achIcon').textContent = badge.icon;
    document.getElementById('achName').textContent = badge.name;
    document.getElementById('achDesc').textContent = badge.description;

    popup.hidden = false;
    popup.style.animation = 'none';
    popup.offsetHeight; // reflow
    popup.style.animation = '';

    setTimeout(() => { popup.hidden = true; }, 3600);
  },

  showSessionComplete() {
    // Update final progress bar
    const fill = document.getElementById('sessionProgressFill');
    if (fill) fill.style.width = '100%';
    const label = document.getElementById('sessionProgressLabel');
    if (label) label.textContent = `${this.SESSION_CARDS} / ${this.SESSION_CARDS} cards`;

    // Check perfect session
    const context = {
      sessionCorrect: this.state.sessionCorrect,
      sessionAttempts: this.state.sessionAttempts
    };
    const finalBadges = Achievements.check(this.state.data, context);
    this.state.newBadges.push(...finalBadges);

    const complete = document.getElementById('sessionComplete');
    if (!complete) return;

    // Fill stats
    const finalScore = document.getElementById('finalScore');
    const finalCorrect = document.getElementById('finalCorrect');
    const finalStreak = document.getElementById('finalStreak');

    if (finalScore) finalScore.textContent = Utils.formatNum(this.state.sessionScore);
    if (finalCorrect) finalCorrect.textContent =
      `${this.state.sessionCorrect}/${this.state.sessionAttempts}`;
    if (finalStreak) finalStreak.textContent = this.state.data.stats.streakBest;

    // Show new badges
    const completeBadges = document.getElementById('completeBadges');
    if (completeBadges && this.state.newBadges.length > 0) {
      this.state.newBadges.forEach(b => {
        const bel = document.createElement('div');
        bel.className = 'badge badge--earned anim-bounce-in';
        bel.innerHTML = `<div class="badge__icon">${b.icon}</div><div class="badge__name">${b.name}</div>`;
        completeBadges.appendChild(bel);
      });
    }

    // Fire celebration
    this.launchFireworks(complete.querySelector('.session-complete__fireworks'));

    Utils.show(complete);

    if (this.state.data.preferences.soundEnabled) {
      Utils.playAchievement();
    }

    // Remove cards from stage
    const stage = document.getElementById('cardStage');
    if (stage) stage.innerHTML = '';
  },

  launchFireworks(container) {
    if (!container) return;
    container.innerHTML = '';
    const colors = ['#6366f1', '#06b6d4', '#f59e0b', '#22c55e', '#ec4899'];
    for (let i = 0; i < 20; i++) {
      const p = document.createElement('div');
      p.className = 'fw-particle';
      p.style.setProperty('--fx', `${(Math.random() - 0.5) * 200}px`);
      p.style.setProperty('--fy', `${-20 - Math.random() * 100}px`);
      p.style.background = colors[Math.floor(Math.random() * colors.length)];
      p.style.animationDelay = `${Math.random() * 0.5}s`;
      p.style.animationDuration = `${0.6 + Math.random() * 0.6}s`;
      p.style.left = `${20 + Math.random() * 60}%`;
      container.appendChild(p);
    }
  }
};

// Boot
document.addEventListener('DOMContentLoaded', () => App.init());
