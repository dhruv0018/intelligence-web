
/* Circle Spotlight - extends Spotlight */

module.exports = [
    'SpotlightValue',
    function(Spotlight) {

        function CircleSpotlight(type, options, SVGContext) {

            Spotlight.call(this, type, options, SVGContext, SVGContext.circle(), SVGContext.circle());

            this.currentShape.opacity(0);

        }
        angular.inheritPrototype(CircleSpotlight, Spotlight);

        CircleSpotlight.prototype.render = function renderShadowCircle() {

            var verticesInPixels = this.getVerticesInPixels();
            var startPoint = verticesInPixels[0];
            var endPoint = verticesInPixels[1];

            var offsetX = endPoint.x - startPoint.x;
            var offsetY = endPoint.y - startPoint.y;
            pointDistance = Math.sqrt(offsetX * offsetX + offsetY * offsetY);

            this.spotlight.radius(pointDistance / 2)
                .cx((startPoint.x + endPoint.x) / 2)
                .cy((startPoint.y + endPoint.y) / 2);

            this.currentShape.radius(pointDistance / 2)
                .cx((startPoint.x + endPoint.x) / 2)
                .cy((startPoint.y + endPoint.y) / 2)
                .attr({
                    fill: this.color,
                    stroke: this.color,
                    'stroke-width': this.strokeWidth
                });

            this.show();
        };

        return CircleSpotlight;
    }
];
