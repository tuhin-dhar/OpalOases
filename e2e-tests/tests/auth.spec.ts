import { test, expect } from "@playwright/test";

const UI_URL = "http://localhost:5173";

test("should allow the user to sign in", async ({ page }) => {
  await page.goto(UI_URL);

  await page.getByRole("link", { name: "Sign In" }).click();

  await expect(page.getByRole("heading", { name: "Sign In" })).toBeVisible();

  await page.locator("[name=email]").fill("u1@gmail.com");
  page.locator("[name=password]").fill("password");

  await page.getByRole("button", { name: "Sign In" }).click();

  await expect(page.getByText("User succesfully logged in")).toBeVisible();

  await expect(page.getByRole("link", { name: "My Stays" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Bookings" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Logout" })).toBeVisible();
});

test("should allow the user to logout", async ({ page }) => {
  await page.goto(UI_URL);

  await page.getByRole("link", { name: "Sign In" }).click();

  await expect(page.getByRole("heading", { name: "Sign In" })).toBeVisible();

  await page.locator("[name=email]").fill("testUser49577@test.com");
  page.locator("[name=password]").fill("password");

  await page.getByRole("button", { name: "Sign In" }).click();

  await expect(page.getByText("User succesfully logged in")).toBeVisible();

  await expect(page.getByRole("link", { name: "My Stays" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Bookings" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Logout" })).toBeVisible();
  await page.goto(UI_URL);

  await page.getByRole("button", { name: "Logout" }).click();

  await expect(page.getByText("Successfully Logged out")).toBeVisible();

  await expect(page.getByRole("link", { name: "Sign Up" })).toBeVisible();
});

test("should allow the user to register", async ({ page }) => {
  const testEmail = `testUser${
    Math.floor(Math.random() * 90000) + 1000
  }@test.com`;

  await page.goto(UI_URL);

  await expect(page.getByRole("link", { name: "Sign Up" })).toBeVisible();

  await page.getByRole("link", { name: "Sign Up" }).click();

  await expect(page.getByText("Create an Account")).toBeVisible();

  await page.locator("[name=firstName]").fill("testUser");
  await page.locator("[name=lastName]").fill("testUser1");
  await page.locator("[name=email]").fill(testEmail);
  await page.locator("[name=password]").fill("password");
  await page.locator("[name=confirmedPassword]").fill("password");
  page.getByRole("button", { name: "Create Account" }).click();
  await expect(page.getByText("Registration Sucess")).toBeVisible();

  await expect(page.getByRole("button", { name: "Logout" })).toBeVisible();
});
