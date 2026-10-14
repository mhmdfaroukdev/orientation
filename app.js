const CONFIG = {
  appsScriptUrl: "https://script.google.com/macros/s/AKfycbyGoQdR5xgepqns7HpyWoHjfJr4cDEMWaBFHoSzUo3uAFgjrrGZvWUKW2TvPLjIWCdy/exec",
  eventDate: "To be announced",
  eventTime: "To be announced",
  eventLocation: "AOU Egypt"
};

const ACADEMICS = {
  "Faculty of Business Studies": [
    "Business Studies — Accounting",
    "Business Studies — Finance with Microfinance",
    "Business Studies — Human Resource Management",
    "Business Studies — Management Information Systems",
    "Business Studies — Management",
    "Business Studies — Marketing"
  ],
  "Faculty of Computer Studies": [
    "Information Technology & Computing — Artificial Intelligence",
    "Information Technology & Computing — Computer Science",
    "Information Technology & Computing — Cybersecurity",
    "Information Technology & Computing — Data Science",
    "Information Technology & Computing — Web Development"
  ],
  "Faculty of Language Studies": [
    "English Language & Literature",
    "English Language, Literature & Translation"
  ],
  "Faculty of Education": [
    "Arts & Education — English Language",
    "Childhood & Education — Kindergarten",
    "Science & Education — Mathematics"
  ],
  "Faculty of Media & Mass Communication": [
    "Integrated Marketing Communication",
    "Mass Communication — Radio & TV",
    "News Journalism"
  ],
  "Graphic & Multimedia Design Technology": [
    "Graphic & Multimedia Design Technology"
  ]
};

const CLUB_TEAMS = [
  "Vice President",
  "Secretary & Coordination",
  "Finance & Treasury",
  "Technical Team",
  "Events & Operations",
  "Marketing & Media",
  "PR & Partnerships",
  "Community & Membership",
  "Projects & Hackathons",
  "HR / People & Culture",
  "General Member / Volunteer"
];

const THEME_KEY = "cbc-theme";
const STEP_LABELS = ["Your details", "University", "Confirm"];
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const themeMedia = window.matchMedia("(prefers-color-scheme: dark)");

const form = document.getElementById("registrationForm");
const message = document.getElementById("formMessage");
const modal = document.getElementById("modal");
const closeModalButton = document.getElementById("closeModal");
const closeSuccessButton = document.getElementById("closeSuccess");
const backBtn = document.getElementById("backBtn");
const nextBtn = document.getElementById("nextBtn");
const formPages = [...document.querySelectorAll("#registrationForm .form-page")];
const stepCounter = document.getElementById("stepCounter");
const stepLabel = document.getElementById("stepLabel");
const progress = document.getElementById("progress");
const facultySelect = document.getElementById("facultySelect");
const majorSelect = document.getElementById("majorSelect");
const facultyCombined = document.getElementById("facultyCombined");
const teamInterest = document.getElementById("teamInterest");
const successPanel = document.getElementById("registrationSuccess");
const successRegistrationId = document.getElementById("successRegistrationId");
const successLead = document.getElementById("successLead");
const registerAnother = document.getElementById("registerAnother");
const nav = document.querySelector(".nav");
const navContainer = document.querySelector(".nav-links");
const themeToggle = document.getElementById("themeToggle");
const themeLabel = themeToggle?.querySelector(".theme-label");
const themeIcon = themeToggle?.querySelector(".theme-icon");

let submitTimer;
let previousMenuFocus = null;
let previousModalFocus = null;
let activeSubmitToken = "";
let currentStep = 0;

function readThemePreference() {
  try { return localStorage.getItem(THEME_KEY) || "system"; }
  catch (_) { return "system"; }
}

function resolvedTheme(preference) {
  if (preference === "light" || preference === "dark") return preference;
  return themeMedia.matches ? "dark" : "light";
}

function applyTheme(preference) {
  const pref = ["system", "light", "dark"].includes(preference) ? preference : "system";
  const actual = resolvedTheme(pref);
  document.documentElement.dataset.themePreference = pref;
  document.documentElement.dataset.theme = actual;

  try { localStorage.setItem(THEME_KEY, pref); } catch (_) {}

  const text = pref === "system" ? "System" : pref === "dark" ? "Dark" : "Light";
  if (themeLabel) themeLabel.textContent = text;
  if (themeIcon) themeIcon.textContent = pref === "system" ? "◐" : actual === "dark" ? "☾" : "☀";
  if (themeToggle) {
    themeToggle.title = `Theme: ${text} · tap to change`;
    themeToggle.setAttribute("aria-label", `Theme: ${text}. Tap to change.`);
  }

  document.querySelectorAll("[data-mobile-theme]").forEach(el => { el.textContent = text; });
}

function cycleTheme() {
  const current = readThemePreference();
  const next = current === "system" ? "light" : current === "light" ? "dark" : "system";
  applyTheme(next);
}

applyTheme(readThemePreference());
themeToggle?.addEventListener("click", cycleTheme);
themeMedia.addEventListener?.("change", () => {
  if (readThemePreference() === "system") applyTheme("system");
});

function setEventDetails() {
  const date = document.getElementById("eventDate");
  const time = document.getElementById("eventTime");
  const location = document.getElementById("eventLocation");
  const year = document.getElementById("footerYear");

  if (date) date.textContent = CONFIG.eventDate;
  if (time) time.textContent = CONFIG.eventTime;
  if (location) location.textContent = CONFIG.eventLocation;
  if (year) year.textContent = String(new Date().getFullYear());
}
setEventDetails();

function fillMajors(faculty) {
  if (!majorSelect) return;
  const majors = ACADEMICS[faculty] || [];
  majorSelect.disabled = majors.length === 0;
  majorSelect.innerHTML = majors.length
    ? '<option value="">Select your programme / major</option>' + majors.map(name => `<option value="${name}">${name}</option>`).join("")
    : '<option value="">Choose a faculty first</option>';
  syncFacultyValue();
}

function fillAcademics() {
  if (!facultySelect) return;
  facultySelect.innerHTML = '<option value="">Select your faculty</option>' +
    Object.keys(ACADEMICS).map(name => `<option value="${name}">${name}</option>`).join("");
  fillMajors("");
}

function syncFacultyValue() {
  if (!facultyCombined) return;
  const faculty = facultySelect?.value || "";
  const major = majorSelect?.value || "";
  facultyCombined.value = [faculty, major].filter(Boolean).join(" · ");
}

function fillTeams() {
  if (!teamInterest) return;
  teamInterest.innerHTML = '<option value="">Not sure yet</option>' +
    CLUB_TEAMS.map(team => `<option value="${team}">${team}</option>`).join("");
}

facultySelect?.addEventListener("change", () => fillMajors(facultySelect.value));
majorSelect?.addEventListener("change", syncFacultyValue);
fillAcademics();
fillTeams();

function initNav() {
  if (!nav) return;

  const syncScrolled = () => nav.classList.toggle("scrolled", window.scrollY > 10);
  syncScrolled();
  window.addEventListener("scroll", syncScrolled, { passive: true });

  const anchors = [...document.querySelectorAll('.nav-links a[href^="#"]')];
  const targets = anchors.map(anchor => ({
    anchor,
    section: document.querySelector(anchor.getAttribute("href"))
  })).filter(item => item.section);

  if (!("IntersectionObserver" in window)) return;

  const observer = new IntersectionObserver(entries => {
    const active = entries
      .filter(entry => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

    if (!active) return;
    targets.forEach(({ anchor, section }) => {
      anchor.classList.toggle("is-active", section === active.target);
    });
  }, { rootMargin: "-28% 0px -58% 0px", threshold: [0, .15, .35] });

  targets.forEach(({ section }) => observer.observe(section));
}

function initMobileMenu() {
  if (!navContainer || document.querySelector(".mobile-menu-toggle")) return;

  const toggle = document.createElement("button");
  toggle.type = "button";
  toggle.className = "mobile-menu-toggle";
  toggle.setAttribute("aria-label", "Open navigation menu");
  toggle.setAttribute("aria-expanded", "false");
  toggle.setAttribute("aria-controls", "mobileMenu");
  toggle.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 6h16"/><path d="M4 12h16"/><path d="M4 18h16"/></svg>';
  navContainer.insertBefore(toggle, navContainer.querySelector(".nav-apply") || null);

  const shell = document.createElement("div");
  shell.className = "mobile-menu-shell";
  shell.id = "mobileMenu";
  shell.setAttribute("aria-hidden", "true");
  shell.innerHTML = `
    <button class="mobile-menu-backdrop" type="button" aria-label="Close navigation menu"></button>
    <aside class="mobile-menu-panel" role="dialog" aria-modal="true" aria-label="Mobile navigation">
      <div class="mobile-menu-head">
        <div class="mobile-menu-brand"><span class="mobile-menu-mark" aria-hidden="true"></span><span><strong>Claude Builder Club</strong><small>AOU Egypt · Orientation</small></span></div>
        <button class="mobile-menu-close" type="button" aria-label="Close navigation menu">×</button>
      </div>
      <div class="mobile-menu-status live">Registration open</div>
      <nav class="mobile-menu-nav" aria-label="Mobile navigation links">
        <a href="#agenda">Agenda</a>
        <a href="#process">Process</a>
        <a href="#faq">FAQ</a>
        <a href="#community">Community</a>
        <a href="https://claudeaou.github.io/" target="_blank" rel="noopener noreferrer">Main club site ↗</a>
      </nav>
      <div class="mobile-menu-divider" aria-hidden="true"></div>
      <button class="mobile-menu-theme" type="button"><span>Appearance</span><span data-mobile-theme>System</span></button>
      <div class="mobile-menu-actions"><button class="mobile-menu-apply" type="button">Register now</button></div>
    </aside>`;
  document.body.appendChild(shell);

  const panel = shell.querySelector(".mobile-menu-panel");
  const closeBtn = shell.querySelector(".mobile-menu-close");
  const backdrop = shell.querySelector(".mobile-menu-backdrop");
  const themeButton = shell.querySelector(".mobile-menu-theme");
  const registerButton = shell.querySelector(".mobile-menu-apply");
  const viewport = window.matchMedia("(max-width: 760px)");

  const focusables = () => [...panel.querySelectorAll('a[href],button:not([disabled])')].filter(el => el.offsetParent !== null);

  const open = () => {
    if (!viewport.matches) return;
    previousMenuFocus = document.activeElement;
    shell.classList.add("is-open");
    shell.setAttribute("aria-hidden", "false");
    toggle.setAttribute("aria-expanded", "true");
    toggle.setAttribute("aria-label", "Close navigation menu");
    document.body.classList.add("mobile-menu-open");
    setTimeout(() => closeBtn?.focus({ preventScroll: true }), reducedMotion ? 0 : 60);
  };

  const close = (restoreFocus = true) => {
    shell.classList.remove("is-open");
    shell.setAttribute("aria-hidden", "true");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Open navigation menu");
    document.body.classList.remove("mobile-menu-open");
    if (restoreFocus && previousMenuFocus instanceof HTMLElement) previousMenuFocus.focus?.({ preventScroll: true });
    previousMenuFocus = null;
  };

  toggle.addEventListener("click", () => shell.classList.contains("is-open") ? close() : open());
  closeBtn?.addEventListener("click", () => close());
  backdrop?.addEventListener("click", () => close());
  shell.querySelectorAll(".mobile-menu-nav a").forEach(link => link.addEventListener("click", () => close(false)));
  themeButton?.addEventListener("click", cycleTheme);
  registerButton?.addEventListener("click", () => {
    close(false);
    setTimeout(openModal, reducedMotion ? 0 : 60);
  });

  document.addEventListener("keydown", event => {
    if (!shell.classList.contains("is-open")) return;
    if (event.key === "Escape") {
      event.preventDefault();
      close();
      return;
    }
    if (event.key !== "Tab") return;
    const list = focusables();
    if (!list.length) return;
    const first = list[0];
    const last = list[list.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });

  viewport.addEventListener?.("change", event => { if (!event.matches) close(false); });
  applyTheme(readThemePreference());
}

function setMessage(text, type = "") {
  if (!message) return;
  message.textContent = text;
  message.className = `orientation-form-message ${type}`.trim();
}

function validateField(field) {
  if (!(field instanceof HTMLInputElement || field instanceof HTMLSelectElement || field instanceof HTMLTextAreaElement)) return true;
  const valid = field.checkValidity();
  if (field.type !== "hidden") field.setAttribute("aria-invalid", valid ? "false" : "true");
  return valid;
}

function showStep(index, { focus = false } = {}) {
  const total = formPages.length || 1;
  currentStep = Math.min(Math.max(Number(index) || 0, 0), total - 1);
  formPages.forEach((page, i) => page.classList.toggle("active", i === currentStep));

  if (stepCounter) stepCounter.textContent = `Step ${currentStep + 1} of ${total}`;
  if (stepLabel) stepLabel.textContent = STEP_LABELS[currentStep] || "";
  if (progress) progress.style.width = `${((currentStep + 1) / total) * 100}%`;
  if (backBtn) backBtn.hidden = currentStep === 0;
  if (nextBtn) {
    nextBtn.disabled = false;
    nextBtn.textContent = currentStep === total - 1 ? "Complete registration →" : "Continue →";
  }

  if (focus) {
    formPages[currentStep]?.querySelector("input:not([type='hidden']):not([name='website']), select")?.focus({ preventScroll: true });
  }
}

function openModal() {
  if (!modal) return;
  previousModalFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
  setTimeout(() => {
    if (successPanel && !successPanel.hidden) {
      closeSuccessButton?.focus({ preventScroll: true });
      return;
    }
    formPages[currentStep]?.querySelector("input:not([type='hidden']):not([name='website']), select")?.focus({ preventScroll: true });
  }, reducedMotion ? 0 : 80);
}

function closeModal() {
  if (!modal) return;
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
  if (previousModalFocus?.isConnected) previousModalFocus.focus?.({ preventScroll: true });
  previousModalFocus = null;
}

function modalFocusables() {
  if (!modal) return [];
  return [...modal.querySelectorAll("a[href], button, input, select, textarea")]
    .filter(el => !el.disabled && el.tabIndex >= 0 && el.offsetParent !== null);
}

document.querySelectorAll(".js-register").forEach(button => {
  button.addEventListener("click", () => openModal());
});
closeModalButton?.addEventListener("click", () => closeModal());
closeSuccessButton?.addEventListener("click", () => closeModal());
modal?.addEventListener("click", event => { if (event.target === modal) closeModal(); });

document.addEventListener("keydown", event => {
  if (!modal?.classList.contains("open")) return;
  if (event.key === "Escape") {
    event.preventDefault();
    closeModal();
    return;
  }
  if (event.key !== "Tab") return;
  const list = modalFocusables();
  if (!list.length) return;
  const first = list[0];
  const last = list[list.length - 1];
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
});

function stepFields(index) {
  return [...(formPages[index]?.querySelectorAll("input, select, textarea") || [])]
    .filter(field => field.name !== "website" && field.type !== "hidden" && !field.disabled);
}

function goToStepOfField(field) {
  const index = formPages.indexOf(field?.closest?.(".form-page"));
  if (index !== -1 && index !== currentStep) showStep(index);
}

nextBtn?.addEventListener("click", () => {
  const lastStep = currentStep === formPages.length - 1;
  if (lastStep) {
    submitRegistration();
    return;
  }

  const fields = stepFields(currentStep);
  fields.forEach(validateField);
  const firstInvalid = fields.find(field => !field.checkValidity());
  if (firstInvalid) {
    setMessage("Please complete all required fields before continuing.", "error");
    firstInvalid.focus();
    firstInvalid.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "center" });
    return;
  }

  setMessage("");
  syncFacultyValue();
  showStep(currentStep + 1, { focus: true });
});

backBtn?.addEventListener("click", () => {
  setMessage("");
  showStep(currentStep - 1);
});

initNav();
initMobileMenu();
showStep(0);

form?.querySelectorAll("input, select, textarea").forEach(field => {
  field.addEventListener("input", () => validateField(field));
  field.addEventListener("change", () => validateField(field));
});

const isConfigured = () =>
  CONFIG.appsScriptUrl.startsWith("https://script.google.com/macros/s/") && CONFIG.appsScriptUrl.endsWith("/exec");

function setSubmitting(submitting) {
  if (!nextBtn || !form) return;
  form.setAttribute("aria-busy", submitting ? "true" : "false");
  if (submitting) {
    nextBtn.disabled = true;
    nextBtn.textContent = "Registering…";
  } else {
    showStep(currentStep);
  }
}

form?.addEventListener("submit", event => {
  event.preventDefault();
  submitRegistration();
});

function submitRegistration() {
  if (!form) return;
  setMessage("");
  syncFacultyValue();

  const honeypot = form.elements.namedItem("website");
  if (honeypot && "value" in honeypot && String(honeypot.value || "").trim()) {
    setMessage("We could not complete this registration.", "error");
    return;
  }

  const fields = [...form.querySelectorAll("input, select, textarea")].filter(field => field.name !== "website");
  const validity = fields.map(validateField);
  const allValid = validity.every(Boolean);

  if (!facultyCombined?.value || !allValid || !form.checkValidity()) {
    setMessage("Please complete all required fields before submitting.", "error");
    const firstInvalid = form.querySelector(":invalid");
    goToStepOfField(firstInvalid);
    setTimeout(() => {
      firstInvalid?.focus({ preventScroll: true });
      firstInvalid?.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "center" });
    }, 0);
    return;
  }

  if (!isConfigured()) {
    setMessage("Registration backend is not connected yet. Please contact the club team.", "error");
    return;
  }

  const token = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
  const tokenField = form.elements.namedItem("clientToken");
  if (tokenField && "value" in tokenField) tokenField.value = token;
  activeSubmitToken = token;

  form.action = CONFIG.appsScriptUrl;
  setSubmitting(true);
  setMessage("Sending your registration…");
  HTMLFormElement.prototype.submit.call(form);

  clearTimeout(submitTimer);
  submitTimer = setTimeout(() => {
    if (activeSubmitToken !== token) return;
    setSubmitting(false);
    setMessage("We sent the request but did not receive confirmation yet. Please wait a moment and check your email before trying again.", "warning");
  }, 20000);
}

function isTrustedAppsScriptOrigin(origin) {
  if (!origin) return false;
  try {
    const url = new URL(origin);
    return url.protocol === "https:" && (
      url.hostname === "script.google.com" ||
      url.hostname.endsWith(".googleusercontent.com")
    );
  } catch (_) {
    return false;
  }
}

window.addEventListener("message", event => {
  const data = event.data;
  if (!data || data.source !== "cbc-orientation") return;
  if (!isTrustedAppsScriptOrigin(event.origin)) return;
  if (!activeSubmitToken) return;

  const responseToken = typeof data.clientToken === "string" ? data.clientToken : "";
  if (responseToken && responseToken !== activeSubmitToken) return;
  if (successPanel && !successPanel.hidden) return;

  clearTimeout(submitTimer);
  setSubmitting(false);
  activeSubmitToken = "";

  if (data.ok) {
    if (successRegistrationId) successRegistrationId.textContent = data.registrationId || "Confirmed";
    if (successLead) {
      successLead.textContent = data.emailSent === false
        ? "Your registration was received, but the confirmation email could not be sent. Contact claudebuilder.aou@gmail.com and share your registration ID so the team can confirm it."
        : "Your registration has been received successfully. Keep your reference ID and check your inbox for confirmation.";
    }
    if (form) form.hidden = true;
    if (successPanel) successPanel.hidden = false;
    setMessage("");
    successPanel?.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "center" });
    setTimeout(() => closeSuccessButton?.focus({ preventScroll: true }), reducedMotion ? 0 : 60);
  } else {
    setMessage(data.message || "We could not complete your registration. Please try again.", "error");
  }
});

registerAnother?.addEventListener("click", () => {
  if (!form || !successPanel) return;
  clearTimeout(submitTimer);
  activeSubmitToken = "";
  successPanel.hidden = true;
  form.hidden = false;
  form.reset();
  fillAcademics();
  fillTeams();
  syncFacultyValue();
  form.querySelectorAll("[aria-invalid]").forEach(el => el.removeAttribute("aria-invalid"));
  setMessage("");
  showStep(0);
  const tokenField = form.elements.namedItem("clientToken");
  if (tokenField && "value" in tokenField) tokenField.value = "";
  formPages[0]?.querySelector("input:not([type='hidden']):not([name='website'])")?.focus({ preventScroll: true });
});
