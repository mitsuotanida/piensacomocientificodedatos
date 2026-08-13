# Piensa como científico de datos · Sitio del taller

Sitio web estático (sin framework ni compilación) para el taller de
enseñanza media. Diseño y contenido están **separados**: para actualizar
el curso solo se toca `js/contenido.js`.

## Estructura

```
index.html          Estructura de la página (no se edita para agregar contenido)
css/estilos.css     Diseño: colores, tipografías, animaciones (no se toca)
js/contenido.js     ← EL ÚNICO ARCHIVO A EDITAR: sesiones y archivos
js/app.js           Lógica que dibuja el contenido (no se toca)
```

## Cómo agregar o activar un archivo (guía, presentación, dataset)

En `js/contenido.js`, dentro de la sesión que corresponda, cambia:

```js
url: null                        // se muestra como "Disponible pronto"
```

por el enlace público real:

```js
url: "https://.../archivo.pptx"  // enlace real (Drive, Supabase, GitHub…)
```

Guarda, haz `commit` y `push`: Vercel redespliega el sitio automáticamente.

## Despliegue

Conectado a Vercel. Cada `push` a la rama principal genera un nuevo
despliegue de producción. No requiere comando de build (framework: *Other*).
