
/* Freehand Glyph - extends Glyph */

module.exports = [
    'GlyphValue',
    function(Glyph) {

        function Freehand(type, options, SVGContext) {

            Glyph.call(this, type, options, SVGContext, SVGContext.path());

        }
        angular.inheritPrototype(Freehand, Glyph);

        Freehand.prototype.editable = false;
        Freehand.prototype.moveable = false;

        Freehand.prototype.updateGlyphFromPixels = function updateGlyphFromPixels(x, y) {
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
                'stroke-width': this.strokeWidth,
                'stroke-linecap': 'round',
                'stroke-dasharray': this.dashedArray
            };

            this.currentShape.plot(pathData).attr(attributes);
        };

        Freehand.prototype.hasVertices = function hasVertices() {

            if (this.vertices && this.vertices.length >= 1) return true;
        };

        return Freehand;
    }
];
