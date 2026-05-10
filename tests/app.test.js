const request = require('supertest');
const app = require('../src/server');

describe('Health check', () => {
  test('GET /health → 200', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
  });
});

describe('API Contact', () => {
  test('POST /api/contact → successo con dati validi', async () => {
    const res = await request(app).post('/api/contact').send({
      name: 'Mario Rossi',
      email: 'mario@example.com',
      message: 'Ciao, vorrei maggiori informazioni.'
    });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  test('POST /api/contact → 422 se mancano campi', async () => {
    const res = await request(app).post('/api/contact').send({ name: 'Mario' });
    expect(res.status).toBe(422);
    expect(res.body.error).toBeDefined();
  });

  test('POST /api/contact → 422 con email non valida', async () => {
    const res = await request(app).post('/api/contact').send({
      name: 'Mario', email: 'non-una-email', message: 'test'
    });
    expect(res.status).toBe(422);
  });
});

describe('Static files', () => {
  test('GET / → serve index.html', async () => {
    const res = await request(app).get('/');
    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toMatch(/html/);
  });
});
