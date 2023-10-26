import { css, cx } from "@linaria/core";

export type ContainerProps = JSX.IntrinsicElements["div"] & {
	width?: string;
	padding?: string;
};

// @TODO: improve this

export const Container = ({
	className,
	padding,
	style,
	width = "1320px",
	...props
}: ContainerProps) => {
	style = { ...style, padding, maxWidth: width };
	return <div className={cx(container, className)} style={style} {...props} />;
};

const container = css`
	position: relative;
	width: 100%;
	margin: auto;
	padding: 0 2rem;

	@media screen and (max-width: 768px) {
		padding: 0 1rem;
	}
`;
