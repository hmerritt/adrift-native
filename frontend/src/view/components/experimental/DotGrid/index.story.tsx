import { useFixtureInput } from "react-cosmos/client";

import { DotGrid } from "./index";

const One = () => {
	const [reactToWindowResize] = useFixtureInput("reactToWindowResize", true);

	const [spacing] = useFixtureInput("spacing", 40);
	const [damping] = useFixtureInput("damping", 0.5);
	const [returnSpeed] = useFixtureInput("returnSpeed", 0.18);
	const [attractionBase] = useFixtureInput("attractionBase", 1.025);
	const [maxAttraction] = useFixtureInput("maxAttraction", 0.8);

	return (
		<DotGrid
			position="fixed"
			refForMousePosition="window"
			reactToWindowResize={reactToWindowResize}
			spacing={spacing}
			damping={damping}
			returnSpeed={returnSpeed}
			attractionBase={attractionBase}
			maxAttraction={maxAttraction}
		/>
	);
};

const Two = () => {
	const [reactToWindowResize] = useFixtureInput("reactToWindowResize", true);

	const [spacing] = useFixtureInput("spacing", 15);
	const [damping] = useFixtureInput("damping", 0.2);
	const [returnSpeed] = useFixtureInput("returnSpeed", 0.25);
	const [attractionBase] = useFixtureInput("attractionBase", 1.005);
	const [maxAttraction] = useFixtureInput("maxAttraction", 0.8);

	return (
		<DotGrid
			position="fixed"
			refForMousePosition="window"
			reactToWindowResize={reactToWindowResize}
			spacing={spacing}
			damping={damping}
			returnSpeed={returnSpeed}
			attractionBase={attractionBase}
			maxAttraction={maxAttraction}
		/>
	);
};

export default { One, Two };
