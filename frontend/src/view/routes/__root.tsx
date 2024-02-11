import {
	Outlet,
	createRootRouteWithContext,
	useRouterState
} from "@tanstack/react-router";
import { lazy } from "react";

import { DotGrid, Icon } from "view/components";

const TanStackRouterDevtools =
	env.isDevelopment && env.showDevTools
		? lazy(() =>
				import("@tanstack/router-devtools").then((res) => ({
					default: res.TanStackRouterDevtools
				}))
			)
		: () => null;

/**
 * `@tanstack/react-router` file-based routing.
 *
 * https://tanstack.com/router/latest/docs/framework/react/overview
 */
export const Route = createRootRouteWithContext()({
	component: RootRoute,
	notFoundComponent: NotFoundRoute
});

function RootRoute() {
	return (
		<div>
			{/* Show a global spinner when the router is transitioning */}
			<RouterSpinner />
			{/* Render our first route match */}
			<Outlet />
			{/* Router dev tools */}
			<TanStackRouterDevtools />
		</div>
	);
}

function RouterSpinner() {
	const isLoading = useRouterState({ select: (s) => s.status === "pending" });
	return isLoading ? <Icon name="Spinner" /> : null;
}

export function NotFoundRoute() {
	return (
		<div className="flex-center" style={{ height: "100vh" }}>
			<h2 style={{ fontSize: "2rem", textAlign: "center", zIndex: 10 }}>
				404, Page not found :(
			</h2>
			<DotGrid position="fixed" refForMousePosition="window" spacing={50} />
		</div>
	);
}
