
/* Freehand SVGGlyph - extends SVGGlyph */

module.exports = [
    'SVGGlyphValue',
    function(SVGGlyph) {

        function Freehand(type, options, containerElement, SVGContext) {

            SVGGlyph.call(this, type, options, containerElement, SVGContext, SVGContext.path());

            this.addMoveHandlers();
        }
        angular.inheritPrototype(Freehand, SVGGlyph);

        Freehand.prototype.RESIZABLE = false;
        Freehand.prototype.MIN_VERTICES = 1;
        Freehand.prototype.MAX_VERTICES = 1200;

        Freehand.prototype.updateEndPointFromPixels = function updateEndPointFromPixels(x, y) {

            if (this.vertices.length <= this.MAX_VERTICES) {

                var boundingBox = this.getContainerDimensions();
                var relativeX = x / boundingBox.width;
                var relativeY = y / boundingBox.height;
                var newVertex = {x: relativeX, y: relativeY};

                this.vertices.push(newVertex);
            }
        };

        Freehand.prototype.renderShape = function renderShape() {

            var verticesInPixels = this.getVerticesInPixels();

            var startPoint = verticesInPixels[0];

            var pathData = 'M ' + startPoint.x + ' ' + startPoint.y + ' L';
            for (var i = 1; i < verticesInPixels.length; i++) {

                pathData += ' ' + verticesInPixels[i].x + ' ' + verticesInPixels[i].y;
            }

            this.primarySVGShape.plot(pathData);
        };

        Freehand.prototype.renderAttributes = function renderAttributes() {

            let attributes = {
                fill: 'none',
                stroke: this.color,
                'stroke-width': this.STROKE_WIDTH,
                'stroke-linejoin':'round',
                'stroke-linecap': 'round',
                'stroke-dasharray': this.dashedArray
            };

            this.primarySVGShape.attr(attributes);
        };

        Freehand.prototype.render = function renderFreehand() {

            this.renderShape();
            this.renderAttributes();
        };

        Freehand.prototype.hasMinimumVertices = function hasMinimumVertices() {

            if (this.vertices && this.vertices.length >= this.MIN_VERTICES) return true;
        };

        return Freehand;
    }
];
