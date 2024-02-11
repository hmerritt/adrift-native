import { RouterProvider } from "@tanstack/react-router";
import { render as reactRender, waitFor } from "@testing-library/react";
import { JSXElementConstructor, ReactElement } from "react";
import { Provider } from "react-redux";
import store from "state";

import { createTestRouter } from "./utils";

export type Element = ReactElement<any, string | JSXElementConstructor<any>>;

type Children = {
	children: Element;
};

const internalTestId = "__routerHasMounted";

export const render = async (ui: Element, skipWaitFor = false) => {
	const Wrapper = ({ children }: Children) => {
		return (
			<Provider store={store}>
				<RouterProvider
					router={createTestRouter(
						<div data-testid={internalTestId}>{children}</div>
					)}
				/>
			</Provider>
		);
	};

	const r = reactRender(ui, { wrapper: Wrapper });

	if (!skipWaitFor) {
		await waitFor(() => {
			r.getByTestId(internalTestId);
		});
	}

	return r;
};

export const renderBasic = async (ui: Element, skipWaitFor = false) => {
	const Wrapper = ({ children }: Children) => {
		return (
			<Provider store={store}>
				<div data-testid={internalTestId}>{children}</div>
			</Provider>
		);
	};

	const r = reactRender(ui, { wrapper: Wrapper });

	if (!skipWaitFor) {
		await waitFor(() => {
			r.getByTestId(internalTestId);
		});
	}

	return r;
};
