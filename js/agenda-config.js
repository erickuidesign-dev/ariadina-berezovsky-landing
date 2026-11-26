/* Ariadina Berezovsky | agenda | configuração
   Edite só este arquivo para mudar horários, dias e o WhatsApp. Não precisa mexer em agenda.js.
   Os valores marcados com "CONFIRMAR" são padrões provisórios e precisam ser validados com a Ariadina. */
window.AB_AGENDA_CONFIG = {
  // WhatsApp que recebe os pedidos: só números, com 55 + DDD + número. Ex.: '5541999999999'
  // Vazio = o site mostra o texto do pedido e um botão para copiar (CONFIRMAR o número).
  whatsapp: '5511974307939',

  profissional: 'Ariadina',

  // Contato mostrado no rodapé. O que ficar vazio não aparece no site. CONFIRMAR com a Ariadina.
  // O WhatsApp do rodapé é o mesmo número configurado acima.
  contato: {
    email: '',        // Ex.: 'contato@exemplo.com.br'
    instagram: '',    // Ex.: '@ariadina.vet'
    regiao: '',       // Ex.: 'Atendo em Curitiba e região'
    crmv: 'CRMV-SP 61370'  // registro profissional exibido no rodapé
  },

  // Dias de atendimento: 0 = domingo ... 6 = sábado. Cada dia tem início e fim.
  // CONFIRMAR os horários com a Ariadina.
  weekdays: {
    2: { from: '09:00', to: '17:00' },   // terça
    4: { from: '09:00', to: '17:00' },   // quinta
    6: { from: '09:00', to: '13:00' }    // sábado
  },

  // Intervalo entre um horário e o próximo, em minutos. CONFIRMAR.
  slotMinutes: 60,

  // Quantos dias de antecedência no mínimo (1 = a partir de amanhã) e no máximo.
  minDaysAhead: 1,
  maxDaysAhead: 60,

  // Datas sem atendimento (feriados, folgas), no formato 'AAAA-MM-DD'.
  blockedDates: [],

  // Horários já ocupados por dia. Ex.: { '2026-11-26': ['09:00', '10:00'] }
  blockedSlots: {},

  // Serviços oferecidos.
  services: {
    consulta: { label: 'Consulta', text: 'Avaliação do seu pet no conforto de casa' },
    vacina: { label: 'Vacina', text: 'Vacinação em casa, sem estresse' }
  }
};
