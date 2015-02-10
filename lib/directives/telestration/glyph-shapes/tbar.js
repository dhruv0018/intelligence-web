angular.module('GlyphShapes.TBarShape', []).factory('TBarFactory', [
    'TelestrationInterface', 'ShapeFactory', 'TELESTRATION_TYPES', 'GlyphShapesConstants',
    function(telestrationInterface, Shape, TELESTRATION_TYPES, glyphShapesConstants) {

        function TBar() {

            Shape.call(this, TELESTRATION_TYPES.T_BAR, telestrationInterface.telestrationSVG.path());

        }
        angular.inheritPrototype(TBar, Shape);

        TBar.prototype.T_BAR_LENGTH = glyphShapesConstants.T_BAR_LENGTH;

        TBar.prototype.render = function renderTBar() {

            var verticesInPixels = this.getVerticesInPixels();
            var startPoint = verticesInPixels[0];
            var endPoint = verticesInPixels[1];

            //Calculate the T portion
            var m = 0 - (1 / ((endPoint.y - startPoint.y) / (endPoint.x - startPoint.x)));
            var dx = 1 / Math.sqrt(m * m + 1);
            var dy = m / Math.sqrt(m * m + 1);
            if (isNaN(dy)) dy = 1;

            //2 points (x,y) for the second line in the T
            var tPoint1 = [];
            var tPoint2 = [];
            tPoint1[0] = endPoint.x - (this.T_BAR_LENGTH / 2) * dx;
            tPoint1[1] = endPoint.y - (this.T_BAR_LENGTH / 2) * dy;
            tPoint2[0] = endPoint.x + (this.T_BAR_LENGTH / 2) * dx;
            tPoint2[1] = endPoint.y + (this.T_BAR_LENGTH / 2) * dy;

            this.currentShape.plot('M ' + startPoint.x + ' ' + startPoint.y + ' L ' + endPoint.x + ' ' + endPoint.y + ' M ' + tPoint1[0] + ' ' + tPoint1[1] + ' L ' + tPoint2[0] + ' ' + tPoint2[1])
                .attr({
                    fill: 'none',
                    stroke: this.color,
                    'stroke-width': this.strokeWidth
                });
        };

        return TBar;
    }
]);
