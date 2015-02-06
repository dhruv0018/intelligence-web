require('./Shape');
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
    'GlyphShapes.Shape'
]);

GlyphShapes.value('GlyphShapesConstants', {
    BORDER_WIDTH: 8,
    T_BAR_LENGTH: 100,
    ARROW_SIDE_LENGTH: 10
});

GlyphShapes.service('ShapesFactory', [
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

        var createShape = function createShape(type, glyphElement) {

            var shape;

            switch (type) {

                case TELESTRATION_TYPES.ARROW:
                    shape = new Arrow();
                    break;

                case TELESTRATION_TYPES.T_BAR:
                    shape = new TBar();
                    break;

                case TELESTRATION_TYPES.CONE:
                    shape = new Cone();
                    break;

                case TELESTRATION_TYPES.FREEHAND:
                    shape = new Freehand();
                    break;

                case TELESTRATION_TYPES.CIRCLE:
                    shape = new Circle();
                    break;

                case TELESTRATION_TYPES.SHADOW_CIRCLE:
                    shape = new ShadowCircle();
                    break;

                case TELESTRATION_TYPES.TEXT_TOOL:
                    shape = new TextBox(glyphElement);
                    break;
            }

            return shape;
        };

        return {
            createShape: createShape
        };
    }
]);

GlyphShapes.factory('GlyphShapeRenderer', [
    'TelestrationInterface', 'ShapesFactory',
    function(telestrationInterface, Shapes) {

        var getGlyphShape = function getGlyphShape(type, glyphElement) {

            // create shape
            var shape = Shapes.createShape(type, glyphElement);

            // register listeners with the concrete object
            shape.registerEditListeners();
            shape.registerMoveListeners();

            return shape;

        };

        return {
            getGlyphShape: getGlyphShape
        };
    }
]);
