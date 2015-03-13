
/* Glyph - Abstract Base Class */

module.exports = [
    function() {

        function Glyph(type, options, SVGContext, shape) {

            // required parameter
            if (!this.type && !type) throw new Error('Glyph parameter \'type\' is required');
            if (!options) throw new Error('Glyph parameter \'options\' is required');
            if (!options.color) throw new Error('Glyph parameter \'options.color\' is required');

            // Glyph Model
            this.type = type;
            this.color = options.color;
            this.vertices = options.vertices || [];

            // Set Default Model Values
            this.currentShape = shape || null;
            this.SVGContext = SVGContext;
            this.constraintFn = null;
            this.text = null;
            this.dashedArray = null;

            this.registerEditListeners();
            this.registerMoveListeners();
        }


        /* Default Values */

        Glyph.prototype.EDITABLE = true;
        Glyph.prototype.MOVEABLE = true;
        Glyph.prototype.STROKE_WIDTH = 8;
        Glyph.prototype.DASHED_ARRAY = '2,2';
        Glyph.prototype.MIN_VERTICES = 2;


        /* Class Functions */

        Glyph.prototype.getSVGBoxDimensions = function getSVGBoxDimensions() {
            return {
                width: this.SVGContext.width(),
                height: this.SVGContext.height()
            };
        };

        Glyph.prototype.updateEndpointFromPixels = function updateEndpointFromPixels(x, y) {

            this.updateVertexFromPixels(1, x, y);

        };

        Glyph.prototype.getVerticesInPixels = function getVerticesInPixels() {

            var boundingBox = this.getSVGBoxDimensions();

            var verticesInPixels = this.vertices.map(function convertToPixels(vertex) {
                var relativeX = vertex.x * boundingBox.width;
                var relativeY = vertex.y * boundingBox.height;
                return {x: relativeX, y: relativeY};
            });

            return verticesInPixels;

        };

        Glyph.prototype.addVertexFromPixels = function addVertexFromPixels(x, y) {

            x = lowerBoundVertex(x);
            y = lowerBoundVertex(y);

            var boundingBox = this.getSVGBoxDimensions();
            var relativeX = x / boundingBox.width;
            var relativeY = y / boundingBox.height;

            this.vertices.push({x: relativeX, y: relativeY});

        };

        Glyph.prototype.updateVertexFromPixels = function updateVertexFromPixels(index, x, y) {

            x = lowerBoundVertex(x);
            y = lowerBoundVertex(y);

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
            if (self.EDITABLE && self.currentShape) {
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

            if (self.MOVEABLE && self.currentShape) {
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

        /*
         * decommission hides listeners, but sub-classes may override to
         * cleanup any additional extraneous objects
         */
        Glyph.prototype.decommission = function decommissionGlyph() {
            this.removeListeners();
        };

        Glyph.prototype.removeListeners = function removeListeners() {

            if (this.MOVEABLE && this.currentShape) this.currentShape.fixed();

            this.activeListenerRemovers.forEach(function(listenerRemoverFunc) {
                listenerRemoverFunc();
            });
        };

        Glyph.prototype.destroy = function() {

            // remove listeners first
            this.removeListeners();

            // remove the svg
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

            if (self.MOVEABLE && self.currentShape && !self.constraintFn) {

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
            this.dashedArray = dashedArray || this.DASHED_ARRAY;
        };

        Glyph.prototype.hasMinimumVertices = function hasMinimumVertices() {

            if (this.vertices && this.vertices.length >= this.MIN_VERTICES) return true;
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

        function lowerBoundVertex(val) { return (val >= 0) ? val : 0; }

        return Glyph;
    }
];
