# Agent Workspace

Standalone React + TypeScript + Vite frontend inspired by Personal Agent Template. Left navigation, working mock chat, and intentionally empty right workspace. No backend, API keys, credentials or environment variables.

## Run

```sh
npm ci
npm run dev
```

Node 22.12+ required (Node 24 recommended).

## Features

- Grouped navigation that smoothly collapses into a 64px icon rail, with searchable chat history.
- Mock replies, typing state, stop, copy and reply styles.
- Enter to send, Shift+Enter for a new line.
- Conversations stored only in browser localStorage; clear site data to reset.
- Attachment demo records names only; never reads or uploads files.
- Empty workspace with only Overview. Agent and Integrations are separate full-width demo pages without a right panel.
- Resizable split: drag the handle all the way to the rail to close, drag it out to reopen, arrow keys, Enter to toggle, double-click to reset. Workspace closes smoothly to a visible icon rail; shortcuts reopen the selected view. Chat drafts and split width survive panel changes.
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

The panel interaction is an original implementation visually informed by [React Bits App Sidebar 1](https://pro.reactbits.dev/docs/app-ui/app-sidebar/app-sidebar-1) and [App Sidebar 2](https://pro.reactbits.dev/docs/app-ui/app-sidebar/app-sidebar-2). No React Bits Pro source code is included. The workspace reaches the top of the desktop viewport. Both panel edges share `PanelRail` and the same 420ms easing, with reduced-motion support and focus transfer. Mobile navigation uses a native modal dialog with entry/exit transitions.

- src/App.tsx: shell, mobile drawer and resizable split.
- src/components/: Sidebar, Chat and Workspace.
- src/lib/chat.ts: browser persistence and deterministic replies.
- src/tokens.css: palette and tokens; src/App.css: layout and controls.

MIT template copyright 2026 Hugo Richard; original notice retained in LICENSE. Lucide and Inter retain their respective package licenses.
