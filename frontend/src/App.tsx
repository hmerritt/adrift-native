import { ErrorComponent, RouterProvider, createRouter } from "@tanstack/react-router";
import { Provider as Redux } from "react-redux";

import store from "state/index";

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
		<Redux store={store}>
			<HaloProvider>
				<RouterProvider router={router} defaultPreload="intent" context={{}} />
			</HaloProvider>
		</Redux>
	);
}

export default App;
