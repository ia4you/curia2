import { SITE, esc, icon, shell } from '../layout.mjs';

export function pages({ content, v }) {
  const path = '/contacto';
  const b = content[path].blocks;
  const lead = b.find((x) => x.t === 'p' && x.x.startsWith('Nos avala')).x;
  const socials = SITE.socials
    .map(
      (s) =>
        `<a href="${s.href}" target="_blank" rel="noopener noreferrer" aria-label="${s.label} (se abre en una pestaña nueva)">${icon(s.icon)}</a>`
    )
    .join('');

  const body = `
<section class="section" aria-labelledby="page-title">
  <div class="wrap">
    <nav aria-label="Migas de pan"><ol class="crumbs"><li><a href="/">Inicio</a></li><li aria-current="page">Contacto</li></ol></nav>
    <div class="contact-grid">
      <div class="contact-info">
        <h1 id="page-title" data-in>${esc(b.find((x) => x.t === 'h2').x)}</h1>
        <p class="lead" data-in data-d="1">${esc(lead)}</p>
        <ul class="contact-list" data-in data-d="2">
          <li>${icon('phone')}<a href="${SITE.phoneHref}">${SITE.phone}</a></li>
          <li>${icon('phone')}<a href="${SITE.phone2Href}">${SITE.phone2}</a></li>
          <li>${icon('envelope-simple')}<a href="mailto:${SITE.email}">${SITE.email}</a></li>
          <li>${icon('map-pin')}<address>${SITE.street}<br>${SITE.city}</address></li>
        </ul>
        <div class="socials" data-in data-d="3">${socials}</div>
      </div>
      <div data-in data-d="2">
        <contact-form></contact-form>
        <noscript><p class="notice">El formulario necesita JavaScript. Llámanos al <a href="${SITE.phoneHref}">${SITE.phone}</a> o escribe a <a href="mailto:${SITE.email}">${SITE.email}</a>.</p></noscript>
      </div>
    </div>
  </div>
</section>`;

  return [
    {
      path: `${path}/`,
      html: shell({
        title: content[path].title,
        desc: content[path].desc,
        body,
        v,
        current: 'contacto',
        scripts: ['/assets/js/contact-form.js'],
      }),
    },
  ];
}
