import { test, expect } from "@playwright/test";
import path from "path";

const UI_URL = "http://localhost:5173";

test.beforeEach(async ({ page }) => {
  await page.goto(UI_URL);

  await page.getByRole("link", { name: "Sign In" }).click();

  await expect(page.getByRole("heading", { name: "Sign In" })).toBeVisible();

  await page.locator("[name=email]").fill("testUser49577@test.com");
  page.locator("[name=password]").fill("password");

  await page.getByRole("button", { name: "Sign In" }).click();

  await expect(page.getByText("User succesfully logged in")).toBeVisible();
});

const random = Math.floor(Math.random() * 9000);

test("should allow suer to add a hotel", async ({ page }) => {
  await page.goto(`${UI_URL}/add-hotel`);
  await page.locator("[name= name ]").fill(`Test hotel${random}`);
  await page.locator("[name= city ]").fill(`Test city${random}`);
  await page.locator("[name= country ]").fill(`Test country${random}`);
  await page
    .locator("[name= description ]")
    .fill(`This is a description for hotel${random}`);
  await page.locator("[name= pricePerNight ]").fill(`${random}`);
  await page.selectOption("select[name=starRating]", "3");

  await page.getByText("B&B").click();

  await page.getByLabel("Swimming Pool").check();
  await page.getByLabel("Conference Facilities").check();

  await page.locator("[name=adultCount]").fill("2");
  await page.locator("[name=childCount]").fill("1");

  await page.setInputFiles("[name=imageFiles]", [
    path.join(__dirname, "files", "1.jpeg"),
    path.join(__dirname, "files", "2.jpeg"),
  ]);

  await page.getByRole("button", { name: "Save" }).click();

  await expect(page.getByText("Hotel listing uploaded")).toBeVisible();
});

test("should allow the user to fetch his hotels", async ({ page }) => {
  await page.goto(`${UI_URL}/my-hotels`);

  await expect(page.getByText("My Stays")).toBeVisible();

  await expect(page.getByText("Test Hotel932")).toBeVisible();
});
