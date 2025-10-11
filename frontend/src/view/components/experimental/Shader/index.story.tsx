import * as stylex from "@stylexjs/stylex";
import { useFixtureInput } from "react-cosmos/client";

import { Stack } from "view/components";
import { Shader } from "view/components/experimental/Shader";

const GLSL = () => {
	const [rawGLSL] = useFixtureInput(
		"rawGLSL",
		`void mainImage(out vec4 fragColor, vec2 fragCoord) {
	float mr = min(iResolution.x, iResolution.y);
	vec2 uv = (fragCoord * 2.0 - iResolution.xy) / mr;

	float d = -iTime * 0.8;
	float a = 0.0;
	for (float i = 0.0; i < 8.0; ++i) {
		a += cos(i - d - a * uv.x);
		d += sin(uv.y * i + a);
	}
	d += iTime * 0.5;

	vec3 colorA = vec3(0.0, 0.4, 1); // Blue
	vec3 colorB = vec3(.03, .03, .03); // Black
	float t = cos(a) * 0.5 + 0.5;
	vec3 col = mix(colorA, colorB, t);

	fragColor = vec4(col, 1);
}`
	);

	return (
		<Stack sx={styles.container}>
			<Shader sx={styles.canvas} source={{ rawGLSL }} />
		</Stack>
	);
};

const URL = () => {
	const [url] = useFixtureInput(
		"url",
		"https://samples.threepipe.org/shaders/tunnel-cylinders.glsl"
	);

	return (
		<Stack sx={styles.container}>
			<Shader sx={styles.canvas} source={{ url }} />
		</Stack>
	);
};

export default { GLSL, URL };

const styles = stylex.create({
	container: {
		position: "absolute",
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		zIndex: -1
	},
	canvas: {
		width: "100%",
		height: "100%"
	}
});
