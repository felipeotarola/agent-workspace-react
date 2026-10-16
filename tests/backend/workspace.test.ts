import { test } from "node:test";
import assert from "node:assert/strict";
import { workspaceResponse } from "../../server/http/workspace.ts";
import { workspaceSummarySchema } from "../../shared/workspace.ts";

async function withRuntime(development: boolean, action: () => Promise<void>) {
  const before = { ...process.env };
  delete process.env.VERCEL;
  delete process.env.VERCEL_ENV;
  delete process.env.EVE_DEV;
  if (development) process.env.EVE_DEV = "1";
  try { await action(); }
  finally {
    for (const key of Object.keys(process.env)) if (!(key in before)) delete process.env[key];
    Object.assign(process.env, before);
  }
}

test("local workspace API returns the typed service contract without claiming access to browser files", async () => {
  await withRuntime(true, async () => {
    const response = await workspaceResponse(new Request("http://localhost/api/workspace"));
    assert.equal(response.status, 200);
    const workspace = workspaceSummarySchema.parse(await response.json());
    assert.equal(workspace.capabilities.serverFiles, false);
    assert.equal(response.headers.get("cache-control"), "no-store");
  });
});

test("production API rejects callers, even when they spoof development or user headers", async () => {
  await withRuntime(false, async () => {
    const response = await workspaceResponse(new Request("https://example.test/api/workspace", {
      headers: { "x-user-id": "owner", "x-eve-dev": "1", "EVE_DEV": "1" },
    }));
    assert.equal(response.status, 401);
    assert.equal(response.headers.get("cache-control"), "no-store");
  });
});
