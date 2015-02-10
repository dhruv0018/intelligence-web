angular.module('GlyphShapes.Shape', []).factory('ShapeFactory', [
    'TelestrationInterface', 'GlyphShapesConstants', 'TELESTRATION_TYPES',
    function(telestrationInterface, glyphShapesConstants, TELESTRATION_TYPES) {

        function Shape(type, shape) {

            // required parameter
            if (!type) throw new Error('Shape parameter \'type\' is required');

            this.type = type;
            this.currentShape = shape || null;

            // set default attributes
            this.vertices = [];
            this.color = glyphShapesConstants.DEFAULT_COLOR;
            this.strokeWidth = glyphShapesConstants.STROKE_WIDTH;
            this.constraintFn = null;

            this.registerEditListeners();
            this.registerMoveListeners();
        }

        Shape.prototype.editable = true;
        Shape.prototype.moveable = true;

        Shape.prototype.updateGlyphFromPixels = function updateGlyphFromPixels(x, y) {
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

        Shape.prototype.getVerticesInPixels = function getVerticesInPixels() {
            // TODO: only call getBoundingClientRect on window Resize
            var boundingBox = telestrationInterface.telestrationContainerElement[0].getBoundingClientRect();
            var verticesInPixels = this.vertices.map(function convertToPixels(vertex) {
                var relativeX = vertex.x * boundingBox.width;
                var relativeY = vertex.y * boundingBox.height;
                return {x: relativeX, y: relativeY};
            });
            return verticesInPixels;
        };

        Shape.prototype.addVertexFromPixels = function addVertexFromPixels(x, y) {
            // TODO: only call getBoundingClientRect on window Resize
            var boundingBox = telestrationInterface.telestrationContainerElement[0].getBoundingClientRect();
            var relativeX = x / boundingBox.width;
            var relativeY = y / boundingBox.height;
            this.vertices.push({x: relativeX, y: relativeY});
        };

        Shape.prototype.updateVertexFromPixels = function updateVertexFromPixels(index, x, y) {
            // TODO: only call getBoundingClientRect on window Resize
            var boundingBox = telestrationInterface.telestrationContainerElement[0].getBoundingClientRect();
            var relativeX = x / boundingBox.width;
            var relativeY = y / boundingBox.height;
            this.vertices[index] = {x: relativeX, y: relativeY};
        };

        Shape.prototype.registerShapeContainerElement = function registerShapeContainerElement(elem) {
            this.elem = elem || null;
        };

        Shape.prototype.registerEditListeners = function() {
            var self = this;
            if (self.editable && self.currentShape) {
                self.currentShape.on('click', function(mouseEvent) {
                    if (typeof self.onClickHandler === 'function') self.onClickHandler(mouseEvent);
                });

                self.activeListenerRemovers.push(function() {
                    self.currentShape.off('click');
                });
            }
        };

        Shape.prototype.registerMoveListeners = function() {
            var self = this;
            var top;
            var left;
            var right;
            var bottom;
            var shapeRect;

            if (self.moveable && self.currentShape) {
                self.currentShape.draggable();
                self.currentShape.startPosition = null;

                self.currentShape.on('mousedown', function(mouseEvent) {
                    mouseEvent.stopPropagation(); //prevent drawing
                });
                self.activeListenerRemovers.push(function() {
                    self.currentShape.off('mousedown');
                });

                // hover event
                self.currentShape.mouseover(function mouseover(mouseEvent) {
                    self.currentShape.addClass('hover');
                    this.filter(function(add) {
                        var blur = add.gaussianBlur(2);
                        add.blend(add.source, blur);
                        this.size('200%','200%');
                    });
                });
                self.activeListenerRemovers.push(function() {
                    self.currentShape.off('mouseover');
                });

                self.currentShape.mouseout(function mouseout(mouseEvent) {
                    self.currentShape.removeClass('hover');
                    this.unfilter(true);
                });
                self.activeListenerRemovers.push(function() {
                    self.currentShape.off('mouseout');
                });

                self.currentShape.dragstart = function(delta, event) {
                    self.startPosition = {x: self.currentShape.x(), y: self.currentShape.y()};

                    if (typeof self.onMoveStartHandler === 'function') self.onMoveStartHandler();
                };

                self.currentShape.dragmove = function(delta, event) {
                    self.constrainDelta(delta);

                    if (typeof self.onMoveHandler === 'function') self.onMoveHandler(delta, event);
                };

                self.currentShape.dragend = function(delta, event) {
                    self.constrainDelta(delta);

                    self.startPosition = null;

                    if (typeof self.onMovedHandler === 'function') self.onMovedHandler(delta);
                };
            }
        };

        Shape.prototype.constrainDelta = function constrainDelta(delta) {
            var self = this;

            if (self.constraintFn) {

                var endPosition = {x: self.currentShape.x(), y: self.currentShape.y()};

                delta.x = endPosition.x - self.startPosition.x;
                delta.y = endPosition.y - self.startPosition.y;
            }
            return delta;
        };

        Shape.prototype.bringToFront = function bringToFront() {
            if (this.currentShape) this.currentShape.front();
        };

        Shape.prototype.getShapeContext = function getShapeContext() {
            if (this.currentShape) return this.currentShape;
        };

        Shape.prototype.activeListenerRemovers = [];

        Shape.prototype.destroy = function() {
            if (this.moveable && this.currentShape) this.currentShape.fixed();

            this.activeListenerRemovers.forEach(function(listenerRemoverFunc) {
                listenerRemoverFunc();
            });
            if (this.currentShape) this.currentShape.remove();
        };

        Shape.prototype.onClick = function(onClickHandler) {
            this.onClickHandler = onClickHandler;
        };

        Shape.prototype.onMoved = function(onMovedHandler) {
            this.onMovedHandler = onMovedHandler;
        };

        Shape.prototype.onMoveStart = function(onMoveStartHandler) {
            this.onMoveStartHandler = onMoveStartHandler;
        };

        Shape.prototype.onMove = function(onMoveHandler) {
            this.onMoveHandler = onMoveHandler;
        };

        /* Shape.prototype.setDraggableConstraintFn
         * Updates the current bounding constraintFn for moving a shape.
         * @param constraintFn : function
         */
        Shape.prototype.setDraggableConstraintFn = function setDraggableConstraintFn(constraintFn) {
            var self = this;

            if (self.moveable && self.currentShape && !self.constraintFn) {

                // if (self.constraints) self.currentShape.fixed(); // reset the draggable plugin

                self.constraintFn = constraintFn;
                self.currentShape.draggable(constraintFn);
            }
        };

        return Shape;
    }
]);
