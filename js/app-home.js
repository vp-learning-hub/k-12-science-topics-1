/* ===================================================
   app-home.js - Home page controller
   Manages topic cards, lock/unlock, stats display
   =================================================== */

document.addEventListener('DOMContentLoaded', () => {
  let data = Storage.init();
  data = Storage.checkUnlocks(data);

  // Render home page stats
  renderStats(data);

  // Render topic cards
  renderTopics(data);

  // Render recent badges
  renderRecentBadges(data);

  // Lock toggle button
  const lockToggle = document.getElementById('lockToggle');
  const lockIcon = document.getElementById('lockIcon');
  const lockLabel = document.getElementById('lockLabel');

  function updateLockBtn(isLocked) {
    lockIcon.textContent = isLocked ? '🔒' : '🔓';
    lockLabel.textContent = isLocked ? 'Locked' : 'Unlocked';
    lockToggle.title = isLocked
      ? 'Progression locked: complete topics to unlock next ones. Click to unlock all.'
      : 'Free mode: all topics accessible. Click to lock progression.';
  }

  updateLockBtn(data.lockMode !== false);

  lockToggle.addEventListener('click', () => {
    data = Storage.toggleLockMode();
    updateLockBtn(data.lockMode !== false);
    renderTopics(data);
  });

  // Topic start buttons
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.topic-start-btn');
    if (!btn || btn.disabled) return;
    const topic = btn.dataset.topic;
    const subtopic = btn.dataset.subtopic;
    window.location.href = `learn.html?topic=${topic}&subtopic=${subtopic}`;
  });
});

function renderStats(data) {
  const statCards = document.getElementById('statCards');
  const statStreak = document.getElementById('statStreak');
  const statBadges = document.getElementById('statBadges');

  if (statCards) statCards.textContent = Utils.formatNum(data.stats.totalCardsCompleted || 0);
  if (statStreak) statStreak.textContent = data.stats.streakBest || 0;
  if (statBadges) statBadges.textContent = (data.achievements.earned || []).length;
}

function renderTopics(data) {
  const topics = [
    { id: 'matter', label: 'Matter & States', icon: '⚗️' },
    { id: 'energy', label: 'Energy & Forces', icon: '⚡' },
    { id: 'biology', label: 'Biology & Life', icon: '🧬' }
  ];

  topics.forEach(({ id, label, icon }) => {
    const tp = data.topicProgress?.science?.[id];
    if (!tp) return;

    const card = document.getElementById(`topic-${id}`);
    const statusEl = document.getElementById(`status-${id}`);
    const progressEl = document.getElementById(`progress-${id}`);
    const startBtn = card?.querySelector('.topic-start-btn');

    if (!card) return;

    const total = tp.cardsTotal || 20;
    const completed = tp.cardsCompleted || 0;
    const pct = Utils.clamp(Math.round((completed / total) * 100), 0, 100);
    const score = tp.score || 0;
    const status = tp.status;

    // Update progress bar
    const fill = progressEl?.querySelector('.mini-progress-bar__fill');
    const progressText = progressEl?.querySelector('.progress-text');

    if (fill) fill.style.width = `${pct}%`;

    if (progressText) {
      if (status === 'locked') {
        const prev = { energy: 'Matter', biology: 'Energy' }[id];
        progressText.textContent = `Unlock: 70% in ${prev}`;
      } else if (status === 'completed') {
        progressText.textContent = `Completed! Score: ${score}%`;
      } else {
        progressText.textContent = `${completed} / ${total} cards`;
      }
    }

    // Update status badge
    if (statusEl) {
      const dot = statusEl.querySelector('.status-dot');
      const txt = statusEl.querySelector('.status-text');

      dot.className = 'status-dot';
      if (status === 'completed') {
        dot.classList.add('status-dot--completed');
        if (txt) txt.textContent = 'Completed';
      } else if (status === 'locked') {
        dot.classList.add('status-dot--locked');
        if (txt) txt.textContent = 'Locked';
      } else {
        dot.classList.add('status-dot--active');
        if (txt) txt.textContent = completed > 0 ? 'In Progress' : 'Available';
      }
    }

    // Lock/unlock card
    if (status === 'locked') {
      card.classList.add('topic-card--locked');
      if (startBtn) {
        startBtn.disabled = true;
        startBtn.innerHTML = '<span>🔒</span> Locked';
        startBtn.classList.remove('btn--primary');
        startBtn.classList.add('btn--secondary');
      }
    } else {
      card.classList.remove('topic-card--locked');
      if (startBtn) {
        startBtn.disabled = false;
        startBtn.classList.remove('btn--secondary');
        startBtn.classList.add('btn--primary');
        if (status === 'completed') {
          startBtn.textContent = 'Play Again →';
        } else if (completed > 0) {
          startBtn.textContent = 'Continue Mission →';
        } else {
          startBtn.textContent = 'Start Mission →';
        }
      }
    }
  });
}

function renderRecentBadges(data) {
  const earned = data.achievements?.earned || [];
  const section = document.getElementById('achievementsSection');
  const container = document.getElementById('recentBadges');

  if (!earned.length || !section || !container) return;

  section.style.display = 'block';
  container.innerHTML = '';

  // Show last 5 earned
  earned.slice(-5).reverse().forEach(id => {
    const badge = Achievements.getById(id);
    if (!badge) return;

    const el = document.createElement('div');
    el.className = 'badge badge--earned';
    el.innerHTML = `
      <div class="badge__icon">${badge.icon}</div>
      <div class="badge__name">${badge.name}</div>
      <div class="badge__desc">${badge.description}</div>
    `;
    container.appendChild(el);
  });
}
