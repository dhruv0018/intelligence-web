
/* Freehand Glyph - extends Glyph */

module.exports = [
    'GlyphValue',
    function(Glyph) {

        function Freehand(type, options, SVGContext) {

            Glyph.call(this, type, options, SVGContext, SVGContext.path());

        }
        angular.inheritPrototype(Freehand, Glyph);

        Freehand.prototype.EDITABLE = false;
        Freehand.prototype.MOVEABLE = false;
        Freehand.prototype.MIN_VERTICES = 1;

        Freehand.prototype.updateEndpointFromPixels = function updateEndpointFromPixels(x, y) {
            // TODO: only call getBoundingClientRect on window Resize
            var boundingBox = this.getSVGBoxDimensions();
            var relativeX = x / boundingBox.width;
            var relativeY = y / boundingBox.height;
            var newVertex = {x: relativeX, y: relativeY};

            this.vertices.push(newVertex);
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

            this.currentShape.plot(pathData).attr(attributes);
        };

        Freehand.prototype.hasMinimumVertices = function hasMinimumVertices() {

            if (this.vertices && this.vertices.length >= this.MIN_VERTICES) return true;
        };

        return Freehand;
    }
];
