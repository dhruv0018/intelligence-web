angular.module('GlyphShapes.ArrowShape', []).factory('ArrowFactory', [
    'TelestrationInterface', 'ShapeFactory',
    function(telestrationInterface, Shape) {


        function Arrow() {

            Shape.call(this);

            this.currentShape = telestrationInterface.telestrationSVG.path();
        }
        angular.inheritPrototype(Arrow, Shape);

        Arrow.prototype.render = function renderArrow(vertices, color, text) {

            var self = this;

            var startPoint = vertices[0];
            var endPoint = vertices[1];

            //Calculate the arrowhead
            var m1 = ((endPoint.y - startPoint.y) / (endPoint.x - startPoint.x));
            var m = 0 - (1 / m1);
            var dx1 = 1 / Math.sqrt(m1 * m1 + 1);
            var dy1 = m1 / Math.sqrt(m1 * m1 + 1);
            var dx = 1 / Math.sqrt(m * m + 1);
            var dy = m / Math.sqrt(m * m + 1);
            if (isNaN(dy)) dy = 1;
            if (isNaN(dy1)) dy1 = 1;

            //3 points (x,y) for the arrowhead
            var arrowTip = [];
            var arrowBase1 = [];
            var arrowBase2 = [];
            if (endPoint.x - startPoint.x >= 0) {
                arrowTip[0] = endPoint.x + self.ARROW_HEIGHT * dx1;
                arrowTip[1] = endPoint.y + self.ARROW_HEIGHT * dy1;
            } else {
                arrowTip[0] = endPoint.x - self.ARROW_HEIGHT * dx1;
                arrowTip[1] = endPoint.y - self.ARROW_HEIGHT * dy1;
            }
            arrowBase1[0] = endPoint.x - (self.ARROW_SIDE_LENGTH / 2) * dx;
            arrowBase1[1] = endPoint.y - (self.ARROW_SIDE_LENGTH / 2) * dy;
            arrowBase2[0] = endPoint.x + (self.ARROW_SIDE_LENGTH / 2) * dx;
            arrowBase2[1] = endPoint.y + (self.ARROW_SIDE_LENGTH / 2) * dy;

            self.currentShape.plot('M ' + startPoint.x + ' ' + startPoint.y + ' L ' + endPoint.x + ' ' + endPoint.y + ' M ' + arrowBase1[0] + ' ' + arrowBase1[1] + ' L ' + arrowTip[0] + ' ' + arrowTip[1] + ' ' + arrowBase2[0] + ' ' + arrowBase2[1] + ' z')
                    .attr({
                        fill: color || self.defaultColor,
                        stroke: color || self.defaultColor,
                        'stroke-width': self.BORDER_WIDTH
                    });
            return self.currentShape;
        };

        return Arrow;
    }
]);
