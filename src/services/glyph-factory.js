
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

        var createGlyph = function createGlyph(type, SVGContext, color) {

            if (!type) throw new Error('createShape requires \'type\' parameter');

            var glyph;
            switch (type) {
                case TELESTRATION_TYPES.ARROW_SOLID:
                    glyph = new Arrow(TELESTRATION_TYPES.ARROW_SOLID, SVGContext, color);
                    break;

                case TELESTRATION_TYPES.ARROW_DASHED:
                    glyph = new Arrow(TELESTRATION_TYPES.ARROW_DASHED, SVGContext, color);
                    glyph.setDashedArray();
                    break;

                case TELESTRATION_TYPES.T_BAR_SOLID:
                    glyph = new TBar(TELESTRATION_TYPES.T_BAR_SOLID, SVGContext, color);
                    break;

                case TELESTRATION_TYPES.T_BAR_DASHED:
                    glyph = new TBar(TELESTRATION_TYPES.T_BAR_DASHED, SVGContext, color);
                    glyph.setDashedArray();
                    break;

                case TELESTRATION_TYPES.CONE_SPOTLIGHT:
                    glyph = new ConeSpotlight(TELESTRATION_TYPES.CONE_SPOTLIGHT, SVGContext, color);
                    break;

                case TELESTRATION_TYPES.FREEHAND_SOLID:
                    glyph = new Freehand(TELESTRATION_TYPES.FREEHAND_SOLID, SVGContext, color);
                    break;

                case TELESTRATION_TYPES.FREEHAND_DASHED:
                    glyph = new Freehand(TELESTRATION_TYPES.FREEHAND_DASHED, SVGContext, color);
                    glyph.setDashedArray();
                    break;

                case TELESTRATION_TYPES.CIRCLE_SOLID:
                    glyph = new Circle(TELESTRATION_TYPES.CIRCLE_SOLID, SVGContext, color);
                    break;

                case TELESTRATION_TYPES.CIRCLE_SPOTLIGHT:
                    glyph = new CircleSpotlight(TELESTRATION_TYPES.CIRCLE_SPOTLIGHT, SVGContext, color);
                    break;

                case TELESTRATION_TYPES.TEXT:
                    glyph = new TextBox(TELESTRATION_TYPES.TEXT, SVGContext, color);
                    break;
            }

            return glyph;
        };

        return {
            createGlyph: createGlyph
        };
    }
];
