/**
 * Ariadina Berezovsky | horários ocupados para a agenda do site
 *
 * Lê a agenda principal do Google da Ariadina e devolve SÓ o início e o fim
 * de cada compromisso dos próximos dias. Nada de nome, telefone ou endereço sai daqui.
 *
 * Regras:
 * - Todo compromisso com horário bloqueia os horários do site que coincidirem.
 * - Evento de dia inteiro só bloqueia o dia se o título tiver: folga, sem atendimento,
 *   bloqueado, bloqueio ou férias (assim aniversários e lembretes não fecham a agenda).
 * - Eventos que ela recusou ou marcou como "Disponível" não bloqueiam.
 *
 * Instalação: veja tools/google-agenda/LEIA-ME.md
 */

var DIAS_A_FRENTE = 62;
var CACHE_SEGUNDOS = 60;
var DIA_INTEIRO_BLOQUEIA = /folga|sem atendimento|bloque|f[ée]rias/i;

function doGet() {
  var cache = CacheService.getScriptCache();
  var salvo = cache.get('ocupados');
  if (salvo) { return json_(salvo); }

  var agenda = CalendarApp.getDefaultCalendar();
  var inicio = new Date();
  var fim = new Date(inicio.getTime() + DIAS_A_FRENTE * 24 * 60 * 60 * 1000);

  var ocupados = agenda.getEvents(inicio, fim)
    .filter(bloqueia_)
    .map(function (ev) { return { s: ev.getStartTime().getTime(), e: ev.getEndTime().getTime() }; });

  var corpo = JSON.stringify({ ok: true, atualizado: Date.now(), busy: ocupados });
  cache.put('ocupados', corpo, CACHE_SEGUNDOS);
  return json_(corpo);
}

function bloqueia_(ev) {
  try {
    if (ev.getMyStatus && ev.getMyStatus() === CalendarApp.GuestStatus.NO) { return false; }
  } catch (e) { /* sem convidados: segue */ }
  try {
    if (ev.getTransparency && String(ev.getTransparency()) === 'TRANSPARENT') { return false; }
  } catch (e) { /* versão sem transparência: segue */ }
  if (ev.isAllDayEvent()) { return DIA_INTEIRO_BLOQUEIA.test(ev.getTitle() || ''); }
  return true;
}

function json_(texto) {
  return ContentService.createTextOutput(texto).setMimeType(ContentService.MimeType.JSON);
}

/** Rode uma vez pelo editor (botão Executar) para autorizar e ver o resultado no log. */
function testar() {
  var resposta = doGet().getContent();
  Logger.log(resposta);
}
