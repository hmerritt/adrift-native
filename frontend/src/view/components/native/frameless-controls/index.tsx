import { css, cx } from "@linaria/core";

export const FramelessControls = () => {
	return (
		// @TODO Icons - separate icons for mac and windows?
		<div className={framelessControls}>
			<button onClick={() => (window as any)?.runtime?.WindowMinimise()}>
				min
			</button>
			<button onClick={() => (window as any)?.runtime?.WindowToggleMaximise()}>
				max
			</button>
			<button onClick={() => (window as any)?.runtime?.Quit()}>close</button>
		</div>
	);
};

const framelessControls = css`
	position: fixed;
	top: 0;
	right: 0;
	z-index: 99999999999;
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: center;
	gap: 8px;
	--runtime-draggable: drag;
`;
