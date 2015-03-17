
/* Circle SVGGlyph - extends SVGGlyph */

module.exports = [
    'SVGGlyphValue',
    function(SVGGlyph) {

        function Circle(type, options, container, SVGContext) {

            SVGGlyph.call(this, type, options, container, SVGContext, SVGContext.circle());

            if (this.EDITABLE) this.addEditHandlers(); // optional hook
            if (this.MOVEABLE) this.addMoveHandlers(); // optional hook
        }
        angular.inheritPrototype(Circle, SVGGlyph);

        Circle.prototype.render = function renderCircle() {

            var verticesInPixels = this.getVerticesInPixels();

            if (verticesInPixels.length !== 2) throw new Error('Circle render function requires 2 vertices and ' + verticesInPixels.length + ' given');

            var startPoint = verticesInPixels[0];
            var endPoint = verticesInPixels[1];

            var offsetX = endPoint.x - startPoint.x;
            var offsetY = endPoint.y - startPoint.y;
            var pointDistance = Math.sqrt(offsetX * offsetX + offsetY * offsetY);

            if (offsetY === 0) offsetX = 0; //fix for .radius(offsetX, 0) creating a circle with radius offsetX

            this.primarySVGShape.radius(Math.abs(offsetX) / 2, Math.abs(offsetY) / 2)
                .cx((startPoint.x + endPoint.x) / 2)
                .cy((startPoint.y + endPoint.y) / 2)
                .attr({
                    fill: 'none',
                    stroke: this.color,
                    'stroke-width': this.STROKE_WIDTH
                });
        };

        return Circle;
    }
];
