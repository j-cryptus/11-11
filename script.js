// ============================================================
// 0. HELPERS DE ENTORNO
// ============================================================
const isTouch  = matchMedia('(pointer: coarse)').matches;
const isMobile = () => window.innerWidth < 768;


// ============================================================
// 1. ESTRELLAS
// ============================================================
const starsContainer = document.getElementById('stars');
const totalStars = isMobile() ? 40 : 150;

if (starsContainer) {
  const colors = ['#ffffff', '#ffe9a8', '#cfe4ff'];
  const frag = document.createDocumentFragment();
  for (let i = 0; i < totalStars; i++) {
    const star  = document.createElement('div');
    const size  = Math.random() * 2 + 1;
    const color = colors[Math.floor(Math.random() * colors.length)];
    star.style.cssText = `
      position:absolute; left:${Math.random() * 100}%; top:${Math.random() * 100}%;
      width:${size}px; height:${size}px; background:${color}; border-radius:50%;
      ${isMobile() ? '' : `box-shadow:0 0 ${size * 3}px ${color};`}
      animation: twinkle ${2 + Math.random() * 4}s ease-in-out ${Math.random() * 5}s infinite alternate;
    `;
    frag.appendChild(star);
  }
  starsContainer.appendChild(frag);
}

function createShootingStar() {
  if (document.hidden) return;
  const sky  = document.getElementById('sky');
  const star = document.createElement('div');
  star.className = 'shooting-star';

  const depth    = Math.random();
  const duration = (1 - depth) * 2 + 1;         // 1 a 3 s
  const delay    = Math.random() * 2;
  const scale    = Math.random() * 0.8 + 0.3;

  star.style.left = `${Math.random() * window.innerWidth}px`;
  star.style.top  = `${Math.random() * window.innerHeight}px`;
  star.style.animationDuration = `${duration}s`;
  star.style.animationDelay    = `${delay}s`;
  star.style.setProperty('--scale', scale);

  sky.appendChild(star);
  setTimeout(() => star.remove(), (duration + delay) * 1000 + 100);
}
setInterval(createShootingStar, 8500);


// ============================================================
// 2. AUDIO (chispa tipo "tas tas")
// ============================================================
let audioCtx = null;

function initAudio() {
  if (!audioCtx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    audioCtx = new AC();
  }
  if (audioCtx.state === 'suspended') audioCtx.resume();
}

// iOS solo acepta como "gesto" el final del toque, no touchstart
['pointerup', 'touchend', 'click', 'keydown'].forEach(evt => {
  window.addEventListener(evt, initAudio, { passive: true });
});

let noiseBuffer = null;
function getNoiseBuffer() {
  if (noiseBuffer) return noiseBuffer;
  const length = Math.floor(audioCtx.sampleRate * 0.05);
  noiseBuffer = audioCtx.createBuffer(1, length, audioCtx.sampleRate);
  const data = noiseBuffer.getChannelData(0);
  for (let i = 0; i < length; i++) data[i] = Math.random() * 2 - 1;
  return noiseBuffer;
}

function playSpark(volume = 0.15) {
  if (!audioCtx || audioCtx.state !== 'running') return;
  const now = audioCtx.currentTime;

  const noise = audioCtx.createBufferSource();
  noise.buffer = getNoiseBuffer();

  const filter = audioCtx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.setValueAtTime(3000 + Math.random() * 2000, now);
  filter.Q.value = 8;

  const gain = audioCtx.createGain();
  gain.gain.setValueAtTime(0, now);
  gain.gain.linearRampToValueAtTime(volume, now + 0.001);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.04);

  noise.connect(filter).connect(gain).connect(audioCtx.destination);
  noise.start(now);
  noise.stop(now + 0.05);
}

// Tick suave para el hover en escritorio (antes no estaba definida)
function playTick(freq = 1000, volume = 0.03, duration = 0.03) {
  if (!audioCtx || audioCtx.state !== 'running') return;
  const now = audioCtx.currentTime;
  const osc  = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(volume, now);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
  osc.connect(gain).connect(audioCtx.destination);
  osc.start(now);
  osc.stop(now + duration + 0.01);
}

let lastDouble = 0;
function playTasTax() {
  if (!audioCtx) return;
  const now = performance.now();
  if (now - lastDouble < 60) return;
  lastDouble = now;
  playSpark(0.15);
  setTimeout(() => playSpark(0.12), 45);
}


// ============================================================
// 3. DATOS: RECUERDOS
// ============================================================
const memories = [
  { title: "La primera vez que nos reímos sin parar", text: "Fue ese día en la cafetería...", img: "img/im1.jpg", tag: "Risa eterna" },
  { title: "Nuestro viaje improvisado", text: "Sin planear nada...", img: "img/im2.jpeg", tag: "Aventura" },
  { title: "Cuando me escuchaste sin juzgar", text: "Ese día no necesitaba consejos...", img: "img/im3.jpg", tag: "Gracias" },
  { title: "Las 3 a.m. hablando de todo", text: "De la vida, del universo...", img: "img/im4.jpg", tag: "Madrugadas" },
  { title: "Tu cumpleaños sorpresa", text: "Cuando entraste y viste todo...", img: "img/im5.jpeg", tag: "Sorpresa" },
  { title: "Simplemente tú", text: "No hace falta una anécdota épica...", img: "img/im6.jpg", tag: "Presencia" },
  { title: "Simplemente tú", text: "No hace falta una anécdota épica...", img: "img/im7.jpeg", tag: "Presencia" },
  { title: "Simplemente tú", text: "No hace falta una anécdota épica...", img: "img/im8.webp", tag: "Presencia" },
  { title: "Simplemente tú", text: "No hace falta una anécdota épica...", img: "img/um9.png", tag: "Presencia" },
  { title: "Simplemente tú", text: "No hace falta una anécdota épica...", img: "img/im10.jpeg", tag: "Presencia" },
  { title: "Simplemente tú", text: "No hace falta una anécdota épica...", img: "img/im11.jpeg", tag: "Presencia" },
  { title: "Simplemente tú", text: "No hace falta una anécdota épica...", img: "img/im12.jpg", tag: "Presencia" }
];


// ============================================================
// 4. CREAR TULIPANES
// ============================================================
const garden = document.getElementById('garden');

const tulipPalettes = [
  ['#ff8ec7', '#d94a94', '#a8306f', '#4fae6d'],
  ['#ffd166', '#e8a020', '#b87a00', '#4fae6d'],
  ['#ff7b7b', '#c93b3b', '#9c2a2a', '#4fae6d'],
  ['#c89bff', '#8b5fd9', '#6033a8', '#4fae6d'],
  ['#fff1a8', '#f2c94c', '#c99a1c', '#4fae6d'],
  ['#ffb3e6', '#e05fb0', '#a83a80', '#4fae6d']
];

// Tamaño de flor en px (el CSS lo lee con --w / --h)
function flowerSize() {
  const w = window.innerWidth > 768 ? 160 : window.innerWidth > 420 ? 90 : 70;
  return { w, h: Math.round(w * 160 / 90) };
}

// Posiciones en PÍXELES, dentro de la pantalla y sin solaparse
function generatePositions(count, fw, fh) {
  const W = window.innerWidth, H = window.innerHeight;
  const margin = 12;
  const out = [];
  for (const factor of [1.1, 0.9, 0.7, 0.5]) {
    out.length = 0;
    const minDist = fw * factor;
    let tries = 0;
    while (out.length < count && tries++ < 1500) {
      const x = margin + Math.random() * Math.max(1, W - fw - margin * 2);
      const y = H * 0.08 + Math.random() * Math.max(1, H * 0.84 - fh);
      if (out.every(p => Math.hypot(p.x - x, p.y - y) > minDist)) out.push({ x, y });
    }
    if (out.length >= count) break;
  }
  return out;
}

// El id lleva el índice (un "#" dentro de un id rompe Safari/iOS)
function createTulipSVG([c1, c2, c3, stem], id) {
  return `
    <svg viewBox="0 0 90 160" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="petal-${id}" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stop-color="${c1}"/>
          <stop offset="60%"  stop-color="${c2}"/>
          <stop offset="100%" stop-color="${c3}"/>
        </linearGradient>
        <radialGradient id="shine-${id}" cx="0.4" cy="0.3" r="0.6">
          <stop offset="0%"   stop-color="#ffffff" stop-opacity="0.55"/>
          <stop offset="100%" stop-color="#ffffff" stop-opacity="0"/>
        </radialGradient>
        <linearGradient id="stem-${id}" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%"   stop-color="${stem}"/>
          <stop offset="50%"  stop-color="#2f8a52"/>
          <stop offset="100%" stop-color="${stem}"/>
        </linearGradient>
      </defs>

      <path d="M45 155 Q42 110 45 75 Q47 55 45 40" stroke="url(#stem-${id})" stroke-width="5" fill="none" stroke-linecap="round"/>

      <path d="M45 120 Q18 100 22 70 Q38 80 45 110 Z" fill="${stem}" opacity="0.9"/>
      <path d="M45 120 Q18 100 22 70" stroke="#2f8a52" stroke-width="1" fill="none" opacity="0.5"/>

      <path d="M45 130 Q72 108 68 78 Q52 88 45 118 Z" fill="${stem}" opacity="0.9"/>
      <path d="M45 130 Q72 108 68 78" stroke="#2f8a52" stroke-width="1" fill="none" opacity="0.5"/>

      <path d="M45 20 Q25 20 22 45 Q22 68 45 70 Q68 68 68 45 Q65 20 45 20 Z" fill="${c3}" opacity="0.95"/>
      <path d="M45 15 Q30 18 27 45 Q27 70 45 72 Q63 70 63 45 Q60 18 45 15 Z" fill="url(#petal-${id})"/>
      <path d="M45 18 Q18 22 15 50 Q17 72 45 70 Q35 55 38 38 Q40 25 45 18 Z" fill="${c2}" opacity="0.95"/>
      <path d="M45 18 Q72 22 75 50 Q73 72 45 70 Q55 55 52 38 Q50 25 45 18 Z" fill="${c2}" opacity="0.95"/>
      <path d="M45 18 Q30 20 27 45 Q30 40 45 30 Q60 40 63 45 Q60 20 45 18 Z" fill="url(#shine-${id})"/>
    </svg>
  `;
}

function buildGarden() {
  garden.innerHTML = '';
  const { w, h } = flowerSize();
  const positions = generatePositions(memories.length, w, h);

  memories.forEach((mem, i) => {
    const pos = positions[i];
    if (!pos) return;                              // si no cabe, se omite

    const tulip = document.createElement('div');
    tulip.className = 'tulip';
    tulip.dataset.index = i;
    tulip.setAttribute('role', 'button');
    tulip.tabIndex = 0;
    tulip.setAttribute('aria-label', 'Abrir recuerdo: ' + mem.title);

    const scale = 0.75 + (pos.y / window.innerHeight) * 0.6;   // parallax por altura
    const z = (Math.random() - 0.5) * 300;

    tulip.style.left = pos.x + 'px';
    tulip.style.top  = pos.y + 'px';
    tulip.style.setProperty('--w', w + 'px');
    tulip.style.setProperty('--h', h + 'px');
    tulip.style.setProperty('--z', z + 'px');
    tulip.style.setProperty('--s', scale);
    tulip.style.zIndex = 10 + Math.round(z / 10);

    tulip.innerHTML =
      `<div class="tulip-inner" style="animation-delay:${(Math.random() * 5).toFixed(2)}s">` +
      createTulipSVG(tulipPalettes[i % tulipPalettes.length], i) +
      `</div>`;

    garden.appendChild(tulip);
  });
}

buildGarden();

// Reconstruir al girar el teléfono / cambiar el ancho (no por la barra del navegador)
let lastW = window.innerWidth;
let resizeTimer = null;
function onViewportChange() {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    if (window.innerWidth !== lastW) {
      lastW = window.innerWidth;
      buildGarden();
    }
  }, 250);
}
window.addEventListener('resize', onViewportChange);
window.addEventListener('orientationchange', onViewportChange);


// ============================================================
// 5. TOQUE EN LA FLOR (delegado en el jardín)
// ============================================================
// Se detecta un "toque corto": poco movimiento y poco tiempo.
// Así arrastrar para rotar el jardín no abre recuerdos por error.
// ============================================================
// 5. TOQUE EN LA FLOR (hit-test manual por profundidad)
// ============================================================

// Devuelve el tulipán con MAYOR Z (más cercano a la cámara) cuya
// proyección 2D contiene el punto (x, y). Null si ninguno.
function findTulipAt(x, y) {
  const tulips = garden.querySelectorAll('.tulip');
  let best = null;
  let bestZ = -Infinity;

  tulips.forEach(el => {
    const rect = el.getBoundingClientRect();
    // Área efectiva del tulipán (incluye un poco de margen táctil)
    const pad = isTouch ? 20 : 8;
    const inside =
      x >= rect.left - pad && x <= rect.right + pad &&
      y >= rect.top  - pad && y <= rect.bottom + pad;

    if (!inside) return;

    // La Z que guardamos al construir el jardín
    const z = parseFloat(el.style.getPropertyValue('--z')) || 0;

    // Si hay empate en Z, gana el que esté más abajo (más cerca visual)
    if (z > bestZ) {
      bestZ = z;
      best = el;
    }
  });

  return best;
}

let tapStart = null;

garden.addEventListener('pointerdown', (e) => {
  if (isCardOpen()) return;

  const el = findTulipAt(e.clientX, e.clientY);
  tapStart = el
    ? { el, x: e.clientX, y: e.clientY, t: performance.now(), id: e.pointerId }
    : null;
});

garden.addEventListener('pointerup', (e) => {
  if (!tapStart) return;
  if (e.pointerId !== tapStart.id) { tapStart = null; return; }

  const { el, x, y, t } = tapStart;
  tapStart = null;

  const moved   = Math.hypot(e.clientX - x, e.clientY - y);
  const elapsed = performance.now() - t;

  if (moved < 20 && elapsed < 800) {
    openCard(memories[el.dataset.index], e, el);
  }
});

garden.addEventListener('pointercancel', () => { tapStart = null; });

// Teclado
garden.addEventListener('keydown', (e) => {
  if (e.key !== 'Enter' && e.key !== ' ') return;
  const el = e.target.closest('.tulip');
  if (!el) return;
  e.preventDefault();
  const r = el.getBoundingClientRect();
  openCard(memories[el.dataset.index],
           { clientX: r.left + r.width / 2, clientY: r.top + r.height / 2 },
           el);
});

// ============================================================
// 6. TARJETA (overlay)
// ============================================================
const overlay   = document.getElementById('cardOverlay');
const cardImg   = document.getElementById('cardImg');
const cardTitle = document.getElementById('cardTitle');
const cardText  = document.getElementById('cardText');
const cardTag   = document.getElementById('cardTag');
const closeBtn  = document.getElementById('closeBtn');

let openedAt = 0;
let lastFocus = null;
const isCardOpen = () => overlay.classList.contains('active');

function openCard(mem, event, tulip) {
  openedAt = performance.now();
  lastFocus = document.activeElement;

  cardImg.onerror = () => {
    cardImg.onerror = null;                       // evita bucle infinito sin internet
    cardImg.src = "https://placehold.co/440x440/2b1a4a/ffd6ff?text=Recuerdo";
  };
  cardImg.src = mem.img;
  cardImg.alt = mem.title;

  cardTitle.textContent = mem.title;
  cardText.textContent  = mem.text;
  cardTag.textContent   = mem.tag;
  document.querySelector('.card-content').scrollTop = 0;

  overlay.classList.add('active');
  overlay.setAttribute('aria-hidden', 'false');

  burstParticles(event.clientX, event.clientY);

  // Inclinar el jardín hacia la flor tocada
  if (tulip) {
    const rect = tulip.getBoundingClientRect();
    const cx = window.innerWidth / 2, cy = window.innerHeight / 2;
    targetRotY = -((rect.left + rect.width  / 2 - cx) / cx) * 20;
    targetRotX =  ((rect.top  + rect.height / 2 - cy) / cy) * 10;
  }
  closeBtn.focus({ preventScroll: true });
}

function closeCard() {
  overlay.classList.remove('active');
  overlay.setAttribute('aria-hidden', 'true');
  targetRotX = 0;
  targetRotY = 0;
  if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
}

closeBtn.addEventListener('click', closeCard);
overlay.addEventListener('click', (e) => {
  // Ignora el click "fantasma" que llega justo al levantar el dedo tras abrir
  if (e.target === overlay && performance.now() - openedAt > 350) closeCard();
});
document.addEventListener('keydown', (e) => {
  if (e.key !== 'Escape') return;
  if (viewer.classList.contains('active')) closeViewer();
  else closeCard();
});

// Ver la imagen completa a pantalla completa (tocar la imagen)
const viewer      = document.getElementById('imgViewer');
const viewerImg   = document.getElementById('viewerImg');
const viewerClose = document.getElementById('viewerClose');

function openViewer() {
  viewerImg.src = cardImg.src;
  viewerImg.alt = cardImg.alt;
  viewer.classList.add('active');
  viewer.setAttribute('aria-hidden', 'false');
}
function closeViewer() {
  viewer.classList.remove('active');
  viewer.setAttribute('aria-hidden', 'true');
}
cardImg.addEventListener('click', openViewer);
viewer.addEventListener('click', closeViewer);
viewerClose.addEventListener('click', (e) => { e.stopPropagation(); closeViewer(); });


// ============================================================
// 7. PARTÍCULAS (Canvas)
// ============================================================
const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');
let particles = [];
const glow = isTouch ? 0 : 10;                    // shadowBlur es muy caro en móvil

function resize() {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width  = window.innerWidth  * dpr;
  canvas.height = window.innerHeight * dpr;
  canvas.style.width  = window.innerWidth  + 'px';
  canvas.style.height = window.innerHeight + 'px';
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}
resize();
window.addEventListener('resize', resize);

class Particle {
  constructor(x, y) {
    this.x = x; this.y = y;
    const angle = Math.random() * Math.PI * 2;
    const speed = 1 + Math.random() * 3;
    this.vx = Math.cos(angle) * speed;
    this.vy = Math.sin(angle) * speed - 1;
    this.life = 1;
    this.size = 2 + Math.random() * 3;
    this.color = `hsl(${300 + Math.random() * 60}, 100%, ${70 + Math.random() * 20}%)`;
  }
  update() {
    this.x += this.vx; this.y += this.vy;
    this.vy += 0.06;
    this.vx *= 0.98;
    this.life -= 0.015;
    this.size *= 0.99;
  }
  draw() {
    ctx.globalAlpha = Math.max(this.life, 0);
    ctx.fillStyle = this.color;
    if (glow) { ctx.shadowColor = this.color; ctx.shadowBlur = glow; }
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

function burstParticles(x, y, amount = isMobile() ? 12 : 25) {
  for (let i = 0; i < amount; i++) particles.push(new Particle(x, y));
  if (particles.length > 200) particles.splice(0, particles.length - 200);
  playTasTax();
}

// Hover (solo escritorio)
let lastTrail = 0, lastTick = 0;
window.addEventListener('mousemove', (e) => {
  if (isTouch) return;
  const now = performance.now();
  if (now - lastTrail > 60) {
    lastTrail = now;
    particles.push(new Particle(e.clientX, e.clientY));
    if (now - lastTick > 120) {
      lastTick = now;
      playTick(1000 + Math.random() * 300, 0.03, 0.03);
    }
  }
});

// Estela al deslizar el dedo (móvil)
let lastTouchTrail = 0, lastTouchTick = 0;
function handleTouchTrail(e) {
  if (isCardOpen()) return;
  const t = e.touches[0];
  if (!t) return;
  const now = performance.now();
  if (now - lastTouchTrail < 50) return;
  lastTouchTrail = now;
  particles.push(new Particle(t.clientX, t.clientY));
  if (now - lastTouchTick > 100) {
    lastTouchTick = now;
    playSpark(0.08);
  }
}
window.addEventListener('touchstart', handleTouchTrail, { passive: true });
window.addEventListener('touchmove',  handleTouchTrail, { passive: true });


// ============================================================
// 8. ROTACIÓN 3D DEL JARDÍN
// ============================================================
let targetRotX = 0, targetRotY = 0;
let currentRotX = 0, currentRotY = 0;

// Mouse (escritorio)
window.addEventListener('mousemove', (e) => {
  if (isTouch || isCardOpen()) return;
  const cx = window.innerWidth / 2, cy = window.innerHeight / 2;
  targetRotY =  ((e.clientX - cx) / cx) * 25;
  targetRotX = -((e.clientY - cy) / cy) * 12;
});

// Touch (móvil): arrastrar el dedo
let touchStart = null;
window.addEventListener('touchstart', (e) => {
  if (isCardOpen()) return;
  touchStart = { x: e.touches[0].clientX, y: e.touches[0].clientY };
}, { passive: true });

window.addEventListener('touchmove', (e) => {
  if (!touchStart || isCardOpen()) return;
  const dx = (e.touches[0].clientX - touchStart.x) / window.innerWidth;
  const dy = (e.touches[0].clientY - touchStart.y) / window.innerHeight;
  targetRotY =  dx * 60;
  targetRotX = -dy * 30;
}, { passive: true });

window.addEventListener('touchend', () => {
  touchStart = null;
  if (isCardOpen()) return;                       // conserva la inclinación hacia la flor
  targetRotX = 0;
  targetRotY = 0;
});

// Auto-rotación suave cuando el usuario no interactúa
let autoAngle = 0;
function autoRotate() {
  if (isCardOpen()) return;
  if (Math.abs(targetRotY) < 0.5 && Math.abs(targetRotX) < 0.5) {
    autoAngle += 0.02;
    targetRotY = Math.sin(autoAngle) * 5;
  }
}

function updateGardenRotation() {
  currentRotX += (targetRotX - currentRotX) * 0.08;
  currentRotY += (targetRotY - currentRotY) * 0.08;
  garden.style.transform = `rotateX(${currentRotX}deg) rotateY(${currentRotY}deg)`;
}


// ============================================================
// 9. LOOP PRINCIPAL
// ============================================================
function animate() {
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
  particles = particles.filter(p => p.life > 0);
  particles.forEach(p => { p.update(); p.draw(); });
  ctx.globalAlpha = 1;
  ctx.shadowBlur = 0;

  autoRotate();
  updateGardenRotation();
  requestAnimationFrame(animate);
}
animate();
