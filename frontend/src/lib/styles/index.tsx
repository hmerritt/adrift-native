import colors from "./colors";
import mixins from "./mixins";
import shadows from "./shadows";
import variables from "./variables";

/**
 * Main SCSS-in-JS theme object.
 *
 * Interpolate this into linaria css`${theme}` to use colours, mixins & variables.
 */
const theme = `
    ${variables}
    ${colors}
    ${shadows}
    ${mixins}
`;

export default theme;
