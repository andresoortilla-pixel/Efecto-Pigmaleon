// ============================================================================
// CONFIGURACIÓN 1: ID DEL VIDEO PRINCIPAL DE YOUTUBE (PANTALLA 2)
// Ejemplo: Si el link es https://www.youtube.com/watch?v=M7lc1UVf-VE -> 'M7lc1UVf-VE'
// ============================================================================
const YOUTUBE_VIDEO_ID = 'sjcNR-m5bUg'; // <-- REEMPLAZA ESTE ID CUANDO SUBAN SU VIDEO


// ============================================================================
// CONFIGURACIÓN 2: MINUTOS/SEGUNDOS EXACTOS DONDE SALTAN LOS CLIPS Y APOYOS
// Fórmula rápida: (Minutos * 60) + Segundos = segundoExacto
// Ejemplo: Minuto 2:15 -> (2 * 60) + 15 = 135 segundos
// ============================================================================
const eventosDelVideo = [
    {
        // APOYO MIEMBRO 1: Sale nota adhesiva con cita de Mead (No pausa el video)
        nombre: "Miembro 1 - Flashcard George H. Mead",
        segundoExacto: 31, // <-- CAMBIA AQUÍ EL SEGUNDO (Ej: 0:25)
        mostrado: false,
        accion: () => mostrarFlashcardSinPausar('flashcard-mead')
    },
    {
        // APOYO MIEMBRO 2: Pausa el video y muestra el esquema de Lee Ross (1977)
        nombre: "Miembro 2 - Esquema Error Fundamental de Atribución",
        segundoExacto: 76, // <-- CAMBIA AQUÍ EL SEGUNDO (Ej: 1:35)
        mostrado: false,
        accion: () => mostrarPopUpYPausar('modal-atribucion')
    },
    {
        // APOYO MIEMBRO 3: Pausa YouTube y reproduce el Clip 1 (assets/escena-autoridades.mp4)
        nombre: "Miembro 3 - Clip Película: Directivos y Prejuicios",
        segundoExacto: 120, // <-- CAMBIA AQUÍ EL SEGUNDO (Ej: 2:45)
        mostrado: false,
        accion: () => mostrarClipPelicula('modal-clip-autoridades', 'video-clip-1')
    },
    {
        // APOYO MIEMBRO 4: Pausa el video y muestra el esquema de Rosenthal y Jacobson (1968)
        nombre: "Miembro 4 - Esquema Efecto Pigmalión",
        segundoExacto: 166, // <-- CAMBIA AQUÍ EL SEGUNDO (Ej: 4:00)
        mostrado: false,
        accion: () => mostrarPopUpYPausar('modal-pigmalion')
    },
    {
        // APOYO MIEMBRO 5 (Parte A): Pausa YouTube y reproduce el Clip 2 (assets/escena-cambio.mp4)
        nombre: "Miembro 5 - Clip Película: Maestra limpia el aula",
        segundoExacto: 1000, // <-- CAMBIA AQUÍ EL SEGUNDO (Ej: 5:10)
        mostrado: false,
        accion: () => mostrarClipPelicula('modal-clip-cambio', 'video-clip-2')
    },
    {
        // APOYO MIEMBRO 5 (Parte B): Sale nota adhesiva de Albert Bandura (No pausa el video)
        nombre: "Miembro 5 - Flashcard Autoeficacia de Bandura",
        segundoExacto: 1000, // <-- CAMBIA AQUÍ EL SEGUNDO (Ej: 5:35)
        mostrado: false,
        accion: () => mostrarFlashcardSinPausar('flashcard-bandura')
    },
    {
        // APOYO MIEMBRO 6: Pausa el video y muestra las capturas Antes/Después del aula
        nombre: "Miembro 6 - Capturas Antes y Después del Aula",
        segundoExacto: 340, // <-- CAMBIA AQUÍ EL SEGUNDO (Ej: 6:30)
        mostrado: false,
        accion: () => mostrarPopUpYPausar('modal-capturas-aula')
    }
];


// ============================================================================
// CONFIGURACIÓN 3: PESTAÑAS DEL EXPEDIENTE INICIAL (PANTALLA 1)
// ============================================================================
const contenidoPestanas = {
    1: `
        <h3>📋 Equipo de Investigación - Grupo 2</h3>
        <p><strong>Rol asignado:</strong> Analistas de Sesgos y Atribuciones (Efecto Pigmalión).</p>
        <ul class="integrantes-grid">
            <li>1. Burgos Nicole </li>
            <li>2. Chachalo Kevin</li>
            <li>3. Escobar Matias</li>
            <li>4. Lara Karla</li>
            <li>5. Lita Josué</li>
            <li>6. Loza Andreina</li>
            <li>7. Togán Damariz</li>
        </ul>
    `,
    2: `
        <h3>🏚️ Contexto General del Caso ("Escuela sin Nombre")</h3>
        <div class="expediente-video-box">
            <video id="video-contexto" controls preload="metadata">
                <source src="assets/contexto.mp4" type="video/mp4">
                Tu navegador no soporta la reproducción de video.
            </video>
        </div>
    `,
    3: `
        <h3>🧠 Delimitación de la Problemática Psicosocial</h3>
        <div class="expediente-video-box">
            <video id="video-problematica" controls preload="metadata">
                <source src="assets/problematica.mp4" type="video/mp4">
                Tu navegador no soporta la reproducción de video.
            </video>
        </div>
    `
};


// ============================================================================
// LÓGICA DEL SISTEMA (NO NECESITAS MODIFICAR NADA DE AQUÍ HACIA ABAJO)
// ============================================================================
let player;
let monitorInterval;
const pestanasLeidas = new Set();

document.addEventListener('DOMContentLoaded', () => {
    leerPestana(1);
});

function leerPestana(numero) {
    document.querySelectorAll('.expediente-video-box video').forEach(vid => vid.pause());
    document.getElementById('tab-content-area').innerHTML = contenidoPestanas[numero];

    document.querySelectorAll('.paper-tab').forEach(btn => btn.classList.remove('active'));
    document.getElementById(`tab-btn-${numero}`).classList.add('active');

    pestanasLeidas.add(numero);
    const totalLeidas = pestanasLeidas.size;
    document.getElementById('progreso-lectura').innerText = `Documentos revisados: ${totalLeidas} de 3`;

    if (totalLeidas === 3) {
        document.getElementById('progreso-lectura').innerText = "✅ Expediente completo (3 de 3)";
        document.getElementById('btn-iniciar').classList.remove('hidden');
    }
}

function irAPantalla(screenId, stepNum) {
    document.querySelectorAll('video').forEach(vid => vid.pause());

    document.querySelectorAll('.screen').forEach(scr => scr.classList.add('hidden'));
    document.getElementById(screenId).classList.remove('hidden');

    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById(`nav-step-${stepNum}`).classList.add('active');

    if (screenId !== 'video-screen' && player && typeof player.pauseVideo === 'function') {
        player.pauseVideo();
    }
}

function iniciarVideo() {
    irAPantalla('video-screen', 2);
    if (player && typeof player.playVideo === 'function') {
        player.playVideo();
    }
}

function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', {
        height: '100%',
        width: '100%',
        videoId: YOUTUBE_VIDEO_ID,
        playerVars: {
            'rel': 0,
            'modestbranding': 1
        },
        events: {
            'onStateChange': onPlayerStateChange
        }
    });
}

function onPlayerStateChange(event) {
    if (event.data === YT.PlayerState.PLAYING) {
        monitorInterval = setInterval(verificarTiempoVideo, 500);
    } else {
        clearInterval(monitorInterval);
    }

    if (event.data === YT.PlayerState.ENDED) {
        irAPantalla('intervencion-screen', 3);
    }
}

function verificarTiempoVideo() {
    if (!player || typeof player.getCurrentTime !== 'function') return;

    const segundoActual = Math.floor(player.getCurrentTime());
    actualizarRelojVisual(segundoActual);

    eventosDelVideo.forEach(evento => {
        if (segundoActual >= evento.segundoExacto && segundoActual <= evento.segundoExacto + 1 && !evento.mostrado) {
            evento.mostrado = true;
            evento.accion();
        }
    });
}

function actualizarRelojVisual(segundosTotales) {
    const min = String(Math.floor(segundosTotales / 60)).padStart(2, '0');
    const seg = String(segundosTotales % 60).padStart(2, '0');
    document.getElementById('reloj-video').innerText = `${min}:${seg}`;
}

// ============================================================================
// FUNCIONES PARA ABRIR Y CERRAR CLIPS DE PELÍCULA, MODALES Y FLASHCARDS
// ============================================================================

// Pausa YouTube, abre el modal del clip de película y lo reproduce automáticamente
function mostrarClipPelicula(modalId, videoElementId) {
    if (player && typeof player.pauseVideo === 'function') {
        player.pauseVideo();
    }
    document.getElementById(modalId).classList.remove('hidden');
    
    const clipVideo = document.getElementById(videoElementId);
    if (clipVideo) {
        clipVideo.currentTime = 0;
        clipVideo.play().catch(() => {
            // Si el navegador requiere clic manual, el usuario tiene los controles listos
        });
    }
}

// Detiene el clip de película, cierra el modal y reanuda el video de YouTube
function cerrarClipYReanudar(modalId, videoElementId) {
    const clipVideo = document.getElementById(videoElementId);
    if (clipVideo) {
        clipVideo.pause();
    }
    document.getElementById(modalId).classList.add('hidden');
    
    if (player && typeof player.playVideo === 'function') {
        player.playVideo();
    }
}

function mostrarPopUpYPausar(modalId) {
    if (player && typeof player.pauseVideo === 'function') {
        player.pauseVideo();
    }
    document.getElementById(modalId).classList.remove('hidden');
}

function cerrarModalYReanudar(modalId) {
    document.getElementById(modalId).classList.add('hidden');
    if (player && typeof player.playVideo === 'function') {
        player.playVideo();
    }
}

function mostrarFlashcardSinPausar(cardId) {
    // Oculta otras flashcards abiertas antes de mostrar la nueva
    document.querySelectorAll('.sticky-flashcard').forEach(card => card.classList.add('hidden'));
    document.getElementById(cardId).classList.remove('hidden');
}

function ocultarElemento(id) {
    document.getElementById(id).classList.add('hidden');
}

function abrirModalAPA() {
    document.getElementById('modal-apa').classList.remove('hidden');
}

// ============================================================================
// DESBLOQUEO SECUENCIAL EN PROPUESTA DE INTERVENCIÓN (PANTALLA 3)
// ============================================================================
function desbloquearFase(numeroFase) {
    const card = document.getElementById(`card-fase-${numeroFase}`);
    const lockOverlay = document.getElementById(`lock-fase-${numeroFase}`);
    const statusBadge = document.getElementById(`status-fase-${numeroFase}`);
    const statusAnterior = document.getElementById(`status-fase-${numeroFase - 1}`);

    if (statusAnterior) statusAnterior.innerText = "✅ Completado";

    if (card && card.classList.contains('locked')) {
        card.classList.remove('locked');
        if (lockOverlay) lockOverlay.classList.add('hidden');
        if (statusBadge) statusBadge.innerText = "🔓 Desbloqueado";
    }
}

function desbloquearReflexion() {
    const statusFase3 = document.getElementById('status-fase-3');
    if (statusFase3) statusFase3.innerText = "✅ Completado";

    const boxReflexion = document.getElementById('box-reflexion');
    const lockReflexion = document.getElementById('lock-reflexion');

    if (boxReflexion && boxReflexion.classList.contains('locked')) {
        boxReflexion.classList.remove('locked');
        if (lockReflexion) lockReflexion.classList.add('hidden');
        boxReflexion.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}
