import { Link, Outlet, createLazyFileRoute } from "@tanstack/react-router";

import { Fullscreen, Stack } from "view/components";

export const Route = createLazyFileRoute("/user")({
	component: UserLayoutComponent
});

function UserLayoutComponent() {
	return (
		<Stack spacing={15}>
			<Fullscreen
				center
				zIndex={1}
				position="relative"
				padding="1rem 2rem"
				style={{ height: "70vh" }}
			>
				<Link to="/user/$userId" params={{ userId: "123" }}>
					User 123
				</Link>
				{/* Render sub routes */}
				<Outlet />
			</Fullscreen>
		</Stack>
	);
}
