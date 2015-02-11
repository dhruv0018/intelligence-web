require('./Shape');
require('./ShadowShape');
require('./arrow');
require('./tbar');
require('./circle');
require('./shadow-circle');
require('./cone');
require('./freehand');
require('./textbox');


var GlyphShapes = angular.module('GlyphShapes', [
    'GlyphShapes.ArrowShape',
    'GlyphShapes.TBarShape',
    'GlyphShapes.CircleShape',
    'GlyphShapes.ShadowCircleShape',
    'GlyphShapes.ConeShape',
    'GlyphShapes.FreehandShape',
    'GlyphShapes.TextBoxShape',
    'GlyphShapes.Shape',
    'GlyphShapes.ShadowShape'
]);

GlyphShapes.value('GlyphShapesConstants', {
    STROKE_WIDTH: 8,
    DEFAULT_COLOR: '#FFFF00',
    T_BAR_LENGTH: 100,
    TEXT_TOOL_HINT_TEXT: 'Enter text here',
    ARROW_SIDE_LENGTH: 10
});

GlyphShapes.service('GlyphsFactory', [
    'TELESTRATION_TYPES',
    'ArrowFactory',
    'TBarFactory',
    'CircleFactory',
    'ShadowCircleFactory',
    'ConeFactory',
    'FreehandFactory',
    'TextBoxFactory',
    function(
        TELESTRATION_TYPES,
        Arrow,
        TBar,
        Circle,
        ShadowCircle,
        Cone,
        Freehand,
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

                case TELESTRATION_TYPES.CONE:
                    glyph = new Cone();
                    break;

                case TELESTRATION_TYPES.FREEHAND:
                    glyph = new Freehand();
                    break;

                case TELESTRATION_TYPES.CIRCLE:
                    glyph = new Circle();
                    break;

                case TELESTRATION_TYPES.SHADOW_CIRCLE:
                    glyph = new ShadowCircle();
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
]);
