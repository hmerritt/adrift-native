import { css, cx } from "@linaria/core";
import { useCallback, useEffect, useRef, useState } from "react";

export type FrostedGlassProps = JSX.IntrinsicElements["div"] & {
	/** Pane direction */
	paneDirection?: "row" | "column";
	/** Target maximum width of each pane (only used when `paneDirection` is set to `row`) */
	paneMaxWidth?: number;
	/** Target maximum height of each pane (only used when `paneDirection` is set to `column`) */
	paneMaxHeight?: number;
	/** Initial number of panes shown before first render (pane count is re-calculated after component mounts) */
	paneInitialCount?: number;
	/** Recalculate pane count on window resize (responsive, but may impact performance) */
	reactToWindowResize?: boolean;
};

/**
 * Frosted glass effect.
 *
 * Items behind the glass will be blurred (on the other side of a translucent glass pane).
 *
 * Inspired by Anders Tornblad's codepen: https://jsfiddle.net/atornblad/35orypsL/1/
 */
export const FrostedGlass: React.FC<FrostedGlassProps> = ({
	children,
	className,
	paneDirection = "row",
	paneMaxWidth = 25,
	paneMaxHeight = 25,
	paneInitialCount = 5,
	reactToWindowResize = true,
	...divProps
}) => {
	const $div = useRef<HTMLDivElement>(null);

	const [paneCount, setPaneCount] = useState(paneInitialCount);

	const calculatePaneCount = useCallback(() => {
		if (!$div.current) return;

		const paneCalc =
			paneDirection === "row"
				? $div.current?.clientWidth / paneMaxWidth
				: $div.current?.clientHeight / paneMaxHeight;

		setPaneCount(Math.floor(paneCalc) || paneInitialCount);
	}, [paneDirection, paneInitialCount, paneMaxHeight, paneMaxWidth]);

	useEffect(() => {
		calculatePaneCount();

		if (reactToWindowResize) {
			window.addEventListener("resize", calculatePaneCount);
		}

		return () => {
			window.removeEventListener("resize", calculatePaneCount);
		};
	}, [reactToWindowResize, calculatePaneCount]);

	return (
		<div ref={$div} {...divProps} className={cx(frostedGlass, className)}>
			{children}

			<div className={cx(paneContainer, paneDirection)}>
				{[...Array(paneCount).keys()].map((i) => (
					<div key={i} className={cx(pane, paneDirection)} />
				))}
			</div>
		</div>
	);
};

const frostedGlass = css`
	position: relative;
`;

const paneContainer = css`
	position: absolute;
	z-index: -2;
	inset: 0;
	display: flex;
	align-items: stretch;
	width: 100%;
	height: 100%;

	&.row {
		flex-direction: row;
	}

	&.column {
		flex-direction: column;
	}
`;

const pane = css`
	flex: 1;
	backdrop-filter: blur(8px);
	background: linear-gradient(
		to right,
		rgba(255, 255, 255, 0.2),
		rgba(255, 255, 255, 0.1)
	);

	&.row {
		height: 100%;
	}

	&.column {
		width: 100%;
	}
`;
