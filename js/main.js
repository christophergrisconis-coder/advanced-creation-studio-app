/* Advanced Creation Studio — shared site behavior */

document.addEventListener('DOMContentLoaded', () => {
  initMobileNav();
  initActiveLink();
  initScrollReveal();
  initFooterYear();
  initContactForm();
});

/* Mobile nav toggle */
function initMobileNav() {
  const header = document.querySelector('.site-header');
  const toggle = document.querySelector('.nav-toggle');
  if (!header || !toggle) return;

  toggle.addEventListener('click', () => {
    header.classList.toggle('nav-open');
  });

  document.querySelectorAll('.nav-links a').forEach((link) => {
    link.addEventListener('click', () => header.classList.remove('nav-open'));
  });
}

/* Highlight the current page in the nav */
function initActiveLink() {
  const current = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach((link) => {
    const href = link.getAttribute('href');
    if (href === current) link.classList.add('is-active');
  });
}

/* Fade/slide elements in as they enter the viewport */
function initScrollReveal() {
  const targets = document.querySelectorAll('.reveal');
  if (!targets.length) return;

  if (!('IntersectionObserver' in window)) {
    targets.forEach((el) => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  targets.forEach((el) => observer.observe(el));
}

/* Keep the footer copyright year current */
function initFooterYear() {
  document.querySelectorAll('[data-year]').forEach((el) => {
    el.textContent = new Date().getFullYear();
  });
}

/* Basic client-side validation + submit feedback for the contact form.
   Replace the form's `action` attribute with your endpoint (Formspree,
   a serverless function, etc.) before going live — see README. */
function initContactForm() {
  const form = document.querySelector('#contact-form');
  if (!form) return;

  const status = form.querySelector('.form-status');

  form.addEventListener('submit', (e) => {
    const requiredFields = form.querySelectorAll('[required]');
    let valid = true;

    requiredFields.forEach((field) => {
      if (!field.value.trim()) {
        valid = false;
        field.style.borderColor = '#E23D3D';
      } else {
        field.style.borderColor = '';
      }
    });

    if (!valid) {
      e.preventDefault();
      if (status) {
        status.textContent = 'Please complete all required fields before submitting.';
        status.style.color = '#E23D3D';
      }
      return;
    }

    if (form.getAttribute('action') === '#') {
      e.preventDefault();
      if (status) {
        status.textContent = 'This form is not yet connected to a submission endpoint. See README.md for setup instructions.';
        status.style.color = '#1E90FF';
      }
    }
  });
}
