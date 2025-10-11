import * as stylex from "@stylexjs/stylex";
import { useEffect, useRef } from "react";

import { type SxProp } from "lib/type-assertions";

import {
	type ShaderSourceProps,
	type ShaderState,
	defaultShaderState,
	fetchShader,
	setup
} from "./webgl";

export type ShaderProps = React.JSX.IntrinsicElements["canvas"] &
	SxProp & {
		source: ShaderSourceProps;
	};

/**
 * Shader component
 *
 * Renders a basic image shader (buffers not supported yet).
 */
export const Shader = ({ source, sx, ...canvasProps }: ShaderProps) => {
	const canvas = useRef<HTMLCanvasElement>(null);
	const s = useRef<ShaderState>(defaultShaderState);

	// On mount, fetch the shader and set up WebGL
	useEffect(() => {
		(async () => {
			if (!canvas.current) return;

			// Get GLSL shader to render
			let mainImageShader = "";
			if (source.rawGLSL) mainImageShader = source.rawGLSL;
			else if (source.url) mainImageShader = await fetchShader(source.url);

			if (!mainImageShader) {
				logn.error("shader", "No GLSL shader code.");
				return;
			}

			s.current = defaultShaderState; // Reset state on re-setup
			setup(mainImageShader, s.current, canvas.current);
		})();
	}, [canvas, source.rawGLSL, source.url]);

	return <canvas {...canvasProps} ref={canvas} {...stylex.props(sx)} />;
};
