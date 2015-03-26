
/* Glyph - Abstract Base Class */

module.exports = [
    function() {

        function Glyph(type, options, containerElement) {

            // required parameter
            if (!type) throw new Error('Glyph parameter \'type\' is required');
            if (!options) throw new Error('Glyph parameter \'options\' is required');
            if (!options.color) throw new Error('Glyph parameter \'options.color\' is required');
            if (!containerElement) throw new Error('Glyph parameter \'containerElement\' is required');

            // Glyph Model
            this.type = type;
            this.color = options.color;
            this.vertices = options.vertices || [];
            this.text = options.text || '';

            // Set additional non-member attributes
            this.containerElement = containerElement;
            this.dashedArray = null;
            this.constraintFn = null;
        }


        /* Default Values */

        Glyph.prototype.EDITABLE = true;
        Glyph.prototype.MOVEABLE = true;
        Glyph.prototype.MIN_VERTICES = 2;


        /* Getters & Setters */

        Glyph.prototype.setText = function setText(text) {

            this.text = text || this.text;
        };

        Glyph.prototype.setColor = function setColor(color) {

            this.color = color || this.color;
        };

        Glyph.prototype.setDashedArray = function setDashedArray(dashedArray) {

            this.dashedArray = dashedArray || this.DASHED_ARRAY;
        };

        Glyph.prototype.getMaxWidth = function getMaxWidth() {

            return this.getContainerDimensions().width;
        };

        /* Vertices Helper Functions */

        Glyph.prototype.getContainerDimensions = function getContainerDimensions() {

            return this.containerElement[0].getBoundingClientRect();
        };

        Glyph.prototype.getVerticesInPixels = function getVerticesInPixels() {

            var boundingBox = this.getContainerDimensions();

            var verticesInPixels = this.vertices.map(function convertToPixels(vertex) {

                var relativeX = vertex.x * boundingBox.width;
                var relativeY = vertex.y * boundingBox.height;

                return {x: relativeX, y: relativeY};
            });

            return verticesInPixels;
        };

        Glyph.prototype.getVertexInPixelsAtIndex = function getVertexInPixelsAtIndex(index) {

            var boundingBox = this.getContainerDimensions();

            if (this.vertices && this.vertices.length > index) {

                var vertex = this.vertices[index];
                var relativeX = vertex.x * boundingBox.width;
                var relativeY = vertex.y * boundingBox.height;

                return {x: relativeX, y: relativeY};
            }
        };

        Glyph.prototype.updateStartPointFromPixels = function updateStartPointFromPixels(x, y) {

            this.updateVertexFromPixels(0, x, y);
        };

        Glyph.prototype.updateEndPointFromPixels = function updateEndPointFromPixels(x, y) {

            this.updateVertexFromPixels(1, x, y);
        };

        Glyph.prototype.updateVertexFromPixels = function updateVertexFromPixels(index, x, y) {

            this.vertices[index] = this.createVertexFromPixels(x, y);
        };

        Glyph.prototype.hasMinimumVertices = function hasMinimumVertices() {

            if (this.vertices && this.vertices.length >= this.MIN_VERTICES) return true;
        };

        Glyph.prototype.createVertexFromPixels = function createVertexFromPixels(x, y) {

            x = lowerBoundVertex(x);
            y = lowerBoundVertex(y);

            var boundingBox = this.getContainerDimensions();
            var relativeX = x / boundingBox.width;
            var relativeY = y / boundingBox.height;

            return {x: relativeX, y: relativeY};
        };

        function lowerBoundVertex(val) { return (val >= 0) ? val : 0; }


        /* Callbacks and callback settings */

        /*
         * Sets the onClickHandler callback function
         */
        Glyph.prototype.onClick = function onClick(onClickHandler) {

            this.onClickHandler = onClickHandler;
        };

        /*
         * Sets the onDragStart callback function
         */
        Glyph.prototype.onDragStart = function onDragStart(onDragStartHandler) {

            this.onDragStartHandler = onDragStartHandler;
        };

        /*
         * Sets the onDragEnd callback function
         */
        Glyph.prototype.onDragEnd = function onDragEnd(onDragEndHandler) {

            this.onDragEndHandler = onDragEndHandler;
        };

        /*
         * Sets the onTextChanged callback function
         */
        Glyph.prototype.onTextChanged = function onTextChanged(onTextChangedHandler) {

            this.onTextChangedHandler = onTextChangedHandler;
        };

        /*
         * Optional click-handler with no operation by default
         */
        Glyph.prototype.onClickHandler = function onClickHandler() {

            noop();
        };

        /*
         * Optional click-handler with no operation by default
         */
        Glyph.prototype.onDragStartHandler = function onDragStartHandler() {

            noop();
        };

        /*
         * Optional click-handler with no operation by default
         */
        Glyph.prototype.onDragEndHandler = function onDragEndHandler() {

            noop();
        };

        /*
         * Optional textChanged-handler with no operation by default
         */
        Glyph.prototype.onTextChangedHandler = function onTextChangedHandler() {

            noop();
        };


        /* Optional Sub-class hooks */

        /*
         * Optional hook to constrain glyph
         */
        Glyph.prototype.setDraggableConstraintFn = function setDraggableConstraintFn() {

            noop();
        };

        /*
         * To be called after glyph has moved
         */
        Glyph.prototype.updateVerticesPositions = function updateVerticesPositions(delta) {

            var self = this;

            self.getVerticesInPixels().forEach(function updateVertexPosition(vertex, index) {

                var pixelX = vertex.x + delta.x;
                var pixelY = vertex.y + delta.y;

                self.updateVertexFromPixels(index, pixelX, pixelY);
            });
        };

        /* Cleanup Helper Functions */

        Glyph.prototype.activeListenerRemovers = [];

        /*
         * Hides listeners, but sub-classes may override to
         * cleanup any additional extraneous objects
         */
        Glyph.prototype.decommission = function decommissionGlyph() {

            this.removeListeners();
        };

        Glyph.prototype.removeListeners = function removeListeners() {

            this.activeListenerRemovers.forEach(function removeListener(listenerRemoverFunc) {

                listenerRemoverFunc();
            });
        };

        Glyph.prototype.destroy = function destroy() {

            this.removeListeners();
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

        /* Misc. helper functions */

        function noop() {

            return void (0);
        }

        return Glyph;
    }
];
