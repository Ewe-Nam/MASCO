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

  // ---------- floating WhatsApp + tap-to-call ----------
  // Single source of truth for the school's public number. The call button
  // only shows on touch devices (see .float-call in styles.css).
  var SCHOOL_PHONE = '+233595524547';
  var SCHOOL_PHONE_DISPLAY = '+233 59 552 4547';
  var SCHOOL_WHATSAPP = '233595524547';
  var WA_TEXT = "Hello Mamfe Apostolic School Complex, I'd like to make an enquiry.";

  var ICON_WA = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.16-.17.2-.35.22-.64.07-.3-.15-1.26-.46-2.39-1.47-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.6.13-.14.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.61-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.87 1.21 3.07c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.7.63.71.23 1.36.2 1.87.12.57-.09 1.76-.72 2-1.41.25-.7.25-1.29.18-1.41-.08-.13-.28-.2-.57-.35m-5.42 7.4h-.01a9.87 9.87 0 01-5.03-1.38l-.36-.21-3.74.98 1-3.65-.24-.37a9.86 9.86 0 01-1.51-5.26c0-5.45 4.44-9.88 9.89-9.88 2.64 0 5.12 1.03 6.99 2.9a9.83 9.83 0 012.89 6.99c0 5.45-4.44 9.88-9.88 9.88m8.41-18.3A11.82 11.82 0 0012.05 0C5.5 0 .16 5.34.16 11.89c0 2.1.55 4.14 1.59 5.95L.06 24l6.3-1.65a11.88 11.88 0 005.69 1.45h.01c6.55 0 11.89-5.34 11.89-11.89 0-3.18-1.24-6.17-3.48-8.41z"/></svg>';
  var ICON_CALL = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24c1.12.37 2.33.57 3.57.57a1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1c0 1.25.2 2.45.57 3.57a1 1 0 01-.25 1.01l-2.2 2.21z"/></svg>';

  function initFloatingContact() {
    // an <aside> landmark, so the buttons aren't orphaned outside any region
    var wrap = document.createElement('aside');
    wrap.className = 'float-contact';
    wrap.setAttribute('aria-label', 'Quick contact');
    wrap.innerHTML =
      '<a class="float-btn float-call" href="tel:' + SCHOOL_PHONE + '" aria-label="Call the school on ' + SCHOOL_PHONE_DISPLAY + '">' + ICON_CALL + '</a>' +
      '<a class="float-btn float-wa" href="https://wa.me/' + SCHOOL_WHATSAPP + '?text=' + encodeURIComponent(WA_TEXT) +
        '" target="_blank" rel="noopener" aria-label="Chat with the school on WhatsApp">' + ICON_WA + '</a>';
    document.body.appendChild(wrap);
  }

  // ---------- gallery lightbox ----------
  // Click (or Enter/Space on) a gallery photo to view it larger. Arrow keys /
  // buttons step through the photos currently visible under the active filter.
  function initLightbox() {
    var cells = [].slice.call(document.querySelectorAll('[data-gallery-cell]'))
      .filter(function (c) { return c.querySelector('img'); });
    if (!cells.length) return;

    var box = document.createElement('div');
    box.className = 'lightbox';
    box.hidden = true;
    box.setAttribute('role', 'dialog');
    box.setAttribute('aria-modal', 'true');
    box.setAttribute('aria-label', 'Photo viewer');
    box.innerHTML =
      '<button type="button" class="lb-close" aria-label="Close photo viewer">&times;</button>' +
      '<button type="button" class="lb-nav lb-prev" aria-label="Previous photo">&#8249;</button>' +
      '<figure class="lb-figure"><img class="lb-img" alt=""><figcaption class="lb-cap"></figcaption></figure>' +
      '<button type="button" class="lb-nav lb-next" aria-label="Next photo">&#8250;</button>';
    document.body.appendChild(box);

    var img = box.querySelector('.lb-img');
    var cap = box.querySelector('.lb-cap');
    var buttons = [].slice.call(box.querySelectorAll('button'));
    var current = null, lastFocus = null;

    function visible() { return cells.filter(function (c) { return !c.classList.contains('hidden'); }); }
    function labelOf(cell) {
      var l = cell.querySelector('.tag-label');
      return l ? l.textContent : (cell.querySelector('img').alt || 'Gallery photo');
    }
    function show(cell) {
      var src = cell.querySelector('img');
      current = cell;
      img.src = src.getAttribute('src');
      img.alt = src.alt;
      cap.textContent = labelOf(cell);
    }
    function open(cell) {
      lastFocus = document.activeElement;
      show(cell);
      box.hidden = false;
      document.body.classList.add('lb-open');
      box.querySelector('.lb-close').focus();
    }
    function close() {
      box.hidden = true;
      document.body.classList.remove('lb-open');
      img.removeAttribute('src');
      if (lastFocus) lastFocus.focus();
    }
    function step(d) {
      var list = visible();
      if (!list.length) return;
      var i = list.indexOf(current);
      show(list[(i + d + list.length) % list.length]);
    }

    cells.forEach(function (cell) {
      cell.setAttribute('tabindex', '0');
      cell.setAttribute('role', 'button');
      cell.setAttribute('aria-label', 'View photo: ' + labelOf(cell));
      cell.addEventListener('click', function () { open(cell); });
      cell.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(cell); }
      });
    });

    box.querySelector('.lb-close').addEventListener('click', close);
    box.querySelector('.lb-prev').addEventListener('click', function () { step(-1); });
    box.querySelector('.lb-next').addEventListener('click', function () { step(1); });
    box.addEventListener('click', function (e) { if (e.target === box) close(); });
    document.addEventListener('keydown', function (e) {
      if (box.hidden) return;
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowLeft') step(-1);
      else if (e.key === 'ArrowRight') step(1);
      else if (e.key === 'Tab') {
        // keep focus inside the viewer while it's open
        var i = buttons.indexOf(document.activeElement);
        if (e.shiftKey && i <= 0) { e.preventDefault(); buttons[buttons.length - 1].focus(); }
        else if (!e.shiftKey && i === buttons.length - 1) { e.preventDefault(); buttons[0].focus(); }
      }
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    markActiveNav();
    initMobileMenu();
    initGalleryFilter();
    initContactForm();
    initFloatingContact();
    initLightbox();
  });
})();
