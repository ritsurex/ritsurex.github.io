// --- CONFIGURATION ---
const EMAILJS_PUBLIC_KEY = "YOUR_EMAILJS_PUBLIC_KEY";
const EMAILJS_SERVICE_ID = "YOUR_SERVICE_ID";
const EMAILJS_TEMPLATE_ID = "YOUR_TEMPLATE_ID";

// 1. Initialize EmailJS
(function () {
  if (typeof emailjs !== "undefined") {
    emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
  }
})();

document.addEventListener("DOMContentLoaded", () => {
  // ----------------------------------------------------
  // Interactive Canvas Particle Constellation
  // ----------------------------------------------------
  const canvas = document.getElementById("particle-canvas");
  const ctx = canvas.getContext("2d");

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener("resize", () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const mouse = { x: null, y: null, radius: 120 };

  window.addEventListener("mousemove", (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener("mouseout", () => {
    mouse.x = null;
    mouse.y = null;
  });

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.7;
      this.vy = (Math.random() - 0.5) * 0.7;
      this.radius = 1.5;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;

      // Mouse collision repulsion
      if (mouse.x && mouse.y) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          this.x -= (dx / dist) * force * 3;
          this.y -= (dy / dist) * force * 3;
        }
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(0, 229, 153, 0.4)";
      ctx.fill();
    }
  }

  const particleCount = Math.min(Math.floor(window.innerWidth / 15), 90);
  const particles = Array.from({ length: particleCount }, () => new Particle());

  function animateNetwork() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();

      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 110) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(0, 229, 153, ${0.15 - distance / 1100})`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(animateNetwork);
  }
  animateNetwork();

  // ----------------------------------------------------
  // Custom Magnetic Glowing Cursor
  // ----------------------------------------------------
  const dot = document.getElementById("cursor-dot");
  const outline = document.getElementById("cursor-outline");

  window.addEventListener("mousemove", (e) => {
    dot.style.left = `${e.clientX}px`;
    dot.style.top = `${e.clientY}px`;

    outline.animate(
      { left: `${e.clientX}px`, top: `${e.clientY}px` },
      { duration: 400, fill: "forwards" }
    );
  });

  const interactiveElements = document.querySelectorAll(
    "a, button, input, textarea, .tilt-card, .skill-chip"
  );

  interactiveElements.forEach((el) => {
    el.addEventListener("mouseenter", () => document.body.classList.add("cursor-active"));
    el.addEventListener("mouseleave", () => document.body.classList.remove("cursor-active"));
  });

  // ----------------------------------------------------
  // Terminal Typing Animation
  // ----------------------------------------------------
  const typewriterTarget = document.getElementById("typewriter");
  const phrases = [
    "cloud architectures.",
    "distributed services.",
    "low-latency web apps.",
    "reliable database backends."
  ];

  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  function typeEffect() {
    const currentPhrase = phrases[phraseIndex];
    if (isDeleting) {
      typewriterTarget.textContent = currentPhrase.substring(0, charIndex - 1);
      charIndex--;
    } else {
      typewriterTarget.textContent = currentPhrase.substring(0, charIndex + 1);
      charIndex++;
    }

    let speed = isDeleting ? 40 : 80;

    if (!isDeleting && charIndex === currentPhrase.length) {
      speed = 1800; // Pause at end of phrase
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      speed = 400;
    }

    setTimeout(typeEffect, speed);
  }
  typeEffect();

  // ----------------------------------------------------
  // 3D Tilt Card Interaction
  // ----------------------------------------------------
  const cards = document.querySelectorAll("[data-tilt]");

  cards.forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -10;
      const rotateY = ((x - centerX) / centerX) * 10;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)`;
    });
  });

  // ----------------------------------------------------
  // Bitcoin Copy Action
  // ----------------------------------------------------
  const copyBtn = document.getElementById("copy-btc-btn");
  const btcInput = document.getElementById("btc-input");
  const copyFeedback = document.getElementById("copy-feedback");

  if (copyBtn) {
    copyBtn.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(btcInput.value);
        copyFeedback.textContent = "Address copied to clipboard.";
        copyBtn.textContent = "Copied!";
        setTimeout(() => {
          copyFeedback.textContent = "";
          copyBtn.textContent = "Copy Address";
        }, 2200);
      } catch (err) {
        copyFeedback.textContent = "Copy failed. Please manually select text.";
      }
    });
  }

  // ----------------------------------------------------
  // EmailJS Direct Form Dispatch
  // ----------------------------------------------------
  const form = document.getElementById("contact-form");
  const status = document.getElementById("form-status");
  const submitBtn = document.getElementById("submit-btn");

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      if (EMAILJS_PUBLIC_KEY === "YOUR_EMAILJS_PUBLIC_KEY") {
        status.style.color = "#ff5f56";
        status.textContent = "Error: EmailJS API keys are unconfigured in script.js";
        return;
      }

      submitBtn.disabled = true;
      submitBtn.textContent = "Dispatching Packet...";
      status.textContent = "";

      emailjs
        .sendForm(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, this)
        .then(() => {
          status.style.color = "#00e599";
          status.textContent = "✓ Packet received. Connection open.";
          form.reset();
        })
        .catch((err) => {
          status.style.color = "#ff5f56";
          status.textContent = "Transmission failed. Verify client credentials.";
          console.error(err);
        })
        .finally(() => {
          submitBtn.disabled = false;
          submitBtn.textContent = "Dispatch Packet";
        });
    });
  }
});
