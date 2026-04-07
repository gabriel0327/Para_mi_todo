/* ══════════════════════════════════════════════════
   script.js  ·  Sorpresa Romántica
   Lógica: estrellas · pétalos · sparkles · mensajes · música YouTube
══════════════════════════════════════════════════ */

/* ══════════════════════════════════════════════
   1. ESTRELLAS – Canvas animado en el fondo
══════════════════════════════════════════════ */
(function initStars() {
  const canvas = document.getElementById('stars-canvas');
  const ctx    = canvas.getContext('2d');
  const stars  = [];

  /* Ajusta el canvas al tamaño de ventana */
  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  /* Genera 220 estrellas con propiedades aleatorias */
  for (let i = 0; i < 220; i++) {
    stars.push({
      x:    Math.random() * canvas.width,
      y:    Math.random() * canvas.height,
      r:    Math.random() * 1.4 + 0.3,       // radio
      a:    Math.random(),                     // opacidad actual
      da:   (Math.random() - 0.5) * 0.008,   // delta opacidad (parpadeo)
      gold: Math.random() < 0.12              // ~12 % son doradas
    });
  }

  /* Loop de animación */
  function drawStars() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    stars.forEach(s => {
      s.a += s.da;
      if (s.a <= 0 || s.a >= 1) s.da *= -1;   // rebota opacidad

      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = s.gold
        ? `rgba(245,200,66,${s.a})`
        : `rgba(255,214,224,${s.a})`;
      ctx.fill();
    });

    requestAnimationFrame(drawStars);
  }
  drawStars();
})();


/* ══════════════════════════════════════════════
   2. PÉTALOS – Elementos DOM animados con CSS
══════════════════════════════════════════════ */
const PETALS_EMO = ['🌸','🌹','🌺','💮','🏵️','🌷','💐','❀'];

/**
 * Crea un pétalo en posición aleatoria y lo añade al body.
 * Se elimina solo cuando termina la animación.
 */
function crearPetalo() {
  const el = document.createElement('span');
  el.className   = 'petal';
  el.textContent = PETALS_EMO[Math.floor(Math.random() * PETALS_EMO.length)];

  const dur  = Math.random() * 6 + 6;    // 6 – 12 s
  const size = Math.random() * 1 + 0.8;  // 0.8 – 1.8 rem

  el.style.cssText = `
    left:               ${Math.random() * 100}vw;
    font-size:          ${size}rem;
    animation-duration: ${dur}s;
    animation-delay:    ${Math.random() * 4}s;
  `;

  document.body.appendChild(el);
  setTimeout(() => el.remove(), (dur + 4) * 1000); // limpieza
}

/** Lanza 18 pétalos inmediatamente y luego uno cada 600 ms */
function iniciarPetalos() {
  for (let i = 0; i < 18; i++) crearPetalo();
  setInterval(crearPetalo, 600);
}


/* ══════════════════════════════════════════════
   3. SPARKLES – Partículas de brillo flotantes
══════════════════════════════════════════════ */
/**
 * Crea una partícula de brillo dorada o rosada en posición aleatoria.
 * Se elimina sola a los 6 s.
 */
function crearSparkle() {
  const el = document.createElement('div');
  el.className = 'sparkle';

  el.style.cssText = `
    left:               ${Math.random() * 100}vw;
    top:                ${Math.random() * 100}vh;
    background:         ${Math.random() < 0.5 ? '#f5c842' : '#ff6b8a'};
    width:              ${Math.random() * 5 + 2}px;
    height:             ${Math.random() * 5 + 2}px;
    animation-duration: ${Math.random() * 3 + 2}s;
    animation-delay:    ${Math.random() * 2}s;
  `;

  document.body.appendChild(el);
  setTimeout(() => el.remove(), 6000);
}

/** Genera un sparkle cada 350 ms */
function iniciarSparkles() {
  setInterval(crearSparkle, 350);
}


/* ══════════════════════════════════════════════
   4. MÚSICA – YouTube IFrame API
   Canción: Danny Ocean – Corazón (official video)
   ID del video: M_JV0f4HHFU
══════════════════════════════════════════════ */
let ytPlayer = null;
let ytApiListo = false;

/** Callback global que llama YouTube cuando su API carga */
window.onYouTubeIframeAPIReady = function () {
  ytApiListo = true;

  ytPlayer = new YT.Player('yt-player', {
    videoId: 'M_JV0f4HHFU',   // Danny Ocean – Corazón
    playerVars: {
      autoplay: 0,
      loop:     1,
      playlist: 'M_JV0f4HHFU',
      controls: 0,
      mute:     0,
      rel:      0
    }
  });
};

/** Carga el script de la API de YouTube de forma diferida */
function cargarYouTubeAPI() {
  if (document.getElementById('yt-api-script')) return; // ya cargado

  const tag    = document.createElement('script');
  tag.id       = 'yt-api-script';
  tag.src      = 'https://www.youtube.com/iframe_api';

  const first  = document.getElementsByTagName('script')[0];
  first.parentNode.insertBefore(tag, first);
}

/** Intenta reproducir la música; reintenta si la API aún no está lista */
function reproducirMusica() {
  if (ytApiListo && ytPlayer && typeof ytPlayer.playVideo === 'function') {
    ytPlayer.setVolume(65); // 0-100
    ytPlayer.playVideo();
  } else {
    // API aún cargando → reintenta cada 300 ms hasta que esté lista
    setTimeout(reproducirMusica, 300);
  }
}
document.addEventListener("click", () => {
  if (player) {
    player.unMute();
    player.playVideo();
  }
}, { once: true });


/* ══════════════════════════════════════════════
   5. FLUJO PRINCIPAL
══════════════════════════════════════════════ */

/**
 * Se ejecuta al presionar "Haz clic aquí 💖".
 * Inicia música, efectos visuales y oculta la pantalla de intro.
 */
function iniciarExperiencia() {
  // ── Cargar y reproducir Danny Ocean – Corazón
  cargarYouTubeAPI();
  reproducirMusica();

  // ── Efectos visuales
  iniciarPetalos();
  iniciarSparkles();

  // ── Fade-out de la pantalla inicial
  const intro = document.getElementById('intro');
  intro.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
  intro.style.opacity    = '0';
  intro.style.transform  = 'scale(0.9)';

  setTimeout(() => {
    intro.style.display = 'none';
    mostrarMensajes();
  }, 900);
}


/* ── Revelar mensajes uno a uno ── */
function mostrarMensajes() {
  const seccion  = document.getElementById('messages-section');
  seccion.style.display = 'flex';

  const mensajes = ['msg1', 'msg2', 'msg3', 'msg4', 'msg5', 'msg6'];
  let idx = 0;

  function revelarSiguiente() {
    if (idx >= mensajes.length) {
      // Todos los mensajes mostrados → ir a sección final
      setTimeout(mostrarFinal, 1200);
      return;
    }

    const card = document.getElementById(mensajes[idx]);
    card.classList.add('visible');
    idx++;
    setTimeout(revelarSiguiente, 1600);
  }

  setTimeout(revelarSiguiente, 600);
}


/* ── Mostrar sección final con la pregunta ── */
function mostrarFinal() {
  const final = document.getElementById('final-section');
  final.style.display = 'flex';

  // Posición inicial del botón "No"
  posicionarBotonNo(document.getElementById('btn-no'));

  requestAnimationFrame(() => {
    setTimeout(() => final.classList.add('visible'), 50);
  });
}


/* ══════════════════════════════════════════════
   6. BOTÓN "NO" – escapa del cursor
══════════════════════════════════════════════ */

/**
 * Coloca el botón "No" en una posición aleatoria dentro de la pantalla,
 * con márgenes para que no se salga del borde.
 */
function posicionarBotonNo(btn) {
  const margen = 90;
  const x = margen + Math.random() * (window.innerWidth  - margen * 2);
  const y = margen + Math.random() * (window.innerHeight - margen * 2);
  btn.style.left = x + 'px';
  btn.style.top  = y + 'px';
}

/** Escapa cada vez que el cursor entra al botón */
function escaparBoton(btn) {
  posicionarBotonNo(btn);
}


/* ══════════════════════════════════════════════
   7. RESPUESTA "SÍ" – pantalla de celebración
══════════════════════════════════════════════ */
function respuestaSi() {
  // Ocultar mensajes y sección final con fade
  ['messages-section', 'final-section'].forEach(id => {
    const el = document.getElementById(id);
    el.style.transition = 'opacity 0.6s';
    el.style.opacity    = '0';
    setTimeout(() => { el.style.display = 'none'; }, 650);
  });

  // Eliminar botón "No"
  const btnNo = document.getElementById('btn-no');
  if (btnNo) btnNo.remove();

  // Explosión extra de pétalos
  for (let i = 0; i < 35; i++) {
    setTimeout(crearPetalo, i * 70);
  }

  // Mostrar pantalla de celebración
  setTimeout(() => {
    const yesScreen = document.getElementById('yes-screen');
    yesScreen.style.display = 'flex';
  }, 700);
}
