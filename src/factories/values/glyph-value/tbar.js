
/* tBar - extends Glyph */

module.exports = [
    'GlyphValue', 'GlyphConstants',
    function(Glyph, GlyphConstants) {

        function TBar(type, SVGContext, color) {

            Glyph.call(this, type, SVGContext, SVGContext.path(), color);

        }
        angular.inheritPrototype(TBar, Glyph);

        TBar.prototype.T_BAR_LENGTH = GlyphConstants.T_BAR_LENGTH;

        TBar.prototype.render = function renderTBar() {

            var verticesInPixels = this.getVerticesInPixels();

            if (verticesInPixels.length !== 2) throw new Error('TBar render function requires 2 vertices and ' + verticesInPixels.length + ' given');

            var startPoint = verticesInPixels[0];
            var endPoint = verticesInPixels[1];

            //Calculate the T portion
            var m = 0 - (1 / ((endPoint.y - startPoint.y) / (endPoint.x - startPoint.x)));
            var dx = 1 / Math.sqrt(m * m + 1);
            var dy = m / Math.sqrt(m * m + 1);
            if (isNaN(dy)) dy = 1;

            //2 points (x,y) for the second line in the T
            var tPoint1 = [];
            var tPoint2 = [];
            tPoint1[0] = endPoint.x - (this.T_BAR_LENGTH / 2) * dx;
            tPoint1[1] = endPoint.y - (this.T_BAR_LENGTH / 2) * dy;
            tPoint2[0] = endPoint.x + (this.T_BAR_LENGTH / 2) * dx;
            tPoint2[1] = endPoint.y + (this.T_BAR_LENGTH / 2) * dy;

            var attributes = {
                fill: 'none',
                stroke: this.color,
                'stroke-width': this.strokeWidth,
                'stroke-dasharray': this.dashedArray
            };

            this.currentShape.plot('M ' + startPoint.x + ' ' + startPoint.y + ' L ' + endPoint.x + ' ' + endPoint.y + ' M ' + tPoint1[0] + ' ' + tPoint1[1] + ' L ' + tPoint2[0] + ' ' + tPoint2[1])
                .attr(attributes);
        };

        return TBar;
    }
];
