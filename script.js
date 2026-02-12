// === SMOOTH SCROLL & NAVIGATION ===
document.addEventListener("DOMContentLoaded", () => {
  const sections = document.querySelectorAll(".section");
  const navLinks = document.querySelectorAll(".nav-links a");

  // Smooth scroll for navigation links
  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const targetId = link.getAttribute("href");
      const targetSection = document.querySelector(targetId);

      if (targetSection) {
        targetSection.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  });

  // === INTERSECTION OBSERVER FOR SCROLL ANIMATIONS ===
  const observerOptions = {
    root: null,
    rootMargin: "-50px",
    threshold: 0.1,
  };

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("active");

        // Update background color with smooth transition
        const bgColor = entry.target.getAttribute("data-bg-color");
        if (bgColor) {
          document.body.style.backgroundColor = bgColor;
        }

        // Update active nav link
        updateActiveNavLink(entry.target.id);
      }
    });
  }, observerOptions);

  // Observe all sections
  sections.forEach((section) => {
    sectionObserver.observe(section);
  });

  // Update active navigation link
  function updateActiveNavLink(sectionId) {
    navLinks.forEach((link) => {
      link.classList.remove("active");
      if (link.getAttribute("href") === `#${sectionId}`) {
        link.classList.add("active");
      }
    });
  }

  // === PARALLAX EFFECT FOR HERO ===
  const heroSection = document.querySelector(".hero-section");
  const halftoneOverlay = document.querySelector(".halftone-overlay");

  window.addEventListener("scroll", () => {
    if (heroSection) {
      const scrolled = window.pageYOffset;
      const heroHeight = heroSection.offsetHeight;

      if (scrolled < heroHeight) {
        const opacity = 1 - scrolled / heroHeight;
        heroSection.style.opacity = opacity;

        if (halftoneOverlay) {
          halftoneOverlay.style.transform = `translateY(${scrolled * 0.3}px)`;
        }
      }
    }
  });

  // === SYNCOPATED REVEAL ANIMATIONS ===
  // Add stagger effect to elements within sections
  const animateOnScroll = (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.animationPlayState = "running";
      }
    });
  };

  const elementObserver = new IntersectionObserver(animateOnScroll, {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  });

  // Observe cards and items for staggered animation
  const animatedElements = document.querySelectorAll(
    ".piano-key, .album-card, .tour-date, .stat-item, .contact-method",
  );

  animatedElements.forEach((el) => {
    el.style.animationPlayState = "paused";
    elementObserver.observe(el);
  });

  // === PIANO INTERACTION ===
  const pianoKeys = document.querySelectorAll(".piano-key");
  const skillDisplay = document.querySelector(".skill-display");
  const skillTitle = document.querySelector(".skill-display-title");
  const skillText = document.querySelector(".skill-display-text");
  let lockedKey = null;
  let pianoEngine = null; // Lazy load audio context

  function showSkill(key) {
    const title = key.getAttribute("data-title");
    const skills = key.getAttribute("data-skills");
    if (skillTitle) skillTitle.textContent = title;
    if (skillText) skillText.textContent = skills;
  }

  function resetDisplay() {
    if (skillTitle) skillTitle.innerHTML = "&nbsp;";
    if (skillText)
      skillText.textContent = "Hover or click a key to see the setlist";
  }

  pianoKeys.forEach((key) => {
    // Hover: show skill text (CSS :hover handles the visual press)
    key.addEventListener("mouseenter", () => {
      showSkill(key);
    });

    // Mouse leave: revert to locked key or reset
    key.addEventListener("mouseleave", () => {
      if (lockedKey) {
        showSkill(lockedKey);
      } else {
        resetDisplay();
      }
    });

    // Click: lock this key
    key.addEventListener("click", () => {
      // Initialise piano engine on first user interaction
      if (!pianoEngine) {
        pianoEngine = new PianoEngine();
      }

      // Play sound
      const note = key.querySelector(".key-label").textContent;
      pianoEngine.play(note);

      // Toggle functionality
      if (key.classList.contains("locked")) {
        return;
      } else {
        if (lockedKey) {
          lockedKey.classList.remove("locked");
        }
        key.classList.add("locked");
        lockedKey = key;
        showSkill(key);
      }
    });
  });

  // === MOBILE MENU TOGGLE ===
  // Simple hamburger menu for mobile (you can expand this)
  const createMobileMenu = () => {
    if (window.innerWidth <= 640) {
      const nav = document.querySelector(".navbar");
      const navLinks = document.querySelector(".nav-links");

      // Check if menu button already exists
      if (!document.querySelector(".mobile-menu-btn")) {
        const menuBtn = document.createElement("button");
        menuBtn.className = "mobile-menu-btn";
        menuBtn.innerHTML = "☰";
        menuBtn.style.cssText = `
                    background: none;
                    border: none;
                    color: var(--cream);
                    font-size: 2rem;
                    cursor: pointer;
                    display: block;
                `;

        nav.querySelector(".nav-content").appendChild(menuBtn);

        menuBtn.addEventListener("click", () => {
          navLinks.style.display =
            navLinks.style.display === "flex" ? "none" : "flex";
          navLinks.style.position = "absolute";
          navLinks.style.top = "100%";
          navLinks.style.left = "0";
          navLinks.style.right = "0";
          navLinks.style.background = "rgba(13, 13, 13, 0.98)";
          navLinks.style.flexDirection = "column";
          navLinks.style.padding = "2rem";
          navLinks.style.gap = "1.5rem";
        });
      }
    }
  };

  createMobileMenu();
  window.addEventListener("resize", createMobileMenu);

  // === PERFORMANCE OPTIMIZATION ===
  // Debounce scroll events
  let scrollTimeout;
  window.addEventListener("scroll", () => {
    if (scrollTimeout) {
      window.cancelAnimationFrame(scrollTimeout);
    }

    scrollTimeout = window.requestAnimationFrame(() => {
      // Additional scroll-based animations can go here
    });
  });

  // === PRELOAD ANIMATIONS ===
  // Trigger hero animations on load
  setTimeout(() => {
    const heroSection = document.querySelector(".hero-section");
    if (heroSection) {
      heroSection.classList.add("active");
    }
  }, 100);
});

// === UTILITY: SMOOTH COLOR TRANSITIONS ===
// This ensures body background transitions are always smooth
document.body.style.transition =
  "background-color 1.2s cubic-bezier(0.4, 0, 0.2, 1)";

// === VINYL PLAYER ===
class VinylPlayer {
  constructor() {
    this.audio = new Audio();
    // Placeholder audio - User to provide file later
    this.audio.src = "assets/music/MiltonArias.mp3";
    this.audio.loop = true;
    this.isPlaying = false;

    this.init();
  }

  init() {
    this.createPlayer();
    this.attachEvents();
  }

  createPlayer() {
    const playerContainer = document.createElement("div");
    playerContainer.className = "vinyl-player";

    const disc = document.createElement("div");
    disc.className = "vinyl-disc";

    playerContainer.appendChild(disc);
    document.body.appendChild(playerContainer);

    this.element = playerContainer;
  }

  attachEvents() {
    this.element.addEventListener("click", () => this.toggle());
  }

  toggle() {
    if (this.isPlaying) {
      this.audio.pause();
      this.element.classList.remove("playing");
    } else {
      // Catch error if file doesn't exist
      this.audio
        .play()
        .catch((e) => console.log("Audio file missing or blocked:", e));
      this.element.classList.add("playing");
    }
    this.isPlaying = !this.isPlaying;
  }
}

// === PIANO SOUND ENGINE ===
class PianoEngine {
  constructor() {
    this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    this.notes = {
      C: 261.63, // C4
      D: 293.66, // D4
      E: 329.63, // E4
      F: 349.23, // F4
      G: 392.0, // G4
      A: 440.0, // A4
      B: 493.88, // B4
    };
  }

  play(noteChar) {
    if (this.ctx.state === "suspended") this.ctx.resume();

    const freq = this.notes[noteChar];
    if (!freq) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    // Sound shaping
    osc.type = "triangle"; // Smoother than square, richer than sine
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

    // Envelope (Attack -> Decay)
    gain.gain.setValueAtTime(0, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.3, this.ctx.currentTime + 0.02); // Attack
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 1.5); // Decay

    // Connect and play
    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 1.5);
  }
}

// Initialise
const vinylPlayer = new VinylPlayer();
