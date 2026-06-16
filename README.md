# Carraro Heavy Training — Site

Site institucional e formulário de avaliação do personal trainer **Renan Carraro**
(marca *CARRARO — Heavy Training*, foco em treinamento feminino).

Site **100% estático** (HTML, CSS e JavaScript puro), sem back-end e sem custo de
hospedagem. As respostas do formulário são entregues direto no **WhatsApp** do treinador.

🔗 **Produção:** [renancarrarotreinador.com](https://renancarrarotreinador.com)

---

## ✨ Funcionalidades

- **Landing page** enxuta, focada na conversão (preenchimento da avaliação).
- **Formulário de avaliação (anamnese)** em múltiplas etapas, com barra de progresso e validação.
- **Entrega via WhatsApp:** ao concluir, abre o WhatsApp do treinador com todas as respostas já formatadas.
- **País / estado / cidade inteligentes:** ao escolher Brasil, seleciona-se o estado e a
  cidade é filtrada por UF (municípios do IBGE); para alunas no exterior, cidade em texto livre.
- **Validação** de campos obrigatórios e de e-mail.
- Identidade visual da marca: tipografia *Anybody* e paleta bordô.
- Responsivo (desktop e mobile) e acessível (foco de teclado, `prefers-reduced-motion`).

## 🗂️ Estrutura do projeto

```
.
├── index.html              # Landing page
├── avaliacao.html          # Formulário de avaliação (anamnese)
├── assets/
│   ├── css/
│   │   ├── styles.css      # Estilos base, tokens e landing
│   │   └── form.css        # Estilos do formulário
│   ├── js/
│   │   ├── main.js         # Interações da landing
│   │   └── form.js         # Lógica do formulário + WhatsApp
│   ├── data/
│   │   ├── paises.json              # Lista de países (pt-BR)
│   │   ├── estados.json             # Estados do Brasil (UF + nome)
│   │   └── cidades-por-estado.json  # Municípios do Brasil por UF (IBGE)
│   ├── fonts/              # Família Anybody (.ttf)
│   └── img/                # Logos / imagens
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
| Número de WhatsApp que recebe as respostas | `assets/js/form.js` → constante `WHATSAPP_NUMBER` (formato internacional, só dígitos) |
| Perguntas do formulário | `avaliacao.html` |
| Cores e tipografia | `assets/css/styles.css` (`:root`) |

> ⚠️ O `WHATSAPP_NUMBER` atual é um número de **teste**. Trocar pelo número do Renan antes de publicar.

## 📡 Deploy (GitHub Pages)

1. Repositório com os arquivos na **raiz** (já é o caso).
2. *Settings → Pages →* publicar a partir da branch `main` (pasta `/root`).
3. Domínio próprio (`renancarrarotreinador.com`): adicionar arquivo `CNAME`
   e apontar o DNS na GoDaddy para os IPs do GitHub Pages.

## 📊 Armazenamento dos dados

Hoje as respostas vão apenas para o WhatsApp. Uma evolução planejada (sem custo) é
gravar também numa **Google Sheet** via Google Apps Script, mantendo o histórico das
alunas organizado para a anamnese.

---

Desenvolvido por **Davi Arndt**.
