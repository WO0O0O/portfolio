document.addEventListener("DOMContentLoaded", () => {
  const sections = document.querySelectorAll(".section");
  const navLinks = document.querySelectorAll(".nav-links a");

  // Smooth scroll for nav links
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
        try {
          if (window.innerWidth <= 640) {
            const navContainer = document.getElementById("nav-links");
            const menuBtn = document.getElementById("mobile-menu-btn");
            if (
              navContainer &&
              navContainer.classList.contains("mobile-open")
            ) {
              navContainer.classList.remove("mobile-open");
              if (menuBtn) menuBtn.setAttribute("aria-expanded", "false");
              // move focus back to the menu button so keyboard users aren't left on the link
              if (menuBtn) menuBtn.focus();
            }
          }
        } catch (err) {}
      }
    });
  });

  const observerOptions = {
    root: null,
    rootMargin: "-50px",
    threshold: 0.1,
  };

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("active");

        const bgColor = entry.target.getAttribute("data-bg-color");
        if (bgColor) {
          document.body.style.backgroundColor = bgColor;
        }

        updateActiveNavLink(entry.target.id);
      }
    });
  }, observerOptions);

  // Observe all sections
  sections.forEach((section) => {
    sectionObserver.observe(section);
  });

  function updateActiveNavLink(sectionId) {
    navLinks.forEach((link) => {
      link.classList.remove("active");
      if (link.getAttribute("href") === `#${sectionId}`) {
        link.classList.add("active");
      }
    });
  }

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

  const animatedElements = document.querySelectorAll(
    ".piano-key, .album-card, .tour-date, .stat-item, .contact-method",
  );

  animatedElements.forEach((el) => {
    el.style.animationPlayState = "paused";
    elementObserver.observe(el);
  });

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
    key.addEventListener("mouseenter", () => {
      showSkill(key);
    });

    key.addEventListener("mouseleave", () => {
      if (lockedKey) {
        showSkill(lockedKey);
      } else {
        resetDisplay();
      }
    });

    key.addEventListener("click", () => {
      if (!pianoEngine) {
        pianoEngine = new PianoEngine();
      }

      // Play sound
      const note = key.querySelector(".key-label").textContent;
      pianoEngine.play(note);

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

  const createMobileMenu = () => {
    if (window.innerWidth <= 640) {
      const nav = document.querySelector(".navbar");
      const navLinks = document.getElementById("nav-links");

      // Check if menu button already exists
      if (!document.getElementById("mobile-menu-btn")) {
        const menuBtn = document.createElement("button");
        menuBtn.id = "mobile-menu-btn";
        menuBtn.className = "mobile-menu-btn";
        menuBtn.type = "button";
        menuBtn.setAttribute("aria-controls", "nav-links");
        menuBtn.setAttribute("aria-expanded", "false");
        menuBtn.setAttribute("aria-label", "Open navigation menu");
        menuBtn.textContent = "☰";
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
          const isOpen = navLinks.classList.toggle("mobile-open");
          menuBtn.setAttribute("aria-expanded", isOpen ? "true" : "false");
          if (isOpen) {
            // move focus to first link for easier keyboard navigation
            const firstLink = navLinks.querySelector("a");
            if (firstLink) firstLink.focus();
          } else {
            menuBtn.focus();
          }
        });

        window.addEventListener("resize", () => {
          if (
            window.innerWidth > 640 &&
            navLinks.classList.contains("mobile-open")
          ) {
            navLinks.classList.remove("mobile-open");
            menuBtn.setAttribute("aria-expanded", "false");
          }
        });
      }
    } else {
      const navLinks = document.getElementById("nav-links");
      const menuBtn = document.getElementById("mobile-menu-btn");
      if (navLinks && navLinks.classList.contains("mobile-open")) {
        navLinks.classList.remove("mobile-open");
        if (menuBtn) menuBtn.setAttribute("aria-expanded", "false");
      }
    }
  };

  createMobileMenu();
  window.addEventListener("resize", createMobileMenu);

  let scrollTimeout;
  window.addEventListener("scroll", () => {
    if (scrollTimeout) {
      window.cancelAnimationFrame(scrollTimeout);
    }

    scrollTimeout = window.requestAnimationFrame(() => {});
  });

  setTimeout(() => {
    const heroSection = document.querySelector(".hero-section");
    if (heroSection) {
      heroSection.classList.add("active");
    }
  }, 100);
});

document.body.style.transition =
  "background-color 1.2s cubic-bezier(0.4, 0, 0.2, 1)";

class VinylPlayer {
  constructor() {
    this.audio = new Audio();
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
      this.audio
        .play()
        .catch((e) => console.log("Audio file missing or blocked:", e));
      this.element.classList.add("playing");
    }
    this.isPlaying = !this.isPlaying;
  }
}

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

    osc.type = "triangle";
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

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
