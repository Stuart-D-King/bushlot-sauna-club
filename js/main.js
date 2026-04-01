/* =============================================
   BUSHLOT SAUNA CLUB — main.js
   ============================================= */

document.addEventListener('DOMContentLoaded', function () {

  // =============================================
  // NAVIGATION — transparent/solid toggle
  // =============================================
  const nav = document.querySelector('.site-nav');

  if (nav) {
    // Homepage: transparent nav that becomes solid on scroll
    if (nav.dataset.transparent === 'true') {
      function updateNav() {
        if (window.scrollY > 70) {
          nav.classList.add('nav-solid');
        } else {
          nav.classList.remove('nav-solid');
        }
      }
      updateNav();
      window.addEventListener('scroll', updateNav, { passive: true });
    }

    // Mobile hamburger
    const hamburger = document.querySelector('.nav-hamburger');
    const mobileMenu = document.querySelector('.nav-mobile');

    if (hamburger && mobileMenu) {
      hamburger.addEventListener('click', function () {
        const isOpen = mobileMenu.classList.contains('open');
        mobileMenu.classList.toggle('open');
        hamburger.setAttribute('aria-expanded', String(!isOpen));
        hamburger.setAttribute('aria-label', isOpen ? 'Open menu' : 'Close menu');
      });

      // Close mobile menu when a link is clicked
      mobileMenu.querySelectorAll('a').forEach(function (link) {
        link.addEventListener('click', function () {
          mobileMenu.classList.remove('open');
          hamburger.setAttribute('aria-expanded', 'false');
        });
      });
    }
  }


  // =============================================
  // FAQ ACCORDION
  // =============================================
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(function (item) {
    const btn = item.querySelector('.faq-question');
    if (!btn) return;

    btn.addEventListener('click', function () {
      const isOpen = item.classList.contains('open');

      // Close all items
      faqItems.forEach(function (other) {
        other.classList.remove('open');
        const otherBtn = other.querySelector('.faq-question');
        if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
      });

      // Open clicked item (if it wasn't already open)
      if (!isOpen) {
        item.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });


  // =============================================
  // CONTACT FORM — Formspree AJAX submission
  // =============================================
  const form = document.getElementById('contact-form');
  const successMsg = document.getElementById('form-success');

  if (form) {
    form.addEventListener('submit', async function (e) {
      e.preventDefault();

      const submitBtn = form.querySelector('.form-submit');
      const originalText = submitBtn.textContent;

      submitBtn.textContent = 'Sending\u2026';
      submitBtn.disabled = true;

      try {
        const data = new FormData(form);
        const res = await fetch(form.action, {
          method:  'POST',
          body:    data,
          headers: { 'Accept': 'application/json' }
        });

        if (res.ok) {
          form.style.display = 'none';
          if (successMsg) {
            successMsg.classList.add('visible');
          }
        } else {
          const json = await res.json().catch(() => ({}));
          const msg = (json.errors || []).map(function (err) {
            return err.message;
          }).join(', ') || 'Something went wrong. Please try again.';
          submitBtn.textContent = msg;
          submitBtn.disabled = false;
        }
      } catch (err) {
        submitBtn.textContent = 'Connection error. Please try again.';
        submitBtn.disabled = false;
        // Re-enable after a few seconds so user can retry
        setTimeout(function () {
          submitBtn.textContent = originalText;
          submitBtn.disabled = false;
        }, 4000);
      }
    });
  }

});
