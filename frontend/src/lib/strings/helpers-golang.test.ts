import { expect, test } from "vitest";

import { hasPrefix, hasSuffix, trimPrefix, trimSuffix } from "./helpers-golang";

test("hasPrefix", () => {
	expect(hasPrefix("Hello, World!", "Hello")).toBe(true);
	expect(hasPrefix("ecdf0757-f748-4339-8200-6c09c", "ecdf0757-f748-43")).toBe(true);

	expect(hasPrefix("Hello, World!", "World")).toBe(false);
	expect(hasPrefix("ecdf0757-f748-4339-8200-6c09c", "cdf0757-f748-43")).toBe(false);
});

test("hasSuffix", () => {
	expect(hasSuffix("Hello, World!", "World!")).toBe(true);
	expect(hasSuffix("ecdf0757-f748-4339-8200-6c09c", "48-4339-8200-6c09c")).toBe(true);

	expect(hasSuffix("Hello, World!", "Hello,")).toBe(false);
	expect(hasSuffix("ecdf0757-f748-4339-8200-6c09c", "ecdf0757-f7")).toBe(false);
});

test("trimPrefix", () => {
	expect(trimPrefix("Hello World", "Hello W")).toBe("orld");
	expect(trimPrefix("!@#wow#(*&#/", "!@#w")).toBe("ow#(*&#/");

	expect(trimPrefix("Hello World", " World")).toBe("Hello World");
	expect(trimPrefix("!@#wow#(*&#/", "@#wo")).toBe("!@#wow#(*&#/");
});

test("trimSuffix", () => {
	expect(trimSuffix("Hello World", "o World")).toBe("Hell");
	expect(trimSuffix("!@#wow#(*&#/", "w#(*&#/")).toBe("!@#wo");

	expect(trimSuffix("Hello World", " Hello ")).toBe("Hello World");
	expect(trimSuffix("!@#wow#(*&#/", "(*&#")).toBe("!@#wow#(*&#/");
});
