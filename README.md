# Agent Workspace

React + TypeScript + Vite workspace with an Eve agent backend. The original Personal Agent Template repository is a read-only reference, not a dependency.

## Run locally

Requires Node.js 24 and npm.

```sh
npm ci
# Copy .env.example to .env and set AI_GATEWAY_API_KEY for real model replies.
npm run dev
```

Open http://localhost:5173. This starts Vite on 5173 and Eve on 2001, bound to loopback. Vite forwards `/eve`, `/api`, and `/.well-known/workflow` to Eve. No shared database or source-project credentials are used.

If the system Node is older, a temporary Node 24 runtime can start both services:

```sh
npx --package=node@24 node scripts/dev.mjs
```

Change the model in `shared/agent-config.ts` and behavior in `agent/instructions.md`. Credentials stay on the server. The current model is the Eve scaffold default. Real inference needs a working model connection; an unavailable model displays an error and never silently returns a mock answer.

For UI design without the backend, set `VITE_AGENT_MODE=mock` in `.env.local`, then run `npm run dev:ui`. Mock and real chat indexes use separate browser storage keys.

## Architecture

- `src/`: React shell, components, and agent UI adapter.
- `agent/`: Eve configuration, instructions, HTTP channels, and typed tools.
- `server/`: application services, route handlers, and shared route-auth policy.
- `shared/`: runtime-validated contracts and model choice.

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for boundaries, persistence, and how to extend the template.

## Current scope

- Live Eve client: streamed replies, tool activity, cancellation, and session replay after refresh or thread navigation.
- Eve owns durable session history. The browser caches a thread index, session IDs, and displayed text. There is no cross-device thread catalog yet.
- One personal workspace. `GET /api/workspace` and `get_workspace` share the same application service.
- Workspace file selection and drag-and-drop remain browser-local. File contents are not sent to the backend or model. Chat attachments currently send filenames only.
- Integration cards and the agent diagram remain UI previews.
- Shared design system, light/dark themes, collapsible panels, drag resizing, and mobile navigation.
- App and agent APIs permit local development. Production requests are rejected until application authentication is implemented. This is a local backend foundation, not a production deployment.

## Checks

```sh
npm run lint
npm run typecheck
npm run test:unit
npm run test:e2e
npm run test:agent
npm run build
```

Typechecking covers frontend, agent, server, and shared code. Browser tests run an isolated mock UI on port 5174; they do not prove live model inference. They require Google Chrome. `test:agent` checks the real local runtime; set `EVE_TEST_UNCONFIGURED=1` only against an unconfigured runtime to include missing-model, replay, and cancellation checks. `build` builds `dist/` for the UI and `.output/` for the Eve Node server. These are peer services: production hosting must serve the UI assets and forward backend routes. `vite preview` alone does not run the agent.

Eve runtime state, build artifacts, screenshots, and local credentials are ignored by Git. Dependency audit currently reports a moderate advisory in the sandbox's transitive `sprintf-js` dependency; sandbox shell tools are disabled. The vulnerable `undici` transitive version is overridden with a patched release.

## Design and source

The local Soft Orbit design system has shared tokens, controls, surfaces and semantic typography (Manrope headings / Inter UI and reading). Open **Designsystem** in the navigation or visit `/?view=design-system` to try components, themes, forms and dialogs. See [docs/DESIGN_SYSTEM.md](docs/DESIGN_SYSTEM.md) for component contracts and type roles.

Design tokens in src/tokens.css are reused from personal-agent-template/app/assets/css/qaa-tokens.css. Layout follows its DESIGN_SYSTEM.md. Vue components were reimplemented in React. The original repository is a read-only reference and is not a dependency.

The panel interaction is an original implementation visually informed by [React Bits App Sidebar 1](https://pro.reactbits.dev/docs/app-ui/app-sidebar/app-sidebar-1) and [App Sidebar 2](https://pro.reactbits.dev/docs/app-ui/app-sidebar/app-sidebar-2). No React Bits Pro source code is included. The workspace reaches the top of the desktop viewport. Both panel edges share `PanelRail` and the same 420ms easing, with reduced-motion support and focus transfer. Mobile navigation uses a native modal dialog with entry/exit transitions.

- src/App.tsx: shell, mobile drawer and resizable split.
- src/components/: Sidebar, Chat and Workspace.
- src/lib/chat.ts: thread index and browser cache.
- src/lib/agent/: Eve adapter and explicit mock adapter.
- src/tokens.css: palette and tokens; src/App.css: layout and controls.

MIT template copyright 2026 Hugo Richard; original notice retained in LICENSE. Lucide and Inter retain their respective package licenses.
