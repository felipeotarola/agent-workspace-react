import { test, expect } from "@playwright/test";

test("workspace accepts file selection and drops, deduplicates and keeps the list through navigation", async ({
  page,
}) => {
  await page.goto("/");
  await page
    .getByLabel("Lägg till filer i workspace", { exact: true })
    .setInputFiles({
      name: "Anteckningar.txt",
      mimeType: "text/plain",
      buffer: Buffer.from("En testfil"),
    });
  const list = page.getByRole("list", { name: "Tillagda filer" });
  await expect(
    list.getByText("Anteckningar.txt", { exact: true }),
  ).toBeVisible();
  const transfer = await page.evaluateHandle(() => {
    const data = new DataTransfer();
    data.items.add(
      new File(["underlag"], "Projekt.pdf", {
        type: "application/pdf",
        lastModified: 1234,
      }),
    );
    return data;
  });
  const dropzone = page.getByRole("button", {
    name: "Välj filer till workspace",
  });
  await dropzone.dispatchEvent("dragenter", { dataTransfer: transfer });
  await expect(dropzone).toHaveClass(/is-dragging/);
  await dropzone.dispatchEvent("drop", { dataTransfer: transfer });
  await expect(list.getByRole("listitem")).toHaveCount(2);
  await dropzone.dispatchEvent("drop", { dataTransfer: transfer });
  await expect(list.getByRole("listitem")).toHaveCount(2);
  await page
    .getByRole("button", { name: "Dölj workspace", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Visa workspace", exact: true })
    .click();
  await page
    .locator(".desktop-sidebar")
    .getByRole("button", { name: "Agenten", exact: true })
    .click();
  await page
    .locator(".desktop-sidebar")
    .getByRole("button", { name: "Översikt", exact: true })
    .click();
  await expect(list.getByRole("listitem")).toHaveCount(2);
  await page.screenshot({
    path: "test-results/workspace-files.png",
    fullPage: true,
    animations: "disabled",
  });
  await page
    .getByRole("button", { name: "Ta bort Projekt.pdf", exact: true })
    .click();
  await expect(list.getByRole("listitem")).toHaveCount(1);
  await transfer.dispose();
});

test("mobile file field opens the picker and fits the workspace pane", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.getByRole("button", { name: "Workspace", exact: true }).click();
  const chooserPromise = page.waitForEvent("filechooser");
  await page.getByRole("button", { name: "Välj filer till workspace" }).click();
  const chooser = await chooserPromise;
  await chooser.setFiles({
    name: "En lång fil med mellanslag och svenska tecken åäö.txt",
    mimeType: "text/plain",
    buffer: Buffer.from("test"),
  });
  await expect(
    page.getByRole("list", { name: "Tillagda filer" }).getByRole("listitem"),
  ).toHaveCount(1);
  expect(
    await page
      .locator(".workspace-canvas")
      .evaluate((el) => el.scrollWidth <= el.clientWidth),
  ).toBe(true);
  await page.screenshot({
    path: "test-results/workspace-files-mobile.png",
    fullPage: true,
    animations: "disabled",
  });
});
