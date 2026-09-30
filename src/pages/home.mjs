import { AREAS, SITE, cta, icon, shell } from '../layout.mjs';
import { getPosts, postCard } from '../posts.mjs';

const FACTS = [
  { icon: 'scales', title: 'Asesoramiento legal rápido', text: 'Respuesta ágil ante cualquier consulta, sin esperas innecesarias.' },
  { icon: 'graduation-cap', title: 'Abogadas expertas', text: 'Estefanía Pérez y Saro Morales, colegiadas y especializadas en cada área.' },
  { icon: 'book-open', title: 'Más de 15 años de experiencia', text: 'Trayectoria consolidada resolviendo conflictos reales.' },
  { icon: 'house-line', title: 'Derecho civil y mercantil', text: 'Divorcios, desahucios, incumplimientos contractuales y administración de fincas.' },
];

const SPECIALTIES = [
  ['divorcio', 'Divorcio', 'Disolución del matrimonio, a solicitud de uno o de los dos cónyuges, con acompañamiento en cada paso del proceso.'],
  ['guarda-y-custodia', 'Guarda y Custodia', 'Acuerdos y procesos judiciales para determinar la custodia y el régimen de visitas de los hijos menores.'],
  ['despidos', 'Despidos', 'Revisión y defensa ante despidos injustificados, indemnizaciones y otras cuestiones laborales.'],
  ['robos-o-hurtos', 'Robos o Hurtos', 'Defensa y acusación en delitos contra el patrimonio, tanto si eres víctima como si necesitas representación.'],
  ['estafas', 'Estafas', 'Asesoramiento y representación si has sido víctima de un engaño con perjuicio económico.'],
  ['lesiones', 'Lesiones', 'Defensa de tus derechos si has sufrido un daño físico por negligencia o agresión de terceros.'],
];

export function pages({ content, v }) {
  // Los slugs de las especialidades deben coincidir con los del pie.
  if (SPECIALTIES.some(([slug], i) => slug !== AREAS[i].slug)) throw new Error('Especialidades y pie desalineados');

  const facts = FACTS.map(
    (f, i) => `
      <li class="reveal" data-d="${i}">
        ${icon(f.icon)}
        <h3>${f.title}</h3>
        <p>${f.text}</p>
      </li>`
  ).join('');

  const rows = SPECIALTIES.map(
    ([slug, name, text], i) => `
      <li class="reveal" data-d="${Math.min(i, 3)}">
        <a href="/${slug}/">
          <h3>${name}</h3>
          <p>${text}</p>
          ${icon('arrow-right')}
        </a>
      </li>`
  ).join('');

  const posts = getPosts(content).map((p, i) => postCard(p, i)).join('');

  const body = `
<section class="hero" aria-labelledby="hero-title">
  <div class="wrap hero-grid">
    <div>
      <p class="eyebrow" data-in>Asesoría legal</p>
      <h1 id="hero-title" data-in data-d="1">Despacho de abogados en Las Palmas de Gran Canaria</h1>
      <p class="lead" data-in data-d="2">Más de 15 años ayudando a solucionar los conflictos de la vida cotidiana, con un trato cercano, honesto y profesional.</p>
      <div class="actions" data-in data-d="3">
        <a class="btn" href="/contacto/">Consulta online</a>
        <a class="btn btn-line" href="${SITE.phoneHref}">${icon('phone')}${SITE.phone}</a>
      </div>
    </div>
    <div class="hero-media" data-in data-d="2">
      <img src="/assets/img/hero-oficina.webp" width="1077" height="976" alt="Las dos abogadas fundadoras de Curia Abogados en su despacho" fetchpriority="high">
    </div>
  </div>
</section>

<section class="facts" aria-labelledby="facts-title">
  <div class="wrap">
    <h2 class="sr-only" id="facts-title">Por qué Curia Abogados</h2>
    <ul class="facts-list">${facts}
    </ul>
  </div>
</section>

<section class="section" id="especialidades" aria-labelledby="esp-title">
  <div class="wrap">
    <div class="section-head reveal">
      <h2 id="esp-title">Nuestras áreas de práctica</h2>
      <p>Acompañamos a nuestros clientes en los conflictos legales más habituales de la vida cotidiana, con un trato cercano y directo.</p>
    </div>
    <ul class="rows">${rows}
    </ul>
  </div>
</section>

<section class="band-deep on-deep" aria-labelledby="fincas-title">
  <div class="wrap band-grid">
    <div class="reveal">
      <h2 id="fincas-title">Administradores de fincas</h2>
      <p>Gestionamos eficazmente su comunidad de propietarios: desde la administración de cuentas bancarias y cobro de cuotas, hasta la gestión de morosidad y la búsqueda de personal cualificado para el edificio.</p>
      <div class="actions"><a class="btn" href="/administradores-de-fincas/">Saber más sobre este servicio</a></div>
    </div>
    <div class="band-mark reveal" data-d="1" aria-hidden="true">${icon('buildings')}</div>
  </div>
</section>

<section class="section section-paper" id="about" aria-labelledby="about-title">
  <div class="wrap split">
    <div class="media reveal">
      <img src="/assets/img/equipo-oficina.webp" width="1077" height="976" alt="Estefanía Pérez y Saro Morales, socias fundadoras de Curia Abogados" loading="lazy">
    </div>
    <div class="prose-block reveal" data-d="1">
      <p class="eyebrow">Sobre nosotros</p>
      <h2 id="about-title">Generamos confianza y somos meticulosas con tu caso.</h2>
      <p>El despacho de Curia Abogados nace de la pasión por el Derecho de dos abogadas que deciden compartir su camino jurídico con el objetivo de ayudar a solucionar todo tipo de conflictos que se originan en la vida cotidiana de las personas.</p>
      <p>Nos avala la experiencia de más de 15 años ayudando a resolver estos conflictos, con un trato cercano, honesto y profesional en cada paso del proceso.</p>
      <dl class="figures">
        <div><dt>años de experiencia</dt><dd>15+</dd></div>
        <div><dt>abogadas fundadoras</dt><dd>2</dd></div>
      </dl>
      <p class="signature">Estefanía Pérez y Saro Morales<span>Socias fundadoras</span></p>
      <div class="actions"><a class="btn btn-line" href="#equipo">Conoce al equipo</a></div>
    </div>
  </div>
</section>

<section class="section" id="equipo" aria-labelledby="equipo-title">
  <div class="wrap split split-rev">
    <div class="reveal">
      <h2 id="equipo-title">Nuestro equipo</h2>
      <p class="team-lead">Estefanía Pérez y Saro Morales, socias fundadoras de Curia Abogados.</p>
      <p class="quote">Atención cercana y personalizada en cada consulta</p>
    </div>
    <figure class="media reveal" data-d="1">
      <img src="/assets/img/equipo-consulta.webp" width="1077" height="976" alt="Las dos abogadas revisando un caso en la mesa de consulta" loading="lazy">
    </figure>
  </div>
</section>

<section class="section section-paper" aria-labelledby="blog-title">
  <div class="wrap">
    <div class="posts-head reveal">
      <h2 id="blog-title">Últimas entradas</h2>
      <a class="text-link" href="/blog/">Ver todas${icon('arrow-right')}</a>
    </div>
    <div class="posts">${posts}
    </div>
  </div>
</section>
${cta()}`.replace('', '');

  return [
    {
      path: '/',
      html: shell({
        title: content['/'].title,
        desc: content['/'].desc,
        body,
        v,
        preload: '<link rel="preload" href="/assets/img/hero-oficina.webp" as="image" type="image/webp" fetchpriority="high">',
      }),
    },
  ];
}
