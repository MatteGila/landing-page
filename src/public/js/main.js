// ─── Form di contatto ─────────────────────────────────────────
const form       = document.getElementById('contactForm');
const submitBtn  = document.getElementById('submitBtn');
const feedback   = document.getElementById('formFeedback');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const name    = document.getElementById('name').value.trim();
  const email   = document.getElementById('email').value.trim();
  const message = document.getElementById('message').value.trim();

  // Reset feedback
  feedback.textContent = '';
  feedback.className = 'form__feedback';

  // Stato caricamento
  submitBtn.disabled = true;
  submitBtn.textContent = 'Invio in corso...';

  try {
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, message })
    });

    const data = await res.json();

    if (res.ok) {
      feedback.textContent = data.message;
      feedback.classList.add('success');
      form.reset();
    } else {
      feedback.textContent = data.error || 'Qualcosa è andato storto.';
      feedback.classList.add('error');
    }
  } catch (err) {
    feedback.textContent = 'Errore di rete. Riprova più tardi.';
    feedback.classList.add('error');
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = 'Invia messaggio →';
  }
});

// ─── Navbar scroll effect ──────────────────────────────────────
const nav = document.querySelector('.nav');
window.addEventListener('scroll', () => {
  nav.style.boxShadow = window.scrollY > 20
    ? '0 1px 40px rgba(0,0,0,0.4)'
    : 'none';
});

// ─── Animazione elementi al scroll ────────────────────────────
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.card, .step, .tech').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(20px)';
  el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  observer.observe(el);
});
