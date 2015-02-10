angular.module('GlyphShapes.ShadowCircleShape', []).factory('ShadowCircleFactory', [
    'TelestrationInterface', 'ShadowShapeFactory', 'TELESTRATION_TYPES',
    function(telestrationInterface, ShadowShape, TELESTRATION_TYPES) {

        function ShadowCircle() {

            ShadowShape.call(this, TELESTRATION_TYPES.SHADOW_CIRCLE, telestrationInterface.telestrationSVG.circle(), telestrationInterface.telestrationSVG.circle());

            this.currentShape.opacity(0);

        }
        angular.inheritPrototype(ShadowCircle, ShadowShape);

        ShadowCircle.prototype.render = function renderShadowCircle() {

            var verticesInPixels = this.getVerticesInPixels();
            var startPoint = verticesInPixels[0];
            var endPoint = verticesInPixels[1];

            var offsetX = endPoint.x - startPoint.x;
            var offsetY = endPoint.y - startPoint.y;
            pointDistance = Math.sqrt(offsetX * offsetX + offsetY * offsetY);

            this.spotShadow.radius(pointDistance / 2)
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
        };

        return ShadowCircle;
    }
]);
