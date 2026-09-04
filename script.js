/* ==========================================================================
   CONFIGURATION
   Edit everything about this page from here — no need to touch markup.
   ========================================================================== */

const birthdayConfig = {
  name: "Johe",
  birthdayDate: "2027-08-27T00:00:00", // ISO date the countdown targets
  heroMessage: "Un día para celebrar todo lo que eres.",

  // Main photo shown in the framed card next to the cake.
  // Leave as "" (or a path that doesn't exist) to show the elegant placeholder instead.
  photo: "photo.jpg",

  // Message revealed when the gift is opened.
  giftMessage: "Felicicades mi vida, que DIOS te de todo y mas, es lo que mereces.",

  // The letter — shown when the envelope is opened.
  letter: {
    text: "Hoy es un día especial porque celebramos a una persona especial. Espero que este nuevo año de vida venga acompañado de muchos momentos buenos, nuevas experiencias y razones para sonreír",
    signature: "Con cariño.",
  },

  // Memories gallery. Add as many entries as you like — missing images
  // automatically fall back to a placeholder card instead of a broken icon.
  memories: [
    { src: "assets/recuerdo-1.jpg", caption: "Un buen momento" },
    { src: "assets/recuerdo-2.jpg", caption: "Otro recuerdo" },
    { src: "assets/recuerdo-3.jpg", caption: "Risas" },
    { src: "assets/recuerdo-4.jpg", caption: "Celebrando" },
  ],

  // Background music. Point this at an audio file (mp3/ogg) once you have one;
  // the player stays hidden-but-ready and never attempts autoplay.
  music: "assets/cancion.mp3",
};

/* ==========================================================================
   SETUP HELPERS
   ========================================================================== */

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function $(selector) {
  return document.querySelector(selector);
}

/* ==========================================================================
   HERO CONTENT
   ========================================================================== */

$("#hero-kicker").textContent = `Para ${birthdayConfig.name}`;
$("#hero-name").textContent = birthdayConfig.name;
$("#hero-message").textContent = birthdayConfig.heroMessage;

$("#scroll-cue").addEventListener("click", () => {
  $("#stage").scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth" });
});

/* ==========================================================================
   PHOTO — with graceful fallback when the image is missing
   ========================================================================== */

function loadFramedPhoto() {
  const frame = $("#photo-frame");
  const img = $("#photo-img");

  if (!birthdayConfig.photo) return;

  const probe = new Image();
  probe.onload = () => {
    img.src = birthdayConfig.photo;
    frame.classList.add("has-photo");
  };
  probe.onerror = () => {
    // Keep the elegant placeholder — no broken-image icon.
  };
  probe.src = birthdayConfig.photo;
}

loadFramedPhoto();

/* ==========================================================================
   CANDLE — click to blow out / relight, small puff of particles
   ========================================================================== */

const candle = $("#candle");
const cakeHint = $("#cake-hint");
let candleLit = true;

candle.addEventListener("click", () => {
  candleLit = !candleLit;
  candle.setAttribute("aria-pressed", String(candleLit));

  if (!candleLit) {
    cakeHint.textContent = "¡Deseo pedido! Toca de nuevo para volver a encenderla";
    burstConfetti(candle.getBoundingClientRect(), 18);
  } else {
    cakeHint.textContent = "Toca la vela para pedir un deseo";
  }
});

/* ==========================================================================
   GIFT — click to open, reveal the note, small confetti burst
   ========================================================================== */

const gift = $("#gift");
const giftNote = $("#gift-note");
let giftOpen = false;

$("#gift-note-text").textContent = birthdayConfig.giftMessage;

gift.addEventListener("click", () => {
  giftOpen = !giftOpen;
  gift.classList.toggle("is-open", giftOpen);
  gift.setAttribute("aria-expanded", String(giftOpen));
  giftNote.hidden = !giftOpen;

  if (giftOpen) {
    burstConfetti(gift.getBoundingClientRect(), 26);
  }
});

/* ==========================================================================
   ENVELOPE / LETTER
   ========================================================================== */

const envelope = $("#envelope");
$("#letter-text").textContent = birthdayConfig.letter.text;
$("#letter-sign").textContent = birthdayConfig.letter.signature;

function toggleEnvelope() {
  const isOpen = envelope.classList.toggle("is-open");
  envelope.setAttribute("aria-expanded", String(isOpen));
}

envelope.addEventListener("click", toggleEnvelope);
envelope.addEventListener("keydown", (e) => {
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    toggleEnvelope();
  }
});

/* ==========================================================================
   MEMORIES GALLERY — renders polaroids, falls back to a placeholder per item
   ========================================================================== */

function renderMemories() {
  const track = $("#memories-track");
  const tilts = [-3, 2, -1, 3, -2, 1];

  birthdayConfig.memories.forEach((memory, i) => {
    const card = document.createElement("figure");
    card.className = "polaroid";
    card.style.setProperty("--tilt", `${tilts[i % tilts.length]}deg`);

    const photoWrap = document.createElement("div");
    photoWrap.className = "polaroid-photo";
    photoWrap.innerHTML = `<i class="bx bx-image"></i>`;

    const probe = new Image();
    probe.onload = () => {
      photoWrap.innerHTML = "";
      const img = document.createElement("img");
      img.src = memory.src;
      img.alt = memory.caption || "Recuerdo";
      photoWrap.appendChild(img);
    };
    probe.src = memory.src;

    const caption = document.createElement("figcaption");
    caption.className = "polaroid-caption";
    caption.textContent = memory.caption || "";

    card.appendChild(photoWrap);
    card.appendChild(caption);
    track.appendChild(card);
  });
}

renderMemories();

/* ==========================================================================
   COUNTDOWN
   ========================================================================== */

function startCountdown() {
  const target = new Date(birthdayConfig.birthdayDate).getTime();
  const els = {
    days: $("#cd-days"),
    hours: $("#cd-hours"),
    minutes: $("#cd-minutes"),
    seconds: $("#cd-seconds"),
  };
  const countdownGrid = $("#countdown");
  const message = $("#countdown-message");
  const title = $("#countdown-title");
  let celebrated = false;

  function tick() {
    const diff = target - Date.now();

    if (diff <= 0) {
      if (!celebrated) {
        celebrated = true;
        title.textContent = "¡Es hoy!";
        countdownGrid.hidden = true;
        message.hidden = false;
        message.textContent = `¡Feliz cumpleaños, ${birthdayConfig.name}! 🎉`;
        burstConfetti({ left: window.innerWidth / 2, top: window.innerHeight / 2, width: 0, height: 0 }, 80);
      }
      return;
    }

    const days = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);

    els.days.textContent = String(days).padStart(2, "0");
    els.hours.textContent = String(hours).padStart(2, "0");
    els.minutes.textContent = String(minutes).padStart(2, "0");
    els.seconds.textContent = String(seconds).padStart(2, "0");
  }

  tick();
  setInterval(tick, 1000);
}

startCountdown();

/* ==========================================================================
   MUSIC — no autoplay, ever. Just a small, honest play/pause control.
   ========================================================================== */

function setupMusic() {
  const audio = $("#bg-audio");
  const btn = $("#music-toggle");

  if (birthdayConfig.music) {
    audio.src = birthdayConfig.music;
  }

  btn.addEventListener("click", () => {
    if (!birthdayConfig.music) {
      btn.title = "Agrega una canción en birthdayConfig.music";
      return;
    }

    if (audio.paused) {
      audio.play().catch(() => {
        /* Playback can still fail (missing file, browser policy) — fail silently and quietly. */
      });
    } else {
      audio.pause();
    }
  });

  audio.addEventListener("play", () => {
    btn.classList.add("is-playing");
    btn.setAttribute("aria-pressed", "true");
    btn.setAttribute("aria-label", "Pausar música");
  });

  audio.addEventListener("pause", () => {
    btn.classList.remove("is-playing");
    btn.setAttribute("aria-pressed", "false");
    btn.setAttribute("aria-label", "Reproducir música");
  });
}

setupMusic();

/* ==========================================================================
   SCROLL REVEAL
   ========================================================================== */

function setupScrollReveal() {
  const targets = document.querySelectorAll(
    ".stage-inner, .letter-section, .memories, .countdown-section"
  );
  targets.forEach((el) => el.classList.add("reveal"));

  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    targets.forEach((el) => el.classList.add("in-view"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );

  targets.forEach((el) => observer.observe(el));

  // Safety net: if a section somehow never crosses the threshold (e.g. very
  // short viewports, edge-case layouts), never leave it permanently invisible.
  window.addEventListener("load", () => {
    setTimeout(() => {
      targets.forEach((el) => el.classList.add("in-view"));
    }, 4000);
  });
}

setupScrollReveal();

/* ==========================================================================
   SUBTLE CAKE PARALLAX ON POINTER MOVE (desktop only, respects reduced motion)
   ========================================================================== */

function setupParallax() {
  if (prefersReducedMotion || matchMedia("(hover: none)").matches) return;

  const cake = $("#cake");
  const stage = $("#stage");

  stage.addEventListener("mousemove", (e) => {
    const rect = stage.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    cake.style.transform = `rotate(${x * 4}deg) translateY(${y * -6}px)`;
  });

  stage.addEventListener("mouseleave", () => {
    cake.style.transform = "";
  });
}

setupParallax();

/* ==========================================================================
   CONFETTI ENGINE — a single lightweight canvas particle system.
   Ambient confetti drifts gently; interactions trigger short, localized bursts.
   ========================================================================== */

const ConfettiEngine = (() => {
  const canvas = $("#confetti-canvas");
  const ctx = canvas.getContext("2d");
  let particles = [];
  let width, height;
  const colors = ["#f2879f", "#eab35f", "#fdf1ee", "#d1487a"];

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }
  window.addEventListener("resize", resize);
  resize();

  function makeParticle(overrides = {}) {
    return {
      x: Math.random() * width,
      y: -20,
      size: 4 + Math.random() * 5,
      speedY: 0.6 + Math.random() * 1.2,
      speedX: (Math.random() - 0.5) * 0.6,
      rotation: Math.random() * 360,
      spin: (Math.random() - 0.5) * 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      life: 1,
      ...overrides,
    };
  }

  // Ambient particles — sparse, slow, always subtle.
  const AMBIENT_COUNT = prefersReducedMotion ? 0 : 16;
  for (let i = 0; i < AMBIENT_COUNT; i++) {
    particles.push(makeParticle({ y: Math.random() * height }));
  }

  function burst(rect, count) {
    if (prefersReducedMotion) return;
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 2 + Math.random() * 4;
      particles.push(
        makeParticle({
          x: cx,
          y: cy,
          speedX: Math.cos(angle) * speed,
          speedY: Math.sin(angle) * speed - 2,
          ambient: false,
          gravity: true,
          life: 1,
        })
      );
    }
  }

  function step() {
    ctx.clearRect(0, 0, width, height);

    particles.forEach((p) => {
      p.x += p.speedX;
      p.y += p.speedY;
      p.rotation += p.spin;

      if (p.gravity) {
        p.speedY += 0.08;
        p.life -= 0.012;
      } else if (p.y > height + 20) {
        p.y = -20;
        p.x = Math.random() * width;
      }

      ctx.save();
      ctx.globalAlpha = Math.max(p.life, 0);
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
      ctx.restore();
    });

    particles = particles.filter((p) => !p.gravity || p.life > 0);
    requestAnimationFrame(step);
  }

  if (!prefersReducedMotion) {
    requestAnimationFrame(step);
  }

  return { burst };
})();

function burstConfetti(rect, count) {
  ConfettiEngine.burst(rect, count);
}
