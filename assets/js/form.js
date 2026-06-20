/* ============================================================
   CARRARO — Diagnóstico Inteligente (multi-step → score → WhatsApp)
   ============================================================ */

// Renan's WhatsApp number (international format, digits only — no +, spaces or dashes).
// Test number for now; swap for Renan's before going live.
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
  if (v("objetivo") === "Ganhar massa muscular") s2 += 2;
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
    if (!el.value.trim()) {
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
   Mensagem do WhatsApp (diagnóstico + contato + respostas)
   ============================================================ */
function buildMessage(diagKey) {
  const data = new FormData(form);
  const get = (k) => (data.get(k) || "").toString().trim();

  // Estado/Cidade come from whichever control is active for the chosen country
  const isBrasil = paisSelect.value === "Brasil";
  const overrides = {
    estado: isBrasil ? estadoSelect.value : "",
    cidade: isBrasil ? cidadeSelect.value : cidadeExInput.value.trim(),
  };
  const val = (k) => (k in overrides ? overrides[k] : get(k)) || "—";

  const lines = [
    "*Novo diagnóstico — Carraro Heavy Training*",
    "",
    `*🩺 Diagnóstico:* ${DIAGNOSES[diagKey].title}`,
    "",
    "*— Contato —*",
  ];
  for (const key of Object.keys(CONTACT_LABELS)) {
    lines.push(`*${CONTACT_LABELS[key]}:* ${val(key)}`);
  }
  lines.push("", "*— Respostas —*");
  for (const key of Object.keys(QUESTION_LABELS)) {
    lines.push(`*${QUESTION_LABELS[key]}:* ${val(key)}`);
  }
  return lines.join("\n");
}

/* ============================================================
   Submit → calcula diagnóstico, renderiza resultado e monta WhatsApp
   ============================================================ */
function renderResult(diagKey) {
  const d = DIAGNOSES[diagKey];
  document.getElementById("diagTitle").textContent = d.title;
  document.getElementById("diagProfile").textContent = d.profile;
  document.getElementById("diagRec").innerHTML = d.rec;
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  if (!validateStep(steps[current])) return;

  const data = new FormData(form);
  const v = (k) => (data.get(k) || "").toString().trim();
  const { key } = computeDiagnosis(v);

  renderResult(key);

  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(buildMessage(key))}`;
  waLink.href = url;

  // Show result screen
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

// Init
updateLocationMode();
showStep(0);
