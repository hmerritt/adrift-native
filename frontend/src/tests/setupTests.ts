import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach, vi } from "vitest";

import { injectLog } from "lib/global/log";
import { injectGo } from "lib/global/utils";

import "../lib/styles/stylex.css";

injectGo();
injectLog();
global.envGet = vi.fn();
global.feature = vi.fn();

HTMLCanvasElement.prototype.getContext = vi.fn();

afterEach(() => {
	cleanup();
});
