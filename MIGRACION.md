# Migración a balerco.co

El sitio nuevo vive hoy en `https://soykvc-collab.github.io/balerco/`.
El dominio `balerco.co` sirve todavía el sitio anterior, hecho en WordPress
y alojado en GoDaddy (el DNS apunta a `ns15.domaincontrol.com`).

Mientras no se haga este cambio, nada de lo que mejoremos aquí posiciona:
Google indexa `balerco.co`, no la dirección de GitHub.

---

## 1. Las direcciones que ya existen

El sitio actual tiene cinco páginas públicas. Las comprobé una por una: todas
responden 200, así que cualquiera puede estar indexada y tener enlaces desde
fuera. Si el dominio cambia de sitio sin más, las cinco devuelven 404 y se
pierde lo que hayan acumulado.

| Dirección actual   | A dónde debe llevar          |
| ------------------ | ---------------------------- |
| `/`                | `/`                          |
| `/contactanos/`    | `/#contacto`                 |
| `/balerco-lab/`    | `/#nosotros`                 |
| `/breeze/`         | `/marcas.html#breeze-creative` |
| `/proludic/`       | `/marcas.html#proludic`      |
| `/ropecamp/`       | `/marcas.html#ropecamp`      |

**`/balerco-lab/` no es una marca aliada.** Leí la página: es el "quiénes
somos" de Balerco, con misión y visión. De hecho, la frase del pie del sitio
nuevo ("Contamos con todas las herramientas para crear lugares soñados…")
sale de ahí. Va a `/#nosotros`.

**Las otras tres sí son fabricantes.** Proludic (francés, equipamiento de
juego y deporte), Ropecamp (estructuras de cuerda y tubo) y Breeze Creative
(experiencias interactivas y realidad aumentada). En la reunión el cliente
dijo que quiere quitarles protagonismo y venderse como empresa.

Quitarles protagonismo no es lo mismo que botar el tráfico. La solución
—ya construida— es una página propia, `marcas.html`, con un apartado por
fabricante y un único enlace desde la sección de Productos. Así:

- Quien busque "Proludic Colombia" cae en una página **de Balerco**.
- Las marcas salen de la portada, que es lo que pidieron.
- La redirección 301 aterriza en una página del mismo tema, que es la
  condición para que pase el valor completo.

La alternativa —un apartado dentro de la portada— no sirve igual: `/#marcas`
no es una dirección distinta para Google, así que el valor se consolidaría en
la portada y ninguna búsqueda por nombre de marca encontraría nada.

El texto de esa página sale de lo que ellos mismos escribieron en las
páginas actuales. Falta pedirles los logos de los tres fabricantes y
confirmar si Breeze Creative sigue vigente en el portafolio.

También conviene revisar `/feed/` y `/comments/feed/`, que son los canales RSS
que genera WordPress. No hacen falta en el sitio nuevo.

## 2. El alojamiento tiene que poder hacer 301

GitHub Pages **no hace redirecciones del lado del servidor**. Solo se podría
dejar un archivo HTML en cada ruta con un `meta refresh`, que funciona para la
persona pero vale bastante menos para Google que un 301 de verdad.

Recomendación: mover el alojamiento a **Cloudflare Pages** o **Netlify**. Los
dos son gratis para un sitio estático como este, se conectan al mismo
repositorio de GitHub y sí permiten declarar redirecciones 301 en un archivo.
El cambio no toca el código del sitio.

## 3. Orden del cambio

1. ~~Decidir qué pasa con las cuatro páginas de marcas (punto 1).~~ Hecho:
   `/balerco-lab/` va a `/#nosotros` y las otras tres a `marcas.html`.
2. Montar el sitio en Cloudflare Pages o Netlify desde este repositorio.
3. Cargar ahí las redirecciones 301 de la tabla.
4. Recién entonces apuntar el DNS de `balerco.co` al alojamiento nuevo.
5. Comprobar que las cinco direcciones viejas redirigen bien.
6. Dar de alta el sitio en Google Search Console y enviar `sitemap.xml`.
7. Pedir la indexación de la portada y de `/proyectos.html`.

El paso 4 es el único que necesita el acceso al panel del dominio.

## 4. Pendientes del cliente que tocan el posicionamiento

- **Teléfono.** El comparativo trae dos números distintos: +57 313 333 0373 en
  el pie y +57 305 746 0152 en el formulario. Hay que cerrar cuál es, porque
  Google compara el teléfono del sitio con el de la ficha de Google y premia
  que coincidan.
- **Ficha de Google Business.** No existe. Es lo que más mueve la aguja en
  búsquedas locales. Se puede abrir con `balercosas@gmail.com` y pasar la
  propiedad después a un correo del dominio.
- **Correo del dominio.** `balerco.co` no tiene registros MX, así que
  `info@balerco.co` no existe todavía. (`balerco.com` no es de ellos: es un
  dominio en venta.)
- **`politica-de-datos.html`** nombra `contactenos@balerco.com.co` como canal
  de atención. Ese dominio no resuelve, así que ese correo no recibe nada. Es
  el canal que exige la Ley 1581, conviene cambiarlo por uno que funcione.
