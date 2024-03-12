import { ErrorComponent, RouterProvider, createRouter } from "@tanstack/react-router";

import { HaloProvider } from "view/components";

import { routeTree } from "./routeTree.gen";

const router = createRouter({
	routeTree,
	defaultPreload: "intent",
	defaultPendingComponent: () => null,
	defaultErrorComponent: ({ error }) => <ErrorComponent error={error} />
});

declare module "@tanstack/react-router" {
	interface Register {
		router: typeof router;
	}
}

function App() {
	return (
		<HaloProvider>
			<RouterProvider router={router} defaultPreload="intent" context={{}} />
		</HaloProvider>
	);
}

export default App;
