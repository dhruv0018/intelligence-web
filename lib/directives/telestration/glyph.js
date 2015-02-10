require('glyph-shapes');

var Glyph = angular.module('Glyph', [
    'GlyphShapes'
]);

Glyph.factory('GlyphFactory', [
    'TELESTRATION_TYPES', 'TelestrationInterface',
    function(TELESTRATION_TYPES, telestrationInterface) {
        return function Glyph(glyphType, glyphZIndex) {

            this.type = glyphType || TELESTRATION_TYPES.FREEHAND;
            this.text = '';
            this.color = '#FFFF00';
            this.zIndex = glyphZIndex;
            this.vertices = [];
            var drawingFunction;

            this.draw = function draw() {
                if (drawingFunction && typeof drawingFunction === 'function') {
                    drawingFunction();
                }
            };

            this.updateGlyphFromPixels = function updateGlyphFromPixels(x, y) {
                // TODO: only call getBoundingClientRect on window Resize
                var boundingBox = telestrationInterface.telestrationContainerElement[0].getBoundingClientRect();
                var relativeX = x / boundingBox.width;
                var relativeY = y / boundingBox.height;
                var newVertex = {x: relativeX, y: relativeY};

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

            this.getModel = function getModel() {
                var model = {};
                model.vertices = this.vertices;
                model.type = this.type;
                return model;
            };

            this.toString = function toString() {
                return this.type + ': ' + JSON.stringify(this.vertices);
            };

            this.registerDrawingFunction = function registerDrawingFunction(drawingFunctionToRegister) {
                drawingFunction = drawingFunctionToRegister;
            };

            this.getVerticesInPixels = function getVerticesInPixels() {
                // TODO: only call getBoundingClientRect on window Resize
                var boundingBox = telestrationInterface.telestrationContainerElement[0].getBoundingClientRect();
                var verticesInPixels = this.vertices.map(function convertToPixels(vertex) {
                    var relativeX = vertex.x * boundingBox.width;
                    var relativeY = vertex.y * boundingBox.height;
                    return {x: relativeX, y: relativeY};
                });
                return verticesInPixels;
            };

            this.addVertexFromPixels = function addVertexFromPixels(x, y) {
                // TODO: only call getBoundingClientRect on window Resize
                var boundingBox = telestrationInterface.telestrationContainerElement[0].getBoundingClientRect();
                var relativeX = x / boundingBox.width;
                var relativeY = y / boundingBox.height;
                this.vertices.push({x: relativeX, y: relativeY});
            };

            this.updateVertexFromPixels = function updateVertexFromPixels(index, x, y) {
                // TODO: only call getBoundingClientRect on window Resize
                var boundingBox = telestrationInterface.telestrationContainerElement[0].getBoundingClientRect();
                var relativeX = x / boundingBox.width;
                var relativeY = y / boundingBox.height;
                this.vertices[index] = {x: relativeX, y: relativeY};
            };

        };
    }
]);

Glyph.directive('glyphEditor', [
    'TelestrationInterface',
    function(telestrationInterface) {
        var glyphEditor;
        return {
            restrict: 'A',
            scope: true,
            controller: function() {
                var initialized = false;
                var self = this;
                var deleteWidgetClickCallback;

                self.widgetRadius = 30;
                self.resizeWidgetCenterOffset = -self.widgetRadius / 2;

                self.$setEditRegion = function $setEditRegion(startVertex, endVertex) {
                    if (!initialized) {
                        throw new Error('Glyph Editor not initialized');
                    }

                    updateResizeWidgetsPos(startVertex, endVertex);

                    // Move Widgets to Front
                    self.glyphEditor.each(function iterFn() {
                        this.front();
                    });

                    // Display the glypheditor
                    self.glyphEditor.show();
                };

                self.resize = angular.noop;
                self.$onResize = function $onResize(callback) {
                    self.resize = callback;
                };

                self.$hide = function $hide() {
                    if (!initialized) {
                        throw new Error('Glyph Editor not initialized');
                    }
                    self.glyphEditor.hide();
                };

                /*
                 * Updates the current bounding constraintFn for moving the glyph editor widgets.
                 * @param constraintFn : function
                 */
                self.$setDraggableConstraintFn = function glyphEditorSetDraggableConstraintFn(constraintFn) {
                    if (!initialized) {
                        throw new Error('Glyph Editor not initialized');
                    }
                    if (constraintFn && !self.constraintFn) {
                        self.constraintFn = constraintFn;
                        self.startResizeWidget.draggable(constraintFn);
                        self.endResizeWidget.draggable(constraintFn);
                    }
                };

                self.$initialize = function $initialize() {
                    // Glyph Editor operates as a Singleton, don't initialize more than once.
                    if (initialized) return;

                    self.glyphEditor = telestrationInterface.telestrationSVG.set();

                    /* create resize/rotate widgets */
                    self.startResizeWidget = createResizeWidget();
                    self.endResizeWidget = createResizeWidget();
                    self.deleteWidget = createDeleteWidget();

                    /* add components to glyphEditor set */
                    self.glyphEditor.add(self.startResizeWidget);
                    self.glyphEditor.add(self.endResizeWidget);
                    self.glyphEditor.add(self.deleteWidget);

                    /* Add resize widget handlers */
                    self.startResizeWidget.dragstart = resizeDragStart;
                    self.endResizeWidget.dragstart = resizeDragStart;
                    self.startResizeWidget.dragmove = startPointMove;
                    self.endResizeWidget.dragmove = endPointMove;

                    /* Add delete widget handlers */
                    self.deleteWidget.mousedown(function deleteWidgetMouseOver(event) {
                        event.stopPropagation();
                    });
                    self.deleteWidget.click(deleteWidgetClick);

                    self.glyphEditor.hide();

                    initialized = true;
                };

                self.$onDeleteClick = function $onDeleteClick(callback) {
                    deleteWidgetClickCallback = callback;
                };

                function deleteWidgetClick(event) {
                    deleteWidgetClickCallback = deleteWidgetClickCallback || angular.noop;
                    deleteWidgetClickCallback();
                }

                function updateResizeWidgetsPos(startVertex, endVertex) {
                    // center the position about the start and end vertex
                    var startX = startVertex.x + self.resizeWidgetCenterOffset;
                    var startY = startVertex.y + self.resizeWidgetCenterOffset;
                    var endX = endVertex.x + self.resizeWidgetCenterOffset;
                    var endY = endVertex.y + self.resizeWidgetCenterOffset;

                    self.startResizeWidget.move(startX, startY);
                    self.endResizeWidget.move(endX, endY);

                    /* position the delete widget between the start and end vertices */
                    moveDeleteWidget();
                }

                function moveDeleteWidget() {
                    var startX = self.startResizeWidget.x();
                    var startY = self.startResizeWidget.y();
                    var endX = self.endResizeWidget.x();
                    var endY = self.endResizeWidget.y();

                    var resizeDeltaX = Math.abs(endX - startX);
                    var resizeDeltaY = Math.abs(endY - startY);
                    var deleteWidgetX = (startX <= endX ? startX : endX) + (resizeDeltaX / 2);
                    var deleteWidgetY = (startY <= endY ? startY : endY) + (resizeDeltaY / 2);

                    self.deleteWidget.move(deleteWidgetX, deleteWidgetY);
                }

                function createMoveBox() {

                    var opacity = 0.3;
                    var fill = '#000';
                    var width = 200;
                    var height = 100;

                    // create the svg
                    var moveBox = telestrationInterface.telestrationSVG.rect(width, height)
                        .attr({ fill: fill})
                        .opacity(opacity);

                    return moveBox;
                }

                function createResizeWidget() {
                    var fill = '#cecece';
                    var strokeWidth = '1';
                    var strokeColor = '#ccc';
                    var radius = self.widgetRadius;

                    var widget = telestrationInterface.telestrationSVG.circle(radius)
                        .attr({
                            fill: fill,
                            'stroke-width': strokeWidth,
                            'stroke-color': strokeColor
                        });

                    return widget;
                }

                function createDeleteWidget() {
                    var fill = '#f00';
                    var strokeWidth = '1';
                    var strokeColor = '#000';
                    var radius = self.widgetRadius;

                    var widget = telestrationInterface.telestrationSVG.circle(radius)
                        .attr({
                            fill: fill,
                            'stroke-width': strokeWidth,
                            'stroke-color': strokeColor
                        });

                    return widget;
                }

                function resizeDragStart() {
                    this.dragStartPos = {x: this.x(), y: this.y()};
                    this.front();
                }

                function startPointMove(delta, event) {
                    event.stopImmediatePropagation();
                    constrainDelta(delta, this);

                    // remove widget offset from points
                    var startX = this.dragStartPos.x + delta.x - self.resizeWidgetCenterOffset;
                    var startY = this.dragStartPos.y + delta.y - self.resizeWidgetCenterOffset;
                    var endX = self.endResizeWidget.x() - self.resizeWidgetCenterOffset;
                    var endY = self.endResizeWidget.y() - self.resizeWidgetCenterOffset;

                    var startResizeWidgetPos = {x: startX, y: startY};
                    var endResizeWidgetPos = {x: endX, y: endY};

                    self.resize(startResizeWidgetPos, endResizeWidgetPos);

                    moveDeleteWidget();
                }

                function endPointMove(delta, event) {
                    event.stopImmediatePropagation();
                    constrainDelta(delta, this);

                    // remove widget offset from points for callback
                    var startX = self.startResizeWidget.x() - self.resizeWidgetCenterOffset;
                    var startY = self.startResizeWidget.y() - self.resizeWidgetCenterOffset;
                    var endX = this.dragStartPos.x + delta.x - self.resizeWidgetCenterOffset;
                    var endY = this.dragStartPos.y + delta.y - self.resizeWidgetCenterOffset;

                    var startResizeWidgetPos = {x: startX, y: startY};
                    var endResizeWidgetPos = {x: endX, y: endY};

                    self.resize(startResizeWidgetPos, endResizeWidgetPos);

                    moveDeleteWidget();
                }

                function constrainDelta(delta, resizeWidget) {
                    if (self.constraintFn) {

                        var endPosition = {x: resizeWidget.x(), y: resizeWidget.y()};

                        delta.x = endPosition.x - resizeWidget.dragStartPos.x;
                        delta.y = endPosition.y - resizeWidget.dragStartPos.y;
                    }
                    return delta;
                }
            },
            link: function glyphEditorLink(scope, elem, attr, controller) {}
        };
    }
]);

Glyph.directive('glyph', [
    '$window', 'ShapesFactory', 'TelestrationInterface',
    function($window, Shapes, telestrationInterface) {
        return {
            restrict: 'E',
            scope: {
                glyphObject: '='
            },
            require: '?^glyphEditor',
            link: function($scope, elem, attr, glyphEditor) {

                glyphEditor = glyphEditor || {
                    '$setEditRegion': angular.noop,
                    '$onResize': angular.noop,
                    '$hide': angular.noop
                };

                var thisGlyph = Shapes.createShape($scope.glyphObject.type, elem);

                // initialize glyphEditor
                glyphEditor.$initialize();

                // update draggable constraints
                /* getContraintFn
                 * @param shape - a drawn SVG object
                 */
                var getConstraintFn = function getConstraintFn(shape) {

                    return function getConstraints(x, y) {

                        var containerBox = telestrationInterface.telestrationContainerElement[0].getBoundingClientRect();
                        if (shape) return (x > 0) && (x < containerBox.width - shape.width()) && (y > 0) && (y < containerBox.height - shape.height());
                        else return (x > 0) && (x < containerBox.width) && (y > 0) && (y < containerBox.height);
                    };
                };

                thisGlyph.setDraggableConstraintFn(getConstraintFn(thisGlyph.getShapeContext()));
                glyphEditor.$setDraggableConstraintFn(getConstraintFn());

                var glyphOutOfFocus = function glyphOutOfFocus(event) {
                    glyphEditor.$hide();
                    SVG.off($window, 'click', glyphOutOfFocus);
                };

                // register listeners

                thisGlyph.onTextChanged(function(updatedText) {
                    $scope.glyphObject.text = updatedText;
                    drawGlyph();
                });

                thisGlyph.onClick(function(event) {

                    event.stopPropagation();

                    // hide glyph editor if you click out of glyph
                    SVG.on($window, 'click', glyphOutOfFocus);

                    glyphSelected = true;

                    // Bring glyph to the front of the context
                    thisGlyph.bringToFront();

                    // update the glyph edit widget positions
                    var glyphVerticesInPixels = $scope.glyphObject.getVerticesInPixels();
                    glyphEditor.$setEditRegion(glyphVerticesInPixels[0],glyphVerticesInPixels[1]);

                    // Update the glyph vertices as redraw glyph as the glyph resize widgets change position
                    glyphEditor.$onResize(function resizeCallback(start, end) {
                        $scope.glyphObject.updateVertexFromPixels(0, start.x, start.y);
                        $scope.glyphObject.updateVertexFromPixels(1, end.x, end.y);
                        drawGlyph();
                    });

                    // Remove the glyph if the delete widget is clicked
                    glyphEditor.$onDeleteClick(function removeGlyph() {
                        telestrationInterface.removeGlyph($scope.glyphObject);
                        $scope.$apply();
                    });
                });

                thisGlyph.onMoveStart(function() {
                    glyphEditor.$hide();
                });

                thisGlyph.onMoved(function(delta) {
                    $scope.glyphObject.getVerticesInPixels().forEach(function(vertex, index) {
                        var pixelX = vertex.x + delta.x;
                        var pixelY = vertex.y + delta.y;
                        $scope.glyphObject.updateVertexFromPixels(index, pixelX, pixelY);
                    });
                });

                var resetGlyphContext = function resetGlyphContext() {

                    // update the glyph edit widget positions
                    var glyphVerticesInPixels = $scope.glyphObject.getVerticesInPixels();
                    glyphEditor.$setEditRegion(glyphVerticesInPixels[0],glyphVerticesInPixels[1]);

                    // draw glyph
                    drawGlyph();
                };

                angular.element($window).bind('resize', resetGlyphContext);

                var drawGlyph = function drawGlyph() {

                    var vertices = $scope.glyphObject.getVerticesInPixels();

                    if (vertices && vertices.length && vertices.length > 1) {

                        // Draw/update the correct shape onto the canvas
                        thisGlyph.render(vertices, $scope.glyphObject.color, $scope.glyphObject.text);
                    }
                };


                $scope.glyphObject.registerDrawingFunction(drawGlyph);

                elem.on('$destroy', function() {
                    thisGlyph.destroy();
                    $window.removeEventListener('resize', resetGlyphContext);
                    SVG.off($window, 'click', glyphOutOfFocus);
                    glyphEditor.$hide();
                });
            }
        };
    }
]);
