/* ============================================================
   CARRARO — Diagnóstico Inteligente (multi-step → score → WhatsApp)
   ============================================================ */

// WhatsApp da closer do Renan (a responsável por vendas) — formato internacional, só dígitos.
// Por enquanto é um número de TESTE; trocar pelo número real da closer antes de publicar.
const WHATSAPP_NUMBER = "4915259100748";

const form = document.getElementById("evalForm");
const steps = Array.from(form.querySelectorAll("[data-step]"));
const doneScreen = form.querySelector("[data-done]");
const progressBar = document.getElementById("progressBar");
const btnPrev = document.getElementById("btnPrev");
const btnNext = document.getElementById("btnNext");
const btnSubmit = document.getElementById("btnSubmit");
const formNav = form.querySelector(".form-nav");
const waLink = document.getElementById("waLink");

let current = 0;

// Labels for the WhatsApp message — contact block
const CONTACT_LABELS = {
  nome: "Nome",
  idade: "Idade",
  email: "E-mail",
  whatsapp: "WhatsApp",
  instagram: "Instagram",
  pais: "País",
  estado: "Estado",
  cidade: "Cidade",
};

// Labels for the WhatsApp message — diagnostic answers block
const QUESTION_LABELS = {
  objetivo: "Objetivo principal",
  dias: "Dias de treino/semana",
  tempo: "Tempo treinando",
  interrupcoes: "Interrupções (últimos 3 meses)",
  dificuldade: "Maior dificuldade",
  estruturado: "Treino estruturado",
  registro: "Registra cargas/repetições",
  progressao: "Aumenta cargas/repetições",
  aerobico: "Aeróbico/semana",
  satisfacao: "Satisfação com resultados",
  estagnacao: "Tempo sem evoluir",
};

/* ============================================================
   Diagnósticos
   ============================================================ */
const DIAGNOSES = {
  constancia: {
    title: "Baixa constância",
    photos: [
      "assets/img/photos_diagnosticos/baixa_constancia.jpg",
      "assets/img/photos_diagnosticos/baixa_constancia_2.jpg",
    ],
    profile:
      "Seu principal desafio não é o treino — é manter uma rotina sustentável.",
    rec: `
      <p class="diag__rec-lead">Priorize consistência antes de aumentar volume.</p>
      <h4>Estrutura sugerida: Full body 3x por semana</h4>
      <p>Segunda, quarta e sexta-feira.</p>
      <p class="diag__rec-sub">Exercícios</p>
      <ul>
        <li>Cadeira flexora</li>
        <li>Leg press</li>
        <li>Abdutora</li>
        <li>Remada</li>
        <li>Desenvolvimento</li>
        <li>Tríceps</li>
        <li>Abdômen</li>
      </ul>
      <p class="diag__rec-sub">Parâmetros</p>
      <ul>
        <li>2 a 3 séries por exercício</li>
        <li>8 a 12 repetições</li>
        <li>Sessões de 45 a 60 minutos</li>
      </ul>
      <p class="diag__rec-foot"><strong>Objetivo:</strong> criar uma rotina sustentável e fácil de manter.</p>
    `,
  },
  estimulo: {
    title: "Estímulo insuficiente para hipertrofia",
    photos: ["assets/img/photos_diagnosticos/estimulo_insuficiente.jpeg"],
    profile:
      "Você treina regularmente, mas o estímulo total atual pode estar abaixo do necessário para o seu objetivo.",
    rec: `
      <p class="diag__rec-lead">Aumente gradualmente a frequência e o volume semanal.</p>
      <h4>Estrutura sugerida: Upper/Lower</h4>
      <ul>
        <li>Segunda: Upper</li>
        <li>Terça: Lower</li>
        <li>Quinta: Upper</li>
        <li>Sexta: Lower</li>
        <li>Sábado (opcional): foco em glúteos</li>
      </ul>
      <p class="diag__rec-sub">Objetivos</p>
      <ul>
        <li>4 a 5 treinos por semana</li>
        <li>10 a 15 séries semanais por grupo muscular</li>
        <li>Progressão planejada</li>
      </ul>
    `,
  },
  evolucao: {
    title: "Treina, mas não evolui",
    photos: ["assets/img/photos_diagnosticos/treina_mas_nao_evolui.jpg"],
    profile:
      "Você já construiu uma boa rotina de treinos. Agora, seu próximo nível de resultado depende de ajustes mais estratégicos.",
    rec: `
      <p class="diag__rec-lead">Foque menos em quantidade e mais em qualidade.</p>
      <p class="diag__rec-sub">Priorize</p>
      <ul>
        <li>Registro de cargas e repetições</li>
        <li>Progressão semanal</li>
        <li>Seleção adequada de exercícios</li>
        <li>Boa execução</li>
        <li>Proximidade da falha</li>
      </ul>
      <p>Escolha entre 5 e 8 exercícios principais e acompanhe:</p>
      <ul>
        <li>Carga utilizada</li>
        <li>Número de repetições</li>
        <li>Evolução semanal</li>
      </ul>
      <p class="diag__rec-foot">Se você treina 6 ou 7 vezes por semana, considere reduzir a
      frequência e aumentar a qualidade do estímulo.</p>
    `,
  },
};

// Returns the chosen diagnosis key + the computed scores.
// Priority order (1 = highest): constância > estímulo > evolução.
// If more than one reaches its minimum score, the highest priority wins.
// If none reaches the minimum, falls back to the highest score (ties → priority).
function computeDiagnosis(v) {
  const inAny = (key, ...vals) => vals.includes(v(key));

  let s1 = 0; // Baixa constância
  if (v("interrupcoes") === "2 vezes") s1 += 3;
  if (v("interrupcoes") === "3 vezes ou mais") s1 += 4;
  if (inAny("dificuldade", "Falta de tempo", "Trabalho", "Filhos/família")) s1 += 2;
  if (v("dificuldade") === "Falta de motivação") s1 += 1;
  if (v("estruturado") === "Não tenho planejamento") s1 += 2;

  let s2 = 0; // Estímulo insuficiente para hipertrofia
  if (v("objetivo") === "Ganhar massa muscular (hipertrofia)") s2 += 2;
  if (v("dias") === "3 dias") s2 += 3;
  if (v("dias") === "4 dias") s2 += 1;
  if (v("satisfacao") === "Insatisfeita") s2 += 2;
  if (inAny("estagnacao", "Entre 3 e 6 meses", "Mais de 6 meses")) s2 += 2;
  if (v("registro") === "Nunca") s2 += 1;
  if (inAny("aerobico", "Nenhum", "Menos de 60 minutos", "Entre 60 e 120 minutos")) s2 += 1;

  let s3 = 0; // Treina, mas não evolui
  if (v("dias") === "5 dias") s3 += 1;
  if (inAny("dias", "6 dias", "7 dias")) s3 += 3;
  if (inAny("tempo", "1 a 2 anos", "Mais de 2 anos")) s3 += 2;
  if (inAny("estagnacao", "Entre 3 e 6 meses", "Mais de 6 meses")) s3 += 2;
  if (v("registro") === "Às vezes") s3 += 1;
  if (v("registro") === "Nunca") s3 += 2;
  if (v("progressao") === "Raramente") s3 += 2;
  if (v("progressao") === "Nunca") s3 += 3;
  if (v("estruturado") === "Uso treinos prontos da internet") s3 += 1;
  if (v("estruturado") === "Não tenho planejamento") s3 += 2;
  if (v("satisfacao") === "Insatisfeita") s3 += 2;

  const candidates = [
    { key: "constancia", score: s1, min: 5, prio: 1 },
    { key: "estimulo", score: s2, min: 7, prio: 2 },
    { key: "evolucao", score: s3, min: 8, prio: 3 },
  ];

  const qualified = candidates
    .filter((c) => c.score >= c.min)
    .sort((a, b) => a.prio - b.prio);

  const chosen = qualified.length
    ? qualified[0]
    : candidates.slice().sort((a, b) => b.score - a.score || a.prio - b.prio)[0];

  return { key: chosen.key, scores: { s1, s2, s3 } };
}

/* ============================================================
   Navegação / etapas
   ============================================================ */
function showStep(i) {
  steps.forEach((s, idx) => s.classList.toggle("is-active", idx === i));
  steps[i].querySelector(".step-count").textContent =
    `Etapa ${i + 1} de ${steps.length}`;

  btnPrev.style.visibility = i === 0 ? "hidden" : "visible";
  const isLast = i === steps.length - 1;
  btnNext.style.display = isLast ? "none" : "inline-flex";
  btnSubmit.style.display = isLast ? "inline-flex" : "none";

  progressBar.style.width = `${((i + 1) / steps.length) * 100}%`;
  // Focus first field for keyboard users
  const firstInput = steps[i].querySelector("input, textarea, select");
  if (firstInput) firstInput.focus({ preventScroll: true });
}

/* ---------- Email ---------- */
function isValidEmail(value) {
  // Pragmatic check: something@something.tld
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);
}

/* ---------- Validation ---------- */
function clearErrors(step) {
  step.querySelectorAll(".has-error").forEach((f) => f.classList.remove("has-error"));
}

function validateStep(step) {
  clearErrors(step);
  let valid = true;
  let firstInvalid = null;

  // Required text/number/email/textarea/select inputs (skip disabled — e.g. hidden location fields)
  step.querySelectorAll("input[required], textarea[required], select[required]").forEach((el) => {
    if (el.disabled) return;
    const empty = el.type === "checkbox" ? !el.checked : !el.value.trim();
    if (empty) {
      el.closest(".field").classList.add("has-error");
      valid = false;
      firstInvalid = firstInvalid || el;
    }
  });

  // Email format
  const email = step.querySelector('input[type="email"]');
  if (email && email.value.trim() && !isValidEmail(email.value.trim())) {
    const field = email.closest(".field");
    if (!field.classList.contains("has-error")) field.classList.add("has-error");
    valid = false;
    firstInvalid = firstInvalid || email;
  }

  // Required radio/checkbox groups
  step.querySelectorAll(".options[data-required]").forEach((group) => {
    const checked = group.querySelector("input:checked");
    if (!checked) {
      group.closest(".field").classList.add("has-error");
      valid = false;
      firstInvalid = firstInvalid || group;
    }
  });

  if (firstInvalid) firstInvalid.scrollIntoView({ behavior: "smooth", block: "center" });
  return valid;
}

btnNext.addEventListener("click", () => {
  if (!validateStep(steps[current])) return;
  if (current < steps.length - 1) {
    current++;
    showStep(current);
  }
});

btnPrev.addEventListener("click", () => {
  if (current > 0) {
    current--;
    showStep(current);
  }
});

// Enter key advances (except inside textareas)
form.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && e.target.tagName !== "TEXTAREA") {
    e.preventDefault();
    if (current < steps.length - 1) btnNext.click();
    else btnSubmit.click();
  }
});

/* ============================================================
   Coleta de dados (para log e e-mail)
   ============================================================ */
// Lê o valor de um campo; Estado/Cidade vêm do controle ativo conforme o país.
function readValue(k) {
  const data = new FormData(form);
  const isBrasil = paisSelect.value === "Brasil";
  if (k === "estado") return isBrasil ? estadoSelect.value : "";
  if (k === "cidade") return isBrasil ? cidadeSelect.value : cidadeExInput.value.trim();
  return (data.get(k) || "").toString().trim();
}

function collectData(diagKey, scores) {
  const pessoa = {};
  for (const key of Object.keys(CONTACT_LABELS)) pessoa[CONTACT_LABELS[key]] = readValue(key) || "—";
  const respostas = {};
  for (const key of Object.keys(QUESTION_LABELS)) respostas[QUESTION_LABELS[key]] = readValue(key) || "—";
  return { diagnostico: DIAGNOSES[diagKey].title, scores, pessoa, respostas };
}

/* ---------- Rastreabilidade no console ---------- */
function logLead(payload) {
  console.groupCollapsed("%c[Carraro] Diagnóstico concluído", "color:#9B1B30;font-weight:bold");
  console.log("Diagnóstico:", payload.diagnostico);
  console.log("Scores (constância / estímulo / evolução):", payload.scores);
  console.log("Dados pessoais:");
  console.table(payload.pessoa);
  console.log("Respostas do diagnóstico:");
  console.table(payload.respostas);
  console.groupEnd();
}

/* ---------- Envio de e-mail (Renan + closer) via EmailJS ----------
   Os destinatários (To = closer, Cc = Renan) são FIXOS no template do EmailJS,
   não passam pelo cliente. Aqui só vão os dados do lead. */
const EMAILJS_PUBLIC_KEY = "scWfk5MKjN7Td35Rw";
const EMAILJS_SERVICE_ID = "service_sadmvso";
const EMAILJS_TEMPLATE_ID = "template_g2v75xm";

const EMAIL_MAX_RETRIES = 3;       // tentativas por envio
const PENDING_KEY = "carraro_pending_leads"; // fila local p/ leads que falharam

if (window.emailjs) emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });

// Monta os parâmetros do template a partir do payload coletado
function emailParams(payload) {
  const conteudo = [
    `Diagnóstico: ${payload.diagnostico}`,
    "",
    "— Dados pessoais —",
    ...Object.entries(payload.pessoa).map(([k, v]) => `${k}: ${v}`),
    "",
    "— Respostas do diagnóstico —",
    ...Object.entries(payload.respostas).map(([k, v]) => `${k}: ${v}`),
  ].join("\n");
  return {
    nome: payload.pessoa["Nome"],
    idade: payload.pessoa["Idade"],
    email: payload.pessoa["E-mail"],
    whatsapp: payload.pessoa["WhatsApp"],
    instagram: payload.pessoa["Instagram"],
    pais: payload.pessoa["País"],
    estado: payload.pessoa["Estado"],
    cidade: payload.pessoa["Cidade"],
    diagnostico: payload.diagnostico,
    conteudo,
  };
}

// Envia com retry/backoff. Resolve true (enviado) ou false (falhou após N tentativas).
function trySend(params, attempt = 1) {
  return emailjs
    .send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, params)
    .then(() => {
      console.info("[Carraro] E-mail do lead enviado ✓");
      return true;
    })
    .catch((err) => {
      console.error(`[Carraro] Falha no e-mail (tentativa ${attempt}/${EMAIL_MAX_RETRIES}):`, err);
      if (attempt < EMAIL_MAX_RETRIES) {
        return new Promise((r) => setTimeout(r, attempt * 1500)).then(() => trySend(params, attempt + 1));
      }
      return false;
    });
}

/* ---------- Fila local de segurança (reenvio em visita futura) ---------- */
function readPending() {
  try { return JSON.parse(localStorage.getItem(PENDING_KEY) || "[]"); } catch (e) { return []; }
}
function writePending(list) {
  try { localStorage.setItem(PENDING_KEY, JSON.stringify(list)); } catch (e) {}
}
function queuePending(params) {
  const list = readPending();
  list.push({ params, ts: Date.now() });
  writePending(list);
  console.warn("[Carraro] Lead salvo localmente — será reenviado numa próxima visita.");
}
// Tenta reenviar leads que ficaram pendentes em sessões anteriores
function flushPending() {
  if (!window.emailjs) return;
  const list = readPending();
  if (!list.length) return;
  console.info(`[Carraro] Reenviando ${list.length} lead(s) pendente(s)...`);
  (async () => {
    const remaining = [];
    for (const item of list) {
      const ok = await trySend(item.params);
      if (!ok) remaining.push(item);
    }
    writePending(remaining);
    if (!remaining.length) console.info("[Carraro] Pendências reenviadas ✓");
  })();
}

function sendLeadEmail(payload) {
  const params = emailParams(payload);
  if (!window.emailjs) {
    console.warn("[Carraro] EmailJS não carregou — lead salvo localmente.");
    queuePending(params);
    return;
  }
  trySend(params).then((ok) => { if (!ok) queuePending(params); });
}

/* ---------- Mensagem do WhatsApp (curta — a lead quer falar com a equipe) ---------- */
function buildWaMessage() {
  const nome = readValue("nome");
  const saudacao = nome ? `Oi, meu nome é ${nome}! ` : "Oi! ";
  return (
    saudacao +
    "Acabei de fazer o diagnóstico no site e quero conhecer mais sobre os planos de consultoria e acompanhamento com o Renan."
  );
}

/* ============================================================
   Resultado / diagnóstico
   ============================================================ */
function renderResult(diagKey) {
  const d = DIAGNOSES[diagKey];
  document.getElementById("diagTitle").textContent = d.title;
  document.getElementById("diagProfile").textContent = d.profile;

  const cards = d.photos
    .map(
      (src) => `
        <figure class="diag__photo diag__card">
          <img src="${src}" alt="Aluna do Renan Carraro"
               onerror="this.style.display='none';this.nextElementSibling.style.display='flex';" />
          <figcaption class="diag__photo-fallback">Foto da aluna</figcaption>
        </figure>`
    )
    .join("");
  const hint = d.photos.length > 1 ? `<p class="diag__deck-hint">Toque para ver mais ↻</p>` : "";

  document.getElementById("diagRec").innerHTML = `
    <div class="diag__rec-grid">
      <div class="diag__rec-body">${d.rec}</div>
      <aside class="diag__rec-aside">
        <div class="diag__deck" data-count="${d.photos.length}">${cards}</div>
        ${hint}
      </aside>
    </div>`;

  setupDeck(document.querySelector("#diagRec .diag__deck"));
}

/* ---------- Baralho de fotos (clique = jogar a foto pra baixo do baralho) ---------- */
function setupDeck(deckEl) {
  if (!deckEl) return;
  const order = Array.from(deckEl.querySelectorAll(".diag__card")); // [topo ... fundo]

  const place = (card, depth, animate) => {
    card.style.transition = animate ? "" : "none";
    card.style.zIndex = String(100 - depth);
    card.style.opacity = String(Math.max(0, 1 - depth * 0.14));
    card.style.transform =
      `translate(${depth * 7}px, ${depth * 11}px) scale(${1 - depth * 0.05}) rotate(${depth * 1.6}deg)`;
    card.style.pointerEvents = depth === 0 ? "auto" : "none";
    card.style.cursor = depth === 0 ? "pointer" : "default";
  };

  const layout = (animate = true) => order.forEach((c, depth) => place(c, depth, animate));

  layout(false);
  if (order.length <= 1) return; // 1 foto: sem baralho/clique

  const THROW_MS = 400;
  let busy = false;
  const throwTop = () => {
    if (busy) return;
    busy = true;
    const top = order[0];
    top.style.transition = `transform ${THROW_MS}ms cubic-bezier(.4,0,.2,1), opacity ${THROW_MS}ms ease`;
    top.style.transform = "translate(0, 130%) scale(.9) rotate(-5deg)";
    top.style.opacity = "0";
    // Conclui por tempo (não depende de transitionend, que não dispara sem animação)
    setTimeout(() => {
      order.push(order.shift());            // topo vai pro fundo
      place(top, order.length - 1, false);  // reposiciona no fundo, ainda invisível
      void top.offsetWidth;                 // reflow
      layout(true);                         // anima todos pra cima; a foto reaparece no fundo
      setTimeout(() => { busy = false; }, THROW_MS + 40);
    }, THROW_MS);
  };
  deckEl.addEventListener("click", throwTop);
}

/* ============================================================
   Submit → calcula diagnóstico, registra, envia e-mail, mostra resultado
   ============================================================ */
form.addEventListener("submit", (e) => {
  e.preventDefault();
  if (!validateStep(steps[current])) return;

  const data = new FormData(form);
  const v = (k) => (data.get(k) || "").toString().trim();
  const { key, scores } = computeDiagnosis(v);

  const payload = collectData(key, scores);
  logLead(payload);        // rastreabilidade no console
  sendLeadEmail(payload);  // e-mail pro Renan + closer (pendente de config)

  renderResult(key);

  // WhatsApp leva apenas uma mensagem curta de interesse (sem as respostas)
  waLink.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(buildWaMessage())}`;

  // Mostra a tela de resultado
  steps.forEach((s) => s.classList.remove("is-active"));
  formNav.style.display = "none";
  progressBar.style.width = "100%";
  doneScreen.classList.add("is-active");
  doneScreen.scrollIntoView({ behavior: "smooth", block: "start" });
});

/* ============================================================
   País / Estado / Cidade
   ============================================================ */
const paisSelect = document.getElementById("pais");
const estadoSelect = document.getElementById("estado");
const cidadeSelect = document.getElementById("cidade");
const cidadeExInput = document.getElementById("cidadeEx");
const fieldEstado = document.getElementById("fieldEstado");
const fieldCidadeBr = document.getElementById("fieldCidadeBr");
const fieldCidadeEx = document.getElementById("fieldCidadeEx");

let cidadesPorEstado = null;

// Populate country dropdown
fetch("assets/data/paises.json")
  .then((r) => r.json())
  .then((paises) => {
    const frag = document.createDocumentFragment();
    paises.forEach((nome) => {
      const opt = document.createElement("option");
      opt.value = nome;
      opt.textContent = nome;
      frag.appendChild(opt);
    });
    paisSelect.appendChild(frag);
  })
  .catch(() => {
    // Fallback so the form still works if the list fails to load
    paisSelect.insertAdjacentHTML("beforeend", '<option value="Brasil">Brasil</option><option value="Outro">Outro</option>');
  });

// Lazy-load Brazilian states + cities the first time Brazil is selected
let brDataLoaded = false;
function loadBrData() {
  if (brDataLoaded) return;
  brDataLoaded = true;
  Promise.all([
    fetch("assets/data/estados.json").then((r) => r.json()),
    fetch("assets/data/cidades-por-estado.json").then((r) => r.json()),
  ])
    .then(([estados, cidades]) => {
      cidadesPorEstado = cidades;
      const frag = document.createDocumentFragment();
      estados.forEach((e) => {
        const opt = document.createElement("option");
        opt.value = e.uf;
        opt.textContent = `${e.nome} (${e.uf})`;
        frag.appendChild(opt);
      });
      estadoSelect.appendChild(frag);
    })
    .catch(() => { brDataLoaded = false; });
}

// Fill the city dropdown with the cities of the selected state
function populateCidades(uf) {
  cidadeSelect.innerHTML = '<option value="" selected disabled>Selecione…</option>';
  const lista = (cidadesPorEstado && cidadesPorEstado[uf]) || [];
  const frag = document.createDocumentFragment();
  lista.forEach((nome) => {
    const opt = document.createElement("option");
    opt.value = nome;
    opt.textContent = nome;
    frag.appendChild(opt);
  });
  cidadeSelect.appendChild(frag);
  cidadeSelect.disabled = lista.length === 0;
}

estadoSelect.addEventListener("change", () => populateCidades(estadoSelect.value));

// Show Brazilian state/city dropdowns vs. free-text city for other countries.
// Disabled controls are skipped by validation and excluded from submission.
function updateLocationMode() {
  const isBrasil = paisSelect.value === "Brasil";
  fieldEstado.style.display = isBrasil ? "" : "none";
  fieldCidadeBr.style.display = isBrasil ? "" : "none";
  fieldCidadeEx.style.display = isBrasil ? "none" : "";

  if (isBrasil) {
    loadBrData();
    estadoSelect.disabled = false;
    cidadeSelect.disabled = !estadoSelect.value; // enabled once a state is chosen
    cidadeExInput.disabled = true;
  } else {
    estadoSelect.disabled = true;
    cidadeSelect.disabled = true;
    cidadeExInput.disabled = false;
  }
}
paisSelect.addEventListener("change", updateLocationMode);

// Rastreabilidade: loga cada escolha de resposta no console
form.querySelectorAll('input[type="radio"]').forEach((r) => {
  r.addEventListener("change", () => {
    if (r.checked) console.debug(`[Carraro] ${r.name} = "${r.value}"`);
  });
});

// Init
updateLocationMode();
showStep(0);
flushPending(); // reenvia leads que ficaram pendentes em visitas anteriores
