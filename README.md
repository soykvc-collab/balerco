# Sitio web de Balerco

Sitio web de una sola página (one-page), rápido, responsive y optimizado para
Google. Está hecho con HTML, CSS y JavaScript puros: **no necesita instalar nada
ni compilar**. Se puede subir tal cual a cualquier hosting.

Inspiración de estructura: *Bradford — Built Different*. Identidad: colores y
marca de Balerco (naranja + azul navy + paleta "caja de juguetes").

---

## 📁 Estructura de archivos

```
Balerco/
├── index.html              ← la página (contenido y textos)
├── assets/
│   ├── css/styles.css      ← todos los estilos (colores, tipografías, diseño)
│   ├── js/main.js          ← interacciones (menú, video del hero, acordeón, galería…)
│   ├── video/
│   │   └── hero-playground.mp4  ← video del inicio (hero)
│   └── img/
│       ├── logo.png        ← logo oficial de Balerco
│       ├── hero-poster.jpg ← imagen fija del video mientras carga
│       ├── favicon.svg     ← ícono de la pestaña del navegador
│       ├── og-image.svg    ← imagen para compartir en redes (ver punto 6)
│       ├── proyectos/      ← fotos reales de la galería de proyectos
│       └── iconos/        ← íconos 3D de las tarjetas "Por qué Balerco"
├── robots.txt              ← permite que Google indexe el sitio
├── sitemap.xml             ← mapa del sitio para buscadores
├── site.webmanifest        ← datos para instalar como app
└── README.md               ← este archivo
```

---

## 👀 Ver el sitio en tu computador

Solo abre `index.html` en tu navegador (doble clic). Para que todo funcione al
100% (incluido el menú), es mejor usar un pequeño servidor local:

```bash
python -m http.server 5510
```

Luego abre `http://localhost:5510` en el navegador.

---

## ✏️ Qué personalizar antes de publicar

### 1. Cifras reales (¡importante!)
En `index.html`, busca la sección **CIFRAS** y reemplaza los números de ejemplo
por los tuyos:

```html
<span class="stat__num" data-count="150" data-suffix="+">0</span>  <!-- Proyectos -->
<span class="stat__num" data-count="10"  data-suffix="+">0</span>  <!-- Años -->
<span class="stat__num" data-count="25"  data-suffix="+">0</span>  <!-- Ciudades -->
```

Cambia el número dentro de `data-count`. Si no quieres mostrar cifras, puedes
borrar toda la sección `<section class="stats">…</section>`.

### 2. Logo
Ya está puesto tu **logo oficial** (`assets/img/logo.png`), tomado de tu sitio
actual. Si tienes una versión en mejor resolución o en `.svg`, reemplaza ese
archivo (con el mismo nombre) y listo.

### Íconos 3D de las tarjetas

Los cuatro íconos de "Por qué Balerco" (`assets/img/iconos/`) son emojis 3D de
**Microsoft Fluent Emoji**, con licencia MIT, así que se pueden usar sin problema
en un sitio comercial. Están guardados en el proyecto, no se cargan de internet.
Si quieres cambiar alguno, busca otro en
<https://github.com/microsoft/fluentui-emoji> (carpeta `3D`), guárdalo en
`assets/img/iconos/` y cambia el `src` en `index.html`.

> Sugerencia: en el pie de página (fondo azul oscuro) el eslogan azul del logo se
> ve un poco tenue. Si quieres, envíame una versión del logo con el eslogan en
> blanco y la pongo solo ahí.

### 3. Fotos de proyectos (galería)
Ya hay una sección **Proyectos** con 6 fotos reales de tus parques (tomadas de tu
sitio actual), guardadas en `assets/img/proyectos/`. Para agregar o cambiar fotos:

1. Guarda la nueva imagen en `assets/img/proyectos/` con un **nombre descriptivo**
   (ej: `parque-conjunto-chia.jpg`) — los nombres descriptivos ayudan al SEO.
2. En `index.html`, dentro de la sección Proyectos, copia un bloque
   `<button class="gallery__item">…</button>` y cambia `data-full`, el `src`, el
   `alt` (descripción de la foto) y el texto del `<span class="gallery__cap">`.

La galería se acomoda sola con fotos horizontales o verticales, y cada foto se
amplía al hacer clic.

### 3.1. Video del inicio (hero)
El inicio muestra un **video** que ocupa toda la pantalla y, al hacer scroll, se
encoge hasta convertirse en una tarjeta con esquinas redondeadas (igual que el
sitio de referencia). Para cambiar el video:

1. Comprime tu video a MP4 (sin audio, ~1920px de ancho) y guárdalo como
   `assets/video/hero-playground.mp4` (mismo nombre).
2. Actualiza también `assets/img/hero-poster.jpg` (una imagen fija del video que
   se ve mientras carga).

> El encogimiento está ligado al scroll (solo se mueve cuando la persona
> desplaza la página), por eso se mantiene incluso con "reducir movimiento"
> activado. El video se reproduce solo, en silencio y en bucle.

### 4. Redes sociales
Busca `sameAs` en `index.html` (dentro del bloque JSON-LD) y también los enlaces
del pie de página, y reemplaza por tus URLs reales de Facebook, Instagram y X:

```
https://www.facebook.com/balerco   → tu página real
https://www.instagram.com/balerco  → tu perfil real
```

### 5. Formulario de contacto (para recibir los mensajes)
Hoy el botón "Enviar solicitud" abre el correo del visitante con los datos
(funciona, pero es básico). Para recibir los mensajes directo en tu bandeja,
conecta un servicio gratuito como **Formspree**:

1. Crea una cuenta gratis en <https://formspree.io>.
2. Crea un formulario y copia tu ID (algo como `xayzabcd`).
3. En `index.html`, busca `TU_ID_FORMSPREE` y reemplázalo:
   ```html
   <form class="form" action="https://formspree.io/f/xayzabcd" method="POST">
   ```

El botón de **WhatsApp** ya funciona y escribe al +57 318 338 1896.

### 6. Imagen para compartir en redes (Open Graph)
Cuando alguien comparte el enlace en WhatsApp/Facebook, se muestra una imagen.
Está diseñada en `assets/img/og-image.svg`, pero las redes prefieren `.png`.

**Exporta el SVG a PNG de 1200×630 px** y guárdalo como
`assets/img/og-image.png`. Puedes hacerlo gratis en <https://cloudconvert.com/svg-to-png>
(pon 1200×630) o con cualquier editor. Las etiquetas del `<head>` ya apuntan a
ese archivo `.png`.

---

## 🚀 Cómo publicarlo (deployment)

Cualquiera de estas opciones sirve. Las dos primeras son gratis y muy fáciles:

### Opción A — Netlify (recomendada, gratis)
1. Entra a <https://app.netlify.com/drop>.
2. Arrastra la carpeta `Balerco` completa a la ventana.
3. ¡Listo! Te da un enlace. Luego puedes conectar tu dominio `balerco.co`.

### Opción B — Vercel (gratis)
Similar a Netlify, en <https://vercel.com>.

### Opción C — Tu hosting actual (cPanel / FTP)
Sube **todo el contenido** de la carpeta `Balerco` a la carpeta pública de tu
servidor (normalmente `public_html`). El archivo `index.html` debe quedar en la
raíz del dominio.

> Después de publicar, revisa que la dirección del sitio en `sitemap.xml`,
> `robots.txt` y las etiquetas `og:url`/`canonical` del `index.html` coincida con
> tu dominio final (`https://balerco.co/`).

---

## 🔎 Para que Google te encuentre (SEO)

El sitio ya trae lo técnico listo: etiquetas de título y descripción, datos
estructurados de negocio local (para tu ficha en Google), `sitemap.xml`,
`robots.txt`, textos en español y buena velocidad. Para completar:

1. **Google Search Console** → <https://search.google.com/search-console>
   Verifica tu dominio y envía `https://balerco.co/sitemap.xml`.
2. **Perfil de Empresa en Google** (antes "Google My Business") →
   <https://business.google.com>. Es lo que más ayuda a aparecer en Google Maps y
   en búsquedas locales como "parques infantiles en Bogotá". Agrega dirección,
   teléfono, horario y fotos.
3. Pide **reseñas** a tus clientes en ese perfil.
4. Mantén el **teléfono, dirección y correo idénticos** en el sitio, en Google y
   en tus redes (Google premia la coherencia).
5. Agrega **fotos reales** con nombres descriptivos (ej: `parque-infantil-conjunto-bogota.jpg`).

---

## 🎨 Referencia rápida de marca

| Uso                | Color      | Código     |
|--------------------|------------|------------|
| Naranja principal  | Naranja    | `#F6851F`  |
| Azul navy (texto)  | Navy       | `#16223B`  |
| Fondo crema        | Crema      | `#FFF6EC`  |
| Amarillo (sol)     | Sol        | `#FFC61E`  |
| Azul cielo         | Cielo      | `#1FA6E0`  |
| Verde pasto        | Pasto      | `#43B54A`  |
| Rosa cereza        | Cereza     | `#E94F8A`  |

**Tipografías** (se cargan solas desde Google Fonts):
- Títulos y texto: *Poppins* (la misma tipografía de tu marca)

> Nota técnica: los enlaces al CSS y JS terminan en `?v=1`. Si haces cambios y no
> los ves reflejados, sube ese número (`?v=2`) para forzar la actualización en el
> navegador de tus visitantes.

---

¿Quieres que agregue una galería de proyectos, una sección de preguntas
frecuentes, o versiones del sitio en varios idiomas? Con gusto lo hacemos.
