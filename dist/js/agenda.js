/* Ariadina Berezovsky | agenda de consultas e vacinas
   Fluxo em 3 etapas: 1) serviço, dia e horário, 2) dados do tutor e do pet, 3) conferir e enviar.
   O pedido sai pelo WhatsApp (número em agenda-config.js). Não há servidor: nada é gravado fora do navegador.
   Lê a escolha de dia feita na hero (evento "ab:dia-escolhido" e sessionStorage "ab-agenda-dia"). */
(function () {
  'use strict';

  var CFG = window.AB_AGENDA_CONFIG || {};
  var booking = document.getElementById('booking');
  if (!booking) { return; }

  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var DRAFT_KEY = 'ab-agenda-rascunho';
  var HERO_KEY = 'ab-agenda-dia';

  var DOW = ['domingo', 'segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sábado'];
  var MONTH = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];

  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $$(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }
  function pad(n) { return n < 10 ? '0' + n : String(n); }
  function iso(d) { return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); }
  function parseIso(s) {
    var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s || '');
    return m ? new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3])) : null;
  }
  function startOfDay(d) { var x = new Date(d.getTime()); x.setHours(0, 0, 0, 0); return x; }
  function addDays(d, n) { var x = startOfDay(d); x.setDate(x.getDate() + n); return x; }
  function toMin(hhmm) { var p = hhmm.split(':'); return Number(p[0]) * 60 + Number(p[1]); }
  function fromMin(m) { return pad(Math.floor(m / 60)) + ':' + pad(m % 60); }
  function longDate(d) { return DOW[d.getDay()] + ', ' + d.getDate() + ' de ' + MONTH[d.getMonth()]; }
  function shortDate(d) { return DOW[d.getDay()] + ', ' + pad(d.getDate()) + '/' + pad(d.getMonth() + 1) + '/' + d.getFullYear(); }
  function svcLabel(key) { return (CFG.services && CFG.services[key] && CFG.services[key].label) || key; }

  var today = startOfDay(new Date());
  var S = {
    svc: 'consulta',
    date: null,
    time: null,
    step: 1,
    maxStep: 1,
    view: { y: today.getFullYear(), m: today.getMonth() },
    data: { nome: '', fone: '', pet: '', especie: '', end: '', obs: '', ok: false }
  };

  /* ---------- Disponibilidade ---------- */
  // Horários ocupados vindos do Google Agenda da Ariadina (só início e fim, em ms). Ver tools/google-agenda.
  var BUSY = [];
  var TZ = CFG.timezoneOffset || '-03:00'; // horário de Brasília, sem horário de verão
  function slotStart(d, hhmm) { return Date.parse(iso(d) + 'T' + hhmm + ':00' + TZ); }
  function isBusy(d, hhmm, step) {
    var s = slotStart(d, hhmm);
    var e = s + step * 60000;
    for (var i = 0; i < BUSY.length; i += 1) {
      if (BUSY[i].s < e && BUSY[i].e > s) { return true; }
    }
    return false;
  }
  function slotsFor(d) {
    var day = CFG.weekdays && CFG.weekdays[d.getDay()];
    if (!day) { return []; }
    var step = CFG.slotMinutes || 60;
    var blocked = (CFG.blockedSlots && CFG.blockedSlots[iso(d)]) || [];
    var out = [];
    for (var m = toMin(day.from); m + step <= toMin(day.to); m += step) {
      var label = fromMin(m);
      if (blocked.indexOf(label) === -1 && !isBusy(d, label, step)) { out.push(label); }
    }
    return out;
  }
  function isAvailable(d) {
    var min = addDays(today, CFG.minDaysAhead == null ? 1 : CFG.minDaysAhead);
    var max = addDays(today, CFG.maxDaysAhead || 60);
    if (d < min || d > max) { return false; }
    if ((CFG.blockedDates || []).indexOf(iso(d)) > -1) { return false; }
    return slotsFor(d).length > 0;
  }
  // Usado pela agenda rápida da hero para marcar dias lotados
  window.AB_AGENDA_DISPONIVEL = function (isoDate) { var d = parseIso(isoDate); return !!(d && isAvailable(d)); };

  /* ---------- Elementos ---------- */
  var monthLabel = $('#cal-month');
  var grid = $('#cal-grid');
  var prevBtn = $('#cal-prev');
  var nextBtn = $('#cal-next');
  var slotsBox = $('#slots');
  var goForm = $('#go-form');
  var form = $('#form-dados');
  var panes = $$('.pane', booking);
  var stepBtns = $$('.steps__b', booking);
  var bar = $('.steps__bar', booking);
  var sumBox = $('#sum');
  var reviewBox = $('#review');
  var sendBtn = $('#send');
  var msgBox = $('#msg-box');
  var msgText = $('#msg-text');
  var doneText = $('#done-text');
  var doneMsg = $('#done-msg');
  var doneBox = $('#done-box');

  /* ---------- Calendário ---------- */
  function renderCal() {
    var y = S.view.y;
    var m = S.view.m;
    monthLabel.textContent = MONTH[m].charAt(0).toUpperCase() + MONTH[m].slice(1) + ' de ' + y;
    grid.innerHTML = '';
    var lead = new Date(y, m, 1).getDay();
    var total = new Date(y, m + 1, 0).getDate();
    var i;
    for (i = 0; i < lead; i += 1) {
      var blank = document.createElement('span');
      blank.className = 'cal__blank';
      grid.appendChild(blank);
    }
    for (i = 1; i <= total; i += 1) {
      var date = new Date(y, m, i);
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'cal__d';
      b.textContent = String(i);
      b.setAttribute('aria-label', longDate(date) + ' de ' + y);
      b._date = date;
      if (iso(date) === iso(today)) { b.classList.add('is-today'); }
      if (!isAvailable(date)) {
        b.disabled = true;
      } else if (S.date && iso(S.date) === iso(date)) {
        b.setAttribute('aria-pressed', 'true');
      } else {
        b.setAttribute('aria-pressed', 'false');
      }
      grid.appendChild(b);
    }
    var thisMonth = today.getFullYear() * 12 + today.getMonth();
    var viewMonth = y * 12 + m;
    var lastAllowed = addDays(today, CFG.maxDaysAhead || 60);
    prevBtn.disabled = viewMonth <= thisMonth;
    nextBtn.disabled = viewMonth >= lastAllowed.getFullYear() * 12 + lastAllowed.getMonth();
  }

  function moveFocus(btn, delta) {
    var list = $$('.cal__d', grid);
    var j = list.indexOf(btn) + delta;
    var dir = delta > 0 ? 1 : -1;
    while (j >= 0 && j < list.length) {
      if (!list[j].disabled) { list[j].focus(); return; }
      j += dir;
    }
  }

  grid.addEventListener('click', function (e) {
    var b = e.target.closest('.cal__d');
    if (!b || b.disabled) { return; }
    selectDate(b._date, false);
  });
  grid.addEventListener('keydown', function (e) {
    var b = e.target.closest('.cal__d');
    if (!b) { return; }
    var map = { ArrowRight: 1, ArrowLeft: -1, ArrowDown: 7, ArrowUp: -7 };
    if (map[e.key]) { e.preventDefault(); moveFocus(b, map[e.key]); }
  });
  prevBtn.addEventListener('click', function () {
    S.view.m -= 1;
    if (S.view.m < 0) { S.view.m = 11; S.view.y -= 1; }
    renderCal();
  });
  nextBtn.addEventListener('click', function () {
    S.view.m += 1;
    if (S.view.m > 11) { S.view.m = 0; S.view.y += 1; }
    renderCal();
  });

  function selectDate(d, quiet) {
    S.date = d;
    S.time = null;
    S.view = { y: d.getFullYear(), m: d.getMonth() };
    renderCal();
    renderSlots(!quiet);
    refresh();
  }

  /* ---------- Horários ---------- */
  function renderSlots(animate) {
    slotsBox.innerHTML = '';
    if (!S.date) {
      var p = document.createElement('p');
      p.className = 'slots__empty';
      p.textContent = 'Escolha um dia no calendário para ver os horários.';
      slotsBox.appendChild(p);
      return;
    }
    var list = slotsFor(S.date);
    var groups = [
      { name: 'Manhã', items: list.filter(function (t) { return toMin(t) < 720; }) },
      { name: 'Tarde', items: list.filter(function (t) { return toMin(t) >= 720; }) }
    ];
    var n = 0;
    groups.forEach(function (g) {
      if (!g.items.length) { return; }
      var wrap = document.createElement('div');
      wrap.className = 'slots__g';
      var h = document.createElement('p');
      h.className = 'slots__h';
      h.textContent = g.name;
      wrap.appendChild(h);
      var row = document.createElement('div');
      row.className = 'slots__row';
      g.items.forEach(function (t) {
        var b = document.createElement('button');
        b.type = 'button';
        b.className = 'slot' + (animate ? ' is-in' : '');
        b.style.setProperty('--i', String(n));
        b.setAttribute('role', 'radio');
        b.setAttribute('aria-checked', S.time === t ? 'true' : 'false');
        b.dataset.time = t;
        b.textContent = t;
        row.appendChild(b);
        n += 1;
      });
      wrap.appendChild(row);
      slotsBox.appendChild(wrap);
    });
  }
  slotsBox.addEventListener('click', function (e) {
    var b = e.target.closest('.slot');
    if (!b) { return; }
    S.time = b.dataset.time;
    $$('.slot', slotsBox).forEach(function (x) { x.setAttribute('aria-checked', x === b ? 'true' : 'false'); });
    refresh();
  });
  slotsBox.addEventListener('keydown', function (e) {
    var list = $$('.slot', slotsBox);
    var i = list.indexOf(document.activeElement);
    if (i < 0) { return; }
    var move = 0;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { move = 1; }
    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { move = -1; }
    if (!move) { return; }
    e.preventDefault();
    list[(i + move + list.length) % list.length].focus();
  });

  /* ---------- Serviço ---------- */
  $$('.svc__b', booking).forEach(function (b) {
    b.addEventListener('click', function () {
      S.svc = b.dataset.svc;
      $$('.svc__b', booking).forEach(function (x) { x.setAttribute('aria-checked', x === b ? 'true' : 'false'); });
      refresh();
    });
  });

  /* ---------- Etapas ---------- */
  function datesOk() { return !!(S.date && S.time); }

  function goStep(n, focus) {
    if (n === 2 && !datesOk()) { return; }
    if (n === 3 && !validate(false)) { return; }
    S.step = n;
    if (n > S.maxStep) { S.maxStep = n; }
    var key = String(n);
    panes.forEach(function (p) { p.classList.toggle('is-active', p.getAttribute('data-pane') === key); });
    updateSteps();
    if (n === 3) { renderReview(); }
    if (focus !== false) {
      var title = $('.pane.is-active .pane__title', booking);
      if (title) { title.setAttribute('tabindex', '-1'); title.focus({ preventScroll: true }); }
      var top = booking.getBoundingClientRect().top;
      if (top < 0 || top > window.innerHeight * 0.4) {
        booking.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
      }
    }
    save();
  }

  function updateSteps() {
    var current = S.step === 'done' ? 3 : S.step;
    stepBtns.forEach(function (b) {
      var n = Number(b.getAttribute('data-go'));
      b.classList.toggle('is-done', n < current || S.step === 'done');
      if (n === current && S.step !== 'done') { b.setAttribute('aria-current', 'step'); } else { b.removeAttribute('aria-current'); }
      var reachable = n === 1 || (n === 2 && datesOk()) || (n === 3 && datesOk() && validate(false, true));
      b.disabled = !reachable || S.step === 'done';
    });
    bar.style.setProperty('--p', S.step === 'done' ? 100 : Math.round((current / 3) * 100));
  }
  stepBtns.forEach(function (b) {
    b.addEventListener('click', function () { goStep(Number(b.getAttribute('data-go'))); });
  });
  goForm.addEventListener('click', function () {
    if (datesOk()) { goStep(2); return; }
    var hint = $('#err-quando');
    hint.textContent = S.date ? 'Escolha um horário para continuar.' : 'Escolha um dia no calendário para continuar.';
    var target = S.date ? $('.slot', slotsBox) : $('.cal__d:not(:disabled)', grid);
    if (target) { target.focus(); }
  });
  $$('[data-back]', booking).forEach(function (b) {
    b.addEventListener('click', function () { goStep(Number(b.getAttribute('data-back'))); });
  });

  /* ---------- Formulário ---------- */
  var fields = {
    nome: $('#f-nome'),
    fone: $('#f-fone'),
    pet: $('#f-pet'),
    end: $('#f-end'),
    obs: $('#f-obs'),
    ok: $('#f-ok')
  };
  var radios = $$('input[name="especie"]', booking);

  function digits(s) { return (s || '').replace(/\D/g, ''); }
  function maskPhone(v) {
    var d = digits(v).slice(0, 11);
    if (d.length <= 2) { return d ? '(' + d : ''; }
    if (d.length <= 6) { return '(' + d.slice(0, 2) + ') ' + d.slice(2); }
    if (d.length <= 10) { return '(' + d.slice(0, 2) + ') ' + d.slice(2, 6) + '-' + d.slice(6); }
    return '(' + d.slice(0, 2) + ') ' + d.slice(2, 7) + '-' + d.slice(7);
  }

  function readForm() {
    S.data.nome = fields.nome.value.trim();
    S.data.fone = fields.fone.value;
    S.data.pet = fields.pet.value.trim();
    S.data.end = fields.end.value.trim();
    S.data.obs = fields.obs.value.trim();
    S.data.ok = fields.ok.checked;
    var chosen = radios.filter(function (r) { return r.checked; })[0];
    S.data.especie = chosen ? chosen.value : '';
  }

  var RULES = {
    nome: function (d) { return d.nome.length >= 3 ? '' : 'Informe o seu nome.'; },
    fone: function (d) { var n = digits(d.fone).length; return n === 10 || n === 11 ? '' : 'Informe o WhatsApp com DDD.'; },
    pet: function (d) { return d.pet.length >= 1 ? '' : 'Informe o nome do pet.'; },
    especie: function (d) { return d.especie ? '' : 'Escolha cão, gato ou outro.'; },
    end: function (d) { return d.end.length >= 6 ? '' : 'Informe a rua, o número e o bairro.'; },
    ok: function (d) { return d.ok ? '' : 'Aceite para continuar.'; }
  };

  function showError(key, msg) {
    var out = $('#err-' + key);
    if (out) { out.textContent = msg; }
    var el = key === 'especie' ? $('#grp-especie') : fields[key];
    if (el) { if (msg) { el.setAttribute('aria-invalid', 'true'); } else { el.removeAttribute('aria-invalid'); } }
  }

  // quiet = não mostra erros; silent = não mexe na tela
  function validate(show, silent) {
    readForm();
    var firstBad = null;
    Object.keys(RULES).forEach(function (key) {
      var msg = RULES[key](S.data);
      if (show && !silent) { showError(key, msg); }
      if (msg && !firstBad) { firstBad = key; }
    });
    if (show && firstBad) {
      var el = firstBad === 'especie' ? radios[0] : fields[firstBad];
      if (el) { el.focus(); }
    }
    return !firstBad;
  }

  fields.fone.addEventListener('input', function () { fields.fone.value = maskPhone(fields.fone.value); });
  Object.keys(fields).forEach(function (key) {
    fields[key].addEventListener('input', function () { readForm(); if (key !== 'obs') { showError(key, ''); } refresh(); });
    fields[key].addEventListener('change', function () { readForm(); showError(key, ''); refresh(); });
  });
  radios.forEach(function (r) { r.addEventListener('change', function () { readForm(); showError('especie', ''); refresh(); }); });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (validate(true)) { goStep(3); }
  });

  /* ---------- Resumo lateral e revisão ---------- */
  function row(label, value) {
    return '<div class="sum__r"><dt>' + label + '</dt><dd>' + (value ? escapeHtml(value) : '<span class="sum__none">—</span>') + '</dd></div>';
  }
  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; });
  }
  var ESPECIE = { cao: 'Cão', gato: 'Gato', outro: 'Outro' };

  function renderSummary() {
    var pet = S.data.pet ? S.data.pet + (S.data.especie ? ' (' + ESPECIE[S.data.especie].toLowerCase() + ')' : '') : '';
    sumBox.innerHTML =
      '<dl class="sum__l">' +
      row('Serviço', svcLabel(S.svc)) +
      row('Dia', S.date ? longDate(S.date) : '') +
      row('Horário', S.time || '') +
      row('Pet', pet) +
      row('Endereço', S.data.end) +
      '</dl>';
  }

  function renderReview() {
    var pet = S.data.pet + ' (' + ESPECIE[S.data.especie].toLowerCase() + ')';
    function item(label, value, step) {
      return '<div class="rev__r"><div><dt>' + label + '</dt><dd>' + escapeHtml(value) + '</dd></div>' +
        '<button type="button" class="rev__e" data-edit="' + step + '">Editar</button></div>';
    }
    reviewBox.innerHTML =
      item('Serviço', svcLabel(S.svc), 1) +
      item('Dia e horário', shortDate(S.date) + ' às ' + S.time, 1) +
      item('Tutor', S.data.nome + ', ' + S.data.fone, 2) +
      item('Pet', pet, 2) +
      item('Endereço do atendimento', S.data.end, 2) +
      (S.data.obs ? item('Observações', S.data.obs, 2) : '');
    var message = buildMessage();
    msgText.value = message;
    var hasNumber = !!digits(CFG.whatsapp);
    msgBox.hidden = hasNumber;
    sendBtn.querySelector('.btn__label').textContent = hasNumber ? 'Enviar pelo WhatsApp' : 'Copiar mensagem do pedido';
  }
  reviewBox.addEventListener('click', function (e) {
    var b = e.target.closest('[data-edit]');
    if (b) { goStep(Number(b.getAttribute('data-edit'))); }
  });

  function refresh() {
    readForm();
    renderSummary();
    if (datesOk()) { $('#err-quando').textContent = ''; }
    updateSteps();
    save();
  }

  /* ---------- Mensagem e envio ---------- */
  function buildMessage() {
    var d = S.data;
    var lines = [
      'Olá, ' + (CFG.profissional || 'Ariadina') + '! Quero agendar uma ' + svcLabel(S.svc).toLowerCase() + ' em casa.',
      '',
      'Dia: ' + shortDate(S.date),
      'Horário: ' + S.time,
      'Tutor: ' + d.nome,
      'WhatsApp: ' + d.fone,
      'Pet: ' + d.pet + ' (' + ESPECIE[d.especie].toLowerCase() + ')',
      'Endereço: ' + d.end
    ];
    if (d.obs) { lines.push('Observações: ' + d.obs); }
    lines.push('', 'Aguardo a confirmação. Obrigado!');
    var link = confirmLink();
    if (link) { lines.push('', 'Para a ' + (CFG.profissional || 'Ariadina') + ' confirmar na agenda: ' + link); }
    return lines.join('\n');
  }

  // Link do Google Agenda com o evento já preenchido: a Ariadina toca, salva e o horário fica ocupado no site.
  function gcalStamp(ms) { return new Date(ms).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, ''); }
  function confirmLink() {
    if (!CFG.googleAgendaUrl || !S.date || !S.time) { return ''; }
    var d = S.data;
    var start = slotStart(S.date, S.time);
    var end = start + (CFG.slotMinutes || 60) * 60000;
    var details = [
      svcLabel(S.svc) + ' em casa',
      'Tutor: ' + d.nome,
      'WhatsApp: ' + d.fone,
      'Pet: ' + d.pet + ' (' + ESPECIE[d.especie].toLowerCase() + ')'
    ];
    if (d.obs) { details.push('Observações: ' + d.obs); }
    return 'https://calendar.google.com/calendar/render?action=TEMPLATE' +
      '&text=' + encodeURIComponent(svcLabel(S.svc) + ': ' + d.pet + ' (' + d.nome + ')') +
      '&dates=' + gcalStamp(start) + '/' + gcalStamp(end) +
      '&details=' + encodeURIComponent(details.join('\n')) +
      '&location=' + encodeURIComponent(d.end) +
      '&ctz=America/Sao_Paulo';
  }

  /* ---------- Horários ocupados (Google Agenda) ---------- */
  function loadBusy() {
    if (!CFG.googleAgendaUrl || !window.fetch) { return; }
    var ctrl = window.AbortController ? new AbortController() : null;
    var timer = setTimeout(function () { if (ctrl) { ctrl.abort(); } }, 10000);
    fetch(CFG.googleAgendaUrl, ctrl ? { signal: ctrl.signal } : {})
      .then(function (r) { return r.json(); })
      .then(function (res) {
        clearTimeout(timer);
        if (!res || !res.ok || !Array.isArray(res.busy)) { return; }
        BUSY = res.busy.filter(function (b) { return typeof b.s === 'number' && typeof b.e === 'number' && b.e > b.s; });
        applyBusy();
      })
      .catch(function () { clearTimeout(timer); /* sem conexão com a agenda: segue com a configuração local */ });
  }
  function applyBusy() {
    var lost = false;
    if (S.date && !isAvailable(S.date)) { S.date = null; S.time = null; lost = true; }
    else if (S.date && S.time && slotsFor(S.date).indexOf(S.time) === -1) { S.time = null; lost = true; }
    renderCal();
    renderSlots(false);
    refresh();
    if (lost) {
      $('#err-quando').textContent = 'O horário que você tinha escolhido acabou de ser ocupado. Escolha outro, por favor.';
      if (S.step !== 1 && S.step !== 'done') { goStep(1); }
    }
    document.dispatchEvent(new CustomEvent('ab:ocupados-atualizados', { detail: { busy: BUSY.slice() } }));
  }

  function copyText(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text).then(function () { return true; }, function () { return false; });
    }
    return Promise.resolve(false);
  }

  function burst() {
    if (reduceMotion || !doneBox) { return; }
    for (var i = 0; i < 10; i += 1) {
      var p = document.createElement('i');
      p.className = 'burst__p';
      p.style.setProperty('--a', (i * 36) + 'deg');
      p.style.setProperty('--d', (i % 2 ? 70 : 100) + 'px');
      doneBox.appendChild(p);
      (function (el) { setTimeout(function () { if (el.parentNode) { el.parentNode.removeChild(el); } }, 1300); }(p));
    }
  }

  function finish(sent, copied) {
    S.step = 'done';
    panes.forEach(function (p) { p.classList.toggle('is-active', p.getAttribute('data-pane') === 'done'); });
    updateSteps();
    if (sent) {
      doneText.textContent = 'Abrimos o WhatsApp com o seu pedido. É só enviar a mensagem. ' + (CFG.profissional || 'A Ariadina') + ' responde para confirmar o horário.';
      doneMsg.hidden = true;
    } else {
      doneText.textContent = (copied ? 'A mensagem foi copiada. ' : '') + 'Cole no WhatsApp ' + (CFG.profissional ? 'da ' + CFG.profissional : 'da veterinária') + ' para pedir a confirmação do horário.';
      doneMsg.hidden = false;
      $('#done-text-area').value = buildMessage();
    }
    var title = $('.pane.is-active .pane__title', booking);
    if (title) { title.setAttribute('tabindex', '-1'); title.focus({ preventScroll: true }); }
    booking.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
    burst();
    try { sessionStorage.removeItem(DRAFT_KEY); } catch (e) { /* ignora */ }
  }

  sendBtn.addEventListener('click', function () {
    var message = buildMessage();
    var number = digits(CFG.whatsapp);
    if (number) {
      var url = 'https://wa.me/' + number + '?text=' + encodeURIComponent(message);
      window.open(url, '_blank', 'noopener');
      finish(true, false);
    } else {
      copyText(message).then(function (ok) { finish(false, ok); });
    }
  });

  $('#copy-msg').addEventListener('click', function () {
    var btn = this;
    var label = btn.querySelector('.btn__label');
    copyText($('#done-text-area').value).then(function (ok) {
      label.textContent = ok ? 'Copiado!' : 'Selecione e copie';
      setTimeout(function () { label.textContent = 'Copiar mensagem'; }, 1600);
    });
  });

  $('#again').addEventListener('click', function () { reset(); });

  function reset() {
    S.svc = 'consulta';
    S.date = null;
    S.time = null;
    S.step = 1;
    S.maxStep = 1;
    S.data = { nome: '', fone: '', pet: '', especie: '', end: '', obs: '', ok: false };
    form.reset();
    Object.keys(RULES).forEach(function (k) { showError(k, ''); });
    $$('.svc__b', booking).forEach(function (x) { x.setAttribute('aria-checked', x.dataset.svc === 'consulta' ? 'true' : 'false'); });
    try { sessionStorage.removeItem(DRAFT_KEY); sessionStorage.removeItem(HERO_KEY); } catch (e) { /* ignora */ }
    renderCal();
    renderSlots(false);
    refresh();
    goStep(1);
  }

  /* ---------- Rascunho (só nesta aba, some ao fechar) ---------- */
  function save() {
    try {
      sessionStorage.setItem(DRAFT_KEY, JSON.stringify({
        svc: S.svc,
        date: S.date ? iso(S.date) : null,
        time: S.time,
        data: S.data
      }));
    } catch (e) { /* sem armazenamento: segue sem rascunho */ }
  }

  function restore() {
    var draft = null;
    try { draft = JSON.parse(sessionStorage.getItem(DRAFT_KEY) || 'null'); } catch (e) { draft = null; }
    if (draft && draft.svc && CFG.services && CFG.services[draft.svc]) {
      S.svc = draft.svc;
      $$('.svc__b', booking).forEach(function (x) { x.setAttribute('aria-checked', x.dataset.svc === S.svc ? 'true' : 'false'); });
    }
    var d = draft && parseIso(draft.date);
    if (!d) {
      try { d = parseIso(sessionStorage.getItem(HERO_KEY)); } catch (e) { d = null; }
    }
    if (d && isAvailable(d)) {
      S.date = d;
      S.view = { y: d.getFullYear(), m: d.getMonth() };
      if (draft && draft.time && slotsFor(d).indexOf(draft.time) > -1) { S.time = draft.time; }
    }
    if (draft && draft.data) {
      var x = draft.data;
      fields.nome.value = x.nome || '';
      fields.fone.value = x.fone || '';
      fields.pet.value = x.pet || '';
      fields.end.value = x.end || '';
      fields.obs.value = x.obs || '';
      fields.ok.checked = !!x.ok;
      radios.forEach(function (r) { r.checked = r.value === x.especie; });
    }
  }

  // Serviço escolhido nos cartões da seção de serviços ("ab:servico-escolhido")
  document.addEventListener('ab:servico-escolhido', function (e) {
    var key = e.detail && e.detail.svc;
    if (!key || !CFG.services || !CFG.services[key] || S.step === 'done') { return; }
    S.svc = key;
    $$('.svc__b', booking).forEach(function (x) { x.setAttribute('aria-checked', x.dataset.svc === key ? 'true' : 'false'); });
    refresh();
  });

  // Escolha feita na hero enquanto a página está aberta
  document.addEventListener('ab:dia-escolhido', function (e) {
    var d = parseIso(e.detail && e.detail.iso);
    if (d && isAvailable(d) && S.step !== 'done') { selectDate(d, true); }
  });

  /* ---------- Início ---------- */
  restore();
  renderCal();
  renderSlots(false);
  readForm();
  renderSummary();
  updateSteps();
  loadBusy();
}());
