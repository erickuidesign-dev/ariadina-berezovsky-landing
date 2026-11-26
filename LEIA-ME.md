# Landing page | Ariadina Berezovsky

Landing page de alta conversão para o atendimento veterinário a domicílio, feita com o Design System da cliente (rosa bebê, creme e caramelo; Fraunces e DM Sans). HTML, CSS e JavaScript puros, sem dependências.

Estado: **etapa 6: todas as seções prontas (hero, como funciona, serviços e dicas, depoimentos e perguntas frequentes, agenda, rodapé e contato).** Falta preencher dados reais (WhatsApp, contato, CRMV, depoimentos, fotos). Os depoimentos ficam escondidos até existirem relatos reais.

## Sobre a Ariadina (`#sobre`)

Fica entre Serviços e Perguntas frequentes. Abre com um retrato horizontal de estúdio (texto sobre o fundo rosa da própria foto) e depois um bloco com duas fotos sobrepostas, a história e quatro cartões (formação, registro, experiência e fora do trabalho).

- **Campos a preencher:** todo texto com contorno tracejado (classe `.fill`, atributo `data-fill`) é um espaço reservado e aparece no site de propósito. Troque pelo dado real e apague o `<span class="fill">`. Para achar todos: procure `data-fill` no `index.html`.
- **Fotos:** `assets/fotos/sobre-estudio-wide.jpg`, `sobre-estudio-sentada.jpg` e `sobre-estudio-golden.jpg`, geradas no Google Flow (Nano Banana 2.1) a partir de 3 fotos reais da Ariadina. **Ela precisa aprovar antes de publicar.** No retrato horizontal o estetoscópio mostra um pequeno logotipo de marca.
- Textos em `index.html`, estilo em `css/sobre.css`, revelação ao rolar em `js/sobre.js`.

## Rodapé e contato (`#contato`)

Fundo caramelo, único bloco escuro da página. Tem um cartão de chamada ("Vamos cuidar do seu pet em casa?") com o botão "Agendar online" e, quando houver número, o botão "Chamar no WhatsApp". Abaixo, quatro colunas (marca, navegação, horários, contato) e uma barra final com direitos, aviso de privacidade, patinhas que caminham e "Voltar ao topo".

- **Nada é inventado.** Horários vêm de `weekdays` e o WhatsApp vem de `whatsapp`, ambos em `js/agenda-config.js`. E-mail, Instagram, região e CRMV vêm do bloco `contato` do mesmo arquivo. Campo vazio não aparece no site.
- Sem número de WhatsApp, o rodapé mostra só "Peça o seu horário na agenda online" e o botão do WhatsApp fica escondido.
- O CRMV, quando preenchido, aparece na barra final. **Recomendado preencher**, por ser o registro profissional exibido em divulgação de serviço veterinário.
- O aviso "Seus dados ficam só no seu navegador até você enviar o pedido pelo WhatsApp" descreve o comportamento real da agenda. Se um dia houver servidor ou agenda externa, **revise esse texto**.
- Textos em `index.html`, estilo em `css/rodape.css`, comportamento em `js/rodape.js`.

## Depoimentos e perguntas frequentes (`#faq`)

Fundo mais escuro, com dois blocos.

- **Depoimentos (`#depoimentos`):** começa **escondido** de propósito. Nenhum depoimento foi inventado. Para ativar, coloque relatos reais, com autorização de quem escreveu, em `js/depoimentos-data.js` (lista `window.AB_DEPOIMENTOS`, cada item com nome, pet e texto). Com a lista vazia o bloco não aparece. O texto é inserido de forma segura (sem HTML).
- **Perguntas frequentes:** 7 perguntas em sanfona (uma aberta por vez, acessível por teclado, ids `faq-1` a `faq-7`). As mesmas perguntas estão no `FAQPage` em JSON-LD no `<head>`, para o Google. **Se mudar um texto, mude nos dois lugares.**
- Textos em `index.html`, estilo em `css/faq.css`, comportamento em `js/faq.js`. Com `prefers-reduced-motion` ou sem JavaScript tudo aparece pronto.
- **A Ariadina precisa revisar as respostas antes de publicar:** região atendida, regra de remarcação, se atende cães e gatos e os horários.

## Serviços e dicas (`#servicos`)

Dois cartões (consulta e vacina) com foto, lista curta e botão. O botão "Agendar consulta/vacina" leva à agenda já com o serviço escolhido (evento `ab:servico-escolhido`). Abaixo, a sanfona "Para a visita correr bem" com 5 dicas gerais (uma aberta por vez, acessível por teclado). Textos em `index.html`, estilo em `css/servicos.css`, comportamento em `js/servicos.js`. **As dicas e as listas dos cartões são gerais e não têm orientação clínica; a Ariadina precisa revisar e aprovar antes de publicar.**

## Como funciona (`#como-funciona`)

Três passos (você agenda, a gente vai até você, cuidado no seu lar) ligados por uma trilha que avança com a rolagem, com a patinha andando e cada passo acendendo quando a trilha chega nele. Abaixo, o cartão "Antes da visita" (3 itens que se marcam um a um) com o botão para a agenda. No celular a trilha vira vertical. Com `prefers-reduced-motion` ou sem JavaScript tudo aparece pronto e parado. Textos em `index.html`, estilo em `css/como-funciona.css`, comportamento em `js/como-funciona.js`.

## Agenda (`#agenda`)

Fluxo em 3 etapas: **1) Quando** (serviço, dia no calendário e horário), **2) Seus dados** (tutor, WhatsApp, pet, espécie, endereço e observações) e **3) Confirmar** (revisão com botão Editar em cada item).

- O calendário só deixa escolher terça, quinta e sábado, a partir de amanhã e por até 60 dias. Há navegação por mês e por setas do teclado.
- O pedido sai pelo WhatsApp com a mensagem pronta. O site não tem servidor: nada é gravado fora do navegador, e o horário só vale depois que a Ariadina responde.
- Com o número configurado, o botão abre o WhatsApp. Sem número, ele copia a mensagem e mostra o texto para colar.
- Resumo lateral que atualiza ao vivo, validação em português com mensagens por campo, máscara de telefone, rascunho que sobrevive ao recarregar a aba e integração com a agenda rápida da hero.
- **Para ajustar horários, dias, bloqueios e o WhatsApp, edite só `js/agenda-config.js`.** Os valores marcados "CONFIRMAR" são provisórios: terça e quinta das 9h às 17h, sábado das 9h às 13h, horários de 1 em 1 hora.
- Para marcar um horário como ocupado: `blockedSlots: { '2026-11-26': ['09:00'] }`. Para um dia sem atendimento: `blockedDates: ['2026-12-25']`.

## Deploy

1. Rode `powershell -ExecutionPolicy Bypass -File tools\build-dist.ps1` nesta pasta. Ele apaga e recria `dist/` só com o que o site usa (index.html, 9 CSS, 10 JS e as fotos referenciadas, cerca de 1 MB).
2. Suba o **conteúdo** de `dist/` para a raiz da hospedagem (Netlify, Vercel, Hostinger ou outra). É um site estático, sem build nem servidor.
3. Sempre que mudar algo no site, rode o passo 1 de novo antes de subir. Nunca edite dentro de `dist/`.

Antes de publicar:
- Os campos com contorno tracejado da seção "Sobre" (`data-fill`) aparecem no site. Preencha ou tire antes.
- `og:image` usa caminho relativo. Com o domínio definido, troque por URL completa (ex.: `https://dominio.com.br/assets/fotos/vet-gato-1.jpg`) para a prévia no WhatsApp e redes funcionar.
- Os arquivos CSS e fotos têm `?v=N` no `index.html`. Ao trocar uma foto ou CSS mantendo o nome, aumente o número para o navegador não usar a versão antiga.

## Como abrir

- Dê duplo clique em `index.html`. As fontes carregam do Google Fonts, então é preciso internet para ver Fraunces e DM Sans.
- Biblioteca de ícones: `icons.html`.
- Para testar em servidor local: `python -m http.server 8765` dentro desta pasta e abra `http://localhost:8765`.

## Estrutura

| Caminho | O que é |
|---|---|
| `index.html` | Página (hero e marcador da agenda) |
| `css/tokens.css` | Cores, fontes, espaços e raios (cópia do Design System) |
| `css/icons.css` | Estilo dos ícones |
| `css/landing.css` | Estilo da landing e animações |
| `css/servicos.css` | Estilo da seção Serviços e dicas |
| `js/servicos.js` | Sanfona de dicas e ligação com a agenda |
| `css/como-funciona.css` | Estilo da seção Como funciona |
| `js/como-funciona.js` | Trilha ligada à rolagem e revelações |
| `css/faq.css` | Estilo de depoimentos e perguntas frequentes |
| `js/faq.js` | Sanfona do FAQ e cartões de depoimento |
| `js/depoimentos-data.js` | Lista de depoimentos reais (vazia: bloco escondido) |
| `css/rodape.css` | Estilo do rodapé e contato |
| `js/rodape.js` | Contatos, horários e WhatsApp do rodapé |
| `css/agenda.css` | Estilo da agenda |
| `js/main.js` | Interações da hero |
| `js/agenda-config.js` | Horários, dias, bloqueios e WhatsApp (único arquivo a editar) |
| `js/agenda.js` | Calendário, horários, formulário e envio |
| `js/icons.js` | Injeta o sprite de ícones (gerado) |
| `assets/fotos/` | Fotos da Ariadina geradas no Flow (Nano Banana 2.1) a partir de 3 fotos reais dela, com a roupa nos tons do site |
| `assets/fotos-antigas-ia/` | Cópia das 4 fotos antigas (veterinária ruiva genérica). Não é usada no site, pode apagar depois da aprovação |
| `assets/pets/` | Foto de golden e gato |
| `assets/icons/` | 30 ícones em SVG e `sprite.svg` |
| `tools/gen-icons.js` | Fonte única dos ícones. Edite e rode `node tools/gen-icons.js` |

## Hero: o que tem

- Título "O vet vai até o seu pet" com palavras que sobem e a última palavra girando entre pet, cão e gato.
- Agenda rápida: mostra os 3 próximos dias de atendimento (terça, quinta e sábado, calculados pela data de hoje). Ao escolher um dia, o botão vira "Agendar quinta, 26/11", a escolha fica salva na sessão e o evento `ab:dia-escolhido` avisa a futura agenda.
- Foto da veterinária em arco com revelação, selo circular giratório, três cartões flutuantes e foto em círculo.
- Micro interações: botão magnético, ondulação no clique, setas que mexem, selo que acelera no hover, paralaxe suave do mouse, patinhas que caminham no fundo, topo que muda ao rolar.
- Acessibilidade: link para pular ao conteúdo, foco visível, grupo de dias navegável por setas, `prefers-reduced-motion` desliga todo o movimento, funciona sem JavaScript.
- Tema claro fixo.

## Ícones

30 ícones próprios, traço 1,75 em grade 24 e um detalhe em caramelo: pata, cão, gato, agenda, horário, em casa, vacina, consulta, maleta, sofá, sem transporte, sem espera, cuidado, confiança, confirmado, destaque, novidade, depoimento, conversa, telefone, e-mail, local, câmera, pessoa, seta, setas, menu, fechar e mais.

```html
<script src="js/icons.js"></script>
<svg class="ic ic--lg" aria-hidden="true"><use href="#calendar"/></svg>
```

## Pendências

- [ ] **Confirmar com a Ariadina:** horários de atendimento (hoje 9h às 17h na terça e quinta, 9h às 13h no sábado), duração de cada atendimento (hoje 1 hora), se há pausa para almoço e quantos atendimentos por dia
- [ ] **Número do WhatsApp** em `js/agenda-config.js`. Sem ele a agenda só copia a mensagem
- [ ] Controle de horários ocupados: hoje é manual em `blockedSlots`. Para bloqueio automático é preciso um serviço de agenda (por exemplo Google Agenda ou um sistema de agendamento)
- [ ] Telefone e @ reais, cidade e região de atendimento
- [ ] Serviços exatos e preços (hoje só consulta e vacina)
- [ ] **Aprovação das fotos pela Ariadina:** todas as fotos do site agora usam o rosto dela, geradas por IA a partir de 3 fotos reais (baixadas em 2K). Ela precisa ver e aprovar antes de publicar
- [ ] Domínio, hospedagem, SEO local e Google Analytics
- [ ] **Depoimentos reais** com autorização de quem escreveu, em `js/depoimentos-data.js`
- [ ] **Revisar as 7 respostas do FAQ** com a Ariadina (região, remarcação, espécies atendidas, horários) e manter o JSON-LD do `<head>` igual
- [ ] **Preencher o bloco `contato`** em `js/agenda-config.js`: e-mail, Instagram, região e CRMV da Ariadina
- [ ] Dados estruturados de negócio local (endereço ou área, telefone) para o Google, só quando os dados reais existirem
- [ ] Apagar `_m.html` e a pasta `.claude` na raiz do projeto: são restos de teste e não fazem parte do site
