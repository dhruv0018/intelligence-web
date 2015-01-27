require('glyph-shapes');

var Glyph = angular.module('Glyph', [
    'GlyphShapes'
]);

Glyph.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put('glyph-editor.html', require('./glyph-editor-template.html'));
    }
]);

Glyph.factory('GlyphFactory', [
    'TELESTRATION_TYPES',
    function(TELESTRATION_TYPES) {
        return function Glyph(glyphType, glyphZIndex) {

            this.type = glyphType || TELESTRATION_TYPES.FREEHAND;
            this.text = 'Enter text here';
            this.color = '#FFFF00';
            this.zIndex = glyphZIndex;
            this.vertices = [];
            var drawingFunction;

            this.draw = function() {
                if (drawingFunction && typeof drawingFunction === 'function') {
                    drawingFunction();
                }
            };

            this.addVertex = function(newVertex) {
                this.vertices.push(newVertex);
            };

            this.updateGlyph = function(newVertex) {
                switch (this.type) {
                    case TELESTRATION_TYPES.ARROW:
                    case TELESTRATION_TYPES.T_BAR:
                    case TELESTRATION_TYPES.CIRCLE:
                    case TELESTRATION_TYPES.SHADOW_CIRCLE:
                    case TELESTRATION_TYPES.CONE:
                    case TELESTRATION_TYPES.TEXT_TOOL:
                        this.vertices[1] = newVertex;
                        break;
                    case TELESTRATION_TYPES.FREEHAND:
                        this.vertices.push(newVertex);
                        break;
                }
            };

            this.toString = function() {
                return this.type + ': ' + JSON.stringify(this.vertices);
            };

            this.registerDrawingFunction = function(drawingFunctionToRegister) {
                drawingFunction = drawingFunctionToRegister;
            };

        };
    }
]);

Glyph.directive('glyphEditor', [
    'TelestrationInterface',
    function(telestrationInterface) {
        return {
            restrict: 'E',
            scope: true,
            templateUrl: 'glyph-editor.html',
            controller: function() {},
            link: function(scope, elem, attr, controller) {
                telestrationInterface.glyphEditor = controller;

                scope.edit = function editGlyph(glyphObject) {
                    scope.vertices = glyphObject.vertices;
                    scope.$apply();
                };

                controller.edit = scope.edit;
            }
        };
    }
]);

Glyph.directive('glyph', [
    'GlyphShapeRenderer', 'TelestrationInterface',
    function(GlyphShapeRenderer, telestrationInterface) {
        return {
            restrict: 'E',
            scope: {
                glyphObject: '='
            },
            link: function(scope, elem, attr) {

                var thisGlyph = new GlyphShapeRenderer(elem, scope.glyphObject.type);

                thisGlyph.onClick(function() {
                    telestrationInterface.glyphEditor.edit(scope.glyphObject);
                });

                thisGlyph.onMoved(function(dx, dy) {
                    scope.glyphObject.vertices.forEach(function(vertex) {
                        vertex[0] = vertex[0] + dx;
                        vertex[1] = vertex[1] + dy;
                    });
                });

                var drawGlyph = function drawGlyph() {

                    var vertices = scope.glyphObject.vertices;
                    var startPoint = vertices[0];
                    var endPoint = vertices[1];

                    if (vertices && vertices.length && vertices.length > 1) {

                        // Draw/update the correct shape onto the canvas
                        thisGlyph.render(vertices, scope.glyphObject.color, scope.glyphObject.text);
                    }
                };

                scope.glyphObject.registerDrawingFunction(drawGlyph);
            }
        };
    }
]);
