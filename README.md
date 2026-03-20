# AI Chat Platform

Modern AI chat platform with Cloudflare Workers backend.

## Structure

```
complete-ai-webapp/
├── index.html              # Gateway → apps/web redirect
├── apps/web/             # Frontend (SPA)
│   ├── index.html
│   ├── main.js
│   └── styles/
├── worker/               # Cloudflare Worker
│   └── worker.js
├── infra/                # Deployment config
└── package.json
```

## Features

- 🎨 Modern Black & Gray theme
- 📱 Mobile responsive design
- 🌙 Dark/Light theme toggle
- 💬 Real-time chat interface
- ⚡ Cloudflare Workers backend

## Quick Start

### Frontend
Open `index.html` in browser or serve with static server.

### Deploy Worker

```bash
npm install
wrangler secret put ONE_HANDS_API
npm run deploy
```

## Theme

Modern black and gray color scheme with smooth transitions.
