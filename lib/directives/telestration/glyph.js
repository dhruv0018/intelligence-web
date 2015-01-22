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

Glyph.factory('GlyphShapeRenderer', [
    'TelestrationInterface',
    function(telestrationInterface) {

        var BORDER_WIDTH = 8;
        var T_BAR_LENGTH = 100;
        var ARROW_SIDE_LENGTH = 10;
        var ARROW_HEIGHT = Math.sqrt(ARROW_SIDE_LENGTH * ARROW_SIDE_LENGTH + (ARROW_SIDE_LENGTH / 2) * (ARROW_SIDE_LENGTH / 2));

        function ShapeRenderer(glyphElement) {
            var self = this;

            self.glyphElement = glyphElement;
            self.defaultColor = '#ffff00';
            this.currentShape = void(0);
            this.onClickHandler = void(0);

            self.registerListeners = function() {
                self.currentShape.on('click', function(mouseEvent) {
                    if (typeof self.onClickHandler === 'function') self.onClickHandler(mouseEvent);
                });

                //self.currentShape.on('move')
                //    if (typeof self.onMovedHandler === 'function') self.onMovedHandler(startPoint, endPoint);
            };
        }

        ShapeRenderer.prototype.onClick = function(onClickHandler) {
            this.onClickHandler = onClickHandler;
        };

        ShapeRenderer.prototype.renderArrow = function renderArrow(startPoint, endPoint, color) {
            //Calculate the arrowhead
            var m1 = ((endPoint[1] - startPoint[1]) / (endPoint[0] - startPoint[0]));
            var m = 0 - (1 / m1);
            var dx1 = 1 / Math.sqrt(m1 * m1 + 1);
            var dy1 = m1 / Math.sqrt(m1 * m1 + 1);
            var dx = 1 / Math.sqrt(m * m + 1);
            var dy = m / Math.sqrt(m * m + 1);
            if (isNaN(dy)) dy = 1;
            if (isNaN(dy1)) dy1 = 1;

            //3 points (x,y) for the arrowhead
            var arrowTip = [];
            var arrowBase1 = [];
            var arrowBase2 = [];
            if (endPoint[0] - startPoint[0] >= 0) {
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

            if (typeof this.currentShape === 'undefined' && telestrationInterface.telestrationSVG) {
                this.currentShape = telestrationInterface.telestrationSVG.path();
                this.registerListeners();
            }

            this.currentShape.plot('M ' + startPoint[0] + ' ' + startPoint[1] + ' L ' + endPoint[0] + ' ' + endPoint[1] + ' M ' + arrowBase1[0] + ' ' + arrowBase1[1] + ' L ' + arrowTip[0] + ' ' + arrowTip[1] + ' ' + arrowBase2[0] + ' ' + arrowBase2[1] + ' z')
                    .attr({
                        fill: color || this.defaultColor,
                        stroke: color || this.defaultColor,
                        'stroke-width': BORDER_WIDTH
                    });
            return this.currentShape;
        };

        ShapeRenderer.prototype.renderTBar = function renderTBar(startPoint, endPoint, color) {
            //Calculate the T portion
            var m = 0 - (1 / ((endPoint[1] - startPoint[1]) / (endPoint[0] - startPoint[0])));
            var dx = 1 / Math.sqrt(m * m + 1);
            var dy = m / Math.sqrt(m * m + 1);
            if (isNaN(dy)) dy = 1;

            //2 points (x,y) for the second line in the T
            var tPoint1 = [];
            var tPoint2 = [];
            tPoint1[0] = endPoint[0] - (T_BAR_LENGTH / 2) * dx;
            tPoint1[1] = endPoint[1] - (T_BAR_LENGTH / 2) * dy;
            tPoint2[0] = endPoint[0] + (T_BAR_LENGTH / 2) * dx;
            tPoint2[1] = endPoint[1] + (T_BAR_LENGTH / 2) * dy;

            if (typeof this.currentShape === 'undefined' && telestrationInterface.telestrationSVG) {
                this.currentShape = telestrationInterface.telestrationSVG.path();
                this.registerListeners();
            }

            this.currentShape.plot('M ' + startPoint[0] + ' ' + startPoint[1] + ' L ' + endPoint[0] + ' ' + endPoint[1] + ' M ' + tPoint1[0] + ' ' + tPoint1[1] + ' L ' + tPoint2[0] + ' ' + tPoint2[1])
                    .attr({
                        fill: 'none',
                        stroke: color || this.defaultColor,
                        'stroke-width': BORDER_WIDTH
                    });

            return this;
        };

        ShapeRenderer.prototype.renderCircle = function renderCircle(startPoint, endPoint, color) {

            var offsetX = endPoint[0] - startPoint[0];
            var offsetY = endPoint[1] - startPoint[1];
            pointDistance = Math.sqrt(offsetX * offsetX + offsetY * offsetY);

            if (typeof this.currentShape === 'undefined' && telestrationInterface.telestrationSVG) {
                this.currentShape = telestrationInterface.telestrationSVG.ellipse();
                this.registerListeners();
            }

            if (offsetY === 0) offsetX = 0; //fix for .radius(offsetX, 0) creating a circle with radius offsetX

            this.currentShape.radius(Math.abs(offsetX), Math.abs(offsetY))
                    .cx((startPoint[0] + endPoint[0]) / 2)
                    .cy((startPoint[1] + endPoint[1]) / 2)
                    .attr({
                        fill: 'none',
                        stroke: color || this.defaultColor,
                        'stroke-width': BORDER_WIDTH
                    });

            return this;
        };

        ShapeRenderer.prototype.renderShadowCircle = function renderShadowCircle(startPoint, endPoint, color) {
            var offsetX = endPoint[0] - startPoint[0];
            var offsetY = endPoint[1] - startPoint[1];
            pointDistance = Math.sqrt(offsetX * offsetX + offsetY * offsetY);

            if (typeof this.currentShape === 'undefined' && telestrationInterface.telestrationSVG) {
                this.currentShape = telestrationInterface.telestrationSVG.circle();
                this.registerListeners();
            }

            this.currentShape.radius(pointDistance / 2)
                    .cx((startPoint[0] + endPoint[0]) / 2)
                    .cy((startPoint[1] + endPoint[1]) / 2)
                    .attr({
                        fill: color || this.defaultColor,
                        stroke: color || this.defaultColor,
                        'stroke-width': BORDER_WIDTH
                    });

            return this;
        };

        ShapeRenderer.prototype.renderCone = function renderCone(startPoint, endPoint, color) {
            //Calculate the opening
            var offsetX = endPoint[0] - startPoint[0];
            var offsetY = endPoint[1] - startPoint[1];
            var m1 = (offsetY / offsetX);
            var m = 0 - (1 / m1);
            var dx1 = 1 / Math.sqrt(m1 * m1 + 1);
            var dy1 = m1 / Math.sqrt(m1 * m1 + 1);
            var dx = 1 / Math.sqrt(m * m + 1);
            var dy = m / Math.sqrt(m * m + 1);
            if (isNaN(dy)) dy = 1;
            if (isNaN(dy1)) dy1 = 1;

            pointDistance = Math.sqrt(offsetX * offsetX + offsetY * offsetY);
            var coneOpeningWidth = pointDistance / 2;

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

            offsetX = offsetX || Math.sign(offsetY); //fix for offsetX of 0

            if (offsetX > 0) {
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

            if (typeof this.currentShape === 'undefined' && telestrationInterface.telestrationSVG) {
                this.currentShape = telestrationInterface.telestrationSVG.path();
                this.registerListeners();
            }

            this.currentShape.plot('M ' + startPoint[0] + ' ' + startPoint[1] + ' L ' + conePoint1[0] + ' ' + conePoint1[1] + ' C' + curveReferencePoint1[0] + ' ' + curveReferencePoint1[1] + ' ' + curveReferencePoint2[0] + ' ' + curveReferencePoint2[1] + ' ' + conePoint2[0] + ' ' + conePoint2[1] + ' z')
                    .attr({
                        fill: color || this.defaultColor,
                        stroke: color || this.defaultColor,
                        'stroke-width': BORDER_WIDTH
                    });

            return this;
        };

        ShapeRenderer.prototype.renderFreehand = function renderFreehand(vertices, color) {
            var pathData = 'M ' + vertices[0][0] + ' ' + vertices[0][1] + ' L';
            for (var i = 1; i < vertices.length; i++) {
                pathData += ' ' + vertices[i][0] + ' ' + vertices[i][1];
            }

            if (typeof this.currentShape === 'undefined' && telestrationInterface.telestrationSVG) {
                this.currentShape = telestrationInterface.telestrationSVG.path();
                this.registerListeners();
            }

            this.currentShape.plot(pathData)
                    .attr({
                        fill: 'none',
                        stroke: color || this.defaultColor,
                        'stroke-width': BORDER_WIDTH
                    });

            return this;
        };

        ShapeRenderer.prototype.renderTextBox = function renderTextBox(startPoint, endPoint, text, color) {
            //TODO: make background color whiter version of border color?
            var self = this;
            self.glyphElement.empty();

            var offsetX = endPoint[0] - startPoint[0];
            var offsetY = endPoint[1] - startPoint[1];

            var textShape = angular.element('<textarea style="top:' + startPoint[1] + 'px;left:' + startPoint[0] + 'px;height:' + offsetY + 'px;width:' + offsetX + 'px;">' +
                text +
            '</textarea>');
            self.glyphElement.append(textShape);

            textShape.one('click', function(mouseEvent) {
                //TODO: make 'Enter text here' variable/constant
                if (textShape.text() === 'Enter text here') {
                    textShape.text('');
                }
            });

            //prevent drawing on top of text input box
            textShape.on('mousedown', function(mouseEvent) {
                mouseEvent.stopPropagation();
            });

            textShape.one('blur', function(mouseEvent) {
                console.log(mouseEvent, textShape.val());
                //if (typeof self.onTextChanged === 'function') self.onTextChanged(textShape.val());
            });

            return self;
        };

        return ShapeRenderer;
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
