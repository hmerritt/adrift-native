import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
	await page.goto("/");
});

test("has title", async ({ page }) => {
	await expect(page).toHaveTitle(/Adrift/i);

	await expect(
		page.getByText(/Template react app with batteries included/i)
	).toBeVisible();
});
