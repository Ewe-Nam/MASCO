// Mamfe Apostolic School Complex — shared site behavior
// Works across every page since each page is a plain static HTML file
// (no client-side router — see README for why).

(function () {
  'use strict';

  // ---------- active nav highlighting ----------
  // Compares each nav link's own href to the current page filename, so the
  // exact same header markup (duplicated per page) lights up correctly
  // wherever it's dropped in.
  function currentFile() {
    var path = window.location.pathname.split('/').pop();
    return path === '' ? 'index.html' : path;
  }

  function markActiveNav() {
    var here = currentFile();
    document.querySelectorAll('[data-nav-link]').forEach(function (link) {
      var target = (link.getAttribute('href') || '').split('/').pop();
      if (target === here) {
        link.classList.add('active');
      }
    });
  }

  // ---------- mobile hamburger menu ----------
  function initMobileMenu() {
    var toggle = document.querySelector('[data-hamburger]');
    var menu = document.querySelector('[data-mobile-menu]');
    if (!toggle || !menu) return;
    toggle.addEventListener('click', function () {
      var isOpen = menu.classList.toggle('open');
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
    menu.querySelectorAll('a,button').forEach(function (el) {
      el.addEventListener('click', function () {
        menu.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // ---------- gallery category filter ----------
  function initGalleryFilter() {
    var chips = document.querySelectorAll('[data-filter-chip]');
    var cells = document.querySelectorAll('[data-gallery-cell]');
    if (!chips.length || !cells.length) return;
    chips.forEach(function (chip) {
      chip.addEventListener('click', function () {
        chips.forEach(function (c) { c.classList.remove('active'); });
        chip.classList.add('active');
        var filter = chip.getAttribute('data-filter-chip');
        cells.forEach(function (cell) {
          var cat = cell.getAttribute('data-category');
          var show = filter === 'All' || cat === filter;
          cell.classList.toggle('hidden', !show);
        });
      });
    });
  }

  // ---------- contact form ----------
  // Posts to Web3Forms (https://web3forms.com) — a backend-free form
  // delivery service: no server code needed, submissions email straight to
  // the school inbox. Get a free access key at web3forms.com (just enter
  // the destination email, no account signup) and paste it below in place
  // of YOUR_WEB3FORMS_ACCESS_KEY. See README.md for full setup steps.
  var WEB3FORMS_ACCESS_KEY = '31cd5dcb-9a0f-4bf3-9433-eae08bb869bc';
  var SCHOOL_EMAIL = 'mamfeapostolicschoolcomplex62@gmail.com';

  function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  function initContactForm() {
    var form = document.querySelector('[data-contact-form]');
    if (!form) return;

    var nameInput = form.querySelector('[name="name"]');
    var emailInput = form.querySelector('[name="email"]');
    var messageInput = form.querySelector('[name="message"]');
    var status = form.querySelector('[data-form-status]');
    var submitBtn = form.querySelector('[data-submit-btn]');

    function setError(input, message) {
      var errorEl = form.querySelector('[data-error-for="' + input.name + '"]');
      if (!errorEl) return;
      errorEl.textContent = message || '';
      errorEl.classList.toggle('show', !!message);
    }

    function validate() {
      var ok = true;
      if (!nameInput.value.trim()) { setError(nameInput, 'Please enter your name.'); ok = false; }
      else setError(nameInput, '');

      if (!emailInput.value.trim()) { setError(emailInput, 'Please enter your email.'); ok = false; }
      else if (!isValidEmail(emailInput.value.trim())) { setError(emailInput, 'Please enter a valid email address.'); ok = false; }
      else setError(emailInput, '');

      if (!messageInput.value.trim()) { setError(messageInput, 'Please tell us how we can help.'); ok = false; }
      else setError(messageInput, '');

      return ok;
    }

    function showStatus(kind, message) {
      status.textContent = message;
      status.className = 'form-status show ' + kind;
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      status.className = 'form-status';
      if (!validate()) return;

      if (WEB3FORMS_ACCESS_KEY === 'YOUR_WEB3FORMS_ACCESS_KEY') {
        showStatus('err', 'Form delivery isn’t configured yet — add a Web3Forms access key in js/main.js (see README.md).');
        return;
      }

      var payload = {
        access_key: WEB3FORMS_ACCESS_KEY,
        subject: 'New enquiry from the school website',
        from_name: nameInput.value.trim(),
        to: SCHOOL_EMAIL,
        name: nameInput.value.trim(),
        email: emailInput.value.trim(),
        child_age_or_level: (form.querySelector('[name="child_info"]') || {}).value || '',
        message: messageInput.value.trim(),
        // Honeypot: humans never check the hidden botcheck box. If it's set,
        // a bot filled the form, and Web3Forms rejects the submission as spam.
        botcheck: !!(form.querySelector('[name="botcheck"]') || {}).checked
      };

      submitBtn.disabled = true;
      var originalLabel = submitBtn.textContent;
      submitBtn.innerHTML = '<span class="spinner"></span>Sending…';

      fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload)
      })
        .then(function (res) { return res.json(); })
        .then(function (data) {
          if (data.success) {
            showStatus('ok', 'Thanks! Your message has been sent — we’ll be in touch soon.');
            form.reset();
          } else {
            showStatus('err', 'Something went wrong sending your message. Please try again or email us directly.');
          }
        })
        .catch(function () {
          showStatus('err', 'Something went wrong sending your message. Please try again or email us directly.');
        })
        .finally(function () {
          submitBtn.disabled = false;
          submitBtn.textContent = originalLabel;
        });
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    markActiveNav();
    initMobileMenu();
    initGalleryFilter();
    initContactForm();
  });
})();
