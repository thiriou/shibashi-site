// Fake visitor counter
const base = 4871 + Math.floor(Math.random() * 200);
document.getElementById('vcounter').textContent = String(base).padStart(6, '0');

// Subtle water ripple on mousemove
document.body.addEventListener('mousemove', (e) => {
  const x = (e.clientX / window.innerWidth) * 2 - 1;
  const y = (e.clientY / window.innerHeight) * 2 - 1;
  document.body.style.backgroundPosition = `
    ${200 + x * 15}px ${200 + y * 15}px,
    ${x * 3}px ${y * 3}px,
    ${x * 8}px ${y * 8}px
  `;
});

// ============ SIGNAL GLITCH TOGGLE ============
const glitchBtn   = document.getElementById('glitch-btn');
const glitchLabel = glitchBtn.querySelector('.glitch-btn-label');
const canvas      = document.getElementById('snow-canvas');
const ctx         = canvas.getContext('2d');

let glitchOn = false;
let animFrame = null;

function resizeCanvas() {
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

function drawSnow() {
  if (!glitchOn) return;

  const w = canvas.width;
  const h = canvas.height;
  const imageData = ctx.createImageData(w, h);
  const data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    const v = Math.random() > 0.5 ? Math.floor(Math.random() * 255) : 0;
    data[i]     = v;
    data[i + 1] = v;
    data[i + 2] = v;
    data[i + 3] = Math.random() > 0.6 ? Math.floor(Math.random() * 180) : 0;
  }

  ctx.putImageData(imageData, 0, 0);
  animFrame = requestAnimationFrame(drawSnow);
}

function startGlitch() {
  document.documentElement.classList.add('glitching');
  canvas.classList.add('visible');
  glitchLabel.textContent = '[ 信号干扰 : ON ]';
  glitchBtn.classList.add('active');
  drawSnow();
}

function stopGlitch() {
  document.documentElement.classList.remove('glitching');
  canvas.classList.remove('visible');
  glitchLabel.textContent = '[ 信号干扰 : OFF ]';
  glitchBtn.classList.remove('active');
  cancelAnimationFrame(animFrame);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

glitchBtn.addEventListener('click', () => {
  glitchOn = !glitchOn;
  glitchOn ? startGlitch() : stopGlitch();
});

