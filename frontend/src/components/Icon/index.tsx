import { Ref, SVGProps } from "react";
import * as Icons from "./subComponents";

const IconMappings = {
	refresh: Icons.Refresh,
	spinner: Icons.Spinner
};

// Infer the type of IconMappings, then extract the keys from the type it infers
export type IconMappingsType = keyof typeof IconMappings;

type IconProps = SVGProps<SVGSVGElement> & {
	name: IconMappingsType;
	animate?: string; // Try to make a class in `keyframes.scss` instead of using this prop
	ref?: Ref<SVGSVGElement>;
};

export const Icon = ({ name, animate, style = {}, ...svgProps }: IconProps) => {
	const styles = animate ? { animation: animate, ...style } : style;
	const IconComponent = IconMappings?.[name];
	return <IconComponent {...svgProps} style={styles} />;
};
