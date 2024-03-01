import { css, cx } from "@linaria/core";
import { FC } from "react";

import { MacClose, MacMaximize, MacMinimize } from "./icons";

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
	type,
	onClose,
	onMinimize,
	onMaximize
}) => {
	return (
		// @TODO Icons - separate icons for mac and windows?
		<div className={controls}>
			{onClose && (
				<div className={cx(controlMac, controlMacClose)} onClick={onClose}>
					<MacClose />
				</div>
			)}
			{onMinimize && (
				<div className={cx(controlMac, controlMacMinimize)} onClick={onMinimize}>
					<MacMinimize />
				</div>
			)}
			{onMaximize && (
				<div className={cx(controlMac, controlMacMaximize)} onClick={onMaximize}>
					<MacMaximize />
				</div>
			)}
		</div>
	);
};

const controls = css`
	position: relative;
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: center;
	gap: 0.9rem;
	--runtime-draggable: drag;
`;

const controlMac = css`
	cursor: pointer;
	width: 1.4rem;
	height: 1.4rem;
	border-radius: 100%;
	display: flex;
	align-items: center;
	justify-content: center;

	svg {
		opacity: 0;
		width: 1.2rem;
		height: 1.2rem;
	}

	&:hover svg {
		opacity: 1;
	}
`;

const controlMacClose = css`
	background-color: #fc5753;
	border: 0.1rem solid #df4744;
`;

const controlMacMinimize = css`
	background-color: #fdbc40;
	border: 0.1rem solid #de9f34;
`;

const controlMacMaximize = css`
	background-color: #33c748;
	border: 0.1rem solid #27aa35;

	// This button is sometimes gray ??!!
	/* background-color: #ded8dc;
	border: 0.1rem solid #cac4c8; */
`;
