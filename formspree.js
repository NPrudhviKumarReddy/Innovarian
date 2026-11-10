/* Innovarian Formspree integration. Load after script.js on contact.html. */
(() => {
  const form = document.getElementById('leadForm');
  if (!form) return;
  const endpoint = 'https://formspree.io/f/xljbrbbk';
  const submit = form.querySelector('button[type="submit"]');
  const result = document.getElementById('formResult');
  const lastStep = form.querySelector('.form-step:last-child');
  const hint = lastStep?.querySelector('.mini');
  if (hint) hint.textContent = 'Your enquiry will be securely submitted. We will respond by email.';
  const oldNotice = form.nextElementSibling;
  if (oldNotice?.classList.contains('mini')) oldNotice.textContent = 'Your enquiry is sent directly from this page; no email application is required.';
  if (submit) submit.textContent = 'Send Project Enquiry';

  const honeypot = document.createElement('input');
  honeypot.type = 'text'; honeypot.name = '_gotcha'; honeypot.tabIndex = -1;
  honeypot.autocomplete = 'off'; honeypot.setAttribute('aria-hidden','true');
  honeypot.style.cssText = 'position:absolute;left:-9999px;opacity:0';
  form.appendChild(honeypot);

  const consent = document.createElement('label');
  consent.style.cssText = 'display:flex;gap:10px;align-items:flex-start;margin:14px 0;font-size:.85rem;line-height:1.5';
  const check = document.createElement('input');
  check.type = 'checkbox'; check.required = true; check.name = 'privacy_consent'; check.value = 'Agreed';
  check.style.marginTop = '4px';
  const consentText = document.createElement('span');
  consentText.textContent = 'I agree that Innovarian Tech Solutions may use the information provided to respond to my enquiry.';
  consent.append(check, consentText);
  submit?.before(consent);

  function message(text, success) {
    if (!result) return;
    result.classList.remove('hidden');
    result.replaceChildren();
    const p = document.createElement('p'); p.textContent = text;
    p.setAttribute('role', success ? 'status' : 'alert');
    result.appendChild(p);
    result.scrollIntoView({behavior:'smooth',block:'nearest'});
  }

  // Capture before the legacy mailto handler so it never opens the user's email app.
  form.addEventListener('submit', async (event) => {
    event.preventDefault(); event.stopImmediatePropagation();
    const name = form.elements.namedItem('name');
    const email = form.elements.namedItem('email');
    if (!String(name?.value || '').trim()) { message('Please enter your full name.',false); name?.focus(); return; }
    if (!email?.checkValidity() || !String(email.value).trim()) { message('Please enter a valid email address.',false); email?.focus(); return; }
    if (!check.checked) { message('Please agree to the enquiry privacy notice.',false); check.focus(); return; }
    if (honeypot.value) return;
    if (submit.disabled) return;
    submit.disabled = true; submit.textContent = 'Sending…';
    result?.classList.add('hidden');
    const data = new FormData(form);
    data.set('_subject', 'New Innovarian project enquiry');
    data.set('source_page', window.location.href);
    try {
      const response = await fetch(endpoint, {
        method:'POST', body:data, headers:{'Accept':'application/json'}
      });
      if (!response.ok) throw new Error('Submission was not accepted');
      message('Thank you. Your project enquiry has been submitted successfully. We will get back to you by email.',true);
      form.reset();
      if (window.gtag) window.gtag('event','generate_lead',{method:'enquiry_form'});
    } catch (_) {
      message('Your enquiry could not be confirmed. Please try again or email info@innovariantechsolutions.com.au.',false);
    } finally {
      submit.disabled = false; submit.textContent = 'Send Project Enquiry';
    }
  }, true);
})();
