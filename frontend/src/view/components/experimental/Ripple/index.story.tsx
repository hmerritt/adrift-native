import * as stylex from "@stylexjs/stylex";
import { useFixtureInput } from "react-cosmos/client";

import { Ripple } from "./index";

export default () => {
	const [hoverBg] = useFixtureInput("hoverBg", false);
	const [centered] = useFixtureInput("centered", false);
	const [disabled] = useFixtureInput("disabled", false);

	return (
		<div {...stylex.props(styles.center)}>
			<Ripple hoverBg={hoverBg} centered={centered} disabled={disabled}>
				<button {...stylex.props(styles.button)}>Ripple</button>
			</Ripple>
		</div>
	);
};

const styles = stylex.create({
	center: {
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
		height: "100vh"
	},
	button: {
		fontSize: 28,
		paddingBlock: "20px",
		paddingInline: "40px",
		borderWidth: 0
	}
});
