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
  { title: "Si el plan no funciona, cambia el plan pero no cambies la meta.", /*text: "Sin planear nada...",*/ img: "img/IMG-1.jpg"/*, tag: "Aventura" */},
  { title: "El éxito en la vida no se lo mide por lo que logras, sino por los obstáculos que superas",/* text: "Sin planear nada...",*/ img: "img/IMG-2.jpg"/*, tag: "Aventura" */},
  { title: "No todas las tormentas vienen a perturbar tu vida, algunas llegan a despejar tu camino",/* text: "Ese día no necesitaba consejos...",*/ img: "img/IMG-3.jpg"/*, tag: "Gracias"*/ },
  { title: "No vayas a donde te lleve el camino, ve a donde no hay camino y deja un sendero",/* text: "De la vida, del universo...",*/ img: "img/IMG-4.jpg"/*, tag: "Madrugadas"*/ },
  { title: "Si el barco de tu vida se está hundiendo, lo vuelves submarino, pero usted no se me rinda",/* text: "Cuando entraste y viste todo...",*/ img: "img/IMG-5.jpg"/*, tag: "Sorpresa"*/ },
  { title: "No sé ni como ni cuándo ni dónde, pero si va a ser, será en su momento, y será hermoso.",/* text: "No hace falta una anécdota épica...",*/ img: "img/IMG-6.jpg"/*, tag: "Presencia"*/ },
  { title: "La vida no se trata de llegar a la meta, sino de disfrutar cada paso del camino.",/* text: "No hace falta una anécdota épica...",*/ img: "img/IMG-7.jpg"/*, tag: "Presencia" */},
  { title: "Los sueños empiezan siendo pequeños pero pueden crecer contigo.",/* text: "No hace falta una anécdota épica...",*/ img: "img/IMG-8.jpg"/*, tag: "Presencia"*/ },
  { title: "El futuro pertenece a aquellos que creen en la belleza de sus sueños",/* text: "No hace falta una anécdota épica...",*/ img: "img/IMG-9.jpg"/*, tag: "Presencia" */},
  { title: "La sonrisa es la vitamina del alma, ¡Sonríe!",/* text: "No hace falta una anécdota épica...",*/ img: "img/IMG-10.jpg"/*, tag: "Presencia"*/ },
  { title: "Eres Valiente, eres Fuerte, eres Capaz",/* text: "No hace falta una anécdota épica...",*/ img: "img/IMG-11.jpg"/*, tag: "Presencia" */},
  { title: "Sé que lo estás intentando, sé que te esfuerzas y aunque a veces parezca difícil no te rindes, sigue así, confía en tí, ¡Tú puedes!",/* text: "No hace falta una anécdota épica...",*/ img: "img/IMG-12.jpg"/*, tag: "Presencia"*/ }
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
// ============================================================
// 10. EFECTO MÁQUINA DE ESCRIBIR EN EL FOOTER
// ============================================================
(function typeFooter() {
  const el = document.querySelector('.footer-note p');
  if (!el) return;

  const fullHTML = el.innerHTML;   // conserva el <span class="accent">
  const plainText = el.textContent;
  el.textContent = '';
  el.style.visibility = 'visible';

  let i = 0;
  function step() {
    i++;
    el.textContent = plainText.slice(0, i);
    if (i < plainText.length) setTimeout(step, 40);
  }
  setTimeout(step, 800);
})();

// ============================================================
// 10. LUNA INTERACTIVA (se abre al haber visto todos los recuerdos)
// ============================================================

const moonBtn     = document.getElementById('moon');
const moonLock    = document.getElementById('moonLock');
const moonOverlay = document.getElementById('moonOverlay');
const moonClose   = document.getElementById('moonClose');
const moonCanvas  = document.getElementById('moonFireworks');

// Cuántas flores hay que ver para desbloquear (todas)
const totalMemories = memories.length;
const seenMemories  = new Set();

// Guardamos el HTML original del candado para actualizarlo
function updateMoonLock() {
  if (!moonLock) return;
  const remaining = totalMemories - seenMemories.size;
  moonLock.textContent = remaining > 0
    ? `🌷 ${seenMemories.size}/${totalMemories}`
    : '✨';
  if (seenMemories.size >= totalMemories) unlockMoon();
}

// Marca la luna como desbloqueada
let moonUnlocked = false;
function unlockMoon() {
  if (moonUnlocked) return;
  moonUnlocked = true;
  moonBtn.classList.remove('locked');
  moonBtn.classList.add('unlocked');
  moonBtn.setAttribute('aria-label', 'Abrir mensaje especial de la luna');
  // pequeño destello al desbloquear
  burstParticles(
    moonBtn.getBoundingClientRect().left + moonBtn.offsetWidth / 2,
    moonBtn.getBoundingClientRect().top  + moonBtn.offsetHeight / 2,
    30
  );
}

// Estado inicial bloqueado
moonBtn.classList.add('locked');
updateMoonLock();

// Escuchar cada vez que se abre una tarjeta
// (enganchamos al final de openCard sin romper lo existente)
const _openCardOriginal = openCard;
openCard = function (mem, event, tulip) {
  _openCardOriginal.call(this, mem, event, tulip);
  const idx = memories.indexOf(mem);
  if (idx >= 0 && !seenMemories.has(idx)) {
    seenMemories.add(idx);
    updateMoonLock();
  }
};

// ============================================================
// 10b. CORAZÓN DE FUEGOS ARTIFICIALES
// ============================================================

const fwCtx = moonCanvas.getContext('2d');
let fwParticles = [];
let fwRafId = null;

function resizeFireworks() {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  moonCanvas.width  = window.innerWidth  * dpr;
  moonCanvas.height = window.innerHeight * dpr;
  moonCanvas.style.width  = window.innerWidth  + 'px';
  moonCanvas.style.height = window.innerHeight + 'px';
  fwCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
}
window.addEventListener('resize', resizeFireworks);

// Colores del corazón (azules y rosados, muy romántico)
const heartColors = ['#66d9ff', '#9ad0ff', '#ff9ee5', '#ff6ec7', '#c86dd7', '#ffffff'];

// Fórmula paramétrica del corazón
// x = 16 sin³(t) ; y = 13cos(t) - 5cos(2t) - 2cos(3t) - cos(4t)
function heartPoint(t) {
  return {
    x: 16 * Math.pow(Math.sin(t), 3),
    y: -(13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t))
  };
}

class FireworkParticle {
  constructor(x, y, vx, vy, color, life = 1) {
    this.x = x; this.y = y;
    this.vx = vx; this.vy = vy;
    this.color = color;
    this.life = life;
    this.decay = 0.008 + Math.random() * 0.012;
    this.size = 1.5 + Math.random() * 2.5;
    this.trail = [];
  }
  update() {
    this.trail.push({ x: this.x, y: this.y });
    if (this.trail.length > 6) this.trail.shift();
    this.x += this.vx;
    this.y += this.vy;
    this.vx *= 0.985;
    this.vy *= 0.985;
    this.vy += 0.03;          // gravedad suave
    this.life -= this.decay;
  }
  draw(ctx) {
    const a = Math.max(0, this.life);
    // estela
    for (let i = 0; i < this.trail.length; i++) {
      const t = this.trail[i];
      const ta = (i / this.trail.length) * a * 0.4;
      ctx.globalAlpha = ta;
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(t.x, t.y, this.size * (i / this.trail.length) * 0.7, 0, Math.PI * 2);
      ctx.fill();
    }
    // núcleo
    ctx.globalAlpha = a;
    ctx.fillStyle = this.color;
    ctx.shadowColor = this.color;
    ctx.shadowBlur = 12;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
  }
}

// Genera un corazón de fuegos artificiales en el centro
function launchHeartFireworks() {
  const cx = window.innerWidth / 2;
  const cy = window.innerHeight / 2;
  const scale = Math.min(window.innerWidth, window.innerHeight) / 40;

  // Contorno del corazón (muchos puntos)
  const points = 120;
  for (let i = 0; i < points; i++) {
    const t = (i / points) * Math.PI * 2;
    const p = heartPoint(t);
    const px = cx + p.x * scale;
    const py = cy + p.y * scale;

    // Varias partículas por punto del contorno
    const count = 3;
    for (let k = 0; k < count; k++) {
      const angle = Math.atan2(py - cy, px - cx) + (Math.random() - 0.5) * 0.5;
      const speed = 0.3 + Math.random() * 1.2;
      fwParticles.push(new FireworkParticle(
        cx + (Math.random() - 0.5) * 30,
        cy + (Math.random() - 0.5) * 30,
        Math.cos(angle) * speed + (px - cx) * 0.008,
        Math.sin(angle) * speed + (py - cy) * 0.008,
        heartColors[Math.floor(Math.random() * heartColors.length)]
      ));
    }
  }

  // Relleno suave del corazón
  for (let i = 0; i < 80; i++) {
    const t = Math.random() * Math.PI * 2;
    const r = Math.sqrt(Math.random());
    const p = heartPoint(t);
    const px = cx + p.x * scale * r;
    const py = cy + p.y * scale * r;
    fwParticles.push(new FireworkParticle(
      px, py,
      (Math.random() - 0.5) * 0.6,
      (Math.random() - 0.5) * 0.6 - 0.3,
      heartColors[Math.floor(Math.random() * heartColors.length)]
    ));
  }

  // Chispas radiales extra
  for (let i = 0; i < 50; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 2 + Math.random() * 3;
    fwParticles.push(new FireworkParticle(
      cx, cy,
      Math.cos(angle) * speed,
      Math.sin(angle) * speed,
      '#ffffff',
      0.8
    ));
  }
}

// Loop de dibujo del canvas de fuegos
function animateFireworks() {
  fwCtx.clearRect(0, 0, window.innerWidth, window.innerHeight);
  fwParticles = fwParticles.filter(p => p.life > 0);
  fwParticles.forEach(p => { p.update(); p.draw(fwCtx); });
  fwCtx.globalAlpha = 1;
  fwRafId = requestAnimationFrame(animateFireworks);
}

// ============================================================
// 10c. ABRIR / CERRAR EL MENSAJE DE LA LUNA
// ============================================================

let moonRepeatId = null;

function openMoonMessage() {
  // Bloqueada: sacudida + chispitas
  if (!moonUnlocked) {
    const r = moonBtn.getBoundingClientRect();
    burstParticles(r.left + r.width / 2, r.top + r.height / 2, 6);
    moonBtn.animate(
      [{ transform: 'translateX(0)' },
       { transform: 'translateX(-6px)' },
       { transform: 'translateX(6px)' },
       { transform: 'translateX(0)' }],
      { duration: 300, easing: 'ease-in-out' }
    );
    return;
  }

  if (!fwRafId) {
    resizeFireworks();
    animateFireworks();
  }

  moonOverlay.classList.add('active');
  moonOverlay.setAttribute('aria-hidden', 'false');

  fwParticles = [];
  launchHeartFireworks();

  // Un solo intervalo a la vez (evita acumularlos al abrir/cerrar rápido)
  clearInterval(moonRepeatId);
  moonRepeatId = setInterval(() => {
    if (!moonOverlay.classList.contains('active')) {
      clearInterval(moonRepeatId);
      return;
    }
    launchHeartFireworks();
  }, 1800);

  playTasTax();
}

function closeMoonMessage() {
  moonOverlay.classList.remove('active');
  moonOverlay.setAttribute('aria-hidden', 'true');
  clearInterval(moonRepeatId);

  // Deja de respirar al cerrar
  moonBtn.classList.add('calm');

  setTimeout(() => {
    if (!moonOverlay.classList.contains('active') && fwRafId) {
      cancelAnimationFrame(fwRafId);
      fwRafId = null;
      fwParticles = [];
      fwCtx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    }
  }, 700);
}

// Eventos
moonBtn.addEventListener('click', openMoonMessage);
moonClose.addEventListener('click', closeMoonMessage);
moonOverlay.addEventListener('click', (e) => {
  if (e.target === moonOverlay) closeMoonMessage();
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && moonOverlay.classList.contains('active')) {
    closeMoonMessage();
  }
});






