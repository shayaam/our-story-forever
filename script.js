/* OUR STORY, FOREVER — personal settings and scroll effects */
"use strict";

/*
  PERSONALISE THIS OBJECT:
  Replace the sample text with your details. You can also edit the same text
  directly in index.html. Keep the keys unchanged.
*/
const loveStory = {
  yourName: "Dubuku",
  wifeName: "Nivi",
  firstDate: "[6th September 2025]",
  anniversary: "Since 15th August 2026",
  customLetter: "[This is not just a friendship Anymore...]"
};

// Fill repeated name/date placeholders throughout the page.
document.querySelectorAll("[data-fill]").forEach((element) => {
  const key = element.dataset.fill;
  if (loveStory[key]) element.textContent = loveStory[key];
});

// Reveal elements when they enter the viewport. Stagger nearby items for a softer rhythm.
const revealItems = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.14, rootMargin: "0px 0px -35px 0px" });
  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

// Optional background music. Browsers require a user gesture before audio can play.
const musicToggle = document.getElementById("musicToggle");
const musicLabel = document.getElementById("musicLabel");
const backgroundMusic = document.getElementById("backgroundMusic");
let musicUnavailable = false;

musicToggle.addEventListener("click", async () => {
  if (backgroundMusic.paused) {
    try {
      await backgroundMusic.play();
      musicToggle.setAttribute("aria-pressed", "true");
      musicLabel.textContent = "Music on";
      musicUnavailable = false;
    } catch (error) {
      musicLabel.textContent = "Add song file";
      musicUnavailable = true;
      window.setTimeout(() => {
        if (musicUnavailable) musicLabel.textContent = "Music off";
      }, 2400);
    }
  } else {
    backgroundMusic.pause();
    musicToggle.setAttribute("aria-pressed", "false");
    musicLabel.textContent = "Music off";
  }
});

// Surprise ending with a small heart burst.
const surpriseButton = document.getElementById("surpriseButton");
const surpriseMessage = document.getElementById("surpriseMessage");
const heartBurst = document.getElementById("heartBurst");
surpriseButton.addEventListener("click", () => {
  surpriseMessage.hidden = false;
  surpriseButton.textContent = "A surprise, just for you ♡";
  surpriseButton.setAttribute("aria-expanded", "true");
  heartBurst.replaceChildren();
  const hearts = ["♡", "♥", "✧", "♡", "♥", "✦", "♡", "♥", "♡", "✧", "♥", "♡"];
  hearts.forEach((symbol, index) => {
    const heart = document.createElement("span");
    heart.className = "burst-heart";
    heart.textContent = symbol;
    heart.style.left = `${7 + Math.random() * 86}%`;
    heart.style.bottom = `${8 + Math.random() * 25}%`;
    heart.style.animationDelay = `${Math.random() * 1.2}s`;
    heart.style.fontSize = `${12 + Math.random() * 18}px`;
    heartBurst.appendChild(heart);
  });
  surpriseMessage.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "center" });
});

// If the visitor prefers reduced motion, CSS handles the motion reduction.

// CINEMATIC 3D HEART: eased scroll-linked rotation.
// Scroll position sets a target; the heart glides toward it with interpolation instead of snapping.
const scrollHeart = document.getElementById("scrollHeart");
const heartSection = document.getElementById("our-heart");
const heartPhoto = document.querySelector(".heart-photo");
const heartProgressBar = document.getElementById("heartProgressBar");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

if (scrollHeart && heartSection) {
  if (heartPhoto) {
    const photoTest = new Image();
    photoTest.onload = () => scrollHeart.classList.remove("photo-missing");
    photoTest.onerror = () => scrollHeart.classList.add("photo-missing");
    photoTest.src = heartPhoto.getAttribute("href") || "assets/our-heart-photo.jpg";
  }

  const current = { y: 0, x: 0, z: 0, spread: 1, scale: 1.015 };
  let target = { ...current };
  let animationFrame = 0;

  const measureHeartTarget = () => {
    const rect = heartSection.getBoundingClientRect();
    const scrollable = Math.max(1, rect.height - window.innerHeight);
    const progress = Math.min(1, Math.max(0, -rect.top / scrollable));
    if (heartProgressBar) heartProgressBar.style.width = `${progress * 100}%`;

    if (reduceMotion.matches) {
      target = { y: 0, x: 0, z: 0, spread: 1, scale: 1 };
    } else {
      target = {
        y: -32 + progress * 410,
        x: 4 + Math.sin(progress * Math.PI * 2) * 9,
        z: Math.sin(progress * Math.PI * 2) * 3,
        spread: 1 + Math.sin(progress * Math.PI) * 1.45,
        scale: 1.015 + Math.sin(progress * Math.PI) * 0.045
      };
    }
    if (!animationFrame) animationFrame = window.requestAnimationFrame(animateHeart);
  };

  const animateHeart = () => {
    // Higher ease factor = responsive but still silky-smooth.
    const ease = reduceMotion.matches ? 1 : 0.105;
    let stillMoving = false;
    for (const key of Object.keys(current)) {
      const delta = target[key] - current[key];
      if (Math.abs(delta) > 0.025) stillMoving = true;
      current[key] += delta * ease;
    }

    scrollHeart.style.setProperty("--heart-rotate-y", `${current.y}deg`);
    scrollHeart.style.setProperty("--heart-rotate-x", `${current.x}deg`);
    scrollHeart.style.setProperty("--heart-tilt", `${current.z}deg`);
    scrollHeart.style.setProperty("--heart-depth-spread", current.spread.toFixed(3));
    scrollHeart.style.transform =
      `rotateX(${current.x}deg) rotateY(${current.y}deg) rotateZ(${current.z}deg) scale(${current.scale})`;

    if (stillMoving) {
      animationFrame = window.requestAnimationFrame(animateHeart);
    } else {
      animationFrame = 0;
    }
  };

  window.addEventListener("scroll", measureHeartTarget, { passive: true });
  window.addEventListener("resize", measureHeartTarget);
  if (reduceMotion.addEventListener) reduceMotion.addEventListener("change", measureHeartTarget);
  else if (reduceMotion.addListener) reduceMotion.addListener(measureHeartTarget);
  measureHeartTarget();
}

// Video placeholder disappears only after the browser confirms that the video can load.
const videoFrame = document.querySelector(".video-frame");
const coupleVideo = document.querySelector(".couple-video");
if (videoFrame && coupleVideo) {
  coupleVideo.addEventListener("loadeddata", () => videoFrame.classList.add("has-video"), { once: true });
  coupleVideo.addEventListener("error", () => videoFrame.classList.remove("has-video"));
}
