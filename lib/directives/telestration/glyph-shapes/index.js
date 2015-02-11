require('./arrow');
require('./cone');
require('./ellipse');
require('./freehand');
require('./shadow-circle');
require('./ShadowShape');
require('./Shape');
require('./tbar');
require('./textbox');

var GlyphShapes = angular.module('GlyphShapes', [
    'GlyphShapes.ArrowShape',
    'GlyphShapes.ConeShape',
    'GlyphShapes.EllipseShape',
    'GlyphShapes.FreehandShape',
    'GlyphShapes.ShadowCircleShape',
    'GlyphShapes.ShadowShape',
    'GlyphShapes.Shape',
    'GlyphShapes.TBarShape',
    'GlyphShapes.TextBoxShape'
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
    'ConeFactory',
    'EllipseFactory',
    'FreehandFactory',
    'ShadowCircleFactory',
    'TBarFactory',
    'TextBoxFactory',
    function(
        TELESTRATION_TYPES,
        Arrow,
        Cone,
        Ellipse,
        Freehand,
        ShadowCircle,
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

                case TELESTRATION_TYPES.CONE:
                    glyph = new Cone();
                    break;

                case TELESTRATION_TYPES.FREEHAND:
                    glyph = new Freehand();
                    break;

                case TELESTRATION_TYPES.CIRCLE:
                    glyph = new Ellipse();
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
