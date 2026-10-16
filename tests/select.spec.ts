import { test, expect } from "@playwright/test";

test("shared dropdown has styled options, keyboard selection and focus return", async ({
  page,
}) => {
  await page.goto("/?view=design-system");
  const select = page.getByRole("combobox", { name: "Svarsstil", exact: true });
  await select.click();
  const list = page.getByRole("listbox");
  await expect(list).toBeVisible();
  await expect(page.getByRole("option")).toHaveCount(3);
  await expect(page.getByRole("option", { name: /Utförligt/ })).toContainText(
    "Mer sammanhang",
  );
  await page.screenshot({
    path: "test-results/select-light.png",
    fullPage: true,
    animations: "disabled",
  });
  await page.keyboard.press("End");
  await page.keyboard.press("Enter");
  await expect(select).toContainText("Utförligt");
  await expect(select).toBeFocused();
  await expect(list).not.toBeVisible();
  await page.getByRole("switch", { name: "Mörkt läge" }).click();
  await select.click();
  await expect(page.getByRole("option", { name: /Utförligt/ })).toHaveAttribute(
    "aria-selected",
    "true",
  );
  await page.screenshot({
    path: "test-results/select-dark.png",
    fullPage: true,
    animations: "disabled",
  });
  await page.keyboard.press("Escape");
  await expect(select).toBeFocused();
});

test("chat selection updates replies and dropdown works inside mobile navigation dialog", async ({
  page,
}) => {
  await page.goto("/");
  const select = page.getByRole("combobox", { name: "Svarsstil", exact: true });
  await select.click();
  await page.getByRole("option", { name: /Kortfattat/ }).click();
  await page.getByRole("textbox", { name: "Ditt meddelande" }).fill("Hej");
  await page.getByRole("button", { name: "Skicka meddelande" }).click();
  await expect(
    page.getByRole("article", { name: "Agent Workspace", exact: true }),
  ).toContainText("Det här är ett simulerat svar.");
  await page.setViewportSize({ width: 390, height: 844 });
  await page
    .getByRole("button", { name: "Öppna navigation", exact: true })
    .click();
  const dialog = page.getByRole("dialog");
  const workspaceSelect = dialog.getByRole("combobox", {
    name: "Välj workspace",
  });
  await workspaceSelect.click();
  await expect(
    dialog.getByRole("option", { name: /Min workspace/ }),
  ).toBeVisible();
  await page.getByRole("option", { name: /Min workspace/ }).click();
  await expect(workspaceSelect).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(dialog).not.toBeVisible();
});
