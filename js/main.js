/* =========================================================
   Rama Digital — main.js
   Comportamento do site. Uma função por responsabilidade.
   Os dados vêm de js/config.js (window.RAMA_CONFIG).
   ========================================================= */

(function () {
  'use strict';

  const CFG = window.RAMA_CONFIG;
  if (!CFG) return;

  const reduzirMovimento = window.matchMedia('(prefers-reduced-motion: reduce)');
  const menuDesktop = window.matchMedia('(min-width: 64rem)');

  /* ---------- Utilitários ---------- */

  /** Remove os colchetes de marcadores pendentes para uso em links. */
  function limparMarcador(valor) {
    return String(valor).replace(/[[\]]/g, '').trim();
  }

  /** Lê um valor do config por caminho: 'planos.essencial.nome'. */
  function lerConfig(caminho) {
    return caminho.split('.').reduce(function (obj, chave) {
      return obj == null ? undefined : obj[chave];
    }, CFG);
  }

  /** Número vira "R$ 990"; texto é exibido como está. */
  function formatarPreco(preco) {
    if (typeof preco !== 'number') return String(preco);
    return preco.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: Number.isInteger(preco) ? 0 : 2,
    });
  }

  /** Monta o link do WhatsApp com a mensagem codificada (acentos e quebras de linha incluídos). */
  function buildWhatsAppLink(mensagem) {
    const texto = mensagem || CFG.mensagens.padrao;
    return 'https://wa.me/' + CFG.whatsapp.numero + '?text=' + encodeURIComponent(texto);
  }

  /** Executa a função no máximo uma vez por quadro durante a rolagem. */
  function aoRolar(fn) {
    let agendado = false;
    window.addEventListener('scroll', function () {
      if (agendado) return;
      agendado = true;
      window.requestAnimationFrame(function () {
        fn();
        agendado = false;
      });
    }, { passive: true });
    fn();
  }

  /* ---------- Dados do config no HTML ---------- */

  /** [data-cfg="caminho"] recebe o texto; [data-cfg-href="tipo"] recebe o link. */
  function initConfigBindings() {
    document.querySelectorAll('[data-cfg]').forEach(function (el) {
      const valor = lerConfig(el.dataset.cfg);
      if (valor !== undefined) el.textContent = valor;
    });

    const links = {
      email: function () { return 'mailto:' + limparMarcador(CFG.email); },
      instagram: function () { return CFG.instagram.url; },
      telefone: function () { return 'tel:+' + CFG.whatsapp.numero; },
    };

    document.querySelectorAll('[data-cfg-href]').forEach(function (el) {
      const gerar = links[el.dataset.cfgHref];
      if (gerar) el.href = gerar();
    });
  }

  /** Todo elemento [data-whatsapp] vira link do WhatsApp com a mensagem indicada. */
  function initWhatsAppLinks() {
    document.querySelectorAll('[data-whatsapp]').forEach(function (el) {
      const chave = el.dataset.whatsapp || 'padrao';
      el.href = buildWhatsAppLink(CFG.mensagens[chave]);
    });
  }

  /** Nome, preço e botão de cada plano, a partir de CFG.planos. */
  function initPlans() {
    document.querySelectorAll('[data-plano]').forEach(function (cartao) {
      const plano = CFG.planos[cartao.dataset.plano];
      if (!plano) return;

      const nome = cartao.querySelector('[data-plano-nome]');
      const preco = cartao.querySelector('[data-plano-preco]');
      const periodo = cartao.querySelector('[data-plano-periodo]');
      const botao = cartao.querySelector('[data-plano-botao]');

      if (nome) nome.textContent = plano.nome;
      if (preco) preco.textContent = formatarPreco(plano.preco);
      if (periodo) periodo.textContent = plano.periodo || '';
      if (botao) botao.href = buildWhatsAppLink(CFG.mensagens.plano.replace('{plano}', plano.nome));
    });
  }

  /** Troca as iniciais pela foto quando o caminho estiver preenchido no config. */
  function initPartnerPhotos() {
    document.querySelectorAll('[data-foto]').forEach(function (el) {
      const caminho = CFG.fotos[el.dataset.foto];
      if (!caminho) return;

      const img = new Image(240, 240);
      img.src = caminho;
      img.alt = el.dataset.fotoAlt || '';
      img.loading = 'lazy';
      img.decoding = 'async';
      el.replaceChildren(img);
    });
  }

  function initYear() {
    document.querySelectorAll('[data-ano]').forEach(function (el) {
      el.textContent = new Date().getFullYear();
    });
  }

  /* ---------- Header e menu ---------- */

  /** Header transparente sobre o hero; sólido após rolar. */
  function initHeader() {
    const header = document.querySelector('[data-header]');
    if (!header || header.hasAttribute('data-header-fixo')) return;

    aoRolar(function () {
      header.classList.toggle('is-solid', window.scrollY > 24);
    });
  }

  /** Menu hambúrguer: aria-expanded, fecha com Esc, com clique em link e ao virar desktop. */
  function initMenu() {
    const botao = document.querySelector('[data-menu-toggle]');
    const menu = botao && document.getElementById(botao.getAttribute('aria-controls'));
    const header = document.querySelector('[data-header]');
    if (!botao || !menu) return;

    function definir(aberto) {
      botao.setAttribute('aria-expanded', String(aberto));
      botao.setAttribute('aria-label', aberto ? 'Fechar menu' : 'Abrir menu');
      menu.classList.toggle('is-open', aberto);
      header.classList.toggle('is-open', aberto);
      document.body.classList.toggle('menu-aberto', aberto);
    }

    botao.addEventListener('click', function () {
      definir(botao.getAttribute('aria-expanded') !== 'true');
    });

    menu.addEventListener('click', function (evento) {
      if (evento.target.closest('a')) definir(false);
    });

    document.addEventListener('keydown', function (evento) {
      if (evento.key === 'Escape' && botao.getAttribute('aria-expanded') === 'true') {
        definir(false);
        botao.focus();
      }
    });

    menuDesktop.addEventListener('change', function (mq) {
      if (mq.matches) definir(false);
    });
  }

  /** Destaca no menu o link da seção visível. */
  function initScrollSpy() {
    const links = document.querySelectorAll('.nav__link[href^="#"]');
    if (!links.length || !('IntersectionObserver' in window)) return;

    const porId = {};
    links.forEach(function (link) { porId[link.hash.slice(1)] = link; });

    const observador = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (entrada) {
        if (!entrada.isIntersecting) return;
        links.forEach(function (link) {
          link.classList.remove('is-active');
          link.removeAttribute('aria-current');
        });
        const ativo = porId[entrada.target.id];
        if (ativo) {
          ativo.classList.add('is-active');
          ativo.setAttribute('aria-current', 'true');
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });

    document.querySelectorAll('main section[id]').forEach(function (secao) {
      observador.observe(secao);
    });
  }

  /* ---------- Animações ---------- */

  /** Fade + translateY ao entrar na tela. Desligado com prefers-reduced-motion. */
  function initScrollReveal() {
    const itens = document.querySelectorAll('.reveal');
    if (!itens.length) return;

    if (reduzirMovimento.matches || !('IntersectionObserver' in window)) {
      itens.forEach(function (el) { el.classList.add('is-visible'); });
      return;
    }

    const observador = new IntersectionObserver(function (entradas, obs) {
      entradas.forEach(function (entrada) {
        if (!entrada.isIntersecting) return;
        entrada.target.classList.add('is-visible');
        obs.unobserve(entrada.target);
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.1 });

    itens.forEach(function (el) { observador.observe(el); });
  }

  /** Botão flutuante do WhatsApp aparece após 300px de rolagem. */
  function initWhatsAppFloat() {
    const botao = document.querySelector('[data-wa-float]');
    if (!botao) return;

    aoRolar(function () {
      botao.classList.toggle('is-visible', window.scrollY > 300);
    });
  }

  /* ---------- Dúvidas frequentes ---------- */

  /** Accordion acessível: apenas um item aberto por vez. */
  function initFaq() {
    const botoes = document.querySelectorAll('[data-faq-botao]');
    if (!botoes.length) return;

    function painelDe(botao) {
      return document.getElementById(botao.getAttribute('aria-controls'));
    }

    function definir(botao, aberto) {
      botao.setAttribute('aria-expanded', String(aberto));
      painelDe(botao).hidden = !aberto;
    }

    // Sem JS as respostas ficam visíveis; com JS começam fechadas.
    botoes.forEach(function (botao) { definir(botao, false); });

    botoes.forEach(function (botao) {
      botao.addEventListener('click', function () {
        const abrir = botao.getAttribute('aria-expanded') !== 'true';
        botoes.forEach(function (outro) { definir(outro, false); });
        definir(botao, abrir);
      });
    });
  }

  /* ---------- Formulário de contato ---------- */

  /** Preenche o select de planos a partir do config. */
  function preencherSelectPlanos(select) {
    Object.values(CFG.planos).forEach(function (plano) {
      select.add(new Option(plano.nome, plano.nome));
    });
    select.add(new Option('Ainda não sei', 'Ainda não sei'));
  }

  const REGRAS = {
    nome: { obrigatorio: 'Informe o seu nome.', minimo: 2, curto: 'O nome precisa ter pelo menos 2 letras.' },
    empresa: { obrigatorio: 'Informe o nome da sua empresa.', minimo: 2, curto: 'O nome da empresa precisa ter pelo menos 2 letras.' },
  };

  /** Valida um campo e mostra/limpa a mensagem de erro. Retorna true se válido. */
  function validarCampo(campo) {
    const regra = REGRAS[campo.name];
    if (!regra) return true;

    const valor = campo.value.trim();
    let erro = '';
    if (!valor) erro = regra.obrigatorio;
    else if (valor.length < regra.minimo) erro = regra.curto;

    const saida = document.getElementById(campo.getAttribute('aria-describedby'));
    if (saida) saida.textContent = erro;
    campo.setAttribute('aria-invalid', String(Boolean(erro)));
    return !erro;
  }

  /** Monta o texto da mensagem com os campos preenchidos. */
  function montarMensagemFormulario(dados) {
    const linhas = [
      'Olá! Vim pelo site da Rama Digital.',
      '',
      '*Nome:* ' + dados.nome,
      '*Empresa:* ' + dados.empresa,
    ];
    if (dados.ramo) linhas.push('*Ramo de atividade:* ' + dados.ramo);
    if (dados.plano) linhas.push('*Plano de interesse:* ' + dados.plano);
    if (dados.mensagem) linhas.push('', '*Mensagem:*', dados.mensagem);
    return linhas.join('\n');
  }

  /**
   * Valida e abre o WhatsApp com a mensagem pronta.
   * LGPD: nada é armazenado nem enviado a servidor algum — os dados
   * só existem na memória da página até o WhatsApp ser aberto.
   */
  function initContactForm() {
    const form = document.querySelector('[data-form-contato]');
    if (!form) return;

    const status = form.querySelector('[data-form-status]');
    const select = form.querySelector('select[name="plano"]');
    const obrigatorios = Array.from(form.querySelectorAll('[required]'));

    if (select) preencherSelectPlanos(select);

    obrigatorios.forEach(function (campo) {
      campo.addEventListener('blur', function () {
        if (campo.value.trim()) validarCampo(campo);
      });
      campo.addEventListener('input', function () {
        if (campo.getAttribute('aria-invalid') === 'true') validarCampo(campo);
      });
    });

    form.addEventListener('submit', function (evento) {
      evento.preventDefault();

      const invalidos = obrigatorios.filter(function (campo) { return !validarCampo(campo); });
      if (invalidos.length) {
        status.className = 'form__status is-erro';
        status.textContent = invalidos.length === 1
          ? 'Falta 1 campo obrigatório. Confira o campo destacado.'
          : 'Faltam ' + invalidos.length + ' campos obrigatórios. Confira os campos destacados.';
        invalidos[0].focus();
        return;
      }

      const dados = {};
      new FormData(form).forEach(function (valor, chave) { dados[chave] = String(valor).trim(); });

      const link = buildWhatsAppLink(montarMensagemFormulario(dados));
      window.open(link, '_blank', 'noopener');

      status.className = 'form__status is-ok';
      status.textContent = 'Pronto! Abrimos o WhatsApp com a sua mensagem. Se a janela não abriu, ';
      const alternativo = document.createElement('a');
      alternativo.href = link;
      alternativo.target = '_blank';
      alternativo.rel = 'noopener';
      alternativo.textContent = 'clique aqui para continuar.';
      status.append(alternativo);
    });
  }

  /* ---------- Início ----------
     Analytics: esta versão não usa cookies nem rastreamento.
     Se um dia for adicionado (Google Analytics, Pixel etc.), crie aqui
     um initConsentBanner() e só carregue os scripts após o aceite. */
  function init() {
    initConfigBindings();
    initWhatsAppLinks();
    initPlans();
    initPartnerPhotos();
    initYear();
    initHeader();
    initMenu();
    initScrollSpy();
    initScrollReveal();
    initWhatsAppFloat();
    initFaq();
    initContactForm();
  }

  init();
})();
