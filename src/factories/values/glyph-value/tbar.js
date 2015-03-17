
/* tBar - extends SVGGlyph */

module.exports = [
    'SVGGlyphValue',
    function(SVGGlyph) {

        function TBar(type, options, containerElement, SVGContext) {

            SVGGlyph.call(this, type, options, containerElement, SVGContext, SVGContext.path());

            if (this.EDITABLE) this.addEditHandlers(); // optional hook
            if (this.MOVEABLE) this.addMoveHandlers(); // optional hook
        }
        angular.inheritPrototype(TBar, SVGGlyph);

        TBar.prototype.T_BAR_LENGTH = 100;

        TBar.prototype.render = function renderTBar() {

            var verticesInPixels = this.getVerticesInPixels();

            if (verticesInPixels.length !== 2) throw new Error('TBar render function requires 2 vertices and ' + verticesInPixels.length + ' given');

            var startPoint = verticesInPixels[0];
            var endPoint = verticesInPixels[1];

            //Calculate the T portion
            var m = 0 - (1 / ((endPoint.y - startPoint.y) / (endPoint.x - startPoint.x)));

            if (isNaN(m)) m = 0;
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
                'stroke-width': this.STROKE_WIDTH,
                'stroke-dasharray': this.dashedArray
            };

            this.primarySVGShape.plot('M ' + startPoint.x + ' ' + startPoint.y + ' L ' + endPoint.x + ' ' + endPoint.y + ' M ' + tPoint1[0] + ' ' + tPoint1[1] + ' L ' + tPoint2[0] + ' ' + tPoint2[1])
                .attr(attributes);
        };

        return TBar;
    }
];
