/* =========================
   PROFILE (edit once)
========================= */
const PROFILE = {
  name: "Manoj Kumar Gadipalli",
  location: "Denton, TX",
  email: "gadipallimanojkumar@gmail.com",
  phone: "(940)-9775738",
  summary:
    "I build React interfaces, REST APIs, JWT authentication, and database integrations with a focus on quality and performance."
};

function injectProfile() {
  const pName = document.getElementById("pName");
  const pLoc = document.getElementById("pLoc");
  const heroSummary = document.getElementById("heroSummary");

  const cNameOut = document.getElementById("cNameOut");
  const cLocOut = document.getElementById("cLocOut");
  const cEmailOut = document.getElementById("cEmailOut");
  const cPhoneOut = document.getElementById("cPhoneOut");

  if (pName) pName.textContent = PROFILE.name;
  if (pLoc) pLoc.textContent = PROFILE.location;
  if (heroSummary) heroSummary.textContent = PROFILE.summary;

  if (cNameOut) cNameOut.textContent = PROFILE.name;
  if (cLocOut) cLocOut.textContent = PROFILE.location;
  if (cEmailOut) cEmailOut.textContent = PROFILE.email;
  if (cPhoneOut) cPhoneOut.textContent = PROFILE.phone;

  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
}

/* =========================
   MOBILE MENU
========================= */
function setupMobileMenu() {
  const btn = document.getElementById("hamburger");
  const drawer = document.getElementById("drawer");
  if (!btn || !drawer) return;

  const openMenu = () => {
    drawer.classList.add("open");
    drawer.setAttribute("aria-hidden", "false");
    btn.setAttribute("aria-label", "Close menu");
  };

  const closeMenu = () => {
    drawer.classList.remove("open");
    drawer.setAttribute("aria-hidden", "true");
    btn.setAttribute("aria-label", "Open menu");
  };

  btn.addEventListener("click", () => {
    const isOpen = drawer.classList.contains("open");
    isOpen ? closeMenu() : openMenu();
  });

  // close if click outside
  document.addEventListener("click", (e) => {
    const inside = drawer.contains(e.target) || btn.contains(e.target);
    if (!inside && drawer.classList.contains("open")) closeMenu();
  });

  // close with ESC
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && drawer.classList.contains("open")) closeMenu();
  });

  // close on drawer link click + smooth scroll handled in setupNav
  drawer.querySelectorAll("a").forEach(a => {
    a.addEventListener("click", () => closeMenu());
  });
}

/* =========================
   SMOOTH SCROLL + ACTIVE NAV
========================= */
function setupNav() {
  const allLinks = document.querySelectorAll(".nav-link, .drawer-link, .scroll-down");
  allLinks.forEach(a => {
    a.addEventListener("click", (e) => {
      const href = a.getAttribute("href");
      if (!href || !href.startsWith("#")) return;

      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  const navLinks = document.querySelectorAll(".nav-link");
  const sections = ["#home", "#about", "#experience", "#projects", "#contact"]
    .map(id => document.querySelector(id))
    .filter(Boolean);

  const setActive = (id) => {
    navLinks.forEach(a => a.classList.toggle("active", a.getAttribute("href") === id));
  };

  const obs = new IntersectionObserver((entries) => {
    const visible = entries
      .filter(en => en.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (visible) setActive(`#${visible.target.id}`);
  }, { threshold: [0.35, 0.55, 0.75] });

  sections.forEach(sec => obs.observe(sec));
}

/* =========================
   REVEAL ON SCROLL
========================= */
function setupReveal() {
  const els = document.querySelectorAll(".reveal");
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(en => {
      if (en.isIntersecting) en.target.classList.add("show");
    });
  }, { threshold: 0.15 });

  els.forEach(el => obs.observe(el));
}

/* =========================
   SKILL BAR ANIMATION
========================= */
function setupSkillBars() {
  const fills = document.querySelectorAll(".fill");
  if (!fills.length) return;

  // start at 0 and animate when About is visible
  fills.forEach(f => (f.style.width = "0%"));

  const about = document.getElementById("about");
  if (!about) return;

  const obs = new IntersectionObserver((entries) => {
    if (!entries[0].isIntersecting) return;

    fills.forEach(f => {
      const lvl = Number(f.dataset.level || 0);
      f.style.transition = "width 900ms ease";
      f.style.width = `${Math.max(0, Math.min(100, lvl))}%`;
    });

    obs.disconnect();
  }, { threshold: 0.30 });

  obs.observe(about);
}

/* =========================
   PROJECT MODAL
========================= */
function setupModal() {
  const modal = document.getElementById("modal");
  const closeBtn = document.getElementById("modalClose");
  const mTitle = document.getElementById("mTitle");
  const mDesc = document.getElementById("mDesc");
  const mTech = document.getElementById("mTech");
  const mLink = document.getElementById("mLink");
  const cards = document.querySelectorAll(".pbox");

  if (!modal || !closeBtn || !mTitle || !mDesc || !mTech || !mLink || !cards.length) return;

  const open = (card) => {
    mTitle.textContent = card.dataset.title || "Project";
    mDesc.textContent = card.dataset.desc || "";
    mTech.textContent = `Tech: ${card.dataset.tech || ""}`;
    mLink.href = card.dataset.link || "#";
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
  };

  const close = () => {
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
  };

  cards.forEach(card => card.addEventListener("click", () => open(card)));
  closeBtn.addEventListener("click", close);

  modal.addEventListener("click", (e) => {
    if (e.target === modal) close();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("open")) close();
  });
}

/* =========================
   CONTACT FORM (mailto)
========================= */
function setupContactForm() {
  const form = document.getElementById("contactForm");
  const hint = document.getElementById("formHint");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("cname")?.value.trim();
    const email = document.getElementById("cemail")?.value.trim();
    const subject = document.getElementById("csubject")?.value.trim() || "Portfolio Contact";
    const msg = document.getElementById("cmsg")?.value.trim();

    if (!name || !email || !msg) {
      if (hint) hint.textContent = "Please fill Name, Email, and Message.";
      return;
    }

    const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!ok) {
      if (hint) hint.textContent = "Please enter a valid email address.";
      return;
    }

    const mailSubject = encodeURIComponent(subject);
    const mailBody = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${msg}`);

    if (hint) hint.textContent = "Opening your email client...";
    window.location.href = `mailto:${PROFILE.email}?subject=${mailSubject}&body=${mailBody}`;

    form.reset();
  });
}

/* =========================
   THEME TOGGLE
========================= */
function setupTheme() {
  const btn = document.getElementById("themeBtn");
  if (!btn) return;

  const saved = localStorage.getItem("theme");
  if (saved === "light") document.documentElement.classList.add("light");

  btn.addEventListener("click", () => {
    document.documentElement.classList.toggle("light");
    localStorage.setItem("theme", document.documentElement.classList.contains("light") ? "light" : "dark");
  });
}

/* =========================
   INIT
========================= */
document.addEventListener("DOMContentLoaded", () => {
  injectProfile();
  setupMobileMenu();
  setupNav();
  setupReveal();
  setupSkillBars();
  setupModal();
  setupContactForm();
  setupTheme();
});
