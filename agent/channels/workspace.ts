import { defineChannel, GET } from "eve/channels";
import { workspaceResponse } from "../../server/http/workspace.ts";

// Thin HTTP transport. The application service is shared with agent tools.
export default defineChannel({
  routes: [GET("/api/workspace", workspaceResponse)],
});
