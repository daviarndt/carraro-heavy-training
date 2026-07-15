# HANDOVER — Site Carraro Heavy Training

Documento de transferência de contexto do projeto. Leia antes de mexer.

## 1. Visão geral
- **Cliente:** Renan Carraro Rosa — personal trainer, foco em **treinamento feminino**. Marca: **CARRARO — Heavy Training**.
- **Produto:** site estático com uma **landing page** + um **formulário de Diagnóstico Inteligente** (lead magnet). A aluna responde algumas perguntas, recebe na hora um diagnóstico com recomendação, e é convidada a falar com a equipe (consultoria).
- **Contratação:** serviço único de desenvolvimento (Davi). **Sem manutenção recorrente, nada de assinatura/custo mensal.**

## 2. Produção e infra
- **Domínio:** `renancarrarotreinador.com` (comprado na GoDaddy). Arquivo `CNAME` no repo.
- **Hospedagem:** **GitHub Pages**, branch `main`, servindo a raiz do repo. Deploy = `git push` (republica em ~1-2 min).
- **Sem back-end.** Tudo client-side.
- **Rodar local:** na raiz → `python3 -m http.server 4173` → abrir `http://localhost:4173`. **Não** abrir via `file://` (as fontes não carregam por CORS).

## 3. Estrutura
```
index.html                     # Landing page
avaliacao.html                 # Formulário de diagnóstico (contato + 9 perguntas + tela de resultado)
assets/
  css/styles.css               # Base, tokens (:root), landing
  css/form.css                 # Estilos do formulário e da tela de diagnóstico
  js/main.js                   # Interações da landing
  js/form.js                   # Núcleo: perguntas, SCORE, diagnósticos, WhatsApp, EmailJS
  data/paises.json             # Países (pt-BR)
  data/estados.json            # UFs do Brasil
  data/cidades-por-estado.json # Municípios por UF (IBGE)
  fonts/                       # Família Anybody (.ttf)
  img/                         # Logos
  img/photos_diagnosticos/     # Fotos das alunas por diagnóstico
README.md
CNAME
```
> A pasta `Materiais - Branding Renan/` (originais de marca e fotos RAW) **não é versionada** (`.gitignore`).

## 4. Identidade visual
- Fonte **Anybody** (inclui Anybody Condensed Black para títulos display).
- Paleta: bordô `#6E0D1F` + off-white `#F4F1EC` + preto `#0E0E0E` (tokens em `styles.css :root`).

## 5. Landing (`index.html`)
Enxuta, focada em levar ao diagnóstico (sem seção "sobre o Renan", sem vendas pesadas). Hero com título "Descubra o que está travando a sua evolução", seção "Como funciona" (3 passos) e CTA final. A seção da foto do Renan foi removida.

## 6. Formulário / Diagnóstico (`avaliacao.html` + `form.js`)

### Fluxo
`Contato → 9 perguntas → score → diagnóstico (texto + recomendação + foto + fechamento) → CTA WhatsApp`.
Multi-etapas (uma tela por pergunta), barra de progresso, validação por etapa. `Etapa X de N`.

### As 9 perguntas (name do radio → opções)
1. `objetivo` → **Hipertrofia e definição** | **Emagrecimento** *(ramifica o algoritmo)*
2. `dias` → 3 / 4 / 5 / 6 / 7 dias
3. `tempo` → Menos de 6 meses | Entre 6 meses e 1 ano | Entre 1 e 2 anos | Mais de 2 anos
4. `interrupcoes` → Nenhuma | 1 vez | 2 vezes | 3 vezes ou mais
5. `dificuldade` → Falta de tempo | Trabalho | Filhos/família | Falta de motivação | Não sei como organizar meu treino
6. `estruturado` → Sim, com acompanhamento profissional | Sim, mas monto sozinha | Uso treinos prontos da internet | Não tenho planejamento
7. `registro` → Sempre | Às vezes | Nunca
8. `aerobico` → Nenhum | Menos de 60 minutos | Entre 60 e 120 minutos | Mais de 120 minutos
9. `satisfacao` → Muito satisfeita | Parcialmente satisfeita | Insatisfeita

### Algoritmo (`computeDiagnosis` em `form.js`)
A P1 (`objetivo`) escolhe a função de pontuação. **Cada resposta soma pontos; o maior score vence (empate = ordem de listagem, via `pickMax`).**

**Objetivo "Hipertrofia e definição" — `diagnoseHipertrofia`** (Estímulo insuficiente `ei` vs Treina-mas-não-evolui `tne`) — pesos EXATOS do documento do Renan:
- dias: 3→ei+4 · 4→ei+2,tne+1 · 5→tne+2 · 6→tne+3 · 7→tne+3
- tempo: <6m→ei+2 · 6m-1a→ei+1 · 1-2a→tne+1 · >2a→tne+2
- interrupcoes: Nenhuma→tne+2 · 1x→ei+1 · 2x→ei+3 · 3x+→ei+4
- dificuldade: tempo/trabalho/filhos/motivação→ei+2 · não sei→ei+1,tne+1
- estruturado: acompanhamento→tne+2 · sozinha→tne+1 · internet→ei+2 · sem plano→ei+3
- registro: Sempre→tne+3 · Às vezes→tne+1,ei+1 · Nunca→ei+3
- aerobico: Nenhum→ei+1 · <60→ei+1 · 60-120→0 · >120→0
- satisfacao: Muito→tne+1 · Parcial→tne+2 · Insatisfeita→ei+2

**Objetivo "Emagrecimento" — `diagnoseEmagrecimento`** (Baixa constância `bc` vs Gasto energético insuf. `gei` vs Treina-mas-não-evolui `tne`):
- **Regra dura:** com **6 ou 7 dias** de treino, `constancia` é **excluída da disputa** (filtro antes do `pickMax`) — alta frequência nunca pode resultar em "Baixa constância".
- dias: 3→bc+3 · 4→bc+1 · 5→gei+1,tne+1 · 6→gei+3,tne+2 · 7→gei+3,tne+2
- tempo: <6m→bc+1 · 6m-1a→0 · 1-2a→tne+1 · >2a→tne+2
- interrupcoes: Nenhuma→gei+2,tne+2 · 1x→gei+1,tne+1 · 2x→bc+3 · 3x+→bc+4
- dificuldade: tempo/trabalho/filhos/motivação→bc+2 · não sei→bc+1
- estruturado: acompanhamento→tne+2 · sozinha→tne+1 · internet→bc+1 · sem plano→bc+3
- registro: Sempre→tne+2 · Às vezes→tne+1 · Nunca→bc+1
- aerobico: Nenhum→gei+3 · <60→gei+2 · 60-120→gei+1 · >120→tne+2
- satisfacao: Muito→0 · Parcial→tne+1 · Insatisfeita→tne+2

> ⚠️ **Pesos do Emagrecimento são uma PROPOSTA** (o documento do Renan só definiu os "drivers"/maiores pesos, não os números). Podem ser recalibrados — o Renan ainda não confirmou os números finais.
> A exclusão de BC em 6-7 dias foi pedida explicitamente pelo Davi/Renan (bug corrigido: 6-7x caía em BC).

### Diagnósticos (objeto `DIAGNOSES` em `form.js`)
5 entradas — cada uma com `title`, `photos[]`, `profile` (HTML, vários `<p>`) e `rec` (HTML da recomendação):
- `estimulo` (hipertrofia → Estímulo insuficiente) — Upper/Lower Seg-Sex com **Quarta = Cardio 120min**
- `evolucao_hiper` (hipertrofia → Treina, mas não evolui) — dupla progressão + **Cardio 120min**
- `constancia` (emagrecimento → Baixa constância) — Full Body 3x + **Cardio 150min** + atividade diária
- `gasto` (emagrecimento → Gasto energético insuficiente) — Full Body 3x + **Cardio 180min** + treine pesado
- `evolucao_emag` (emagrecimento → Treina, mas não evolui) — Upper/Lower + **Cardio 180min**

*"Treina, mas não evolui" aparece nas duas branches com TÍTULO igual mas texto/recomendação/foto diferentes.*
O conteúdo (textos, exercícios, metas de cardio) segue a **especificação final do Renan (jul/2026)** — foi passada como fonte única; qualquer mudança de conteúdo deve vir dele.

**Fechamento padrão** (igual para todos): bloco estático `.diag__closing` em `avaliacao.html` (não fica dentro de cada diagnóstico), com o texto "Importante: ..." + parágrafo sobre individualização/consultoria. Logo abaixo vem o CTA.

### Fotos / baralho
- `assets/img/photos_diagnosticos/` — nomeadas por **diagnóstico + caminho**:
  - `estimulo_insuficiente.jpeg` (hipertrofia, 1 foto)
  - `treina_mas_nao_evolui_hipertrofia.jpg` (1 foto)
  - `baixa_constancia_emagrecimento.jpg` + `baixa_constancia_2_emagrecimento.jpg` (2 fotos → baralho)
  - `treina_mas_nao_evolui_emagrecimento.jpg` + `treina_mas_nao_evolui_2_emagrecimento.jpg` (2 fotos → baralho)
  - **Falta** `gasto_energetico_insuficiente.jpg` (mostra placeholder "Foto da aluna").
- `setupDeck()` em `form.js`: quando um diagnóstico tem +1 foto, vira um **baralho** — clicar joga a foto do topo pro fundo com animação. Fotos ficam quadradas, P&B (grayscale), com moldura estilo "liquid glass". Ciclo concluído por `setTimeout` (não depende de `transitionend`).
- Pastas de originais (ex.: material bruto de fotos) **não são versionadas** — ver `.gitignore`.

## 6.1 Idiomas (PT/EN)
- Toggle (globo + código) no topo das duas páginas; troca **sem reload e sem mudar a URL**; escolha salva em `localStorage` (`carraro_lang`).
- Estáticos: `assets/js/i18n.js` (dicionário `STRINGS` + `[data-i18n]`/`[data-i18n-placeholder]`; API `window.i18n`).
- Dinâmicos: `DIAGNOSES_EN` em `form.js` (`getDiag()` escolhe o idioma); evento `langchange` re-renderiza o resultado exibido e o link do WhatsApp.
- **Os `value` dos radios ficam SEMPRE em PT** (score e e-mail intactos); só o rótulo visível traduz. O e-mail pro time sai sempre em PT.
- **Países bilíngues:** `assets/data/paises-en.json` é alinhado por índice ao `paises.json`; `renderPaises()` em `form.js` mostra o rótulo no idioma ativo (reordenado alfabeticamente por idioma, Brasil no topo e Outro no fim), mas o `value` da option é sempre o nome em PT (a checagem `pais === "Brasil"` e o e-mail dependem disso). A seleção sobrevive à troca de idioma.
- Bloco TEMP comentado já tem `data-i18n` — ao reativar os campos, a tradução funciona.

## 7. Integrações e entrega
- **WhatsApp:** constante `WHATSAPP_NUMBER` em `form.js` (formato internacional, só dígitos). É o número da **closer** do Renan (vendas). **Hoje é um número de TESTE** (`4915259100748`). O CTA abre o WhatsApp com uma **mensagem curta** de interesse ("Oi, meu nome é {nome}! ..."), sem as respostas.
- **E-mail (EmailJS):** ao concluir, envia o lead (contato + respostas + diagnóstico) por e-mail para Renan + closer. IDs no `form.js` (`EMAILJS_PUBLIC_KEY`, `EMAILJS_SERVICE_ID`, `EMAILJS_TEMPLATE_ID`). Destinatários (To=closer, Cc=Renan) são **fixos no template do EmailJS** (não no cliente). Tem **resiliência**: retry com backoff (3x) + fila local em `localStorage` que reenvia numa próxima visita (`flushPending`).
  - Segurança configurada no painel EmailJS: Allowed Origins = domínio de produção (por isso o envio **só funciona no site publicado**, não em localhost), captcha, rate limit.
  - No template use `{{conteudo}}` (bloco com tudo) e/ou `{{nome}}`,`{{email}}`,`{{whatsapp}}`,`{{instagram}}`,`{{diagnostico}}` etc.
- **Consentimento LGPD:** checkbox obrigatório na 1ª tela (hoje comentado — ver §8).
- **Rastreabilidade:** respostas, diagnóstico e scores são logados no console do navegador (`logLead`, e um `console.debug` por escolha).

## 8. ⚠️ ESTADO ATUAL — "fase de testes" (temporário)
Para agilizar os testes com o cliente, foram desativados temporariamente:
1. **Dados pessoais:** a 1ª tela mostra **só o campo Nome**. Idade, e-mail, WhatsApp, Instagram, país/estado/cidade e o consentimento estão **comentados** em `avaliacao.html` (bloco marcado `===== TEMP ... FIM TEMP =====`). O `form.js` tem guards para tolerar a ausência desses campos.
2. **E-mail:** `EMAIL_ENABLED = false` em `form.js` desativa o envio (e o flush da fila).

**Para reativar tudo (produção):**
- Em `avaliacao.html`: apagar a linha de abertura `<!-- ===== TEMP ...` e a linha `===== FIM TEMP ===== -->`.
- Em `form.js`: `EMAIL_ENABLED = true`.

## 9. Pendências
- [ ] Número **real da closer** no WhatsApp (`WHATSAPP_NUMBER`).
- [ ] Foto da aluna do **Gasto energético insuficiente** (`assets/img/photos_diagnosticos/gasto_energetico_insuficiente.jpg`).
- [ ] Ajustar **To/Cc + service** do template EmailJS para produção (closer + Renan / e-mail do Renan como remetente).
- [ ] Reativar dados pessoais + e-mail quando o cliente aprovar (§8).
- [ ] Confirmar/recalibrar os **pesos do Emagrecimento** com o Renan.

## 10. Convenções
- Commits em nome de **Davi Arndt** (`git user.name`/`user.email` do projeto). Mensagens em português, descritivas.
- A pasta `.claude/` (config local de ferramentas de dev) **não deve ser versionada**.
- Para testar a lógica de score sem navegador, dá pra extrair as funções de `form.js` e rodar no Node (o preview local pode esbarrar em restrições de sandbox dependendo do ambiente).
