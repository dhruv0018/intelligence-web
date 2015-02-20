
/* Glyph - Abstract Base Class */

module.exports = [
    'GlyphConstants',
    function(GlyphConstants) {

        function Glyph(type, SVGContext, shape, color, vertices) {

            // required parameter
            if (!this.type && !type) throw new Error('Glyph parameter \'type\' is required');

            // Glyph Model
            this.type = type;
            this.color = color;
            this.vertices = vertices || [];

            // Set Default Model Values
            this.currentShape = shape || null;
            this.SVGContext = SVGContext;
            this.strokeWidth = GlyphConstants.STROKE_WIDTH;
            this.constraintFn = null;
            this.text = null;
            this.dashedArray = null;

            this.registerEditListeners();
            this.registerMoveListeners();
        }

        Glyph.prototype.editable = true;
        Glyph.prototype.moveable = true;

        Glyph.prototype.getSVGBoxDimensions = function getSVGBoxDimensions() {
            return {
                width: this.SVGContext.width(),
                height: this.SVGContext.height()
            };
        };

        Glyph.prototype.updateGlyphFromPixels = function updateGlyphFromPixels(x, y) {
            // TODO: only call getBoundingClientRect on window Resize
            var boundingBox = this.getSVGBoxDimensions();
            var relativeX = x / boundingBox.width;
            var relativeY = y / boundingBox.height;
            var newVertex = {x: relativeX, y: relativeY};

            this.vertices[1] = newVertex;
        };

        Glyph.prototype.getVerticesInPixels = function getVerticesInPixels() {
            // TODO: only call getBoundingClientRect on window Resize
            var boundingBox = this.getSVGBoxDimensions();
            var verticesInPixels = this.vertices.map(function convertToPixels(vertex) {
                var relativeX = vertex.x * boundingBox.width;
                var relativeY = vertex.y * boundingBox.height;
                return {x: relativeX, y: relativeY};
            });
            return verticesInPixels;
        };

        Glyph.prototype.addVertexFromPixels = function addVertexFromPixels(x, y) {
            // TODO: only call getBoundingClientRect on window Resize
            var boundingBox = this.getSVGBoxDimensions();
            var relativeX = x / boundingBox.width;
            var relativeY = y / boundingBox.height;
            this.vertices.push({x: relativeX, y: relativeY});
        };

        Glyph.prototype.updateVertexFromPixels = function updateVertexFromPixels(index, x, y) {
            // TODO: only call getBoundingClientRect on window Resize
            var boundingBox = this.getSVGBoxDimensions();
            var relativeX = x / boundingBox.width;
            var relativeY = y / boundingBox.height;
            this.vertices[index] = {x: relativeX, y: relativeY};
        };

        Glyph.prototype.registerShapeContainerElement = function registerShapeContainerElement(elem) {
            this.elem = elem || null;
        };

        Glyph.prototype.getVertexInPixels = function getVertexInPixels(index) {

            var boundingBox = this.getSVGBoxDimensions();

            if (this.vertices && this.vertices.length > index) {

                var vertex = this.vertices[index];
                var relativeX = vertex.x * boundingBox.width;
                var relativeY = vertex.y * boundingBox.height;

                return {x: relativeX, y: relativeY};
            }
        };

        Glyph.prototype.registerEditListeners = function() {
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

        Glyph.prototype.registerMoveListeners = function() {
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

                self.currentShape.dragend = function(delta, event) {
                    self.constrainDelta(delta);

                    self.startPosition = null;

                    if (typeof self.onMovedHandler === 'function') self.onMovedHandler(delta);
                };
            }
        };

        Glyph.prototype.constrainDelta = function constrainDelta(delta) {
            var self = this;

            if (self.constraintFn) {

                var endPosition = {x: self.currentShape.x(), y: self.currentShape.y()};

                delta.x = endPosition.x - self.startPosition.x;
                delta.y = endPosition.y - self.startPosition.y;
            }
            return delta;
        };

        Glyph.prototype.bringToFront = function bringToFront() {
            if (this.currentShape) this.currentShape.front();
        };

        Glyph.prototype.hide = function hide() {
            if (this.currentShape) this.currentShape.hide();
        };

        Glyph.prototype.show = function show() {
            if (this.currentShape) this.currentShape.show();
        };

        Glyph.prototype.getShapeContext = function getShapeContext() {
            if (this.currentShape) return this.currentShape;
        };

        Glyph.prototype.activeListenerRemovers = [];

        Glyph.prototype.destroy = function() {
            if (this.moveable && this.currentShape) this.currentShape.fixed();

            this.activeListenerRemovers.forEach(function(listenerRemoverFunc) {
                listenerRemoverFunc();
            });
            if (this.currentShape) this.currentShape.remove();
        };

        Glyph.prototype.onTextChanged = function(onTextChangedHandler) {
            this.onTextChangedHandler = onTextChangedHandler;
        };

        Glyph.prototype.onClick = function(onClickHandler) {
            this.onClickHandler = onClickHandler;
        };

        Glyph.prototype.onMoved = function(onMovedHandler) {
            this.onMovedHandler = onMovedHandler;
        };

        Glyph.prototype.onMoveStart = function(onMoveStartHandler) {
            this.onMoveStartHandler = onMoveStartHandler;
        };

        /* Glyph.prototype.setDraggableConstraintFn
         * Updates the current bounding constraintFn for moving a shape.
         * @param constraintFn : function
         */
        Glyph.prototype.setDraggableConstraintFn = function setDraggableConstraintFn(constraintFn) {
            var self = this;

            if (self.moveable && self.currentShape && !self.constraintFn) {

                // if (self.constraints) self.currentShape.fixed(); // reset the draggable plugin

                self.constraintFn = constraintFn;
                self.currentShape.draggable(constraintFn);
            }
        };

        Glyph.prototype.setText = function setText(text) {
            this.text = text || this.text;
        };

        Glyph.prototype.setColor = function setColor(color) {
            this.color = color || this.color;
        };

        Glyph.prototype.setDashedArray = function setDashedArray(dashedArray) {
            this.dashedArray = dashedArray || GlyphConstants.DASHED_ARRAY;
        };

        Glyph.prototype.unextend = function unextendGlyph() {

            var self = this;

            var modelAttributes = ['vertices', 'type', 'color', 'zIndex', 'text'];

            var copy = {};

            Object.keys(self).forEach(function copyAttributes(attribute) {

                var isMember = (modelAttributes.indexOf(attribute) == -1) ? false : true;
                if (isMember) copy[attribute] = self[attribute];

            });

            return copy;

        };

        return Glyph;
    }
];
