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

        ShapeRenderer.prototype.registerEditListeners = function() {
            var self = this;
            if (self.editable && self.currentShape) {
                self.currentShape.on('click', function(mouseEvent) {
                    if (typeof self.onClickHandler === 'function') self.onClickHandler();
                });
            }
        };

        ShapeRenderer.prototype.registerMoveListeners = function() {
            var self = this;
            if (self.moveable && self.currentShape) {
                self.currentShape.draggable();

                self.currentShape.on('mousedown', function(mouseEvent) {
                    mouseEvent.stopPropagation(); //prevent drawing
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

                self.currentShape.mouseout(function mouseout(mouseEvent) {
                    self.currentShape.removeClass('hover');
                    this.unfilter(true);
                });

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
