import { describe, expect, test } from "vitest";

import StylesMock from "tests/StylesMock";
import { getStyle, render, select } from "tests";

/**
 * Test to see if the styles are being compiled and injected correctly.
 *
 * (linaria needs to compile our custom SCSS `theme` object. This can fails so it's good to test)
 *
 * @TODO E2E tests
 */

describe("@linaria with theme injection", () => {
	test("renders colors", () => {
		const { container } = render(<StylesMock />);

		const styleTitle = getStyle(select(container, "h1"));
		expect(styleTitle.color).toBe("#38a169");

		const styleSubTitle = getStyle(select(container, "h2"));
		expect(styleSubTitle.color).toBe("#dd6b20");
	});

	test("renders mixins", () => {
		const { container } = render(<StylesMock />);

		const styleContainer = getStyle(select(container, "div"));
		expect(styleContainer.maxWidth).toBe("567px");
		expect(styleContainer.marginLeft).toBe("auto");
		expect(styleContainer.marginRight).toBe("auto");
		expect(styleContainer.transition).toBe("all, 80ms, ease");
	});

	test("renders shadows", () => {
		const { container } = render(<StylesMock />);

		const styleContainer = getStyle(select(container, "div"));
		expect(styleContainer.boxShadow).toBe(
			"0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)"
		);
	});

	test("renders variables", () => {
		const { container } = render(<StylesMock />);

		const styleContainer = getStyle(select(container, "div"));
		expect(styleContainer.width).toBe("5678px");
	});
});
