import { routeAuth } from "eve/channels/auth";
import { appAuth } from "../auth.ts";
import { getWorkspaceSummary } from "../services/workspace.ts";

export async function workspaceResponse(request: Request): Promise<Response> {
  const auth = await routeAuth(request, appAuth);
  if (auth instanceof Response) return auth;
  return Response.json(getWorkspaceSummary(), {
    headers: { "cache-control": "no-store" },
  });
}
