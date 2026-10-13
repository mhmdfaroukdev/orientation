const CONFIG = {
  appsScriptUrl: "https://script.google.com/macros/s/AKfycbyGoQdR5xgepqns7HpyWoHjfJr4cDEMWaBFHoSzUo3uAFgjrrGZvWUKW2TvPLjIWCdy/exec",
  eventDate: "To be announced",
  eventLocation: "AOU Egypt"
};

const form = document.getElementById("registrationForm");
const submitButton = form.querySelector("button[type='submit']");
const submitLabel = submitButton.querySelector(".submit-label");
const message = document.getElementById("formMessage");
const eventDate = document.getElementById("eventDate");
const eventLocation = document.getElementById("eventLocation");
const themeToggle = document.getElementById("themeToggle");
const themeLabel = themeToggle?.querySelector(".theme-label");
const themeIcon = themeToggle?.querySelector(".theme-icon");
const systemTheme = window.matchMedia("(prefers-color-scheme: dark)");

let submitTimer;

function resolveTheme(preference) {
  return preference === "system" ? (systemTheme.matches ? "dark" : "light") : preference;
}

function applyTheme(preference) {
  const safePreference = ["system", "light", "dark"].includes(preference) ? preference : "system";
  const resolved = resolveTheme(safePreference);

  document.documentElement.dataset.themePreference = safePreference;
  document.documentElement.dataset.theme = resolved;

  try { localStorage.setItem("cbc-theme", safePreference); } catch (_) {}

  if (themeLabel) themeLabel.textContent = safePreference[0].toUpperCase() + safePreference.slice(1);
  if (themeIcon) themeIcon.textContent = safePreference === "system" ? "◐" : safePreference === "dark" ? "☾" : "☀";
  if (themeToggle) {
    themeToggle.title = `Theme: ${safePreference[0].toUpperCase() + safePreference.slice(1)}`;
    themeToggle.setAttribute("aria-label", `Change color theme. Current: ${safePreference}`);
  }
}

function cycleTheme() {
  const current = document.documentElement.dataset.themePreference || "system";
  const order = ["system", "light", "dark"];
  const next = order[(order.indexOf(current) + 1) % order.length];
  applyTheme(next);
}

applyTheme(document.documentElement.dataset.themePreference || "system");
themeToggle?.addEventListener("click", cycleTheme);
systemTheme.addEventListener?.("change", () => {
  if ((document.documentElement.dataset.themePreference || "system") === "system") applyTheme("system");
});

document.getElementById("year").textContent = new Date().getFullYear();
eventDate.textContent = CONFIG.eventDate;
eventLocation.textContent = CONFIG.eventLocation;

const isConfigured = () =>
  CONFIG.appsScriptUrl.startsWith("https://script.google.com/macros/s/") &&
  CONFIG.appsScriptUrl.endsWith("/exec");

function setMessage(text, type = "") {
  message.textContent = text;
  message.className = `form-message ${type}`.trim();
}

function setSubmitting(submitting) {
  submitButton.disabled = submitting;
  submitLabel.textContent = submitting ? "Registering…" : "Complete registration";
}

function validateField(field) {
  const valid = field.checkValidity();
  field.setAttribute("aria-invalid", valid ? "false" : "true");
  return valid;
}

form.querySelectorAll("input, select").forEach((field) => {
  field.addEventListener("input", () => validateField(field));
  field.addEventListener("change", () => validateField(field));
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  setMessage("");

  const fields = [...form.querySelectorAll("input, select")];
  const allValid = fields.every(validateField);

  if (!allValid || !form.checkValidity()) {
    setMessage("Please complete all required fields before submitting.", "error");
    form.querySelector(":invalid")?.focus();
    return;
  }

  if (!isConfigured()) {
    setMessage("Registration backend is not connected yet. Please contact the club team.", "error");
    return;
  }

  form.action = CONFIG.appsScriptUrl;
  setSubmitting(true);
  setMessage("Sending your registration…");

  HTMLFormElement.prototype.submit.call(form);

  clearTimeout(submitTimer);
  submitTimer = setTimeout(() => {
    setSubmitting(false);
    setMessage(
      "Your registration was sent. If you do not receive a confirmation email shortly, contact the club team.",
      "success"
    );
  }, 15000);
});

window.addEventListener("message", (event) => {
  const data = event.data;
  if (!data || data.source !== "cbc-orientation") return;

  clearTimeout(submitTimer);
  setSubmitting(false);

  if (data.ok) {
    setMessage(
      data.registrationId
        ? `Registered successfully. Your ID is ${data.registrationId}. Check your email for confirmation.`
        : "Registered successfully. Check your email for confirmation.",
      "success"
    );
    form.reset();
    form.querySelectorAll("[aria-invalid]").forEach((el) => el.removeAttribute("aria-invalid"));
  } else {
    setMessage(data.message || "We could not complete your registration. Please try again.", "error");
  }
});
