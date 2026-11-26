/* Ariadina Berezovsky | seção "Como funciona"
   Revela os cartões ao rolar, faz a trilha e a patinha avançarem com a rolagem,
   acende cada passo quando a trilha chega nele e marca os itens de "Antes da visita".
   Sem JavaScript ou com prefers-reduced-motion, tudo aparece completo e parado. */
(function () {
  'use strict';

  var section = document.getElementById('como-funciona');
  if (!section) { return; }

  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var flow = section.querySelector('[data-flow]');
  var steps = Array.prototype.slice.call(section.querySelectorAll('[data-step]'));
  var ticks = Array.prototype.slice.call(section.querySelectorAll('[data-tick]'));
  var reveals = Array.prototype.slice.call(section.querySelectorAll('[data-rv]'));

  function clamp(n, a, b) { return Math.min(b, Math.max(a, n)); }

  /* Sem movimento: mostra tudo pronto */
  if (reduceMotion || !('IntersectionObserver' in window)) {
    reveals.forEach(function (el) { el.classList.add('is-in'); });
    steps.forEach(function (el) { el.classList.add('is-active'); });
    ticks.forEach(function (el) { el.classList.add('is-ticked'); });
    if (flow) { flow.style.setProperty('--p', '1'); }
    return;
  }

  /* Revelação ao entrar na tela */
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) { return; }
      entry.target.classList.add('is-in');
      io.unobserve(entry.target);
    });
  }, { threshold: 0.18, rootMargin: '0px 0px -8% 0px' });
  reveals.forEach(function (el) { io.observe(el); });

  /* Itens de "Antes da visita" são marcados um a um quando o cartão aparece */
  var prep = section.querySelector('.prep');
  if (prep) {
    var tickIo = new IntersectionObserver(function (entries) {
      if (!entries[0].isIntersecting) { return; }
      ticks.forEach(function (el, i) {
        setTimeout(function () { el.classList.add('is-ticked'); }, 450 + i * 380);
      });
      tickIo.disconnect();
    }, { threshold: 0.4 });
    tickIo.observe(prep);
  }

  /* Trilha ligada à rolagem */
  if (!flow || !steps.length) { return; }
  var ticking = false;

  function update() {
    var rect = flow.getBoundingClientRect();
    var vh = window.innerHeight || document.documentElement.clientHeight;
    var p = clamp((vh * 0.78 - rect.top) / (rect.height * 0.9), 0, 1);
    flow.style.setProperty('--p', p.toFixed(3));
    steps.forEach(function (el, i) {
      var at = steps.length > 1 ? i / (steps.length - 1) : 0;
      el.classList.toggle('is-active', p >= at - 0.02);
    });
    ticking = false;
  }
  function request() {
    if (!ticking) { ticking = true; requestAnimationFrame(update); }
  }

  window.addEventListener('scroll', request, { passive: true });
  window.addEventListener('resize', request);
  update();
}());
