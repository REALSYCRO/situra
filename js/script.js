// Mobile navigation toggle
const navToggle = document.getElementById('navToggle');
const mainNav = document.getElementById('mainNav');

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

// FAQ accordion
document.querySelectorAll('.faq-item').forEach((item) => {
  const question = item.querySelector('.faq-question');
  question.addEventListener('click', () => {
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item.open').forEach((openItem) => {
      openItem.classList.remove('open');
      openItem.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
    });
    if (!isOpen) {
      item.classList.add('open');
      question.setAttribute('aria-expanded', 'true');
    }
  });
});

// Scroll reveal animation
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

// Contact form — submits to Formspree (see the form's action attribute for the endpoint)
const form = document.getElementById('kontaktForm');
const formStatus = document.getElementById('formStatus');
const submitButton = form.querySelector('button[type="submit"]');

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (!form.checkValidity()) {
    formStatus.style.color = '#dc2626';
    formStatus.textContent = 'Bitte füllen Sie alle Pflichtfelder korrekt aus.';
    return;
  }

  submitButton.disabled = true;
  formStatus.style.color = '';
  formStatus.textContent = 'Wird gesendet …';

  try {
    const response = await fetch(form.action, {
      method: 'POST',
      body: new FormData(form),
      headers: { Accept: 'application/json' },
    });

    if (response.ok) {
      formStatus.style.color = '';
      formStatus.textContent = 'Danke! Ihre Nachricht wurde übermittelt. Wir melden uns in Kürze.';
      form.reset();
    } else {
      throw new Error('Formspree request failed');
    }
  } catch (error) {
    formStatus.style.color = '#dc2626';
    formStatus.textContent = 'Leider ist etwas schiefgelaufen. Schreiben Sie uns gerne direkt an kontakt@klarwerk.de.';
  } finally {
    submitButton.disabled = false;
  }
});

// Footer year
document.getElementById('year').textContent = new Date().getFullYear();
