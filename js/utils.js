/* ===================================================
   utils.js - Helper functions
   =================================================== */

const Utils = {
  /**
   * Generate a UUID v4
   */
  uuid() {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      return crypto.randomUUID();
    }
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
      const r = Math.random() * 16 | 0;
      return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
  },

  /**
   * Deep clone an object
   */
  clone(obj) {
    return JSON.parse(JSON.stringify(obj));
  },

  /**
   * Get query param from URL
   */
  getParam(name) {
    const params = new URLSearchParams(window.location.search);
    return params.get(name);
  },

  /**
   * Shuffle an array (Fisher-Yates)
   */
  shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  },

  /**
   * Capitalize first letter
   */
  capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  },

  /**
   * Format number with commas
   */
  formatNum(n) {
    return Number(n).toLocaleString();
  },

  /**
   * Clamp value between min and max
   */
  clamp(val, min, max) {
    return Math.min(Math.max(val, min), max);
  },

  /**
   * Debounce function
   */
  debounce(fn, ms = 300) {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => fn(...args), ms);
    };
  },

  /**
   * Simple DOM query shortcut
   */
  $(sel, parent = document) {
    return parent.querySelector(sel);
  },

  $$(sel, parent = document) {
    return [...parent.querySelectorAll(sel)];
  },

  /**
   * Show/hide element
   */
  show(el) {
    if (el) el.hidden = false;
  },

  hide(el) {
    if (el) el.hidden = true;
  },

  /**
   * Animate a number counter
   */
  animateCount(el, from, to, duration = 600) {
    if (!el) return;
    const start = performance.now();
    const update = (now) => {
      const t = Math.min((now - start) / duration, 1);
      const ease = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
      el.textContent = Math.round(from + (to - from) * ease);
      if (t < 1) requestAnimationFrame(update);
    };
    requestAnimationFrame(update);
  },

  /**
   * Check if answer matches (case-insensitive, trim)
   */
  answerMatches(userAnswer, correct) {
    const norm = s => String(s).trim().toLowerCase().replace(/\s+/g, ' ');
    if (Array.isArray(correct)) {
      return correct.some(c => norm(c) === norm(userAnswer));
    }
    return norm(userAnswer) === norm(correct);
  },

  /**
   * Play a simple beep (Web Audio)
   */
  playTone(frequency = 440, duration = 0.15, type = 'sine') {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = type;
      osc.frequency.value = frequency;
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + duration);
    } catch (e) {
      // Audio not available
    }
  },

  playCorrect() { this.playTone(660, 0.15); setTimeout(() => this.playTone(880, 0.15), 150); },
  playIncorrect() { this.playTone(220, 0.25, 'sawtooth'); },
  playAchievement() { [440,550,660,880].forEach((f,i) => setTimeout(() => this.playTone(f, 0.12), i * 80)); }
};
