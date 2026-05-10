# 🚀 Landing App — Node.js + Docker

Landing page con backend Node.js, pensata per imparare Docker e la containerizzazione.

## Struttura

```
landing-app/
├── src/
│   ├── server.js            # Express server
│   └── public/
│       ├── index.html       # Landing page
│       ├── css/style.css
│       └── js/main.js
├── tests/
│   └── app.test.js
├── Dockerfile               # Multi-stage build
├── docker-compose.yml       # Sviluppo locale
└── .env.example
```

## 1. Avvio senza Docker (sviluppo rapido)

```bash
npm install
cp .env.example .env
npm run dev
# → http://localhost:3000
```

## 2. Avvio con Docker Compose (consigliato)

```bash
docker compose up
# → http://localhost:3000
# Le modifiche a src/ si riflettono subito (hot reload)
```

## 3. Build immagine di produzione

```bash
# Build (esegue anche i test automaticamente)
docker build -t landing-app .

# Controlla la dimensione
docker images landing-app

# Avvia il container
docker run -p 3000:3000 landing-app

# Verifica il health check
curl http://localhost:3000/health
```

## 4. Comandi Docker utili

```bash
# Vedi i container in esecuzione
docker ps

# Log in tempo reale
docker logs -f <container_id>

# Entra dentro il container
docker exec -it <container_id> sh

# Ferma e rimuovi tutto
docker compose down
```

## 5. Test

```bash
npm test
```

## API

| Metodo | Endpoint       | Descrizione         |
|--------|----------------|---------------------|
| GET    | /              | Landing page        |
| GET    | /health        | Health check        |
| POST   | /api/contact   | Form di contatto    |

### Esempio chiamata API

```bash
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"Mario","email":"mario@test.com","message":"Ciao!"}'
```

## Prossimi passi

- [ ] Pubblica l'immagine su GitHub Container Registry
- [ ] Aggiungi la pipeline CI/CD con GitHub Actions
- [ ] Deploya su Kubernetes con minikube
