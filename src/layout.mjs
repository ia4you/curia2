// Piezas comunes: <head>, cabecera, pie, barra de llamada y banda de contacto.

export const SITE = {
  name: 'Curia Abogados',
  phone: '928 248 581',
  phoneHref: 'tel:+34928248581',
  phone2: '679 721 167',
  phone2Href: 'tel:+34679721167',
  email: 'info@curiaabogados.es',
  street: 'C/ León y Castillo 39, 5B',
  city: 'Las Palmas de Gran Canaria',
  blurb:
    'Despacho de abogados en Las Palmas de Gran Canaria. Queremos ayudarte a solucionar todo tipo de conflictos que se originan en la vida cotidiana de las personas.',
  socials: [
    { label: 'Facebook', icon: 'facebook-logo', href: 'https://www.facebook.com/Curia-Abogados-104618574853391' },
    { label: 'LinkedIn', icon: 'linkedin-logo', href: 'https://www.linkedin.com/company/74266128/' },
    { label: 'Instagram', icon: 'instagram-logo', href: 'https://www.instagram.com/curiaabogados/' },
  ],
};

export const AREAS = [
  { slug: 'divorcio', name: 'Divorcio' },
  { slug: 'guarda-y-custodia', name: 'Guarda y Custodia' },
  { slug: 'despidos', name: 'Despidos' },
  { slug: 'robos-o-hurtos', name: 'Robos o Hurtos' },
  { slug: 'estafas', name: 'Estafas' },
  { slug: 'lesiones', name: 'Lesiones' },
];

const NAV = [
  { href: '/areas-de-derecho/', label: 'Áreas de derecho', key: 'areas' },
  { href: '/administradores-de-fincas/', label: 'Administradores de fincas', key: 'fincas' },
  { href: '/#about', label: 'Sobre nosotros', key: 'about' },
  { href: '/blog/', label: 'Blog', key: 'blog' },
  { href: '/contacto/', label: 'Contacto', key: 'contacto' },
];

export const esc = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export const icon = (name, cls = '') =>
  `<svg class="icon${cls ? ' ' + cls : ''}" aria-hidden="true" focusable="false"><use href="/assets/icons.svg#${name}"></use></svg>`;

export const cta = () => `
<section class="cta on-teal" aria-labelledby="cta-title">
  <div class="wrap cta-grid">
    <div class="reveal">
      <h2 id="cta-title">¿Tienes un problema?</h2>
      <p>Contacta con nosotros y pongámonos manos a la obra para solucionarlo.</p>
    </div>
    <a class="btn btn-ink reveal" href="/contacto/">Consulta online</a>
  </div>
</section>`;

function header(current, section) {
  const items = NAV.map((n) => {
    const aria = n.key === current ? ' aria-current="page"' : '';
    const cls = n.key === section ? ' class="is-section"' : '';
    return `<li><a href="${n.href}"${aria}${cls}>${n.label}</a></li>`;
  }).join('');
  return `
<header class="site-header">
  <div class="wrap">
    <a class="brand" href="/" aria-label="Curia Abogados, ir a la portada">
      <img src="/assets/img/logo.png" width="227" height="60" alt="Curia Abogados">
    </a>
    <button class="menu-button" type="button" data-menu-button aria-expanded="false" aria-controls="site-nav" aria-label="Abrir menú">
      ${icon('list', 'icon-open')}${icon('x', 'icon-close')}
    </button>
    <nav class="site-nav" id="site-nav" aria-label="Principal">
      <ul class="nav-list">
        ${items}
        <li><a class="btn" href="/contacto/">Consulta online</a></li>
      </ul>
    </nav>
  </div>
</header>`;
}

function footer() {
  const areas = AREAS.map((a) => `<li><a href="/${a.slug}/">${a.name}</a></li>`).join('');
  const socials = SITE.socials
    .map(
      (s) =>
        `<a href="${s.href}" target="_blank" rel="noopener noreferrer" aria-label="${s.label} (se abre en una pestaña nueva)">${icon(s.icon)}</a>`
    )
    .join('');
  return `
<footer class="site-footer on-deep">
  <div class="wrap">
    <div class="footer-grid">
      <div class="footer-brand">
        <img src="/assets/img/logo.png" width="227" height="60" alt="Curia Abogados" loading="lazy">
        <p>${SITE.blurb}</p>
        <div class="socials">${socials}</div>
      </div>
      <div>
        <h2>Contacto</h2>
        <address>
          <ul>
            <li>${icon('phone')}<a href="${SITE.phoneHref}">${SITE.phone}</a></li>
            <li>${icon('envelope-simple')}<a href="mailto:${SITE.email}">${SITE.email}</a></li>
            <li>${icon('map-pin')}<span class="addr">${SITE.street}<br>${SITE.city}</span></li>
          </ul>
        </address>
      </div>
      <div>
        <h2>Áreas de derecho</h2>
        <ul>${areas}</ul>
      </div>
      <div>
        <h2>Enlaces</h2>
        <ul>
          <li><a href="/blog/">Blog</a></li>
          <li><a href="/aviso-legal/">Aviso legal</a></li>
          <li><a href="/politica-de-privacidad/">Política de privacidad</a></li>
          <li><a href="/cookies/">Cookies</a></li>
          <li><a href="/terminos-y-condiciones/">Términos y condiciones</a></li>
        </ul>
      </div>
    </div>
    <p class="footer-bottom">© 2026 Curia Abogados. Todos los derechos reservados.</p>
  </div>
</footer>`;
}

const callbar = `
<div class="callbar" role="region" aria-label="Llamada rápida">
  <a class="btn" href="${SITE.phoneHref}">${icon('phone')}Llamar al ${SITE.phone}</a>
</div>`;

/**
 * Envuelve el contenido de una página con <head>, cabecera, pie y scripts.
 * v = huella de los assets para saltar la caché al desplegar.
 */
export function shell({ title, desc, body, current = '', section = '', v, scripts = [], preload = '' }) {
  const js = ['/assets/js/site.js', ...scripts].map((s) => `<script src="${s}?v=${v}" type="module"></script>`).join('\n');
  return `<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
${desc ? `<meta name="description" content="${esc(desc)}">` : ''}
<!-- Copia de pruebas (curia2). Retirar estas dos líneas y el robots.txt al pasar a producción. -->
<meta name="robots" content="noindex, nofollow">
<meta name="theme-color" content="#f4f2ed">
<link rel="icon" href="/assets/img/favicon.png" type="image/png">
<link rel="preload" href="/assets/fonts/fraunces.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/assets/fonts/public-sans.woff2" as="font" type="font/woff2" crossorigin>
${preload}
<link rel="stylesheet" href="/assets/css/site.css?v=${v}">
<script src="/assets/js/init.js?v=${v}"></script>
</head>
<body>
<a class="skip-link" href="#contenido">Saltar al contenido</a>
${header(current, section)}
<main id="contenido">
${body}
</main>
${footer()}
${callbar}
${js}
</body>
</html>
`;
}
