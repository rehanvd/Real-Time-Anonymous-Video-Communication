# Real Time Anonymous Video Communication

> A random video chat app (think Omegle) built with **React + TypeScript + WebRTC**. Enter a name, click **Start Matching**, and get instantly connected to a stranger for a live peer-to-peer video call with real-time text chat.

---

## Features

- **Peer-to-peer WebRTC video** — low-latency, direct browser-to-browser
- **Random matchmaking** — paired instantly with another waiting user
- **Real-time text chat** — side panel chat while on video call
- **Skip / Find Next** — move to the next stranger at any time
- **STUN + TURN support** — works across most NAT configurations
- **Dark glassmorphism UI** — smooth animations, responsive layout

---

## Project Structure

```
src/
├── pages/
│   ├── Index.tsx            # Main app logic: WebRTC, WebSocket, state
│   └── NotFound.tsx
├── components/
│   ├── WelcomeScreen.tsx    # Name entry / landing page
│   ├── ChatRoom.tsx         # Video + chat layout
│   ├── VideoPanel.tsx       # Individual video tile (local / remote)
│   ├── SearchingOverlay.tsx # "Waiting for match" overlay
│   ├── StatusBadge.tsx      # Connection status indicator
│   ├── DisconnectedCard.tsx # Shown when peer leaves
│   ├── BackgroundEffects.tsx
│   └── ui/                  # shadcn/ui component library
├── hooks/
│   └── use-toast.ts
├── lib/
│   └── utils.ts
├── index.css                # Tailwind + CSS variables (dark theme)
└── App.tsx                  # Router + providers
```

---

## Prerequisites

| Tool | Version |
|------|---------|
| Node.js | 18+ |
| npm / bun | latest |
| Backend services | Running (see Backend Setup below) |

---

## Quick Start

### 1. Clone and install dependencies

```bash
git clone https://github.com/rehanvd/Real-Time-Anonymous-Video-Communication.git
cd Real-Time-Anonymous-Video-Communication
npm install
# or
bun install
```

### 2. Configure environment

Copy the example env file and point it at your backend:

```bash
cp .env.example .env
```

Edit `.env`:

```env
# HTTP base URL for the Matching Service REST endpoint
VITE_MATCHING_SERVICE_URL=http://localhost:8000

# WebSocket base URL for the Matching Service
VITE_MATCHING_WS_URL=ws://localhost:8000

# WebSocket base URL for the Signalling Service
VITE_SIGNALLING_WS_URL=ws://localhost:8001
```

> **Note:** If you skip this step, the app falls back to `localhost:8000` / `localhost:8001` automatically.

### 3. Start the dev server

```bash
npm run dev
```

Open **http://localhost:8080** in your browser.

---

## Backend Setup

This frontend requires two backend microservices from the `random-video-chat` repo. The fastest way is Docker:

```bash
# In the random-video-chat/ directory
docker compose up --build
```

This starts:
- **Matching Service** → `http://localhost:8000`
- **Signalling Service** → `http://localhost:8001`
- **Redis** (internal)

---

## How It Works

```
Browser (You)                    Backend                   Browser (Stranger)
     │                               │                               │
     │── POST /registerForMatching ──▶│◀── POST + WS ─────────────────│
     │── WS /ws/{name} ─────────────▶│                               │
     │                               │                               │
     │◀──────── matched event ────────│──────── matched event ────────▶│
     │                               │                               │
     │─── WebRTC offer ──────────────────────────────────────────────▶│
     │◀─────────────────────── WebRTC answer + ICE ──────────────────│
     │                                                               │
     │◀════════════════ Peer-to-peer video call ════════════════════▶│
```

1. You register → Matching Service pairs you with another waiting user → sends `matched` event
2. Both browsers connect to the Signalling Service and exchange WebRTC offer/answer/ICE
3. A direct P2P video call is established — chat messages relay via the Matching Service WebSocket

---

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server on port 8080 with HMR |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint |

---

## Deploying

Build the static site:

```bash
npm run build
```

Deploy the `dist/` folder to any static host (Vercel, Netlify, Nginx, etc.).

For production with HTTPS, update env vars to use `https://` and `wss://`:

```env
VITE_MATCHING_SERVICE_URL=https://your-matching-service.com
VITE_MATCHING_WS_URL=wss://your-matching-service.com
VITE_SIGNALLING_WS_URL=wss://your-signalling-service.com
```

---

## Camera & Microphone

The app requests camera and microphone access **only after a match is found** — not on page load. Your browser will prompt for permission at that point.

---

## Tech Stack

| Layer | Library |
|-------|---------|
| UI framework | React 18 + TypeScript |
| Build tool | Vite + SWC |
| Styling | Tailwind CSS v3 + CSS variables |
| UI components | shadcn/ui (Radix primitives) |
| WebRTC | simple-peer-light |
| Routing | React Router v6 |
| Fonts | DM Sans + Space Grotesk |

---

## License
MIT License

---

## Contributing
Pull requests are welcome.  
Feel free to open issues for bugs or feature requests.
