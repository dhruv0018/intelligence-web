
/* Freehand Shape - extends Shape */

module.exports = [
    'TelestrationInterface', 'ShapeFactory', 'TELESTRATION_TYPES',
    function(telestrationInterface, Shape, TELESTRATION_TYPES) {

        function Freehand() {

            Shape.call(this, TELESTRATION_TYPES.FREEHAND, telestrationInterface.telestrationSVG.path());

        }
        angular.inheritPrototype(Freehand, Shape);

        Freehand.prototype.editable = false;
        Freehand.prototype.moveable = false;

        Freehand.prototype.render = function renderFreehand() {

            var verticesInPixels = this.getVerticesInPixels();

            if (verticesInPixels.length !== 1) throw new Error('Freehand render function requires 1 vertices and ' + verticesInPixels.length + ' given');

            var startPoint = verticesInPixels[0];

            var pathData = 'M ' + startPoint.x + ' ' + startPoint.y + ' L';
            for (var i = 1; i < verticesInPixels.length; i++) {
                pathData += ' ' + verticesInPixels[i].x + ' ' + verticesInPixels[i].y;
            }

            this.currentShape.plot(pathData)
                .attr({
                    fill: 'none',
                    stroke: this.color,
                    'stroke-width': this.strokeWidth
                });
        };

        return Freehand;
    }
];
