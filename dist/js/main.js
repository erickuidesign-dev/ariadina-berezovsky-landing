/* Ariadina Berezovsky | landing page | hero v1
   Interações: entrada animada, palavra que gira, escolha de dia (agenda rápida),
   botão magnético, ondulação no clique, paralaxe suave e topo que se ajusta ao rolar.
   Tudo degrada bem: sem JS a página aparece completa; com prefers-reduced-motion nada se move. */
(function () {
  'use strict';

  var root = document.documentElement;
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  var WEEKDAYS = { 2: 'terça', 4: 'quinta', 6: 'sábado' };      // dias de atendimento (0 = domingo)
  var MONTHS = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
  var STORAGE_KEY = 'ab-agenda-dia';

  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $$(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }
  function pad(n) { return n < 10 ? '0' + n : String(n); }

  /* ---------- 1. Título: palavras que sobem ---------- */
  function splitTitle() {
    var index = 0;
    $$('.hero__title .line').forEach(function (line) {
      Array.prototype.slice.call(line.childNodes).forEach(function (node) {
        if (node.nodeType !== 3) { index += 1; return; }
        var frag = document.createDocumentFragment();
        node.textContent.split(/(\s+)/).forEach(function (part) {
          if (!part) { return; }
          if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(' ')); return; }
          var outer = document.createElement('span');
          outer.className = 'w';
          var inner = document.createElement('span');
          inner.style.setProperty('--i', String(index));
          inner.textContent = part;
          outer.appendChild(inner);
          frag.appendChild(outer);
          index += 1;
        });
        line.replaceChild(frag, node);
      });
    });
  }

  /* ---------- 2. Palavra que gira: pet, cão, gato ---------- */
  function startRotator() {
    var box = $('[data-rot]');
    if (!box || reduceMotion) { return; }
    var words = $$('.rot__w', box);
    var current = 0;
    var timer = null;
    function tick() {
      var out = words[current];
      current = (current + 1) % words.length;
      var next = words[current];
      out.classList.remove('is-on');
      out.classList.add('is-out');
      next.classList.add('is-on');
      setTimeout(function () { out.classList.remove('is-out'); }, 800);
    }
    function play() { if (!timer) { timer = setInterval(tick, 2800); } }
    function pause() { clearInterval(timer); timer = null; }
    document.addEventListener('visibilitychange', function () { if (document.hidden) { pause(); } else { play(); } });
    setTimeout(play, 2600);
  }

  /* ---------- 3. Escolha de dia (agenda rápida) ---------- */
  function nextDays(count) {
    var list = [];
    var d = new Date();
    d.setHours(0, 0, 0, 0);
    while (list.length < count) {
      d.setDate(d.getDate() + 1);
      if (WEEKDAYS[d.getDay()]) { list.push(new Date(d.getTime())); }
    }
    return list;
  }
  function isoOf(d) { return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); }
  function labelOf(d) { return WEEKDAYS[d.getDay()] + ', ' + pad(d.getDate()) + '/' + pad(d.getMonth() + 1); }

  function setupDays() {
    var box = $('#days');
    if (!box) { return; }
    var days = nextDays(3);
    var stub = $('#stub-day');
    var note = $('#mini-note');
    var label = $('[data-cta-label]');
    var defaultLabel = label ? label.textContent : '';
    var buttons = [];
    var selected = null;

    box.innerHTML = '';
    days.forEach(function (d, i) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'day';
      b.setAttribute('role', 'radio');
      b.setAttribute('aria-checked', 'false');
      b.setAttribute('aria-label', labelOf(d));
      b.tabIndex = i === 0 ? 0 : -1;
      b.dataset.iso = isoOf(d);
      b.innerHTML =
        '<span class="day__dow">' + WEEKDAYS[d.getDay()] + '</span>' +
        '<span class="day__num">' + pad(d.getDate()) + '</span>' +
        '<span class="day__mon">' + MONTHS[d.getMonth()] + '</span>' +
        '<span class="day__tick"><svg class="ic" aria-hidden="true"><use href="#check"/></svg></span>';
      b._date = d;
      box.appendChild(b);
      buttons.push(b);
    });

    function swapLabel(text) {
      if (!label) { return; }
      if (reduceMotion) { label.textContent = text; return; }
      label.classList.add('is-swap');
      setTimeout(function () { label.textContent = text; label.classList.remove('is-swap'); }, 180);
    }

    function select(btn, announce) {
      buttons.forEach(function (b) {
        var on = b === btn;
        b.setAttribute('aria-checked', on ? 'true' : 'false');
        b.tabIndex = on ? 0 : -1;
      });
      selected = btn._date;
      var text = labelOf(selected);
      swapLabel('Agendar ' + text);
      if (stub) { stub.textContent = text; }
      if (note) { note.textContent = 'Você escolheu ' + text + '. Toque em agendar para ver os horários.'; }
      try { sessionStorage.setItem(STORAGE_KEY, isoOf(selected)); } catch (e) { /* sem armazenamento: segue sem lembrar */ }
      document.dispatchEvent(new CustomEvent('ab:dia-escolhido', { detail: { iso: isoOf(selected), rotulo: text } }));
      if (announce) { btn.focus(); }
    }

    // Quando a agenda recebe os horários ocupados do Google Agenda, marca os dias lotados
    document.addEventListener('ab:ocupados-atualizados', function () {
      if (typeof window.AB_AGENDA_DISPONIVEL !== 'function') { return; }
      buttons.forEach(function (b) {
        var full = !window.AB_AGENDA_DISPONIVEL(b.dataset.iso);
        b.disabled = full;
        b.classList.toggle('is-full', full);
        b.setAttribute('aria-label', labelOf(b._date) + (full ? ', lotado' : ''));
        var mon = b.querySelector('.day__mon');
        if (mon) { mon.textContent = full ? 'lotado' : MONTHS[b._date.getMonth()]; }
        if (full && b.getAttribute('aria-checked') === 'true') {
          b.setAttribute('aria-checked', 'false');
          selected = null;
          swapLabel(defaultLabel);
          if (note) { note.textContent = 'Esse dia lotou. Escolha outro dia para ver os horários.'; }
        }
      });
    });

    box.addEventListener('click', function (e) {
      var btn = e.target.closest('.day');
      if (btn) { select(btn, false); }
    });
    box.addEventListener('keydown', function (e) {
      var i = buttons.indexOf(document.activeElement);
      if (i < 0) { return; }
      var move = 0;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { move = 1; }
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { move = -1; }
      if (!move) { return; }
      e.preventDefault();
      select(buttons[(i + move + buttons.length) % buttons.length], true);
    });

    // restaura a escolha da visita anterior, se o dia ainda estiver na lista
    try {
      var saved = sessionStorage.getItem(STORAGE_KEY);
      var hit = buttons.filter(function (b) { return b.dataset.iso === saved; })[0];
      if (hit) { select(hit, false); }
    } catch (e) { /* ignora */ }

    if (!selected && label) { label.textContent = defaultLabel; }
  }

  /* ---------- 4. Botão magnético e ondulação ---------- */
  function setupButtons() {
    $$('.btn').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        var rect = btn.getBoundingClientRect();
        var size = Math.max(rect.width, rect.height) * 2;
        var r = document.createElement('span');
        r.className = 'ripple';
        r.style.width = r.style.height = size + 'px';
        r.style.left = (e.clientX - rect.left - size / 2) + 'px';
        r.style.top = (e.clientY - rect.top - size / 2) + 'px';
        btn.appendChild(r);
        setTimeout(function () { if (r.parentNode) { r.parentNode.removeChild(r); } }, 700);
      });
    });

    if (reduceMotion || !finePointer) { return; }
    $$('.btn--magnetic').forEach(function (btn) {
      btn.addEventListener('pointermove', function (e) {
        var r = btn.getBoundingClientRect();
        var x = (e.clientX - (r.left + r.width / 2)) / r.width;
        var y = (e.clientY - (r.top + r.height / 2)) / r.height;
        btn.style.transition = 'background-color .25s ease, box-shadow .3s ease';
        btn.style.transform = 'translate(' + (x * 12).toFixed(1) + 'px,' + (y * 10).toFixed(1) + 'px)';
      });
      btn.addEventListener('pointerleave', function () {
        btn.style.transition = '';
        btn.style.transform = '';
      });
    });
  }

  /* ---------- 5. Paralaxe suave no visual ---------- */
  function setupParallax() {
    var scene = $('[data-parallax-root]');
    if (!scene || reduceMotion || !finePointer) { return; }
    var layers = $$('[data-depth]', scene).map(function (el) {
      return { el: el, depth: parseFloat(el.getAttribute('data-depth')) || 0, x: 0, y: 0 };
    });
    var hero = $('.hero');
    var tx = 0;
    var ty = 0;
    var running = false;

    function frame() {
      var moving = false;
      layers.forEach(function (l) {
        var gx = tx * l.depth;
        var gy = ty * l.depth;
        l.x += (gx - l.x) * 0.08;
        l.y += (gy - l.y) * 0.08;
        if (Math.abs(gx - l.x) > 0.05 || Math.abs(gy - l.y) > 0.05) { moving = true; }
        l.el.style.translate = l.x.toFixed(2) + 'px ' + l.y.toFixed(2) + 'px';
      });
      if (moving) { requestAnimationFrame(frame); } else { running = false; }
    }
    function kick() { if (!running) { running = true; requestAnimationFrame(frame); } }

    hero.addEventListener('pointermove', function (e) {
      var r = hero.getBoundingClientRect();
      tx = (e.clientX - r.left) / r.width - 0.5;
      ty = (e.clientY - r.top) / r.height - 0.5;
      kick();
    });
    hero.addEventListener('pointerleave', function () { tx = 0; ty = 0; kick(); });
  }

  /* ---------- 6. Topo e indicador de rolagem ---------- */
  function setupScroll() {
    var nav = $('#nav');
    var cue = $('.cue');
    var ticking = false;
    function update() {
      var y = window.pageYOffset || document.documentElement.scrollTop;
      if (nav) { nav.classList.toggle('is-stuck', y > 12); }
      if (cue) { cue.classList.toggle('is-gone', y > 80); }
      ticking = false;
    }
    window.addEventListener('scroll', function () {
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    }, { passive: true });
    update();
  }

  /* ---------- Início ---------- */
  function start() {
    splitTitle();
    setupDays();
    setupButtons();
    setupParallax();
    setupScroll();
    root.classList.add('is-ready');
    startRotator();
  }

  var started = false;
  function go() { if (!started) { started = true; start(); } }

  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(go);
    setTimeout(go, 1400);
  } else {
    go();
  }
}());
