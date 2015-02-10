angular.module('GlyphShapes.FreehandShape', []).factory('FreehandFactory', [
    'TelestrationInterface', 'ShapeFactory',
    function(telestrationInterface, Shape) {

        function Freehand() {

            Shape.call(this, telestrationInterface.telestrationSVG.path());

        }
        angular.inheritPrototype(Freehand, Shape);

        Freehand.prototype.editable = false;
        Freehand.prototype.moveable = false;

        Freehand.prototype.render = function renderFreehand(vertices, color, text) {

            var pathData = 'M ' + vertices[0].x + ' ' + vertices[0].y + ' L';
            for (var i = 1; i < vertices.length; i++) {
                pathData += ' ' + vertices[i].x + ' ' + vertices[i].y;
            }

            this.currentShape.plot(pathData)
                .attr({
                    fill: 'none',
                    stroke: color || this.defaultColor,
                    'stroke-width': this.BORDER_WIDTH
                });
        };

        return Freehand;
    }
]);
