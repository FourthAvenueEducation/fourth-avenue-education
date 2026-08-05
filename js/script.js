// ============================================================
// FOURTH AVENUE EDUCATION — SITE SCRIPT
// Mobile nav toggle, package/FAQ accordions, contact form handling
// ============================================================

document.addEventListener('DOMContentLoaded', function () {

  // ---------- footer year ----------
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ---------- mobile nav toggle ----------
  var navToggle = document.getElementById('navToggle');
  var mainNav = document.getElementById('mainNav');

  if (navToggle && mainNav) {
    navToggle.addEventListener('click', function () {
      var isOpen = mainNav.classList.toggle('is-open');
      navToggle.classList.toggle('is-open', isOpen);
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });

    // close the mobile menu after choosing a link
    mainNav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        mainNav.classList.remove('is-open');
        navToggle.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // ---------- header shadow on scroll ----------
  var header = document.getElementById('siteHeader');
  var lastScroll = 0;
  window.addEventListener('scroll', function () {
    var y = window.scrollY;
    if (header) {
      header.style.boxShadow = y > 8 ? '0 8px 24px -20px rgba(22,35,58,0.5)' : 'none';
    }
    lastScroll = y;
  }, { passive: true });

  // ---------- package "Learn More" accordions ----------
  document.querySelectorAll('.package-toggle').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var card = btn.closest('.package-card');
      var isOpen = card.classList.toggle('is-open');
      btn.setAttribute('aria-expanded', String(isOpen));
      btn.firstChild.textContent = isOpen ? 'Show Less ' : 'Learn More ';
    });
  });

  // ---------- FAQ accordion ----------
  document.querySelectorAll('.faq-question').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var item = btn.closest('.faq-item');
      var answer = item.querySelector('.faq-answer');
      var isOpen = btn.getAttribute('aria-expanded') === 'true';

      // close all others (single-open accordion)
      document.querySelectorAll('.faq-question').forEach(function (other) {
        if (other !== btn) {
          other.setAttribute('aria-expanded', 'false');
          other.closest('.faq-item').querySelector('.faq-answer').style.maxHeight = null;
        }
      });

      btn.setAttribute('aria-expanded', String(!isOpen));
      answer.style.maxHeight = isOpen ? null : answer.scrollHeight + 'px';
    });
  });

  // ---------- "View All Acceptances" toggle ----------
  var acceptancesToggle = document.getElementById('acceptancesToggle');
  var acceptanceGrid = document.getElementById('acceptanceGrid');

  if (acceptancesToggle && acceptanceGrid) {
    acceptancesToggle.addEventListener('click', function () {
      var isOpen = acceptanceGrid.classList.toggle('is-open');
      acceptancesToggle.setAttribute('aria-expanded', String(isOpen));
      acceptancesToggle.firstChild.textContent = isOpen ? 'Show Fewer Acceptances ' : 'View All Acceptances ';
    });
  }

  // ---------- "More Questions" FAQ toggle ----------
  var faqMoreToggle = document.getElementById('faqMoreToggle');
  var faqExtra = document.getElementById('faqExtra');

  if (faqMoreToggle && faqExtra) {
    faqMoreToggle.addEventListener('click', function () {
      var isOpen = faqExtra.classList.toggle('is-open');
      faqMoreToggle.setAttribute('aria-expanded', String(isOpen));
      faqMoreToggle.firstChild.textContent = isOpen ? 'Fewer Questions ' : 'More Questions ';
    });
  }

  // ---------- contact form (submits to Formspree — see form's action attribute) ----------
  var form = document.getElementById('contactForm');
  var formNote = document.getElementById('formNote');

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      if (!form.checkValidity()) {
        formNote.textContent = 'Please fill in all fields before sending.';
        formNote.style.color = '#B23A3A';
        return;
      }

      var submitBtn = form.querySelector('button[type="submit"]');
      submitBtn.textContent = 'Sending…';
      submitBtn.disabled = true;

      fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json' }
      })
        .then(function (response) {
          if (response.ok) {
            formNote.style.color = '';
            formNote.textContent = "Thank you — we'll be in touch within 1–2 business days to schedule your consultation.";
            form.reset();
          } else {
            formNote.style.color = '#B23A3A';
            formNote.textContent = "Something went wrong sending your message. Please email us directly at info@4thavenue.org.";
          }
        })
        .catch(function () {
          formNote.style.color = '#B23A3A';
          formNote.textContent = "Something went wrong sending your message. Please email us directly at info@4thavenue.org.";
        })
        .finally(function () {
          submitBtn.textContent = 'Book a Consultation';
          submitBtn.disabled = false;
        });
    });
  }

  // ---------- smooth-scroll offset for sticky header ----------
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      var id = link.getAttribute('href');
      if (id.length > 1) {
        var target = document.querySelector(id);
        if (target) {
          e.preventDefault();
          var headerHeight = header ? header.offsetHeight : 0;
          var top = target.getBoundingClientRect().top + window.pageYOffset - headerHeight + 1;
          window.scrollTo({ top: top, behavior: 'smooth' });
        }
      }
    });
  });

});
