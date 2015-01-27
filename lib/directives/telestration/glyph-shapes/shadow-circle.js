angular.module('GlyphShapes.ShadowCircleShape', []).factory('ShadowCircleFactory', [
    'TelestrationInterface', '$location',
    function(telestrationInterface, $location) {
        function ShadowCircle() {

            var self = this;

            self.currentShape = telestrationInterface.telestrationSVG.circle().opacity(0);
            self.spotShadow = telestrationInterface.telestrationSVG.circle();
            var theMask = telestrationInterface.telestrationSVGMask.add(self.spotShadow);
            var objWithMask = telestrationInterface.telestrationSVGMaskBlack.maskWith(theMask);
            var shortUrl = objWithMask.attr('mask');
            var longUrl = 'url(' + $location.absUrl() + shortUrl.match(/#\w+/i)[0] + ')';
            objWithMask.attr({'mask': longUrl});

            self.editable = false;

            self.render = function renderShadowCircle(vertices, color, text) {

                var startPoint = vertices[0];
                var endPoint = vertices[1];
                var offsetX = endPoint[0] - startPoint[0];
                var offsetY = endPoint[1] - startPoint[1];
                pointDistance = Math.sqrt(offsetX * offsetX + offsetY * offsetY);

                self.spotShadow.radius(pointDistance / 2)
                        .cx((startPoint[0] + endPoint[0]) / 2)
                        .cy((startPoint[1] + endPoint[1]) / 2);

                self.currentShape.radius(pointDistance / 2)
                        .cx((startPoint[0] + endPoint[0]) / 2)
                        .cy((startPoint[1] + endPoint[1]) / 2)
                        .attr({
                            fill: color || self.defaultColor,
                            stroke: color || self.defaultColor,
                            'stroke-width': self.BORDER_WIDTH
                        });

                return self;
            };
        }

        return ShadowCircle;
    }
]);
