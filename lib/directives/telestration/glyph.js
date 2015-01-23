require('./glyph-shapes.js');

var Glyph = angular.module('Glyph', [
    'GlyphShapes'
]);

Glyph.factory('GlyphFactory', [
    'TELESTRATION_TYPES',
    function(TELESTRATION_TYPES) {
        return function Glyph(glyphType, glyphZIndex) {

            var type = glyphType || TELESTRATION_TYPES.FREEHAND;
            var text = 'Enter text here';
            var color = '#FFFF00';
            var zIndex = glyphZIndex;
            var vertices = [];
            var drawingFunction;

            this.draw = function() {
                if (drawingFunction && typeof drawingFunction === 'function') {
                    drawingFunction();
                }
            };

            this.addVertex = function(newVertex) {
                vertices.push(newVertex);
            };

            this.updateGlyph = function(newVertex) {
                switch (type) {
                    case TELESTRATION_TYPES.ARROW:
                    case TELESTRATION_TYPES.T_BAR:
                    case TELESTRATION_TYPES.CIRCLE:
                    case TELESTRATION_TYPES.SHADOW_CIRCLE:
                    case TELESTRATION_TYPES.CONE:
                    case TELESTRATION_TYPES.TEXT_TOOL:
                        vertices[1] = newVertex;
                        break;
                    case TELESTRATION_TYPES.FREEHAND:
                        vertices.push(newVertex);
                        break;
                }
            };

            this.getVertices = function() {
                return vertices;
            };

            this.setType = function(newType) {
                type = newType;
            };

            this.getType = function() {
                return type;
            };

            this.getColor = function() {
                return color;
            };

            this.getText = function() {
                return text;
            };

            this.getZIndex = function() {
                return zIndex;
            };

            this.toString = function() {
                return type + ': ' + JSON.stringify(vertices);
            };

            this.registerDrawingFunction = function(drawingFunctionToRegister) {
                drawingFunction = drawingFunctionToRegister;
            };

        };
    }
]);

Glyph.directive('glyph', [
    'GlyphShapeRenderer',
    function(GlyphShapeRenderer) {
        return {
            restrict: 'E',
            scope: {
                glyphObject: '='
            },
            link: function(scope, elem, attr) {

                var thisGlyph = new GlyphShapeRenderer(elem, scope.glyphObject.getType());

                var glyphSelected = false;

                //click event to click-to-selct this svg element.
                //event registered on the svg element to force the user to
                //click exactly on the shape
                thisGlyph.onClick(function(e) {
                    glyphSelected = true;
                });

                var drawGlyph = function drawGlyph() {

                    var vertices = scope.glyphObject.getVertices();
                    var startPoint = vertices[0];
                    var endPoint = vertices[1];

                    if (vertices && vertices.length && vertices.length > 1) {

                        // Draw/update the correct shape onto the canvas
                        thisGlyph.renderShape(vertices, scope.glyphObject.getColor(), scope.glyphObject.getText());
                    }
                };

                scope.glyphObject.registerDrawingFunction(drawGlyph);
            }
        };
    }
]);
