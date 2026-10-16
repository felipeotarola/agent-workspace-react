import { test, expect } from "@playwright/test";

test("real Eve server: health, authenticated workspace contract, and idle session acceptance", async ({ request }) => {
  const health = await request.get("/eve/v1/health");
  expect(health.ok()).toBe(true);
  expect(await health.json()).toMatchObject({ ok: true, status: "ready" });
  const workspace = await request.get("/api/workspace");
  expect(workspace.ok()).toBe(true);
  expect(await workspace.json()).toMatchObject({ id: "personal", capabilities: { serverFiles: false } });
  const session = await request.post("/eve/v1/session", { data: {} });
  expect(session.ok()).toBe(true);
  expect(await session.json()).toMatchObject({ ok: true, sessionId: expect.any(String) });
});

test("unconfigured model: visible failure, durable replay, and cancellation", async ({ page }) => {
  test.skip(process.env.EVE_TEST_UNCONFIGURED !== "1", "Explicit opt-in: requires a local runtime without model credentials.");
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  await page.getByRole("textbox", { name: "Ditt meddelande" }).fill("Test av agentkopplingen");
  await page.getByRole("button", { name: "Skicka meddelande" }).click();
  await expect(page.getByRole("alert")).toContainText("AI_GATEWAY_API_KEY", { timeout: 30_000 });
  await page.reload();
  await expect(page.getByRole("article", { name: "Du", exact: true })).toContainText("Test av agentkopplingen");
  await expect(page.getByRole("textbox", { name: "Ditt meddelande" })).toBeEnabled();
  await page.getByRole("textbox", { name: "Ditt meddelande" }).fill("Avbryt detta");
  await page.getByRole("button", { name: "Skicka meddelande" }).click();
  await page.getByRole("button", { name: "Stoppa svar" }).click();
  await expect(page.getByRole("button", { name: "Skicka meddelande" })).toBeVisible({ timeout: 15_000 });
  expect(errors).toEqual([]);
});
