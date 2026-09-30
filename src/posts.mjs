// Entradas del blog a partir de src/content.json (texto original, sin modificar).

const MONTHS = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];

// La imagen de la primera entrada devuelve 404 en el sitio original: se sustituye por otra foto del despacho.
const COVERS = {
  'los-problemas-mas-comunes-en-las-comunidades-de-vecinos-y-como-un-administrador-de-fincas-los-resuelve': '/assets/img/hero-oficina.webp',
  'bienvenidos-a-la-nueva-web-de-curia-abogados': '/assets/img/1789572567806-djm6xc.webp',
};

export function isoDate(text) {
  const m = text.match(/^(\d{1,2}) de (\w+) de (\d{4})$/);
  return `${m[3]}-${String(MONTHS.indexOf(m[2]) + 1).padStart(2, '0')}-${m[1].padStart(2, '0')}`;
}

export function getPosts(content) {
  const list = content['/blog'].blocks;
  const posts = [];
  for (let i = 0; i < list.length; i++) {
    if (list[i].t !== 'h2') continue;
    const title = list[i].x;
    const slug = Object.keys(content).find((k) => k.startsWith('/blog/') && content[k].blocks.some((b) => b.t === 'h1' && b.x === title)).slice(6);
    const date = list[i - 1].x;
    posts.push({ slug, title, date, iso: isoDate(date), excerpt: list[i + 1].x, cover: COVERS[slug] });
  }
  return posts;
}

export const postCard = (p, d = 0, h = 'h3') => `
<article class="post-card reveal" data-d="${d}">
  <img src="${p.cover}" width="1077" height="976" alt="" loading="lazy">
  <time datetime="${p.iso}">${p.date}</time>
  <${h}><a href="/blog/${p.slug}/">${p.title}</a></${h}>
  <p>${p.excerpt}</p>
</article>`;
