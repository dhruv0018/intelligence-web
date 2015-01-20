var Glyph = angular.module('Glyph', []);

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

            this.getvertices = function() {
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
    'TELESTRATION_TYPES', 'TelestrationInterface', '$location',
    function(TELESTRATION_TYPES, telestrationInterface, $location) {
        return {
            restrict: 'E',
            scope: {
                glyphObject: '='
            },
            link: function(scope, elem, attr) {

                var BORDER_WIDTH = 8;
                var T_BAR_LENGTH = 100;
                var ARROW_SIDE_LENGTH = 10;
                var ARROW_HEIGHT = Math.sqrt(ARROW_SIDE_LENGTH * ARROW_SIDE_LENGTH + (ARROW_SIDE_LENGTH / 2) * (ARROW_SIDE_LENGTH / 2));

                var thisGlyph; //stores the svg.js element repesenting the drawn SVG element

                var drawGlyph = function drawGlyph() {

                    var vertices = scope.glyphObject.getvertices();
                    var startPoint = vertices[0];
                    var endPoint = vertices[1];
                    var offsetX;
                    var offsetY;
                    var pointDistance;
                    var svgDrawing = telestrationInterface.telestrationSVG;
                    var m;
                    var m1;
                    var dx1;
                    var dx2;
                    var dx;
                    var dy;
                    var quadrant;

                    if (startPoint && startPoint.length && endPoint && endPoint.length) {

                        offsetX = endPoint[0] - startPoint[0];
                        offsetY = endPoint[1] - startPoint[1];
                        pointDistance = Math.sqrt(offsetX * offsetX + offsetY * offsetY);

                        elem[0].style.width = Math.abs(offsetX) + 'px';
                        elem[0].style.height = Math.abs(offsetY) + 'px';

                        /*  Quadrants

                              3 | 4
                            ----x----
                              2 | 1
                        */

                        // start point is at the x intersection of the quadrants. end point might be in
                        // on of the 4 quadrants. move the glpyh based on what quadrant it lies in

                        elem[0].style.left = startPoint[0] + 'px';
                        elem[0].style.top = startPoint[1] + 'px';

                        if (offsetX < 0 && offsetY > 0) {
                            //Quadrant 2
                            quadrant = 2;
                            elem[0].style.left = (startPoint[0] - Math.abs(offsetX)) + 'px';
                        } else if (offsetX < 0 && offsetY < 0) {
                            //Quadrant 3
                            quadrant = 3;
                            elem[0].style.top = (startPoint[1] - Math.abs(offsetY)) + 'px';
                            elem[0].style.left = (startPoint[0] - Math.abs(offsetX)) + 'px';
                        } else if (offsetX > 0 && offsetY < 0) {
                            //Quadrant 4
                            quadrant = 4;
                            elem[0].style.top = (startPoint[1] - Math.abs(offsetY)) + 'px';
                        } else {
                            //Quadrant 1 (Default)
                            quadrant = 1;
                        }

                        switch (scope.glyphObject.getType()) {

                            case TELESTRATION_TYPES.ARROW:
                                //Calculate the arrowhead
                                m1 = ((endPoint[1] - startPoint[1]) / (endPoint[0] - startPoint[0]));
                                m = 0 - (1 / m1);
                                dx1 = 1 / Math.sqrt(m1 * m1 + 1);
                                dy1 = m1 / Math.sqrt(m1 * m1 + 1);
                                dx = 1 / Math.sqrt(m * m + 1);
                                dy = m / Math.sqrt(m * m + 1);
                                if (isNaN(dy)) dy = 1;
                                if (isNaN(dy1)) dy1 = 1;

                                //3 points (x,y) for the arrowhead
                                var arrowTip = [];
                                var arrowBase1 = [];
                                var arrowBase2 = [];
                                if (offsetX >= 0) {
                                    arrowTip[0] = endPoint[0] + ARROW_HEIGHT * dx1;
                                    arrowTip[1] = endPoint[1] + ARROW_HEIGHT * dy1;
                                } else {
                                    arrowTip[0] = endPoint[0] - ARROW_HEIGHT * dx1;
                                    arrowTip[1] = endPoint[1] - ARROW_HEIGHT * dy1;
                                }
                                arrowBase1[0] = endPoint[0] - (ARROW_SIDE_LENGTH / 2) * dx;
                                arrowBase1[1] = endPoint[1] - (ARROW_SIDE_LENGTH / 2) * dy;
                                arrowBase2[0] = endPoint[0] + (ARROW_SIDE_LENGTH / 2) * dx;
                                arrowBase2[1] = endPoint[1] + (ARROW_SIDE_LENGTH / 2) * dy;


                                thisGlyph = thisGlyph || svgDrawing.path();

                                thisGlyph.plot('M ' + startPoint[0] + ' ' + startPoint[1] + ' L ' + endPoint[0] + ' ' + endPoint[1] + ' M ' + arrowBase1[0] + ' ' + arrowBase1[1] + ' L ' + arrowTip[0] + ' ' + arrowTip[1] + ' ' + arrowBase2[0] + ' ' + arrowBase2[1] + ' z')
                                        .attr({
                                            fill: scope.glyphObject.getColor(),
                                            stroke: scope.glyphObject.getColor(),
                                            'stroke-width': BORDER_WIDTH
                                        });
                                break;

                            case TELESTRATION_TYPES.T_BAR:

                                //Calculate the T portion
                                m = 0 - (1 / ((endPoint[1] - startPoint[1]) / (endPoint[0] - startPoint[0])));
                                dx = 1 / Math.sqrt(m * m + 1);
                                dy = m / Math.sqrt(m * m + 1);
                                if (isNaN(dy)) dy = 1;

                                //2 points (x,y) for the second line in the T
                                var tPoint1 = [];
                                var tPoint2 = [];
                                tPoint1[0] = endPoint[0] - (T_BAR_LENGTH / 2) * dx;
                                tPoint1[1] = endPoint[1] - (T_BAR_LENGTH / 2) * dy;
                                tPoint2[0] = endPoint[0] + (T_BAR_LENGTH / 2) * dx;
                                tPoint2[1] = endPoint[1] + (T_BAR_LENGTH / 2) * dy;

                                thisGlyph = thisGlyph || svgDrawing.path();

                                thisGlyph.plot('M ' + startPoint[0] + ' ' + startPoint[1] + ' L ' + endPoint[0] + ' ' + endPoint[1] + ' M ' + tPoint1[0] + ' ' + tPoint1[1] + ' L ' + tPoint2[0] + ' ' + tPoint2[1])
                                        .attr({
                                            fill: 'none',
                                            stroke: scope.glyphObject.getColor(),
                                            'stroke-width': BORDER_WIDTH
                                        });
                                break;

                            case TELESTRATION_TYPES.CIRCLE:
                                thisGlyph = thisGlyph || svgDrawing.circle();

                                thisGlyph.radius(pointDistance / 2)
                                        .cx((startPoint[0] + endPoint[0]) / 2)
                                        .cy((startPoint[1] + endPoint[1]) / 2)
                                        .attr({
                                            fill: 'none',
                                            stroke: scope.glyphObject.getColor(),
                                            'stroke-width': BORDER_WIDTH
                                        });
                                break;

                            case TELESTRATION_TYPES.SHADOW_CIRCLE:
                                thisGlyph = thisGlyph || svgDrawing.circle();

                                thisGlyph.radius(pointDistance / 2)
                                        .cx((startPoint[0] + endPoint[0]) / 2)
                                        .cy((startPoint[1] + endPoint[1]) / 2)
                                        .attr({
                                            fill: 'none',
                                            stroke: scope.glyphObject.getColor(),
                                            'stroke-width': BORDER_WIDTH
                                        });
                                break;

                            case TELESTRATION_TYPES.CONE:

                                var coneOpeningWidth = pointDistance / 2;

                                //Calculate the opening
                                m1 = ((endPoint[1] - startPoint[1]) / (endPoint[0] - startPoint[0]));
                                m = 0 - (1 / m1);
                                dx1 = 1 / Math.sqrt(m1 * m1 + 1);
                                dy1 = m1 / Math.sqrt(m1 * m1 + 1);
                                dx = 1 / Math.sqrt(m * m + 1);
                                dy = m / Math.sqrt(m * m + 1);
                                if (isNaN(dy)) dy = 1;
                                if (isNaN(dy1)) dy1 = 1;

                                //2 points (x,y) for the cone structure
                                var conePoint1 = [];
                                var conePoint2 = [];
                                conePoint1[0] = endPoint[0] - (coneOpeningWidth / 2) * dx;
                                conePoint1[1] = endPoint[1] - (coneOpeningWidth / 2) * dy;
                                conePoint2[0] = endPoint[0] + (coneOpeningWidth / 2) * dx;
                                conePoint2[1] = endPoint[1] + (coneOpeningWidth / 2) * dy;

                                //3 points for the bezier curve
                                var extensionPoint = [];
                                var curveReferencePoint1 = [];
                                var curveReferencePoint2 = [];
                                if (offsetX >= 0) {
                                    extensionPoint[0] = endPoint[0] + (coneOpeningWidth / 5) * dx1;
                                    extensionPoint[1] = endPoint[1] + (coneOpeningWidth / 5) * dy1;
                                } else {
                                    extensionPoint[0] = endPoint[0] - (coneOpeningWidth / 5) * dx1;
                                    extensionPoint[1] = endPoint[1] - (coneOpeningWidth / 5) * dy1;
                                }

                                curveReferencePoint1[0] = extensionPoint[0] - (coneOpeningWidth / 4) * dx;
                                curveReferencePoint1[1] = extensionPoint[1] - (coneOpeningWidth / 4) * dy;
                                curveReferencePoint2[0] = extensionPoint[0] + (coneOpeningWidth / 4) * dx;
                                curveReferencePoint2[1] = extensionPoint[1] + (coneOpeningWidth / 4) * dy;

                                thisGlyph = thisGlyph || svgDrawing.path();

                                thisGlyph.plot('M ' + startPoint[0] + ' ' + startPoint[1] + ' L ' + conePoint1[0] + ' ' + conePoint1[1] + ' C' + curveReferencePoint1[0] + ' ' + curveReferencePoint1[1] + ' ' + curveReferencePoint2[0] + ' ' + curveReferencePoint2[1] + ' ' + conePoint2[0] + ' ' + conePoint2[1] + ' z')
                                        .attr({
                                            fill: 'none',
                                            stroke: scope.glyphObject.getColor(),
                                            'stroke-width': BORDER_WIDTH
                                        });
                                break;

                            case TELESTRATION_TYPES.TEXT_TOOL:
                                //TODO: make background color whiter version of border color?
                                updatedSVGShape = angular.element('<div style="position:relative;display:inline-block;overflow:hidden;background-color:#ffffcc;padding:8px;line-height:14px;letter-spacing:0px;font-size:16px;left:' + startPoint[0] + 'px;top:' + startPoint[1] + 'px;height:' + offsetY + 'px;width:' + offsetX + 'px;border:solid ' + BORDER_WIDTH + 'px ' + scope.glyphObject.getColor() + ';">' +
                                    '<span>' + scope.glyphObject.getText() + '</span>' +
                                '</div>');
                                break;

                            case TELESTRATION_TYPES.FREEHAND:
                                var pathData = 'M ' + startPoint[0] + ' ' + startPoint[1] + ' L';
                                for (var i = 1; i < vertices.length; i++) {
                                    pathData += ' ' + vertices[i][0] + ' ' + vertices[i][1];
                                }

                                thisGlyph = thisGlyph || svgDrawing.path();

                                thisGlyph.plot(pathData)
                                        .attr({
                                            fill: 'none',
                                            stroke: scope.glyphObject.getColor(),
                                            'stroke-width': BORDER_WIDTH
                                        });
                                break;
                        }
                    }
                };

                scope.glyphObject.registerDrawingFunction(drawGlyph);
            }
        };
    }
]);
