import { expect, test } from "vitest";
import { screen } from "@testing-library/react";

import { render } from "tests";

import App from "./App";

test("renders app", () => {
	render(<App />);

	const linkElement = screen.getByText(/useInterval 1000ms/i);
	expect(linkElement).toBeInTheDocument();
});

test("renders 404 page", () => {
	render(<App />, "/wow");

	const linkElement = screen.getByText(/Page not found/i);
	expect(linkElement).toBeInTheDocument();
});
