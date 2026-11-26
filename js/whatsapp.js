/* Ariadina Berezovsky | botão flutuante do WhatsApp
   - Usa o número de js/agenda-config.js. Sem número, o botão fica escondido.
   - Aparece depois de um instante e some enquanto o rodapé (que já tem o WhatsApp) está na tela. */
(function () {
  'use strict';

  var fab = document.getElementById('wa-fab');
  var cfg = window.AB_AGENDA_CONFIG || {};
  var number = String(cfg.whatsapp || '').replace(/\D/g, '');
  if (!fab || !number) { return; }

  var name = cfg.profissional || 'Ariadina';
  var text = 'Olá, ' + name + '! Vim pelo site e gostaria de saber mais sobre o atendimento em casa.';
  fab.href = 'https://wa.me/' + number + '?text=' + encodeURIComponent(text);
  fab.hidden = false;

  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) { fab.classList.add('is-in'); } else { setTimeout(function () { fab.classList.add('is-in'); }, 1200); }

  var foot = document.getElementById('contato');
  if (!foot || !('IntersectionObserver' in window)) { return; }
  new IntersectionObserver(function (entries) {
    fab.classList.toggle('is-away', entries[0].isIntersecting);
  }, { threshold: 0.12 }).observe(foot);
})();
