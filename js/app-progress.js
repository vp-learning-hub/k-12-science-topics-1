/* ===================================================
   app-progress.js - Progress dashboard page
   =================================================== */

document.addEventListener('DOMContentLoaded', () => {
  const data = Storage.init();

  renderOverview(data);
  renderTopicProgress(data);
  renderBadges(data);
  setupReset();
});

function renderOverview(data) {
  const ovTotalScore = document.getElementById('ovTotalScore');
  const ovCardsCompleted = document.getElementById('ovCardsCompleted');
  const ovAccuracy = document.getElementById('ovAccuracy');
  const ovBestStreak = document.getElementById('ovBestStreak');

  if (ovTotalScore) ovTotalScore.textContent = Utils.formatNum(data.stats.totalScore || 0);
  if (ovCardsCompleted) ovCardsCompleted.textContent = Utils.formatNum(data.stats.totalCardsCompleted || 0);

  const accuracy = Progress.getAccuracy(data);
  if (ovAccuracy) ovAccuracy.textContent = accuracy !== null ? `${accuracy}%` : '—';

  if (ovBestStreak) ovBestStreak.textContent = data.stats.streakBest || 0;
}

function renderTopicProgress(data) {
  const list = document.getElementById('topicProgressList');
  if (!list) return;
  list.innerHTML = '';

  const topics = [
    { id: 'matter', label: 'Matter & States', icon: '⚗️' },
    { id: 'energy', label: 'Energy & Forces', icon: '⚡' },
    { id: 'biology', label: 'Biology & Life', icon: '🧬' }
  ];

  topics.forEach(({ id, label, icon }) => {
    const tp = data.topicProgress?.science?.[id];
    const status = tp?.status || 'locked';
    const completed = tp?.cardsCompleted || 0;
    const total = tp?.cardsTotal || 20;
    const score = tp?.score || 0;
    const pct = Utils.clamp(Math.round((completed / total) * 100), 0, 100);
    const accuracy = tp?.totalAttempts
      ? Math.round((tp.correctAnswers / tp.totalAttempts) * 100)
      : null;

    const item = document.createElement('div');
    item.className = 'topic-progress-item';

    const statusText = status === 'completed' ? '✓ Completed' :
      status === 'locked' ? '🔒 Locked' :
      completed > 0 ? `In Progress (${pct}%)` : 'Not Started';

    item.innerHTML = `
      <div class="topic-progress-item__header">
        <div class="topic-progress-item__name">
          <span>${icon}</span>
          <span>${label}</span>
        </div>
        <div class="topic-progress-item__score">${statusText}</div>
      </div>
      <div class="topic-progress-bar">
        <div class="topic-progress-bar__fill" style="width:${pct}%"></div>
      </div>
      <div style="display:flex; gap:16px; font-size:12px; color:var(--color-text-light);">
        <span>Cards: ${completed}/${total}</span>
        ${accuracy !== null ? `<span>Accuracy: ${accuracy}%</span>` : ''}
        ${score > 0 ? `<span>Score: ${score}%</span>` : ''}
      </div>
    `;

    list.appendChild(item);
  });
}

function renderBadges(data) {
  const grid = document.getElementById('badgesGrid');
  const noMsg = document.getElementById('noBadgesMsg');
  if (!grid) return;

  const earned = data.achievements?.earned || [];

  if (earned.length === 0) {
    if (noMsg) noMsg.style.display = 'block';
    return;
  }

  if (noMsg) noMsg.style.display = 'none';
  grid.innerHTML = '';

  // Show all badges (earned + locked for context)
  Achievements.BADGES.forEach(badge => {
    const isEarned = earned.includes(badge.id);
    const el = document.createElement('div');
    el.className = `badge ${isEarned ? 'badge--earned' : 'badge--locked'}`;
    el.innerHTML = `
      <div class="badge__icon">${badge.icon}</div>
      <div class="badge__name">${badge.name}</div>
      <div class="badge__desc">${badge.description}</div>
    `;
    el.title = isEarned ? `Earned: ${badge.name}` : `Not yet: ${badge.description}`;
    grid.appendChild(el);
  });
}

function setupReset() {
  const resetBtn = document.getElementById('resetAllProgress');
  if (!resetBtn) return;

  resetBtn.addEventListener('click', () => {
    if (confirm('Reset ALL progress permanently? You cannot undo this.')) {
      Storage.reset();
      window.location.href = 'index.html';
    }
  });
}
