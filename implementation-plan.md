# STEM Learning Platform for Kids (Age 10+) - Implementation Plan

> **Purpose**: Complete specification for an AI agent to build an interactive STEM learning platform
> **Target**: Static GitHub Pages deployment, localStorage persistence, zero build tools

---

## 🎯 Project Summary

Build a static web-based interactive learning platform that:
- Teaches STEM topics progressively to 10-year-olds
- Uses engaging card-based UI with Q&A interactions
- Inserts real-world facts every 5 interactions
- Tracks progress via localStorage
- Deploys to GitHub Pages (no server required)

---

## ⚙️ Pre-Implementation Questions

**The implementing agent MUST ask these questions before writing any code:**

```
┌─────────────────────────────────────────────────────────────────┐
│ REQUIRED USER INPUTS                                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ 1. TOPIC SELECTION                                              │
│    Q: What main STEM topic?                                     │
│    Options: Math | Science | Technology | Engineering | Mixed   │
│    Default: Mixed                                               │
│                                                                 │
│ 2. SUBTOPIC/PROGRESSION                                         │
│    Q: Specific subtopic OR gradual multi-topic progression?     │
│    Examples:                                                    │
│    - Specific: "Algebra basics"                                 │
│    - Gradual: "Numbers → Fractions → Basic Algebra"             │
│    Default: Gradual progression                                 │
│                                                                 │
│ 3. DEPTH LEVEL                                                  │
│    Q: Target endpoint difficulty?                               │
│    Options:                                                     │
│    - Foundation (grade 4-5 concepts)                            │
│    - Intermediate (grade 5-6 concepts)                          │
│    - Advanced (grade 6-7 concepts)                              │
│    Default: Intermediate                                        │
│                                                                 │
│ 4. SESSION LENGTH                                               │
│    Q: How many cards per learning session?                      │
│    Default: 15 cards                                            │
│    Range: 10-25                                                 │
│                                                                 │
│ 5. VISUAL THEME                                                 │
│    Q: Preferred theme?                                          │
│    Options: Space | Ocean | Jungle | Robots | Neutral           │
│    Default: Space                                               │
│                                                                 │
│ 6. PROGRESS TRACKING                                            │
│    Q: Track progress across sessions?                           │
│    Default: Yes (localStorage)                                  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🏗️ Technical Architecture

### Tech Stack

| Component | Technology | Reason |
|-----------|------------|--------|
| Structure | HTML5 | GitHub Pages compatible |
| Styling | CSS3 (vanilla) | No build step needed |
| Logic | Vanilla JavaScript | No dependencies |
| Storage | localStorage | Offline persistence |
| Hosting | GitHub Pages | Free, static |

### File Structure

```
/stem-kids/
│
├── index.html              # Landing page, topic selector
├── learn.html              # Main learning interface
├── progress.html           # Progress dashboard
│
├── css/
│   ├── main.css            # Core styles, CSS variables
│   ├── cards.css           # Card-specific styles
│   ├── animations.css      # Transitions, feedback animations
│   └── themes/
│       ├── space.css
│       ├── ocean.css
│       ├── jungle.css
│       └── robots.css
│
├── js/
│   ├── app.js              # Main controller, initialization
│   ├── cards.js            # Card rendering engine
│   ├── storage.js          # localStorage wrapper
│   ├── progress.js         # Progress tracking logic
│   ├── facts.js            # Real-world facts engine
│   ├── achievements.js     # Badge/streak system
│   └── utils.js            # Helper functions
│
├── data/
│   ├── math/
│   │   ├── numbers.json
│   │   ├── fractions.json
│   │   ├── decimals.json
│   │   └── algebra.json
│   ├── science/
│   │   ├── matter.json
│   │   ├── energy.json
│   │   └── biology.json
│   ├── technology/
│   │   └── coding-basics.json
│   ├── engineering/
│   │   └── simple-machines.json
│   └── facts/
│       ├── math-facts.json
│       ├── science-facts.json
│       └── tech-facts.json
│
└── assets/
    ├── icons/
    │   ├── star.svg
    │   ├── badge-*.svg
    │   └── ui-icons.svg
    ├── illustrations/
    │   ├── concept-visuals/
    │   └── theme-elements/
    └── sounds/ (optional)
        ├── correct.mp3
        ├── levelup.mp3
        └── badge.mp3
```

---

## 📦 Data Schemas

### Concept Card

```json
{
  "id": "math-fractions-001",
  "type": "concept",
  "topic": "math",
  "subtopic": "fractions",
  "difficulty": 1,
  "order": 1,
  "content": {
    "title": "What is a Fraction?",
    "explanation": "A fraction shows parts of a whole. Like cutting a pizza into 4 slices - each slice is 1/4 of the pizza!",
    "visual": "pizza-fraction.svg",
    "visualAlt": "Pizza divided into 4 equal slices"
  },
  "metadata": {
    "estimatedTime": 30,
    "prerequisites": []
  }
}
```

### Practice Card

```json
{
  "id": "math-fractions-p001",
  "type": "practice",
  "topic": "math",
  "subtopic": "fractions",
  "difficulty": 1,
  "order": 2,
  "content": {
    "question": "If you eat 2 slices of a pizza cut into 8 pieces, what fraction did you eat?",
    "questionType": "multiple-choice",
    "options": ["1/4", "2/8", "1/2", "2/4"],
    "correct": ["1/4", "2/8"],
    "acceptMultiple": true,
    "hint": "Count: How many did you eat? How many total?",
    "explanationOnCorrect": "Yes! 2 out of 8 = 2/8, which equals 1/4!",
    "explanationOnWrong": "Not quite. You ate 2 slices out of 8 total. That's 2/8!"
  },
  "metadata": {
    "estimatedTime": 45,
    "prerequisites": ["math-fractions-001"]
  }
}
```

### Practice Card Types

```json
{
  "questionTypes": {
    "multiple-choice": {
      "description": "Select one or more correct options",
      "fields": ["options", "correct", "acceptMultiple"]
    },
    "fill-blank": {
      "description": "Type the answer",
      "fields": ["blankPosition", "correct", "acceptedVariants"]
    },
    "drag-drop": {
      "description": "Match or order items",
      "fields": ["draggables", "dropZones", "correctMapping"]
    },
    "true-false": {
      "description": "Simple binary choice",
      "fields": ["statement", "correct"]
    }
  }
}
```

### Real-World Fact Card

```json
{
  "id": "math-fractions-fact-001",
  "type": "fact",
  "linkedTopics": ["math-fractions"],
  "content": {
    "hook": "🚀 Space Fact!",
    "title": "Fractions in Space",
    "fact": "NASA scientists use fractions to calculate exactly how much fuel a rocket needs. Too little fuel = won't reach space. Too much = rocket is too heavy to lift off!",
    "conceptConnection": "fractions",
    "visual": "rocket-fuel-gauge.svg",
    "funQuestion": {
      "text": "If a rocket tank holds 1000 gallons and needs to be 3/4 full, how many gallons is that?",
      "answer": "750 gallons",
      "isOptional": true
    }
  },
  "metadata": {
    "theme": "space",
    "ageAppropriate": true
  }
}
```

### Achievement/Badge Schema

```json
{
  "id": "streak-5",
  "name": "On Fire!",
  "description": "Get 5 answers correct in a row",
  "icon": "badge-fire.svg",
  "trigger": {
    "type": "streak",
    "value": 5
  },
  "celebration": {
    "message": "🔥 You're on fire! 5 in a row!",
    "animation": "fireworks"
  }
}
```

---

## 💾 localStorage Data Model

```javascript
// Key: "stemKidsProgress"
const userProgress = {
  // User identity
  odxmvf5u29: "uuid-v4-generated-on-first-visit",
  createdAt: "2025-03-22T10:00:00Z",
  
  // Current state
  currentTopic: "math",
  currentSubtopic: "fractions",
  currentCardIndex: 5,
  
  // Session tracking
  session: {
    startedAt: "2025-03-22T14:30:00Z",
    cardsViewed: 8,
    cardsSinceLastFact: 3,
    correctThisSession: 6,
    attemptsThisSession: 7
  },
  
  // Cumulative stats
  stats: {
    totalCardsCompleted: 145,
    totalCorrect: 120,
    totalAttempts: 135,
    streakCurrent: 5,
    streakBest: 12,
    totalTimeMinutes: 180
  },
  
  // Progress per topic
  topicProgress: {
    "math": {
      "numbers": {
        status: "completed",
        score: 95,
        completedAt: "2025-03-20T16:00:00Z"
      },
      "fractions": {
        status: "in-progress",
        score: 60,
        currentCard: "math-fractions-012",
        cardsCompleted: 11,
        cardsTotal: 20
      },
      "decimals": {
        status: "locked",
        unlockAfter: "fractions"
      }
    }
  },
  
  // Achievements
  achievements: {
    earned: ["first-correct", "streak-5", "topic-complete-numbers"],
    pending: [],
    displayed: ["first-correct", "streak-5"]
  },
  
  // User preferences
  preferences: {
    theme: "space",
    soundEnabled: true,
    animationsEnabled: true
  }
};
```

### Storage Helper Functions

```javascript
// storage.js - Required implementation

const STORAGE_KEY = 'stemKidsProgress';

const Storage = {
  // Initialize or get existing progress
  init() {
    let data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      data = this.createNewUser();
      this.save(data);
    }
    return JSON.parse(data);
  },

  // Save progress
  save(data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  },

  // Create new user structure
  createNewUser() {
    return {
      userId visitsId: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      // ... full structure as above
    };
  },

  // Update specific field
  update(path, value) {
    const data = this.init();
    // Navigate to path and update
    this.save(data);
  },

  // Reset all progress
  reset() {
    localStorage.removeItem(STORAGE_KEY);
    return this.init();
  }
};
```

---

## 🎨 UI/UX Specifications

### Card Layout (Mobile-First)

```
┌─────────────────────────────────────────┐
│ ← Back    [Topic: Fractions]    ⚙️      │  ← Header
├─────────────────────────────────────────┤
│                                         │
│  ████████████░░░░░░░░  5/15 cards       │  ← Progress bar
│                                         │
├─────────────────────────────────────────┤
│                                         │
│         ┌─────────────────┐             │
│         │                 │             │
│         │   [Illustration │             │  ← Visual area
│         │    or Diagram]  │             │     (40% of card)
│         │                 │             │
│         └─────────────────┘             │
│                                         │
├─────────────────────────────────────────┤
│                                         │
│   What is a Fraction?                   │  ← Title (large)
│                                         │
│   A fraction shows parts of a whole.    │  ← Explanation
│   Like cutting a pizza into 4 slices    │     (2-3 lines max)
│   - each slice is 1/4 of the pizza!     │
│                                         │
├─────────────────────────────────────────┤
│                                         │
│        ┌─────────────────────┐          │
│        │    Continue →       │          │  ← Primary action
│        └─────────────────────┘          │
│                                         │
│   🔥 Streak: 5     ⭐ Score: 45         │  ← Gamification bar
│                                         │
└─────────────────────────────────────────┘
```

### Practice Card Layout

```
┌─────────────────────────────────────────┐
│ ← Back    [Topic: Fractions]    ⚙️      │
├─────────────────────────────────────────┤
│  ████████████░░░░░░░░  6/15 cards       │
├─────────────────────────────────────────┤
│                                         │
│   If you eat 2 slices of a pizza        │
│   cut into 8 pieces, what fraction      │  ← Question
│   did you eat?                          │
│                                         │
│         🍕🍕⬜⬜⬜⬜⬜⬜                  │  ← Visual hint
│                                         │
├─────────────────────────────────────────┤
│                                         │
│   ┌─────────┐  ┌─────────┐              │
│   │   1/4   │  │   2/8   │              │  ← Answer options
│   └─────────┘  └─────────┘              │     (tap to select)
│                                         │
│   ┌─────────┐  ┌─────────┐              │
│   │   1/2   │  │   2/4   │              │
│   └─────────┘  └─────────┘              │
│                                         │
├─────────────────────────────────────────┤
│        ┌─────────────────────┐          │
│        │   Check Answer ✓    │          │  ← Submit
│        └─────────────────────┘          │
│                                         │
│   💡 Need a hint?                       │  ← Hint toggle
│                                         │
└─────────────────────────────────────────┘
```

### Feedback States

```
CORRECT ANSWER:
┌─────────────────────────────────────────┐
│                                         │
│            ✓ Awesome!                   │  ← Green background
│                                         │
│   2/8 equals 1/4 - you got it!          │
│                                         │
│        ┌─────────────────────┐          │
│        │    Next Card →      │          │
│        └─────────────────────┘          │
│                                         │
│   🔥 Streak: 6!                         │
│                                         │
└─────────────────────────────────────────┘

INCORRECT ANSWER:
┌─────────────────────────────────────────┐
│                                         │
│         Almost there! 💪                │  ← Soft orange/yellow
│                                         │
│   Hint: Count how many you ate,         │
│   then how many total pieces.           │
│                                         │
│        ┌─────────────────────┐          │
│        │    Try Again        │          │
│        └─────────────────────┘          │
│                                         │
└─────────────────────────────────────────┘
```

### Fact Break Layout

```
┌─────────────────────────────────────────┐
│              FACT BREAK                 │
├─────────────────────────────────────────┤
│                                         │
│          🚀 Space Fact!                 │
│                                         │
│     ┌─────────────────────────┐         │
│     │   [Rocket Illustration] │         │
│     └─────────────────────────┘         │
│                                         │
│   NASA scientists use fractions to      │
│   calculate exactly how much fuel       │
│   a rocket needs!                       │
│                                         │
│   Too little = won't reach space        │
│   Too much = too heavy to lift off      │
│                                         │
├─────────────────────────────────────────┤
│   💭 Fun question (optional):           │
│                                         │
│   If a tank holds 1000 gallons and      │
│   needs to be 3/4 full, how many        │
│   gallons is that?                      │
│                                         │
│   [Type answer...] or [Skip →]          │
│                                         │
└─────────────────────────────────────────┘
```

---

## 🎮 Gamification System

### Streak Mechanics

```javascript
const StreakSystem = {
  // Increment on correct answer
  onCorrect(progress) {
    progress.stats.streakCurrent++;
    if (progress.stats.streakCurrent > progress.stats.streakBest) {
      progress.stats.streakBest = progress.stats.streakCurrent;
    }
    this.checkStreakAchievements(progress);
  },

  // Reset on wrong answer
  onIncorrect(progress) {
    progress.stats.streakCurrent = 0;
  },

  // Check for streak badges
  checkStreakAchievements(progress) {
    const streakBadges = [
      { streak: 5, badge: 'streak-5' },
      { streak: 10, badge: 'streak-10' },
      { streak: 25, badge: 'streak-25' }
    ];
    // Award appropriate badge
  }
};
```

### Achievement Triggers

| Badge ID | Name | Trigger |
|----------|------|---------|
| `first-correct` | First Steps! | First correct answer ever |
| `streak-5` | On Fire! | 5 correct in a row |
| `streak-10` | Unstoppable! | 10 correct in a row |
| `streak-25` | Genius Mode! | 25 correct in a row |
| `topic-complete-*` | Topic Master | Complete any subtopic |
| `perfect-session` | Perfect! | 100% correct in session |
| `comeback` | Never Give Up! | Get correct after 3 wrong |
| `explorer` | Explorer | Try 3 different topics |
| `daily-streak` | Daily Learner | Learn 3 days in a row |

### Points System

```javascript
const Points = {
  CORRECT_ANSWER: 10,
  STREAK_BONUS: 2,        // Per streak count (streak 5 = +10 bonus)
  FIRST_TRY_BONUS: 5,     // Correct on first attempt
  FACT_QUESTION_BONUS: 15, // Answer optional fact question
  TOPIC_COMPLETE_BONUS: 50
};
```

---

## ✍️ Content Writing Guidelines

### Language Rules

| Rule | Example |
|------|---------|
| Max 15 words per sentence | ✅ "A fraction shows parts of a whole." |
| No jargon (unless defining) | ❌ "numerator" → ✅ "the top number" |
| Use "you" - direct address | ✅ "You can split..." not "One can split..." |
| Kid-world analogies | Pizza, candy, toys, games, animals |
| Active voice | ✅ "You add" not "Addition is performed" |

### Transformation Examples

| Complex | Kid-Friendly |
|---------|--------------|
| "Multiplication is repeated addition" | "3 × 4 means adding 3 four times: 3+3+3+3 = 12!" |
| "Fractions represent parts of a whole" | "A fraction is like cutting a cookie. 1/2 means you get half!" |
| "Variables represent unknown values" | "A variable is a mystery box. We call it 'x' until we find out what's inside!" |
| "Photosynthesis converts light to energy" | "Plants eat sunlight! They turn sunshine into food to grow." |

### Real-World Fact Guidelines

1. **Must be genuinely interesting** (space, animals, sports, video games, records)
2. **Connect to concept just learned** (explicit link)
3. **Show WHY it matters** in real life
4. **End with optional fun question** (no pressure, can skip)
5. **Age-appropriate** (avoid scary/complex real-world problems)

### Tone Rules

| Do | Don't |
|----|-------|
| "Almost! Try again 💪" | "Wrong answer" |
| "Here's a hint..." | "You should know this" |
| "Awesome job!" | "Correct." |
| "Let's figure this out together" | "This is easy" |
| "You're getting better!" | "Finally!" |

---

## 🔄 Learning Flow Logic

### Card Sequence Algorithm

```javascript
const LearningFlow = {
  CARDS_BETWEEN_FACTS: 5,
  
  getNextCard(progress) {
    const cardsSinceFact = progress.session.cardsSinceLastFact;
    
    // Time for a fact break?
    if (cardsSinceFact >= this.CARDS_BETWEEN_FACTS) {
      return this.getFactCard(progress.currentTopic);
    }
    
    // Get next content card
    return this.getNextContentCard(progress);
  },
  
  getNextContentCard(progress) {
    const subtopic = progress.currentSubtopic;
    const currentIndex = progress.currentCardIndex;
    const cards = this.loadCards(subtopic);
    
    // Alternate: concept, concept, practice, practice
    // Pattern: C, C, P, P, [FACT], C, C, P, P, [FACT]...
    return cards[currentIndex + 1];
  },
  
  onCardComplete(progress, wasCorrect) {
    progress.session.cardsViewed++;
    progress.session.cardsSinceLastFact++;
    
    if (wasCorrect) {
      progress.session.correctThisSession++;
      progress.stats.streakCurrent++;
    } else {
      progress.stats.streakCurrent = 0;
    }
    
    Storage.save(progress);
  },
  
  onFactViewed(progress) {
    progress.session.cardsSinceLastFact = 0;
    Storage.save(progress);
  }
};
```

### Topic Progression

```javascript
const TopicProgression = {
  // Define unlock requirements
  progressionMap: {
    math: {
      order: ['numbers', 'fractions', 'decimals', 'percentages', 'algebra'],
      unlockThreshold: 70  // Score needed to unlock next
    }
  },
  
  canUnlock(topic, subtopic, progress) {
    const topicMap = this.progressionMap[topic];
    const subtopicIndex = topicMap.order.indexOf(subtopic);
    
    if (subtopicIndex === 0) return true;  // First is always unlocked
    
    const previousSubtopic = topicMap.order[subtopicIndex - 1];
    const previousScore = progress.topicProgress[topic][previousSubtopic]?.score;
    
    return previousScore >= topicMap.unlockThreshold;
  }
};
```

---

## 📱 Responsive Breakpoints

```css
/* Mobile first */
:root {
  --card-padding: 16px;
  --font-title: 24px;
  --font-body: 16px;
}

/* Tablet */
@media (min-width: 768px) {
  :root {
    --card-padding: 24px;
    --font-title: 28px;
    --font-body: 18px;
  }
}

/* Desktop */
@media (min-width: 1024px) {
  :root {
    --card-padding: 32px;
    --font-title: 32px;
    --font-body: 18px;
  }
  
  .card-container {
    max-width: 600px;
    margin: 0 auto;
  }
}
```

---

## 🎨 Theme CSS Variables

```css
/* Base theme structure - all themes must define these */
:root {
  /* Colors */
  --color-primary: #6366f1;
  --color-primary-light: #818cf8;
  --color-secondary: #f59e0b;
  --color-background: #f8fafc;
  --color-card: #ffffff;
  --color-text: #1e293b;
  --color-text-light: #64748b;
  
  /* Feedback colors */
  --color-correct: #22c55e;
  --color-correct-bg: #dcfce7;
  --color-incorrect: #f59e0b;
  --color-incorrect-bg: #fef3c7;
  
  /* Spacing */
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  --spacing-xl: 32px;
  
  /* Border radius */
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --radius-full: 9999px;
  
  /* Shadows */
  --shadow-card: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  --shadow-button: 0 2px 4px rgb(0 0 0 / 0.1);
}

/* Space theme example */
[data-theme="space"] {
  --color-primary: #8b5cf6;
  --color-secondary: #06b6d4;
  --color-background: #0f172a;
  --color-card: #1e293b;
  --color-text: #f1f5f9;
  --color-text-light: #94a3b8;
}
```

---

## 🚀 Implementation Phases

### Phase 1: Core Engine (MVP)
**Estimated time: 4-6 hours**

- [ ] HTML structure (index.html, learn.html)
- [ ] Basic CSS styling
- [ ] Card rendering system (concept + practice)
- [ ] localStorage initialization and save/load
- [ ] Single topic flow (Math → Numbers, 10 cards)
- [ ] Progress bar
- [ ] Basic correct/incorrect feedback

**Deliverable**: Working prototype with 10 cards, progress saves

---

### Phase 2: Full Card System
**Estimated time: 3-4 hours**

- [ ] All practice question types (multiple-choice, fill-blank, drag-drop)
- [ ] Real-world fact cards
- [ ] Fact break insertion every 5 cards
- [ ] Hint system
- [ ] Detailed feedback messages

**Deliverable**: Complete card interaction system

---

### Phase 3: Gamification
**Estimated time: 2-3 hours**

- [ ] Streak counter with visual feedback
- [ ] Points/score system
- [ ] Achievement badges (5-6 basic badges)
- [ ] Achievement popup/celebration
- [ ] Progress dashboard page

**Deliverable**: Engaging reward system

---

### Phase 4: Content & Themes
**Estimated time: 3-4 hours**

- [ ] Theme system (4 themes)
- [ ] Theme selector
- [ ] Full Math content (Numbers, Fractions, Decimals)
- [ ] Corresponding real-world facts
- [ ] Topic selector on landing page

**Deliverable**: Multiple topics with themes

---

### Phase 5: Polish & Expand
**Estimated time: 2-3 hours**

- [ ] Animations and transitions
- [ ] Sound effects (optional toggle)
- [ ] Science content
- [ ] Technology content
- [ ] Final responsive testing
- [ ] Accessibility pass

**Deliverable**: Production-ready platform

---

## 🔧 Agent Handoff Prompts

### Initial Session Prompt

```markdown
You are implementing a STEM learning platform for 10-year-olds.

## Tech Constraints
- Static HTML/CSS/JS only (GitHub Pages compatible)
- No build tools, no npm, no frameworks
- localStorage for persistence
- All assets must be inline or in /assets folder

## Before Coding
Ask the user these questions and wait for answers:
1. Topic? (Math/Science/Technology/Engineering/Mixed)
2. Specific subtopic or gradual progression?
3. Cards per session? (default: 15)
4. Theme? (Space/Ocean/Jungle/Robots/Neutral)

## Implementation Order
1. Phase 1 first - get core working
2. Test in browser
3. Confirm with user before Phase 2
4. Continue sequentially

## Key Rules
- Every 5 cards = fact break (mandatory)
- No "wrong" shaming - gentle retry prompts
- Max 15 words per sentence in content
- Mobile-first responsive design

Reference the full implementation plan for schemas and details.
```

### Session Resume Prompt

```markdown
Continuing STEM learning platform build.

## Previous Session Status
- Completed: [Phase X]
- User choices: Topic=[X], Subtopic=[X], Theme=[X]
- Files created: [list]

## Resume Instructions
1. Review existing code in the repository
2. Continue with [Next Phase]
3. Test each component before moving on
4. Update user on progress

Reference implementation plan for:
- Data schemas
- UI specifications  
- Content guidelines
```

### Content Generation Prompt

```markdown
Generate learning cards for: [TOPIC] → [SUBTOPIC]

## Output Format
JSON array matching the card schemas in implementation plan.

## Content Rules
- Max 15 words per sentence
- Use analogies from kid's world (pizza, games, toys, animals)
- Difficulty scale 1-5, progress gradually
- Every 5th card position = fact card
- Include hint for all practice cards
- 2 correct answer explanations (correct/incorrect)

## Required Output
Generate [N] cards:
- [X] concept cards
- [X] practice cards  
- [X] fact cards (1 per 5 content cards)

## Quality Checks
- [ ] No jargon without definition
- [ ] All analogies age-appropriate
- [ ] Facts are genuinely interesting
- [ ] Hints help without giving answer
- [ ] Positive, encouraging tone
```

---

## ✅ Pre-Deployment Checklist

### Functionality
- [ ] All card types render correctly
- [ ] localStorage persists across browser restart
- [ ] Progress bar updates accurately
- [ ] Streaks increment/reset correctly
- [ ] Achievements trigger and display
- [ ] Fact breaks appear every 5 cards
- [ ] All themes apply correctly
- [ ] Topic/subtopic selection works
- [ ] Main page header has 'lock'/'unlock' switch button for providing user with option to lock next sections till progress requirement is achieved, unlocked will provide to open any sections and work on it

### Performance
- [ ] Page loads under 2 seconds
- [ ] No console errors
- [ ] Works offline after first load
- [ ] Smooth animations (60fps)

### Responsiveness
- [ ] Mobile (320px+) works perfectly
- [ ] Tablet (768px+) scales well
- [ ] Desktop (1024px+) centered, readable
- [ ] Touch targets minimum 44x44px

### Accessibility
- [ ] Keyboard navigation works
- [ ] Focus states visible
- [ ] Color contrast WCAG AA
- [ ] Alt text on images
- [ ] Screen reader tested

### Content
- [ ] No "wrong" shaming language
- [ ] All hints are helpful
- [ ] Facts are interesting and connected
- [ ] Difficulty progression smooth
- [ ] No broken images/links

---

## 📋 Quick Reference

### Card Insertion Pattern
```
Card 1: Concept
Card 2: Concept
Card 3: Practice
Card 4: Practice
Card 5: Practice
→ FACT BREAK ←
Card 6: Concept
Card 7: Concept
Card 8: Practice
Card 9: Practice
Card 10: Practice
→ FACT BREAK ←
... repeat ...
```

### localStorage Key
```
Key: "stemKidsProgress"
```

### File Naming Convention
```
Concepts: {topic}-{subtopic}-{NNN}.json (001, 002...)
Practice: {topic}-{subtopic}-p{NNN}.json
Facts: {topic}-{subtopic}-fact-{NNN}.json
```

### CSS Class Naming
```
.card              - Card container
.card--concept     - Concept card modifier
.card--practice    - Practice card modifier
.card--fact        - Fact card modifier
.card__title       - Card title
.card__content     - Card content area
.card__actions     - Button area
.btn               - Base button
.btn--primary      - Primary action
.btn--secondary    - Secondary action
.progress-bar      - Progress container
.progress-bar__fill - Progress fill
.streak-counter    - Streak display
.badge             - Achievement badge
```

---

## 🆘 Troubleshooting

| Issue | Likely Cause | Fix |
|-------|--------------|-----|
| Progress not saving | localStorage blocked | Check browser privacy settings |
| Cards not loading | JSON parse error | Validate JSON syntax |
| Theme not applying | CSS variable missing | Check theme file has all variables |
| Streak resetting unexpectedly | Page refresh | Ensure save happens before unload |
| Fact not appearing | Counter not incrementing | Check cardsSinceLastFact logic |

---

## 📝 Notes for Implementing Agent

1. **Start simple** - Get Phase 1 working completely before adding features
2. **Test frequently** - Open in browser after each major change
3. **Mobile first** - Design for phone, then scale up
4. **Content quality > quantity** - 10 great cards beats 50 mediocre ones
5. **Kid-test if possible** - Adult assumptions often wrong for kids
6. **Keep it fun** - This is supposed to be enjoyable, not homework
7. **Commit** - After changes, testing and any fixes - commit and push to the repository

---

*End of Implementation Plan*