import { styled } from "@linaria/react";

export type FullscreenProps = JSX.IntrinsicElements["div"] & {
	position?: "absolute" | "fixed" | "relative";
	zIndex?: number;
	center?: boolean;
	overflow?: "hidden" | "auto";
	padding?: string;
};

export const Fullscreen = styled.div<FullscreenProps>`
	top: 0;
	left: 0;
	width: 100vw;
	height: 100vh;
	align-items: center;
	justify-content: center;
	z-index: ${({ zIndex }: any) => zIndex ?? 0};
	padding: ${({ padding }: any) => padding ?? "inherit"};
	overflow: ${({ overflow }: any) => overflow ?? "hidden"};
	position: ${({ position }: any) => position ?? "relative"};
	display: ${({ center }: any) => (!center ? "block" : "flex")};
`;
