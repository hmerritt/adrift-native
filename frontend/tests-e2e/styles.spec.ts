import { expect, test } from "@playwright/test";

test.describe("StyleX theme on /tests/style", () => {
	test.beforeEach(async ({ page }) => {
		await page.goto("/tests/style");
	});

	test("renders colors", async ({ page }) => {
		await expect(page.getByTestId("container")).toBeVisible();

		const title = page.getByTestId("title");
		const subTitle = page.getByTestId("sub-title");

		// Note: Browsers often compute hex colors into rgb() format.
		// #38A169 -> rgb(56, 161, 105)
		// #DD6B20 -> rgb(221, 107, 32)
		await expect(title).toHaveCSS("color", "rgb(56, 161, 105)");
		await expect(subTitle).toHaveCSS("color", "rgb(221, 107, 32)");
	});

	test("renders mixins", async ({ page }) => {
		const container = page.getByTestId("container");

		await expect(container).toHaveCSS("max-width", "567px");

		await expect(container).toHaveCSS("transition-property", "all, all, all");
		await expect(container).toHaveCSS("transition-duration", "0s, 0.08s, 0s");
		await expect(container).toHaveCSS(
			"transition-timing-function",
			"ease, ease, ease"
		);
	});

	test("renders shadows", async ({ page }) => {
		const container = page.getByTestId("container");
		const title = page.getByTestId("title");
		const boxShadowElement = page.getByTestId("box-shadow");

		// Container box-shadow
		await expect(container).toHaveCSS(
			"box-shadow",
			"rgba(0, 0, 0, 0.12) 0px 1px 3px 0px, rgba(0, 0, 0, 0.24) 0px 1px 2px 0px"
		);

		// Title text-shadow
		const expectedTitleTextShadow =
			"rgb(56, 161, 105) 0.25px 0.25px 0px, rgb(56, 161, 105) 0.5px 0.5px 0px, rgb(56, 161, 105) 0.75px 0.75px 0px, rgb(56, 161, 105) 1px 1px 0px, rgb(56, 161, 105) 1.25px 1.25px 0px, rgb(56, 161, 105) 1.5px 1.5px 0px, rgb(56, 161, 105) 1.75px 1.75px 0px, rgb(56, 161, 105) 2px 2px 0px, rgb(56, 161, 105) 2.25px 2.25px 0px, rgb(56, 161, 105) 2.5px 2.5px 0px, rgb(56, 161, 105) 2.75px 2.75px 0px, rgb(56, 161, 105) 3px 3px 0px, rgb(56, 161, 105) 3.25px 3.25px 0px, rgb(56, 161, 105) 3.5px 3.5px 0px, rgb(56, 161, 105) 3.75px 3.75px 0px, rgb(56, 161, 105) 4px 4px 0px, rgb(56, 161, 105) 4.25px 4.25px 0px, rgb(56, 161, 105) 4.5px 4.5px 0px, rgb(56, 161, 105) 4.75px 4.75px 0px, rgb(56, 161, 105) 5px 5px 0px, rgb(56, 161, 105) 5.25px 5.25px 0px, rgb(56, 161, 105) 5.5px 5.5px 0px, rgb(56, 161, 105) 5.75px 5.75px 0px, rgb(56, 161, 105) 6px 6px 0px";
		await expect(title).toHaveCSS("text-shadow", expectedTitleTextShadow);

		// Box-shadow element box-shadow
		const expectedBoxElementShadow =
			"rgb(221, 107, 32) 0.25px 0.25px 0px 0px, rgb(221, 107, 32) 0.5px 0.5px 0px 0px, rgb(221, 107, 32) 0.75px 0.75px 0px 0px, rgb(221, 107, 32) 1px 1px 0px 0px, rgb(221, 107, 32) 1.25px 1.25px 0px 0px, rgb(221, 107, 32) 1.5px 1.5px 0px 0px, rgb(221, 107, 32) 1.75px 1.75px 0px 0px, rgb(221, 107, 32) 2px 2px 0px 0px, rgb(221, 107, 32) 2.25px 2.25px 0px 0px, rgb(221, 107, 32) 2.5px 2.5px 0px 0px, rgb(221, 107, 32) 2.75px 2.75px 0px 0px, rgb(221, 107, 32) 3px 3px 0px 0px, rgb(221, 107, 32) 3.25px 3.25px 0px 0px, rgb(221, 107, 32) 3.5px 3.5px 0px 0px, rgb(221, 107, 32) 3.75px 3.75px 0px 0px, rgb(221, 107, 32) 4px 4px 0px 0px, rgb(221, 107, 32) 4.25px 4.25px 0px 0px, rgb(221, 107, 32) 4.5px 4.5px 0px 0px, rgb(221, 107, 32) 4.75px 4.75px 0px 0px, rgb(221, 107, 32) 5px 5px 0px 0px, rgb(221, 107, 32) 5.25px 5.25px 0px 0px, rgb(221, 107, 32) 5.5px 5.5px 0px 0px, rgb(221, 107, 32) 5.75px 5.75px 0px 0px, rgb(221, 107, 32) 6px 6px 0px 0px";
		await expect(boxShadowElement).toHaveCSS("box-shadow", expectedBoxElementShadow);
	});
});
