import { shell } from '../layout.mjs';

export function pages({ v }) {
  const body = `
<section class="section notfound">
  <div class="wrap">
    <h1 data-in>Página no encontrada</h1>
    <p data-in data-d="1">La dirección que buscas no existe o ha cambiado. Puedes volver a la portada o escribirnos y te ayudamos.</p>
    <div class="actions" data-in data-d="2">
      <a class="btn" href="/">Volver a la portada</a>
      <a class="btn btn-line" href="/contacto/">Consulta online</a>
    </div>
  </div>
</section>`;
  return [{ path: '/404.html', html: shell({ title: 'Página no encontrada | Curia Abogados', body, v }) }];
}
