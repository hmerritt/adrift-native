import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

import globalInit from "lib/global/index";

globalInit();

afterEach(() => {
	cleanup();
});
