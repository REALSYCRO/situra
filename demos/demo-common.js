// Shared behaviour for all demo sites: mobile nav toggle + scroll reveal
const navToggle = document.getElementById('navToggle');
const mainNav = document.getElementById('mainNav');

if (navToggle && mainNav) {
  navToggle.addEventListener('click', () => {
    const isOpen = mainNav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });
  mainNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      mainNav.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

const revealItems = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);
revealItems.forEach((item) => revealObserver.observe(item));

const form = document.getElementById('demoForm');
const formStatus = document.getElementById('formStatus');
if (form && formStatus) {
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!form.checkValidity()) {
      formStatus.textContent = 'Bitte füllen Sie alle Pflichtfelder korrekt aus.';
      formStatus.style.color = '#dc2626';
      return;
    }
    formStatus.style.color = '';
    formStatus.textContent = 'Danke! Dies ist eine Demo-Website, es wurde keine echte Nachricht versendet.';
    form.reset();
  });
}

const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();
