angular.module('GlyphShapes.CircleShape', []).factory('CircleFactory', [
    'TelestrationInterface', 'ShapeFactory',
    function(telestrationInterface, Shape) {

        function Circle() {

            Shape.call(this);

            this.currentShape = telestrationInterface.telestrationSVG.circle();

        }
        angular.inheritPrototype(Circle, Shape);

        Circle.prototype.render = function renderCircle(vertices, color, text) {

            var startPoint = vertices[0];
            var endPoint = vertices[1];

            var offsetX = endPoint[0] - startPoint[0];
            var offsetY = endPoint[1] - startPoint[1];
            pointDistance = Math.sqrt(offsetX * offsetX + offsetY * offsetY);

            if (offsetY === 0) offsetX = 0; //fix for .radius(offsetX, 0) creating a circle with radius offsetX

            this.currentShape.radius(Math.abs(offsetX) / 2, Math.abs(offsetY) / 2)
                .cx((startPoint[0] + endPoint[0]) / 2)
                .cy((startPoint[1] + endPoint[1]) / 2)
                .attr({
                    fill: 'none',
                    stroke: color || this.defaultColor,
                    'stroke-width': this.BORDER_WIDTH
                });
        };

        return Circle;
    }
]);
