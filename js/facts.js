/* ===================================================
   facts.js - Real-world facts engine
   Fact cards are injected every 5 content cards
   =================================================== */

const Facts = {

  SCIENCE_FACTS: [
    // Matter facts
    {
      id: 'fact-matter-001',
      linkedTopics: ['science-matter'],
      content: {
        hook: '🌌 Space Fact!',
        title: 'Plasma: The Fourth State of Matter',
        fact: 'Stars like our Sun are made of plasma - superheated gas so hot that electrons are ripped from atoms. About 99% of visible matter in the universe is plasma!',
        conceptConnection: 'States of Matter',
        visual: '☀️',
        funQuestion: {
          text: 'If plasma needs extreme heat to form, what happens when it cools down?',
          answer: 'It becomes a gas.',
          isOptional: true
        }
      },
      metadata: { theme: 'scifi', ageAppropriate: true }
    },
    {
      id: 'fact-matter-002',
      linkedTopics: ['science-matter'],
      content: {
        hook: '🏔️ Amazing Science!',
        title: 'Water Expands When It Freezes',
        fact: 'Most materials shrink when they get cold. But water is special! Ice takes up about 9% more space than liquid water. That\'s why ice floats and why water pipes burst in winter.',
        conceptConnection: 'Density and States of Matter',
        visual: '🧊',
        funQuestion: {
          text: 'If a 100 ml bottle is completely full of water and you freeze it, what happens?',
          answer: 'The bottle cracks or breaks as ice expands.',
          isOptional: true
        }
      },
      metadata: { theme: 'scifi', ageAppropriate: true }
    },
    {
      id: 'fact-matter-003',
      linkedTopics: ['science-matter'],
      content: {
        hook: '🔬 Tiny World!',
        title: 'How Small Is an Atom?',
        fact: 'Atoms are so small that one million hydrogen atoms lined up would be only as wide as a single strand of human hair. Your body contains about 7 billion billion billion atoms!',
        conceptConnection: 'Atoms and Molecules',
        visual: '⚛️',
        funQuestion: {
          text: 'If there are 7,000,000,000,000,000,000,000,000,000 atoms in your body, how many zeros is that?',
          answer: '27 zeros (7 octillion)',
          isOptional: true
        }
      },
      metadata: { theme: 'scifi', ageAppropriate: true }
    },
    {
      id: 'fact-matter-004',
      linkedTopics: ['science-matter'],
      content: {
        hook: '🧲 Wild Chemistry!',
        title: 'Non-Newtonian Fluids',
        fact: 'Mix cornstarch and water and you get a liquid that acts like a solid when hit hard. Scientists call it a non-Newtonian fluid. You can actually run across a pool of it without sinking!',
        conceptConnection: 'Properties of Matter',
        visual: '🌀',
        funQuestion: {
          text: 'Is a non-Newtonian fluid a solid or a liquid?',
          answer: 'Both! It depends on how force is applied to it.',
          isOptional: true
        }
      },
      metadata: { theme: 'scifi', ageAppropriate: true }
    },

    // Energy facts
    {
      id: 'fact-energy-001',
      linkedTopics: ['science-energy'],
      content: {
        hook: '⚡ Electric Fact!',
        title: 'Lightning Heats Air Hotter Than the Sun',
        fact: 'A lightning bolt heats the air around it to about 30,000 Kelvin - that\'s 5 times hotter than the surface of the Sun! This superheated air expands so fast it creates the BOOM we call thunder.',
        conceptConnection: 'Heat and Energy Transfer',
        visual: '⚡',
        funQuestion: {
          text: 'If the Sun\'s surface is about 6,000°C, how hot is a lightning bolt in Celsius?',
          answer: 'About 30,000°C - 5 times hotter!',
          isOptional: true
        }
      },
      metadata: { theme: 'scifi', ageAppropriate: true }
    },
    {
      id: 'fact-energy-002',
      linkedTopics: ['science-energy'],
      content: {
        hook: '🚀 Space Physics!',
        title: 'Gravity Slingshot',
        fact: 'NASA scientists use planets\' gravity to speed up spacecraft! The Voyager probe used Jupiter\'s gravity like a slingshot to reach the edge of our solar system. This "gravity assist" saves years of travel time.',
        conceptConnection: 'Gravity and Forces',
        visual: '🪐',
        funQuestion: {
          text: 'What does a gravity slingshot add to a spacecraft - speed or direction?',
          answer: 'Both! It adds speed AND changes direction.',
          isOptional: true
        }
      },
      metadata: { theme: 'scifi', ageAppropriate: true }
    },
    {
      id: 'fact-energy-003',
      linkedTopics: ['science-energy'],
      content: {
        hook: '🌡️ Hot Science!',
        title: 'Energy Cannot Be Destroyed',
        fact: 'When you drop a ball, it speeds up (gains kinetic energy). When it bounces, that energy converts to sound, heat, and back to movement. Energy never disappears - it just changes form. This is the Law of Conservation of Energy!',
        conceptConnection: 'Energy Transfer and Conservation',
        visual: '⚽',
        funQuestion: {
          text: 'Where does the energy go when a ball stops bouncing?',
          answer: 'It becomes heat and sound energy.',
          isOptional: true
        }
      },
      metadata: { theme: 'scifi', ageAppropriate: true }
    },
    {
      id: 'fact-energy-004',
      linkedTopics: ['science-energy'],
      content: {
        hook: '💡 Light Speed!',
        title: 'Light from the Sun Takes 8 Minutes to Reach You',
        fact: 'Light travels at 300,000 km per second - the fastest anything can go! But the Sun is so far away that its light takes 8 minutes to reach Earth. Right now, you\'re seeing the Sun as it was 8 minutes ago.',
        conceptConnection: 'Light and Electromagnetic Energy',
        visual: '☀️',
        funQuestion: {
          text: 'If the Sun suddenly disappeared, how long until we noticed it got dark?',
          answer: '8 minutes - the time it takes for light to travel from the Sun.',
          isOptional: true
        }
      },
      metadata: { theme: 'scifi', ageAppropriate: true }
    },

    // Biology facts
    {
      id: 'fact-biology-001',
      linkedTopics: ['science-biology'],
      content: {
        hook: '🧬 DNA Discovery!',
        title: 'Your DNA Would Reach Pluto and Back',
        fact: 'If you unraveled all the DNA in your body\'s cells and laid it end to end, the strand would be about 68 billion kilometers long. That\'s enough to reach Pluto and back many times!',
        conceptConnection: 'DNA and Genetics',
        visual: '🧬',
        funQuestion: {
          text: 'If each cell has about 2 meters of DNA, and you have 37 trillion cells, how many kilometers is that in total?',
          answer: 'About 74 billion kilometers!',
          isOptional: true
        }
      },
      metadata: { theme: 'scifi', ageAppropriate: true }
    },
    {
      id: 'fact-biology-002',
      linkedTopics: ['science-biology'],
      content: {
        hook: '🌿 Plant Power!',
        title: 'Plants Can Talk to Each Other',
        fact: 'When a tree is attacked by insects, it releases chemicals into the air. Nearby trees can detect these chemicals and start making bitter-tasting compounds in their own leaves to protect themselves. Trees actually warn their neighbors!',
        conceptConnection: 'Ecosystems and Communication',
        visual: '🌳',
        funQuestion: {
          text: 'How do trees communicate - through sound, chemicals, or touch?',
          answer: 'Chemicals released into the air and through root networks underground.',
          isOptional: true
        }
      },
      metadata: { theme: 'scifi', ageAppropriate: true }
    },
    {
      id: 'fact-biology-003',
      linkedTopics: ['science-biology'],
      content: {
        hook: '🦠 Tiny Giants!',
        title: 'Your Body Has More Bacteria Than Human Cells',
        fact: 'You have about 38 trillion bacteria living in and on your body - slightly more than your 37 trillion human cells. Most of these are helpful! Gut bacteria help you digest food, make vitamins, and even affect your mood.',
        conceptConnection: 'Cells and Microorganisms',
        visual: '🦠',
        funQuestion: {
          text: 'Are all bacteria harmful?',
          answer: 'No! Most bacteria are harmless or helpful. Only a small fraction cause disease.',
          isOptional: true
        }
      },
      metadata: { theme: 'scifi', ageAppropriate: true }
    },
    {
      id: 'fact-biology-004',
      linkedTopics: ['science-biology'],
      content: {
        hook: '🧠 Brain Power!',
        title: 'Your Brain Has 86 Billion Neurons',
        fact: 'Your brain has about 86 billion neurons (nerve cells), each connected to up to 10,000 others. The total number of connections is more than the number of stars in the Milky Way galaxy!',
        conceptConnection: 'The Human Body and Nervous System',
        visual: '🧠',
        funQuestion: {
          text: 'If a brain has 86 billion neurons and each connects to 10,000 others, how many total connections is that?',
          answer: '860 trillion connections - an unimaginable number!',
          isOptional: true
        }
      },
      metadata: { theme: 'scifi', ageAppropriate: true }
    }
  ],

  /**
   * Get a fact card appropriate for a given subtopic
   * Avoids repeating recently seen facts (tracked in data)
   */
  getFactForSubtopic(subtopic, seenFacts = []) {
    const topicKey = `science-${subtopic}`;
    let pool = this.SCIENCE_FACTS.filter(f =>
      f.linkedTopics.includes(topicKey) && !seenFacts.includes(f.id)
    );

    // Fall back to all facts of any seen status if pool empty
    if (pool.length === 0) {
      pool = this.SCIENCE_FACTS.filter(f => f.linkedTopics.includes(topicKey));
    }

    // Fall back to any fact
    if (pool.length === 0) {
      pool = this.SCIENCE_FACTS;
    }

    return pool[Math.floor(Math.random() * pool.length)];
  }
};
