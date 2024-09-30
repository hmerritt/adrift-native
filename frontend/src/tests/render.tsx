import { RouterProvider } from "@tanstack/react-router";
import { render as reactRender, waitFor } from "@testing-library/react";
import { JSXElementConstructor, ReactElement } from "react";

import { createTestRouter } from "./utils";

export type Element = ReactElement<any, string | JSXElementConstructor<any>>;

type WrapperType = JSXElementConstructor<{
	children: React.ReactNode;
}>;

const internalTestId = "__routerHasMounted";

export const render = async (ui: Element, skipWaitFor = false) => {
	const Wrapper: WrapperType = ({ children }) => {
		return (
			<RouterProvider
				router={
					createTestRouter(
						<div data-testid={internalTestId}>{children}</div>
					) as any
				}
			/>
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
	const Wrapper: WrapperType = ({ children }) => {
		return <div data-testid={internalTestId}>{children}</div>;
	};

	const r = reactRender(ui, { wrapper: Wrapper });

	if (!skipWaitFor) {
		await waitFor(() => {
			r.getByTestId(internalTestId);
		});
	}

	return r;
};
