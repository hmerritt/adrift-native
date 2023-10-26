import { Ref, SVGProps } from "react";

import * as Icons from "./subComponents";

// Infer the type of IconMappings, then extract the keys from the type it infers
export type IconsAvailable = keyof typeof Icons;

type IconProps = SVGProps<SVGSVGElement> & {
	name: IconsAvailable;
	animate?: string; // Try to make a class in `keyframes.scss` instead of using this prop
	ref?: Ref<SVGSVGElement>;
};

export const Icon = ({ name, animate, style = {}, ...svgProps }: IconProps) => {
	const styles = animate ? { animation: animate, ...style } : style;
	const IconComponent = Icons?.[name];
	return <IconComponent {...svgProps} style={styles} />;
};
