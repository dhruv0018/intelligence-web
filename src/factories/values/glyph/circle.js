
/* Circle Glyph - extends Glyph */

module.exports = [
    'GlyphValue',
    function(Glyph) {

        function Circle(type, SVGContext) {

            Glyph.call(this, type, SVGContext, SVGContext.circle());

        }
        angular.inheritPrototype(Circle, Glyph);

        Circle.prototype.render = function renderCircle() {

            var verticesInPixels = this.getVerticesInPixels();

            if (verticesInPixels.length !== 2) throw new Error('Circle render function requires 2 vertices and ' + verticesInPixels.length + ' given');

            var startPoint = verticesInPixels[0];
            var endPoint = verticesInPixels[1];

            var offsetX = endPoint.x - startPoint.x;
            var offsetY = endPoint.y - startPoint.y;
            pointDistance = Math.sqrt(offsetX * offsetX + offsetY * offsetY);

            if (offsetY === 0) offsetX = 0; //fix for .radius(offsetX, 0) creating a circle with radius offsetX

            this.currentShape.radius(Math.abs(offsetX) / 2, Math.abs(offsetY) / 2)
                .cx((startPoint.x + endPoint.x) / 2)
                .cy((startPoint.y + endPoint.y) / 2)
                .attr({
                    fill: 'none',
                    stroke: this.color,
                    'stroke-width': this.strokeWidth
                });
        };

        return Circle;
    }
];
