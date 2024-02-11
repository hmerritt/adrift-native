import { getStyle, render, select, selectTestId } from "tests";
import { describe, expect, test } from "vitest";

import StylesMock from "tests/StylesMock";

/**
 * Test to see if the styles are being compiled and injected correctly.
 *
 * (linaria needs to compile our custom SCSS `theme` object. This can fails so it's good to test)
 *
 * @TODO E2E tests
 */

describe("@linaria with theme injection", () => {
	test("renders colors", async () => {
		const { container } = await render(<StylesMock />);

		const styleTitle = getStyle(select(container, "h1"));
		expect(styleTitle.color).toBe("#38a169");

		const styleSubTitle = getStyle(select(container, "h2"));
		expect(styleSubTitle.color).toBe("#dd6b20");
	});

	test("renders mixins", async () => {
		const { container } = await render(<StylesMock />);

		const styleContainer = getStyle(selectTestId(container, "StylesMock"));
		expect(styleContainer.maxWidth).toBe("567px");
		expect(styleContainer.marginLeft).toBe("auto");
		expect(styleContainer.marginRight).toBe("auto");
		expect(styleContainer.transition).toBe("all, 80ms, ease");
	});

	test("renders shadows", async () => {
		const { container } = await render(<StylesMock />);

		const styleContainer = getStyle(selectTestId(container, "StylesMock"));
		expect(styleContainer.boxShadow).toBe(
			"0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)"
		);
	});

	test("renders variables", async () => {
		const { container } = await render(<StylesMock />);

		const styleContainer = getStyle(selectTestId(container, "StylesMock"));
		expect(styleContainer.width).toBe("5678px");
	});
});
