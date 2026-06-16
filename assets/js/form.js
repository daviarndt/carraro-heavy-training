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

  // Required text/number/email/textarea/select inputs
  step.querySelectorAll("input[required], textarea[required], select[required]").forEach((el) => {
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

  let lines = ["*Nova avaliação — Carraro Heavy Training*", ""];
  for (const key of Object.keys(LABELS)) {
    let val = get(key);
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

/* ---------- País / Cidade ---------- */
const paisSelect = document.getElementById("pais");
const cidadeInput = document.getElementById("cidade");
const cidadesDatalist = document.getElementById("cidades-br");

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
    // Fallback: at least let people type if the list fails to load
    paisSelect.insertAdjacentHTML("beforeend", '<option value="Brasil">Brasil</option><option value="Outro">Outro</option>');
  });

// Lazy-load Brazilian cities the first time Brazil is selected
let cidadesLoaded = false;
function loadCidadesBr() {
  if (cidadesLoaded) return;
  cidadesLoaded = true;
  fetch("assets/data/cidades-brasil.json")
    .then((r) => r.json())
    .then((cidades) => {
      const frag = document.createDocumentFragment();
      cidades.forEach((nome) => {
        const opt = document.createElement("option");
        opt.value = nome;
        frag.appendChild(opt);
      });
      cidadesDatalist.appendChild(frag);
    })
    .catch(() => { cidadesLoaded = false; });
}

// Switch the city field behaviour based on the chosen country
function updateCidadeMode() {
  const isBrasil = paisSelect.value === "Brasil";
  if (isBrasil) {
    loadCidadesBr();
    cidadeInput.setAttribute("list", "cidades-br");
    cidadeInput.placeholder = "Comece a digitar sua cidade…";
  } else {
    cidadeInput.removeAttribute("list");
    cidadeInput.placeholder = "Digite sua cidade";
  }
}
paisSelect.addEventListener("change", updateCidadeMode);

// Init
updateCidadeMode();
showStep(0);
