
/* Arrow Glyph - extends Glyph */

module.exports = [
    'GlyphValue', 'GlyphConstants', 'TELESTRATION_TYPES',
    function(Glyph, GlyphConstants, TELESTRATION_TYPES) {

        function Arrow(type, SVGContext) {

            Glyph.call(this, type, SVGContext, SVGContext.path());

        }
        angular.inheritPrototype(Arrow, Glyph);

        Arrow.prototype.ARROW_SIDE_LENGTH = GlyphConstants.ARROW_SIDE_LENGTH;
        Arrow.prototype.ARROW_HEIGHT = Math.sqrt(5 / 4 * GlyphConstants.ARROW_SIDE_LENGTH * GlyphConstants.ARROW_SIDE_LENGTH);

        Arrow.prototype.render = function renderArrow() {

            var verticesInPixels = this.getVerticesInPixels();

            if (verticesInPixels.length !== 2) throw new Error('Arrow render function requires 2 vertices and ' + verticesInPixels.length + ' given');

            var startPoint = verticesInPixels[0];
            var endPoint = verticesInPixels[1];

            //Calculate the arrowhead
            var m1 = ((endPoint.y - startPoint.y) / (endPoint.x - startPoint.x));
            var m = 0 - (1 / m1);
            var dx1 = 1 / Math.sqrt(m1 * m1 + 1);
            var dy1 = m1 / Math.sqrt(m1 * m1 + 1);
            var dx = 1 / Math.sqrt(m * m + 1);
            var dy = m / Math.sqrt(m * m + 1);
            if (isNaN(dy)) dy = 1;
            if (isNaN(dy1)) dy1 = 1;

            //3 points (x,y) for the arrowhead
            var arrowTip = [];
            var arrowBase1 = [];
            var arrowBase2 = [];
            if (endPoint.x - startPoint.x >= 0) {
                arrowTip[0] = endPoint.x + this.ARROW_HEIGHT * dx1;
                arrowTip[1] = endPoint.y + this.ARROW_HEIGHT * dy1;
            } else {
                arrowTip[0] = endPoint.x - this.ARROW_HEIGHT * dx1;
                arrowTip[1] = endPoint.y - this.ARROW_HEIGHT * dy1;
            }
            arrowBase1[0] = endPoint.x - (this.ARROW_SIDE_LENGTH / 2) * dx;
            arrowBase1[1] = endPoint.y - (this.ARROW_SIDE_LENGTH / 2) * dy;
            arrowBase2[0] = endPoint.x + (this.ARROW_SIDE_LENGTH / 2) * dx;
            arrowBase2[1] = endPoint.y + (this.ARROW_SIDE_LENGTH / 2) * dy;

            var attributes = {
                fill: this.color,
                stroke: this.color,
                'stroke-width': this.strokeWidth
            };

            if (this.type === TELESTRATION_TYPES.ARROW_DASHED) {
                attributes['stroke-dasharray'] = this.dashedArray;
            }

            this.currentShape.plot('M ' + startPoint.x + ' ' + startPoint.y + ' L ' + endPoint.x + ' ' + endPoint.y + ' M ' + arrowBase1[0] + ' ' + arrowBase1[1] + ' L ' + arrowTip[0] + ' ' + arrowTip[1] + ' ' + arrowBase2[0] + ' ' + arrowBase2[1] + ' z')
                .attr(attributes);
        };

        return Arrow;
    }
];
