/**
 * Rainbow Confetti Animation
 * High-performance full-screen celebration confetti on canvas
 */

let activeConfettiAnimId = null;

export const stopRainbowConfetti = () => {
  if (activeConfettiAnimId) {
    cancelAnimationFrame(activeConfettiAnimId);
    activeConfettiAnimId = null;
  }
  const canvas = document.getElementById("confetti-canvas");
  if (canvas && canvas.parentElement) {
    canvas.parentElement.removeChild(canvas);
  }
};

export const triggerRainbowConfetti = () => {
  stopRainbowConfetti();

  const canvas = document.createElement("canvas");
  canvas.id = "confetti-canvas";
  canvas.setAttribute("aria-hidden", "true");
  canvas.style.position = "fixed";
  canvas.style.top = "0";
  canvas.style.left = "0";
  canvas.style.width = "100vw";
  canvas.style.height = "100vh";
  canvas.style.pointerEvents = "none";
  canvas.style.zIndex = "10000";
  document.body.appendChild(canvas);

  const ctx = canvas.getContext("2d");
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  const onResize = () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  };
  window.addEventListener("resize", onResize);

  // Rainbow palette (red, orange, yellow, green, cyan, blue, violet, magenta)
  const rainbowColors = [
    "#FF2A55",
    "#FF7E1D",
    "#FFD000",
    "#00D06C",
    "#00B4D8",
    "#0077B6",
    "#7209B7",
    "#F72585",
  ];

  const particles = [];
  const particleCount = Math.min(140, Math.floor(width / 7));

  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * -height * 0.6 - 15,
      size: Math.random() * 8 + 6,
      color: rainbowColors[Math.floor(Math.random() * rainbowColors.length)],
      vx: (Math.random() - 0.5) * 3,
      vy: Math.random() * 3.5 + 2.5,
      rotation: Math.random() * 360,
      vRot: (Math.random() - 0.5) * 8,
      wobble: Math.random() * 10,
      wobbleSpeed: Math.random() * 0.08 + 0.03,
      shape: Math.random() > 0.35 ? "rect" : "circle",
    });
  }

  const startTime = performance.now();
  const duration = 4000; // 4s celebration duration

  const render = (currentTime) => {
    const elapsed = currentTime - startTime;
    if (elapsed > duration) {
      stopRainbowConfetti();
      window.removeEventListener("resize", onResize);
      return;
    }

    const fadeStart = duration - 800;
    const alpha = elapsed > fadeStart ? Math.max(0, 1 - (elapsed - fadeStart) / 800) : 1;

    ctx.clearRect(0, 0, width, height);
    ctx.globalAlpha = alpha;

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.x += p.vx + Math.sin(p.wobble) * 1.5;
      p.y += p.vy;
      p.wobble += p.wobbleSpeed;
      p.rotation += p.vRot;

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.fillStyle = p.color;

      if (p.shape === "rect") {
        ctx.fillRect(-p.size / 2, -p.size / 3.5, p.size, p.size / 1.75);
      } else {
        ctx.beginPath();
        ctx.arc(0, 0, p.size / 2.5, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    }

    activeConfettiAnimId = requestAnimationFrame(render);
  };

  activeConfettiAnimId = requestAnimationFrame(render);
};

