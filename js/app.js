// ============================================================================
// CONFIGURACIÓN 1: ID DEL VIDEO DE YOUTUBE
// Cuando subas tu video a YouTube (en modo Público u Oculto), copia solo el ID.
// Ejemplo: Si el link es https://www.youtube.com/watch?v=M7lc1UVf-VE
// El ID que debes pegar entre las comillas es: 'M7lc1UVf-VE'
// ============================================================================
const YOUTUBE_VIDEO_ID = 'M7lc1UVf-VE'; // <-- REEMPLAZA ESTE ID CUANDO TENGAS TU VIDEO


// ============================================================================
// CONFIGURACIÓN 2: TIEMPOS EXACTOS DE DESPLIEGUE EN EL VIDEO (EN SEGUNDOS)
// Recuerda convertir los minutos a segundos:
// Ejemplo: Minuto 1:30 = 90 segundos | Minuto 3:00 = 180 segundos
// ============================================================================
const eventosDelVideo = [
    {
        nombre: "Pop-up: Error Fundamental de Atribución",
        segundoExacto: 10, // <-- CAMBIA AQUÍ EL SEGUNDO EXACTO (Ahorita sale a los 10 seg para que pruebes)
        mostrado: false,
        accion: () => mostrarPopUpYPausar('modal-atribucion')
    },
    {
        nombre: "Flashcard lateral: Etiquetas Institucionales",
        segundoExacto: 20, // <-- CAMBIA AQUÍ EL SEGUNDO EXACTO (Sale sin pausar el video)
        mostrado: false,
        accion: () => mostrarFlashcardSinPausar('flashcard-etiquetas')
    },
    {
        nombre: "Pop-up: Efecto Pigmalión y Cambio de Actitud",
        segundoExacto: 30, // <-- CAMBIA AQUÍ EL SEGUNDO EXACTO (Pausa el video y muestra el ciclo)
        mostrado: false,
        accion: () => mostrarPopUpYPausar('modal-pigmalion')
    }
];


// ============================================================================
// CONFIGURACIÓN 3: DATOS DEL EXPEDIENTE INICIAL (LOS 7 INTEGRANTES)
// ============================================================================
const contenidoPestanas = {
    1: `
        <h3>📋 Equipo de Investigación - Grupo 2</h3>
        <p><strong>Rol asignado:</strong> Analistas de Sesgos y Atribuciones (Efecto Pigmalión).</p>
        <ul class="integrantes-grid">
            <li>1. Kevin Andrés Chachalo Portilla</li>
            <li>2. [Nombre Integrante 2]</li>
            <li>3. [Nombre Integrante 3]</li>
            <li>4. [Nombre Integrante 4]</li>
            <li>5. [Nombre Integrante 5]</li>
            <li>6. [Nombre Integrante 6]</li>
            <li>7. [Nombre Integrante 7]</li>
        </ul>
    `,
    2: `
        <h3>🏚️ Contexto General del Caso ("Escuela sin Nombre")</h3>
        <p>La película <em>Detrás de la Pizarra</em> retrata el programa educativo de un refugio temporal para personas sin hogar. Los niños asisten a un aula improvisada junto a las vías del tren, marcada por el abandono institucional, la escasez extrema de materiales didácticos y constantes distractores ambientales.</p>
        <p>Este escenario vulnera inicialmente tanto la autoestima de los menores como la disposición pedagógica de quienes llegan a enseñar allí.</p>
    `,
    3: `
        <h3>🧠 Delimitación de la Problemática Psicosocial</h3>
        <p>Nuestro análisis se centra en cómo las autoridades educativas y la sociedad justifican su negligencia mediante prejuicios cognitivos (<em>"vienen de la calle"</em>, <em>"no les importa estudiar"</em>).</p>
        <p>Evaluaremos la interacción entre el <strong>Error Fundamental de Atribución</strong> (culpar al niño ignorando su entorno) y el <strong>Efecto Pigmalión</strong> (cómo el cambio de actitud y las altas expectativas de la maestra Stacey Bess transforman el rendimiento académico).</p>
    `
};


// ============================================================================
// LÓGICA DEL SISTEMA (NO NECESITAS MODIFICAR NADA DE AQUÍ HACIA ABAJO)
// ============================================================================
let player;
let monitorInterval;
const pestanasLeidas = new Set();

// Inicializar la primera pestaña al abrir la página
document.addEventListener('DOMContentLoaded', () => {
    leerPestana(1);
});

// Función para cambiar entre las 3 pestañas del expediente inicial
function leerPestana(numero) {
    // Actualizar contenido de la hoja rayada
    document.getElementById('tab-content-area').innerHTML = contenidoPestanas[numero];

    // Actualizar estilo visual de los botones de pestaña
    document.querySelectorAll('.paper-tab').forEach(btn => btn.classList.remove('active'));
    document.getElementById(`tab-btn-${numero}`).classList.add('active');

    // Registrar lectura única
    pestanasLeidas.add(numero);
    const totalLeidas = pestanasLeidas.size;
    document.getElementById('progreso-lectura').innerText = `Documentos revisados: ${totalLeidas} de 3`;

    // Si ya revisó las 3 pestañas, desbloquear el botón de ir al video
    if (totalLeidas === 3) {
        document.getElementById('progreso-lectura').innerText = "✅ Expediente completo (3 de 3)";
        document.getElementById('btn-iniciar').classList.remove('hidden');
    }
}

// Navegación entre las 3 pantallas principales de la plataforma
function irAPantalla(screenId, stepNum) {
    document.querySelectorAll('.screen').forEach(scr => scr.classList.add('hidden'));
    document.getElementById(screenId).classList.remove('hidden');

    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById(`nav-step-${stepNum}`).classList.add('active');

    // Si sale de la pantalla del video, pausar el reproductor por seguridad
    if (screenId !== 'video-screen' && player && typeof player.pauseVideo === 'function') {
        player.pauseVideo();
    }
}

// Botón que lleva del expediente directamente a reproducir el video
function iniciarVideo() {
    irAPantalla('video-screen', 2);
    if (player && typeof player.playVideo === 'function') {
        player.playVideo();
    }
}

// Inicialización oficial de YouTube Iframe API
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

// Monitorear cuando el video está en reproducción o cuando termina
function onPlayerStateChange(event) {
    if (event.data === YT.PlayerState.PLAYING) {
        monitorInterval = setInterval(verificarTiempoVideo, 500);
    } else {
        clearInterval(monitorInterval);
    }

    // Al finalizar el video de 10 minutos, pasar automáticamente a la Propuesta de Intervención
    if (event.data === YT.PlayerState.ENDED) {
        irAPantalla('intervencion-screen', 3);
    }
}

// Comprobar el segundo actual y disparar pop-ups o flashcards
function verificarTiempoVideo() {
    if (!player || typeof player.getCurrentTime !== 'function') return;

    const segundoActual = Math.floor(player.getCurrentTime());
    actualizarRelojVisual(segundoActual);

    eventosDelVideo.forEach(evento => {
        // Rango de 2 segundos de tolerancia para garantizar que siempre se active
        if (segundoActual >= evento.segundoExacto && segundoActual <= evento.segundoExacto + 1 && !evento.mostrado) {
            evento.mostrado = true;
            evento.accion();
        }
    });
}

// Formatear segundos a MM:SS en la pizarra
function actualizarRelojVisual(segundosTotales) {
    const min = String(Math.floor(segundosTotales / 60)).padStart(2, '0');
    const seg = String(segundosTotales % 60).padStart(2, '0');
    document.getElementById('reloj-video').innerText = `${min}:${seg}`;
}

// Mostrar modal y pausar el video automáticamente
function mostrarPopUpYPausar(modalId) {
    if (player && typeof player.pauseVideo === 'function') {
        player.pauseVideo();
    }
    document.getElementById(modalId).classList.remove('hidden');
}

// Cerrar modal y reanudar la reproducción del video
function cerrarModalYReanudar(modalId) {
    document.getElementById(modalId).classList.add('hidden');
    if (player && typeof player.playVideo === 'function') {
        player.playVideo();
    }
}

// Mostrar flashcard estilo nota adhesiva sin pausar el video
function mostrarFlashcardSinPausar(cardId) {
    document.getElementById(cardId).classList.remove('hidden');
}

// Ocultar cualquier ventana emergente sin alterar el estado del video
function ocultarElemento(id) {
    document.getElementById(id).classList.add('hidden');
}

// Mostrar el modal de referencias APA 7
function abrirModalAPA() {
    document.getElementById('modal-apa').classList.remove('hidden');
}