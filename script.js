document.addEventListener("DOMContentLoaded", () => {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const sections = document.querySelectorAll(".section");
  const navLinks = document.querySelectorAll(".nav-links a");
  const navContainer = document.getElementById("nav-links");

  // --- Mobile menu button (shown by CSS at 640px and below) ---
  const menuBtn = document.createElement("button");
  menuBtn.id = "mobile-menu-btn";
  menuBtn.className = "mobile-menu-btn";
  menuBtn.type = "button";
  menuBtn.setAttribute("aria-controls", "nav-links");
  menuBtn.setAttribute("aria-expanded", "false");
  menuBtn.setAttribute("aria-label", "Open navigation menu");
  menuBtn.textContent = "☰";
  document.querySelector(".nav-content").appendChild(menuBtn);

  function setMenuOpen(isOpen) {
    navContainer.classList.toggle("mobile-open", isOpen);
    menuBtn.setAttribute("aria-expanded", isOpen ? "true" : "false");
    menuBtn.setAttribute(
      "aria-label",
      isOpen ? "Close navigation menu" : "Open navigation menu",
    );
  }

  menuBtn.addEventListener("click", () => {
    const isOpen = !navContainer.classList.contains("mobile-open");
    setMenuOpen(isOpen);
    if (isOpen) {
      const firstLink = navContainer.querySelector("a");
      if (firstLink) firstLink.focus();
    }
  });

  // --- Hero subtitle: "sax solo" lettering (Blue Note style) ---
  // Each letter gets its own size, baseline and tilt from a fixed seed, so the
  // line looks unpredictable but is identical on every load and stays readable.
  const subtitleText = document.querySelector(".subtitle-text");
  if (subtitleText) {
    const text = subtitleText.textContent.trim();
    subtitleText.setAttribute("aria-label", text);
    subtitleText.textContent = "";
    let seed = 7;
    const rand = () => {
      seed = (seed * 16807) % 2147483647;
      return seed / 2147483647;
    };
    // One line that climbs from left to right: "Data Science |" sits a little
    // lower and "AI Engineering" flows up and away from it.
    const chars = [...text];
    chars.forEach((ch, i) => {
      const span = document.createElement("span");
      span.className = "solo-letter";
      span.setAttribute("aria-hidden", "true");
      if (ch === " ") {
        span.classList.add("solo-space");
        span.textContent = " ";
      } else {
        span.textContent = ch;
        const climb = 0.18 - (i / (chars.length - 1)) * 0.36; // em, low to high
        const wave = climb + Math.sin(i * 0.75) * 0.08; // plus a gentle ripple
        const scale = 0.9 + rand() * 0.38; // 0.90 to 1.28
        const lift = wave + (rand() - 0.5) * 0.18; // em
        const tilt = Math.sin(i * 0.9 + 1) * 5 + (rand() - 0.5) * 8; // deg
        span.style.setProperty("--s", scale.toFixed(2));
        span.style.setProperty("--y", `${lift.toFixed(2)}em`);
        span.style.setProperty("--r", `${tilt.toFixed(1)}deg`);
      }
      subtitleText.appendChild(span);
    });
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && navContainer.classList.contains("mobile-open")) {
      setMenuOpen(false);
      menuBtn.focus();
    }
  });

  window.matchMedia("(min-width: 641px)").addEventListener("change", (e) => {
    if (e.matches) setMenuOpen(false);
  });

  // --- Smooth scroll for nav links ---
  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const targetSection = document.querySelector(link.getAttribute("href"));
      if (!targetSection) return;

      targetSection.scrollIntoView({
        behavior: reduceMotion.matches ? "auto" : "smooth",
        block: "start",
      });

      if (navContainer.classList.contains("mobile-open")) {
        setMenuOpen(false);
        menuBtn.focus();
      }
    });
  });

  // --- Section reveal, background colour and active nav link ---
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("active");

        const bgColor = entry.target.getAttribute("data-bg-color");
        if (bgColor) document.body.style.backgroundColor = bgColor;

        navLinks.forEach((link) => {
          link.classList.toggle(
            "active",
            link.getAttribute("href") === `#${entry.target.id}`,
          );
        });
      });
    },
    { root: null, rootMargin: "-50px", threshold: 0.1 },
  );
  sections.forEach((section) => sectionObserver.observe(section));

  // --- Hero fade and halftone parallax (skipped for reduced motion) ---
  const heroSection = document.querySelector(".hero-section");
  const halftoneOverlay = document.querySelector(".halftone-overlay");
  let scrollFrame = null;

  function updateHero() {
    scrollFrame = null;
    const scrolled = window.scrollY;
    const heroHeight = heroSection.offsetHeight;
    if (scrolled < heroHeight) {
      heroSection.style.opacity = 1 - scrolled / heroHeight;
      if (halftoneOverlay) {
        halftoneOverlay.style.transform = `translateY(${scrolled * 0.3}px)`;
      }
    }
  }

  if (heroSection) {
    window.addEventListener(
      "scroll",
      () => {
        if (reduceMotion.matches || scrollFrame) return;
        scrollFrame = window.requestAnimationFrame(updateHero);
      },
      { passive: true },
    );
    setTimeout(() => heroSection.classList.add("active"), 100);
  }

  // --- Staggered entry animations start when elements scroll into view ---
  const elementObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.animationPlayState = "running";
        }
      });
    },
    { threshold: 0.1, rootMargin: "0px 0px -50px 0px" },
  );

  document
    .querySelectorAll(
      ".piano-key, .album-card, .tour-date, .stat-item, .contact-method",
    )
    .forEach((el) => {
      el.style.animationPlayState = "paused";
      elementObserver.observe(el);
    });

  // --- Skills keyboard ---
  const skillKeys = document.querySelectorAll("button.piano-key");
  const skillTitle = document.querySelector(".skill-display-title");
  const skillText = document.querySelector(".skill-display-text");
  const skillWhere = document.querySelector(".skill-where");
  const skillStatus = document.getElementById("skill-status");
  const defaultSkillTitle = skillTitle.textContent;
  const defaultSkillText = skillText.textContent.trim();
  let lockedKey = null;
  let pianoEngine = null; // created on first click (browsers need a user gesture)

  function showSkill(key, withLinks) {
    skillTitle.textContent = key.dataset.title;
    skillText.textContent = key.dataset.skills;
    skillWhere.replaceChildren();

    const places =
      withLinks && key.dataset.where ? JSON.parse(key.dataset.where) : [];
    if (places.length) {
      skillWhere.append("Where used: ");
      places.forEach(([label, href], i) => {
        if (i > 0) skillWhere.append("; ");
        const link = document.createElement("a");
        link.href = href;
        link.textContent = label;
        skillWhere.appendChild(link);
      });
      skillWhere.hidden = false;
    } else {
      skillWhere.hidden = true;
    }
  }

  function resetDisplay() {
    skillTitle.textContent = defaultSkillTitle;
    skillText.textContent = defaultSkillText;
    skillWhere.hidden = true;
  }

  function restoreDisplay() {
    if (lockedKey) showSkill(lockedKey, true);
    else resetDisplay();
  }

  skillKeys.forEach((key) => {
    key.addEventListener("mouseenter", () => showSkill(key, false));
    key.addEventListener("focus", () => showSkill(key, false));
    key.addEventListener("mouseleave", restoreDisplay);
    key.addEventListener("blur", restoreDisplay);

    key.addEventListener("click", () => {
      if (!pianoEngine) pianoEngine = new PianoEngine();
      if (!reduceMotion.matches) {
        pianoEngine.play(key.querySelector(".key-label").textContent);
      }

      if (lockedKey === key) {
        key.classList.remove("locked");
        key.setAttribute("aria-pressed", "false");
        lockedKey = null;
        resetDisplay();
        skillStatus.textContent = "";
        return;
      }

      if (lockedKey) {
        lockedKey.classList.remove("locked");
        lockedKey.setAttribute("aria-pressed", "false");
      }
      key.classList.add("locked");
      key.setAttribute("aria-pressed", "true");
      lockedKey = key;
      showSkill(key, true);
      skillStatus.textContent = `${key.dataset.title}: ${key.dataset.skills}`;
    });
  });

  // --- AGENTIC hierarchy diagram ---
  const hierNodes = document.querySelectorAll(".hier-node");
  const hierDetail = document.getElementById("hier-detail");

  if (hierDetail && hierNodes.length) {
    const hierTitle = hierDetail.querySelector(".hier-detail-title");
    const hierRole = hierDetail.querySelector(".hier-detail-role");
    const hierTools = hierDetail.querySelector(".hier-detail-tools");
    const hierDefault = {
      title: hierTitle.textContent,
      role: hierRole.textContent.trim(),
    };
    let activeNode = null;

    const selectNode = (node) => {
      if (activeNode) activeNode.setAttribute("aria-pressed", "false");

      if (activeNode === node) {
        activeNode = null;
        hierTitle.textContent = hierDefault.title;
        hierRole.textContent = hierDefault.role;
        hierTools.textContent = "";
        return;
      }

      activeNode = node;
      node.setAttribute("aria-pressed", "true");
      hierTitle.textContent = node.dataset.nodeTitle;
      hierRole.textContent = node.dataset.nodeRole;
      hierTools.textContent = node.dataset.nodeTools;
    };

    hierNodes.forEach((node) => {
      node.addEventListener("click", () => selectNode(node));
      node.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          selectNode(node);
        }
      });
    });
  }

  // --- Email: separate copy button; the mailto link is left alone ---
  const copyBtn = document.getElementById("copy-email");
  const copyStatus = document.getElementById("copy-status");
  if (copyBtn && copyStatus) {
    if (!navigator.clipboard) {
      copyBtn.hidden = true;
    } else {
      let resetTimer = null;
      const say = (text) => {
        copyStatus.textContent = text;
        clearTimeout(resetTimer);
        resetTimer = setTimeout(() => {
          copyStatus.textContent = "";
        }, 2000);
      };
      copyBtn.addEventListener("click", () => {
        navigator.clipboard
          .writeText(copyBtn.dataset.email)
          .then(() => say("Copied"))
          .catch(() => say("Copy failed. Use the link."));
      });
    }
  }
});

class VinylPlayer {
  constructor() {
    this.audio = new Audio();
    this.audio.preload = "none";
    this.audio.src = "assets/music/MiltonArias.mp3";
    this.audio.loop = true;
    this.isPlaying = false;

    this.createPlayer();
    this.element.addEventListener("click", () => this.toggle());
  }

  createPlayer() {
    const player = document.createElement("button");
    player.type = "button";
    player.className = "vinyl-player";
    player.setAttribute("aria-label", "Background music");
    player.setAttribute("aria-pressed", "false");

    const disc = document.createElement("span");
    disc.className = "vinyl-disc";
    disc.setAttribute("aria-hidden", "true");

    player.appendChild(disc);
    document.body.appendChild(player);
    this.element = player;
  }

  setPlaying(isPlaying) {
    this.isPlaying = isPlaying;
    this.element.classList.toggle("playing", isPlaying);
    this.element.setAttribute("aria-pressed", isPlaying ? "true" : "false");
  }

  toggle() {
    if (this.isPlaying) {
      this.audio.pause();
      this.setPlaying(false);
      return;
    }
    // Playback can be blocked by the browser; only show "playing" if it starts.
    this.audio
      .play()
      .then(() => this.setPlaying(true))
      .catch(() => this.setPlaying(false));
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

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 1.5);
  }
}

new VinylPlayer();
