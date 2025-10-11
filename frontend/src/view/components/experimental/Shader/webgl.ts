// region WebGL helpers
import { FRAGMENT_SHADER_TEMPLATE, VERTEX_SHADER_SOURCE } from "./glsl";

/**
 * Fetches GLSL shader code from a URL (does not check GLSL validity).
 *
 * @example
 * fetchShader("https://samples.threepipe.org/shaders/tunnel-cylinders.glsl")
 */
export const fetchShader = async (url: string): Promise<string> => {
	try {
		const response = await fetch(url);
		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}
		return await response.text();
	} catch (error) {
		logn.error("shader", "Failed to fetch shader:", error);
		return "";
	}
};

/**
 * Compiles a shader from source code.
 */
const createShader = (
	/** The WebGL context  */
	gl: WebGL2RenderingContext,
	/** The shader type (VERTEX_SHADER or FRAGMENT_SHADER)  */
	type: number,
	/** The GLSL source code  */
	source: string
): WebGLShader | null => {
	const shader = gl.createShader(type);
	if (!shader) {
		logn.error("shader", "Unable to create shader: gl.createShader returned null");
		return null;
	}
	gl.shaderSource(shader, source);
	gl.compileShader(shader);
	const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
	if (success) {
		return shader;
	}
	logn.error("shader", "Failed to compile shader", gl.getShaderInfoLog(shader));
	gl.deleteShader(shader);
	return null;
};

/**
 * Links a vertex and fragment shader into a WebGL program.
 */
const createProgram = (
	/** The WebGL context  */
	gl: WebGL2RenderingContext,
	/** The compiled vertex shader  */
	vertexShader: WebGLShader,
	/** The compiled fragment shader  */
	fragmentShader: WebGLShader
): WebGLProgram | null => {
	const program = gl.createProgram();
	gl.attachShader(program, vertexShader);
	gl.attachShader(program, fragmentShader);
	gl.linkProgram(program);
	const success = gl.getProgramParameter(program, gl.LINK_STATUS);
	if (success) {
		return program;
	}
	logn.error("shader", `Failed to link program:`, gl.getProgramInfoLog(program));
	gl.deleteProgram(program);
	return null;
};

/**
 * Checks if the canvas needs to be resized and applies the new dimensions.
 */
const resizeCanvasToDisplaySize = (canvas: HTMLCanvasElement): boolean => {
	const displayWidth = canvas.clientWidth;
	const displayHeight = canvas.clientHeight;

	if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
		canvas.width = displayWidth;
		canvas.height = displayHeight;
		return true;
	}
	return false;
};

// region Setup

export type ShaderSourceProps =
	| {
			/** GLSL shader code to inject into the fragment shader template */
			rawGLSL: string;
			url?: string;
	  }
	| {
			/** URL to fetch `glsl` shader code  */
			url: string;
			rawGLSL?: string;
	  };

export type ShaderState = {
	gl: WebGL2RenderingContext | null;
	program: WebGLProgram | null;
	uniformLocations: Record<string, WebGLUniformLocation | null>;
	startTime: number;
	frameTime: number;
	frameCount: number;
};

export const defaultShaderState: ShaderState = {
	// Main Application State
	gl: null,
	program: null,
	uniformLocations: {},
	// Timing and animation
	startTime: 0,
	frameTime: 0,
	frameCount: 0
};

/**
 * The main setup function.
 *
 * Fetches the shader, compiles the program, sets up geometry, and attaches event listeners.
 */
export const setup = async (
	mainImageShader: string,
	s: ShaderState,
	canvas: HTMLCanvasElement
) => {
	s.gl = canvas.getContext("webgl2");
	if (!s.gl) {
		logn.error("shader", "WebGL 2 not supported!");
		return;
	}

	// Create the final fragment shader source
	const fragmentShaderSource = FRAGMENT_SHADER_TEMPLATE.replace(
		"{{mainImageShader}}",
		mainImageShader
	);

	// Compile shaders and link program
	const vertexShader = createShader(s.gl, s.gl.VERTEX_SHADER, VERTEX_SHADER_SOURCE);
	const fragmentShader = createShader(s.gl, s.gl.FRAGMENT_SHADER, fragmentShaderSource);
	if (!vertexShader || !fragmentShader) {
		logn.error("shader", "Failed to create shaders", {
			vertexShader,
			fragmentShader
		});
		return;
	}
	s.program = createProgram(s.gl, vertexShader, fragmentShader);
	if (!s.program) {
		logn.error("shader", "Failed to createProgram", {
			createProgram
		});
		return;
	}

	// Look up uniform locations
	s.uniformLocations = {
		iResolution: s.gl.getUniformLocation(s.program, "iResolution"),
		iTime: s.gl.getUniformLocation(s.program, "iTime"),
		iTimeDelta: s.gl.getUniformLocation(s.program, "iTimeDelta"),
		iFrame: s.gl.getUniformLocation(s.program, "iFrame"),
		iMouse: s.gl.getUniformLocation(s.program, "iMouse"),
		iDate: s.gl.getUniformLocation(s.program, "iDate")
	};

	// Set up geometry for a fullscreen quad
	const positionAttributeLocation = s.gl.getAttribLocation(s.program, "a_position");
	const positionBuffer = s.gl.createBuffer();
	s.gl.bindBuffer(s.gl.ARRAY_BUFFER, positionBuffer);
	const positions = [-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1];
	s.gl.bufferData(s.gl.ARRAY_BUFFER, new Float32Array(positions), s.gl.STATIC_DRAW);

	// Set up Vertex Array Object (VAO)
	const vao = s.gl.createVertexArray();
	s.gl.bindVertexArray(vao);
	s.gl.enableVertexAttribArray(positionAttributeLocation);
	s.gl.vertexAttribPointer(positionAttributeLocation, 2, s.gl.FLOAT, false, 0, 0);

	// Start the render loop
	s.startTime = performance.now();
	s.frameTime = s.startTime;
	requestAnimationFrame((now: DOMHighResTimeStamp) => render(s, now));
};

// region Render

/**
 * The main render loop, called once per frame.
 */
function render(s: ShaderState, now: DOMHighResTimeStamp) {
	// Calculate time and delta
	const elapsedTime = (now - s.startTime) / 1000;
	const deltaTime = (now - s.frameTime) / 1000;
	s.frameTime = now;
	s.frameCount++;

	if (!s.gl || !s.gl.canvas || !s.program) {
		return;
	}

	// Handle window resizing
	resizeCanvasToDisplaySize(s.gl.canvas as HTMLCanvasElement);
	s.gl.viewport(0, 0, s.gl.canvas.width, s.gl.canvas.height);

	// Clear the canvas (optional for a fullscreen shader)
	s.gl.clearColor(0, 0, 0, 0);
	s.gl.clear(s.gl.COLOR_BUFFER_BIT);

	// Use our shader program
	s.gl.useProgram(s.program);

	// Update and set all uniforms
	s.gl.uniform3f(
		s.uniformLocations.iResolution,
		s.gl.canvas.width,
		s.gl.canvas.height,
		1.0
	);
	s.gl.uniform1f(s.uniformLocations.iTime, elapsedTime);
	s.gl.uniform1f(s.uniformLocations.iTimeDelta, deltaTime);
	s.gl.uniform1i(s.uniformLocations.iFrame, s.frameCount);
	s.gl.uniform4f(s.uniformLocations.iMouse, 0, 0, 0, 0); // Skip mouse handling for now

	const date = new Date();
	const seconds =
		date.getHours() * 3600 +
		date.getMinutes() * 60 +
		date.getSeconds() +
		date.getMilliseconds() / 1000;
	s.gl.uniform4f(
		s.uniformLocations.iDate,
		date.getFullYear(),
		date.getMonth(), // Note: Shadertoy month is 0-11, same as JS
		date.getDate(),
		seconds
	);

	// Draw the quad
	s.gl.drawArrays(s.gl.TRIANGLES, 0, 6);

	// Request the next frame
	requestAnimationFrame((now: DOMHighResTimeStamp) => render(s, now));
}
