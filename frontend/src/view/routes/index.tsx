import { css } from "@linaria/core";
import { createFileRoute } from "@tanstack/react-router";

import theme from "lib/styles";

import { DotGrid, FrostedGlass, Fullscreen, Stack, Waves } from "view/components";

export const Route = createFileRoute("/")({
	component: IndexRoute
});

export function IndexRoute() {
	return (
		<>
			<Stack spacing={15}>
				<Fullscreen
					center
					zIndex={1}
					position="relative"
					padding="1rem 2rem"
					style={{ height: "70vh" }}
				>
					<FrostedGlass>
						<div className={pictureFrame}>
							<h1 className={header}>Adrift</h1>
							<FrostedGlass>
								<h4>Template react app with batteries included 🔋</h4>
							</FrostedGlass>
							<Waves />
						</div>
					</FrostedGlass>
				</Fullscreen>
			</Stack>

			<DotGrid position="fixed" refForMousePosition="window" spacing={50} />
		</>
	);
}

// This will get compiled at build time into a css file.
// Why? - Performance is *greatly* improved over something like styled-components which compiles at run time!
const pictureFrame = css`
	${theme} // Import theme object - can now use all SCSS variables and mixins set in styles/theme.ts
	position: relative;
	width: 700px;
	height: 350px;
	margin: auto;
	display: flex;
	overflow: hidden;
	align-items: center;
	flex-direction: column;
	justify-content: center;
	box-shadow: shadowBlock($blue-400);

	h4 {
		font-style: italic;
		padding: 1rem;
		opacity: 0.8;
		font-size: 1.5rem;
	}
`;

const header = css`
	${theme}
	text-transform: lowercase;
	font-style: italic;
	font-size: 10rem;
	font-weight: thin;
	color: $blue-100;
	text-shadow: shadowBlock($blue-400);
`;
