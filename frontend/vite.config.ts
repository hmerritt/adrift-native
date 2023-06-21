// @ts-nocheck
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

import linaria from "./config/linaria-rollup";

// https://vitejs.dev/config/
export default defineConfig({
	build: {
		sourcemap: false,
		minify: true
	},
	define: {
		"process.env": {}
	},
	plugins: [
		react({
			// jsxRuntime: "classic",
			babelrc: true,
			configFile: true
		}),
		tsconfigPaths(),
		linaria({
			sourceMap: false,
			extension: ".scss",
			preprocessor: "none",
			exclude: ["src/global/**"]
		})
	],
	test: {
		// https://vitest.dev/api/
		globals: false,
		environment: "happy-dom",
		setupFiles: "./src/tests/setupTests.ts",
		// Parsing CSS is slow
		css: false
	}
});
