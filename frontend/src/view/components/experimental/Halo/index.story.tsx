import * as stylex from "@stylexjs/stylex";
import { useFixtureInput } from "react-cosmos/client";

import { Grid } from "view/components/layout";

import { Halo, HaloProvider } from "./index";

export default () => {
	const [gradient] = useFixtureInput("gradient", {
		size: "24rem",
		halo: "rgb(120, 120, 120)",
		background: "rgb(255, 255, 255)"
	});
	const [staticForMobile] = useFixtureInput("staticForMobile", true);

	return (
		<HaloProvider staticForMobile={staticForMobile} gradient={gradient}>
			<div {...stylex.props(styles.center, styles.fullHeight)}>
				<Grid gutter={10} minWidth={"50%"} maxWidth={"2fr"}>
					{["Top Left", "Top Right", "Bottom Left", "Bottom Right"].map(
						(position) => (
							<Halo key={position}>
								<div {...stylex.props(styles.center, styles.box)}>
									<div {...stylex.props(styles.center, styles.item)}>
										{position}
									</div>
								</div>
							</Halo>
						)
					)}
				</Grid>
			</div>
		</HaloProvider>
	);
};

const styles = stylex.create({
	fullHeight: {
		height: "100vh"
	},
	center: {
		display: "flex",
		justifyContent: "center",
		alignItems: "center"
	},
	box: {
		position: "relative",
		display: "flex",
		width: 250,
		height: 250
	},
	item: {
		position: "relative",
		fontSize: 28,
		paddingBlock: "20px",
		paddingInline: "40px",
		borderWidth: 0,
		height: 150
	}
});
