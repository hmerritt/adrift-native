import * as stylex from "@stylexjs/stylex";
import {
	Outlet,
	createRootRouteWithContext,
	useRouterState
} from "@tanstack/react-router";
import { lazy } from "react";

import { colors } from "lib/styles/colors.stylex";
import { shadowFn } from "lib/styles/shadows.stylex";

import { DotGrid, FrostedGlass, Icon, Stack } from "view/components";
import { WindowControls, WindowDragArea } from "view/components/native";

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
		<>
			{/* Show a global spinner when the router is transitioning */}
			<RouterSpinner />
			{/* Render our first route match */}
			<Outlet />
			{/* Router dev tools */}
			<TanStackRouterDevtools />

			<div {...stylex.props(styles.controlsWrapper)}>
				<WindowControls
					onClose={() => (window as any)?.runtime?.Quit()}
					onMinimize={() => (window as any)?.runtime?.WindowMinimise()}
					onMaximize={() => (window as any)?.runtime?.WindowToggleMaximise()}
				/>
			</div>
			<WindowDragArea />
		</>
	);
}

export function NotFoundRoute() {
	return (
		<>
			<Stack center sx={styles.fullScreen}>
				<FrostedGlass sx={[styles.titleGlass, shadowFn.boxBlock(colors.primary)]}>
					<h2 {...stylex.props(styles.title)}>404, Page not found :(</h2>
				</FrostedGlass>
			</Stack>
			<DotGrid
				position="fixed"
				refForMousePosition="window"
				reactToWindowResize
				spacing={40}
				damping={0.5}
				returnSpeed={0.18}
				attractionBase={1.025}
				maxAttraction={0.8}
			/>
		</>
	);
}

const TanStackRouterDevtools = feature("showDevTools", { alwaysShowOnDev: false })
	? lazy(() =>
			import("@tanstack/react-router-devtools").then((res) => ({
				default: res.TanStackRouterDevtools
			}))
		)
	: () => null;

function RouterSpinner() {
	const isLoading = useRouterState({ select: (s) => s.isLoading });
	return isLoading ? <Icon name="Spinner" /> : null;
}

const styles = stylex.create({
	fullScreen: {
		alignItems: "center",
		display: "flex",
		height: "100vh",
		justifyContent: "center"
	},
	title: {
		fontSize: "2rem",
		textAlign: "center",
		zIndex: 10
	},
	titleGlass: {
		padding: "2.5rem"
	},
	controlsWrapper: {
		position: "fixed",
		top: 0,
		left: 0,
		zIndex: 9999999999,
		padding: "1.5rem",
		// eslint-disable-next-line @stylexjs/valid-styles
		"--runtime-draggable": "drag"
	}
});
