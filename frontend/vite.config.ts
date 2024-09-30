import * as sass from "sass";
//@ts-ignore Complaining that the export does not exist, when in fact it does
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react";
import linaria from "@wyw-in-js/vite";
import { injectManifest } from "rollup-plugin-workbox";
import { type UserConfig, defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { type InlineConfig } from "vitest";

const isDev = process.env.NODE_ENV !== "production";

interface ViteConfig extends UserConfig {
	test: InlineConfig;
}

// https://vitejs.dev/config/
export default defineConfig({
	build: {
		sourcemap: isDev,
		minify: true
	},
	define: {
		"process.env": {}
	},
	css: {
		preprocessorOptions: {
			scss: {
				api: "modern-compiler"
			}
		}
	},
	plugins: [
		react(),
		tsconfigPaths(),
		TanStackRouterVite({
			routesDirectory: "src/view/routes"
		}),
		linaria({
			sourceMap: isDev,
			preprocessor: (selector, cssText) => {
				try {
					const result = sass.compileString(`${selector} {${cssText}}\n`);
					return result.css.toString();
				} catch (error) {
					console.error("Error processing SCSS:", error);
					return "";
				}
			},
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
} as ViteConfig);
