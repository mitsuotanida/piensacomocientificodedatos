/* =============================================================================
   contenido.js  ·  ESTE ES EL ÚNICO ARCHIVO QUE DEBES EDITAR
   =============================================================================
   Aquí vive TODO el contenido que cambia: las sesiones y sus archivos.
   El diseño (css/estilos.css) y la lógica (js/app.js) NO se tocan.

   PARA AGREGAR/ACTIVAR UN ARCHIVO: cambia  url: null  por la ruta o el enlace.
     url: null                         -> se muestra como "Disponible pronto".
     url: "https://.../archivo.pptx"   -> enlace real (Supabase, Drive, GitHub...).
   Estados de sesión: "completada" | "en-curso" | "proxima".
   ============================================================================= */

const SESIONES = [

  /* ---------- SESIÓN 1 ---------- */
  {
    numero: 1,                                            // Número de la sesión.
    titulo: "Pensar como científico de datos",            // Título visible.
    estado: "completada",                                 // Insignia teal "Completada".
    resumen: "Qué es la ciencia de datos, dónde aparecen los datos en la vida "
           + "cotidiana y la diferencia entre opinar e interpretar con evidencia.",
    contenidos: [
      "Presentación del taller y del concepto de ciencia de datos",
      "¿Qué hace un científico de datos? El reportero vs. el detective",
      "Datos en la vida diaria: redes, música, videojuegos, deporte, salud, transporte",
      "Diferencia entre opinar e interpretar con evidencia",
      "Actividad: detectar decisiones cotidianas que mejorarían usando datos"
    ],
    recursos: [
      // Cuando tengas el enlace público del PPTX, reemplaza url: null por la URL.
      { tipo: "presentacion", nombre: "Presentación (16 diapositivas)", url: null },
      { tipo: "documento",    nombre: "Planificación del docente",      url: null },
      { tipo: "guia",         nombre: "Guía del estudiante",            url: null }
    ]
  },

  /* ---------- SESIÓN 2 ---------- */
  {
    numero: 2,
    titulo: "Ingeniería de prompts: hablarle bien a la IA",
    estado: "en-curso",                                   // Insignia ámbar "En curso".
    resumen: "Cómo la forma de preguntar cambia la respuesta de la IA: dar "
           + "contexto, instrucciones claras, ejemplos y formato para lograr mejores resultados.",
    contenidos: [
      "¿Qué es un prompt y por qué la forma de preguntar cambia el resultado?",
      "Anatomía de un buen prompt: rol, contexto, tarea, formato y ejemplos",
      "Técnicas clave: instrucciones claras, dar ejemplos y pensar paso a paso",
      "Errores comunes: prompts vagos, ambiguos o sin contexto",
      "Actividad: reescribir prompts y comparar las respuestas de la IA"
    ],
    recursos: [
      { tipo: "presentacion", nombre: "Presentación",             url: null },
      { tipo: "guia",         nombre: "Guía del estudiante",      url: null },
      { tipo: "documento",    nombre: "Cuaderno de prompts",      url: null }
    ]
  },

  /* ---------- SESIÓN 3 ---------- */
  {
    numero: 3,
    titulo: "Entrenar a la IA con muchos ejemplos",
    estado: "proxima",
    resumen: "Qué significa que un sistema 'aprenda' a partir de ejemplos: cómo "
           + "muchos casos etiquetados le permiten reconocer patrones, clasificar y predecir.",
    contenidos: [
      "¿Qué significa que una IA 'aprenda' de ejemplos?",
      "Datos de entrenamiento: cómo muchos ejemplos enseñan a reconocer patrones",
      "Ejemplos cercanos: clasificar mensajes o imágenes, recomendar y predecir",
      "Más y mejores ejemplos → mejores resultados; el problema de los sesgos",
      "Actividad: 'entrenar' un clasificador a mano etiquetando ejemplos"
    ],
    recursos: [
      { tipo: "presentacion", nombre: "Presentación",                     url: null },
      { tipo: "dataset",      nombre: "Dataset de ejemplos para etiquetar", url: null },
      { tipo: "guia",         nombre: "Guía del estudiante",              url: null }
    ]
  },

  /* ---------- SESIÓN 4 ---------- */
  {
    numero: 4,
    titulo: "Visualizar para entender: mi agenda en Power BI",
    estado: "proxima",
    resumen: "De la tabla al hallazgo: construir una agenda (carta Gantt) en "
           + "Power BI a partir de una tabla propia, con buen formato y lectura correcta.",
    contenidos: [
      "Por qué visualizar: pasar de la tabla al hallazgo",
      "Crear una tabla de tareas y conectarla a Power BI",
      "Construir una agenda / carta Gantt (visual de AppSource o barras apiladas con DAX)",
      "Formato, fechas y buenas prácticas de lectura",
      "Actividad: 'Mi agenda en modo científico de datos'"
    ],
    recursos: [
      { tipo: "presentacion", nombre: "Presentación",                    url: null },
      { tipo: "guia",         nombre: "Guía: Mi agenda en Power BI",     url: null },
      { tipo: "dataset",      nombre: "Archivo Excel de ejemplo (.xlsx)", url: null }
    ]
  },

  /* ---------- SESIÓN 5 ---------- */
  {
    numero: 5,
    titulo: "Laboratorio de análisis: el proyecto",
    estado: "proxima",
    resumen: "Los equipos aplican todo lo aprendido a una situación real: eligen "
           + "tema, organizan datos, buscan patrones y preparan sus conclusiones.",
    contenidos: [
      "Elegir tema y preguntas de investigación",
      "Organizar y explorar los datos del equipo",
      "Buscar patrones y formular conclusiones con evidencia",
      "Preparar la presentación de hallazgos"
    ],
    recursos: [
      { tipo: "documento", nombre: "Rúbrica del proyecto",       url: null },
      { tipo: "guia",      nombre: "Guía de trabajo grupal",     url: null },
      { tipo: "documento", nombre: "Plantilla de presentación",  url: null }
    ]
  },

  /* ---------- SESIÓN 6 ---------- */
  {
    numero: 6,
    titulo: "Exposiciones: presentar como científicos de datos",
    estado: "proxima",
    resumen: "Cada equipo presenta sus hallazgos con claridad y recibe "
           + "retroalimentación. Cierre del taller y proyección de la ciencia de datos y la IA.",
    contenidos: [
      "Exposición de los trabajos grupales",
      "Comunicar resultados de forma clara, lógica y convincente",
      "Retroalimentación sobre el análisis y las conclusiones",
      "Cierre: proyección de la ciencia de datos y la IA"
    ],
    recursos: [
      { tipo: "documento", nombre: "Pauta de presentación", url: null }
    ]
  }

];

/* HERRAMIENTAS del taller (sección "Herramientas"). acento: "teal" o "ambar". */
const HERRAMIENTAS = [
  {
    nombre: "Power BI",
    rol: "El reportero",
    acento: "teal",
    descripcion: "Visualización y tableros. Comunica lo que ya pasó con datos "
               + "claros: tablas, gráficos y KPIs."
  },
  {
    nombre: "RStudio",
    rol: "El detective",
    acento: "ambar",
    descripcion: "Análisis estadístico y modelamiento en R. Busca patrones, "
               + "prueba hipótesis y anticipa lo que podría pasar."
  }
];
