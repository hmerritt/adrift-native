import cx from "classnames";
import { useState } from "react";
import { css } from "@linaria/core";

import theme from "styles";
import { countIncrement } from "store/actions";
import { useDispatch, useSelector, useInterval } from "hooks";

import { GridDnd, Icon, Stack } from "components";

export const Home = () => {
	const dispatch = useDispatch();
	const count = useSelector((state) => state.count.current);

	const [data, setData] = useState(
		[...Array(12)].map((e, i) => ({ id: String(i) }))
	);

	useInterval(() => {
		if (feature("timerIncrement")) {
			dispatch(countIncrement(0.1));
		}
	}, 1000);

	return (
		<div className="Home">
			<Stack spacing={5} center style={{ height: "40vh" }}>
				<h1 className={header}>{count}</h1>
				<h1 style={{ fontSize: "3rem", textAlign: "center" }}>
					<small>useInterval 1000ms</small>
				</h1>
				<Icon name="spinner" />
			</Stack>

			<GridDnd
				data={data}
				setData={setData}
				renderWith={({ id, renderIndex, ...props }) => (
					<div className={cx(card, "flex-center")} {...props}>
						{`${renderIndex} -> ${id}`}
					</div>
				)}
				// grid
				className={grid}
				minWidth={20}
				maxWidth={20}
				gutter={10}
				center
			/>
		</div>
	);
};

// This will get compiled at build time into a css file.
// Why? - Performance is *greatly* improved over something like styled-components which compiles at run time!
const header = css`
	${theme} // Import theme object - can now use all SCSS variables and mixins set in styles/theme.ts
	text-transform: uppercase;
	font-size: 8rem;
	font-weight: thin;
	color: $red-500; // See styles/colors.tsx
	text-align: center;
	text-shadow: $shadow-1; // See styles/shadows.tsx

	// All valid SCSS syntax is valid here (this is just an example)
	@for $i from 1 through 20 {
		.stack.stack-#{$i} {
			& > * {
				margin-top: #{$i}rem;
			}
		}
	}
`;

const grid = css`
	${theme}
	margin: auto;
	padding: 1rem;
	max-width: 900px;
	margin-bottom: 6rem;
`;

const card = css`
	${theme}
	width: 100%;
	height: 200px;
	border-radius: 20px;
	box-shadow: $shadow-1;
	background-color: #fff;
`;
