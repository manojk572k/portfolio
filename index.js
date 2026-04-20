/* =========================
   PROFILE
========================= */
const PROFILE = {
  name: "Manoj Kumar Gadipalli",
  location: "Denton, TX",
  email: "gadipallimanojkumar@gmail.com",
  phone: "(940) 977-5738",
  summary:
    "I design end-to-end products using React, Node.js, Express, MongoDB, and JWT authentication, with a strong focus on usability, maintainability, and real-world application workflows."
};

document.documentElement.classList.add("js-enabled");

/* =========================
   HELPERS
========================= */
function formatPhoneForHref(phone) {
  return phone.replace(/[^\d+]/g, "");
}

function updateThemeButtonLabel(btn) {
  const isLight = document.documentElement.classList.contains("light");
  btn.setAttribute("aria-label", isLight ? "Switch to dark theme" : "Switch to light theme");
  btn.setAttribute("aria-pressed", String(isLight));
}

/* =========================
   PROFILE INJECTION
========================= */
function injectProfile() {
  const pName = document.getElementById("pName");
  const pLoc = document.getElementById("pLoc");
  const heroSummary = document.getElementById("heroSummary");

  const cLocOut = document.getElementById("cLocOut");
  const cEmailOut = document.getElementById("cEmailOut");
  const cPhoneOut = document.getElementById("cPhoneOut");

  if (pName) pName.textContent = PROFILE.name;
  if (pLoc) pLoc.textContent = PROFILE.location;
  if (heroSummary) heroSummary.textContent = PROFILE.summary;

  if (cLocOut) {
    cLocOut.textContent = PROFILE.location;
    cLocOut.href = `https://www.google.com/maps?q=${encodeURIComponent(PROFILE.location)}`;
  }

  if (cEmailOut) {
    cEmailOut.textContent = PROFILE.email;
    cEmailOut.href = `mailto:${PROFILE.email}`;
  }

  if (cPhoneOut) {
    cPhoneOut.textContent = PROFILE.phone;
    cPhoneOut.href = `tel:${formatPhoneForHref(PROFILE.phone)}`;
  }

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
    btn.setAttribute("aria-expanded", "true");
  };

  const closeMenu = () => {
    drawer.classList.remove("open");
    drawer.setAttribute("aria-hidden", "true");
    btn.setAttribute("aria-label", "Open menu");
    btn.setAttribute("aria-expanded", "false");
  };

  btn.addEventListener("click", () => {
    const isOpen = drawer.classList.contains("open");
    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  document.addEventListener("click", (e) => {
    const clickedInsideDrawer = drawer.contains(e.target);
    const clickedButton = btn.contains(e.target);

    if (!clickedInsideDrawer && !clickedButton && drawer.classList.contains("open")) {
      closeMenu();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && drawer.classList.contains("open")) {
      closeMenu();
    }
  });

  drawer.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });
}

/* =========================
   NAVIGATION
========================= */
function setupNav() {
  const allLinks = document.querySelectorAll(".nav-link, .drawer-link");

  allLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      const href = link.getAttribute("href");
      if (!href || !href.startsWith("#")) return;

      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  const navLinks = document.querySelectorAll(".nav-link, .drawer-link");
  const sections = ["#home", "#about", "#experience", "#projects", "#contact"]
    .map((id) => document.querySelector(id))
    .filter(Boolean);

  function setActive(id) {
    navLinks.forEach((link) => {
      link.classList.toggle("active", link.getAttribute("href") === id);
    });
  }

  if (!("IntersectionObserver" in window)) {
    if (sections.length) setActive(`#${sections[0].id}`);
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      const visibleEntries = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

      if (visibleEntries.length) {
        setActive(`#${visibleEntries[0].target.id}`);
      }
    },
    {
      threshold: [0.25, 0.5, 0.75],
      rootMargin: "-20% 0px -35% 0px"
    }
  );

  sections.forEach((section) => observer.observe(section));
}

/* =========================
   REVEAL ON SCROLL
========================= */
function setupReveal() {
  const elements = document.querySelectorAll(".reveal");
  if (!elements.length) return;

  if (!("IntersectionObserver" in window)) {
    elements.forEach((el) => el.classList.add("show"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("show");
        obs.unobserve(entry.target);
      });
    },
    { threshold: 0.15 }
  );

  elements.forEach((el) => observer.observe(el));
}

/* =========================
   CONTACT FORM
========================= */
function setupContactForm() {
  const form = document.getElementById("contactForm");
  const hint = document.getElementById("formHint");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("cname")?.value.trim() || "";
    const email = document.getElementById("cemail")?.value.trim() || "";
    const subject =
      document.getElementById("csubject")?.value.trim() || "Portfolio Contact";
    const msg = document.getElementById("cmsg")?.value.trim() || "";

    if (!name || !email || !msg) {
      if (hint) hint.textContent = "Please fill Name, Email, and Message.";
      return;
    }

    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!isValidEmail) {
      if (hint) hint.textContent = "Please enter a valid email address.";
      return;
    }

    const mailSubject = encodeURIComponent(subject);
    const mailBody = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\n\nMessage:\n${msg}`
    );

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

  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "light") {
    document.documentElement.classList.add("light");
  }

  updateThemeButtonLabel(btn);

  btn.addEventListener("click", () => {
    document.documentElement.classList.toggle("light");

    const currentTheme = document.documentElement.classList.contains("light")
      ? "light"
      : "dark";

    localStorage.setItem("theme", currentTheme);
    updateThemeButtonLabel(btn);
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
  setupContactForm();
  setupTheme();
});