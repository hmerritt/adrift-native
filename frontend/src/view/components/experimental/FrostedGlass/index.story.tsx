import * as stylex from "@stylexjs/stylex";
import { useFixtureInput } from "react-cosmos/client";

import { colors } from "lib/styles/colors.stylex";
import { shadowFn } from "lib/styles/shadows.stylex";

import { DotGrid } from "../DotGrid";
import { FrostedGlass } from "./index";

export default () => {
	const [paneDirection] = useFixtureInput("paneDirection", "row");
	const [paneMaxWidth] = useFixtureInput("paneMaxWidth", 25);
	const [paneMaxHeight] = useFixtureInput("paneMaxHeight", 25);
	const [paneInitialCount] = useFixtureInput("paneInitialCount", 5);
	const [reactToWindowResize] = useFixtureInput("reactToWindowResize", true);

	return (
		<div>
			<div
				style={{
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					position: "relative",
					height: "70vh",
					padding: "1rem 2rem",
					zIndex: 1
				}}
			>
				<FrostedGlass
					paneDirection={paneDirection as "row" | "column"}
					paneMaxWidth={paneMaxWidth}
					paneMaxHeight={paneMaxHeight}
					paneInitialCount={paneInitialCount}
					reactToWindowResize={reactToWindowResize}
				>
					<div
						{...stylex.props(
							styles.pictureFrame,
							shadowFn.boxBlock(colors.primary)
						)}
					>
						<FrostedGlass>
							<h4 {...stylex.props(styles.title)}>Frosted Glass</h4>
						</FrostedGlass>
					</div>
				</FrostedGlass>
			</div>
			<DotGrid
				position="fixed"
				refForMousePosition="window"
				reactToWindowResize
				spacing={25}
				damping={0.3}
				returnSpeed={0.25}
				attractionBase={1.009}
				maxAttraction={0.8}
			/>
		</div>
	);
};

const styles = stylex.create({
	pictureFrame: {
		alignItems: "center",
		display: "flex",
		flexDirection: "column",
		height: "350px",
		justifyContent: "center",
		margin: "auto",
		overflow: "hidden",
		position: "relative",
		width: "700px"
	},
	title: {
		fontSize: "1.5rem",
		fontStyle: "italic",
		opacity: 0.8,
		padding: "1rem"
	}
});
