import { expect, test } from "vitest";
import { screen } from "@testing-library/react";

import { getStyle, render, select } from "tests";

import App from "./App";
import { Home } from "view/screens";

test("renders app", () => {
	const r = render(<App />);

	const linkElement = screen.getByText(/useInterval 1000ms/i);
	expect(linkElement).toBeInTheDocument();
});

test("renders 404 page", () => {
	render(<App />, "/wow");

	const linkElement = screen.getByText(/Page not found/i);
	expect(linkElement).toBeInTheDocument();
});

test("renders Home page", () => {
	const r = render(<Home />);

	// Test @linaria styles are working.
	// Worth doing for a few components to test the `theme` object imports properly.
	const style = getStyle(select(r, "h1"));
	expect(style.color).toBe("#e53e3e");
	expect(style.textShadow).toBe(
		"0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)"
	);
});
