# Rama Digital — site institucional

Site estático em HTML, CSS e JavaScript puro. Não tem framework nem etapa de build: é só abrir o `index.html` no navegador.

```
/
├── index.html                  página principal
├── politica-de-privacidade.html
├── 404.html                    página de erro (usa caminhos absolutos /css, /js)
├── css/style.css               estilos, organizados por seções numeradas
├── js/config.js                ← TODOS os dados editáveis
├── js/main.js                  comportamento (menu, FAQ, formulário…)
├── img/favicon.svg
├── img/og-image.png            imagem de compartilhamento (1200×630)
├── img/portfolio/              imagens dos projetos
├── robots.txt
└── sitemap.xml
```

---

## 1. Editar dados, textos e preços

### Dados que mudam com frequência → `js/config.js`

Telefone, mensagens do WhatsApp, Instagram, e-mail, CNPJ, preços dos planos, resposta sobre pagamento e fotos dos sócios ficam **só** nesse arquivo. O `main.js` injeta os valores no HTML.

| Quero mudar… | Edite em `config.js` |
|---|---|
| Número do WhatsApp | `whatsapp.numero` (só dígitos, com 55 + DDD) e `whatsapp.exibicao` |
| Mensagem padrão do WhatsApp | `mensagens.padrao` |
| Preço de um plano | `planos.essencial.preco` (idem `profissional` e `manutencao`) |
| Instagram | `instagram.usuario` e `instagram.url` |
| E-mail | `email` |
| CNPJ | `cnpj` |
| Resposta "Como funciona o pagamento?" | `pagamento` |

**Preços:** use um número para o site formatar sozinho (`preco: 990` vira "R$ 990") ou um texto livre (`preco: 'R$ 990,00'`).

> Se mudar o número do WhatsApp, troque também os `href="https://wa.me/5528999119982"` do HTML. Eles só são usados quando o JavaScript está desligado, mas devem ficar iguais.

### Textos fixos → `index.html`

Títulos, descrições dos serviços, itens dos planos e perguntas frequentes ficam direto no HTML, com comentários marcando cada seção (`<!-- ===== PLANOS ===== -->`).

Ao mudar uma pergunta ou resposta do FAQ, atualize também o bloco `FAQPage` (JSON-LD) no `<head>` do `index.html`, para o Google ler o mesmo texto que aparece na página.

---

## 2. Trocar fotos e portfólio

### Fotos dos sócios

1. Salve as fotos quadradas (mínimo 240×240 px, de preferência `.webp` ou `.jpg`) em `img/`, por exemplo `img/matheus.jpg` e `img/raphael.jpg`.
2. Em `config.js`, preencha:
   ```js
   fotos: {
     matheus: 'img/matheus.jpg',
     raphael: 'img/raphael.jpg',
   },
   ```
Enquanto o caminho estiver vazio (`''`), o site mostra as iniciais M e R.

### Projetos do portfólio

Cada projeto é um `<article class="projeto">` na seção Portfólio do `index.html`. Para trocar um modelo por um projeto real:

1. Exporte uma imagem da página do cliente em **1600×1000 px** (proporção 16:10), converta para **WebP** (por exemplo em squoosh.app) e salve em `img/portfolio/`.
2. No `<img>`, troque o `src`, ajuste `width="1600" height="1000"` e escreva um `alt` descritivo.
3. Troque o nicho (`projeto__nicho`) e o nome (`<h3>`).
4. Remova o selo `<figcaption class="selo">Projeto modelo</figcaption>`.
5. Opcional: para levar ao site do cliente, envolva o `<h3>` num link:
   `<h3><a href="https://sitedocliente.com.br" target="_blank" rel="noopener">Nome do cliente</a></h3>`
6. Quando todos forem reais, apague a frase "Os projetos acima são demonstrações…".

### Imagem de compartilhamento

`img/og-image.png` (1200×630) aparece quando o link é enviado no WhatsApp, Instagram ou LinkedIn. Pode ser substituída por outra do mesmo tamanho e com o mesmo nome.

---

## 3. Testar no computador

Abrir o `index.html` com dois cliques funciona. Para testar como em produção (necessário para a página 404), rode um servidor local na pasta do projeto:

```bash
python -m http.server 8000
```

e acesse `http://localhost:8000`.

---

## 4. Publicar grátis

Antes de publicar, confirme o domínio `https://ramadigital.com.br` em: `index.html` (canonical, Open Graph, JSON-LD), `politica-de-privacidade.html` (canonical), `robots.txt` e `sitemap.xml`.

### Opção A — Netlify (mais simples, sem Git)

1. Crie uma conta em https://app.netlify.com (pode entrar com Google ou GitHub).
2. Acesse https://app.netlify.com/drop.
3. Arraste a **pasta inteira** do site para a área indicada.
4. Em alguns segundos o site estará no ar num endereço `https://nome-aleatorio.netlify.app`.
5. Em **Site configuration → Change site name**, escolha um nome melhor.
6. Para usar o domínio próprio: **Domain management → Add a domain** → digite `ramadigital.com.br` e siga as instruções de DNS (no Registro.br, altere os servidores DNS ou crie os registros indicados). O HTTPS é ativado automaticamente.
7. Para atualizar depois: **Deploys** → arraste a pasta de novo.

A página `404.html` é reconhecida automaticamente pelo Netlify.

### Opção B — Vercel (com GitHub)

1. Crie um repositório no GitHub e envie os arquivos do site (pelo GitHub Desktop ou pelo site do GitHub, em **Add file → Upload files**).
2. Entre em https://vercel.com com a conta do GitHub.
3. **Add New → Project** → escolha o repositório → **Import**.
4. Em *Framework Preset*, deixe **Other**. Não é preciso comando de build nem pasta de saída.
5. Clique em **Deploy**. O site fica em `https://nome-do-projeto.vercel.app`.
6. Domínio próprio: **Settings → Domains → Add** → `ramadigital.com.br` e configure o DNS conforme indicado.
7. Cada novo envio (commit) ao GitHub republica o site sozinho.

A Vercel também usa o `404.html` da raiz automaticamente.

### Opção C — GitHub Pages

Repositório → **Settings → Pages** → *Source: Deploy from a branch* → `main` / raiz → **Save**. Use domínio próprio (campo *Custom domain*): sem ele o site fica numa subpasta (`usuario.github.io/repositorio/`) e a página 404, que usa caminhos absolutos, perde os estilos.

### Depois de publicar

- Cadastre o site no **Google Search Console** (https://search.google.com/search-console) e envie o `sitemap.xml`.
- Crie ou atualize o **Perfil da Empresa no Google** com o link do site. Isso pesa muito na busca local.
- Rode o **Lighthouse** (Chrome → F12 → Lighthouse → Mobile).

---

## 5. Privacidade (LGPD)

- O formulário **não envia nem armazena dados**. Ele só monta a mensagem e abre o WhatsApp.
- Não há Analytics, Pixel nem cookies de rastreamento, por isso não há banner de cookies.
- A fonte Poppins é carregada do Google Fonts, o que está informado na Política de Privacidade. Para eliminar essa conexão, dá para hospedar a fonte na pasta do site (google-webfonts-helper).
- **Se adicionar analytics no futuro:** há comentários no `<head>` do `index.html` e no fim do `main.js` indicando onde entra o banner de consentimento. Os scripts de rastreamento só devem carregar após o aceite, e a Política de Privacidade precisa ser atualizada.

---

## 6. Decisões de acessibilidade

A cor `--folha` (#6CC08B) sobre `--floresta` (#1A4D3B) tem contraste 4,4:1, pouco abaixo do mínimo WCAG AA para texto pequeno (4,5:1). Por isso existem dois tons derivados em `style.css`:

- `--floresta-profunda` (#133A2C): texto dos botões verdes (5,7:1);
- `--folha-clara` (#8FD4A8): rótulos pequenos sobre fundo verde-escuro (5,6:1).

Ícones, nós da linha do tempo e elementos gráficos usam a `--folha` original.
