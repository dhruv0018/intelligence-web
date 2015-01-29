angular.module('GlyphShapes.ConeShape', []).factory('ConeFactory', [
    'TelestrationInterface', '$location',
    function(telestrationInterface, $location) {
        function Cone() {

            var self = this;

            self.currentShape = telestrationInterface.telestrationSVG.path().opacity(0);
            self.spotShadow = telestrationInterface.telestrationSVG.path();
            var theMask = telestrationInterface.telestrationSVGMask.add(self.spotShadow);
            var objWithMask = telestrationInterface.telestrationSVGMaskBlack.maskWith(theMask);
            var shortUrl = objWithMask.attr('mask');
            var longUrl = 'url(' + $location.absUrl() + shortUrl.match(/#\w+/i)[0] + ')';
            objWithMask.attr({'mask': longUrl});

            self.render = function renderCone(vertices, color, text) {

                var startPoint = vertices[0];
                var endPoint = vertices[1];

                //Calculate the opening
                var offsetX = endPoint[0] - startPoint[0];
                var offsetY = endPoint[1] - startPoint[1];
                var m1 = (offsetY / offsetX);
                var m = 0 - (1 / m1);
                var dx1 = 1 / Math.sqrt(m1 * m1 + 1);
                var dy1 = m1 / Math.sqrt(m1 * m1 + 1);
                var dx = 1 / Math.sqrt(m * m + 1);
                var dy = m / Math.sqrt(m * m + 1);
                if (isNaN(dy)) dy = 1;
                if (isNaN(dy1)) dy1 = 1;

                pointDistance = Math.sqrt(offsetX * offsetX + offsetY * offsetY);
                var coneOpeningWidth = pointDistance / 2;

                //2 points (x,y) for the cone structure
                var conePoint1 = [];
                var conePoint2 = [];
                conePoint1[0] = endPoint[0] - (coneOpeningWidth / 2) * dx;
                conePoint1[1] = endPoint[1] - (coneOpeningWidth / 2) * dy;
                conePoint2[0] = endPoint[0] + (coneOpeningWidth / 2) * dx;
                conePoint2[1] = endPoint[1] + (coneOpeningWidth / 2) * dy;

                //3 points for the bezier curve
                var extensionPoint = [];
                var curveReferencePoint1 = [];
                var curveReferencePoint2 = [];

                offsetX = offsetX || Math.sign(offsetY); //fix for offsetX of 0

                if (offsetX > 0) {
                    extensionPoint[0] = endPoint[0] + (coneOpeningWidth / 5) * dx1;
                    extensionPoint[1] = endPoint[1] + (coneOpeningWidth / 5) * dy1;
                } else {
                    extensionPoint[0] = endPoint[0] - (coneOpeningWidth / 5) * dx1;
                    extensionPoint[1] = endPoint[1] - (coneOpeningWidth / 5) * dy1;
                }

                curveReferencePoint1[0] = extensionPoint[0] - (coneOpeningWidth / 4) * dx;
                curveReferencePoint1[1] = extensionPoint[1] - (coneOpeningWidth / 4) * dy;
                curveReferencePoint2[0] = extensionPoint[0] + (coneOpeningWidth / 4) * dx;
                curveReferencePoint2[1] = extensionPoint[1] + (coneOpeningWidth / 4) * dy;

                self.spotShadow.plot('M ' + startPoint[0] + ' ' + startPoint[1] + ' L ' + conePoint1[0] + ' ' + conePoint1[1] + ' C' + curveReferencePoint1[0] + ' ' + curveReferencePoint1[1] + ' ' + curveReferencePoint2[0] + ' ' + curveReferencePoint2[1] + ' ' + conePoint2[0] + ' ' + conePoint2[1] + ' z');

                self.currentShape.plot('M ' + startPoint[0] + ' ' + startPoint[1] + ' L ' + conePoint1[0] + ' ' + conePoint1[1] + ' C' + curveReferencePoint1[0] + ' ' + curveReferencePoint1[1] + ' ' + curveReferencePoint2[0] + ' ' + curveReferencePoint2[1] + ' ' + conePoint2[0] + ' ' + conePoint2[1] + ' z')
                        .attr({
                            fill: color || self.defaultColor,
                            stroke: color || self.defaultColor,
                            'stroke-width': self.BORDER_WIDTH
                        });

                return self;
            };

            Cone.prototype.registerMoveListeners = function coneRegisterMoveListeners() {
                var self = this;

                // call superclass
                self.parent.registerMoveListeners.call(self);

                if (self.currentShape) {
                    var prevDragStart = self.currentShape.dragstart || angular.noop;
                    self.currentShape.dragstart = function coneDragStart() {
                        prevDragStart();
                        self.spotShadow.xStart = self.spotShadow.x();
                        self.spotShadow.yStart = self.spotShadow.y();
                    };

                    var prevDragMove = self.currentShape.dragmove || angular.noop;
                    self.currentShape.dragmove = function coneDragMove(delta, event) {
                        prevDragMove(delta, event);
                        self.spotShadow.x(self.spotShadow.xStart + delta.x);
                        self.spotShadow.y(self.spotShadow.yStart + delta.y);
                    };
                }
            };

            self.destroy = function() {
                self.currentShape.fixed();
                self.parent.destroy.call(self);
                self.spotShadow.remove();
            };
        }

        return Cone;
    }
]);
