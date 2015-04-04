
/* Freehand SVGGlyph - extends SVGGlyph */

module.exports = [
    'SVGGlyphValue',
    function(SVGGlyph) {

        function Freehand(type, options, containerElement, SVGContext) {

            SVGGlyph.call(this, type, options, containerElement, SVGContext, SVGContext.path());

            if (this.EDITABLE) this.addEditHandlers(); // optional hook
            if (this.MOVEABLE) this.addMoveHandlers(); // optional hook
        }
        angular.inheritPrototype(Freehand, SVGGlyph);

        Freehand.prototype.EDITABLE = false;
        Freehand.prototype.MOVEABLE = false;
        Freehand.prototype.MIN_VERTICES = 1;
        Freehand.prototype.MAX_VERTICES = 1200;

        Freehand.prototype.updateEndPointFromPixels = function updateEndPointFromPixels(x, y) {
            // TODO: only call getBoundingClientRect on window Resize

            if (this.vertices.length <= this.MAX_VERTICES) {

                var boundingBox = this.getContainerDimensions();
                var relativeX = x / boundingBox.width;
                var relativeY = y / boundingBox.height;
                var newVertex = {x: relativeX, y: relativeY};

                this.vertices.push(newVertex);
            }
        };

        Freehand.prototype.render = function renderFreehand() {

            var verticesInPixels = this.getVerticesInPixels();

            var startPoint = verticesInPixels[0];

            var pathData = 'M ' + startPoint.x + ' ' + startPoint.y + ' L';
            for (var i = 1; i < verticesInPixels.length; i++) {

                pathData += ' ' + verticesInPixels[i].x + ' ' + verticesInPixels[i].y;
            }

            var attributes = {
                fill: 'none',
                stroke: this.color,
                'stroke-width': this.STROKE_WIDTH,
                'stroke-linejoin':'round',
                'stroke-linecap': 'round',
                'stroke-dasharray': this.dashedArray
            };

            this.primarySVGShape.plot(pathData).attr(attributes);
        };

        Freehand.prototype.hasMinimumVertices = function hasMinimumVertices() {

            if (this.vertices && this.vertices.length >= this.MIN_VERTICES) return true;
        };

        return Freehand;
    }
];
