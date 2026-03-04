/**
 * THE INTERNET MUSEUM OF FORGOTTEN IDEAS
 * script.js — All interactivity, animations, and exhibit logic
 *
 * Sections:
 *   1. Ambient Dust Particles
 *   2. Scroll Reveal (IntersectionObserver)
 *   3. Exhibit 1 – Emotion Translator
 *   4. Exhibit 2 – Dream Recorder
 *   5. Exhibit 3 – Gravity Shoes
 *   6. Exhibit 4 – Weather Composer
 *   7. Exhibit 5 – Memory Library
 *   8. Exhibit 6 – Cloud City Blueprint
 *   9. Exhibit 7 – Your Idea
 */

'use strict';

/* ═══════════════════════════════════════════════════════════
   1. AMBIENT DUST PARTICLES
   Tiny floating motes that make the gallery feel alive.
═══════════════════════════════════════════════════════════ */

(function initDust() {
  const canvas = document.getElementById('dust-canvas');
  const ctx    = canvas.getContext('2d');
  let W, H;
  const PARTICLE_COUNT = 55;
  const particles = [];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  class Dust {
    constructor() { this.reset(true); }

    reset(initial = false) {
      this.x     = Math.random() * (W || window.innerWidth);
      this.y     = initial
        ? Math.random() * (H || window.innerHeight)
        : (H || window.innerHeight) + 10;
      this.r     = Math.random() * 1.5 + 0.3;
      this.speedY = -(Math.random() * 0.25 + 0.05);
      this.speedX =  (Math.random() - 0.5) * 0.15;
      this.alpha  = Math.random() * 0.35 + 0.05;
      this.drift  = Math.random() * Math.PI * 2;      // phase for sine drift
      this.driftSpeed = Math.random() * 0.006 + 0.002;
    }

    update() {
      this.drift += this.driftSpeed;
      this.x += this.speedX + Math.sin(this.drift) * 0.3;
      this.y += this.speedY;
      if (this.y < -10) this.reset(false);
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(150, 130, 100, ${this.alpha})`;
      ctx.fill();
    }
  }

  function init() {
    resize();
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push(new Dust());
    }
  }

  function loop() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(loop);
  }

  window.addEventListener('resize', resize);
  init();
  loop();
})();

/* ═══════════════════════════════════════════════════════════
   2. SCROLL REVEAL
   Uses IntersectionObserver to fade sections in as they enter
   the viewport. Staggers each exhibit slightly.
═══════════════════════════════════════════════════════════ */

(function initScrollReveal() {
  const elements = document.querySelectorAll('.reveal');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target); // Fire once
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -60px 0px'
  });

  elements.forEach(el => observer.observe(el));
})();

/* Landing scroll helper */
function scrollToGallery() {
  document.getElementById('gallery-start').scrollIntoView({ behavior: 'smooth' });
}

/* ═══════════════════════════════════════════════════════════
   3. EXHIBIT 1 — EMOTION TRANSLATOR
   Maps emotional keywords in user input to color palettes.
   The display washes with the detected emotional hues.
═══════════════════════════════════════════════════════════ */

(function initEmotionTranslator() {
  // Each emotion maps to: { colors[], label, gradient }
  const emotionMap = [
    {
      keywords: ['happy', 'joy', 'joyful', 'elated', 'ecstatic', 'excited', 'delighted', 'cheerful', 'glad', 'wonderful'],
      label: 'Joy',
      gradient: 'linear-gradient(135deg, #f7c948, #f9a825, #ffd54f)',
      chip: { bg: '#fef3c7', border: '#f59e0b', text: '#92400e' }
    },
    {
      keywords: ['sad', 'sadness', 'melancholy', 'grief', 'heartbroken', 'sorrow', 'blue', 'down', 'unhappy', 'depressed', 'lonely', 'alone', 'miss', 'lost'],
      label: 'Melancholy',
      gradient: 'linear-gradient(135deg, #93c5fd, #60a5fa, #3b82f6)',
      chip: { bg: '#eff6ff', border: '#93c5fd', text: '#1e40af' }
    },
    {
      keywords: ['angry', 'anger', 'furious', 'rage', 'mad', 'frustrated', 'annoyed', 'irritated', 'hate', 'livid'],
      label: 'Anger',
      gradient: 'linear-gradient(135deg, #f87171, #ef4444, #dc2626)',
      chip: { bg: '#fef2f2', border: '#f87171', text: '#7f1d1d' }
    },
    {
      keywords: ['fear', 'afraid', 'scared', 'anxious', 'anxiety', 'nervous', 'worried', 'dread', 'terrified', 'panic', 'stress', 'tense'],
      label: 'Anxiety',
      gradient: 'linear-gradient(135deg, #a78bfa, #7c3aed, #6d28d9)',
      chip: { bg: '#f5f3ff', border: '#a78bfa', text: '#4c1d95' }
    },
    {
      keywords: ['love', 'romantic', 'affection', 'tender', 'warmth', 'adore', 'cherish', 'beloved', 'heart', 'caring', 'kind'],
      label: 'Love',
      gradient: 'linear-gradient(135deg, #f9a8d4, #f472b6, #ec4899)',
      chip: { bg: '#fdf2f8', border: '#f9a8d4', text: '#9d174d' }
    },
    {
      keywords: ['calm', 'peaceful', 'tranquil', 'serene', 'quiet', 'still', 'zen', 'relax', 'gentle', 'content', 'ease'],
      label: 'Serenity',
      gradient: 'linear-gradient(135deg, #6ee7b7, #34d399, #10b981)',
      chip: { bg: '#ecfdf5', border: '#6ee7b7', text: '#065f46' }
    },
    {
      keywords: ['wonder', 'curious', 'amazed', 'awe', 'magical', 'mystery', 'dream', 'imagine', 'strange', 'ethereal', 'surreal', 'beautiful'],
      label: 'Wonder',
      gradient: 'linear-gradient(135deg, #fbbf24, #fb923c, #818cf8)',
      chip: { bg: '#fff7ed', border: '#fb923c', text: '#7c2d12' }
    },
    {
      keywords: ['bored', 'tired', 'exhausted', 'empty', 'hollow', 'flat', 'grey', 'gray', 'numb', 'indifferent'],
      label: 'Numbness',
      gradient: 'linear-gradient(135deg, #d1d5db, #9ca3af, #6b7280)',
      chip: { bg: '#f9fafb', border: '#d1d5db', text: '#374151' }
    },
    {
      keywords: ['hope', 'hopeful', 'optimistic', 'bright', 'future', 'believe', 'faith', 'sunrise', 'dawn', 'better'],
      label: 'Hope',
      gradient: 'linear-gradient(135deg, #fde68a, #86efac, #67e8f9)',
      chip: { bg: '#f0fdf4', border: '#86efac', text: '#14532d' }
    }
  ];

  const input   = document.getElementById('emotion-input');
  const wash    = document.getElementById('emotion-wash');
  const wordEl  = document.getElementById('emotion-word');
  const legend  = document.getElementById('emotion-legend');

  let debounceTimer = null;

  function detectEmotion(text) {
    const lower = text.toLowerCase();
    const scores = emotionMap.map(emotion => {
      const matches = emotion.keywords.filter(kw => lower.includes(kw)).length;
      return { emotion, score: matches };
    }).filter(e => e.score > 0);

    if (scores.length === 0) return null;
    scores.sort((a, b) => b.score - a.score);
    return scores[0].emotion;
  }

  function applyEmotion(emotion) {
    if (!emotion) {
      wash.style.opacity = '0';
      wordEl.textContent = '...';
      legend.innerHTML = '';
      return;
    }

    wash.style.background = emotion.gradient;
    wash.style.opacity = '0.45';
    wordEl.textContent = emotion.label;

    legend.innerHTML = '';
    const chip = document.createElement('div');
    chip.className = 'emotion-chip';
    chip.textContent = emotion.label;
    chip.style.background   = emotion.chip.bg;
    chip.style.borderColor  = emotion.chip.border;
    chip.style.color        = emotion.chip.text;
    legend.appendChild(chip);
  }

  input.addEventListener('input', () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      const emotion = detectEmotion(input.value);
      applyEmotion(emotion);
    }, 200);
  });
})();

/* ═══════════════════════════════════════════════════════════
   4. EXHIBIT 2 — DREAM RECORDER
   Generates abstract, colorful floating shapes that drift
   across a dark stage when the button is pressed.
═══════════════════════════════════════════════════════════ */

(function initDreamRecorder() {
  const btn      = document.getElementById('dream-btn');
  const stage    = document.getElementById('dream-shapes');
  const idleText = document.getElementById('dream-idle');

  let isRecording = false;
  let dreamTimer  = null;

  // Dreamy color palettes — each dream has a mood
  const dreamPalettes = [
    ['#a855f7', '#ec4899', '#f97316'],
    ['#06b6d4', '#818cf8', '#a3e635'],
    ['#fbbf24', '#f43f5e', '#8b5cf6'],
    ['#10b981', '#0ea5e9', '#e879f9'],
    ['#fde68a', '#fca5a5', '#a5f3fc'],
  ];

  const dreamWords = [
    'falling', 'flying', 'remembering', 'forgetting',
    'arrival', 'departure', 'a room you once knew',
    'someone turning away', 'warmth without source',
    'a door with no handle'
  ];

  function createShape(palette) {
    const shape = document.createElement('div');
    shape.className = 'dream-shape';

    // Randomize position, size, timing
    const size    = Math.random() * 120 + 30;
    const startX  = Math.random() * 340;
    const startY  = Math.random() * 180;
    const driftX  = (Math.random() - 0.5) * 200 + 'px';
    const driftY  = (Math.random() - 0.5) * 120 + 'px';
    const scale   = (Math.random() * 0.8 + 0.5).toFixed(2);
    const rotate  = Math.round(Math.random() * 360) + 'deg';
    const dur     = (Math.random() * 6 + 5).toFixed(1);
    const delay   = (Math.random() * 2).toFixed(1);
    const opacity = (Math.random() * 0.4 + 0.2).toFixed(2);

    // Pick 1-3 colors from palette for gradient
    const c1 = palette[Math.floor(Math.random() * palette.length)];
    const c2 = palette[Math.floor(Math.random() * palette.length)];

    const shapeType = Math.random();
    const borderRadius = shapeType < 0.33 ? '50%'
      : shapeType < 0.66 ? '30% 70% 70% 30% / 50% 30% 70% 50%'
      : `${Math.random() * 30}% ${Math.random() * 30}%`;

    Object.assign(shape.style, {
      width:        size + 'px',
      height:       size + 'px',
      left:         startX + 'px',
      top:          startY + 'px',
      background:   `radial-gradient(circle at 40% 40%, ${c1}, ${c2})`,
      borderRadius: borderRadius,
      '--drift-x':  driftX,
      '--drift-y':  driftY,
      '--drift-scale':  scale,
      '--drift-rotate': rotate,
      '--peak-opacity': opacity,
      animationDuration: dur + 's',
      animationDelay:    delay + 's',
    });

    return shape;
  }

  function startDream() {
    if (isRecording) return;
    isRecording = true;
    idleText.style.opacity = '0';
    btn.textContent = '◉  Recording…';
    btn.disabled = true;

    const palette = dreamPalettes[Math.floor(Math.random() * dreamPalettes.length)];

    // Create a burst of shapes
    const count = 14;
    for (let i = 0; i < count; i++) {
      const shape = createShape(palette);
      stage.appendChild(shape);
      // Remove after animation completes
      shape.addEventListener('animationend', () => shape.remove());
    }

    // Add a dreamy text whisper
    const word = dreamWords[Math.floor(Math.random() * dreamWords.length)];
    const whisper = document.createElement('div');
    Object.assign(whisper.style, {
      position:   'absolute',
      left:       '50%',
      top:        '50%',
      transform:  'translate(-50%, -50%)',
      fontFamily: "'Cormorant Garamond', serif",
      fontSize:   '0.85rem',
      fontStyle:  'italic',
      color:      'rgba(255,255,255,0.4)',
      letterSpacing: '0.15em',
      pointerEvents: 'none',
      animation:  'dreamDrift 6s ease-out forwards',
      '--drift-x': '0px',
      '--drift-y': '-40px',
      '--drift-scale': '1',
      '--drift-rotate': '0deg',
      '--peak-opacity': '0.4',
      whiteSpace: 'nowrap',
      zIndex: '10',
    });
    whisper.textContent = word;
    stage.appendChild(whisper);
    whisper.addEventListener('animationend', () => whisper.remove());

    clearTimeout(dreamTimer);
    dreamTimer = setTimeout(() => {
      isRecording = false;
      idleText.style.opacity = '1';
      btn.textContent = '◉  Record Dream';
      btn.disabled = false;
    }, 8000);
  }

  btn.addEventListener('click', startDream);
})();

/* ═══════════════════════════════════════════════════════════
   5. EXHIBIT 3 — GRAVITY SHOES
   Toggles an 'inverted' class on the gravity visual,
   which CSS transitions to flip the figure and surface.
═══════════════════════════════════════════════════════════ */

(function initGravityShoes() {
  const btn     = document.getElementById('gravity-btn');
  const visual  = document.getElementById('gravity-visual');
  const label   = document.getElementById('gravity-label');

  let inverted = false;
  let cooldown = false;

  btn.addEventListener('click', () => {
    if (cooldown) return;
    cooldown = true;
    btn.disabled = true;

    inverted = !inverted;

    if (inverted) {
      visual.classList.add('inverted');
      label.textContent = 'CEILING';
      btn.textContent = '⟳  Restore Gravity';
    } else {
      visual.classList.remove('inverted');
      label.textContent = 'FLOOR';
      btn.textContent = '⟳  Invert Gravity';
    }

    setTimeout(() => {
      cooldown = false;
      btn.disabled = false;
    }, 1800);
  });
})();

/* ═══════════════════════════════════════════════════════════
   6. EXHIBIT 4 — WEATHER COMPOSER
   Each key triggers a different weather event in the sky stage.
   Multiple weather events can layer on top of each other.
═══════════════════════════════════════════════════════════ */

(function initWeatherComposer() {
  const sky          = document.getElementById('weather-sky');
  const cloudsBox    = document.getElementById('clouds-container');
  const rainBox      = document.getElementById('rain-container');
  const sunOrb       = document.getElementById('sun-orb');
  const statusEl     = document.getElementById('weather-status');
  const keys         = document.querySelectorAll('.wkey');

  const weatherState = {
    cloud: 0, rain: 0, storm: 0, sun: 0, wind: 0, snow: 0, fog: 0
  };

  const statusPhrases = {
    cloud: 'Cumulus formation underway',
    rain:  'Precipitation: engaged',
    storm: 'Electrical discharge detected',
    sun:   'Solar aperture: open',
    wind:  'Barometric shift: 14 hPa',
    snow:  'Crystalline descent initiated',
    fog:   'Visibility: diminished'
  };

  // ── Cloud ────────────────────────────────────────
  function addCloud() {
    const cloud = document.createElement('div');
    cloud.className = 'cloud-puff';
    const h = Math.random() * 50 + 10;
    const w = h * (Math.random() * 1.5 + 1.2);
    const y = Math.random() * 60 + 10;
    const dur = Math.random() * 14 + 10;
    Object.assign(cloud.style, {
      width:  w + 'px',
      height: h + 'px',
      '--cloud-y': y + 'px',
      animationDuration: dur + 's',
    });
    cloudsBox.appendChild(cloud);
    cloud.addEventListener('animationend', () => cloud.remove());
  }

  // ── Rain ─────────────────────────────────────────
  function addRain() {
    const drop = document.createElement('div');
    drop.className = 'rain-drop';
    const len = Math.random() * 12 + 8;
    Object.assign(drop.style, {
      left:   Math.random() * 100 + '%',
      height: len + 'px',
      top:    '0',
      animationDuration:  (Math.random() * 0.5 + 0.4) + 's',
      animationDelay:     (Math.random() * 2) + 's',
    });
    rainBox.appendChild(drop);
    // Auto-remove after several cycles
    setTimeout(() => drop.remove(), 4000);
  }

  // ── Lightning ─────────────────────────────────────
  function addLightning() {
    const flash = document.createElement('div');
    flash.className = 'lightning-flash';
    sky.appendChild(flash);
    flash.addEventListener('animationend', () => flash.remove());
    sky.classList.add('stormy');
    setTimeout(() => sky.classList.remove('stormy'), 2000);
  }

  // ── Snow ──────────────────────────────────────────
  function addSnow() {
    const flake = document.createElement('div');
    flake.className = 'snowflake';
    flake.textContent = ['❄', '❅', '❆'][Math.floor(Math.random() * 3)];
    Object.assign(flake.style, {
      left:  Math.random() * 100 + '%',
      animationDuration: (Math.random() * 2 + 2) + 's',
      animationDelay:    (Math.random() * 1) + 's',
    });
    sky.appendChild(flake);
    flake.addEventListener('animationend', () => flake.remove());
  }

  // ── Fog ───────────────────────────────────────────
  function addFog() {
    sky.classList.add('foggy');
    setTimeout(() => sky.classList.remove('foggy'), 3000);
  }

  // ── Wind ─────────────────────────────────────────
  function addWind() {
    // Wind pushes clouds faster
    const clouds = cloudsBox.querySelectorAll('.cloud-puff');
    clouds.forEach(c => {
      const cur = parseFloat(c.style.animationDuration) || 12;
      c.style.animationDuration = (cur * 0.5) + 's';
    });
    addCloud(); addCloud();
  }

  // Main key handler
  function handleKey(type) {
    weatherState[type]++;
    statusEl.textContent = 'Atmosphere: ' + statusPhrases[type];

    switch (type) {
      case 'cloud': addCloud(); addCloud(); addCloud(); break;
      case 'rain':
        for (let i = 0; i < 20; i++) addRain();
        sky.style.background = 'linear-gradient(to bottom, #7890b0, #a0b8cc)';
        setTimeout(() => sky.style.background = '', 3000);
        break;
      case 'storm':
        addLightning();
        for (let i = 0; i < 15; i++) addRain();
        setTimeout(addLightning, 300);
        break;
      case 'sun':
        sunOrb.classList.add('visible');
        sky.classList.add('sunny');
        sky.classList.remove('stormy', 'foggy');
        setTimeout(() => {
          sunOrb.classList.remove('visible');
          sky.classList.remove('sunny');
        }, 4000);
        break;
      case 'wind':  addWind(); break;
      case 'snow':  for (let i = 0; i < 10; i++) addSnow(); break;
      case 'fog':   addFog(); break;
    }

    // Flash the key
    const keyEl = document.querySelector(`.wkey[data-type="${type}"]`);
    if (keyEl) {
      keyEl.style.background = 'rgba(139,111,78,0.12)';
      setTimeout(() => keyEl.style.background = '', 300);
    }
  }

  keys.forEach(key => {
    key.addEventListener('click', () => handleKey(key.dataset.type));
  });
})();

/* ═══════════════════════════════════════════════════════════
   7. EXHIBIT 5 — MEMORY LIBRARY
   Creates memory cards with abstract gradient backgrounds.
   Hovering reveals a poetic memory fragment.
═══════════════════════════════════════════════════════════ */

(function initMemoryLibrary() {
  const grid = document.getElementById('memory-grid');

  const memories = [
    {
      label:   'Archive #0041',
      snippet: 'The smell of bread through a window on a street you will never find again.',
      colors:  ['#fde68a', '#fb923c'],
    },
    {
      label:   'Archive #0089',
      snippet: 'Someone laughing in the next room. You don\'t know who. You will never know who.',
      colors:  ['#a5f3fc', '#818cf8'],
    },
    {
      label:   'Archive #0112',
      snippet: 'The particular quality of light on a Tuesday afternoon in a year you can\'t name.',
      colors:  ['#d9f99d', '#34d399'],
    },
    {
      label:   'Archive #0203',
      snippet: 'Arriving somewhere and knowing, without reason, that you have been here before.',
      colors:  ['#fda4af', '#c084fc'],
    },
    {
      label:   'Archive #0267',
      snippet: 'A word someone said that changed everything. You have forgotten the word.',
      colors:  ['#bae6fd', '#67e8f9'],
    },
    {
      label:   'Archive #0311',
      snippet: 'The last time you felt completely unafraid. You did not know it was the last time.',
      colors:  ['#fcd34d', '#f9a8d4'],
    },
  ];

  memories.forEach(mem => {
    const card = document.createElement('div');
    card.className = 'memory-card';

    // Gradient background
    const bg = document.createElement('div');
    bg.className = 'memory-card-bg';
    bg.style.background = `linear-gradient(135deg, ${mem.colors[0]}, ${mem.colors[1]})`;
    card.appendChild(bg);

    // Label (visible before hover)
    const lbl = document.createElement('div');
    lbl.className = 'memory-label';
    lbl.textContent = mem.label;
    card.appendChild(lbl);

    // Text overlay (revealed on hover)
    const overlay = document.createElement('div');
    overlay.className = 'memory-card-text';
    const snip = document.createElement('p');
    snip.className = 'memory-snippet';
    snip.textContent = mem.snippet;
    overlay.appendChild(snip);
    card.appendChild(overlay);

    grid.appendChild(card);
  });
})();

/* ═══════════════════════════════════════════════════════════
   8. EXHIBIT 6 — CLOUD CITY BLUEPRINT
   Procedurally generates a city skyline, then launches it
   upward with a floating animation on button click.
═══════════════════════════════════════════════════════════ */

(function initCloudCity() {
  const btn       = document.getElementById('city-btn');
  const buildings = document.getElementById('city-buildings');
  const cloudsDiv = document.getElementById('city-clouds-bg');

  let launched = false;

  // ── Build the city ──────────────────────────────
  const buildingDefs = [
    { w: 28,  h: 80,  cols: 2 },
    { w: 38,  h: 120, cols: 3 },
    { w: 22,  h: 60,  cols: 2 },
    { w: 50,  h: 160, cols: 4 },  // tallest
    { w: 32,  h: 100, cols: 3 },
    { w: 44,  h: 130, cols: 3 },
    { w: 24,  h: 70,  cols: 2 },
    { w: 36,  h: 90,  cols: 3 },
    { w: 20,  h: 55,  cols: 2 },
  ];

  buildingDefs.forEach((def, i) => {
    const bldg = document.createElement('div');
    bldg.className = 'city-bldg';
    Object.assign(bldg.style, {
      width:  def.w + 'px',
      height: def.h + 'px',
      '--cols': def.cols,
      // Stagger the float timing slightly per building
      transitionDelay: (i * 0.07) + 's',
    });

    // Windows grid
    const rows = Math.floor(def.h / 12);
    const winGrid = document.createElement('div');
    winGrid.className = 'city-bldg-windows';
    winGrid.style.gridTemplateColumns = `repeat(${def.cols}, 1fr)`;
    winGrid.style.gridTemplateRows    = `repeat(${rows}, 1fr)`;

    const totalWindows = def.cols * rows;
    for (let w = 0; w < totalWindows; w++) {
      const win = document.createElement('div');
      win.className = 'city-window' + (Math.random() < 0.3 ? ' dark' : '');
      winGrid.appendChild(win);
    }
    bldg.appendChild(winGrid);
    buildings.appendChild(bldg);
  });

  // ── Add decorative clouds at the base ───────────
  function makeCloud(left, bottom, width, height, opacity) {
    const c = document.createElement('div');
    c.className = 'city-cloud';
    Object.assign(c.style, {
      left:    left + '%',
      bottom:  bottom + 'px',
      width:   width + 'px',
      height:  height + 'px',
      opacity: opacity,
    });
    cloudsDiv.appendChild(c);
  }

  makeCloud(5,  10, 80, 22, 0.7);
  makeCloud(30, 5,  120, 28, 0.9);
  makeCloud(65, 15, 90,  20, 0.6);
  makeCloud(80, 8,  70,  18, 0.75);

  // ── Launch ───────────────────────────────────────
  btn.addEventListener('click', () => {
    if (launched) {
      // Reset
      buildings.classList.remove('launched');
      btn.textContent = '↑  Launch the City';
      launched = false;
    } else {
      buildings.classList.add('launched');
      btn.textContent = '↓  Bring it Down';
      launched = true;

      // Add a soft shimmer to windows on launch
      const wins = buildings.querySelectorAll('.city-window:not(.dark)');
      wins.forEach((w, i) => {
        setTimeout(() => {
          w.style.background = 'rgba(255,240,160,0.9)';
          setTimeout(() => w.style.background = '', 1000 + Math.random() * 1000);
        }, i * 30);
      });
    }
  });
})();

/* ═══════════════════════════════════════════════════════════
   9. EXHIBIT 7 — YOUR IDEA
   Takes user input, animates a glowing artifact appearing
   on the pedestal with a gentle floating effect.
═══════════════════════════════════════════════════════════ */

(function initYourIdea() {
  const input    = document.getElementById('idea-input');
  const submitBtn= document.getElementById('idea-submit');
  const artifact = document.getElementById('pedestal-artifact');
  const artifactText = document.getElementById('artifact-text');
  const placedMsg= document.getElementById('idea-placed-msg');
  const form     = document.getElementById('idea-form');

  const placedPhrases = [
    'Your idea has been catalogued in the permanent collection.',
    'The museum accepts your contribution with gratitude.',
    'It is archived now. It will not be forgotten.',
    'The pedestal recognizes your invention.',
    'Welcome to the collection.',
  ];

  submitBtn.addEventListener('click', placeIdea);

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') placeIdea();
  });

  function placeIdea() {
    const idea = input.value.trim();
    if (!idea) {
      // Shake the input gently
      input.style.animation = 'none';
      input.style.borderBottomColor = 'rgba(255,100,100,0.5)';
      setTimeout(() => input.style.borderBottomColor = '', 800);
      return;
    }

    // Place the idea on the pedestal
    artifactText.textContent = idea;
    artifact.classList.add('visible');

    // Show confirmation message
    const phrase = placedPhrases[Math.floor(Math.random() * placedPhrases.length)];
    placedMsg.textContent = phrase;
    placedMsg.classList.add('visible');

    // Fade out the form
    form.style.transition = 'opacity 0.6s ease';
    form.style.opacity = '0.2';
    form.style.pointerEvents = 'none';

    // After a delay, let them submit another
    setTimeout(() => {
      form.style.opacity = '1';
      form.style.pointerEvents = '';
      input.value = '';
      placedMsg.classList.remove('visible');
    }, 5000);
  }
})();

/* ═══════════════════════════════════════════════════════════
   PARALLAX — Gentle depth on mouse movement for the landing
═══════════════════════════════════════════════════════════ */

(function initParallax() {
  const landing = document.getElementById('landing');
  const rings   = document.querySelectorAll('.ornament-ring');

  landing.addEventListener('mousemove', (e) => {
    const rect = landing.getBoundingClientRect();
    const cx   = rect.width  / 2;
    const cy   = rect.height / 2;
    const dx   = (e.clientX - rect.left - cx) / cx;
    const dy   = (e.clientY - rect.top  - cy) / cy;

    rings.forEach((ring, i) => {
      const depth = (i + 1) * 8;
      ring.style.transform = `translate(${dx * depth}px, ${dy * depth}px) scale(${1 + i * 0.02})`;
    });
  });

  landing.addEventListener('mouseleave', () => {
    rings.forEach(ring => { ring.style.transform = ''; });
  });
})();