import { screen } from "@testing-library/react";
import { getStyle, render, select } from "tests";
import { expect, test } from "vitest";

import App from "./App";
import { NotFoundRoute } from "./view/routes/__root";
import { IndexRoute } from "./view/routes/index";

test("renders app", async () => {
	const r = await render(<App />);

	const linkElement = r.getByText(/Template react app with batteries included/i);
	expect(linkElement).toBeInTheDocument();
});

test("renders home", async () => {
	const r = await render(<IndexRoute />);

	const linkElement = screen.getByText(/Template react app with batteries included/i);
	expect(linkElement).toBeInTheDocument();

	// Test @linaria styles are working.
	// Worth doing for a few components to test the `theme` object imports properly.
	const style = getStyle(select(r.container, "h1"));
	expect(style.color).toBe("#bee3f8");
	expect(style.textShadow).toBe(
		"0.25px 0.25px 0 #4299e1, 0.5px 0.5px 0 #4299e1, 0.75px 0.75px 0 #4299e1, 1px 1px 0 #4299e1, 1.25px 1.25px 0 #4299e1, 1.5px 1.5px 0 #4299e1, 1.75px 1.75px 0 #4299e1, 2px 2px 0 #4299e1, 2.25px 2.25px 0 #4299e1, 2.5px 2.5px 0 #4299e1, 2.75px 2.75px 0 #4299e1, 3px 3px 0 #4299e1, 3.25px 3.25px 0 #4299e1, 3.5px 3.5px 0 #4299e1, 3.75px 3.75px 0 #4299e1, 4px 4px 0 #4299e1, 4.25px 4.25px 0 #4299e1, 4.5px 4.5px 0 #4299e1, 4.75px 4.75px 0 #4299e1, 5px 5px 0 #4299e1, 5.25px 5.25px 0 #4299e1, 5.5px 5.5px 0 #4299e1, 5.75px 5.75px 0 #4299e1, 6px 6px 0 #4299e1"
	);
});

test("renders 404 page", async () => {
	await render(<NotFoundRoute />);

	const linkElement = screen.getByText(/Page not found/i);
	expect(linkElement).toBeInTheDocument();
});
