import { test, expect } from "@playwright/test";

test("panels animate into rails, preserve chat drafts and restore keyboard focus", async ({
  page,
}) => {
  await page.goto("/");
  const chat = page.getByRole("textbox", { name: "Ditt meddelande" });
  const workspace = page.locator(".workspace-pane");
  await chat.fill("Mitt oskickade utkast");
  await page.getByRole("separator").focus();
  await page.keyboard.press("ArrowRight");
  await expect(page.getByRole("separator")).toHaveAttribute(
    "aria-valuenow",
    "50",
  );
  const initialWidth = await workspace.evaluate(
    (el) => el.getBoundingClientRect().width,
  );
  await page
    .getByRole("button", { name: "Dölj workspace", exact: true })
    .click();
  const closingWidth = await workspace.evaluate(
    (el) => el.getBoundingClientRect().width,
  );
  expect(closingWidth).toBeGreaterThan(64);
  expect(closingWidth).toBeLessThanOrEqual(initialWidth);
  await expect(
    page.getByRole("button", { name: "Visa workspace", exact: true }),
  ).toBeFocused();
  await expect
    .poll(() =>
      workspace.evaluate((el) => Math.round(el.getBoundingClientRect().width)),
    )
    .toBe(64);
  await expect(page.locator(".workspace-expanded")).toHaveAttribute(
    "inert",
    "",
  );
  await expect(
    page.getByRole("navigation", { name: "Workspace-vyer" }),
  ).toHaveCount(0);
  await page
    .getByRole("button", { name: "Dölj navigation", exact: true })
    .click();
  await expect(
    page.getByRole("button", { name: "Visa navigation", exact: true }),
  ).toBeFocused();
  await expect
    .poll(() =>
      page
        .locator(".desktop-sidebar")
        .evaluate((el) => Math.round(el.getBoundingClientRect().width)),
    )
    .toBe(64);
  await expect(chat).toHaveValue("Mitt oskickade utkast");
  await page.screenshot({
    path: "test-results/both-rails-light.png",
    fullPage: true,
  });
  await page.getByRole("button", { name: "Byt färgtema", exact: true }).click();
  await page.screenshot({
    path: "test-results/both-rails-dark.png",
    fullPage: true,
  });
  await page
    .getByRole("button", { name: "Visa navigation", exact: true })
    .click();
  await expect(
    page.getByRole("button", { name: "Dölj navigation", exact: true }),
  ).toBeFocused();
  await page
    .getByRole("button", { name: "Öppna workspace", exact: true })
    .click();
  await expect(
    page
      .getByRole("navigation", { name: "Workspace-vyer" })
      .getByRole("button", { name: "Översikt", exact: true }),
  ).toBeFocused();
  await expect(page.getByRole("separator")).toHaveAttribute(
    "aria-valuenow",
    "50",
  );
  await expect(chat).toHaveValue("Mitt oskickade utkast");
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});

test("workspace rail shortcuts reopen selected view, including on narrow mobile", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 740 });
  await page.goto("/");
  await page.getByRole("button", { name: "Workspace", exact: true }).click();
  await page
    .getByRole("button", { name: "Dölj workspace", exact: true })
    .click();
  await expect(
    page.getByRole("textbox", { name: "Ditt meddelande" }),
  ).toBeVisible();
  await expect
    .poll(() =>
      page
        .locator(".workspace-pane")
        .evaluate((el) => Math.round(el.getBoundingClientRect().width)),
    )
    .toBe(56);
  await page.screenshot({
    path: "test-results/mobile-rail.png",
    fullPage: true,
  });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  const rail = page.getByRole("navigation", { name: "Kompakt workspace" });
  await rail.getByRole("button", { name: "Översikt", exact: true }).click();
  await expect(page.getByLabel("Översikt – tom arbetsyta")).toBeVisible();
  await expect(page.locator(".workspace-canvas")).toBeEmpty();
});

test("reduced motion disables both panel width animations", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page
    .getByRole("button", { name: "Dölj navigation", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Dölj workspace", exact: true })
    .click();
  expect(
    await page
      .locator(".app-shell")
      .evaluate((el) => getComputedStyle(el).transitionDuration),
  ).toBe("0s");
  expect(
    await page
      .locator(".workspace-pane")
      .evaluate((el) => getComputedStyle(el).transitionDuration),
  ).toBe("0s");
  await expect(
    page.getByRole("button", { name: "Öppna workspace", exact: true }),
  ).toBeVisible();
});
