/* Ariadina Berezovsky | rodapé e contato
   - Monta contatos e horários a partir de js/agenda-config.js (nada é inventado:
     o que estiver vazio na configuração simplesmente não aparece).
   - Liga o botão de WhatsApp.
   - Revela os blocos ao rolar. */
(function () {
  'use strict';

  var foot = document.getElementById('contato');
  if (!foot) { return; }

  var cfg = window.AB_AGENDA_CONFIG || {};
  var contato = cfg.contato || {};
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var DAYS = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
  var WA_TEXT = 'Olá, Ariadina! Vim pelo site e gostaria de saber mais sobre o atendimento em casa.';

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) { node.className = className; }
    if (text) { node.textContent = text; }
    return node;
  }

  function icon(name) {
    var ns = 'http://www.w3.org/2000/svg';
    var svg = document.createElementNS(ns, 'svg');
    svg.setAttribute('class', 'ic ic--md');
    svg.setAttribute('aria-hidden', 'true');
    var use = document.createElementNS(ns, 'use');
    use.setAttribute('href', '#' + name);
    svg.appendChild(use);
    return svg;
  }

  /* '09:00' -> '9h', '09:30' -> '9h30' */
  function hour(value) {
    var parts = String(value || '').split(':');
    var h = parseInt(parts[0], 10);
    var m = parseInt(parts[1], 10) || 0;
    if (isNaN(h)) { return ''; }
    return h + 'h' + (m ? (m < 10 ? '0' + m : String(m)) : '');
  }

  /* Só dígitos; aceita número com ou sem o 55 */
  function waDigits() {
    var d = String(cfg.whatsapp || '').replace(/\D/g, '');
    if (d.length === 10 || d.length === 11) { d = '55' + d; }
    return d.length >= 12 && d.length <= 13 ? d : '';
  }

  function waPretty(d) {
    var n = d.slice(2);
    var ddd = n.slice(0, 2);
    var rest = n.slice(2);
    var cut = rest.length === 9 ? 5 : 4;
    return '(' + ddd + ') ' + rest.slice(0, cut) + '-' + rest.slice(cut);
  }

  function row(iconName, node) {
    var li = el('li');
    li.appendChild(icon(iconName));
    li.appendChild(node);
    return li;
  }

  function link(href, text, external) {
    var a = el('a', '', text);
    a.href = href;
    if (external) { a.target = '_blank'; a.rel = 'noopener noreferrer'; }
    return a;
  }

  /* ---------- Contatos ---------- */
  var list = document.getElementById('foot-contatos');
  var wa = waDigits();
  var items = [];

  if (wa) {
    var waUrl = 'https://wa.me/' + wa + '?text=' + encodeURIComponent(WA_TEXT);
    items.push(row('phone', link(waUrl, 'WhatsApp ' + waPretty(wa), true)));
    var btn = document.getElementById('foot-wa');
    if (btn) { btn.href = waUrl; btn.target = '_blank'; btn.rel = 'noopener noreferrer'; btn.hidden = false; }
  }

  var email = String(contato.email || '').trim();
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    items.push(row('mail', link('mailto:' + email, email, false)));
  }

  var insta = String(contato.instagram || '').trim().replace(/^@/, '').replace(/[^A-Za-z0-9._]/g, '');
  if (insta) {
    items.push(row('camera', link('https://instagram.com/' + insta, '@' + insta, true)));
  }

  var regiao = String(contato.regiao || '').trim();
  if (regiao) {
    items.push(row('pin', el('span', '', regiao)));
  }

  if (list && items.length) {
    list.textContent = '';
    items.forEach(function (li) { list.appendChild(li); });
  }

  /* ---------- Horários (da mesma configuração da agenda) ---------- */
  var hoursList = document.getElementById('foot-horarios');
  if (hoursList && cfg.weekdays) {
    var lines = Object.keys(cfg.weekdays)
      .map(Number)
      .sort(function (a, b) { return a - b; })
      .map(function (d) {
        var w = cfg.weekdays[d];
        var from = hour(w && w.from);
        var to = hour(w && w.to);
        return from && to ? { day: DAYS[d], range: from + ' às ' + to } : null;
      })
      .filter(Boolean);
    if (lines.length) {
      hoursList.textContent = '';
      lines.forEach(function (l) {
        var li = el('li');
        li.appendChild(icon('clock'));
        var box = el('span');
        box.appendChild(el('b', '', l.day));
        box.appendChild(document.createTextNode(': ' + l.range));
        li.appendChild(box);
        hoursList.appendChild(li);
      });
    }
  }

  /* ---------- Registro profissional (só aparece se preenchido) ---------- */
  var crmv = String(contato.crmv || '').trim();
  var crmvEl = document.getElementById('foot-crmv');
  if (crmvEl && crmv) { crmvEl.textContent = ' ' + crmv + '.'; }

  var year = document.getElementById('foot-ano');
  if (year) { year.textContent = String(new Date().getFullYear()); }

  /* ---------- Revelação ao rolar ---------- */
  var reveals = Array.prototype.slice.call(foot.querySelectorAll('[data-rv4], .foot__bar'));
  if (reduceMotion || !('IntersectionObserver' in window)) {
    reveals.forEach(function (n) { n.classList.add('is-in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) { return; }
        entry.target.classList.add('is-in');
        io.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -4% 0px' });
    reveals.forEach(function (n) { io.observe(n); });
  }
}());
