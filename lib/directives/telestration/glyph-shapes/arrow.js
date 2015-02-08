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
            var m1 = ((endPoint[1] - startPoint[1]) / (endPoint[0] - startPoint[0]));
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
            if (endPoint[0] - startPoint[0] >= 0) {
                arrowTip[0] = endPoint[0] + self.ARROW_HEIGHT * dx1;
                arrowTip[1] = endPoint[1] + self.ARROW_HEIGHT * dy1;
            } else {
                arrowTip[0] = endPoint[0] - self.ARROW_HEIGHT * dx1;
                arrowTip[1] = endPoint[1] - self.ARROW_HEIGHT * dy1;
            }
            arrowBase1[0] = endPoint[0] - (self.ARROW_SIDE_LENGTH / 2) * dx;
            arrowBase1[1] = endPoint[1] - (self.ARROW_SIDE_LENGTH / 2) * dy;
            arrowBase2[0] = endPoint[0] + (self.ARROW_SIDE_LENGTH / 2) * dx;
            arrowBase2[1] = endPoint[1] + (self.ARROW_SIDE_LENGTH / 2) * dy;

            self.currentShape.plot('M ' + startPoint[0] + ' ' + startPoint[1] + ' L ' + endPoint[0] + ' ' + endPoint[1] + ' M ' + arrowBase1[0] + ' ' + arrowBase1[1] + ' L ' + arrowTip[0] + ' ' + arrowTip[1] + ' ' + arrowBase2[0] + ' ' + arrowBase2[1] + ' z')
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
