
/* Circle Spotlight - extends Spotlight */

module.exports = [
    'SpotlightValue',
    function(Spotlight) {

        function CircleSpotlight(type, options, containerElement, SVGContext) {

            Spotlight.call(this, type, options, containerElement, SVGContext, SVGContext.circle(), SVGContext.circle());

            this.primarySVGShape.opacity(0);

            if (this.EDITABLE) this.addEditHandlers(); // optional hook
            if (this.MOVEABLE) this.addMoveHandlers(); // optional hook
        }
        angular.inheritPrototype(CircleSpotlight, Spotlight);

        CircleSpotlight.prototype.render = function renderShadowCircle() {

            var verticesInPixels = this.getVerticesInPixels();
            var startPoint = verticesInPixels[0];
            var endPoint = verticesInPixels[1];

            var offsetX = endPoint.x - startPoint.x;
            var offsetY = endPoint.y - startPoint.y;
            var pointDistance = Math.sqrt(offsetX * offsetX + offsetY * offsetY);

            this.spotlight.radius(pointDistance / 2)
                .cx((startPoint.x + endPoint.x) / 2)
                .cy((startPoint.y + endPoint.y) / 2);

            this.primarySVGShape.radius(pointDistance / 2)
                .cx((startPoint.x + endPoint.x) / 2)
                .cy((startPoint.y + endPoint.y) / 2)
                .attr({
                    fill: this.color,
                    stroke: this.color,
                    'stroke-width': this.STROKE_WIDTH
                });
        };

        return CircleSpotlight;
    }
];
