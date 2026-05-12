require('dotenv').config();
const express = require('express');
const helmet  = require('helmet');
const morgan  = require('morgan');
const compression = require('compression');
const path = require('path');

const app  = express();
const PORT = process.env.PORT || 3000;

// ─── Middleware ────────────────────────────────────────────────
app.use(helmet({ contentSecurityPolicy: false }));
app.use(compression());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ─── API Routes ───────────────────────────────────────────────

// Contatto — simula invio form
app.post('/api/contact', (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(422).json({ error: 'Tutti i campi sono obbligatori.' });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(422).json({ error: 'Email non valida.' });
  }

  console.log(`📩 Nuovo messaggio da ${name} <${email}>`);

  // Qui integreresti un servizio email reale (SendGrid, Resend, ecc.)
  res.json({ success: true, message: `Grazie ${name}, ti risponderemo presto!` });
});

// Health check per Docker/Kubernetes
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    uptime: Math.floor(process.uptime()),
    timestamp: new Date().toISOString()
  });
});

// Fallback → serve sempre index.html (SPA-friendly)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ─── Avvio ────────────────────────────────────────────────────
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server in ascolto su http://localhost:${PORT}`);
  console.log(`   Ambiente: ${process.env.NODE_ENV || 'development'}`);
});
pp.get('/health', (req, res) => {
  res.status(200).send('OK');
});
// Graceful shutdown (importante per Docker/K8s)
const shutdown = (sig) => {
  console.log(`\n⚠️  ${sig} ricevuto — shutdown in corso...`);
  server.close(() => {
    console.log('✅ Server chiuso correttamente');
    process.exit(0);
  });
};
process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT',  () => shutdown('SIGINT'));

module.exports = app;
