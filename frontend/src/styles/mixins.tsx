//
// Try to sort alphabetically
const mixins = `
    @mixin container($size: 192rem) {
        max-width: $size;
        margin-left: auto;
        margin-right: auto;
        transition: all, 80ms, ease;
    }

    /* Grid: RAM (Repeat, Auto, Minmax) */
    @mixin gridColumnsRAM($min: 150px, $max: 1fr) {
        grid-template-columns: repeat(auto-fit, minmax($min, $max));
    }

    /* Grid: repeat(7, minmax(0, 1fr)) */
    @mixin gridColumns($fitCount: 2, $min: 0, $max: 1fr) {
        grid-template-columns: repeat($fitCount, minmax($min, 1fr));
    }
`;

export default mixins;
