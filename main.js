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
const overlayR    = document.getElementById('glitch-r');
const overlayB    = document.getElementById('glitch-b');
const scanband    = document.getElementById('glitch-scanband');

let glitchOn = false;
let glitchInterval = null;
let scanInterval = null;

function randomBetween(a, b) {
  return a + Math.random() * (b - a);
}

function triggerGlitchFlash() {
  // Random chromatic shift on the overlays
  const shiftX = randomBetween(-8, 8);
  const shiftY = randomBetween(-3, 3);
  overlayR.style.transform = `translate(${shiftX}px, ${shiftY}px)`;
  overlayB.style.transform = `translate(${-shiftX * 0.6}px, ${shiftY * 0.4}px)`;
  overlayR.style.opacity = randomBetween(0.3, 0.7);
  overlayB.style.opacity = randomBetween(0.2, 0.6);

  // Snap back after a short flash
  const duration = randomBetween(40, 120);
  setTimeout(() => {
    overlayR.style.opacity = 0;
    overlayB.style.opacity = 0;
    overlayR.style.transform = 'translate(0,0)';
    overlayB.style.transform = 'translate(0,0)';
  }, duration);
}

function startScanband() {
  scanband.style.animation = 'none';
  scanband.style.top = '-40px';
  scanband.style.opacity = '0';

  scanInterval = setInterval(() => {
    scanband.style.transition = 'none';
    scanband.style.top = '-40px';
    scanband.style.opacity = randomBetween(0.3, 0.8);

    // Animate downward
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const duration = randomBetween(600, 1800);
        scanband.style.transition = `top ${duration}ms linear, opacity ${duration}ms linear`;
        scanband.style.top = '110vh';
        scanband.style.opacity = '0';
      });
    });
  }, randomBetween(800, 2200));
}

function startGlitch() {
  document.body.classList.add('glitching');
  glitchLabel.textContent = '[ 信号干扰 : ON ]';
  glitchBtn.classList.add('active');

  // Irregular glitch flashes
  function scheduleFlash() {
    if (!glitchOn) return;
    triggerGlitchFlash();
    glitchInterval = setTimeout(scheduleFlash, randomBetween(80, 600));
  }
  scheduleFlash();
  startScanband();
}

function stopGlitch() {
  document.body.classList.remove('glitching');
  glitchLabel.textContent = '[ 信号干扰 : OFF ]';
  glitchBtn.classList.remove('active');

  clearTimeout(glitchInterval);
  clearInterval(scanInterval);

  overlayR.style.opacity = 0;
  overlayB.style.opacity = 0;
  scanband.style.opacity = 0;
}

glitchBtn.addEventListener('click', () => {
  glitchOn = !glitchOn;
  glitchOn ? startGlitch() : stopGlitch();
});

