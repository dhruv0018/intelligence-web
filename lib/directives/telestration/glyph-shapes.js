var GlyphShapes = angular.module('GlyphShapes', []);

GlyphShapes.value('GlyphShapesConstants', {
    BORDER_WIDTH: 8,
    T_BAR_LENGTH: 100,
    ARROW_SIDE_LENGTH: 10
});

GlyphShapes.factory('GlyphShapeRenderer', [
    'TelestrationInterface', 'GlyphShapesConstants', 'TELESTRATION_TYPES', '$location',
    function(telestrationInterface, glyphShapesConstants, TELESTRATION_TYPES, $location) {

        ShapeRenderer.prototype.BORDER_WIDTH = glyphShapesConstants.BORDER_WIDTH;
        ShapeRenderer.prototype.T_BAR_LENGTH = glyphShapesConstants.T_BAR_LENGTH;
        ShapeRenderer.prototype.ARROW_SIDE_LENGTH = glyphShapesConstants.ARROW_SIDE_LENGTH;
        ShapeRenderer.prototype.ARROW_HEIGHT = Math.sqrt(5 / 4 * glyphShapesConstants.ARROW_SIDE_LENGTH * glyphShapesConstants.ARROW_SIDE_LENGTH);
        ShapeRenderer.prototype.editable = true;
        ShapeRenderer.prototype.moveable = true;

        function Arrow() {

            var self = this;

            self.currentShape = telestrationInterface.telestrationSVG.path();

            self.render = function renderArrow(vertices, color, text) {

                var startPoint = vertices[0];
                var endPoint = vertices[1];

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
                    arrowTip[0] = endPoint[0] + self.ARROW_HEIGHT * dx1;
                    arrowTip[1] = endPoint[1] + self.ARROW_HEIGHT * dy1;
                } else {
                    arrowTip[0] = endPoint[0] - self.ARROW_HEIGHT * dx1;
                    arrowTip[1] = endPoint[1] - self.ARROW_HEIGHT * dy1;
                }
                arrowBase1[0] = endPoint[0] - (self.ARROW_SIDE_LENGTH / 2) * dx;
                arrowBase1[1] = endPoint[1] - (self.ARROW_SIDE_LENGTH / 2) * dy;
                arrowBase2[0] = endPoint[0] + (self.ARROW_SIDE_LENGTH / 2) * dx;
                arrowBase2[1] = endPoint[1] + (self.ARROW_SIDE_LENGTH / 2) * dy;

                self.currentShape.plot('M ' + startPoint[0] + ' ' + startPoint[1] + ' L ' + endPoint[0] + ' ' + endPoint[1] + ' M ' + arrowBase1[0] + ' ' + arrowBase1[1] + ' L ' + arrowTip[0] + ' ' + arrowTip[1] + ' ' + arrowBase2[0] + ' ' + arrowBase2[1] + ' z')
                        .attr({
                            fill: color || self.defaultColor,
                            stroke: color || self.defaultColor,
                            'stroke-width': self.BORDER_WIDTH
                        });
                return self.currentShape;
            };
        }

        function TBar() {

            var self = this;

            self.currentShape = telestrationInterface.telestrationSVG.path();

            self.render = function renderTBar(vertices, color, text) {

                var startPoint = vertices[0];
                var endPoint = vertices[1];

                //Calculate the T portion
                var m = 0 - (1 / ((endPoint[1] - startPoint[1]) / (endPoint[0] - startPoint[0])));
                var dx = 1 / Math.sqrt(m * m + 1);
                var dy = m / Math.sqrt(m * m + 1);
                if (isNaN(dy)) dy = 1;

                //2 points (x,y) for the second line in the T
                var tPoint1 = [];
                var tPoint2 = [];
                tPoint1[0] = endPoint[0] - (self.T_BAR_LENGTH / 2) * dx;
                tPoint1[1] = endPoint[1] - (self.T_BAR_LENGTH / 2) * dy;
                tPoint2[0] = endPoint[0] + (self.T_BAR_LENGTH / 2) * dx;
                tPoint2[1] = endPoint[1] + (self.T_BAR_LENGTH / 2) * dy;

                self.currentShape.plot('M ' + startPoint[0] + ' ' + startPoint[1] + ' L ' + endPoint[0] + ' ' + endPoint[1] + ' M ' + tPoint1[0] + ' ' + tPoint1[1] + ' L ' + tPoint2[0] + ' ' + tPoint2[1])
                        .attr({
                            fill: 'none',
                            stroke: color || self.defaultColor,
                            'stroke-width': self.BORDER_WIDTH
                        });

                return self;
            };
        }

        function Circle() {

            var self = this;

            self.currentShape = telestrationInterface.telestrationSVG.circle();

            self.render = function renderCircle(vertices, color, text) {

                var startPoint = vertices[0];
                var endPoint = vertices[1];

                var offsetX = endPoint[0] - startPoint[0];
                var offsetY = endPoint[1] - startPoint[1];
                pointDistance = Math.sqrt(offsetX * offsetX + offsetY * offsetY);

                if (offsetY === 0) offsetX = 0; //fix for .radius(offsetX, 0) creating a circle with radius offsetX

                self.currentShape.radius(Math.abs(offsetX) / 2, Math.abs(offsetY) / 2)
                        .cx((startPoint[0] + endPoint[0]) / 2)
                        .cy((startPoint[1] + endPoint[1]) / 2)
                        .attr({
                            fill: 'none',
                            stroke: color || self.defaultColor,
                            'stroke-width': self.BORDER_WIDTH
                        });

                return self;
            };
        }

        function ShadowCircle() {

            var self = this;

            self.currentShape = telestrationInterface.telestrationSVG.circle().opacity(0);
            self.spotShadow = telestrationInterface.telestrationSVG.circle();
            var theMask = telestrationInterface.telestrationSVGMask.add(self.spotShadow);
            var objWithMask = telestrationInterface.telestrationSVGMaskBlack.maskWith(theMask);
            var shortUrl = objWithMask.attr('mask');
            var longUrl = 'url(' + $location.absUrl() + shortUrl.match(/#\w+/i)[0] + ')';
            objWithMask.attr({'mask': longUrl});

            self.editable = false;

            self.render = function renderShadowCircle(vertices, color, text) {

                var startPoint = vertices[0];
                var endPoint = vertices[1];
                var offsetX = endPoint[0] - startPoint[0];
                var offsetY = endPoint[1] - startPoint[1];
                pointDistance = Math.sqrt(offsetX * offsetX + offsetY * offsetY);

                self.spotShadow.radius(pointDistance / 2)
                        .cx((startPoint[0] + endPoint[0]) / 2)
                        .cy((startPoint[1] + endPoint[1]) / 2);

                self.currentShape.radius(pointDistance / 2)
                        .cx((startPoint[0] + endPoint[0]) / 2)
                        .cy((startPoint[1] + endPoint[1]) / 2)
                        .attr({
                            fill: color || self.defaultColor,
                            stroke: color || self.defaultColor,
                            'stroke-width': self.BORDER_WIDTH
                        });

                return self;
            };
        }

        function Cone() {

            var self = this;

            self.editable = false;
            self.currentShape = telestrationInterface.telestrationSVG.path().opacity(0);
            self.spotShadow = telestrationInterface.telestrationSVG.path();
            var theMask = telestrationInterface.telestrationSVGMask.add(self.spotShadow);
            var objWithMask = telestrationInterface.telestrationSVGMaskBlack.maskWith(theMask);
            var shortUrl = objWithMask.attr('mask');
            var longUrl = 'url(' + $location.absUrl() + shortUrl.match(/#\w+/i)[0] + ')';
            objWithMask.attr({'mask': longUrl});

            self.render = function renderCone(vertices, color, text) {

                var startPoint = vertices[0];
                var endPoint = vertices[1];

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

                self.spotShadow.plot('M ' + startPoint[0] + ' ' + startPoint[1] + ' L ' + conePoint1[0] + ' ' + conePoint1[1] + ' C' + curveReferencePoint1[0] + ' ' + curveReferencePoint1[1] + ' ' + curveReferencePoint2[0] + ' ' + curveReferencePoint2[1] + ' ' + conePoint2[0] + ' ' + conePoint2[1] + ' z');

                self.currentShape.plot('M ' + startPoint[0] + ' ' + startPoint[1] + ' L ' + conePoint1[0] + ' ' + conePoint1[1] + ' C' + curveReferencePoint1[0] + ' ' + curveReferencePoint1[1] + ' ' + curveReferencePoint2[0] + ' ' + curveReferencePoint2[1] + ' ' + conePoint2[0] + ' ' + conePoint2[1] + ' z')
                        .attr({
                            fill: color || self.defaultColor,
                            stroke: color || self.defaultColor,
                            'stroke-width': self.BORDER_WIDTH
                        });

                return self;
            };
        }

        function Freehand() {

            var self = this;

            self.editable = false;
            self.moveable = false;

            self.currentShape = telestrationInterface.telestrationSVG.path();

            self.render = function renderFreehand(vertices, color, text) {
                var pathData = 'M ' + vertices[0][0] + ' ' + vertices[0][1] + ' L';
                for (var i = 1; i < vertices.length; i++) {
                    pathData += ' ' + vertices[i][0] + ' ' + vertices[i][1];
                }

                self.currentShape.plot(pathData)
                        .attr({
                            fill: 'none',
                            stroke: color || self.defaultColor,
                            'stroke-width': self.BORDER_WIDTH
                        });

                return self;
            };
        }

        function TextBox() {

            var self = this;

            self.currentShape = telestrationInterface.telestrationSVG.path();

            self.render = function renderTextBox(vertices, color, text) {

                var startPoint = vertices[0];
                var endPoint = vertices[1];

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
        }

        function ShapeRenderer(glyphElement, type) {

            var self = this;
            var shapeTypeObj;
            switch (type) {

                case TELESTRATION_TYPES.ARROW:
                    shapeTypeObj = new Arrow();
                    break;

                case TELESTRATION_TYPES.T_BAR:
                    shapeTypeObj = new TBar();
                    break;

                case TELESTRATION_TYPES.CONE:
                    shapeTypeObj = new Cone();
                    break;

                case TELESTRATION_TYPES.FREEHAND:
                    shapeTypeObj = new Freehand();
                    break;

                case TELESTRATION_TYPES.CIRCLE:
                    shapeTypeObj = new Circle();
                    break;

                case TELESTRATION_TYPES.SHADOW_CIRCLE:
                    shapeTypeObj = new ShadowCircle();
                    break;

                case TELESTRATION_TYPES.TEXT_TOOL:
                    shapeTypeObj = new TextBox();
                    break;
            }

            shapeTypeObj.type = type;
            shapeTypeObj.glyphElement = glyphElement;
            angular.augment(shapeTypeObj, ShapeRenderer.prototype);
            if (shapeTypeObj.editable) {
                shapeTypeObj.registerEditListeners();
            }
            if (shapeTypeObj.moveable) {
                shapeTypeObj.registerMoveListeners();
            }
            return shapeTypeObj;
        }

        ShapeRenderer.prototype.registerEditListeners = function() {
            var self = this;
            if (self.currentShape) {
                self.currentShape.on('click', function(mouseEvent) {
                    if (typeof self.onClickHandler === 'function') self.onClickHandler();
                });
            }
        };

        ShapeRenderer.prototype.registerMoveListeners = function() {
            var self = this;
            if (self.currentShape) {
                self.currentShape.draggable();

                self.currentShape.on('mousedown', function(mouseEvent) {
                    mouseEvent.stopPropagation(); //prevent drawing
                });

                if (self.spotShadow) {
                    self.currentShape.dragstart = function() {
                        self.spotShadow.xStart = self.spotShadow.x();
                        self.spotShadow.yStart = self.spotShadow.y();
                    };

                    self.currentShape.dragmove = function(delta) {
                        self.spotShadow.x(self.spotShadow.xStart + delta.x);
                        self.spotShadow.y(self.spotShadow.yStart + delta.y);
                    };
                }

                self.currentShape.dragmove = function(delta, event) {
                    if (typeof self.onMoveHandler === 'function') self.onMoveHandler(delta, event);
                };

                self.currentShape.dragend = function(delta) {
                    if (typeof self.onMovedHandler === 'function') self.onMovedHandler(delta.x, delta.y);
                };
            }
        };

        ShapeRenderer.prototype.onClick = function(onClickHandler) {
            this.onClickHandler = onClickHandler;
        };

        ShapeRenderer.prototype.onMoved = function(onMovedHandler) {
            this.onMovedHandler = onMovedHandler;
        };

        ShapeRenderer.prototype.onMove = function(onMoveHandler) {
            this.onMoveHandler = onMoveHandler;
        };

        ShapeRenderer.prototype.defaultColor = '#ffff00';

        return ShapeRenderer;
    }
]);
