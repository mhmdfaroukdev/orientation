const CONFIG = {
  appsScriptUrl: "https://script.google.com/macros/s/AKfycbyGoQdR5xgepqns7HpyWoHjfJr4cDEMWaBFHoSzUo3uAFgjrrGZvWUKW2TvPLjIWCdy/exec",
  eventDate: "To be announced",
  eventLocation: "AOU Egypt"
};

// Kept aligned with the faculty/programme taxonomy used on claudeaou.github.io.
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
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const themeMedia = window.matchMedia("(prefers-color-scheme: dark)");

const form = document.getElementById("registrationForm");
const submitButton = form?.querySelector("button[type='submit']");
const submitLabel = submitButton?.querySelector(".submit-label");
const message = document.getElementById("formMessage");
const eventDate = document.getElementById("eventDate");
const eventLocation = document.getElementById("eventLocation");
const themeToggle = document.getElementById("themeToggle");
const themeLabel = themeToggle?.querySelector(".theme-label");
const themeIcon = themeToggle?.querySelector(".theme-icon");
const facultySelect = document.getElementById("facultySelect");
const majorSelect = document.getElementById("majorSelect");
const facultyCombined = document.getElementById("facultyCombined");
const teamInterest = document.getElementById("teamInterest");
const successPanel = document.getElementById("registrationSuccess");
const successRegistrationId = document.getElementById("successRegistrationId");
const registerAnother = document.getElementById("registerAnother");
const heroStatus = document.getElementById("heroStatus");
const nav = document.querySelector(".nav");
const navContainer = document.querySelector(".nav-links");

let submitTimer;

function readThemePreference() {
  try { return localStorage.getItem(THEME_KEY) || "system"; } catch (_) { return "system"; }
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

  const text = pref === "system" ? "System" : (pref === "dark" ? "Dark" : "Light");
  if (themeLabel) themeLabel.textContent = text;
  if (themeIcon) themeIcon.textContent = pref === "system" ? "◐" : (actual === "dark" ? "☾" : "☀");
  if (themeToggle) {
    themeToggle.title = `Theme: ${text} · tap to change`;
    themeToggle.setAttribute("aria-label", `Theme: ${text}. Tap to change.`);
  }

  document.querySelectorAll("[data-mobile-theme]").forEach(el => { el.textContent = text; });
}

function cycleTheme() {
  const current = readThemePreference();
  const next = current === "system" ? "light" : (current === "light" ? "dark" : "system");
  applyTheme(next);
}

applyTheme(readThemePreference());
themeToggle?.addEventListener("click", cycleTheme);
themeMedia.addEventListener?.("change", () => {
  if (readThemePreference() === "system") applyTheme("system");
});

function fillAcademics() {
  if (!facultySelect || !majorSelect) return;
  facultySelect.innerHTML = '<option value="">Select your faculty</option>' +
    Object.keys(ACADEMICS).map(name => `<option value="${name}">${name}</option>`).join("");
  fillMajors("");
}

function fillMajors(faculty) {
  if (!majorSelect) return;
  const majors = ACADEMICS[faculty] || [];
  majorSelect.disabled = majors.length === 0;
  majorSelect.innerHTML = majors.length
    ? '<option value="">Select your programme / major</option>' + majors.map(name => `<option value="${name}">${name}</option>`).join("")
    : '<option value="">Choose a faculty first</option>';
  syncFacultyValue();
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

if (eventDate) eventDate.textContent = CONFIG.eventDate;
if (eventLocation) eventLocation.textContent = CONFIG.eventLocation;
const footerYear = document.getElementById("footerYear");
if (footerYear) footerYear.textContent = String(new Date().getFullYear());

function initNavBehavior() {
  if (!nav) return;
  const syncScrolled = () => nav.classList.toggle("scrolled", window.scrollY > 10);
  syncScrolled();
  window.addEventListener("scroll", syncScrolled, { passive: true });

  const anchors = [...document.querySelectorAll('.nav-links a[href^="#"]')];
  const sections = anchors
    .map(anchor => document.querySelector(anchor.getAttribute("href")))
    .filter(Boolean);

  if (!("IntersectionObserver" in window) || !sections.length) return;
  const observer = new IntersectionObserver(entries => {
    const visible = entries
      .filter(entry => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (!visible) return;
    anchors.forEach(anchor => anchor.classList.toggle("is-active", anchor.getAttribute("href") === `#${visible.target.id}`));
  }, { rootMargin: "-25% 0px -60% 0px", threshold: [0, .2, .5] });
  sections.forEach(section => observer.observe(section));
}

function initMobileMenu() {
  if (!navContainer || document.querySelector(".mobile-menu-toggle")) return;

  const toggle = document.createElement("button");
  toggle.type = "button";
  toggle.className = "mobile-menu-toggle";
  toggle.setAttribute("aria-label", "Open navigation menu");
  toggle.setAttribute("aria-expanded", "false");
  toggle.setAttribute("aria-controls", "mobileMenu");
  toggle.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path class="menu-line" d="M4 6h16"/><path class="menu-line" d="M4 12h16"/><path class="menu-line" d="M4 18h16"/></svg>';
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
        <a href="#top">Home</a>
        <a href="#about">About</a>
        <a href="#agenda">Agenda</a>
        <a href="#register">Register</a>
        <a href="#community">Community</a>
      </nav>
      <div class="mobile-menu-divider" aria-hidden="true"></div>
      <div class="mobile-menu-socials">
        <a class="mobile-menu-social facebook" href="https://www.facebook.com/claudeaouclub" target="_blank" rel="noopener noreferrer"><svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor"><path d="M13.6 22v-9h3l.45-3.5H13.6V7.27c0-1.01.28-1.7 1.74-1.7H17.2V2.44A24.8 24.8 0 0 0 14.5 2c-2.67 0-4.5 1.63-4.5 4.62V9.5H7V13h3v9h3.6Z"/></svg><span>Facebook</span></a>
        <a class="mobile-menu-social whatsapp" href="https://chat.whatsapp.com/GwiXzxyBXTBDsBqeenPYP8" target="_blank" rel="noopener noreferrer"><svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor"><path d="M20.52 3.48A11.82 11.82 0 0 0 12.06 0C5.47 0 .11 5.36.11 11.95c0 2.1.55 4.16 1.6 5.96L0 24l6.24-1.64a11.93 11.93 0 0 0 5.81 1.48h.01c6.59 0 11.95-5.36 11.95-11.95 0-3.19-1.24-6.19-3.49-8.41Z"/></svg><span>WhatsApp</span></a>
      </div>
      <button class="mobile-menu-theme" type="button"><span>Appearance</span><span data-mobile-theme>System</span></button>
      <div class="mobile-menu-actions"><button class="mobile-menu-apply" type="button">Reserve your seat</button></div>
    </aside>`;
  document.body.appendChild(shell);

  const panel = shell.querySelector(".mobile-menu-panel");
  const closeBtn = shell.querySelector(".mobile-menu-close");
  const backdrop = shell.querySelector(".mobile-menu-backdrop");
  const drawerTheme = shell.querySelector(".mobile-menu-theme");
  const drawerApply = shell.querySelector(".mobile-menu-apply");
  const viewport = window.matchMedia("(max-width: 760px)");
  let previousFocus = null;

  const focusables = () => [...panel.querySelectorAll('a[href],button:not([disabled]):not([hidden])')].filter(el => el.offsetParent !== null);
  const open = () => {
    if (!viewport.matches) return;
    previousFocus = document.activeElement;
    shell.classList.add("is-open");
    shell.setAttribute("aria-hidden", "false");
    toggle.setAttribute("aria-expanded", "true");
    toggle.setAttribute("aria-label", "Close navigation menu");
    document.body.classList.add("mobile-menu-open");
    setTimeout(() => closeBtn?.focus({ preventScroll: true }), reducedMotion ? 0 : 70);
  };
  const close = (restore = true) => {
    shell.classList.remove("is-open");
    shell.setAttribute("aria-hidden", "true");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Open navigation menu");
    document.body.classList.remove("mobile-menu-open");
    if (restore && previousFocus instanceof HTMLElement) previousFocus.focus?.({ preventScroll: true });
    previousFocus = null;
  };

  toggle.addEventListener("click", () => shell.classList.contains("is-open") ? close() : open());
  closeBtn?.addEventListener("click", () => close());
  backdrop?.addEventListener("click", () => close());
  shell.querySelectorAll(".mobile-menu-nav a,.mobile-menu-social").forEach(el => el.addEventListener("click", () => close(false)));
  drawerTheme?.addEventListener("click", () => cycleTheme());
  drawerApply?.addEventListener("click", () => {
    close(false);
    setTimeout(() => document.getElementById("register")?.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth" }), reducedMotion ? 0 : 70);
  });

  document.addEventListener("keydown", event => {
    if (!shell.classList.contains("is-open")) return;
    if (event.key === "Escape") { event.preventDefault(); close(); return; }
    if (event.key !== "Tab") return;
    const list = focusables();
    if (!list.length) return;
    const first = list[0];
    const last = list[list.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  });

  viewport.addEventListener?.("change", event => { if (!event.matches) close(false); });
  applyTheme(readThemePreference());
}

function initMobileDock() {
  if (document.querySelector(".mobile-dock")) return;
  const dock = document.createElement("div");
  dock.className = "mobile-dock";
  dock.hidden = true;
  dock.innerHTML = `
    <button type="button" class="dock-apply">Reserve your seat</button>
    <a class="dock-updates" href="https://chat.whatsapp.com/GwiXzxyBXTBDsBqeenPYP8" target="_blank" rel="noopener noreferrer" aria-label="Orientation updates on WhatsApp">
      <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor"><path d="M20.52 3.48A11.82 11.82 0 0 0 12.06 0C5.47 0 .11 5.36.11 11.95c0 2.1.55 4.16 1.6 5.96L0 24l6.24-1.64a11.93 11.93 0 0 0 5.81 1.48h.01c6.59 0 11.95-5.36 11.95-11.95 0-3.19-1.24-6.19-3.49-8.41Z"/></svg>
    </a>`;
  document.body.appendChild(dock);

  dock.querySelector(".dock-apply")?.addEventListener("click", () => {
    document.getElementById("register")?.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth" });
  });

  const mobile = window.matchMedia("(max-width: 760px)");
  const hero = document.querySelector(".hero");
  const register = document.getElementById("register");
  let heroVisible = true;
  let registerVisible = false;

  const sync = () => { dock.hidden = !mobile.matches || heroVisible || registerVisible; };
  if ("IntersectionObserver" in window) {
    if (hero) new IntersectionObserver(([entry]) => { heroVisible = entry.isIntersecting; sync(); }, { threshold: .15 }).observe(hero);
    if (register) new IntersectionObserver(([entry]) => { registerVisible = entry.isIntersecting; sync(); }, { threshold: .08 }).observe(register);
  }
  mobile.addEventListener?.("change", sync);
  sync();
}

initNavBehavior();
initMobileMenu();
initMobileDock();

const isConfigured = () =>
  CONFIG.appsScriptUrl.startsWith("https://script.google.com/macros/s/") && CONFIG.appsScriptUrl.endsWith("/exec");

function setMessage(text, type = "") {
  if (!message) return;
  message.textContent = text;
  message.className = `orientation-form-message ${type}`.trim();
}

function setSubmitting(submitting) {
  if (!submitButton || !submitLabel) return;
  submitButton.disabled = submitting;
  submitLabel.textContent = submitting ? "Registering…" : "Complete registration";
}

function validateField(field) {
  if (!(field instanceof HTMLInputElement || field instanceof HTMLSelectElement || field instanceof HTMLTextAreaElement)) return true;
  const valid = field.checkValidity();
  if (field.type !== "hidden") field.setAttribute("aria-invalid", valid ? "false" : "true");
  return valid;
}

form?.querySelectorAll("input, select, textarea").forEach(field => {
  field.addEventListener("input", () => validateField(field));
  field.addEventListener("change", () => validateField(field));
});

form?.addEventListener("submit", event => {
  event.preventDefault();
  setMessage("");
  syncFacultyValue();

  const honeypot = form.elements.namedItem("website");
  if (honeypot && "value" in honeypot && String(honeypot.value || "").trim()) {
    setMessage("We could not complete this registration.", "error");
    return;
  }

  const fields = [...form.querySelectorAll("input, select, textarea")].filter(field => field.name !== "website");
  const allValid = fields.every(validateField);

  if (!facultyCombined?.value || !allValid || !form.checkValidity()) {
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
    setMessage("Your registration was sent. If the confirmation email does not arrive shortly, contact the club team.", "success");
  }, 15000);
});

window.addEventListener("message", event => {
  const data = event.data;
  if (!data || data.source !== "cbc-orientation") return;

  clearTimeout(submitTimer);
  setSubmitting(false);

  if (data.ok) {
    if (successRegistrationId) successRegistrationId.textContent = data.registrationId || "Confirmed";
    if (form) form.hidden = true;
    if (successPanel) successPanel.hidden = false;
    setMessage("");
  } else {
    setMessage(data.message || "We could not complete your registration. Please try again.", "error");
  }
});

registerAnother?.addEventListener("click", () => {
  if (!form || !successPanel) return;
  successPanel.hidden = true;
  form.hidden = false;
  form.reset();
  fillAcademics();
  fillTeams();
  syncFacultyValue();
  form.querySelectorAll("[aria-invalid]").forEach(el => el.removeAttribute("aria-invalid"));
  setMessage("");
  form.querySelector("input:not([type='hidden'])")?.focus({ preventScroll: true });
});
