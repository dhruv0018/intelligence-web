angular.module('GlyphShapes.ShadowCircleShape', []).factory('ShadowCircleFactory', [
    'TelestrationInterface', 'ShadowShapeFactory',
    function(telestrationInterface, ShadowShape) {

        function ShadowCircle() {

            ShadowShape.call(this);

            this.currentShape = telestrationInterface.telestrationSVG.circle().opacity(0);
            this.spotShadow = telestrationInterface.telestrationSVG.circle();
            var theMask = ShadowShape.prototype.addShadow(this.spotShadow);
        }
        angular.inheritPrototype(ShadowCircle, ShadowShape);

        ShadowCircle.prototype.render = function renderShadowCircle(vertices, color, text) {

            var startPoint = vertices[0];
            var endPoint = vertices[1];
            var offsetX = endPoint[0] - startPoint[0];
            var offsetY = endPoint[1] - startPoint[1];
            pointDistance = Math.sqrt(offsetX * offsetX + offsetY * offsetY);

            this.spotShadow.radius(pointDistance / 2)
                .cx((startPoint[0] + endPoint[0]) / 2)
                .cy((startPoint[1] + endPoint[1]) / 2);

            this.currentShape.radius(pointDistance / 2)
                .cx((startPoint[0] + endPoint[0]) / 2)
                .cy((startPoint[1] + endPoint[1]) / 2)
                .attr({
                    fill: color || this.defaultColor,
                    stroke: color || this.defaultColor,
                    'stroke-width': this.BORDER_WIDTH
                });
        };

        ShadowCircle.prototype.destroy = function destroyShadowCircle() {
            ShadowShape.prototype.destroy.call(this);
            this.spotShadow.remove();
        };

        return ShadowCircle;
    }
]);
