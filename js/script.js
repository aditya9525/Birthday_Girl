/* ==========================================================================
   BIRTHDAY WISHES WEBSITE - INTERACTIVE ENGINE & ANIMATIONS
   Includes Config, Web Audio Music Synthesizer, Canvas Sparkles & Interactivity
   ========================================================================== */

// EASY CUSTOMIZATION CONFIG
const BIRTHDAY_CONFIG = {
  // Change name here (e.g. "Aditi", "Ananya", "Sneha", "Bestie", etc.)
  name: "Bestie",
  
  // Custom messages
  heroSubtitle: "Today is all about YOU! ✨",
  
  revealMessage: "Some people make ordinary moments feel special just by being there. Today is your day, so I just wanted to remind you how amazing you are. Keep smiling, keep shining and keep being the wonderful person you are. ❤️",
  
  letterParagraph1: "I hope today brings you endless smiles, warm laughter, and all the magical moments you truly deserve.",
  letterParagraph2: "Thank you for being such a bright light, an incredible friend, and someone who brings so much warmth into the world!",
  
  finalWish: "Happy Birthday once again! 🎉❤️",
  finalSub: "I hope this little surprise made you smile."
};

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Configured Names & Texts
  initCustomConfig();

  // Initialize Background Sparkles
  initSparkleCanvas();

  // Initialize Audio Engine
  initAudioEngine();

  // Initialize Event Listeners
  initAppEvents();
});

/* ==========================================================================
   1. CUSTOM CONFIG LOADER
   ========================================================================== */
function initCustomConfig() {
  const nameElements = ['hero-name', 'reveal-name', 'letter-name'];
  nameElements.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.textContent = BIRTHDAY_CONFIG.name;
  });

  const revealMsg = document.getElementById('reveal-message-text');
  if (revealMsg) revealMsg.textContent = `"${BIRTHDAY_CONFIG.revealMessage}"`;
}

/* ==========================================================================
   2. BACKGROUND SPARKLE & HEART CANVAS
   ========================================================================== */
function initSparkleCanvas() {
  const canvas = document.getElementById('sparkle-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let w = (canvas.width = window.innerWidth);
  let h = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  });

  const sparkles = [];
  const COUNT = 30;

  for (let i = 0; i < COUNT; i++) {
    sparkles.push({
      x: Math.random() * w,
      y: Math.random() * h,
      size: Math.random() * 3 + 1,
      vy: -(Math.random() * 0.8 + 0.3),
      vx: (Math.random() - 0.5) * 0.5,
      alpha: Math.random(),
      fadeSpeed: Math.random() * 0.02 + 0.01,
      isHeart: Math.random() > 0.7
    });
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);

    sparkles.forEach(s => {
      s.y += s.vy;
      s.x += s.vx;
      s.alpha += s.fadeSpeed;

      if (s.alpha >= 1 || s.alpha <= 0) {
        s.fadeSpeed = -s.fadeSpeed;
      }

      if (s.y < -20) {
        s.y = h + 20;
        s.x = Math.random() * w;
      }

      ctx.save();
      ctx.globalAlpha = Math.max(0, s.alpha);

      if (s.isHeart) {
        ctx.fillStyle = '#ff8da1';
        ctx.font = '12px serif';
        ctx.fillText('✨', s.x, s.y);
      } else {
        ctx.fillStyle = '#ffffff';
        ctx.shadowColor = '#ff5e8e';
        ctx.shadowBlur = 6;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    });

    requestAnimationFrame(draw);
  }

  draw();
}

/* ==========================================================================
   3. WEB AUDIO SYNTHESIZER (Happy Birthday Music Box)
   ========================================================================== */
let audioCtx = null;
let isMusicPlaying = false;
let melodyTimeout = null;

function initAudioEngine() {
  const musicBtn = document.getElementById('music-toggle-btn');
  if (!musicBtn) return;

  musicBtn.addEventListener('click', () => {
    toggleMusic();
  });
}

function toggleMusic() {
  const musicBtn = document.getElementById('music-toggle-btn');
  
  if (!audioCtx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    audioCtx = new AudioContext();
  }

  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }

  if (isMusicPlaying) {
    stopMusicBox();
    musicBtn.classList.remove('playing');
    isMusicPlaying = false;
  } else {
    playMusicBox();
    musicBtn.classList.add('playing');
    isMusicPlaying = true;
  }
}

// Play soft piano/music-box Happy Birthday melody
function playMusicBox() {
  if (!audioCtx) return;

  // Notes & Frequencies for Happy Birthday
  // C4 = 261.63, D4 = 293.66, E4 = 329.63, F4 = 349.23, G4 = 392.00, A4 = 440.00, B4 = 493.88, C5 = 523.25
  const C4 = 261.63, D4 = 293.66, E4 = 329.63, F4 = 349.23, G4 = 392.00, A4 = 440.00, Bb4 = 466.16, C5 = 523.25, D5 = 587.33, F5 = 698.46, E5 = 659.25;

  const notes = [
    { f: C4, d: 300 }, { f: C4, d: 300 }, { f: D4, d: 600 }, { f: C4, d: 600 }, { f: F4, d: 600 }, { f: E4, d: 1200 },
    { f: C4, d: 300 }, { f: C4, d: 300 }, { f: D4, d: 600 }, { f: C4, d: 600 }, { f: G4, d: 600 }, { f: F4, d: 1200 },
    { f: C4, d: 300 }, { f: C4, d: 300 }, { f: C5, d: 600 }, { f: A4, d: 600 }, { f: F4, d: 600 }, { f: E4, d: 600 }, { f: D4, d: 1200 },
    { f: Bb4, d: 300 }, { f: Bb4, d: 300 }, { f: A4, d: 600 }, { f: F4, d: 600 }, { f: G4, d: 600 }, { f: F4, d: 1200 }
  ];

  let currentNote = 0;

  function playNext() {
    if (!isMusicPlaying) return;

    const note = notes[currentNote];
    playTone(note.f, note.d / 1000);

    currentNote = (currentNote + 1) % notes.length;
    melodyTimeout = setTimeout(playNext, note.d + 80);
  }

  playNext();
}

function stopMusicBox() {
  if (melodyTimeout) clearTimeout(melodyTimeout);
}

function playTone(freq, duration) {
  if (!audioCtx) return;
  try {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = 'sine'; // Soft music box chime sound
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

    gain.gain.setValueAtTime(0, audioCtx.currentTime);
    gain.gain.linearRampToValueAtTime(0.2, audioCtx.currentTime + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + duration);
  } catch (e) {
    console.log('Audio tone error', e);
  }
}

// Chime sound effect on interaction
function playPopSound() {
  if (!audioCtx) return;
  playTone(523.25, 0.2); // High C chime
}

/* ==========================================================================
   4. INTERACTIVE EVENTS & REVEALS
   ========================================================================== */
function initAppEvents() {
  // 1. Open Surprise CTA Button
  const openSurpriseBtn = document.getElementById('open-surprise-btn');
  const mainContent = document.getElementById('main-content');
  const heroSection = document.getElementById('hero-section');

  openSurpriseBtn.addEventListener('click', (e) => {
    // Start background music automatically on first user click if not playing
    if (!isMusicPlaying) {
      toggleMusic();
    }

    // Trigger Confetti Burst
    const rect = openSurpriseBtn.getBoundingClientRect();
    ConfettiEngine.burst(rect.left + rect.width / 2, rect.top, 80);

    // Unhide Main Sections smoothly
    mainContent.classList.remove('hidden');
    setTimeout(() => {
      mainContent.classList.add('visible');
      // Smooth scroll to reveal section
      document.getElementById('reveal-section').scrollIntoView({ behavior: 'smooth' });
    }, 100);
  });

  // 2. Photo Lightbox Modal
  const memoryCards = document.querySelectorAll('.memory-card');
  const modal = document.getElementById('photo-modal');
  const modalImg = document.getElementById('modal-img');
  const modalCaption = document.getElementById('modal-caption');
  const closeModalBtn = document.getElementById('close-modal-btn');
  const modalLoveBtn = document.getElementById('modal-love-btn');
  const modalHeartCount = document.getElementById('modal-heart-count');

  let activeCardIndex = 0;

  memoryCards.forEach(card => {
    card.addEventListener('click', () => {
      playPopSound();
      const img = card.querySelector('img');
      const caption = card.querySelector('.caption').textContent;
      activeCardIndex = card.getAttribute('data-index');

      modalImg.src = img.src;
      modalCaption.textContent = caption;
      modalHeartCount.textContent = '1';

      modal.classList.remove('hidden');
    });
  });

  closeModalBtn.addEventListener('click', () => {
    modal.classList.add('hidden');
  });

  modalLoveBtn.addEventListener('click', () => {
    let count = parseInt(modalHeartCount.textContent);
    count++;
    modalHeartCount.textContent = count;
    ConfettiEngine.burst(window.innerWidth / 2, window.innerHeight / 2, 25);
  });

  // 3. Candle Blow Interactive Cake
  const blowBtn = document.getElementById('blow-candles-btn');
  const flames = document.querySelectorAll('.flame');
  const wishBanner = document.getElementById('wish-status-banner');
  const wishBtnText = document.getElementById('wish-btn-text');

  let wishMade = false;

  blowBtn.addEventListener('click', (e) => {
    if (wishMade) return;

    playPopSound();

    // Extinguish Flames
    flames.forEach((flame, idx) => {
      setTimeout(() => {
        flame.classList.add('extinguished');
      }, idx * 150);
    });

    // Confetti Rain & Particles
    setTimeout(() => {
      ConfettiEngine.rain(3500);
      
      wishBanner.innerHTML = `
        <p class="wish-made-text">Wish Made! ✨❤️</p>
        <p style="font-size:0.9rem; color:#7d596e; margin-top:4px;">May every single wish in your heart come true today & always!</p>
      `;
      wishBtnText.textContent = "Wish Granted! 🌟";
      blowBtn.style.opacity = "0.7";
      wishMade = true;
    }, 600);
  });

  // 4. Message Cards Sparkle Effect
  const msgCards = document.querySelectorAll('.message-card');
  msgCards.forEach(card => {
    card.addEventListener('click', (e) => {
      playPopSound();
      const rect = card.getBoundingClientRect();
      ConfettiEngine.burst(rect.left + rect.width / 2, rect.top + rect.height / 2, 20);

      card.style.transform = "scale(1.03)";
      setTimeout(() => {
        card.style.transform = "";
      }, 200);
    });
  });

  // 5. Envelope Opening & Surprise Letter Reveal
  const openEnvelopeBtn = document.getElementById('open-envelope-btn');
  const envelopeContainer = document.getElementById('envelope-container');
  const envelope = document.getElementById('envelope');

  openEnvelopeBtn.addEventListener('click', () => {
    playPopSound();
    openEnvelopeBtn.classList.add('hidden');
    envelopeContainer.classList.remove('hidden');

    setTimeout(() => {
      envelope.classList.add('open');
      ConfettiEngine.rain(4000);
    }, 300);
  });

  // 6. Replay Button
  const replayBtn = document.getElementById('replay-btn');
  if (replayBtn) {
    replayBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
}
