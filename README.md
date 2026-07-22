# Carraro Heavy Training — Site

Site institucional e formulário de avaliação do personal trainer **Renan Carraro**
(marca *CARRARO — Heavy Training*, foco em treinamento feminino).

Site **100% estático** (HTML, CSS e JavaScript puro), sem back-end e sem custo de
hospedagem. A lead recebe um diagnóstico na hora; os dados dela chegam à equipe
por **e-mail** (EmailJS) e o contato ativo acontece pelo **WhatsApp**.

🔗 **Produção:** [renancarrarotreinador.com](https://renancarrarotreinador.com)

---

## ✨ Funcionalidades

- **Landing page** enxuta, focada na conversão (fazer o diagnóstico).
- **Formulário de diagnóstico inteligente** em múltiplas etapas (contato + 9 perguntas),
  com barra de progresso e validação.
- **Diagnóstico automático ramificado pelo objetivo** (Pergunta 1):
  - *Hipertrofia e definição* → **Estímulo insuficiente** ou **Treina, mas não evolui**;
  - *Emagrecimento* → **Baixa constância**, **Gasto energético insuficiente** ou
    **Treina, mas não evolui** (com 6-7 dias de treino/semana, Baixa constância é excluída).
  - Cada resposta soma pontos e **o maior score vence**. A lead vê perfil, recomendação
    prática (estrutura de treino + cardio), foto(s) de aluna e um fechamento padrão.
- **Baralho de fotos:** diagnósticos com mais de uma foto viram um "deck" clicável
  (fotos quadradas, P&B, efeito glass).
- **PT/EN sem recarregar:** toggle com ícone de globo no topo troca o idioma do site
  inteiro dinamicamente (inclusive o diagnóstico já exibido), sem alterar a URL;
  a escolha persiste em `localStorage`. Dicionário em `assets/js/i18n.js` +
  `DIAGNOSES_EN` em `assets/js/form.js`.
- **WhatsApp (CTA "Fale com a nossa equipe"):** o botão final abre o WhatsApp da equipe com uma
  mensagem curta de interesse (sem as respostas) — a lead que quer acompanhamento profissional.
- **E-mail (EmailJS):** ao concluir, diagnóstico + dados + respostas são enviados para a equipe
  (To/Cc fixos no template). Com retry + fila local de reenvio. Liga/desliga em `EMAIL_ENABLED`.
- **País / estado / cidade inteligentes:** ao escolher Brasil, seleciona-se o estado e a
  cidade é filtrada por UF (municípios do IBGE); para alunas no exterior, cidade em texto livre.
- **Validação** de campos obrigatórios e de e-mail, com consentimento LGPD.
- **Rastreabilidade:** cada resposta, o diagnóstico e os scores são logados no console do navegador.
- Identidade visual da marca: tipografia *Anybody* e paleta bordô.
- Responsivo (desktop e mobile) e acessível (foco de teclado, `prefers-reduced-motion`).

> A lógica de pontuação fica em `assets/js/form.js` (`computeDiagnosis`, `diagnoseHipertrofia`,
> `diagnoseEmagrecimento` + objeto `DIAGNOSES`). As fotos das alunas ficam em
> `assets/img/photos_diagnosticos/`, nomeadas por diagnóstico e caminho
> (ex.: `treina_mas_nao_evolui_hipertrofia.jpg`, `baixa_constancia_emagrecimento.jpg`).
> Foto ausente mostra um placeholder "Foto da aluna".

## 🗂️ Estrutura do projeto

```
.
├── index.html              # Landing page
├── avaliacao.html          # Formulário de diagnóstico (contato + 9 perguntas + resultado)
├── HANDOVER.md             # Contexto completo do projeto (leia antes de mexer)
├── assets/
│   ├── css/
│   │   ├── styles.css      # Estilos base, tokens e landing
│   │   └── form.css        # Estilos do formulário e da tela de diagnóstico
│   ├── js/
│   │   ├── main.js         # Interações da landing
│   │   └── form.js         # Perguntas, score, diagnósticos, WhatsApp, EmailJS
│   ├── data/
│   │   ├── paises.json              # Lista de países (pt-BR)
│   │   ├── estados.json             # Estados do Brasil (UF + nome)
│   │   └── cidades-por-estado.json  # Municípios do Brasil por UF (IBGE)
│   ├── fonts/              # Família Anybody (.ttf)
│   └── img/                # Logos / fotos dos diagnósticos (photos_diagnosticos/)
└── README.md
```

> A pasta `Materiais - Branding Renan/` (originais de marca e fotos RAW) **não é versionada** — veja `.gitignore`.

## 🚀 Rodando localmente

É um site estático, então basta servir a pasta por HTTP (não abra via `file://`,
senão as fontes não carregam por CORS).

```bash
# na raiz do projeto
python3 -m http.server 4173
```

Acesse **http://localhost:4173**. Para parar: `Ctrl + C`.

Alternativas: extensão *Live Server* no VS Code, ou `npx serve`.

## ⚙️ Configuração

| O quê | Onde |
|------|------|
| Número de WhatsApp do CTA | `assets/js/form.js` → `WHATSAPP_NUMBER` (formato internacional, só dígitos) — hoje o do Renan |
| Envio de e-mail liga/desliga | `assets/js/form.js` → `EMAIL_ENABLED` |
| Credenciais EmailJS | `assets/js/form.js` → `EMAILJS_PUBLIC_KEY` / `EMAILJS_SERVICE_ID` / `EMAILJS_TEMPLATE_ID` |
| Perguntas do formulário | `avaliacao.html` |
| Textos/recomendações dos diagnósticos | `assets/js/form.js` → objeto `DIAGNOSES` |
| Pesos do score | `assets/js/form.js` → `diagnoseHipertrofia` / `diagnoseEmagrecimento` |
| Cores e tipografia | `assets/css/styles.css` (`:root`) |

> ℹ️ O `WHATSAPP_NUMBER` atual é o número do **Renan**. Quando a closer entrar, trocar por ela.

## 📡 Deploy (GitHub Pages)

1. Repositório com os arquivos na **raiz** (já é o caso).
2. *Settings → Pages →* publicar a partir da branch `main` (pasta `/root`).
3. Domínio próprio (`renancarrarotreinador.com`): adicionar arquivo `CNAME`
   e apontar o DNS na GoDaddy para os IPs do GitHub Pages.

## 📊 Dados da lead

Ao concluir o formulário, o diagnóstico + dados de contato + respostas são enviados por
**e-mail** (EmailJS; To = closer, Cc = Renan, fixos no template). O CTA do WhatsApp envia
apenas uma mensagem curta de interesse. Uma evolução possível (sem custo) é gravar também
numa **Google Sheet** via Google Apps Script como backup permanente.

---

Desenvolvido por **Davi Arndt**.
