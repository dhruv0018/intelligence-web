angular.module('GlyphShapes.Shape', []).factory('ShapeFactory', [
    'TelestrationInterface', 'GlyphShapesConstants',
    function(telestrationInterface, glyphShapesConstants) {

        function Shape() {}

        Shape.prototype.BORDER_WIDTH = glyphShapesConstants.BORDER_WIDTH;
        Shape.prototype.T_BAR_LENGTH = glyphShapesConstants.T_BAR_LENGTH;
        Shape.prototype.ARROW_SIDE_LENGTH = glyphShapesConstants.ARROW_SIDE_LENGTH;
        Shape.prototype.ARROW_HEIGHT = Math.sqrt(5 / 4 * glyphShapesConstants.ARROW_SIDE_LENGTH * glyphShapesConstants.ARROW_SIDE_LENGTH);
        Shape.prototype.editable = true;
        Shape.prototype.moveable = true;
        Shape.prototype.defaultColor = '#ffff00';
        Shape.prototype.constraints = null;

        Shape.prototype.registerEditListeners = function() {
            var self = this;
            if (self.editable && self.currentShape) {
                self.currentShape.on('click', function(mouseEvent) {
                    if (typeof self.onClickHandler === 'function') self.onClickHandler();
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

            if (self.constraints) {

                var endPosition = {x: self.currentShape.x(), y: self.currentShape.y()};

                delta.x = endPosition.x - self.startPosition.x;
                delta.y = endPosition.y - self.startPosition.y;
            }
            return delta;
        };

        Shape.prototype.activeListenerRemovers = [];

        Shape.prototype.destroy = function() {
            if (this.moveable) this.currentShape.fixed();

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

        /* Shape.prototype.updateDraggableConstraint
         * Updates the current bounding constraints for moving a shape.
         * @param constraints : object
         * {
         *  minX: int,
         *  minY: int,
         *  maxX: int,
         *  maxY: int
         * }
         */
        Shape.prototype.updateDraggableConstraints = function(constraints) {
            var self = this;

            if (self.moveable && self.currentShape) {
                self.constraints = constraints;
                self.currentShape.draggable(constraints);
            }
        };

        return Shape;
    }
]);
