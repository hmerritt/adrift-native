import * as stylex from "@stylexjs/stylex";
import { createLazyFileRoute } from "@tanstack/react-router";

import { colors } from "../../../lib/styles/colors.stylex";
import { shadowFn, shadows } from "../../../lib/styles/shadows.stylex";
import { variables } from "../../../lib/styles/variables.stylex";

/**
 * Mini route to test StyleX styles are being compiled correctly.
 */

export const Route = createLazyFileRoute("/tests/style")({
	component: TestStylesRoute
});

function TestStylesRoute() {
	return (
		<div
			data-testid="container"
			{...stylex.props(styles.container, styles.shadow, styles.variable)}
		>
			<h1
				data-testid="title"
				{...stylex.props(styles.title, shadowFn.textBlock(colors.test1))}
			>
				Title
			</h1>
			<h2 data-testid="sub-title" {...stylex.props(styles.subTitle)}>
				Sub Title
			</h2>
			<span
				data-testid="box-shadow"
				{...stylex.props(shadowFn.boxBlock(colors.test2))}
			>
				Box Shadow Fn
			</span>
		</div>
	);
}

const styles = stylex.create({
	container: {
		marginLeft: "auto",
		marginRight: "auto",
		maxWidth: "567px",
		transition: "all, 80ms, ease"
	},
	shadow: {
		boxShadow: shadows.test2
	},
	subTitle: {
		color: colors.test2
	},
	title: {
		color: colors.test1
	},
	variable: {
		width: variables.test1
	}
});
