// Generador estático sin dependencias: node src/build.mjs
// Lee src/content.json (texto extraído del sitio original) y las páginas de src/pages/*.mjs,
// y escribe el sitio completo en dist/.

import { createHash } from 'node:crypto';
import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');
const write = (rel, data) => {
  const file = join(dist, rel);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, data);
};

rmSync(dist, { recursive: true, force: true });
mkdirSync(dist, { recursive: true });
cpSync(join(root, 'assets'), join(dist, 'assets'), { recursive: true });

// Huella de css y js: se añade como ?v= para que un despliegue nuevo salte la caché.
const hash = createHash('md5');
for (const dir of ['css', 'js']) {
  for (const f of readdirSync(join(root, 'assets', dir)).sort()) hash.update(readFileSync(join(root, 'assets', dir, f)));
}
const v = hash.digest('hex').slice(0, 8);

// Sprite de iconos (Phosphor, licencia MIT) a partir de src/icons/*.svg.
const symbols = readdirSync(join(root, 'src/icons'))
  .filter((f) => f.endsWith('.svg'))
  .sort()
  .map((f) => {
    const svg = readFileSync(join(root, 'src/icons', f), 'utf8');
    const viewBox = svg.match(/viewBox="([^"]+)"/)[1];
    const inner = svg.replace(/^[\s\S]*?<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '');
    return `<symbol id="${f.replace('.svg', '')}" viewBox="${viewBox}">${inner}</symbol>`;
  })
  .join('');
write('assets/icons.svg', `<svg xmlns="http://www.w3.org/2000/svg">${symbols}</svg>`);

// Copia de pruebas: que ningún buscador la indexe.
write('robots.txt', 'User-agent: *\nDisallow: /\n');

const content = JSON.parse(readFileSync(join(root, 'src/content.json'), 'utf8'));
const seen = new Set();
let count = 0;
for (const f of readdirSync(join(root, 'src/pages')).filter((n) => n.endsWith('.mjs')).sort()) {
  const mod = await import(pathToFileURL(join(root, 'src/pages', f)).href);
  for (const page of mod.pages({ content, v })) {
    if (seen.has(page.path)) throw new Error(`Ruta duplicada: ${page.path}`);
    seen.add(page.path);
    const rel = page.path.endsWith('.html') ? page.path.slice(1) : join(page.path.slice(1), 'index.html');
    write(rel, page.html);
    count++;
  }
}
if (!existsSync(join(dist, '404.html'))) throw new Error('Falta 404.html');
console.log(`dist/ generado: ${count} páginas, assets v=${v}`);
