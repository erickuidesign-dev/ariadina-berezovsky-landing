// Biblioteca de ícones | Ariadina Berezovsky
// Fonte única dos ícones. Rode: node tools/gen-icons.js
// Gera: assets/icons/*.svg, assets/icons/sprite.svg, js/icons.js, css/icons.css, icons.json, icons.html
//
// Estilo: grade 24x24, traço 1.75, pontas e junções redondas, traço em currentColor.
// Cada ícone tem um detalhe de acento (caramelo), em classes:
//   fa = preenchimento de acento    as = traço de acento
// Para trocar as cores: --icon-accent (acento) e color (traço).

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const STROKE = '#4A2A1E';
const ACCENT = '#7A3E2B';

const icons = {
  paw: {
    label: 'Pata', group: 'Marca',
    body: '<ellipse cx="5.5" cy="11.5" rx="1.8" ry="2.4"/><ellipse cx="9.5" cy="6.5" rx="1.8" ry="2.5"/><ellipse cx="14.5" cy="6.5" rx="1.8" ry="2.5"/><ellipse cx="18.5" cy="11.5" rx="1.8" ry="2.4"/><path class="fa" d="M12 11.5c-3 0-5.5 3-5.5 5.4 0 1.8 1.4 2.8 3 2.5 1-.2 1.6-.6 2.5-.6s1.5.4 2.5.6c1.6.3 3-.7 3-2.5 0-2.4-2.5-5.4-5.5-5.4z"/>',
  },
  dog: {
    label: 'Cão', group: 'Pets',
    body: '<path d="M8.2 6.2h7.6c1.8 0 3 1.4 3 3.2v3.6c0 3.9-2.9 6.5-6.8 6.5s-6.8-2.6-6.8-6.5V9.4c0-1.8 1.2-3.2 3-3.2z"/><path d="M6.4 7.6C4.2 6.6 2.7 8.2 2.9 10.4l.3 3.1c.1 1.2 1.1 1.7 2 1.2"/><path d="M17.6 7.6c2.2-1 3.7.6 3.5 2.8l-.3 3.1c-.1 1.2-1.1 1.7-2 1.2"/><circle class="fa" cx="9.5" cy="11.5" r=".7"/><circle class="fa" cx="14.5" cy="11.5" r=".7"/><path class="fa" d="M10.4 14.4h3.2c0 1.3-1.1 2.1-1.6 2.1s-1.6-.8-1.6-2.1z"/>',
  },
  cat: {
    label: 'Gato', group: 'Pets',
    body: '<path d="M5 9.5V4.5L9 7h6l4-2.5v5c1 1.2 1.5 2.6 1.5 4.1 0 3.6-3.8 6.4-8.5 6.4s-8.5-2.8-8.5-6.4c0-1.5.5-2.9 1.5-4.1z"/><circle class="fa" cx="9" cy="12" r=".7"/><circle class="fa" cx="15" cy="12" r=".7"/><path class="fa" d="M10.9 14.4h2.2L12 15.8z"/><path d="M2.6 13.8l3.2.6M2.8 16.8l3-1"/><path d="M21.4 13.8l-3.2.6M21.2 16.8l-3-1"/>',
  },
  calendar: {
    label: 'Agenda', group: 'Atendimento',
    body: '<rect x="3.5" y="5" width="17" height="15.5" rx="3"/><path d="M3.5 10h17M8 3v4M16 3v4"/><rect class="fa" x="13" y="13" width="4" height="4" rx="1.2"/>',
  },
  clock: {
    label: 'Horário', group: 'Atendimento',
    body: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/><circle class="fa" cx="12" cy="12" r="1.2"/>',
  },
  home: {
    label: 'Em casa', group: 'Atendimento',
    body: '<path d="M4 11l8-6.5 8 6.5"/><path d="M5.8 9.8V19a1 1 0 001 1h10.4a1 1 0 001-1V9.8"/><path class="fa" d="M12 17.2s-3-1.9-3-4a1.7 1.7 0 013-1 1.7 1.7 0 013 1c0 2.1-3 4-3 4z"/>',
  },
  syringe: {
    label: 'Vacina', group: 'Atendimento',
    body: '<path d="M6.4 15.4l7.5-7.5 2.2 2.2-7.5 7.5z"/><path class="fa" d="M7.5 16.5l3.5-3.5 1.1 1.1-3.5 3.5z"/><path d="M7.5 16.5l-4 4"/><path d="M12.6 6.6l4.8 4.8"/><path d="M15 9l3.5-3.5"/><path d="M16.7 3.7l3.6 3.6"/>',
  },
  stethoscope: {
    label: 'Consulta', group: 'Atendimento',
    body: '<path d="M6 3.5v5a4 4 0 008 0v-5"/><path d="M5 3.5h2M13 3.5h2"/><path d="M10 12.5V15a4.5 4.5 0 009 0v-1.5"/><circle class="fa" cx="19" cy="12" r="2.2"/>',
  },
  bag: {
    label: 'Maleta', group: 'Atendimento',
    body: '<rect x="3.5" y="8" width="17" height="12" rx="3"/><path d="M9 8V6.5A1.5 1.5 0 0110.5 5h3A1.5 1.5 0 0115 6.5V8"/><path class="as" d="M12 11.5v5M9.5 14h5"/>',
  },
  sofa: {
    label: 'Sofá', group: 'Atendimento',
    body: '<path d="M5 11V8.5A2.5 2.5 0 017.5 6h9A2.5 2.5 0 0119 8.5V11"/><path d="M3.5 12.5a1.8 1.8 0 013.5 0V15h10v-2.5a1.8 1.8 0 013.5 0V17a1.5 1.5 0 01-1.5 1.5h-14A1.5 1.5 0 013.5 17z"/><path d="M6 18.5V20M18 18.5V20"/><rect class="fa" x="9.5" y="8.5" width="5" height="2.4" rx="1.2"/>',
  },
  'car-off': {
    label: 'Sem transporte', group: 'Atendimento',
    body: '<path d="M4 16.5V13l1.8-4.3A2 2 0 017.6 7.5h8.8a2 2 0 011.8 1.2L20 13v3.5a1 1 0 01-1 1h-1a1 1 0 01-1-1V16H7v.5a1 1 0 01-1 1H5a1 1 0 01-1-1z"/><path d="M4 13h16"/><path class="as" d="M3.5 3.5l17 17"/>',
  },
  hourglass: {
    label: 'Sem espera', group: 'Atendimento',
    body: '<path d="M7 3.5h10M7 20.5h10"/><path d="M8 3.5c0 4 4 5 4 8.5s-4 4.5-4 8.5M16 3.5c0 4-4 5-4 8.5s4 4.5 4 8.5"/><path class="fa" d="M9.5 19.2c.6-1.2 1.5-1.7 2.5-1.7s1.9.5 2.5 1.7z"/>',
  },
  heart: {
    label: 'Cuidado', group: 'Confiança',
    body: '<path d="M12 20s-7.5-4.6-7.5-10a4.2 4.2 0 017.5-2.6A4.2 4.2 0 0119.5 10c0 5.4-7.5 10-7.5 10z"/><path class="as" d="M8 9.2a2 2 0 011.6-1.4"/>',
  },
  shield: {
    label: 'Confiança', group: 'Confiança',
    body: '<path d="M12 3.5l7 2.5v5.5c0 4.3-3 7.5-7 9-4-1.5-7-4.7-7-9V6l7-2.5z"/><path class="as" d="M8.8 12l2.4 2.4 4-4.4"/>',
  },
  check: {
    label: 'Confirmado', group: 'Confiança',
    body: '<circle cx="12" cy="12" r="8.5"/><path class="as" d="M8.2 12.4l2.6 2.6 5-5.4"/>',
  },
  star: {
    label: 'Destaque', group: 'Confiança',
    body: '<path d="M12 3.8l2.4 5 5.4.7-4 3.8 1 5.4L12 16l-4.8 2.7 1-5.4-4-3.8 5.4-.7L12 3.8z"/><circle class="fa" cx="12" cy="12" r="1.4"/>',
  },
  sparkle: {
    label: 'Novidade', group: 'Confiança',
    body: '<path d="M12 3.5l1.7 5.3L19 10.5l-5.3 1.7L12 17.5l-1.7-5.3L5 10.5l5.3-1.7L12 3.5z"/><path class="as" d="M18.5 16v4M16.5 18h4"/>',
  },
  quote: {
    label: 'Depoimento', group: 'Confiança',
    body: '<path class="fa" d="M5 17.5c-1-1-1.5-2.3-1.5-4C3.5 10 6 7.5 9 7v2c-1.6.4-2.5 1.5-2.5 3H9v5.5H5zM14 17.5c-1-1-1.5-2.3-1.5-4 0-3.5 2.5-6 5.5-6.5v2c-1.6.4-2.5 1.5-2.5 3H18v5.5h-4z"/>',
  },
  chat: {
    label: 'Conversa', group: 'Contato',
    body: '<path d="M5 5.5h14a2 2 0 012 2v8a2 2 0 01-2 2h-6.5L8 21v-3.5H5a2 2 0 01-2-2v-8a2 2 0 012-2z"/><circle class="fa" cx="8.5" cy="11.5" r="1"/><circle class="fa" cx="12" cy="11.5" r="1"/><circle class="fa" cx="15.5" cy="11.5" r="1"/>',
  },
  phone: {
    label: 'Telefone', group: 'Contato',
    body: '<path d="M5.5 4h3l1.5 4-2 1.3a11 11 0 005.7 5.7L15 13l4 1.5v3a2 2 0 01-2 2A13.5 13.5 0 013.5 6a2 2 0 012-2z"/><path class="as" d="M14.5 5a6 6 0 014.5 4.5"/>',
  },
  mail: {
    label: 'E-mail', group: 'Contato',
    body: '<rect x="3.5" y="5.5" width="17" height="13" rx="3"/><path class="as" d="M4.5 8l7.5 5.5L19.5 8"/>',
  },
  pin: {
    label: 'Local', group: 'Contato',
    body: '<path d="M12 21s-6.5-5.7-6.5-11a6.5 6.5 0 0113 0c0 5.3-6.5 11-6.5 11z"/><circle class="fa" cx="12" cy="10" r="2.3"/>',
  },
  camera: {
    label: 'Instagram', group: 'Contato',
    body: '<rect x="3.5" y="3.5" width="17" height="17" rx="5"/><circle cx="12" cy="12" r="4"/><circle class="fa" cx="17" cy="7" r="1"/>',
  },
  person: {
    label: 'Pessoa', group: 'Contato',
    body: '<circle cx="12" cy="8" r="3.5"/><path d="M5 20c.8-3.5 3.6-5.5 7-5.5s6.2 2 7 5.5"/><circle class="fa" cx="12" cy="8" r="1.2"/>',
  },
  'arrow-right': {
    label: 'Seta', group: 'Interface',
    body: '<path d="M4.5 12h14"/><path class="as" d="M13 6.5l5.5 5.5-5.5 5.5"/>',
  },
  'chevron-down': {
    label: 'Abrir', group: 'Interface',
    body: '<path class="as" d="M6 9.5l6 6 6-6"/>',
  },
  'chevron-right': {
    label: 'Avançar', group: 'Interface',
    body: '<path class="as" d="M9.5 6l6 6-6 6"/>',
  },
  menu: {
    label: 'Menu', group: 'Interface',
    body: '<path d="M4 7h16M4 12h16"/><path class="as" d="M4 17h10"/>',
  },
  close: {
    label: 'Fechar', group: 'Interface',
    body: '<path d="M6 6l12 12M18 6L6 18"/>',
  },
  plus: {
    label: 'Mais', group: 'Interface',
    body: '<path class="as" d="M12 5v14M5 12h14"/>',
  },
};

const names = Object.keys(icons);

const svgFile = (name) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="${STROKE}" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">${icons[name].body
    .replace(/class="fa"/g, `fill="${ACCENT}"`)
    .replace(/class="as"/g, `stroke="${ACCENT}"`)}</svg>\n`;

// Arquivos individuais
fs.mkdirSync(path.join(ROOT, 'assets/icons'), { recursive: true });
for (const n of names) fs.writeFileSync(path.join(ROOT, 'assets/icons', `${n}.svg`), svgFile(n), 'utf8');

// Sprite (symbols com currentColor)
const symbols = names
  .map((n) => `<symbol id="${n}" viewBox="0 0 24 24">${icons[n].body}</symbol>`)
  .join('');
const spriteXml = `<svg xmlns="http://www.w3.org/2000/svg" style="display:none">${symbols}</svg>\n`;
fs.writeFileSync(path.join(ROOT, 'assets/icons/sprite.svg'), spriteXml, 'utf8');

// JS que injeta o sprite no documento (funciona também abrindo o HTML direto do disco)
const js = `/* Ariadina Berezovsky | biblioteca de ícones (gerado por tools/gen-icons.js). Não edite à mão. */
(function () {
  var SPRITE = ${JSON.stringify(`<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" style="position:absolute;width:0;height:0;overflow:hidden">${symbols}</svg>`)};
  function inject() {
    if (document.getElementById('ab-icon-sprite')) { return; }
    var wrap = document.createElement('div');
    wrap.id = 'ab-icon-sprite';
    wrap.innerHTML = SPRITE;
    document.body.insertBefore(wrap, document.body.firstChild);
  }
  if (document.body) { inject(); } else { document.addEventListener('DOMContentLoaded', inject); }
  window.AB_ICONS = ${JSON.stringify(names)};
})();
`;
fs.mkdirSync(path.join(ROOT, 'js'), { recursive: true });
fs.writeFileSync(path.join(ROOT, 'js/icons.js'), js, 'utf8');

// CSS dos ícones
const css = `/* Ariadina Berezovsky | biblioteca de ícones (gerado por tools/gen-icons.js)
   Uso: <svg class="ic" aria-hidden="true"><use href="#paw"/></svg>
   Tamanhos: .ic--sm (16px) .ic--md (24px, padrão) .ic--lg (32px) .ic--xl (48px)
   Cores: o traço segue "color"; o detalhe segue --icon-accent (padrão: --accent). */
.ic {
  display: inline-block;
  flex: none;
  width: 1.5rem;
  height: 1.5rem;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.75;
  stroke-linecap: round;
  stroke-linejoin: round;
  vertical-align: middle;
  overflow: visible;
}
.ic .fa { fill: var(--icon-accent, var(--accent, currentColor)); }
.ic .as { stroke: var(--icon-accent, var(--accent, currentColor)); }
.ic--sm { width: 1rem; height: 1rem; }
.ic--md { width: 1.5rem; height: 1.5rem; }
.ic--lg { width: 2rem; height: 2rem; }
.ic--xl { width: 3rem; height: 3rem; }
.ic--mono { --icon-accent: currentColor; }
`;
fs.mkdirSync(path.join(ROOT, 'css'), { recursive: true });
fs.writeFileSync(path.join(ROOT, 'css/icons.css'), css, 'utf8');

// Catálogo em JSON
const catalog = names.map((n) => ({ nome: n, rotulo: icons[n].label, grupo: icons[n].group }));
fs.writeFileSync(path.join(ROOT, 'icons.json'), JSON.stringify(catalog, null, 2) + '\n', 'utf8');

// Página de visualização
const groups = [...new Set(names.map((n) => icons[n].group))];
const cards = groups
  .map(
    (g) => `    <section class="grp" aria-label="${g}">
      <h2>${g}</h2>
      <div class="grid">
${names
  .filter((n) => icons[n].group === g)
  .map(
    (n) => `        <button class="card" type="button" data-name="${n}" data-label="${icons[n].label.toLowerCase()}" title="Copiar o código de ${n}">
          <svg class="ic" aria-hidden="true"><use href="#${n}"/></svg>
          <span class="n">${n}</span>
          <span class="l">${icons[n].label}</span>
        </button>`
  )
  .join('\n')}
      </div>
    </section>`
  )
  .join('\n');

const html = `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Ícones | Ariadina Berezovsky</title>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fraunces:wght@600&family=DM+Sans:wght@400;500;700&display=swap">
<link rel="stylesheet" href="css/tokens.css">
<link rel="stylesheet" href="css/icons.css">
<style>
  * { box-sizing: border-box; }
  body { margin: 0; background: var(--surface); color: var(--ink); font-family: var(--font-sans); line-height: 1.5; }
  .wrap { max-width: 1100px; margin: 0 auto; padding: 40px max(16px, env(safe-area-inset-left, 0px)) 80px; }
  h1 { font-family: var(--font-display); font-weight: 600; font-size: clamp(34px, 6vw, 56px); line-height: 1.05; margin: 0 0 8px; }
  h2 { font-family: var(--font-display); font-weight: 600; font-size: 24px; margin: 40px 0 14px; }
  p { margin: 0; color: var(--ink-muted); max-width: 62ch; }
  .tools { display: flex; flex-wrap: wrap; gap: 12px; align-items: center; margin: 24px 0 0; }
  input[type="search"] { font: inherit; padding: 12px 18px; border-radius: 999px; border: 1px solid var(--border); background: var(--surface-soft); color: var(--ink); min-width: 220px; }
  label { font-size: 14px; display: inline-flex; align-items: center; gap: 8px; }
  button.t { font: 500 14px var(--font-sans); padding: 10px 18px; border-radius: 999px; border: 1px solid var(--border); background: var(--surface-soft); color: var(--ink); cursor: pointer; }
  :focus-visible { outline: 2px solid var(--focus); outline-offset: 3px; }
  .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(132px, 1fr)); gap: 12px; }
  .card { display: flex; flex-direction: column; align-items: center; gap: 6px; padding: 20px 10px 14px; border-radius: 24px; border: 0; background: var(--surface-soft); color: var(--ink); font: inherit; cursor: pointer; transition: transform .2s ease, background-color .2s ease; }
  .card:hover { transform: translateY(-3px); background: var(--surface-deep); }
  .card .ic { width: var(--size, 32px); height: var(--size, 32px); }
  .card .n { font: 700 13px var(--font-sans); }
  .card .l { font-size: 12px; color: var(--ink-muted); }
  .card.copied { background: var(--accent); color: var(--on-accent); --icon-accent: var(--on-accent); }
  .card.copied .l { color: var(--on-accent); }
  pre { margin: 28px 0 0; padding: 16px 20px; border-radius: 20px; background: var(--surface-soft); overflow-x: auto; font-size: 13px; }
  .hidden { display: none; }
  @media (prefers-reduced-motion: reduce) { .card { transition: none; } .card:hover { transform: none; } }
</style>
</head>
<body>
<div class="wrap">
  <h1>Biblioteca de ícones</h1>
  <p>${names.length} ícones feitos para a landing page da Ariadina Berezovsky: traço de 1,75 em grade 24, pontas redondas e um detalhe em caramelo. Clique em um ícone para copiar o código.</p>
  <div class="tools">
    <input id="q" type="search" placeholder="Buscar ícone" aria-label="Buscar ícone">
    <label>Tamanho <input id="size" type="range" min="20" max="64" value="32" aria-label="Tamanho dos ícones"></label>
    <button class="t" id="mono" type="button" aria-pressed="false">Traço único</button>
    <button class="t" id="theme" type="button">Tema escuro</button>
  </div>
  <div id="list">
${cards}
  </div>
  <pre><code>&lt;script src="js/icons.js"&gt;&lt;/script&gt;
&lt;link rel="stylesheet" href="css/icons.css"&gt;

&lt;svg class="ic ic--lg" aria-hidden="true"&gt;&lt;use href="#calendar"/&gt;&lt;/svg&gt;</code></pre>
</div>
<script src="js/icons.js"></script>
<script>
(function () {
  var list = document.getElementById('list');
  var q = document.getElementById('q');
  var size = document.getElementById('size');
  var mono = document.getElementById('mono');
  var theme = document.getElementById('theme');
  var root = document.documentElement;
  q.addEventListener('input', function () {
    var v = q.value.trim().toLowerCase();
    Array.prototype.forEach.call(list.querySelectorAll('.card'), function (c) {
      var hit = !v || c.dataset.name.indexOf(v) > -1 || c.dataset.label.indexOf(v) > -1;
      c.classList.toggle('hidden', !hit);
    });
    Array.prototype.forEach.call(list.querySelectorAll('.grp'), function (g) {
      g.classList.toggle('hidden', !g.querySelector('.card:not(.hidden)'));
    });
  });
  size.addEventListener('input', function () { list.style.setProperty('--size', size.value + 'px'); });
  mono.addEventListener('click', function () {
    var on = mono.getAttribute('aria-pressed') !== 'true';
    mono.setAttribute('aria-pressed', String(on));
    Array.prototype.forEach.call(list.querySelectorAll('.ic'), function (i) { i.classList.toggle('ic--mono', on); });
  });
  theme.addEventListener('click', function () {
    var dark = root.getAttribute('data-theme') === 'dark';
    root.setAttribute('data-theme', dark ? 'light' : 'dark');
    theme.textContent = dark ? 'Tema escuro' : 'Tema claro';
  });
  list.addEventListener('click', function (e) {
    var c = e.target.closest('.card');
    if (!c) { return; }
    var code = '<svg class="ic" aria-hidden="true"><use href="#' + c.dataset.name + '"/></svg>';
    function done() {
      c.classList.add('copied');
      setTimeout(function () { c.classList.remove('copied'); }, 900);
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(code).then(done, done);
    } else { done(); }
  });
})();
</script>
</body>
</html>
`;
fs.writeFileSync(path.join(ROOT, 'icons.html'), html, 'utf8');

console.log('ok: ' + names.length + ' ícones');
