import { SITE, icon, shell } from '../layout.mjs';
import { pageHead } from './interior.mjs';

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
${pageHead({
  trail: [{ label: 'Inicio', href: '/' }, { label: 'Contacto' }],
  title: b.find((x) => x.t === 'h2').x,
  lead,
})}
<section class="section" aria-label="Datos y formulario de contacto">
  <div class="wrap contact-grid">
    <div class="contact-info reveal">
      <ul class="contact-list">
        <li>${icon('phone')}<a href="${SITE.phoneHref}">${SITE.phone}</a></li>
        <li>${icon('phone')}<a href="${SITE.phone2Href}">${SITE.phone2}</a></li>
        <li>${icon('envelope-simple')}<a href="mailto:${SITE.email}">${SITE.email}</a></li>
        <li>${icon('map-pin')}<address>${SITE.street}<br>${SITE.city}</address></li>
      </ul>
      <div class="socials">${socials}</div>
    </div>
    <div class="reveal" data-d="1">
      <contact-form></contact-form>
      <noscript><p class="notice">El formulario necesita JavaScript. Llámanos al <a href="${SITE.phoneHref}">${SITE.phone}</a> o escribe a <a href="mailto:${SITE.email}">${SITE.email}</a>.</p></noscript>
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
