angular.module('GlyphShapes.FreehandShape', []).factory('FreehandFactory', [
    'TelestrationInterface', 'ShapeFactory',
    function(telestrationInterface, Shape) {

        function Freehand() {

            Shape.call(this);

            this.editable = false;
            this.moveable = false;
            this.currentShape = telestrationInterface.telestrationSVG.path();
        }
        angular.inheritPrototype(Freehand, Shape);

        Freehand.prototype.render = function renderFreehand(vertices, color, text) {

            var pathData = 'M ' + vertices[0][0] + ' ' + vertices[0][1] + ' L';
            for (var i = 1; i < vertices.length; i++) {
                pathData += ' ' + vertices[i][0] + ' ' + vertices[i][1];
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
