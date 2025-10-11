import { screen } from "@testing-library/react";
import { render } from "tests";
import { expect, test } from "vitest";

import { NotFoundRoute } from "./view/routes/__root";
import { IndexRoute } from "./view/routes/index";

test("renders home", async () => {
	await render(<IndexRoute />);

	const linkElement = screen.getByText(/Template react app with batteries included/i);
	expect(linkElement).toBeInTheDocument();
});

test("renders 404 page", async () => {
	await render(<NotFoundRoute />);

	const linkElement = screen.getByText(/Page not found/i);
	expect(linkElement).toBeInTheDocument();
});
