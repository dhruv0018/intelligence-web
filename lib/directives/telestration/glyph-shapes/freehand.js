angular.module('GlyphShapes.FreehandShape', []).factory('FreehandFactory', [
    'TelestrationInterface',
    function(telestrationInterface) {
        function Freehand() {

            var self = this;

            self.editable = false;
            self.moveable = false;

            self.currentShape = telestrationInterface.telestrationSVG.path();

            self.render = function renderFreehand(vertices, color, text) {
                var pathData = 'M ' + vertices[0][0] + ' ' + vertices[0][1] + ' L';
                for (var i = 1; i < vertices.length; i++) {
                    pathData += ' ' + vertices[i][0] + ' ' + vertices[i][1];
                }

                self.currentShape.plot(pathData)
                        .attr({
                            fill: 'none',
                            stroke: color || self.defaultColor,
                            'stroke-width': self.BORDER_WIDTH
                        });

                return self;
            };
        }

        return Freehand;
    }
]);
