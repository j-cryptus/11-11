// ============================================================
// 0. HELPERS DE ENTORNO
// ============================================================
const isTouch  = matchMedia('(hover: none)').matches;
const isMobile = window.innerWidth < 768;


// ============================================================
// 1. ESTRELLAS ALEATORIAS
// ============================================================
const starsContainer = document.getElementById('stars');
const totalStars = isMobile ? 90 : 150;

// Limpiamos el fondo CSS por si acaso, y generamos estrellas con JS
if (starsContainer) {
  // (Dejamos el background-image del CSS como capa base, no lo borramos)
  for (let i = 0; i < totalStars; i++) {
    const star = document.createElement('div');
    star.className = 'star';

    const size     = Math.random() * 2 + 1;
    const x        = Math.random() * 100;
    const y        = Math.random() * 100;
    const duration = 2 + Math.random() * 4;
    const delay    = Math.random() * 5;
    const colors   = ['#ffffff', '#ffe9a8', '#cfe4ff'];
    const color    = colors[Math.floor(Math.random() * colors.length)];

    star.style.cssText = `
      position: absolute;
      left: ${x}%;
      top: ${y}%;
      width: ${size}px;
      height: ${size}px;
      background: ${color};
      border-radius: 50%;
      box-shadow: 0 0 ${size * 3}px ${color};
      animation: twinkle ${duration}s ease-in-out ${delay}s infinite alternate;
    `;

    starsContainer.appendChild(star);
  }

  // Estrella fugaz cada 8s
}
function createShootingStar() {
    const sky = document.getElementById('sky');
    const star = document.createElement('div');
    star.classList.add('shooting-star');

    // 1. Nacimiento libre: Cubre el 100% del ancho y alto de la ventana de forma aleatoria
    const startX = Math.random() * window.innerWidth;
    const startY = Math.random() * window.innerHeight; 

    star.style.left = `${startX}px`;
    star.style.top = `${startY}px`;

    // 2. Variedad en el tamaño y velocidad para dar efecto de profundidad (3D)
    const depth = Math.random();
    const duration = (1-depth) * 2 + 1; // Entre 1 y 3 segundos
    const delay = Math.random() * 2;        // Retraso aleatorio para escalonar salidas
    const scale = Math.random() * 0.8 + 0.3; // Escala entre 0.5x (lejos) y 1.1x (cerca)
    const opacity = depth*.6+.4;
    star.style.animationDuration = `${duration}s`;
    star.style.animationDelay = `${delay}s`;
    star.style.opacity = opacity;
    star.style.setProperty('--scale', scale);
    
    // Aplicamos una escala aleatoria inicial sin romper la rotación del CSS
    star.style.transform = `rotate(-30deg) scale(${scale})`;

    sky.appendChild(star);

    // Limpieza del DOM cuando termine la animación
    setTimeout(() => {
        star.remove();
    }, (duration + delay) * 1000);
}

// Genera estrellas continuamente en intervalos cortos
setInterval(createShootingStar, 8500);



// ============================================================
// 2. AUDIO "TAS TAX"
// ============================================================
// ============================================================
// AUDIO: chispa tipo taser / soldadura
// ============================================================
let audioCtx = null;

function initAudio() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') audioCtx.resume();
}

['click', 'touchstart', 'keydown'].forEach(evt => {
  window.addEventListener(evt, initAudio, { once: true });
});

// Genera un buffer de ruido blanco (una sola vez, reutilizable)
let noiseBuffer = null;
function getNoiseBuffer() {
  if (noiseBuffer) return noiseBuffer;
  const length = audioCtx.sampleRate * 0.05;   // 50ms
  noiseBuffer = audioCtx.createBuffer(1, length, audioCtx.sampleRate);
  const data = noiseBuffer.getChannelData(0);
  for (let i = 0; i < length; i++) {
    data[i] = Math.random() * 2 - 1;
  }
  return noiseBuffer;
}

// Una chispa individual: ruido muy corto + filtro agudo
function playSpark(volume = 0.15) {
  if (!audioCtx) return;
  const now = audioCtx.currentTime;

  // 1. Fuente de ruido
  const noise = audioCtx.createBufferSource();
  noise.buffer = getNoiseBuffer();

  // 2. Filtro pasa-banda para darle timbre "eléctrico"
  const filter = audioCtx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.setValueAtTime(3000 + Math.random() * 2000, now);
  filter.Q.value = 8;

  // 3. Envolvente muy corta (chasquido)
  const gain = audioCtx.createGain();
  gain.gain.setValueAtTime(0, now);
  gain.gain.linearRampToValueAtTime(volume, now + 0.001);       // ataque 1ms
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.04);   // caída 40ms

  noise.connect(filter).connect(gain).connect(audioCtx.destination);
  noise.start(now);
  noise.stop(now + 0.05);
}

// Dos chispas muy seguidas → "tas tas"
let lastDouble = 0;
function playTasTax() {
  if (!audioCtx) return;
  const now = performance.now();
  if (now - lastDouble < 60) return;
  lastDouble = now;

  playSpark(0.15);
  setTimeout(() => playSpark(0.12), 45);   // segunda chispa 45ms después
}


// ============================================================
// 3. DATOS: RECUERDOS
// ============================================================
const memories = [
  {
    title: "La primera vez que nos reímos sin parar",
    text: "Fue ese día en la cafetería...",
    img: "img/im1.png",
    tag: "Risa eterna"
  },
  {
    title: "Nuestro viaje improvisado",
    text: "Sin planear nada...",
    img: "img/recuerdo2.jpg",
    tag: "Aventura"
  },
  {
    title: "Cuando me escuchaste sin juzgar",
    text: "Ese día no necesitaba consejos...",
    img: "img/recuerdo3.jpg",
    tag: "Gracias"
  },
  {
    title: "Las 3 a.m. hablando de todo",
    text: "De la vida, del universo...",
    img: "img/recuerdo4.jpg",
    tag: "Madrugadas"
  },
  {
    title: "Tu cumpleaños sorpresa",
    text: "Cuando entraste y viste todo...",
    img: "img/recuerdo5.jpg",
    tag: "Sorpresa"
  },
  {
    title: "Simplemente tú",
    text: "No hace falta una anécdota épica...",
    img: "img/recuerdo6.jpg",
    tag: "Presencia"
  },
  {
    title: "Simplemente tú",
    text: "No hace falta una anécdota épica...",
    img: "img/recuerdo6.jpg",
    tag: "Presencia"
  },
  {
    title: "Simplemente tú",
    text: "No hace falta una anécdota épica...",
    img: "img/recuerdo6.jpg",
    tag: "Presencia"
  },
  {
    title: "Simplemente tú",
    text: "No hace falta una anécdota épica...",
    img: "img/recuerdo6.jpg",
    tag: "Presencia"
  },
  {
    title: "Simplemente tú",
    text: "No hace falta una anécdota épica...",
    img: "img/recuerdo6.jpg",
    tag: "Presencia"
  }
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

// Posiciones sin solaparse
function generatePositions(count) {
  const positions = [];
  const minDist = 15;
  let attempts = 0;
  while (positions.length < count && attempts < 800) {
    attempts++;
    const x = 8 + Math.random() * 80;
    const y = 5 + Math.random() * 70;
    const ok = positions.every(p => Math.hypot(p.x - x, p.y - y) > minDist);
    if (ok) positions.push({ x, y });
  }
  return positions;
}

// SVG del tulipán con capas para efecto 3D
function createTulipSVG([c1, c2, c3, stem]) {
  return `
    <svg viewBox="0 0 90 160" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="petal-${c1}" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stop-color="${c1}"/>
          <stop offset="60%"  stop-color="${c2}"/>
          <stop offset="100%" stop-color="${c3}"/>
        </linearGradient>
        <radialGradient id="shine-${c1}" cx="0.4" cy="0.3" r="0.6">
          <stop offset="0%"   stop-color="#ffffff" stop-opacity="0.55"/>
          <stop offset="100%" stop-color="#ffffff" stop-opacity="0"/>
        </radialGradient>
        <linearGradient id="stem-${c1}" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%"   stop-color="${stem}"/>
          <stop offset="50%"  stop-color="#2f8a52"/>
          <stop offset="100%" stop-color="${stem}"/>
        </linearGradient>
      </defs>

      <path d="M45 155 Q42 110 45 75 Q47 55 45 40"
            stroke="url(#stem-${c1})" stroke-width="5" fill="none"
            stroke-linecap="round"/>

      <path d="M45 120 Q18 100 22 70 Q38 80 45 110 Z"
            fill="${stem}" opacity="0.9"/>
      <path d="M45 120 Q18 100 22 70"
            stroke="#2f8a52" stroke-width="1" fill="none" opacity="0.5"/>

      <path d="M45 130 Q72 108 68 78 Q52 88 45 118 Z"
            fill="${stem}" opacity="0.9"/>
      <path d="M45 130 Q72 108 68 78"
            stroke="#2f8a52" stroke-width="1" fill="none" opacity="0.5"/>

      <path d="M45 20 Q25 20 22 45 Q22 68 45 70 Q68 68 68 45 Q65 20 45 20 Z"
            fill="${c3}" opacity="0.95"/>

      <path d="M45 15 Q30 18 27 45 Q27 70 45 72 Q63 70 63 45 Q60 18 45 15 Z"
            fill="url(#petal-${c1})"/>

      <path d="M45 18 Q18 22 15 50 Q17 72 45 70 Q35 55 38 38 Q40 25 45 18 Z"
            fill="${c2}" opacity="0.95"/>

      <path d="M45 18 Q72 22 75 50 Q73 72 45 70 Q55 55 52 38 Q50 25 45 18 Z"
            fill="${c2}" opacity="0.95"/>

      <path d="M45 18 Q30 20 27 45 Q30 40 45 30 Q60 40 63 45 Q60 20 45 18 Z"
            fill="url(#shine-${c1})"/>
    </svg>
  `;
}

// Solo mostramos las primeras 4 flores en móvil
const maxFlowers = isMobile ? 10 : memories.length;
const positions  = generatePositions(maxFlowers);

memories.slice(0, maxFlowers).forEach((mem, i) => {
  const pos = positions[i];
  const tulip = document.createElement('div');
  tulip.className = 'tulip';

  // Escala según qué tan abajo está (parallax)
  const scale = 0.75 + (pos.y / 100) * 0.6;
  // Profundidad Z aleatoria
  const z = (Math.random() - 0.5) * 400;

  tulip.style.left = pos.x + '%';
  tulip.style.top  = pos.y + '%';
  tulip.style.animationDelay = (Math.random() * 5) + 's';
  tulip.style.transformStyle = 'preserve-3d';
  tulip.style.transform = `translateZ(${z}px) scale(${scale})`;

  tulip.innerHTML = createTulipSVG(tulipPalettes[i % tulipPalettes.length]);

  // pointerdown funciona en mouse y touch
  tulip.addEventListener('pointerdown', (e) => openCard(mem, e));

  garden.appendChild(tulip);
});


// ============================================================
// 5. TARJETA (overlay)
// ============================================================
const overlay   = document.getElementById('cardOverlay');
const cardImg   = document.getElementById('cardImg');
const cardTitle = document.getElementById('cardTitle');
const cardText  = document.getElementById('cardText');
const cardTag   = document.getElementById('cardTag');
const closeBtn  = document.getElementById('closeBtn');

function openCard(mem, event) {
  cardImg.src = mem.img;
  cardImg.alt = mem.title;
  cardImg.onerror = () => {
    cardImg.src = "https://placehold.co/440x240/2b1a4a/ffd6ff?text=🌸+Recuerdo";
  };

  cardTitle.textContent = mem.title;
  cardText.textContent  = mem.text;
  cardTag.textContent   = mem.tag;

  overlay.classList.add('active');
  overlay.setAttribute('aria-hidden', 'false');

  // Partículas + sonido (usa coordenadas del evento si existen)
  const cx = event?.clientX ?? window.innerWidth  / 2;
  const cy = event?.clientY ?? window.innerHeight / 2;
  burstParticles(cx, cy);

  // Traer la flor al frente (rotar jardín)
  const tulip = event?.currentTarget;
  if (tulip) {
    const rect = tulip.getBoundingClientRect();
    const centerX = window.innerWidth  / 2;
    const centerY = window.innerHeight / 2;
    const dx = (rect.left + rect.width  / 2 - centerX) / centerX;
    const dy = (rect.top  + rect.height / 2 - centerY) / centerY;
    targetRotY = -dx * 20;
    targetRotX =  dy * 10;
  }
}

function closeCard() {
  overlay.classList.remove('active');
  overlay.setAttribute('aria-hidden', 'true');
}

closeBtn.addEventListener('click', closeCard);
overlay.addEventListener('click', (e) => {
  if (e.target === overlay) closeCard();
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeCard();
});


// ============================================================
// 6. PARTÍCULAS (Canvas)
// ============================================================
const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');
let particles = [];

function resize() {
  const dpr = window.devicePixelRatio || 1;
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
    ctx.shadowColor = this.color;
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

function burstParticles(x, y, amount = isMobile ? 12 : 25) {
  for (let i = 0; i < amount; i++) particles.push(new Particle(x, y));
  if (particles.length > 200) particles.splice(0, particles.length - 200);
  playTasTax();
}

// Hover (solo escritorio)
let lastTrail = 0;
let lastTick  = 0;
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
// ============================================================
// PARTÍCULAS EN TÁCTIL (móvil)
// ============================================================
let lastTouchTrail = 0;
let lastTouchTick  = 0;

function handleTouch(e) {
  if (!audioCtx) initAudio();   // aseguramos audio al primer toque

  const t = e.touches[0];
  if (!t) return;

  const now = performance.now();
  if (now - lastTouchTrail < 50) return;
  lastTouchTrail = now;

  particles.push(new Particle(t.clientX, t.clientY));

  if (now - lastTouchTick > 100) {
    lastTouchTick = now;
    playSpark(0.08);   // chispa suave al deslizar
  }
}

window.addEventListener('touchstart', (e) => {
  handleTouch(e);
  // ráfaga extra al tocar
  const t = e.touches[0];
  if (t) burstParticles(t.clientX, t.clientY, 8);
}, { passive: true });

window.addEventListener('touchmove', handleTouch, { passive: true });

// ============================================================
// 7. ROTACIÓN 3D DEL JARDÍN
// ============================================================
const gardenEl = document.getElementById('garden');

let targetRotX = 0, targetRotY = 0;
let currentRotX = 0, currentRotY = 0;

// Mouse (escritorio)
window.addEventListener('mousemove', (e) => {
  if (isTouch) return;
  const cx = window.innerWidth  / 2;
  const cy = window.innerHeight / 2;
  const dx = (e.clientX - cx) / cx;
  const dy = (e.clientY - cy) / cy;
  targetRotY =  dx * 25;
  targetRotX = -dy * 12;
});

// Touch (móvil): arrastrar el dedo
let touchStart = null;
window.addEventListener('touchstart', (e) => {
  touchStart = { x: e.touches[0].clientX, y: e.touches[0].clientY };
}, { passive: true });

window.addEventListener('touchmove', (e) => {
  if (!touchStart) return;
  const dx = (e.touches[0].clientX - touchStart.x) / window.innerWidth;
  const dy = (e.touches[0].clientY - touchStart.y) / window.innerHeight;
  targetRotY =  dx * 60;
  targetRotX = -dy * 30;
}, { passive: true });

window.addEventListener('touchend', () => {
  touchStart = null;
  targetRotX = 0;
  targetRotY = 0;
});

// Auto-rotación suave cuando el usuario no interactúa
let autoAngle = 0;
function autoRotate() {
  if (Math.abs(targetRotY) < 0.5 && Math.abs(targetRotX) < 0.5) {
    autoAngle += 0.02;
    targetRotY = Math.sin(autoAngle) * 5;
  }
}

function updateGardenRotation() {
  currentRotX += (targetRotX - currentRotX) * 0.08;
  currentRotY += (targetRotY - currentRotY) * 0.08;
  gardenEl.style.transform =
    `rotateX(${currentRotX}deg) rotateY(${currentRotY}deg)`;
}


// ============================================================
// 8. LOOP PRINCIPAL
// ============================================================
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles = particles.filter(p => p.life > 0);
  particles.forEach(p => { p.update(); p.draw(); });

  ctx.globalAlpha = 1;
  ctx.shadowBlur = 0;

  autoRotate();
  updateGardenRotation();

  requestAnimationFrame(animate);
}
animate();
