/* ============ RESET Y BASE ============ */
* { box-sizing: border-box; margin: 0; padding: 0; }

html, body {
  height: 100%;
  overflow: hidden;
  overscroll-behavior: none;
  -webkit-tap-highlight-color: transparent;
}

body {
  font-family: 'Segoe UI', system-ui, sans-serif;
  background: linear-gradient(180deg, #0b1026 0%, #1a1f4a 40%, #2d1b4e 100%);
  color: #fff;
  perspective: 1200px;
  perspective-origin: 50% 55%;
  /* touch-action: none solo donde NO haya que scrollear */
  touch-action: none;
}

/* ============ CIELO ============ */
.sky { position: fixed; inset: 0; z-index: 0; }

.stars {
  position: absolute; inset: 0;
  background-image:
    radial-gradient(2px 2px at 10% 20%, #ffffff, transparent),
    radial-gradient(2px 2px at 35% 15%, #ffffff, transparent),
    radial-gradient(2px 2px at 60% 30%, #ffffff, transparent),
    radial-gradient(2px 2px at 85% 25%, #ffffff, transparent),
    radial-gradient(1px 1px at 5% 60%, #ffffff, transparent),
    radial-gradient(1px 1px at 18% 80%, #ffffff, transparent),
    radial-gradient(1px 1px at 25% 45%, #ffffff, transparent),
    radial-gradient(1px 1px at 42% 70%, #ffffff, transparent),
    radial-gradient(1px 1px at 58% 55%, #ffffff, transparent),
    radial-gradient(1px 1px at 70% 85%, #ffffff, transparent),
    radial-gradient(1px 1px at 80% 60%, #ffffff, transparent),
    radial-gradient(1px 1px at 92% 75%, #ffffff, transparent),
    radial-gradient(1.5px 1.5px at 22% 10%, #ffe9a8, transparent),
    radial-gradient(1.5px 1.5px at 50% 8%, #ffe9a8, transparent),
    radial-gradient(1.5px 1.5px at 75% 15%, #ffe9a8, transparent),
    radial-gradient(1.5px 1.5px at 8% 40%, #cfe4ff, transparent),
    radial-gradient(1.5px 1.5px at 45% 90%, #cfe4ff, transparent),
    radial-gradient(1.5px 1.5px at 95% 45%, #cfe4ff, transparent);
  background-size: 100% 100%;
  opacity: .9;
  animation: twinkle 4s ease-in-out infinite alternate;
}

.stars::after {
  content: "";
  position: absolute; inset: 0;
  background-image:
    radial-gradient(1px 1px at 15% 35%, #fff, transparent),
    radial-gradient(1px 1px at 55% 65%, #fff, transparent),
    radial-gradient(1px 1px at 78% 40%, #fff, transparent),
    radial-gradient(1px 1px at 33% 88%, #fff, transparent),
    radial-gradient(1px 1px at 88% 88%, #fff, transparent),
    radial-gradient(1px 1px at 4% 72%, #fff, transparent);
  animation: twinkle 6s ease-in-out infinite alternate-reverse;
}

@keyframes twinkle { from { opacity: .4; } to { opacity: 1; } }

.moon {
  position: absolute;
  top: 8%; right: 12%;
  width: 90px; height: 90px;
  border-radius: 50%;
  background: radial-gradient(circle at 35% 35%, #fff8e1, #d8c98a 70%, #b8a860);
  box-shadow: 0 0 60px 20px rgba(255, 240, 180, .25);
  animation: moonGlow 6s ease-in-out infinite alternate;
}
@keyframes moonGlow {
  from { box-shadow: 0 0 40px 10px rgba(255,240,180,.2); }
  to   { box-shadow: 0 0 80px 25px rgba(255,240,180,.4); }
}

/* ============ PARTÍCULAS ============ */
#particles {
  position: fixed; inset: 0;
  pointer-events: none;
  z-index: 5;
}

/* ============ JARDÍN ============ */
.garden {
  position: relative;
  z-index: 2;
  height: 100vh;
  width: 100%;
  padding: 2vh 2vw;
  transform-style: preserve-3d;
  will-change: transform;
  /* Sin transition: el lerp lo hace JS */
}

/* ============ TULIPÁN 3D ============ */
.tulip {
  position: absolute;
  width: 160px;
  height: 234px;
  cursor: pointer;
  transform-style: preserve-3d;
  transition: filter .35s ease;
  animation: sway3d 5s ease-in-out infinite;
  transform-origin: center bottom;
  filter: drop-shadow(0 12px 12px rgba(0,0,0,.45));
  user-select: none;
  -webkit-user-select: none;
  background: transparent;
  touch-action: manipulation;
}

.tulip:hover {
  animation-play-state: paused;   /* pausa el sway mientras el hover manda */
  filter: drop-shadow(0 20px 25px rgba(255, 150, 220, .6));
}

@keyframes sway3d {
  0%, 100% { transform: rotateY(-8deg) rotateZ(-2deg); }
  50%      { transform: rotateY(8deg)  rotateZ(2deg); }
}

.tulip svg {
  display: block;
  width: 100%;
  height: 100%;
  overflow: visible;
  pointer-events: none;   /* los clics los captura el .tulip */
}

/* Zona táctil ampliada */
.tulip::before {
  content: "";
  position: absolute;
  inset: -30px;
  border-radius: 50%;
  z-index: 0;
}

/* ============ TARJETA DE RECUERDO ============ */
.card-overlay {
  position: fixed; inset: 0;
  background: rgba(5, 8, 25, .75);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  pointer-events: none;
  transition: opacity .4s ease;
  z-index: 10;
  padding: 16px;
}
.card-overlay.active {
  opacity: 1;
  pointer-events: auto;
}

.memory-card {
  position: relative;              /* necesario para el botón cerrar */
  background: linear-gradient(160deg, #1e2350, #2b1a4a);
  border: 1px solid rgba(255, 200, 255, .3);
  border-radius: 20px;
  width: min(440px, 92vw);
  max-height: 85vh;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(180, 100, 255, .4);
  transform: scale(.85) translateY(20px);
  opacity: 0;
  transition: all .45s cubic-bezier(.2, .9, .3, 1.3);
  display: flex;
  flex-direction: column;
  touch-action: pan-y;             /* permite scroll interno */
}
.card-overlay.active .memory-card {
  transform: scale(1) translateY(0);
  opacity: 1;
}

.card-image {
  height: 240px;
  overflow: hidden;
  background: #000;
  flex-shrink: 0;
}
.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.card-content {
  padding: 22px 26px 28px;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}
.card-content h2 {
  font-size: 1.4rem;
  margin-bottom: 10px;
  background: linear-gradient(90deg, #ffb6ff, #9ad0ff);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  line-height: 1.25;
}
.card-content p {
  line-height: 1.55;
  color: #d9dcff;
  font-size: .98rem;
}

.card-tag {
  display: inline-block;
  margin-top: 14px;
  padding: 4px 12px;
  border-radius: 999px;
  background: rgba(255, 180, 255, .15);
  color: #ffd6ff;
  font-size: .78rem;
  letter-spacing: .5px;
}

.close-btn {
  position: absolute;
  top: 12px; right: 12px;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: none;
  background: rgba(0, 0, 0, .5);
  color: #fff;
  font-size: 1.2rem;
  cursor: pointer;
  z-index: 2;
  transition: background .2s, transform .2s;
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
}
.close-btn:hover  { background: rgba(255, 100, 200, .6); transform: scale(1.08); }
.close-btn:active { transform: scale(.95); }

/* ============ ESTRELLA FUGAZ ============ */
.shooting-star {
    transform: rotate(1200deg) ;
    position: absolute;
    height: .5px;
    /* Inclinamos el haz de luz hacia arriba a la derecha (30 grados) */
    background: linear-gradient(-30deg, #ffffff, rgba(255, 255, 255, 0));
    border-radius: 999px;
    filter: drop-shadow(0 0 6px #ffffff);
    animation: tail 3s ease-in-out infinite, falling 3s ease-in-out infinite;
}

@keyframes tail {
    0% { width: 0; }
    30% { width: 120px; }
    100% { width: 0; }
}

@keyframes falling {
    0% {
        transform: rotate(-30deg) translateX(0) translateY(0);
        opacity: 1;
    }
    70% {
        opacity: 1;
    }
    100% {
        /* Al usar números NEGATIVOS en Y, el elemento SUBE */
        transform: rotate(-30deg) translateX(600px);
        /*transform: translateX(500px) translateY(-288px); */
        opacity: 0;
    }
} /* 

/* ============ RESPONSIVE ============ */
@media (max-width: 768px) {

  .tulip {
    width: 90px;
    height: 162px;
  }

  .tulip::before {
    inset: -30px;
  }

  .moon {
    width: 60px;
    height: 60px;
    top: 5%;
    right: 8%;
  }

  .memory-card {
    width: 92vw;
    max-height: 82vh;
    border-radius: 16px;
  }

  .card-image { height: 180px; }

  .card-content { padding: 18px 20px 22px; }
  .card-content h2 { font-size: 1.15rem; }
  .card-content p  { font-size: .92rem; line-height: 1.5; }
}

@media (max-width: 420px) {
  .tulip {
    width: 50px;
    height: 88px;
  }
}

@media (max-height: 500px) and (orientation: landscape) {
  .tulip {
    width: 45px;
    height: 80px;
  }
  .memory-card {
    flex-direction: row;
    max-height: 95vh;
    width: 90vw;
  }
  .card-image {
    width: 45%;
    height: auto;
  }
}
