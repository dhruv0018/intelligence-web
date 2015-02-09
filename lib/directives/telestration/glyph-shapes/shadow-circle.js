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
