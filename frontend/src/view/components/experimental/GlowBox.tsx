import { useEffect, useRef } from "react";
import { css, cx } from "@linaria/core";
import { isMobile } from "react-device-detect";

import { useEventListener } from "lib/hooks";

export type GlowBoxProps = JSX.IntrinsicElements["div"];
export type GlowBoxProvider = {
	children: React.ReactNode;
	staticForMobile?: boolean;
	gradient?: {
		size?: string;
		glow?: string;
		background?: string;
	};
};

/**
 * Animated glow effect around a box.
 */
export const GlowBox = ({ children, className, ...divProps }: GlowBoxProps) => {
	return (
		<div {...divProps} className={cx(glowBox, className)} data-glow>
			{children}
		</div>
	);
};

/**
 * Wrap your app with this provider.
 *
 * This is required for `<GlowBox />` to work!
 */
export const GlowBoxProvider = ({
	children,
	staticForMobile = false,
	gradient
}: GlowBoxProvider) => {
	const state = useRef({ x: 0, y: 0, stopUpdates: false });

	const { size, glow, background } = {
		size: "24rem",
		glow: "rgb(120, 120, 120)",
		background: "rgb(255, 255, 255)",
		...(gradient ? gradient : {})
	};

	const updateAllGlowBoxes = () => {
		const { x, y } = state.current || { x: 0, y: 0 };

		const $elements = document.querySelectorAll("[data-glow]");
		$elements.forEach(($element: any) => {
			// Stop on mobile
			if (staticForMobile && isMobile) {
				$element.style.background = `${glow}`;
				state.current = { ...state.current, stopUpdates: true };
				return;
			}

			const { top, bottom, left, right } = $element.getBoundingClientRect();
			const padding = {
				x: window.innerWidth / 2.5 > 300 ? window.innerWidth / 2.5 : 300,
				y: window.innerHeight / 2.5 > 300 ? window.innerHeight / 2.5 : 300
			};

			// Shut up and calculate.
			//
			// Is the mouse within the element (plus padding)
			const isMouseWithinElement =
				x >= left - padding.x &&
				x <= right + padding.x &&
				y >= top - padding.y &&
				y <= bottom + padding.y;

			if (!isMouseWithinElement && !isMobile) return;

			$element.style.background = `radial-gradient(${
				!isMobile ? size : "90vw"
			} at ${x - left}px ${y - top}px, ${glow}, ${background})`;
		});
	};

	// Global glowBox functionality
	useEventListener("mousemove", (evt) => {
		if (isMobile || state.current.stopUpdates) return;
		const { x, y } = (evt as MouseEvent) || {};
		if (x != null || y != null) state.current = { ...state.current, x: x, y: y };
		updateAllGlowBoxes();
	});

	useEventListener("scroll", (evt) => {
		if (state.current.stopUpdates) return;

		if (isMobile) {
			state.current = {
				...state.current,
				x: window.innerWidth / 2,
				y: window.innerHeight / 3
			};
			updateAllGlowBoxes();
			return;
		}

		const event = new Event("mousemove");
		window.dispatchEvent(event); // Trigger mousemove on scroll
	});

	useEffect(() => {
		const event = new Event("scroll");
		window.dispatchEvent(event); // Trigger mousemove on load
	}, []);

	// @TODO: change styles via props/theme
	// @TODO: use theme when setting styles.

	return children;
};

// Fill parent container
const glowBox = css`
	padding: 1px;
	border-radius: 8px;

	& > * {
		border-radius: 7px;
		background-color: white;
	}
`;
