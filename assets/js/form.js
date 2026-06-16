/* ============================================================
   CARRARO — Avaliação (multi-step form → WhatsApp)
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

// Friendly labels for the WhatsApp message
const LABELS = {
  nome: "Nome",
  idade: "Idade",
  email: "E-mail",
  whatsapp: "WhatsApp",
  pais: "País",
  estado: "Estado",
  cidade: "Cidade",
  objetivo: "Objetivo",
  modalidade: "Modalidade",
  experiencia: "Experiência",
  frequencia: "Frequência",
  lesoes: "Lesões / limitações",
  condicoes: "Condições de saúde / medicamentos",
  rotina: "Rotina",
  meta: "Resultado desejado",
};

function showStep(i) {
  steps.forEach((s, idx) => s.classList.toggle("is-active", idx === i));
  steps[i].querySelector(".step-count").textContent =
    `Pergunta ${i + 1} de ${steps.length}`;

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

/* ---------- Navigation ---------- */
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

/* ---------- Build WhatsApp message ---------- */
function buildMessage() {
  const data = new FormData(form);
  const get = (k) => (data.get(k) || "").toString().trim();

  // Estado/Cidade come from whichever control is active for the chosen country
  const isBrasil = paisSelect.value === "Brasil";
  const overrides = {
    estado: isBrasil ? estadoSelect.value : "",
    cidade: isBrasil ? cidadeSelect.value : cidadeExInput.value.trim(),
  };

  let lines = ["*Nova avaliação — Carraro Heavy Training*", ""];
  for (const key of Object.keys(LABELS)) {
    let val = key in overrides ? overrides[key] : get(key);
    if (!val) val = "—";
    lines.push(`*${LABELS[key]}:* ${val}`);
  }
  return lines.join("\n");
}

function buildWaUrl() {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(buildMessage())}`;
}

/* ---------- Submit ---------- */
form.addEventListener("submit", (e) => {
  e.preventDefault();
  if (!validateStep(steps[current])) return;

  const url = buildWaUrl();
  waLink.href = url;

  // Show success screen
  steps.forEach((s) => s.classList.remove("is-active"));
  formNav.style.display = "none";
  progressBar.style.width = "100%";
  doneScreen.classList.add("is-active");
  doneScreen.scrollIntoView({ behavior: "smooth", block: "center" });

  // Try to open WhatsApp automatically (button is the reliable fallback)
  window.open(url, "_blank", "noopener");
});

/* ---------- País / Estado / Cidade ---------- */
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
