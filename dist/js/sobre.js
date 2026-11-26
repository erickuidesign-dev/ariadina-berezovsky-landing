/* Ariadina Berezovsky | seção "Sobre a Ariadina"
   - Revela os blocos ao rolar. Sem JavaScript ou com prefers-reduced-motion tudo aparece pronto. */
(function () {
  'use strict';

  var section = document.getElementById('sobre');
  if (!section) { return; }

  var items = Array.prototype.slice.call(section.querySelectorAll('[data-rv5]'));
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (reduceMotion || !('IntersectionObserver' in window)) {
    items.forEach(function (el) { el.classList.add('is-in'); });
    return;
  }

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) { return; }
      entry.target.classList.add('is-in');
      io.unobserve(entry.target);
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -6% 0px' });

  items.forEach(function (el) { io.observe(el); });
})();
