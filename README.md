# Syna React workspace

Standalone React + TypeScript + Vite frontend inspired by Personal Agent Template. Left navigation, working mock chat, and intentionally empty right workspace. No backend, API keys, credentials or environment variables.

## Run

```sh
npm ci
npm run dev
```

Node 22.12+ required (Node 24 recommended).

## Features

- Collapsible navigation and searchable chat history.
- Mock replies, typing state, stop, copy and reply styles.
- Enter to send, Shift+Enter for a new line.
- Conversations stored only in browser localStorage; clear site data to reset.
- Attachment demo records names only; never reads or uploads files.
- Empty workspace with view tabs. Global links and Vault select empty demo views.
- Resizable split: drag, arrow keys, double-click to reset.
- Mobile navigation dialog, panel tabs, light/dark and reduced motion.

Switching conversations cancels any pending mock reply. No real integrations, auth, model, database or workspace tools.

## Checks

```sh
npm run lint
npm run typecheck
npm run build
npm run test:e2e
```

Browser tests require installed Google Chrome. Screenshots go to ignored test-results/.

## Design and source

Design tokens in src/tokens.css are reused from personal-agent-template/app/assets/css/qaa-tokens.css. Layout follows its DESIGN_SYSTEM.md. Vue components were reimplemented in React. The original repository is a read-only reference and is not a dependency.

- src/App.tsx: shell, mobile drawer and resizable split.
- src/components/: Sidebar, Chat and Workspace.
- src/lib/chat.ts: browser persistence and deterministic replies.
- src/tokens.css: palette and tokens; src/App.css: layout and controls.

MIT template copyright 2026 Hugo Richard; original notice retained in LICENSE. Lucide and Inter retain their respective package licenses.
