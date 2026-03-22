/* ===================================================
   cards.js - Card rendering engine
   Renders concept, practice, and fact cards
   =================================================== */

const Cards = {

  /**
   * Render a card into the stage element
   */
  render(cardData, stageEl, onComplete) {
    if (!stageEl) return;

    // Fade/remove existing card
    const existing = stageEl.querySelector('.card');
    if (existing) {
      existing.classList.add('card-exit');
      setTimeout(() => {
        existing.remove();
        this._renderNew(cardData, stageEl, onComplete);
      }, 280);
    } else {
      this._renderNew(cardData, stageEl, onComplete);
    }
  },

  _renderNew(cardData, stageEl, onComplete) {
    // Remove loading indicator
    const loader = stageEl.querySelector('.card-loading');
    if (loader) loader.remove();

    let cardEl;
    switch (cardData.type) {
      case 'concept': cardEl = this.renderConcept(cardData, onComplete); break;
      case 'practice': cardEl = this.renderPractice(cardData, onComplete); break;
      case 'fact': cardEl = this.renderFact(cardData, onComplete); break;
      default: cardEl = this.renderConcept(cardData, onComplete);
    }

    cardEl.classList.add('card-enter');
    stageEl.appendChild(cardEl);
    cardEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  },

  /* ===================== CONCEPT CARD ===================== */
  renderConcept(data, onComplete) {
    const card = this._createCard('concept');

    // Label
    card.appendChild(this._label('concept', '💡 Concept'));

    // Visual
    if (data.content.visual) {
      const vis = document.createElement('div');
      vis.className = 'card__visual';
      vis.textContent = data.content.visual;
      vis.setAttribute('aria-label', data.content.visualAlt || '');
      card.appendChild(vis);
    }

    // Title
    const title = document.createElement('h2');
    title.className = 'card__title';
    title.textContent = data.content.title;
    card.appendChild(title);

    // Explanation
    const exp = document.createElement('p');
    exp.className = 'card__explanation';
    exp.textContent = data.content.explanation;
    card.appendChild(exp);

    // Key points
    if (data.content.keyPoints && data.content.keyPoints.length) {
      const kp = document.createElement('div');
      kp.className = 'card__keypoints';
      data.content.keyPoints.forEach(point => {
        const p = document.createElement('div');
        p.className = 'keypoint';
        p.textContent = point;
        kp.appendChild(p);
      });
      card.appendChild(kp);
    }

    // Action
    const actions = document.createElement('div');
    actions.className = 'card__actions';
    const btn = document.createElement('button');
    btn.className = 'btn btn--primary btn--lg';
    btn.textContent = 'Got it! Continue →';
    btn.addEventListener('click', () => onComplete({ type: 'concept', cardId: data.id }));
    actions.appendChild(btn);
    card.appendChild(actions);

    return card;
  },

  /* ===================== PRACTICE CARD ===================== */
  renderPractice(data, onComplete) {
    const card = this._createCard('practice');
    const qType = data.content.questionType;

    // Label
    card.appendChild(this._label('practice', '🎯 Practice'));

    // Question
    const q = document.createElement('p');
    q.className = 'card__question';
    q.textContent = data.content.question;
    card.appendChild(q);

    // Visual if any
    if (data.content.visual) {
      const vis = document.createElement('div');
      vis.className = 'card__visual';
      vis.textContent = data.content.visual;
      card.appendChild(vis);
    }

    // Question input area
    let inputArea, getAnswer, setDisabled;

    switch (qType) {
      case 'true-false':
        ({ el: inputArea, getAnswer, setDisabled } = this._buildTrueFalse(data));
        break;
      case 'fill-blank':
        ({ el: inputArea, getAnswer, setDisabled } = this._buildFillBlank(data));
        break;
      case 'multiple-choice':
      default:
        ({ el: inputArea, getAnswer, setDisabled } = this._buildMultiChoice(data));
        break;
    }
    card.appendChild(inputArea);

    // Hint area
    if (data.content.hint) {
      const hintArea = document.createElement('div');
      hintArea.className = 'hint-area';
      const hintBtn = document.createElement('button');
      hintBtn.className = 'hint-toggle';
      hintBtn.textContent = '💡 Need a hint?';
      const hintText = document.createElement('div');
      hintText.className = 'hint-text';
      hintText.textContent = data.content.hint;
      hintText.hidden = true;
      hintBtn.addEventListener('click', () => {
        hintText.hidden = !hintText.hidden;
        hintBtn.textContent = hintText.hidden ? '💡 Need a hint?' : '💡 Hide hint';
      });
      hintArea.appendChild(hintBtn);
      hintArea.appendChild(hintText);
      card.appendChild(hintArea);
    }

    // Feedback area (initially empty)
    const feedbackArea = document.createElement('div');
    feedbackArea.id = 'feedbackArea';
    card.appendChild(feedbackArea);

    // Actions
    const actions = document.createElement('div');
    actions.className = 'card__actions';

    let submitted = false;
    let wrongCount = 0;
    // 'check' = evaluating answers, 'next' = waiting to advance
    let btnMode = 'check';

    const checkBtn = document.createElement('button');
    checkBtn.className = 'btn btn--primary btn--lg';
    checkBtn.textContent = 'Check Answer ✓';

    checkBtn.addEventListener('click', () => {
      if (btnMode === 'next') {
        onComplete({ type: 'practice', cardId: data.id, correct: submitted === 'correct', wrongCount });
        return;
      }

      if (submitted) return;
      const userAnswer = getAnswer();

      if (!userAnswer || (Array.isArray(userAnswer) && userAnswer.length === 0)) {
        // No answer selected
        feedbackArea.innerHTML = '';
        const warn = document.createElement('p');
        warn.style.color = 'var(--color-accent)';
        warn.style.fontSize = 'var(--font-size-sm)';
        warn.textContent = 'Please select or type an answer first!';
        feedbackArea.appendChild(warn);
        return;
      }

      const isCorrect = this._checkAnswer(userAnswer, data);

      if (isCorrect) {
        submitted = 'correct';
        btnMode = 'next';
        setDisabled(true);
        this._showFeedback(feedbackArea, true, data.content.explanationOnCorrect);
        checkBtn.textContent = 'Next Card →';
        if (Storage.get().preferences.soundEnabled) Utils.playCorrect();
      } else {
        wrongCount++;
        if (wrongCount >= 2) {
          // After 2 wrong, show answer and allow continuing
          submitted = 'wrong';
          btnMode = 'next';
          setDisabled(true);
          this._showFeedback(feedbackArea, false, data.content.explanationOnWrong);
          this._markCorrectOptions(inputArea, data);
          checkBtn.textContent = 'Continue →';
        } else {
          this._showFeedback(feedbackArea, false, 'Not quite! Try again 💪');
        }
        if (Storage.get().preferences.soundEnabled) Utils.playIncorrect();
      }
    });

    actions.appendChild(checkBtn);
    card.appendChild(actions);

    return card;
  },

  /* ===================== FACT CARD ===================== */
  renderFact(data, onComplete) {
    const card = this._createCard('fact');

    // Fact break label
    const breakLabel = document.createElement('div');
    breakLabel.className = 'fact-break-label';
    breakLabel.textContent = '⏸ FACT BREAK';
    card.appendChild(breakLabel);

    // Hook
    const hook = document.createElement('div');
    hook.className = 'fact-hook';
    hook.textContent = data.content.hook;
    card.appendChild(hook);

    // Visual
    if (data.content.visual) {
      const vis = document.createElement('div');
      vis.className = 'card__visual';
      vis.textContent = data.content.visual;
      card.appendChild(vis);
    }

    // Title
    const title = document.createElement('h2');
    title.className = 'fact-title';
    title.textContent = data.content.title;
    card.appendChild(title);

    // Fact text
    const factText = document.createElement('p');
    factText.className = 'fact-text';
    factText.textContent = data.content.fact;
    card.appendChild(factText);

    // Concept connection
    if (data.content.conceptConnection) {
      const conn = document.createElement('div');
      conn.className = 'fact-connection';
      conn.textContent = `Related to: ${data.content.conceptConnection}`;
      card.appendChild(conn);
    }

    // Fun question (optional)
    if (data.content.funQuestion) {
      const fq = data.content.funQuestion;
      const fqArea = document.createElement('div');
      fqArea.className = 'fact-fun-question';

      const fqLabel = document.createElement('div');
      fqLabel.className = 'fact-fun-question__label';
      fqLabel.textContent = '💭 Fun Question (optional)';

      const fqText = document.createElement('p');
      fqText.className = 'fact-fun-question__text';
      fqText.textContent = fq.text;

      const fqInput = document.createElement('input');
      fqInput.type = 'text';
      fqInput.className = 'fact-fun-input';
      fqInput.placeholder = 'Type your answer... (no pressure!)';
      fqInput.setAttribute('aria-label', 'Optional fun question answer');

      const fqAnswer = document.createElement('div');
      fqAnswer.className = 'fact-answer';
      fqAnswer.textContent = `Answer: ${fq.answer}`;

      const fqReveal = document.createElement('button');
      fqReveal.className = 'hint-toggle';
      fqReveal.style.marginTop = '8px';
      fqReveal.textContent = 'Reveal answer';
      fqReveal.addEventListener('click', () => {
        fqAnswer.classList.add('show');
        fqReveal.hidden = true;
        if (Storage.get().preferences.soundEnabled) {
          Utils.playTone(440, 0.1);
        }
      });

      fqArea.appendChild(fqLabel);
      fqArea.appendChild(fqText);
      fqArea.appendChild(fqInput);
      fqArea.appendChild(fqReveal);
      fqArea.appendChild(fqAnswer);
      card.appendChild(fqArea);
    }

    // Actions
    const actions = document.createElement('div');
    actions.className = 'card__actions';

    const skipBtn = document.createElement('button');
    skipBtn.className = 'btn btn--ghost';
    skipBtn.textContent = 'Skip →';
    skipBtn.addEventListener('click', () => onComplete({ type: 'fact', cardId: data.id }));

    const continueBtn = document.createElement('button');
    continueBtn.className = 'btn btn--primary btn--lg';
    continueBtn.textContent = 'Cool! Continue →';
    continueBtn.addEventListener('click', () => onComplete({ type: 'fact', cardId: data.id }));

    actions.appendChild(skipBtn);
    actions.appendChild(continueBtn);
    card.appendChild(actions);

    return card;
  },

  /* ===================== HELPERS ===================== */

  _createCard(type) {
    const card = document.createElement('div');
    card.className = `card card--${type}`;
    card.setAttribute('role', 'article');
    return card;
  },

  _label(type, text) {
    const label = document.createElement('div');
    label.className = 'card__label';
    label.textContent = text;
    return label;
  },

  _buildMultiChoice(data) {
    const el = document.createElement('div');
    el.className = 'card__options';
    const selected = new Set();
    const btns = [];

    const options = Utils.shuffle(data.content.options);

    options.forEach(opt => {
      const btn = document.createElement('button');
      btn.className = 'option-btn';
      btn.textContent = opt;
      btn.dataset.value = opt;

      btn.addEventListener('click', () => {
        if (data.content.acceptMultiple) {
          if (selected.has(opt)) {
            selected.delete(opt);
            btn.classList.remove('option--selected');
          } else {
            selected.add(opt);
            btn.classList.add('option--selected');
          }
        } else {
          // Single select
          btns.forEach(b => b.classList.remove('option--selected'));
          selected.clear();
          selected.add(opt);
          btn.classList.add('option--selected');
        }
      });

      btns.push(btn);
      el.appendChild(btn);
    });

    const getAnswer = () => data.content.acceptMultiple ? [...selected] : [...selected][0];
    const setDisabled = (v) => btns.forEach(b => { b.disabled = v; });

    return { el, getAnswer, setDisabled, btns };
  },

  _buildFillBlank(data) {
    const el = document.createElement('div');
    el.className = 'fill-blank-area';

    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'blank-input';
    input.placeholder = 'Type your answer here...';
    input.setAttribute('aria-label', 'Answer input');

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const checkBtn = document.querySelector('.btn--primary');
        if (checkBtn) checkBtn.click();
      }
    });

    el.appendChild(input);

    const getAnswer = () => input.value.trim();
    const setDisabled = (v) => { input.disabled = v; };

    return { el, getAnswer, setDisabled };
  },

  _buildTrueFalse(data) {
    const el = document.createElement('div');
    el.className = 'true-false-options';
    let selected = null;

    const trueBtn = document.createElement('button');
    trueBtn.className = 'tf-btn tf-btn--true';
    trueBtn.textContent = '✓ True';
    trueBtn.dataset.value = 'true';

    const falseBtn = document.createElement('button');
    falseBtn.className = 'tf-btn tf-btn--false';
    falseBtn.textContent = '✗ False';
    falseBtn.dataset.value = 'false';

    const handleSelect = (val, btn, other) => {
      selected = val;
      btn.classList.add('option--selected');
      other.classList.remove('option--selected');
    };

    trueBtn.addEventListener('click', () => handleSelect('true', trueBtn, falseBtn));
    falseBtn.addEventListener('click', () => handleSelect('false', falseBtn, trueBtn));

    el.appendChild(trueBtn);
    el.appendChild(falseBtn);

    const getAnswer = () => selected;
    const setDisabled = (v) => { trueBtn.disabled = v; falseBtn.disabled = v; };

    return { el, getAnswer, setDisabled };
  },

  _checkAnswer(userAnswer, data) {
    const correct = data.content.correct;
    if (data.content.acceptMultiple && Array.isArray(correct)) {
      // All correct answers must be selected
      const ua = Array.isArray(userAnswer) ? userAnswer : [userAnswer];
      return correct.every(c => ua.some(u => Utils.answerMatches(u, c))) &&
             ua.every(u => correct.some(c => Utils.answerMatches(u, c)));
    }
    if (Array.isArray(correct)) {
      return correct.some(c => Utils.answerMatches(userAnswer, c));
    }
    return Utils.answerMatches(userAnswer, correct);
  },

  _markCorrectOptions(inputArea, data) {
    const correct = Array.isArray(data.content.correct)
      ? data.content.correct
      : [data.content.correct];

    const optBtns = inputArea.querySelectorAll('.option-btn, .tf-btn');
    optBtns.forEach(btn => {
      const val = btn.dataset.value || btn.textContent.replace('✓ ', '').replace('✗ ', '').toLowerCase();
      if (correct.some(c => Utils.answerMatches(val, c))) {
        btn.classList.add('option--correct');
        btn.classList.remove('option--selected', 'option--incorrect');
      } else if (btn.classList.contains('option--selected')) {
        btn.classList.add('option--incorrect');
      }
    });

    // Fill blank
    const input = inputArea.querySelector('.blank-input');
    if (input) {
      input.classList.add('input--incorrect');
      // Show correct answer next to it
      const hint = document.createElement('p');
      hint.style.fontSize = 'var(--font-size-sm)';
      hint.style.color = 'var(--color-correct)';
      hint.textContent = `Correct answer: ${Array.isArray(data.content.correct) ? data.content.correct[0] : data.content.correct}`;
      input.parentNode.appendChild(hint);
    }
  },

  _showFeedback(feedbackEl, isCorrect, message) {
    feedbackEl.innerHTML = '';
    const banner = document.createElement('div');
    banner.className = `feedback-banner feedback-banner--${isCorrect ? 'correct' : 'incorrect'}`;

    const icon = document.createElement('div');
    icon.className = 'feedback-banner__icon';
    icon.textContent = isCorrect ? '✓' : '💪';

    const text = document.createElement('div');
    text.className = 'feedback-banner__text';

    const headline = document.createElement('div');
    headline.className = 'feedback-banner__headline';
    headline.textContent = isCorrect ? 'Awesome!' : 'Almost there!';

    const detail = document.createElement('div');
    detail.className = 'feedback-banner__detail';
    detail.textContent = message || '';

    text.appendChild(headline);
    if (message) text.appendChild(detail);
    banner.appendChild(icon);
    banner.appendChild(text);
    feedbackEl.appendChild(banner);
  }
};
