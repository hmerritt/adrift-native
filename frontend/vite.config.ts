import { TanStackRouterVite } from "@tanstack/router-vite-plugin";
import react from "@vitejs/plugin-react";
import { injectManifest } from "rollup-plugin-workbox";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import type { UserConfig as VitestUserConfig } from "vitest/config";

import linaria from "./config/linaria-rollup";

const isDev = process.env.NODE_ENV !== "production";

// https://vitejs.dev/config/
export default defineConfig({
	build: {
		sourcemap: isDev,
		minify: true
	},
	define: {
		"process.env": {}
	},
	plugins: [
		react(),
		tsconfigPaths(),
		TanStackRouterVite({
			routesDirectory: "src/view/routes"
		}),
		linaria({
			sourceMap: isDev,
			preprocessor: "none",
			exclude: ["src/global/**", "**/*.test.{ts,tsx}"],
			include: ["**/*.{ts,tsx}"]
		}),
		injectManifest({
			swDest: "dist/sw.js",
			globDirectory: "dist",
			swSrc: "src/service-worker.ts",
			maximumFileSizeToCacheInBytes: 10 * 1024 * 1024
		})
	],
	test: {
		// https://vitest.dev/api/
		globals: false,
		environment: "happy-dom",
		setupFiles: "./src/tests/setupTests.ts",
		css: true, // @Note Parsing CSS is slow
		exclude: ["node_modules", "tests-e2e", "dist", ".idea", ".git", ".cache"],
		coverage: {
			enabled: false,
			provider: "v8"
		},
		benchmark: {
			include: ["**/*.{bench,benchmark}.?(c|m)[jt]s?(x)"],
			exclude: ["node_modules", "tests-e2e", "dist", ".idea", ".git", ".cache"]
		},
		// Debug
		logHeapUsage: true
	}
});
