import * as stylex from "@stylexjs/stylex";
import { FC } from "react";

import { Ripple } from "view/components/experimental";

import { WindowIcon } from "./icons";

export type WindowControlsProps = {
	type?: "default" | "mac";
	onClose?: () => void;
	onMinimize?: () => void;
	onMaximize?: () => void;
};

/**
 * Controls to handle window minimisation, maximisation and closing.
 *
 * Used for frameless windows.
 */
export const WindowControls: FC<WindowControlsProps> = ({
	onClose,
	onMinimize,
	onMaximize
}) => {
	return (
		// @TODO Icons - separate icons for mac and windows?
		<div {...stylex.props(styles.controls)}>
			{onClose && (
				<Ripple
					sx={[styles.controlMac, styles.controlMacClose]}
					onClick={onClose}
				>
					<WindowIcon name="MacClose" sx={styles.controlMacSvg} />
				</Ripple>
			)}
			{onMinimize && (
				<Ripple
					sx={[styles.controlMac, styles.controlMacMinimize]}
					onClick={onMinimize}
				>
					<WindowIcon name="MacMinimize" sx={styles.controlMacSvg} />
				</Ripple>
			)}
			{onMaximize && (
				<Ripple
					sx={[styles.controlMac, styles.controlMacMaximize]}
					onClick={onMaximize}
				>
					<WindowIcon name="MacMaximize" sx={styles.controlMacSvg} />
				</Ripple>
			)}
		</div>
	);
};

const styles = stylex.create({
	controlMac: {
		alignItems: "center",
		borderRadius: "100%",
		cursor: "pointer",
		display: "flex",
		height: "1.4rem",
		justifyContent: "center",
		width: "1.4rem"
	},
	controlMacClose: {
		backgroundColor: "#fc5753",
		borderColor: "#df4744",
		borderStyle: "solid",
		borderWidth: "0.1rem"
	},
	controlMacMaximize: {
		backgroundColor: "#33c748",
		borderColor: "#27aa35",
		// This button is sometimes gray ??!!
		// backgroundColor: "#ded8dc",
		// border: "0.1rem solid #cac4c8"
		borderStyle: "solid",
		borderWidth: "0.1rem"
	},
	controlMacMinimize: {
		backgroundColor: "#fdbc40",
		borderColor: "#de9f34",
		borderStyle: "solid",
		borderWidth: "0.1rem"
	},
	controlMacSvg: {
		height: "1.1rem",
		opacity: {
			default: 0,
			":hover": 1
		},
		transition: "opacity 150ms ease-in-out",
		width: "1.1rem"
	},
	controls: {
		// eslint-disable-next-line @stylexjs/valid-styles
		"--runtime-draggable": "drag",
		alignItems: "center",
		display: "flex",
		flexDirection: "row",
		gap: "1rem",
		justifyContent: "center",
		position: "relative"
	}
});
