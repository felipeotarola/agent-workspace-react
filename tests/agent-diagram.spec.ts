import { test, expect } from "@playwright/test";

test("agent diagram renders, supports dragging and themes, and integrations stay unchanged", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  await expect(page.getByText("Demo", { exact: true })).toHaveCount(0);
  await expect(page.getByText("Mock", { exact: true })).toHaveCount(0);
  await page
    .locator(".desktop-sidebar")
    .getByRole("button", { name: "Agenten", exact: true })
    .click();
  await expect(page.getByRole("heading", { name: "Agentflöde" })).toBeVisible();
  const nodes = page.locator(".react-flow__node");
  await expect(nodes).toHaveCount(3);
  await expect(page.locator(".react-flow__edge")).toHaveCount(2);
  await expect(
    page.getByRole("button", { name: "Dölj workspace", exact: true }),
  ).toHaveCount(0);
  const first = nodes.filter({ hasText: "Meddelande" });
  const before = await first.getAttribute("style");
  const box = await first.boundingBox();
  if (!box) throw new Error("Node not rendered");
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2 + 35, {
    steps: 6,
  });
  await page.mouse.up();
  await expect(first).not.toHaveAttribute("style", before!);
  await page.getByRole("button", { name: "Anpassa diagram" }).click();
  await page.screenshot({
    path: "test-results/agent-diagram-light.png",
    fullPage: true,
  });
  await page.getByRole("button", { name: "Byt färgtema", exact: true }).click();
  await expect(page.locator(".agent-diagram .react-flow")).toHaveClass(/dark/);
  await page.screenshot({
    path: "test-results/agent-diagram-dark.png",
    fullPage: true,
  });
  await page
    .locator(".desktop-sidebar")
    .getByRole("button", { name: "Integrationer", exact: true })
    .click();
  for (const name of ["GitHub", "Slack", "Linear"])
    await expect(
      page.getByRole("heading", { name, exact: true }),
    ).toBeVisible();
  await expect(page.getByText("Ej ansluten", { exact: true })).toHaveCount(3);
  await expect(page.locator(".demo-badge, .model-demo")).toHaveCount(0);
  expect(errors).toEqual([]);
});

test("agent diagram fits a narrow mobile screen", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page
    .getByRole("button", { name: "Öppna navigation", exact: true })
    .click();
  await page
    .getByRole("dialog")
    .getByRole("button", { name: "Agenten", exact: true })
    .click();
  await expect(page.locator(".react-flow__node")).toHaveCount(3);
  await expect(
    page.locator(".react-flow__node").filter({ hasText: "Svar" }),
  ).toBeInViewport();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.screenshot({
    path: "test-results/agent-diagram-mobile.png",
    fullPage: true,
  });
});
