import * as stylex from "@stylexjs/stylex";
import { useFixtureInput } from "react-cosmos/client";

import { Noise as $Noise, NoiseImg } from "./index";

const Noise = () => {
	const [framerate] = useFixtureInput("framerate", 30);
	const [size] = useFixtureInput("size", 500);
	const [alpha] = useFixtureInput("alpha", 50);
	const [reactToWindowResize] = useFixtureInput("reactToWindowResize", true);

	return (
		<div {...stylex.props(styles.center)}>
			<$Noise
				framerate={framerate}
				size={size}
				alpha={alpha}
				reactToWindowResize={reactToWindowResize}
				sx={styles.img}
			/>
		</div>
	);
};

const Image = () => {
	const [framerate] = useFixtureInput("framerate", 12);
	const [size] = useFixtureInput("size", 300);
	const [alpha] = useFixtureInput("alpha", 25);
	const [reactToWindowResize] = useFixtureInput("reactToWindowResize", true);

	return (
		<div {...stylex.props(styles.center)}>
			<NoiseImg
				src="/og-adrift.png"
				framerate={framerate}
				size={size}
				alpha={alpha}
				reactToWindowResize={reactToWindowResize}
				sx={styles.img}
			/>
		</div>
	);
};

export default { Noise, Image };

const styles = stylex.create({
	center: {
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
		height: "100vh"
	},
	img: {
		position: "relative",
		width: 1000
	}
});
