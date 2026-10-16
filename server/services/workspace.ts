import type { WorkspaceSummary } from "../../shared/workspace.ts";

// The single-workspace starting point. Add scoped repositories here when the
// product needs database-backed workspaces; keep storage out of UI and tools.
export function getWorkspaceSummary(): WorkspaceSummary {
  return {
    id: "personal",
    name: "Min workspace",
    capabilities: { chat: true, serverFiles: false },
  };
}
