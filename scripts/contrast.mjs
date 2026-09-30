// Calcula el contraste WCAG 2.x de todos los pares de color usados en el CSS.
// Uso: node scripts/contrast.mjs   (sale con código 1 si algún par no cumple)
const C = {
  ink: '#0F2B27', ink2: '#4A5B57', paper: '#F4F2ED', surface: '#FCFBF8', deep: '#04342C',
  teal: '#00A79D', tealHover: '#2CC4BA', tealText: '#007A72', tealOnDeep: '#5FD9CE',
  onDeep: '#F4F2ED', onDeep2: '#B9CCC8', field: '#6B7C78', error: '#B3261E', ok: '#1B6B3A',
  errBg: '#FBEAE8',
};
const lum = h => { const [r, g, b] = [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16) / 255).map(v => v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };
const ratio = (a, b) => { const [x, y] = [lum(C[a]), lum(C[b])].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };
// [primer plano, fondo, mínimo, uso]
const pairs = [
  ['ink', 'paper', 4.5, 'texto principal sobre crema'],
  ['ink', 'surface', 4.5, 'texto principal sobre blanco roto'],
  ['ink2', 'paper', 4.5, 'texto secundario sobre crema'],
  ['ink2', 'surface', 4.5, 'texto secundario sobre blanco roto'],
  ['tealText', 'paper', 4.5, 'enlaces sobre crema'],
  ['tealText', 'surface', 4.5, 'enlaces sobre blanco roto'],
  ['ink', 'teal', 4.5, 'texto del botón (tinta sobre teal)'],
  ['ink', 'tealHover', 4.5, 'texto del botón en hover'],
  ['onDeep', 'deep', 4.5, 'texto principal sobre verde profundo'],
  ['onDeep2', 'deep', 4.5, 'texto secundario sobre verde profundo'],
  ['tealOnDeep', 'deep', 4.5, 'enlaces sobre verde profundo'],
  ['deep', 'tealOnDeep', 4.5, 'botón sobre verde profundo (verde sobre teal claro)'],
  ['error', 'surface', 4.5, 'mensaje de error'],
  ['error', 'errBg', 4.5, 'aviso de error'],
  ['ok', 'surface', 3, 'borde de campo válido (no texto)'],
  ['ink', 'paper', 4.5, 'aviso de demostración (tinta sobre crema)'],
  ['paper', 'ink', 4.5, 'botón oscuro (crema sobre tinta)'],
  ['ink', 'teal', 3, 'anillo de foco sobre banda teal (no texto)'],
  ['field', 'surface', 3, 'borde de campo (no texto)'],
  ['tealText', 'surface', 3, 'anillo de foco sobre claro (no texto)'],
  ['tealOnDeep', 'deep', 3, 'anillo de foco sobre oscuro (no texto)'],
  ['teal', 'deep', 3, 'teal decorativo sobre verde profundo'],
];
let fail = 0;
console.log('Par (texto / fondo)'.padEnd(52) + 'Ratio'.padEnd(8) + 'Mín'.padEnd(6) + 'Resultado');
for (const [a, b, min, use] of pairs) {
  const r = ratio(a, b), ok = r >= min; if (!ok) fail++;
  console.log(`${use} [${C[a]} / ${C[b]}]`.padEnd(52) + r.toFixed(2).padEnd(8) + String(min).padEnd(6) + (ok ? 'OK' : 'FALLA'));
}
// El teal #00A79D sobre crema no llega a 3:1: solo se usa como relleno de botón (con texto tinta) y en formas decorativas sin significado.
// teal como texto con texto blanco encima: se documenta que NO se usa
console.log(`\nReferencia descartada: blanco sobre teal ${(1.05 / (lum(C.teal) + 0.05)).toFixed(2)} (no se usa)`);
console.log(`Referencia descartada: teal #00A79D como texto sobre crema ${ratio('teal', 'paper').toFixed(2)} (no se usa como texto)`);
process.exit(fail ? 1 : 0);
