
module.exports = [
    'TELESTRATION_TYPES',
    'ArrowValue',
    'ConeSpotlightValue',
    'CircleValue',
    'FreehandValue',
    'CircleSpotlightValue',
    'TBarValue',
    'TextBoxValue',
    function(
        TELESTRATION_TYPES,
        Arrow,
        ConeSpotlight,
        Circle,
        Freehand,
        CircleSpotlight,
        TBar,
        TextBox
    ) {

        var createGlyph = function createGlyph(type, SVGContext) {

            if (!type) throw new Error('createShape requires \'type\' parameter');

            var glyph;

            switch (type) {

                case TELESTRATION_TYPES.ARROW:
                    glyph = new Arrow(TELESTRATION_TYPES.ARROW, SVGContext);
                    break;

                case TELESTRATION_TYPES.T_BAR:
                    glyph = new TBar(TELESTRATION_TYPES.T_BAR, SVGContext);
                    break;

                case TELESTRATION_TYPES.CONE_SPOTLIGHT:
                    glyph = new ConeSpotlight(TELESTRATION_TYPES.CONE_SPOTLIGHT, SVGContext);
                    break;

                case TELESTRATION_TYPES.FREEHAND:
                    glyph = new Freehand(TELESTRATION_TYPES.FREEHAND, SVGContext);
                    break;

                case TELESTRATION_TYPES.CIRCLE:
                    glyph = new Circle(TELESTRATION_TYPES.CIRCLE, SVGContext);
                    break;

                case TELESTRATION_TYPES.CIRCLE_SPOTLIGHT:
                    glyph = new CircleSpotlight(TELESTRATION_TYPES.CIRCLE_SPOTLIGHT, SVGContext);
                    break;

                case TELESTRATION_TYPES.TEXT_TOOL:
                    glyph = new TextBox(TELESTRATION_TYPES.TEXT_TOOL, SVGContext);
                    break;
            }

            return glyph;
        };

        return {
            createGlyph: createGlyph
        };
    }
];
