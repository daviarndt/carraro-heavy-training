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
  whatsapp: "WhatsApp",
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

/* ---------- Validation ---------- */
function clearErrors(step) {
  step.querySelectorAll(".has-error").forEach((f) => f.classList.remove("has-error"));
}

function validateStep(step) {
  clearErrors(step);
  let valid = true;
  let firstInvalid = null;

  // Required text/number/textarea inputs
  step.querySelectorAll("input[required], textarea[required]").forEach((el) => {
    if (!el.value.trim()) {
      el.closest(".field").classList.add("has-error");
      valid = false;
      firstInvalid = firstInvalid || el;
    }
  });

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

// Init
showStep(0);
