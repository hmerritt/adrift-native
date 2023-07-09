import { css, cx } from "@linaria/core";

import theme from "lib/styles";

/**
 * Mini mock component to test `@linaria` theme injection works.
 *
 * Test in `styles/index.test.tsx`.
 */

export const StylesMock = () => (
	<div className={cx(container, shadow, variable)}>
		<h1 className={title}>Title</h1>
		<h2 className={subTitle}>Sub Title</h2>
	</div>
);

const container = css`
	${theme}
	@include container(567px);
`;

const shadow = css`
	${theme}
	box-shadow: $test-shadow-1;
`;

const variable = css`
	${theme}
	width: $test-var-1;
`;

const title = css`
	${theme}
	color: $test-color-100;
`;

const subTitle = css`
	${theme}
	color: $test-color-200;
`;

export default StylesMock;
