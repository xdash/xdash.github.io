(() => {
  "use strict";

  const RELEASE_MS = Date.parse("2026-12-18T00:00:00-05:00");
  const DAY_MS = 86400000;

  function getRemaining(targetMs, nowMs) {
    const total = Math.max(0, targetMs - nowMs);
    return {
      days: Math.floor(total / DAY_MS),
      hours: Math.floor(total / 3600000) % 24,
      minutes: Math.floor(total / 60000) % 60,
      seconds: Math.floor(total / 1000) % 60,
      complete: total === 0,
    };
  }

  function pad(value, length = 2) {
    return String(value).padStart(length, "0");
  }

  const api = Object.freeze({ RELEASE_MS, getRemaining, pad });
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  if (typeof document === "undefined") return;
  window.TonyStark = api;

  const fields = {
    days: document.querySelector("[data-days]"),
    hours: document.querySelector("[data-hours]"),
    minutes: document.querySelector("[data-minutes]"),
    seconds: document.querySelector("[data-seconds]"),
  };
  const title = document.querySelector("[data-countdown-title]");

  function setText(element, value) {
    if (element && element.textContent !== value) element.textContent = value;
  }

  function updateCountdown() {
    const remaining = getRemaining(RELEASE_MS, Date.now());
    setText(fields.days, pad(remaining.days, 3));
    setText(fields.hours, pad(remaining.hours));
    setText(fields.minutes, pad(remaining.minutes));
    setText(fields.seconds, pad(remaining.seconds));
    if (remaining.complete) setText(title, "THE UNIVERSE HAS CHANGED.");
  }

  updateCountdown();
  const countdownTimer = window.setInterval(() => {
    if (!document.hidden) updateCountdown();
  }, 1000);
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) updateCountdown();
  });
  window.addEventListener("pagehide", () => window.clearInterval(countdownTimer), { once: true });

  const root = document.documentElement;
  const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  const desktopQuery = window.matchMedia("(min-width: 901px) and (pointer: fine)");
  const motionButton = document.querySelector("[data-motion-toggle]");
  const chapters = [...document.querySelectorAll("[data-chapter]")];
  const navLinks = [...document.querySelectorAll("[data-nav]")];

  function storedPreference() {
    try {
      return window.localStorage.getItem("tonystark-motion");
    } catch {
      return null;
    }
  }

  function savePreference(value) {
    try {
      window.localStorage.setItem("tonystark-motion", value);
    } catch {
      return;
    }
  }

  let motionOn = !motionQuery.matches && storedPreference() !== "off";
  let ticking = false;

  function updateScrollEffects() {
    ticking = false;
    const viewportCenter = window.innerHeight * 0.48;
    let activeId = chapters[0]?.id;

    chapters.forEach((chapter) => {
      const rect = chapter.getBoundingClientRect();
      if (rect.top <= viewportCenter && rect.bottom > viewportCenter) activeId = chapter.id;
      const image = chapter.querySelector(".chapter__media img");
      if (!image) return;
      if (motionOn && desktopQuery.matches) {
        const distance = (rect.top + rect.height / 2 - window.innerHeight / 2) / window.innerHeight;
        const offset = Math.max(-28, Math.min(28, distance * -24));
        image.style.transform = `translate3d(0, ${offset}px, 0) scale(1.06)`;
      } else {
        image.style.removeProperty("transform");
      }
    });

    navLinks.forEach((link) => {
      if (link.dataset.nav === activeId) link.setAttribute("aria-current", "location");
      else link.removeAttribute("aria-current");
    });
  }

  function requestTick() {
    if (!ticking) {
      ticking = true;
      window.requestAnimationFrame(updateScrollEffects);
    }
  }

  function applyMotionState() {
    root.dataset.motion = motionOn ? "on" : "off";
    if (motionButton) {
      motionButton.disabled = motionQuery.matches;
      motionButton.setAttribute("aria-pressed", String(motionOn));
      motionButton.textContent = motionQuery.matches ? "REDUCED MOTION" : `MOTION ${motionOn ? "ON" : "OFF"}`;
    }
    requestTick();
  }

  if (motionButton) {
    motionButton.addEventListener("click", () => {
      motionOn = !motionOn;
      savePreference(motionOn ? "on" : "off");
      applyMotionState();
    });
  }

  motionQuery.addEventListener("change", (event) => {
    motionOn = !event.matches && storedPreference() !== "off";
    applyMotionState();
  });

  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.18 });
    chapters.forEach((chapter) => revealObserver.observe(chapter));
  } else {
    chapters.forEach((chapter) => chapter.classList.add("is-visible"));
  }

  window.addEventListener("scroll", requestTick, { passive: true });
  window.addEventListener("resize", requestTick, { passive: true });
  applyMotionState();
})();
