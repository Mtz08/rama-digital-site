/* =========================================================
   Rama Digital — config.js
   ---------------------------------------------------------
   TODOS os dados editáveis do site ficam aqui.
   Mudou um telefone, preço ou link? Edite só este arquivo.

   Dica: valores entre [COLCHETES] são marcadores pendentes.
   Eles aparecem no site exatamente assim até serem trocados.
   ========================================================= */

window.RAMA_CONFIG = Object.freeze({
  empresa: 'Rama Digital',
  cidade: 'Cachoeiro de Itapemirim/ES',

  /* ---------- WhatsApp ----------
     numero: só dígitos, com DDI 55 + DDD. */
  whatsapp: {
    numero: '5528999119982',
    exibicao: '(28) 99911-9982',
  },

  /* ---------- Mensagens pré-preenchidas do WhatsApp ----------
     {plano} é substituído pelo nome do plano escolhido. */
  mensagens: {
    padrao: 'Olá! Vim pelo site da Rama Digital e quero um orçamento.',
    plano: 'Olá! Vim pelo site da Rama Digital e tenho interesse no plano {plano}.',
    sobMedida: 'Olá! Vim pelo site da Rama Digital e preciso de um projeto sob medida.',
  },

  /* ---------- Redes e contato ---------- */
  instagram: {
    usuario: '@ramadigital.oficial',
    url: 'https://www.instagram.com/ramadigital.oficial/',
  },
  email: '[contato@ramadigital.com.br]',

  /* ---------- Planos ----------
     preco: use um número (ex.: 990) para exibir "R$ 990"
     ou um texto livre (ex.: 'R$ 990,00').
     periodo: texto exibido após o preço (ex.: '/mês'). */
  planos: {
    essencial:    { nome: 'Essencial',    preco: 'R$ 790,00', periodo: '' },
    profissional: { nome: 'Profissional', preco: 'R$ 1.290,00', periodo: '' },
  },

  /* ---------- Resposta da pergunta "Como funciona o pagamento?" ---------- */
  pagamento: 'A forma de pagamento é definida com o contratante.',

  /* ---------- Fotos dos sócios ----------
     Deixe '' para exibir as iniciais. Quando tiver as fotos,
     coloque os arquivos em /img e informe o caminho. */
  fotos: {
    matheus: '', // ex.: 'img/matheus.jpg'
    raphael: '', // ex.: 'img/raphael.jpg'
  },
});
