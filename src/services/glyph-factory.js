/* GlyphFactory */

module.exports = [
    'TELESTRATION_TYPES',
    'ArrowValue',
    'ConeSpotlightValue',
    'CircleValue',
    'FreehandValue',
    'CircleSpotlightValue',
    'TBarValue',
    'TextValue',
    function(
        TELESTRATION_TYPES,
        Arrow,
        ConeSpotlight,
        Circle,
        Freehand,
        CircleSpotlight,
        TBar,
        Text
    ) {

        var createGlyph = function createGlyph(type, containerElement, SVGContext, color) {

            if (!type) throw new Error('createGlyph requires \'type\' parameter');

            var options = {
                color: color
            };

            var glyph;
            switch (type) {
                case TELESTRATION_TYPES.ARROW_SOLID:
                    glyph = new Arrow(TELESTRATION_TYPES.ARROW_SOLID, options, containerElement, SVGContext);
                    break;

                case TELESTRATION_TYPES.ARROW_DASHED:
                    glyph = new Arrow(TELESTRATION_TYPES.ARROW_DASHED, options, containerElement, SVGContext);
                    glyph.setDashedArray();
                    break;

                case TELESTRATION_TYPES.T_BAR_SOLID:
                    glyph = new TBar(TELESTRATION_TYPES.T_BAR_SOLID, options, containerElement, SVGContext);
                    break;

                case TELESTRATION_TYPES.T_BAR_DASHED:
                    glyph = new TBar(TELESTRATION_TYPES.T_BAR_DASHED, options, containerElement, SVGContext);
                    glyph.setDashedArray();
                    break;

                case TELESTRATION_TYPES.CONE_SPOTLIGHT:
                    glyph = new ConeSpotlight(TELESTRATION_TYPES.CONE_SPOTLIGHT, options, containerElement, SVGContext);
                    break;

                case TELESTRATION_TYPES.FREEHAND_SOLID:
                    glyph = new Freehand(TELESTRATION_TYPES.FREEHAND_SOLID, options, containerElement, SVGContext);
                    break;

                case TELESTRATION_TYPES.FREEHAND_DASHED:
                    glyph = new Freehand(TELESTRATION_TYPES.FREEHAND_DASHED, options, containerElement, SVGContext);
                    glyph.setDashedArray();
                    break;

                case TELESTRATION_TYPES.CIRCLE_SOLID:
                    glyph = new Circle(TELESTRATION_TYPES.CIRCLE_SOLID, options, containerElement, SVGContext);
                    break;

                case TELESTRATION_TYPES.CIRCLE_SPOTLIGHT:
                    glyph = new CircleSpotlight(TELESTRATION_TYPES.CIRCLE_SPOTLIGHT, options, containerElement, SVGContext);
                    break;

                case TELESTRATION_TYPES.TEXT:
                    glyph = new Text(TELESTRATION_TYPES.TEXT, options, containerElement);
                    break;
                default:
                    break;
            }

            return glyph;
        };

        var extendGlyph = function extendGlyph(glyph, containerElement, SVGContext) {

            if (!glyph.type) throw new Error('extendGlyph requires \'type\' parameter');

            var extendedGlyph;

            var options = {
                color: glyph.color,
                vertices: glyph.vertices,
                text: glyph.text
            };

            switch (glyph.type) {
                case TELESTRATION_TYPES.ARROW_SOLID:
                    extendedGlyph = new Arrow(TELESTRATION_TYPES.ARROW_SOLID, options, containerElement, SVGContext);
                    break;

                case TELESTRATION_TYPES.ARROW_DASHED:
                    extendedGlyph = new Arrow(TELESTRATION_TYPES.ARROW_DASHED, options, containerElement, SVGContext);
                    extendedGlyph.setDashedArray();
                    break;

                case TELESTRATION_TYPES.T_BAR_SOLID:
                    extendedGlyph = new TBar(TELESTRATION_TYPES.T_BAR_SOLID, options, containerElement, SVGContext);
                    break;

                case TELESTRATION_TYPES.T_BAR_DASHED:
                    extendedGlyph = new TBar(TELESTRATION_TYPES.T_BAR_DASHED, options, containerElement, SVGContext);
                    extendedGlyph.setDashedArray();
                    break;

                case TELESTRATION_TYPES.CONE_SPOTLIGHT:
                    extendedGlyph = new ConeSpotlight(TELESTRATION_TYPES.CONE_SPOTLIGHT, options, containerElement, SVGContext);
                    break;

                case TELESTRATION_TYPES.FREEHAND_SOLID:
                    extendedGlyph = new Freehand(TELESTRATION_TYPES.FREEHAND_SOLID, options, containerElement, SVGContext);
                    break;

                case TELESTRATION_TYPES.FREEHAND_DASHED:
                    extendedGlyph = new Freehand(TELESTRATION_TYPES.FREEHAND_DASHED, options, containerElement, SVGContext);
                    extendedGlyph.setDashedArray();
                    break;

                case TELESTRATION_TYPES.CIRCLE_SOLID:
                    extendedGlyph = new Circle(TELESTRATION_TYPES.CIRCLE_SOLID, options, containerElement, SVGContext);
                    break;

                case TELESTRATION_TYPES.CIRCLE_SPOTLIGHT:
                    extendedGlyph = new CircleSpotlight(TELESTRATION_TYPES.CIRCLE_SPOTLIGHT, options, containerElement, SVGContext);
                    break;

                case TELESTRATION_TYPES.TEXT:
                    extendedGlyph = new Text(TELESTRATION_TYPES.TEXT, options, containerElement, 'display');
                    break;
                default:
                    break;
            }

            return extendedGlyph;

        };

        return {
            createGlyph: createGlyph,
            extendGlyph: extendGlyph
        };
    }
];
