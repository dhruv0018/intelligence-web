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
    'TELESTRATION_TYPES', 'TelestrationInterface', 'GlyphShapeRenderer', '$location',
    function(TELESTRATION_TYPES, telestrationInterface, GlyphShapeRenderer, $location) {
        return {
            restrict: 'E',
            scope: {
                glyphObject: '='
            },
            link: function(scope, elem, attr) {

                var thisGlyph = new GlyphShapeRenderer(elem);

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

                    if (startPoint && startPoint.length && endPoint && endPoint.length) {

                        // Draw/update the correct shape onto the canvas
                        switch (scope.glyphObject.getType()) {

                            case TELESTRATION_TYPES.ARROW:
                                thisGlyph.renderArrow(startPoint, endPoint);
                                break;

                            case TELESTRATION_TYPES.T_BAR:
                                thisGlyph.renderTBar(startPoint, endPoint);
                                break;

                            case TELESTRATION_TYPES.CIRCLE:
                                thisGlyph.renderCircle(startPoint, endPoint);
                                break;

                            case TELESTRATION_TYPES.SHADOW_CIRCLE:
                                thisGlyph.renderShadowCircle(startPoint, endPoint);
                                break;

                            case TELESTRATION_TYPES.CONE:
                                thisGlyph.renderCone(startPoint, endPoint);
                                break;

                            case TELESTRATION_TYPES.TEXT_TOOL:
                                thisGlyph.renderTextBox(startPoint, endPoint, scope.glyphObject.getText());
                                break;

                            case TELESTRATION_TYPES.FREEHAND:
                                thisGlyph.renderFreehand(vertices);
                                break;
                        }
                    }
                };

                scope.glyphObject.registerDrawingFunction(drawGlyph);
            }
        };
    }
]);
