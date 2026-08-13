/* =============================================================================
   app.js  ·  Lógica del sitio (NO necesitas editar esto para agregar contenido)
   Hace tres cosas:
     A) Dibuja las SESIONES y HERRAMIENTAS leyendo js/contenido.js
     B) Revela las secciones al hacer scroll
     C) Anima la "firma" del hero: puntos dispersos -> línea de tendencia
   ============================================================================= */

/* "use strict" activa un modo más estricto de JavaScript (menos errores silenciosos). */
"use strict";

/* ---------------------------------------------------------------------------
   A) DIBUJAR SESIONES
   --------------------------------------------------------------------------- */

/* Traduce cada "tipo" de recurso a una etiqueta corta que se muestra como ícono. */
const ICONO_RECURSO = {
  presentacion: "PPTX",   // Presentaciones
  guia:         "PDF",    // Guías del estudiante
  dataset:      "CSV",    // Conjuntos de datos
  documento:    "DOC",    // Documentos del docente
  enlace:       "URL"     // Enlaces externos
};

/* Traduce el "estado" de la sesión al texto visible de la insignia. */
const TEXTO_ESTADO = {
  completada: "Completada",
  "en-curso": "En curso",
  proxima:    "Próximamente"
};

/* Función que construye el HTML de UN recurso (archivo) de una sesión.          */
/* Recibe un objeto recurso: { tipo, nombre, url }.                              */
function htmlRecurso(recurso) {
  // Busca el ícono según el tipo; si no existe, usa "•".
  const ico = ICONO_RECURSO[recurso.tipo] || "•";

  // CASO 1: no hay url todavía -> marcador "Disponible pronto" (no clickable).
  if (!recurso.url) {
    return `
      <span class="recurso pendiente" aria-disabled="true">
        <span class="ico">${ico}</span>
        ${recurso.nombre}
        <span class="estado">· pronto</span>
      </span>`;
  }

  // CASO 2: hay url -> enlace real de descarga/apertura.
  // target/rel se agregan solo si el enlace es externo (empieza con http).
  const externo = recurso.url.startsWith("http")
    ? ` target="_blank" rel="noopener"`   // Abre en pestaña nueva de forma segura.
    : "";                                 // Archivo local: misma pestaña.
  return `
    <a class="recurso" href="${recurso.url}"${externo}>
      <span class="ico">${ico}</span>
      ${recurso.nombre}
    </a>`;
}

/* Función que construye el HTML de UNA sesión completa.                          */
function htmlSesion(sesion) {
  // Convierte la lista de contenidos en <li>...</li> unidos en un solo texto.
  const contenidos = sesion.contenidos
    .map(t => `<li>${t}</li>`)   // Cada tema -> un <li>.
    .join("");                    // Une todos los <li> en una sola cadena.

  // Convierte la lista de recursos usando la función htmlRecurso de arriba.
  const recursos = sesion.recursos
    .map(htmlRecurso)             // Cada recurso -> su HTML.
    .join("");                    // Une todo.

  // Devuelve el bloque .sesion. La clase incluye el estado para pintar el nodo.
  return `
    <article class="sesion ${sesion.estado} reveal">
      <div class="sesion-cabecera">
        <div>
          <div class="sesion-num">Sesión ${String(sesion.numero).padStart(2, "0")}</div>
          <h3>${sesion.titulo}</h3>
        </div>
        <span class="insignia ${sesion.estado}">${TEXTO_ESTADO[sesion.estado]}</span>
      </div>
      <p class="resumen">${sesion.resumen}</p>
      <ul class="contenidos">${contenidos}</ul>
      <div class="recursos">${recursos}</div>
    </article>`;
}

/* Toma el arreglo SESIONES (de contenido.js) y lo escribe dentro del contenedor. */
function pintarSesiones() {
  // Busca el contenedor por su id en el HTML.
  const contenedor = document.getElementById("sesiones-lista");
  if (!contenedor) return;                        // Si no existe, no hace nada.
  // Genera el HTML de todas las sesiones y lo inserta de una vez.
  contenedor.innerHTML = SESIONES.map(htmlSesion).join("");
}

/* ---------------------------------------------------------------------------
   Dibujar HERRAMIENTAS (Power BI / RStudio) desde contenido.js
   --------------------------------------------------------------------------- */
function pintarHerramientas() {
  const contenedor = document.getElementById("herramientas-grid"); // Contenedor destino.
  if (!contenedor) return;                                          // Salir si no existe.
  // Por cada herramienta, arma una tarjeta; el "acento" define el color (teal/ámbar).
  contenedor.innerHTML = HERRAMIENTAS.map(h => `
    <div class="herramienta ${h.acento === "teal" ? "teal" : "ambar"} reveal">
      <span class="rol-tag">${h.rol}</span>
      <h3>${h.nombre}</h3>
      <p>${h.descripcion}</p>
    </div>`).join("");
}

/* ---------------------------------------------------------------------------
   B) REVELADO AL HACER SCROLL
   Usa IntersectionObserver: cuando un elemento .reveal entra en pantalla,
   se le agrega la clase .visible (el CSS hace la transición de aparición).
   --------------------------------------------------------------------------- */
function activarRevelado() {
  // Selecciona TODOS los elementos con clase .reveal (incluidos los recién creados).
  const elementos = document.querySelectorAll(".reveal");

  // Crea el observador: se dispara cuando cambia la visibilidad de un elemento.
  const observador = new IntersectionObserver((entradas) => {
    // Recorre cada elemento observado que cambió de estado.
    entradas.forEach((entrada) => {
      // Si el elemento está visible en pantalla...
      if (entrada.isIntersecting) {
        entrada.target.classList.add("visible");  // ...lo mostramos (activa la transición).
        observador.unobserve(entrada.target);      // Dejamos de observarlo (ya apareció).
      }
    });
  }, { threshold: 0.12 });                          // Se activa con ~12% del elemento visible.

  // Empezamos a observar cada elemento .reveal.
  elementos.forEach((el) => observador.observe(el));
}

/* ---------------------------------------------------------------------------
   C) FIRMA DEL HERO: puntos dispersos -> línea de tendencia
   Representa la esencia del taller: de datos dispersos a un patrón.
   --------------------------------------------------------------------------- */
function iniciarHero() {
  const canvas = document.getElementById("hero-canvas");   // Lienzo del hero.
  if (!canvas) return;                                     // Salir si no existe.
  const ctx = canvas.getContext("2d");                     // Contexto de dibujo 2D.

  // Colores (coinciden con los tokens del CSS).
  const COLOR_PUNTO = "rgba(53,208,186,0.85)";  // Teal para los puntos.
  const COLOR_LINEA = "rgba(242,176,83,0.9)";   // Ámbar para la línea de tendencia.
  const COLOR_GRID  = "rgba(173,205,205,0.06)"; // Líneas de fondo muy tenues.

  // ¿El usuario pidió menos movimiento? Respetamos su preferencia.
  const sinMovimiento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let puntos = [];   // Aquí guardaremos los puntos de datos.
  let ancho = 0, alto = 0;   // Dimensiones actuales del lienzo (en px CSS).

  /* Ajusta el tamaño del lienzo a su contenedor y a la densidad de pantalla (DPR). */
  function redimensionar() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2); // Nitidez en pantallas retina (máx 2).
    const rect = canvas.getBoundingClientRect();           // Tamaño real en pantalla.
    ancho = rect.width;                                    // Ancho en px CSS.
    alto  = rect.height;                                   // Alto en px CSS.
    canvas.width  = Math.round(ancho * dpr);               // Ancho real del buffer.
    canvas.height = Math.round(alto  * dpr);               // Alto real del buffer.
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);                // Escala el dibujo al DPR.
    generarPuntos();                                       // Recalcula posiciones.
  }

  /* Crea los puntos: una nube con tendencia lineal + ruido (como datos reales).   */
  function generarPuntos() {
    puntos = [];                              // Reinicia la lista.
    const n = ancho < 640 ? 26 : 42;          // Menos puntos en móvil, más en escritorio.
    const margen = 40;                         // Margen interior del lienzo.
    const x0 = margen, x1 = ancho - margen;    // Rango horizontal de dibujo.
    // La "recta base" (tendencia real) va de abajo-izquierda a arriba-derecha.
    const yBaseIzq = alto * 0.78;              // Y de la tendencia en el extremo izquierdo.
    const yBaseDer = alto * 0.30;              // Y de la tendencia en el extremo derecho.

    for (let i = 0; i < n; i++) {              // Genera n puntos.
      const t = i / (n - 1);                   // Proporción 0..1 a lo largo del eje X.
      const x = x0 + t * (x1 - x0);            // Posición X del punto.
      const yTendencia = yBaseIzq + t * (yBaseDer - yBaseIzq);  // Y sobre la recta base.
      const ruido = (Math.random() - 0.5) * alto * 0.20;        // Dispersión vertical.
      puntos.push({
        x: x,                                  // X final (destino).
        y: yTendencia + ruido,                 // Y final (destino, con ruido).
        // Posición inicial ALEATORIA (el punto "entra" desde aquí):
        x0: Math.random() * ancho,
        y0: Math.random() * alto,
        r: 2 + Math.random() * 2               // Radio del punto (tamaño).
      });
    }
    // Guardamos los extremos de la recta base para dibujar la línea de tendencia.
    puntos.tendencia = { x0, y0: yBaseIzq, x1, y1: yBaseDer };
  }

  /* Dibuja una escena según el progreso (0..1): 0 = disperso, 1 = ordenado.       */
  function dibujar(progreso) {
    ctx.clearRect(0, 0, ancho, alto);          // Limpia el lienzo.

    // Rejilla de fondo (dos líneas horizontales tenues) para dar contexto de "gráfico".
    ctx.strokeStyle = COLOR_GRID; ctx.lineWidth = 1;
    for (let g = 1; g <= 3; g++) {
      const yy = (alto / 4) * g;               // Posición de cada línea.
      ctx.beginPath(); ctx.moveTo(0, yy); ctx.lineTo(ancho, yy); ctx.stroke();
    }

    // Suavizado del progreso (easing) para que el movimiento no sea lineal/robótico.
    const e = progreso < 0.5
      ? 2 * progreso * progreso                          // Aceleración inicial.
      : 1 - Math.pow(-2 * progreso + 2, 2) / 2;          // Desaceleración final.

    // Dibuja cada punto interpolando entre su posición inicial y su destino.
    for (const p of puntos) {
      const x = p.x0 + (p.x - p.x0) * e;       // X interpolada.
      const y = p.y0 + (p.y - p.y0) * e;       // Y interpolada.
      ctx.beginPath();
      ctx.arc(x, y, p.r, 0, Math.PI * 2);      // Círculo (punto de datos).
      ctx.fillStyle = COLOR_PUNTO;
      ctx.fill();
    }

    // La línea de tendencia aparece al final (cuando ya hay orden): progreso > 0.55.
    if (progreso > 0.55) {
      const t = puntos.tendencia;                        // Extremos de la recta.
      const avance = (progreso - 0.55) / 0.45;           // 0..1 en el tramo final.
      const xFin = t.x0 + (t.x1 - t.x0) * avance;        // La línea se "dibuja" de izq a der.
      const yFin = t.y0 + (t.y1 - t.y0) * avance;
      ctx.beginPath();
      ctx.moveTo(t.x0, t.y0); ctx.lineTo(xFin, yFin);
      ctx.strokeStyle = COLOR_LINEA; ctx.lineWidth = 2;
      ctx.stroke();
    }
  }

  /* Bucle de animación: avanza el progreso hasta 1 y luego se detiene.            */
  let inicio = null;                            // Marca de tiempo del primer frame.
  const DURACION = 2200;                        // Duración total de la animación (ms).
  function animar(ahora) {
    if (inicio === null) inicio = ahora;        // Guarda el instante inicial.
    const t = Math.min((ahora - inicio) / DURACION, 1); // Progreso 0..1.
    dibujar(t);                                 // Dibuja el frame actual.
    if (t < 1) requestAnimationFrame(animar);   // Sigue mientras no termine.
  }

  // Arranque: ajusta tamaño y decide si animar o mostrar el estado final.
  redimensionar();                              // Prepara el lienzo y los puntos.
  if (sinMovimiento) {
    dibujar(1);                                 // Sin animación: dibuja el resultado final.
  } else {
    requestAnimationFrame(animar);              // Con animación: inicia el bucle.
  }

  // Si cambia el tamaño de la ventana, recalcula y redibuja el estado final.
  let temporizador;                             // Para "debounce" del resize.
  window.addEventListener("resize", () => {
    clearTimeout(temporizador);                 // Cancela el anterior.
    temporizador = setTimeout(() => {           // Espera a que el usuario deje de redimensionar.
      redimensionar();                          // Recalcula tamaño y puntos.
      dibujar(1);                               // Redibuja ya ordenado (sin re-animar).
    }, 150);
  });
}

/* ---------------------------------------------------------------------------
   ARRANQUE: cuando el HTML está listo, ejecuta todo en orden.
   --------------------------------------------------------------------------- */
document.addEventListener("DOMContentLoaded", () => {
  pintarSesiones();      // 1) Escribe las sesiones desde contenido.js.
  pintarHerramientas();  // 2) Escribe las herramientas desde contenido.js.
  activarRevelado();     // 3) Activa la aparición al hacer scroll (tras crear el HTML).
  iniciarHero();         // 4) Inicia la firma animada del hero.
});
