
/* Circle Spotlight - extends Spotlight */

module.exports = [
    'SpotlightValue',
    function(Spotlight) {

        function CircleSpotlight(type, options, containerElement, SVGContext) {

            Spotlight.call(this, type, options, containerElement, SVGContext, SVGContext.circle(), SVGContext.circle());

            this.primarySVGShape.opacity(0);

            this.addMoveHandlers();
        }
        angular.inheritPrototype(CircleSpotlight, Spotlight);

        CircleSpotlight.prototype.RESIZABLE = true;

        CircleSpotlight.prototype.renderShape = function renderShape() {

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
                .cy((startPoint.y + endPoint.y) / 2);
        };

        CircleSpotlight.prototype.renderAttributes = function renderAttributes() {

            this.primarySVGShape.opacity(0);
        };

        CircleSpotlight.prototype.render = function renderShadowCircle() {

            this.renderShape();
            this.renderAttributes();
        };

        return CircleSpotlight;
    }
];
