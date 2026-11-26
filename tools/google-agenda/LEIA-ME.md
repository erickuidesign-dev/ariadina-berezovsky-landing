# Agenda do site ligada ao Google Agenda da Ariadina

Com isso ligado, todo compromisso na agenda principal do Google da Ariadina some dos horários livres do site, em até cerca de 1 minuto.

## Como a Ariadina usa no dia a dia

1. O pedido chega no WhatsApp, como hoje. No fim da mensagem vem um link: **"Para a Ariadina confirmar na agenda: …"**
2. Ela toca no link. O Google Agenda abre com o evento já preenchido (serviço, pet, tutor, telefone e endereço, no dia e horário certos).
3. Ela toca em **Salvar** e responde o cliente no WhatsApp. Pronto: o horário aparece ocupado no site.
4. Para desmarcar, ela apaga o evento.

Outras regras:
- **Qualquer compromisso com horário** na agenda principal (médico, curso, compromisso pessoal) também ocupa aquele horário no site.
- **Evento de dia inteiro** só fecha o dia se o título tiver *folga*, *sem atendimento*, *bloqueado* ou *férias*. Aniversários e lembretes não fecham a agenda.
- Evento marcado como **"Disponível"** ou recusado não ocupa horário.
- **Pedido não reserva sozinho:** entre o pedido e o momento em que ela salva o evento, o horário continua livre no site.

## Instalação (uma vez só, uns 10 minutos)

Precisa ser feita **logada na conta Google da Ariadina** (a conta da agenda que ela usa no celular).

1. Abra https://script.google.com e clique em **Novo projeto**.
2. Apague o que estiver no editor e cole todo o conteúdo do arquivo `Code.gs` (desta pasta). Dê o nome **Agenda do site** ao projeto (no topo, onde está "Projeto sem título").
3. Clique em **Salvar** (ícone de disquete).
4. No seletor de funções, escolha **testar** e clique em **Executar**. O Google vai pedir permissão:
   - Clique em **Revisar permissões**, escolha a conta da Ariadina.
   - Se aparecer "O Google não verificou este app", clique em **Avançado** e depois em **Acessar Agenda do site (não seguro)**. É normal: o script é dela e só roda na conta dela.
   - Clique em **Permitir**. No **Registro de execução** aparece algo como `{"ok":true,...,"busy":[...]}`.
5. Clique em **Implantar → Nova implantação**.
   - Em **Selecionar tipo** (engrenagem), escolha **App da Web**.
   - **Descrição:** `site`
   - **Executar como:** `Eu (e-mail da Ariadina)`
   - **Quem pode acessar:** `Qualquer pessoa`
   - Clique em **Implantar** e copie o **URL do app da Web** (termina em `/exec`).
6. Mande esse endereço para a agência. Ele vai em `js/agenda-config.js`, no campo `googleAgendaUrl`, e o site é publicado de novo.

> "Qualquer pessoa" só permite **ler os horários ocupados** (início e fim). Nomes, endereços e títulos dos eventos não saem da agenda.

## Se mudar o script depois

No editor: **Implantar → Gerenciar implantações → lápis (editar) → Versão: Nova versão → Implantar**. O endereço continua o mesmo.

## Conferir se está funcionando

Abra o endereço `/exec` no navegador: deve aparecer `{"ok":true,...}`. Crie um evento de teste na agenda num dia de atendimento, espere 1 minuto e recarregue o site: aquele horário some da agenda.
