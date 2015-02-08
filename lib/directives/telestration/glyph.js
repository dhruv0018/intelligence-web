require('glyph-shapes');

var Glyph = angular.module('Glyph', [
    'GlyphShapes'
]);

Glyph.factory('GlyphFactory', [
    'TELESTRATION_TYPES', 'TelestrationInterface',
    function(TELESTRATION_TYPES, telestrationInterface) {
        return function Glyph(glyphType, glyphZIndex) {

            this.type = glyphType || TELESTRATION_TYPES.FREEHAND;
            this.text = 'Enter text here';
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
                var newVertex = [relativeX, relativeY];

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
                    var relativeX = vertex[0] * boundingBox.width;
                    var relativeY = vertex[1] * boundingBox.height;
                    return [relativeX, relativeY];
                });
                return verticesInPixels;
            };

            this.addVertexFromPixels = function addVertexFromPixels(x, y) {
                // TODO: only call getBoundingClientRect on window Resize
                var boundingBox = telestrationInterface.telestrationContainerElement[0].getBoundingClientRect();
                var relativeX = x / boundingBox.width;
                var relativeY = y / boundingBox.height;
                this.vertices.push([relativeX, relativeY]);
            };

            this.updateVertexFromPixels = function updateVertexFromPixels(index, x, y) {
                // TODO: only call getBoundingClientRect on window Resize
                var boundingBox = telestrationInterface.telestrationContainerElement[0].getBoundingClientRect();
                var relativeX = x / boundingBox.width;
                var relativeY = y / boundingBox.height;
                this.vertices[index] = [relativeX, relativeY];
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
                 * Updates the current bounding constraints for moving the glyph editor widgets.
                 * @param constraints : object
                 * {
                 *  minX: int,
                 *  minY: int,
                 *  maxX: int,
                 *  maxY: int
                 * }
                 */
                self.$updateDraggableConstraints = function glyphEditorUpdateDraggableConstraints(constraints) {
                    if (!initialized) {
                        throw new Error('Glyph Editor not initialized');
                    }
                    if (constraints) {
                        self.constraints = constraints;
                        self.startResizeWidget.draggable(constraints);
                        self.endResizeWidget.draggable(constraints);
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
                    var startX = startVertex[0] + self.resizeWidgetCenterOffset;
                    var startY = startVertex[1] + self.resizeWidgetCenterOffset;
                    var endX = endVertex[0] + self.resizeWidgetCenterOffset;
                    var endY = endVertex[1] + self.resizeWidgetCenterOffset;

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

                    var startResizeWidgetPos = [startX, startY];
                    var endResizeWidgetPos = [endX, endY];

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

                    var startResizeWidgetPos = [startX, startY];
                    var endResizeWidgetPos = [endX, endY];

                    self.resize(startResizeWidgetPos, endResizeWidgetPos);

                    moveDeleteWidget();
                }

                function constrainDelta(delta, resizeWidget) {
                    if (self.constraints) {

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
    '$window', 'GlyphShapeRenderer', 'TelestrationInterface',
    function($window, GlyphShapeRenderer, telestrationInterface) {
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

                var thisGlyph = GlyphShapeRenderer.getGlyphShape($scope.glyphObject.type, elem);

                // update draggable constraints

                thisGlyph.updateDraggableConstraints(getConstraints());

                glyphEditor.$initialize();
                glyphEditor.$updateDraggableConstraints(getConstraints());

                function getConstraints() {
                    var containerBox = telestrationInterface.telestrationContainerElement[0].getBoundingClientRect();

                    var constraints = {
                        minX: 0,
                        maxX: containerBox.width,
                        minY: 0,
                        maxY: containerBox.height
                    };
                    return constraints;
                }

                var glyphOutOfFocus = function glyphOutOfFocus(event) {
                    glyphEditor.$hide();
                    SVG.off($window, 'click', glyphOutOfFocus);
                };

                // register listeners

                thisGlyph.onClick(function(event) {

                    event.stopPropagation();

                    // hide glyph editor if you click out of glyph
                    SVG.on($window, 'click', glyphOutOfFocus);

                    glyphSelected = true;

                    // update the glyph edit widget positions
                    var glyphVerticesInPixels = $scope.glyphObject.getVerticesInPixels();
                    glyphEditor.$setEditRegion(glyphVerticesInPixels[0],glyphVerticesInPixels[1]);

                    // Update the glyph vertices as redraw glyph as the glyph resize widgets change position
                    glyphEditor.$onResize(function resizeCallback(start, end) {
                        $scope.glyphObject.updateVertexFromPixels(0, start[0], start[1]);
                        $scope.glyphObject.updateVertexFromPixels(1, end[0], end[1]);
                        drawGlyph();
                    });

                    // Remove the glyph if the delete widget is clicked
                    glyphEditor.$onDeleteClick(function removeGlyph() {
                        var glyphIndex = telestrationInterface.glyphs.indexOf($scope.glyphObject);
                        telestrationInterface.glyphs.splice(glyphIndex, 1);
                        $scope.$apply();
                    });
                });

                thisGlyph.onMoveStart(function() {
                    glyphEditor.$hide();
                });

                thisGlyph.onMoved(function(delta) {
                    $scope.glyphObject.getVerticesInPixels().forEach(function(vertex, index) {
                        var pixelX = vertex[0] + delta.x;
                        var pixelY = vertex[1] + delta.y;
                        $scope.glyphObject.updateVertexFromPixels(index, pixelX, pixelY);
                    });
                });

                var resetGlyphContext = function resetGlyphContext() {
                    // udpate constraints
                    thisGlyph.updateDraggableConstraints(getConstraints());
                    glyphEditor.$updateDraggableConstraints(getConstraints());

                    // update the glyph edit widget positions
                    var glyphVerticesInPixels = $scope.glyphObject.getVerticesInPixels();
                    glyphEditor.$setEditRegion(glyphVerticesInPixels[0],glyphVerticesInPixels[1]);

                    // draw glyph
                    drawGlyph();
                };

                angular.element($window).bind('resize', resetGlyphContext);

                var drawGlyph = function drawGlyph() {

                    var vertices = $scope.glyphObject.getVerticesInPixels();
                    var startPoint = vertices[0];
                    var endPoint = vertices[1];

                    if (vertices && vertices.length && vertices.length > 1) {

                        // Draw/update the correct shape onto the canvas
                        thisGlyph.render(vertices, $scope.glyphObject.color, $scope.glyphObject.text);
                    }
                };


                $scope.glyphObject.registerDrawingFunction(drawGlyph);

                elem.on('$destroy', function() {
                    thisGlyph.destroy();
                    $window.removeEventListener('resize', resetGlyphContext);
                    glyphEditor.$hide();
                });
            }
        };
    }
]);
