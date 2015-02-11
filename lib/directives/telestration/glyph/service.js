
module.exports = [
    'TELESTRATION_TYPES',
    'ArrowFactory',
    'ConeSpotlightFactory',
    'CircleFactory',
    'FreehandFactory',
    'CircleSpotlightFactory',
    'TBarFactory',
    'TextBoxFactory',
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

        var createGlyph = function createGlyph(type) {

            if (!type) throw new Error('createShape requires \'type\' parameter');

            var glyph;

            switch (type) {

                case TELESTRATION_TYPES.ARROW:
                    glyph = new Arrow();
                    break;

                case TELESTRATION_TYPES.T_BAR:
                    glyph = new TBar();
                    break;

                case TELESTRATION_TYPES.CONE_SPOTLIGHT:
                    glyph = new ConeSpotlight();
                    break;

                case TELESTRATION_TYPES.FREEHAND:
                    glyph = new Freehand();
                    break;

                case TELESTRATION_TYPES.CIRCLE:
                    glyph = new Circle();
                    break;

                case TELESTRATION_TYPES.CIRCLE_SPOTLIGHT:
                    glyph = new CircleSpotlight();
                    break;

                case TELESTRATION_TYPES.TEXT_TOOL:
                    glyph = new TextBox();
                    break;
            }

            return glyph;
        };

        return {
            createGlyph: createGlyph
        };
    }
];
