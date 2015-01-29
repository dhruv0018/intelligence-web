require('./arrow');
require('./tbar');
require('./circle');
require('./shadow-circle');
require('./cone');
require('./freehand');
require('./textbox');

var GlyphShapes = angular.module('GlyphShapes', [
    'GlyphShapes.ArrowShape',
    'GlyphShapes.TBarShape',
    'GlyphShapes.CircleShape',
    'GlyphShapes.ShadowCircleShape',
    'GlyphShapes.ConeShape',
    'GlyphShapes.FreehandShape',
    'GlyphShapes.TextBoxShape'
]);

GlyphShapes.value('GlyphShapesConstants', {
    BORDER_WIDTH: 8,
    T_BAR_LENGTH: 100,
    ARROW_SIDE_LENGTH: 10
});

GlyphShapes.factory('GlyphShapeRenderer', [
    'TelestrationInterface', 'GlyphShapesConstants', 'TELESTRATION_TYPES', '$location', 'ArrowFactory', 'TBarFactory', 'CircleFactory', 'ShadowCircleFactory', 'ConeFactory', 'FreehandFactory', 'TextBoxFactory',
    function(telestrationInterface, glyphShapesConstants, TELESTRATION_TYPES, $location, Arrow, TBar, Circle, ShadowCircle, Cone, Freehand, TextBox) {

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

            // Give concrete object access to super class methods
            shapeTypeObj.parent = ShapeRenderer.prototype;

            angular.augment(shapeTypeObj, ShapeRenderer.prototype);

            // register listeners with the concrete object
            shapeTypeObj.registerEditListeners();
            shapeTypeObj.registerMoveListeners();

            return shapeTypeObj;
        }

        ShapeRenderer.prototype.BORDER_WIDTH = glyphShapesConstants.BORDER_WIDTH;
        ShapeRenderer.prototype.T_BAR_LENGTH = glyphShapesConstants.T_BAR_LENGTH;
        ShapeRenderer.prototype.ARROW_SIDE_LENGTH = glyphShapesConstants.ARROW_SIDE_LENGTH;
        ShapeRenderer.prototype.ARROW_HEIGHT = Math.sqrt(5 / 4 * glyphShapesConstants.ARROW_SIDE_LENGTH * glyphShapesConstants.ARROW_SIDE_LENGTH);
        ShapeRenderer.prototype.editable = true;
        ShapeRenderer.prototype.moveable = true;
        ShapeRenderer.prototype.defaultColor = '#ffff00';
        ShapeRenderer.prototype.constraints = null;

        ShapeRenderer.prototype.registerEditListeners = function() {
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

        ShapeRenderer.prototype.registerMoveListeners = function() {
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

        ShapeRenderer.prototype.constrainDelta = function constrainDelta(delta) {
            var self = this;

            if (self.constraints) {

                var endPosition = {x: self.currentShape.x(), y: self.currentShape.y()};

                delta.x = endPosition.x - self.startPosition.x;
                delta.y = endPosition.y - self.startPosition.y;
            }
            return delta;
        };

        ShapeRenderer.prototype.activeListenerRemovers = [];

        ShapeRenderer.prototype.destroy = function() {
            this.activeListenerRemovers.forEach(function(listenerRemoverFunc) {
                listenerRemoverFunc();
            });
            if (this.currentShape) this.currentShape.remove();
        };

        ShapeRenderer.prototype.onClick = function(onClickHandler) {
            this.onClickHandler = onClickHandler;
        };

        ShapeRenderer.prototype.onMoved = function(onMovedHandler) {
            this.onMovedHandler = onMovedHandler;
        };

        ShapeRenderer.prototype.onMoveStart = function(onMoveStartHandler) {
            this.onMoveStartHandler = onMoveStartHandler;
        };

        ShapeRenderer.prototype.onMove = function(onMoveHandler) {
            this.onMoveHandler = onMoveHandler;
        };

        /* ShapeRenderer.prototype.updateDraggableConstraint
         * Updates the current bounding constraints for moving a shape.
         * @param constraints : object
         * {
         *  minX: int,
         *  minY: int,
         *  maxX: int,
         *  maxY: int
         * }
         */
        ShapeRenderer.prototype.updateDraggableConstraints = function(constraints) {
            var self = this;

            if (self.moveable && self.currentShape) {
                self.constraints = constraints;
                self.currentShape.draggable(constraints);
            }
        };

        return ShapeRenderer;
    }
]);
