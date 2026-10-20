import { expect, test } from "@playwright/test";
test("visitors can navigate, search projects, and switch theme", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator(".wordmark")).toContainText("Ronald.");
  await expect(
    page.getByRole("heading", {
      name: /building practical things for people/i,
    }),
  ).toBeVisible();
  const initialTheme = await page.locator("html").getAttribute("data-theme");
  const expectedTheme = initialTheme === "light" ? "dark" : "light";
  await page
    .getByRole("button", { name: /Switch to (light|dark) mode/ })
    .click();
  await expect(page.locator("html")).toHaveAttribute(
    "data-theme",
    expectedTheme,
  );
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute(
    "data-theme",
    expectedTheme,
  );
  await page.getByRole("link", { name: "Projects", exact: true }).click();
  await expect(page).toHaveURL(/#\/projects$/);
  await page
    .getByRole("searchbox", { name: "Search projects" })
    .fill("MongoDB");
  await expect(page.getByText("Showing 1 of 3 projects")).toBeVisible();
  await page.getByRole("link", { name: "Case study", exact: true }).click();
  await expect(page).toHaveURL(/#\/projects\/devblog$/);
  await expect(
    page.getByRole("heading", {
      name: "DevBlog — Developer Publishing Platform",
    }),
  ).toBeVisible();
});
test("mobile navigation opens and closes after route selection", async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/");
  const menuToggle = page.locator(".menu-toggle");
  await menuToggle.click();
  await expect(menuToggle).toHaveAttribute("aria-expanded", "true");
  await page
    .getByRole("navigation", { name: "Primary navigation" })
    .getByRole("link", { name: "Contact" })
    .click();
  await expect(page).toHaveURL(/#\/contact$/);
  await expect(menuToggle).toHaveAttribute("aria-expanded", "false");
});
test("unknown direct routes show a custom not-found page", async ({ page }) => {
  await page.goto("/#/this-route-does-not-exist");
  await expect(page.getByText("404")).toBeVisible();
  await expect(page.getByRole("link", { name: "Back home" })).toBeVisible();
});
test("website files and editable portfolio data load from static paths", async ({
  request,
}) => {
  for (const path of [
    "/style.css",
    "/script.js",
    "/src/data/content.json",
    "/public/favicon.svg",
  ]) {
    const response = await request.get(path);
    expect(response.ok(), `${path} should be served successfully`).toBeTruthy();
  }
});
test("project case studies load directly and survive refresh", async ({
  page,
}) => {
  await page.goto("/#/projects/devblog");
  await expect(
    page.getByRole("heading", {
      name: "DevBlog — Developer Publishing Platform",
    }),
  ).toBeVisible();
  await page.reload();
  await expect(
    page.getByRole("heading", {
      name: "DevBlog — Developer Publishing Platform",
    }),
  ).toBeVisible();
});
test("CV is available from the site root", async ({ page, request }) => {
  await page.goto("/");
  const cvLink = page.getByRole("link", { name: "Download CV" }).first();
  await expect(cvLink).toHaveAttribute(
    "href",
    "./public/Ronald-Senokoane-CV.pdf",
  );
  const response = await request.get("/public/Ronald-Senokoane-CV.pdf");
  expect(response.ok()).toBeTruthy();
  expect(response.headers()["content-type"]).toContain("application/pdf");
});
