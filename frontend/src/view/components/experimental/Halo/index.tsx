import * as stylex from "@stylexjs/stylex";
import { Children, cloneElement, isValidElement, useEffect, useRef } from "react";

import { isMobile } from "lib/device";
import { useEventListener } from "lib/hooks";
import { type SxProp } from "lib/type-assertions";

export type HaloProps = React.JSX.IntrinsicElements["div"] & SxProp;
export type HaloProviderProps = {
	children: React.ReactNode;
	staticForMobile?: boolean;
	gradient?: {
		size?: string;
		halo?: string;
		background?: string;
	};
};

/**
 * Animated halo/glow effect around a box.
 *
 * Tracks and updates according to the mouse position.
 */
export const Halo = ({ sx, children, ...divProps }: HaloProps) => {
	return (
		<div {...divProps} {...stylex.props(styles.halo, sx)} data-halo>
			{Children.map(children, (child) => {
				if (isValidElement(child)) {
					return cloneElement(child, {
						...stylex.props(styles.haloChild)
					});
				}
				return child;
			})}
		</div>
	);
};

/**
 * Provider for `<Halo />` effect (does all the heavy lifting).
 *
 * @Important Wrap your app with this provider. This is required for `<Halo />` to work!
 */
export const HaloProvider = ({
	children,
	staticForMobile = false,
	gradient
}: HaloProviderProps) => {
	const state = useRef({ x: 0, y: 0, stopUpdates: false });

	const { size, halo, background } = {
		size: "24rem",
		halo: "rgb(120, 120, 120)",
		background: "rgb(255, 255, 255)",
		...(gradient ? gradient : {})
	};

	const updateAllHalos = () => {
		const { x, y } = state.current || { x: 0, y: 0 };

		const $elements = document.querySelectorAll("[data-halo]");
		$elements.forEach(($element: any) => {
			// Stop on mobile
			if (staticForMobile && isMobile) {
				$element.style.background = `${halo}`;
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
			} at ${x - left}px ${y - top}px, ${halo}, ${background})`;
		});
	};

	// Global halo functionality
	useEventListener("mousemove", (evt) => {
		if (isMobile || state.current.stopUpdates) return;
		const { x, y } = (evt as MouseEvent) || {};
		if (x != null || y != null) state.current = { ...state.current, x: x, y: y };
		updateAllHalos();
	});

	useEventListener("scroll", (_) => {
		if (state.current.stopUpdates) return;

		if (isMobile) {
			state.current = {
				...state.current,
				x: window.innerWidth / 2,
				y: window.innerHeight / 3
			};
			updateAllHalos();
			return;
		}

		const event = new Event("mousemove");
		window.dispatchEvent(event); // Trigger mousemove on scroll
	});

	useEffect(() => {
		const event = new Event("scroll");
		window.dispatchEvent(event); // Trigger mousemove on load
	}, []);

	// @TODO: change styles via props/theme (dark/light)
	// @TODO: use theme when setting styles.

	return children;
};

const styles = stylex.create({
	// Fill parent container
	halo: {
		borderRadius: "8px",
		padding: "1px"
	},
	haloChild: {
		backgroundColor: "white",
		borderRadius: "7px"
	}
});
