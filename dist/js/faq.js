/* Ariadina Berezovsky | depoimentos e perguntas frequentes
   - Monta os cartões de depoimento a partir de window.AB_DEPOIMENTOS (js/depoimentos-data.js).
     Lista vazia = bloco escondido.
   - Sanfona do FAQ: uma pergunta aberta por vez, com aria-expanded.
   - Revela os blocos ao rolar. */
(function () {
  'use strict';

  var section = document.getElementById('faq');
  if (!section) { return; }
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; });
  }

  /* Depoimentos */
  var ICON = { cao: 'dog', gato: 'cat', outro: 'paw' };
  function renderDepoimentos() {
    var list = Array.isArray(window.AB_DEPOIMENTOS) ? window.AB_DEPOIMENTOS : [];
    var box = document.getElementById('depoimentos');
    var grid = document.getElementById('depo-grid');
    if (!box || !grid) { return; }
    list = list.filter(function (d) { return d && d.texto && d.tutor; });
    grid.innerHTML = list.map(function (d, i) {
      var icon = ICON[d.especie] || 'paw';
      var who = esc(d.tutor) + (d.pet ? '<small>tutor(a) de ' + esc(d.pet) + '</small>' : '');
      return '<figure class="dcard" data-rv3 style="--k:' + i + '">' +
        '<span class="dcard__q"><svg class="ic" aria-hidden="true"><use href="#quote"/></svg></span>' +
        '<blockquote>' + esc(d.texto) + '</blockquote>' +
        '<figcaption><span class="dcard__pet"><svg class="ic" aria-hidden="true"><use href="#' + icon + '"/></svg></span><span><b>' + who.split('<small>')[0] + '</b>' + (d.pet ? '<small>tutor(a) de ' + esc(d.pet) + '</small>' : '') + '</span></figcaption>' +
        '</figure>';
    }).join('');
    box.hidden = list.length === 0;
  }
  window.AB_renderDepoimentos = renderDepoimentos;
  renderDepoimentos();

  /* Sanfona do FAQ */
  var items = Array.prototype.slice.call(section.querySelectorAll('#faq-list .tip'));
  items.forEach(function (tip) {
    var btn = tip.querySelector('.tip__b');
    btn.addEventListener('click', function () {
      var open = btn.getAttribute('aria-expanded') === 'true';
      items.forEach(function (other) {
        var b = other.querySelector('.tip__b');
        var next = other === tip ? !open : false;
        b.setAttribute('aria-expanded', next ? 'true' : 'false');
        other.classList.toggle('is-open', next);
      });
    });
  });

  /* Revelação ao rolar */
  var targets = Array.prototype.slice.call(section.querySelectorAll('[data-rv3]'));
  if (reduceMotion || !('IntersectionObserver' in window)) {
    targets.forEach(function (el) { el.classList.add('is-in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) { return; }
        entry.target.classList.add('is-in');
        io.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    targets.forEach(function (el) { io.observe(el); });
    var observeNew = new MutationObserver(function () {
      Array.prototype.forEach.call(section.querySelectorAll('[data-rv3]:not(.is-in)'), function (el) { io.observe(el); });
    });
    observeNew.observe(section, { childList: true, subtree: true });
  }
}());
