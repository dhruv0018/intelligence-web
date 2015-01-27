angular.module('GlyphShapes.TBarShape', []).factory('TBarFactory', [
    'TelestrationInterface',
    function(telestrationInterface) {
        function TBar() {

            var self = this;

            self.currentShape = telestrationInterface.telestrationSVG.path();

            self.render = function renderTBar(vertices, color, text) {

                var startPoint = vertices[0];
                var endPoint = vertices[1];

                //Calculate the T portion
                var m = 0 - (1 / ((endPoint[1] - startPoint[1]) / (endPoint[0] - startPoint[0])));
                var dx = 1 / Math.sqrt(m * m + 1);
                var dy = m / Math.sqrt(m * m + 1);
                if (isNaN(dy)) dy = 1;

                //2 points (x,y) for the second line in the T
                var tPoint1 = [];
                var tPoint2 = [];
                tPoint1[0] = endPoint[0] - (self.T_BAR_LENGTH / 2) * dx;
                tPoint1[1] = endPoint[1] - (self.T_BAR_LENGTH / 2) * dy;
                tPoint2[0] = endPoint[0] + (self.T_BAR_LENGTH / 2) * dx;
                tPoint2[1] = endPoint[1] + (self.T_BAR_LENGTH / 2) * dy;

                self.currentShape.plot('M ' + startPoint[0] + ' ' + startPoint[1] + ' L ' + endPoint[0] + ' ' + endPoint[1] + ' M ' + tPoint1[0] + ' ' + tPoint1[1] + ' L ' + tPoint2[0] + ' ' + tPoint2[1])
                        .attr({
                            fill: 'none',
                            stroke: color || self.defaultColor,
                            'stroke-width': self.BORDER_WIDTH
                        });

                return self;
            };
        }

        return TBar;
    }
]);
