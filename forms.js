/* ============================================================
   FORMS JAVASCRIPT
   Handles: conditional fields, validation,
            URL pre-population, Netlify submission
   ============================================================ */

(function () {
  'use strict';

  // ── Pre-population from URL params ───────────────────────
  const params = new URLSearchParams(window.location.search);

  function setVal(id, val) {
    const el = document.getElementById(id);
    if (el && val) el.value = val;
  }

  const inquiryType  = params.get('inquiry_type');
  const brand        = params.get('brand');
  const model        = params.get('model');
  const ref          = params.get('ref');
  const listingId    = params.get('listing_id');

  if (inquiryType === 'source') {
    const select = document.getElementById('inquiry-type');
    if (select) select.value = 'source';
  }

  setVal('source-brand',   brand);
  setVal('source-model',   model);
  setVal('source-ref',     ref);
  setVal('field-listing-id', listingId);

  // ── Conditional Fields Logic ──────────────────────────────
  const inquirySelect = document.getElementById('inquiry-type');
  const fieldSets = {
    source:       document.getElementById('fields-source'),
    sell:         document.getElementById('fields-sell'),
    advisory:     document.getElementById('fields-advisory'),
    'private-sale': document.getElementById('fields-private-sale'),
    other:        null
  };

  function showFields(type) {
    Object.keys(fieldSets).forEach(function (key) {
      const el = fieldSets[key];
      if (!el) return;
      el.style.display = key === type ? 'block' : 'none';

      // Toggle required on conditional required fields
      el.querySelectorAll('[data-required-for]').forEach(function (input) {
        input.required = key === type;
      });
    });
  }

  if (inquirySelect) {
    inquirySelect.addEventListener('change', function () {
      showFields(this.value);
    });

    // Trigger on load if pre-populated
    if (inquirySelect.value) showFields(inquirySelect.value);
  }

  // ── Inline Validation ─────────────────────────────────────
  function showError(inputId, errId, show) {
    const input = document.getElementById(inputId);
    const err   = document.getElementById(errId);
    if (!input || !err) return;
    input.classList.toggle('error', show);
    err.classList.toggle('visible', show);
  }

  function validateField(input) {
    if (!input) return true;
    const valid = input.checkValidity();
    const errId = 'err-' + input.id;
    showError(input.id, errId, !valid);
    return valid;
  }

  // Attach blur validation to all required inputs
  document.querySelectorAll('.form-input, .form-select, .form-textarea').forEach(function (el) {
    el.addEventListener('blur', function () {
      if (el.required) validateField(el);
    });

    el.addEventListener('input', function () {
      if (el.classList.contains('error')) validateField(el);
    });
  });

  // ── File Upload Display ───────────────────────────────────
  document.querySelectorAll('input[type="file"]').forEach(function (input) {
    input.addEventListener('change', function () {
      const listEl = document.getElementById(this.id.replace('photos', 'file-list'));
      if (!listEl) return;
      listEl.innerHTML = Array.from(this.files).map(function (f) {
        return '<div class="upload-file-item" style="font-size:var(--text-xs);color:var(--color-cool-gray);margin-top:4px;">' + f.name + '</div>';
      }).join('');
    });
  });

  // ── Form Submission — Private Inquiry ─────────────────────
  const inquiryForm = document.getElementById('inquiry-form');
  if (inquiryForm) {
    inquiryForm.addEventListener('submit', function (e) {
      e.preventDefault();

      let valid = true;

      // Required base fields
      ['first-name', 'last-name', 'email', 'message', 'inquiry-type'].forEach(function (id) {
        const el = document.getElementById(id);
        if (el && el.required) {
          if (!validateField(el)) valid = false;
        }
      });

      // Conditional required fields for active type
      const type = inquirySelect ? inquirySelect.value : '';
      const activeSet = fieldSets[type];
      if (activeSet) {
        activeSet.querySelectorAll('input[required], select[required], textarea[required]')
          .forEach(function (el) {
            if (!validateField(el)) valid = false;
          });
      }

      if (!valid) return;

      // Netlify submission
      const formData = new FormData(inquiryForm);

      fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(formData).toString()
      })
      .then(function () {
        inquiryForm.style.display = 'none';
        document.getElementById('engagement-notice').style.display = 'none';
        const success = document.getElementById('inquiry-success');
        if (success) {
          success.classList.add('visible');
          success.focus();
        }
      })
      .catch(function () {
        // Fallback: standard form submit
        inquiryForm.submit();
      });
    });
  }

  // ── Form Submission — Sell Your Watch ─────────────────────
  const sellForm = document.getElementById('sell-form');
  if (sellForm) {
    sellForm.addEventListener('submit', function (e) {
      e.preventDefault();

      let valid = true;

      sellForm.querySelectorAll('input[required], select[required], textarea[required]')
        .forEach(function (el) {
          if (!validateField(el)) valid = false;
        });

      // Photo minimum check
      const photoInput = document.getElementById('sell-photos-main');
      if (photoInput && photoInput.files.length < 3) {
        valid = false;
        const errEl = document.getElementById('err-photos');
        if (errEl) errEl.classList.add('visible');
      }

      if (!valid) return;

      const formData = new FormData(sellForm);

      fetch('/', {
        method: 'POST',
        body: formData
      })
      .then(function () {
        sellForm.style.display = 'none';
        document.getElementById('sell-reassurance').style.display = 'none';
        const success = document.getElementById('sell-success');
        if (success) {
          success.classList.add('visible');
          success.focus();
        }
      })
      .catch(function () {
        sellForm.submit();
      });
    });
  }

  // ── Form Submission — Contact ─────────────────────────────
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      let valid = true;

      contactForm.querySelectorAll('input[required], textarea[required]')
        .forEach(function (el) {
          if (!validateField(el)) valid = false;
        });

      if (!valid) return;

      const formData = new FormData(contactForm);

      fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(formData).toString()
      })
      .then(function () {
        contactForm.style.display = 'none';
        const success = document.getElementById('contact-success');
        if (success) {
          success.classList.add('visible');
          success.focus();
        }
      })
      .catch(function () {
        contactForm.submit();
      });
    });
  }

})();
