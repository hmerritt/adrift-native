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

    /* Scrollbar styles */
    @mixin scrollbar($width: 1rem, $height: 1rem, $bgTrack: transparent, $bgThumb: lighten(#181818, 60%), $bgThumbHover: lighten(#181818, 40%)) {
        ::-webkit-scrollbar {
            width: $width;
            height: $height;
        }
        ::-webkit-scrollbar-track {
            border-radius: 1000px;
            background: $bgTrack;
        }
        ::-webkit-scrollbar-thumb {
            border-radius: 1000px;
            background: $bgThumb;
        }
        ::-webkit-scrollbar-thumb:hover {
            background: $bgThumbHover;
        }
    }
`;

export default mixins;
