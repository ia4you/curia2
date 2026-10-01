// Páginas interiores: servicios, áreas de derecho, fincas, blog, entradas y textos legales.
// Todo el texto sale de src/content.json (copiado del sitio original).

import { AREAS, cta, esc, icon, shell } from '../layout.mjs';
import { getPosts, postCard } from '../posts.mjs';

const IMG = { oficina: '/assets/img/equipo-oficina.webp', consulta: '/assets/img/equipo-consulta.webp' };
const ALT = {
  '/assets/img/equipo-oficina.webp': 'Las dos abogadas de Curia Abogados en su despacho',
  '/assets/img/equipo-consulta.webp': 'Las dos abogadas revisando un caso en la mesa de consulta',
};

// El original escribe estos títulos en mayúsculas; aquí van en formato oración.
const sentence = (t) => {
  const s = t.charAt(0) + t.slice(1).toLowerCase();
  return s.replace(/curia abogados/gi, 'Curia Abogados').replace(/\bsmac\b/gi, 'SMAC');
};

// Direcciones de correo del texto legal convertidas en enlaces.
const linkify = (t) => esc(t).replace(/[\w.-]+@[\w.-]+\.\w+/g, (m) => `<a href="mailto:${m}">${m}</a>`);

const crumbs = (items) =>
  `<nav aria-label="Migas de pan"><ol class="crumbs">${items
    .map((i, n) => (n === items.length - 1 ? `<li aria-current="page">${esc(i.label)}</li>` : `<li><a href="${i.href}">${esc(i.label)}</a></li>`))
    .join('')}</ol></nav>`;

// Cabecera de página interior: bloque verde profundo. image => foto vertical en arco; compact => titulares largos.
export function pageHead({ trail, title, lead, image, kicker = '', compact = false }) {
  const media = image
    ? `<div class="arch" data-in data-d="2"><img src="${image}" width="1077" height="976" alt="${ALT[image]}" fetchpriority="high"></div>`
    : '';
  return `
<section class="page-head deep on-deep${compact ? ' compact' : ''}" aria-labelledby="page-title">
  <div class="wrap">
    ${crumbs(trail)}
    <div class="page-head-grid${image ? '' : ' no-media'}">
      <div>
        ${kicker}
        <h1 id="page-title" data-in>${esc(title)}</h1>
        ${lead ? `<p class="lead" data-in data-d="1">${esc(lead)}</p>` : ''}
      </div>
      ${media}
    </div>
  </div>
</section>`;
}

const benefits = ({ title, items, image }) => `
<section class="section section-paper" aria-labelledby="benefits-title">
  <div class="wrap benefits">
    <figure class="media reveal"><img src="${image}" width="1077" height="976" alt="${ALT[image]}" loading="lazy"></figure>
    <div class="reveal" data-d="1">
      <h2 id="benefits-title">${esc(sentence(title))}</h2>
      <ul class="checks">${items.map((i) => `<li>${esc(i)}</li>`).join('')}</ul>
    </div>
  </div>
</section>`;

// ---------- Servicios y fincas ----------
function servicePage({ content, v, path, name }) {
  const b = content[path].blocks;
  const first = b.find((x) => x.t === 'img');
  const head = first.src.includes('consulta') ? IMG.consulta : IMG.oficina;
  const other = head === IMG.oficina ? IMG.consulta : IMG.oficina;
  const defs = [];
  b.forEach((x, i) => {
    if (x.t === 'h3') defs.push({ h: x.x, p: b[i + 1].x });
  });
  const ventajas = b.find((x) => x.t === 'h2' && x.x.startsWith('VENTAJAS'));
  const items = b.filter((x) => x.t === 'li').map((x) => x.x);
  const body = `
${pageHead({
  trail: [{ label: 'Inicio', href: '/' }, { label: name }],
  title: b.find((x) => x.t === 'h1').x,
  lead: b.find((x) => x.t === 'p').x,
  image: head,
})}
<section class="section" aria-label="Servicios">
  <div class="wrap">
    <ul class="defs">${defs
      .map((d) => `<li class="reveal"><h2>${esc(d.h)}</h2><p>${esc(d.p)}</p></li>`)
      .join('')}</ul>
  </div>
</section>
${benefits({ title: ventajas.x, items, image: other })}
${cta()}`;
  return { path: `${path}/`, html: shell({ title: content[path].title, desc: content[path].desc, body, v, current: path === '/administradores-de-fincas' ? 'fincas' : '', section: path === '/administradores-de-fincas' ? '' : 'areas' }) };
}

// ---------- Áreas de derecho ----------
function areasPage({ content, v }) {
  const path = '/areas-de-derecho';
  const b = content[path].blocks;
  const groups = [];
  b.forEach((x, i) => {
    if (x.t === 'h2' && x.x.startsWith('Derecho ')) {
      const items = [];
      for (let j = i + 2; b[j] && b[j].t === 'li'; j++) items.push(b[j].x);
      groups.push({ title: x.x, text: b[i + 1].x, items, id: x.x.toLowerCase().replace(/ /g, '-') });
    }
  });
  const why = b.find((x) => x.t === 'h2' && x.x.startsWith('POR QUÉ'));
  const whyItems = b.slice(b.indexOf(why) + 1).filter((x) => x.t === 'li').map((x) => x.x);
  const index = groups.map((g) => `<a href="#${g.id}">${esc(g.title.replace('Derecho ', ''))}</a>`).join('');
  const body = `
${pageHead({
  trail: [{ label: 'Inicio', href: '/' }, { label: 'Áreas de derecho' }],
  title: b.find((x) => x.t === 'h1').x,
  lead: b.find((x) => x.t === 'p').x,
  image: IMG.oficina,
})}
<section class="section">
  <div class="wrap areas">
    <nav class="areas-index" aria-label="Salta a"><p>Salta a:</p>${index}</nav>
    <div>${groups
      .map(
        (g) => `
      <section class="area reveal" id="${g.id}" aria-labelledby="${g.id}-t">
        <h2 id="${g.id}-t">${esc(g.title)}</h2>
        <p>${esc(g.text)}</p>
        <ul class="checks">${g.items.map((i) => `<li>${esc(i)}</li>`).join('')}</ul>
      </section>`
      )
      .join('')}
    </div>
  </div>
</section>
${benefits({ title: why.x, items: whyItems, image: IMG.consulta })}
${cta()}`;
  return { path: `${path}/`, html: shell({ title: content[path].title, desc: content[path].desc, body, v, current: 'areas' }) };
}

// ---------- Blog ----------
function blogIndex({ content, v }) {
  const b = content['/blog'].blocks;
  const cards = getPosts(content).map((p, i) => postCard(p, i % 2, 'h2')).join('');
  const body = `
${pageHead({
  trail: [{ label: 'Inicio', href: '/' }, { label: 'Blog' }],
  title: b.find((x) => x.t === 'h1').x,
  lead: b.find((x) => x.t === 'p').x,
})}
<section class="section">
  <div class="wrap"><div class="posts">${cards}</div></div>
</section>`;
  return { path: '/blog/', html: shell({ title: content['/blog'].title, desc: content['/blog'].desc, body, v, current: 'blog' }) };
}

function postPage({ content, v, post }) {
  const path = `/blog/${post.slug}`;
  const text = content[path].blocks.find((x) => x.t === 'body').x;
  // El cuerpo original es texto plano: una línea corta sin punto final es un subtítulo.
  const html = text
    .split(/\n{2,}/)
    .map((para) => {
      const t = para.trim();
      return t.length < 90 && !/[.:?!]$/.test(t) && !t.includes('\n') ? `<h2>${esc(t)}</h2>` : `<p>${esc(t)}</p>`;
    })
    .join('\n');
  const body = `
${pageHead({
  trail: [{ label: 'Inicio', href: '/' }, { label: 'Blog', href: '/blog/' }, { label: 'Entrada' }],
  title: post.title,
  kicker: `<time class="post-date" datetime="${post.iso}">${post.date}</time>`,
  compact: true,
})}
<article class="section" aria-labelledby="page-title">
  <div class="wrap">
    <figure class="article-cover"><img src="${post.cover}" width="1077" height="976" alt="" fetchpriority="high"></figure>
    <div class="prose">${html}</div>
  </div>
</article>`;
  return { path: `${path}/`, html: shell({ title: content[path].title, desc: content[path].desc, body, v, current: 'blog' }) };
}

// ---------- Textos legales (copia literal, con la fecha del original) ----------
function legalPage({ content, v, path }) {
  const b = content[path].blocks;
  const h1 = b.find((x) => x.t === 'h1').x;
  const updated = b.find((x) => x.t === 'p' && x.x.startsWith('Última actualización')).x;
  let out = '';
  for (let i = 0; i < b.length; i++) {
    const x = b[i];
    if (x.t === 'h2') out += `<h2>${esc(x.x)}</h2>`;
    else if (x.t === 'p' && x.x !== updated) out += `<p>${linkify(x.x)}</p>`;
    else if (x.t === 'li') {
      if (b[i - 1].t !== 'li') out += '<ul class="plain">';
      out += `<li>${linkify(x.x)}</li>`;
      if (!b[i + 1] || b[i + 1].t !== 'li') out += '</ul>';
    }
  }
  const body = `
${pageHead({ trail: [{ label: 'Inicio', href: '/' }, { label: h1 }], title: h1, lead: updated, compact: true })}
<div class="section">
  <div class="wrap"><div class="prose">${out}</div></div>
</div>`;
  return { path: `${path}/`, html: shell({ title: content[path].title, desc: content[path].desc, body, v }) };
}

export function pages({ content, v }) {
  const list = [];
  for (const a of AREAS) list.push(servicePage({ content, v, path: `/${a.slug}`, name: a.name }));
  list.push(servicePage({ content, v, path: '/administradores-de-fincas', name: 'Administradores de fincas' }));
  list.push(areasPage({ content, v }));
  list.push(blogIndex({ content, v }));
  for (const post of getPosts(content)) list.push(postPage({ content, v, post }));
  for (const path of ['/aviso-legal', '/politica-de-privacidad', '/cookies', '/terminos-y-condiciones']) list.push(legalPage({ content, v, path }));
  return list;
}
