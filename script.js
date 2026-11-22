(() => {
  // Update copyright year
  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  // Copy email button + toast
  const toast = document.getElementById('toast');
  let toastTimer = null;

  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove('visible');
    }, 2200);
  }

  document.querySelectorAll('.copy-btn').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const text = btn.getAttribute('data-copy');
      if (!text) return;

      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(text);
        } else {
          const temp = document.createElement('textarea');
          temp.value = text;
          temp.style.position = 'fixed';
          temp.style.opacity = '0';
          document.body.appendChild(temp);
          temp.select();
          document.execCommand('copy');
          document.body.removeChild(temp);
        }
        btn.classList.add('copied');
        showToast('Email copied to clipboard');
        setTimeout(() => btn.classList.remove('copied'), 1800);
      } catch {
        showToast('Could not copy email');
      }
    });
  });

  // Geometric network mesh background matching business_card_dark_v5.html
  const canvas = document.getElementById('network-bg');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let width = 0;
  let height = 0;
  let dpr = 1;
  let nodes = [];
  let rafId = null;

  function initNodes() {
    const area = width * height;
    const count = Math.max(22, Math.min(54, Math.floor(area / 26000)));
    const accentCount = Math.max(4, Math.floor(count * 0.2));

    nodes = Array.from({ length: count }, (_, i) => {
      const isAccent = i < accentCount;
      const speed = isAccent ? 0.16 : 0.12;
      const angle = Math.random() * Math.PI * 2;
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        r: isAccent ? 4.2 : 3.0,
        accent: isAccent,
      };
    });
  }

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    initNodes();
    drawFrame(false);
  }

  function drawFrame(animate) {
    ctx.clearRect(0, 0, width, height);

    const maxDist = Math.min(200, Math.max(125, Math.min(width, height) * 0.28));

    // Update positions
    if (animate) {
      for (const n of nodes) {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < -20) n.x = width + 20;
        if (n.x > width + 20) n.x = -20;
        if (n.y < -20) n.y = height + 20;
        if (n.y > height + 20) n.y = -20;
      }
    }

    // Draw mesh edges (#3d5070 from the card)
    ctx.lineWidth = 1.25;
    for (let i = 0; i < nodes.length; i++) {
      const a = nodes[i];
      for (let j = i + 1; j < nodes.length; j++) {
        const b = nodes[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const dist = Math.hypot(dx, dy);
        if (dist < maxDist) {
          const alpha = (1 - dist / maxDist) * 0.45;
          ctx.strokeStyle = `rgba(61, 80, 112, ${alpha.toFixed(3)})`;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }

    // Draw standard slate nodes (#1c2533 fill, #8aa0bd stroke)
    for (const n of nodes) {
      if (n.accent) continue;
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fillStyle = '#1c2533';
      ctx.fill();
      ctx.lineWidth = 1.4;
      ctx.strokeStyle = 'rgba(138, 160, 189, 0.7)';
      ctx.stroke();
    }

    // Draw glowing cyan accent nodes (#38bdf8)
    for (const n of nodes) {
      if (!n.accent) continue;
      ctx.save();
      ctx.shadowColor = 'rgba(56, 189, 248, 0.85)';
      ctx.shadowBlur = 12;
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fillStyle = '#38bdf8';
      ctx.fill();
      ctx.restore();

      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.lineWidth = 1.4;
      ctx.strokeStyle = '#0b1017';
      ctx.stroke();
    }

    if (animate) {
      rafId = requestAnimationFrame(() => drawFrame(true));
    }
  }

  resize();
  window.addEventListener('resize', () => {
    if (rafId) cancelAnimationFrame(rafId);
    resize();
    if (!prefersReducedMotion) {
      rafId = requestAnimationFrame(() => drawFrame(true));
    }
  });

  if (!prefersReducedMotion) {
    rafId = requestAnimationFrame(() => drawFrame(true));
  }
})();
