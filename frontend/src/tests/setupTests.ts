// @ts-nocheck
import { expect } from "vitest";
import matchers from "@testing-library/jest-dom/matchers";

import globalInit from "global/index";

globalInit();
expect.extend(matchers);
