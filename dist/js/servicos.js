/* Ariadina Berezovsky | seção "Serviços e dicas"
   - Revela os cartões ao rolar.
   - Sanfona de dicas: uma aberta por vez, com aria-expanded.
   - Botões "Agendar consulta/vacina" avisam a agenda (evento "ab:servico-escolhido")
     e guardam o serviço no rascunho, para a agenda já abrir no serviço certo. */
(function () {
  'use strict';

  var section = document.getElementById('servicos');
  if (!section) { return; }

  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var DRAFT_KEY = 'ab-agenda-rascunho';

  /* Revelação ao rolar */
  var items = Array.prototype.slice.call(section.querySelectorAll('[data-rv2]'));
  if (reduceMotion || !('IntersectionObserver' in window)) {
    items.forEach(function (el) { el.classList.add('is-in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) { return; }
        entry.target.classList.add('is-in');
        io.unobserve(entry.target);
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -6% 0px' });
    items.forEach(function (el) { io.observe(el); });
  }

  /* Sanfona de dicas */
  var tips = Array.prototype.slice.call(section.querySelectorAll('.tip'));
  tips.forEach(function (tip) {
    var btn = tip.querySelector('.tip__b');
    btn.addEventListener('click', function () {
      var open = btn.getAttribute('aria-expanded') === 'true';
      tips.forEach(function (other) {
        var b = other.querySelector('.tip__b');
        var isThis = other === tip;
        var next = isThis ? !open : false;
        b.setAttribute('aria-expanded', next ? 'true' : 'false');
        other.classList.toggle('is-open', next);
      });
    });
  });

  /* Serviço escolhido nos cartões */
  Array.prototype.forEach.call(section.querySelectorAll('[data-svc]'), function (link) {
    link.addEventListener('click', function () {
      var key = link.getAttribute('data-svc');
      try {
        var draft = JSON.parse(sessionStorage.getItem(DRAFT_KEY) || 'null') || {};
        draft.svc = key;
        sessionStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
      } catch (e) { /* sem armazenamento: só o evento vale */ }
      document.dispatchEvent(new CustomEvent('ab:servico-escolhido', { detail: { svc: key } }));
    });
  });
}());
