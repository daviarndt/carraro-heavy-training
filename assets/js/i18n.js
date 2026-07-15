/* ============================================================
   CARRARO — i18n (PT/EN) sem recarregar a página
   - Textos estáticos: elementos com [data-i18n] / [data-i18n-placeholder]
   - A escolha persiste em localStorage (não altera a URL)
   - Dispara o evento "langchange" para conteúdo dinâmico (form.js)
   ============================================================ */

(function () {
  const LANG_KEY = "carraro_lang";

  const STRINGS = {
    pt: {
      title_index: "Carraro Heavy Training — Treinamento feminino com Renan Carraro",
      title_form: "Diagnóstico Inteligente — Carraro Heavy Training",

      /* Landing */
      nav_cta: "Fazer diagnóstico",
      hero_eyebrow: "Treinamento feminino",
      hero_title: "Descubra o que<br>está <em>travando</em><br>a sua evolução",
      hero_sub: "Responda algumas perguntas e receba um <strong>diagnóstico gratuito</strong> do seu treino — com o principal ponto a ajustar e uma recomendação prática pra começar.",
      hero_cta: "Fazer meu diagnóstico",
      hero_note: "Leva ~3 minutos · grátis e sem compromisso",
      steps_kicker: "Como funciona",
      steps_title: "Do primeiro contato ao treino",
      step1_title: "Você responde",
      step1_txt: "Responde algumas perguntas sobre seu treino, sua rotina e seus resultados. Leva poucos minutos.",
      step2_title: "Recebe o diagnóstico",
      step2_txt: "Na hora, você vê o principal ponto a ajustar no seu treino e uma recomendação prática pra começar.",
      step3_title: "Análise personalizada",
      step3_txt: "Quer ir além? Recebo suas respostas no WhatsApp e te envio uma análise sob medida — presencial ou online.",
      ctaf_title: "Bora começar?",
      ctaf_sub: "Faça seu diagnóstico gratuito agora. É o primeiro passo pro seu treino personalizado.",
      footer_diag: "Diagnóstico",
      footer_rights: "Todos os direitos reservados.",

      /* Formulário — topo/nav */
      form_back: "← Voltar",
      btn_prev: "Voltar",
      btn_next: "Próximo",
      btn_submit: "Ver meu diagnóstico",
      step_count: "Etapa {i} de {n}",

      /* Contato */
      c_title: "Vamos nos conhecer",
      c_hint: "Só pra personalizar o seu diagnóstico.",
      c_nome: "Seu nome completo",
      c_nome_ph: "Ex.: Maria Silva",
      c_nome_err: "Por favor, preencha seu nome.",
      c_idade: "Idade",
      c_idade_ph: "Ex.: 28",
      c_idade_err: "Informe sua idade.",
      c_email: "E-mail",
      c_email_ph: "Ex.: maria@email.com",
      c_email_err: "Informe um e-mail válido.",
      c_whats: "WhatsApp (com DDD)",
      c_whats_ph: "Ex.: (51) 99999-9999",
      c_whats_err: "Informe um número de contato.",
      c_insta: "Instagram (@ ou link)",
      c_insta_ph: "Ex.: @maria.silva",
      c_pais: "País onde mora",
      c_pais_err: "Selecione seu país.",
      c_estado: "Estado",
      c_estado_err: "Selecione seu estado.",
      c_cidade: "Cidade",
      c_cidade_first: "Selecione o estado primeiro…",
      c_cidade_err: "Selecione sua cidade.",
      c_cidade_ph: "Digite sua cidade",
      c_cidade_ex_err: "Informe sua cidade.",
      select_ph: "Selecione…",
      consent_txt: "Concordo em compartilhar meus dados para receber meu diagnóstico e ser contatada pela equipe do Renan Carraro.",
      consent_err: "É preciso aceitar para continuar.",
      opt_err: "Selecione uma opção.",

      /* Perguntas */
      q1: "Qual é o seu principal objetivo?",
      q1_o1: "Hipertrofia e definição",
      q1_o2: "Emagrecimento",
      q2: "Quantos dias por semana você treina atualmente?",
      q2_o1: "3 dias", q2_o2: "4 dias", q2_o3: "5 dias", q2_o4: "6 dias", q2_o5: "7 dias",
      q3: "Há quanto tempo você treina regularmente?",
      q3_o1: "Menos de 6 meses", q3_o2: "Entre 6 meses e 1 ano", q3_o3: "Entre 1 e 2 anos", q3_o4: "Mais de 2 anos",
      q4: "Nos últimos 3 meses, quantas vezes você interrompeu seus treinos por mais de duas semanas?",
      q4_o1: "Nenhuma", q4_o2: "1 vez", q4_o3: "2 vezes", q4_o4: "3 vezes ou mais",
      q5: "Qual é o principal motivo que dificulta sua rotina de treinos?",
      q5_o1: "Falta de tempo", q5_o2: "Trabalho", q5_o3: "Filhos/família", q5_o4: "Falta de motivação", q5_o5: "Não sei como organizar meu treino",
      q6: "Você segue um treino estruturado?",
      q6_o1: "Sim, com acompanhamento profissional", q6_o2: "Sim, mas monto sozinha", q6_o3: "Uso treinos prontos da internet", q6_o4: "Não tenho planejamento",
      q7: "Você registra suas cargas (ou sua evolução) durante os treinos?",
      q7_o1: "Sempre", q7_o2: "Às vezes", q7_o3: "Nunca",
      q8: "Quantos minutos de atividade aeróbica você faz por semana?",
      q8_o1: "Nenhum", q8_o2: "Menos de 60 minutos", q8_o3: "Entre 60 e 120 minutos", q8_o4: "Mais de 120 minutos",
      q9: "Você está satisfeita com seus resultados atuais?",
      q9_o1: "Muito satisfeita", q9_o2: "Parcialmente satisfeita", q9_o3: "Insatisfeita",

      /* Resultado */
      diag_kicker: "Seu diagnóstico",
      closing_1: "<strong>Importante:</strong> Este diagnóstico foi elaborado com base nas respostas fornecidas por você e representa uma orientação inicial. Embora essas recomendações sejam um excelente ponto de partida, fatores individuais como rotina, histórico de treino, limitações, alimentação e recuperação podem exigir ajustes específicos.",
      closing_2: "É justamente esse trabalho de individualização que realizamos na consultoria, acompanhando sua evolução de perto e adaptando o planejamento para que você alcance seus resultados da forma mais eficiente possível.",
      cta_title: "Fale com a nossa equipe",
      cta_btn: "Receber análise personalizada",
      cta_hint: "Se o WhatsApp não abrir sozinho, use o botão acima.",
      deck_hint: "Toque para ver mais ↻",
      photo_fallback: "Foto da aluna",
      photo_alt: "Aluna do Renan Carraro",

      /* WhatsApp */
      wa_msg_named: "Oi, meu nome é {nome}! Acabei de fazer o diagnóstico no site e quero conhecer mais sobre os planos de consultoria e acompanhamento com o Renan.",
      wa_msg_anon: "Oi! Acabei de fazer o diagnóstico no site e quero conhecer mais sobre os planos de consultoria e acompanhamento com o Renan.",
    },

    en: {
      title_index: "Carraro Heavy Training — Women's training with Renan Carraro",
      title_form: "Smart Assessment — Carraro Heavy Training",

      /* Landing */
      nav_cta: "Take the assessment",
      hero_eyebrow: "Women's training",
      hero_title: "Find out what's<br><em>holding back</em><br>your progress",
      hero_sub: "Answer a few questions and get a <strong>free assessment</strong> of your training — with the main thing to fix and a practical recommendation to get started.",
      hero_cta: "Get my free assessment",
      hero_note: "Takes ~3 minutes · free, no strings attached",
      steps_kicker: "How it works",
      steps_title: "From first contact to training",
      step1_title: "You answer",
      step1_txt: "A few questions about your training, routine and results. It only takes a few minutes.",
      step2_title: "Get your assessment",
      step2_txt: "Instantly see the main thing to adjust in your training and a practical recommendation to get started.",
      step3_title: "Personalized analysis",
      step3_txt: "Want to go further? I receive your answers on WhatsApp and send you a tailored analysis — in person or online.",
      ctaf_title: "Ready to start?",
      ctaf_sub: "Take your free assessment now. It's the first step toward your personalized training.",
      footer_diag: "Assessment",
      footer_rights: "All rights reserved.",

      /* Form — top/nav */
      form_back: "← Back",
      btn_prev: "Back",
      btn_next: "Next",
      btn_submit: "See my assessment",
      step_count: "Step {i} of {n}",

      /* Contact */
      c_title: "Let's get to know each other",
      c_hint: "Just to personalize your assessment.",
      c_nome: "Your full name",
      c_nome_ph: "e.g. Maria Silva",
      c_nome_err: "Please enter your name.",
      c_idade: "Age",
      c_idade_ph: "e.g. 28",
      c_idade_err: "Enter your age.",
      c_email: "Email",
      c_email_ph: "e.g. maria@email.com",
      c_email_err: "Enter a valid email.",
      c_whats: "WhatsApp (with area code)",
      c_whats_ph: "e.g. +55 51 99999-9999",
      c_whats_err: "Enter a contact number.",
      c_insta: "Instagram (@ or link)",
      c_insta_ph: "e.g. @maria.silva",
      c_pais: "Country you live in",
      c_pais_err: "Select your country.",
      c_estado: "State",
      c_estado_err: "Select your state.",
      c_cidade: "City",
      c_cidade_first: "Select the state first…",
      c_cidade_err: "Select your city.",
      c_cidade_ph: "Type your city",
      c_cidade_ex_err: "Enter your city.",
      select_ph: "Select…",
      consent_txt: "I agree to share my information to receive my assessment and to be contacted by Renan Carraro's team.",
      consent_err: "You need to accept to continue.",
      opt_err: "Select an option.",

      /* Questions */
      q1: "What is your main goal?",
      q1_o1: "Muscle gain and definition",
      q1_o2: "Weight loss",
      q2: "How many days per week do you currently train?",
      q2_o1: "3 days", q2_o2: "4 days", q2_o3: "5 days", q2_o4: "6 days", q2_o5: "7 days",
      q3: "How long have you been training consistently?",
      q3_o1: "Less than 6 months", q3_o2: "Between 6 months and 1 year", q3_o3: "Between 1 and 2 years", q3_o4: "More than 2 years",
      q4: "In the last 3 months, how many times did you stop training for more than two weeks?",
      q4_o1: "None", q4_o2: "Once", q4_o3: "Twice", q4_o4: "3 times or more",
      q5: "What is the main thing that gets in the way of your training routine?",
      q5_o1: "Lack of time", q5_o2: "Work", q5_o3: "Kids/family", q5_o4: "Lack of motivation", q5_o5: "I don't know how to structure my training",
      q6: "Do you follow a structured training plan?",
      q6_o1: "Yes, with professional guidance", q6_o2: "Yes, but I build it myself", q6_o3: "I use ready-made plans from the internet", q6_o4: "I don't have a plan",
      q7: "Do you track your loads (or your progress) during workouts?",
      q7_o1: "Always", q7_o2: "Sometimes", q7_o3: "Never",
      q8: "How many minutes of cardio do you do per week?",
      q8_o1: "None", q8_o2: "Less than 60 minutes", q8_o3: "Between 60 and 120 minutes", q8_o4: "More than 120 minutes",
      q9: "Are you happy with your current results?",
      q9_o1: "Very happy", q9_o2: "Somewhat happy", q9_o3: "Not happy",

      /* Result */
      diag_kicker: "Your assessment",
      closing_1: "<strong>Important:</strong> This assessment was generated from the answers you provided and is meant as initial guidance. While these recommendations are an excellent starting point, individual factors such as routine, training history, limitations, nutrition and recovery may require specific adjustments.",
      closing_2: "That individualized work is exactly what we do in our coaching — following your progress closely and adapting the plan so you reach your results as efficiently as possible.",
      cta_title: "Talk to our team",
      cta_btn: "Get my personalized analysis",
      cta_hint: "If WhatsApp doesn't open automatically, use the button above.",
      deck_hint: "Tap to see more ↻",
      photo_fallback: "Client photo",
      photo_alt: "Renan Carraro's client",

      /* WhatsApp */
      wa_msg_named: "Hi, my name is {nome}! I just completed the assessment on the website and I'd like to know more about Renan's coaching and consulting plans.",
      wa_msg_anon: "Hi! I just completed the assessment on the website and I'd like to know more about Renan's coaching and consulting plans.",
    },
  };

  function getLang() {
    const saved = localStorage.getItem(LANG_KEY);
    return saved === "en" ? "en" : "pt";
  }

  function t(key, vars) {
    const lang = getLang();
    let s = (STRINGS[lang] && STRINGS[lang][key]) || STRINGS.pt[key] || key;
    if (vars) for (const k of Object.keys(vars)) s = s.replaceAll(`{${k}}`, vars[k]);
    return s;
  }

  function applyI18n() {
    const lang = getLang();
    document.documentElement.lang = lang === "en" ? "en" : "pt-BR";

    document.querySelectorAll("[data-i18n]").forEach((el) => {
      el.innerHTML = t(el.getAttribute("data-i18n"));
    });
    document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
      el.setAttribute("placeholder", t(el.getAttribute("data-i18n-placeholder")));
    });

    // Título da aba
    const page = document.body.getAttribute("data-page");
    if (page === "index") document.title = t("title_index");
    if (page === "form") document.title = t("title_form");

    // Código no botão do toggle + item ativo no menu
    document.querySelectorAll(".lang-switch__code").forEach((el) => {
      el.textContent = lang.toUpperCase();
    });
    document.querySelectorAll(".lang-switch__menu [data-lang]").forEach((btn) => {
      btn.classList.toggle("is-active", btn.getAttribute("data-lang") === lang);
    });
  }

  function setLang(lang) {
    localStorage.setItem(LANG_KEY, lang === "en" ? "en" : "pt");
    applyI18n();
    document.dispatchEvent(new CustomEvent("langchange", { detail: { lang: getLang() } }));
  }

  /* ---------- Dropdown do toggle ---------- */
  function wireSwitch() {
    document.querySelectorAll(".lang-switch").forEach((root) => {
      const btn = root.querySelector(".lang-switch__btn");
      const menu = root.querySelector(".lang-switch__menu");
      if (!btn || !menu) return;

      const close = () => { root.classList.remove("is-open"); btn.setAttribute("aria-expanded", "false"); };
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const open = root.classList.toggle("is-open");
        btn.setAttribute("aria-expanded", String(open));
      });
      menu.querySelectorAll("[data-lang]").forEach((opt) => {
        opt.addEventListener("click", () => { setLang(opt.getAttribute("data-lang")); close(); });
      });
      document.addEventListener("click", (e) => { if (!root.contains(e.target)) close(); });
      document.addEventListener("keydown", (e) => { if (e.key === "Escape") close(); });
    });
  }

  // API global (usada pelo form.js)
  window.i18n = { t, getLang, setLang, apply: applyI18n };

  wireSwitch();
  applyI18n();
})();
