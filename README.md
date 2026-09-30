# Curia Abogados (curia2.turel.es)

Rediseño estático de curia.turel.es: HTML, CSS y JS propios, sin dependencias ni servidor de aplicaciones. Una copia de pruebas con `noindex`.

## Build

```sh
node src/build.mjs        # o: npm run build
node scripts/contrast.mjs # comprueba el contraste WCAG de la paleta
```

Requiere Node 18 o superior. Genera `dist/` a partir de `src/` (páginas y `content.json`) y `assets/`. **`dist/` se commitea**: el Dockerfile solo lo copia, no necesita Node.

Activa una vez el hook que regenera `dist/` antes de cada commit y aborta si no está en el índice:

```sh
git config core.hooksPath scripts/hooks
```

Prueba local con Docker:

```sh
docker build -t curia2 . && docker run --rm -p 8080:80 curia2   # http://localhost:8080
```

## Despliegue en Dokploy

1. Nueva aplicación desde este repositorio, rama `main`.
2. Tipo de build: **Dockerfile** (ruta `./Dockerfile`, contexto `.`).
3. Puerto del contenedor: **80**.
4. Dominio: `curia2.turel.es`, puerto 80, **HTTPS** activado (Let's Encrypt).
5. Despliega. Cada cambio: `npm run build`, commit (incluido `dist/`) y redeploy.

## Retirar el noindex al pasar a producción

Mientras esté en curia2, nada debe indexarse. Para abrirlo a buscadores, cambia estas tres cosas y vuelve a construir y desplegar:

1. `src/layout.mjs`: elimina la línea `<meta name="robots" content="noindex, nofollow">` (y el comentario que la precede).
2. `src/build.mjs`: elimina la escritura de `robots.txt` (o sustitúyela por `Allow: /`).
3. `nginx.conf`: elimina la cabecera `X-Robots-Tag`.

## Formulario

`/contacto/` es una versión de demostración: no envía nada ni hace peticiones. El punto donde conectar el envío real está marcado con `TODO` en `assets/js/contact-form.js`. La CSP de `nginx.conf` (`connect-src 'none'`, `form-action 'none'`) habrá que ajustarla entonces.
