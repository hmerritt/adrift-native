import { css } from "@linaria/core";
import { useState } from "react";

import { useEventListener, useInterval } from "lib/hooks";
import theme from "lib/styles";

/**
 * SVG Wave
 */
export const Waves = () => {
	const [waveState, setWaveState] = useState(0);
	const [fillHeight, setFillHeight] = useState(0);

	useInterval(() => {
		setWaveState((waveState + 1) % waveStates.length);
	}, 600);

	useEventListener("scroll", () => {
		// Set height of wave fill.
		// As user scrolls down, height increases
		const max = window.innerHeight * 0.8;
		const multiplier = max / 100;
		let percent = window.scrollY / multiplier;
		if (percent > 150) percent = 150;
		setFillHeight(percent);

		// Set wave state
		const timer = setTimeout(
			() => setWaveState((waveState + 1) % waveStates.length),
			600
		);

		return () => {
			clearTimeout(timer);
		};
	});

	return (
		<div className={waveContainer}>
			<div>
				<svg
					className={wave}
					viewBox="0 0 1440 320"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path d={waveStates[waveState]} />
				</svg>
			</div>
			<div className={waveFill} style={{ height: `${fillHeight}vh` }} />
		</div>
	);
};

const waveContainer = css`
	position: absolute;
	top: 0;
	bottom: 0;
	left: 0;
	right: 0;
	z-index: -1;
	display: flex;
	flex-direction: column;
	justify-content: flex-end;
	/* transform: rotate(180deg); */

	& > div {
		width: 100%;
	}
`;

const wave = css`
	${theme}
	width: 100%;
	height: auto;
	flex-shrink: 1;

	path {
		fill: lighten($blue-100, 8%);
		transform-origin: 0px 0px;
		transition: all 800ms ease 0s;
	}
`;

const waveFill = css`
	${theme}
	width: 100%;
	height: 30vh;
	margin-top: -0.5rem;
	transition: all 100ms ease 0s;
	background-color: lighten($blue-100, 8%);
`;

const waveStates = [
	"M0,192L48,181.3C96,171,192,149,288,160C384,171,480,213,576,229.3C672,245,768,235,864,224C960,213,1056,203,1152,197.3C1248,192,1344,192,1392,192L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z",
	"M0,256L48,218.7C96,181,192,107,288,80C384,53,480,75,576,96C672,117,768,139,864,144C960,149,1056,139,1152,138.7C1248,139,1344,149,1392,154.7L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z",
	"M0,256L48,245.3C96,235,192,213,288,197.3C384,181,480,171,576,186.7C672,203,768,245,864,234.7C960,224,1056,160,1152,117.3C1248,75,1344,53,1392,42.7L1440,32L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z",
	"M0,160L48,160C96,160,192,160,288,181.3C384,203,480,245,576,261.3C672,277,768,267,864,234.7C960,203,1056,149,1152,154.7C1248,160,1344,224,1392,256L1440,288L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z",
	"M0,288L48,261.3C96,235,192,181,288,170.7C384,160,480,192,576,218.7C672,245,768,267,864,277.3C960,288,1056,288,1152,277.3C1248,267,1344,245,1392,234.7L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z",
	"M0,64L48,101.3C96,139,192,213,288,234.7C384,256,480,224,576,213.3C672,203,768,213,864,224C960,235,1056,245,1152,229.3C1248,213,1344,171,1392,149.3L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z",
	"M0,288L48,245.3C96,203,192,117,288,117.3C384,117,480,203,576,208C672,213,768,139,864,96C960,53,1056,43,1152,53.3C1248,64,1344,96,1392,112L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z",
	"M0,128L48,149.3C96,171,192,213,288,208C384,203,480,149,576,154.7C672,160,768,224,864,218.7C960,213,1056,139,1152,133.3C1248,128,1344,192,1392,224L1440,256L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
];
