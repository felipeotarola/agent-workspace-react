# Agent Workspace architecture

## First working slice

The existing React/Vite frontend stays in place. Eve 0.80.1 provides the agent backend, HTTP session protocol, event streaming, and durable execution. There is no second handwritten agent loop or message-stream parser.

```text
React Chat
  → src/lib/agent/useLiveAgent.ts (eve/react)
  → same-origin /eve/v1/* (Vite proxy locally)
  → agent/channels/eve.ts (route authentication)
  → Eve session + agent/instructions.md + agent/agent.ts
  → agent/tools/get_workspace.ts
  → server/services/workspace.ts

/api/workspace
  → agent/channels/workspace.ts (HTTP transport)
  → server/http/workspace.ts (authentication and response)
  → server/services/workspace.ts (same application logic)
```

## Boundaries

| Layer | Owns | Avoid |
| --- | --- | --- |
| React | Rendering, drafts, navigation, session attachment | Provider credentials, database queries, agent loops |
| Agent | Instructions, model choice, tool schemas and tool orchestration | Duplicating application rules in prompts |
| HTTP handlers | Authentication, request validation, response shape | Business logic inside route definitions |
| Application services | Workspace capabilities and future product operations | React imports and transport assumptions |
| Shared contracts | Zod schemas and transport-neutral types | Secrets and server I/O |

`get_workspace` is intentionally read-only and exposes only the current workspace's name and capabilities. Optional Eve default tools and the root delegation tool are disabled. No external integrations, shell tool, or write operations are enabled. The local sandbox uses just-bash for portable runtime initialization, without Docker.

## Session lifecycle

Each app thread stores an optional Eve session ID. Switching threads remounts the keyed chat client. A saved session is replayed from cursor zero; Eve deduplicates events and restores authoritative history. The local text cache is for display while reconnecting, not the model's source of history.

The client blocks sends during replay, streams assistant text, displays active tool labels, and sends durable cancellation when Stop is pressed. Switching views disconnects the browser stream without cancelling work; returning reattaches. Starting a new chat starts a separate Eve session. UI mock mode is explicit and uses a separate localStorage key. API failures never select it automatically.

Eve's local workflow world writes under `.eve/.workflow-data`. It is independent of any database in Personal Agent Template. Development restart recovery follows Eve's lifecycle: use `eve dev --resume` when explicitly recovering retained runs. Production requires persistent workflow storage and a separate database-backed thread catalog if users need cross-device discovery.

## Identity and storage

The initial app is one local personal workspace. Both APIs share `server/auth.ts`: local development is admitted, while production has a rejecting placeholder. No caller-supplied user/workspace ID grants access. Add the real app-session verifier here before multi-user use, then pass its principal into scoped repositories and check resource ownership inside services and tools.

Workspace files remain browser-local. The backend cannot list or read them. Add a file repository/storage adapter and a validated upload route when file ingestion is implemented; both the UI and agent tools should use the same scoped service. Do not teach the agent that filenames imply access to contents.

## Adapting the template

1. Change the instructions and model in code.
2. Add a feature service under `server/services/` with explicit inputs and outputs.
3. Define its shared schema in `shared/` when it crosses a boundary.
4. Expose a thin HTTP route for the UI and a typed Eve tool for the agent.
5. Introduce a repository only when that feature needs real persistence; keep storage dependencies behind the service.
6. Put external integrations under `agent/connections/` when there is a concrete integration to connect.

No configuration screens, plugin registry, generic provider factory, or speculative database layer are necessary for this first slice.

## Development and deployment

`npm run dev` starts two loopback services under Node 24. The Vite watcher ignores Eve's generated directories to avoid rebuild loops and Windows directory locks. `npm run build` builds both peers. Serve `dist/` as the web app and forward `/api/`, `/eve/`, and `/.well-known/workflow/` to the Eve Node service in a future deployment; the latter prefix is required for workflow callbacks. Do not publish `vite preview` as the backend.

Credentials belong in `.env` or the host's server environment. `.env.example` is the only tracked environment file. No credentials, database connections, or runtime stores are copied from the source Nuxt project.

## Verification limits

- Unit tests cover the shared workspace response contract and rejection of production callers, including spoofed development headers.
- Existing Playwright tests run UI-only mock mode on a separate port.
- The local real runtime was checked for health, workspace API, session acceptance, event replay, cancellation, and error rendering.
- A valid model connection is still required to verify actual AI generation and model-selected tool use. File ingestion, production auth, cross-device thread storage, and deployment are not part of this slice.
