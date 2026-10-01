/* 
 * Lightweight High-Performance Canvas Confetti & Particle Engine
 * Optimized for Mobile Devices
 */

window.ConfettiEngine = (function() {
  const canvas = document.createElement('canvas');
  canvas.id = 'confetti-overlay-canvas';
  canvas.style.position = 'fixed';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100vw';
  canvas.style.height = '100vh';
  canvas.style.pointerEvents = 'none';
  canvas.style.zIndex = '99999';
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  let particles = [];
  let animationId = null;

  const COLORS = [
    '#ff5e8e', '#ff8da1', '#ffbd59', '#795294', 
    '#ffd700', '#ff9a9e', '#fecfef', '#a1c4fd', '#c2e9fb'
  ];

  class Particle {
    constructor(x, y, type = 'confetti') {
      this.x = x !== undefined ? x : Math.random() * width;
      this.y = y !== undefined ? y : Math.random() * height - height;
      this.type = type; // 'confetti', 'heart', 'sparkle'
      this.size = type === 'heart' ? Math.random() * 12 + 10 : Math.random() * 8 + 4;
      this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
      this.vx = (Math.random() - 0.5) * (type === 'burst' ? 12 : 4);
      this.vy = type === 'burst' ? (Math.random() - 0.7) * 14 : Math.random() * 3 + 2;
      this.rotation = Math.random() * 360;
      this.rotationSpeed = (Math.random() - 0.5) * 10;
      this.opacity = 1;
      this.gravity = type === 'burst' ? 0.25 : 0.08;
      this.friction = 0.98;
      this.decay = Math.random() * 0.015 + 0.005;
    }

    update() {
      this.vx *= this.friction;
      this.vy += this.gravity;
      this.x += this.vx;
      this.y += this.vy;
      this.rotation += this.rotationSpeed;
      if (this.type === 'burst' || this.type === 'heart') {
        this.opacity -= this.decay;
      }
    }

    draw(ctx) {
      if (this.opacity <= 0) return;
      ctx.save();
      ctx.globalAlpha = Math.max(0, this.opacity);
      ctx.translate(this.x, this.y);
      ctx.rotate((this.rotation * Math.PI) / 180);

      if (this.type === 'heart') {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        const d = this.size;
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(-d / 2, -d / 2, -d, d / 3, 0, d);
        ctx.bezierCurveTo(d, d / 3, d / 2, -d / 2, 0, 0);
        ctx.fill();
      } else if (this.type === 'sparkle') {
        ctx.fillStyle = '#fff7d6';
        ctx.beginPath();
        ctx.arc(0, 0, this.size / 2, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.fillStyle = this.color;
        ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size * 1.5);
      }

      ctx.restore();
    }
  }

  function render() {
    ctx.clearRect(0, 0, width, height);

    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.update();
      p.draw(ctx);

      if (p.opacity <= 0 || p.y > height + 50) {
        particles.splice(i, 1);
      }
    }

    if (particles.length > 0) {
      animationId = requestAnimationFrame(render);
    } else {
      animationId = null;
    }
  }

  function startAnimation() {
    if (!animationId) {
      animationId = requestAnimationFrame(render);
    }
  }

  return {
    burst: function(originX = width / 2, originY = height / 2, count = 70) {
      for (let i = 0; i < count; i++) {
        const type = Math.random() > 0.4 ? 'burst' : (Math.random() > 0.5 ? 'heart' : 'sparkle');
        const p = new Particle(originX, originY, type);
        particles.push(p);
      }
      startAnimation();
    },
    rain: function(durationMs = 3000) {
      const interval = setInterval(() => {
        for (let i = 0; i < 5; i++) {
          particles.push(new Particle(Math.random() * width, -20, 'confetti'));
          if (Math.random() > 0.6) {
            particles.push(new Particle(Math.random() * width, -20, 'heart'));
          }
        }
        startAnimation();
      }, 100);

      setTimeout(() => clearInterval(interval), durationMs);
    }
  };
})();
