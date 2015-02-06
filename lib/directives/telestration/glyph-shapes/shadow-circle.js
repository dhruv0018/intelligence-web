angular.module('GlyphShapes.ShadowCircleShape', []).factory('ShadowCircleFactory', [
    'TelestrationInterface', '$location', 'ShapeFactory',
    function(telestrationInterface, $location, Shape) {

        function ShadowCircle() {

            Shape.call(this);

            this.currentShape = telestrationInterface.telestrationSVG.circle().opacity(0);
            this.spotShadow = telestrationInterface.telestrationSVG.circle();
            var theMask = telestrationInterface.telestrationSVGMask.add(this.spotShadow);
            var objWithMask = telestrationInterface.telestrationSVGMaskBlack.maskWith(theMask);
            var shortUrl = objWithMask.attr('mask');
            var longUrl = 'url(' + $location.absUrl() + shortUrl.match(/#\w+/i)[0] + ')';
            objWithMask.attr({'mask': longUrl});

        }
        angular.inheritPrototype(ShadowCircle, Shape);

        ShadowCircle.prototype.render = function renderShadowCircle(vertices, color, text) {

            var startPoint = vertices[0];
            var endPoint = vertices[1];
            var offsetX = endPoint[0] - startPoint[0];
            var offsetY = endPoint[1] - startPoint[1];
            pointDistance = Math.sqrt(offsetX * offsetX + offsetY * offsetY);

            this.spotShadow.radius(pointDistance / 2)
                .cx((startPoint[0] + endPoint[0]) / 2)
                .cy((startPoint[1] + endPoint[1]) / 2);

            this.currentShape.radius(pointDistance / 2)
                .cx((startPoint[0] + endPoint[0]) / 2)
                .cy((startPoint[1] + endPoint[1]) / 2)
                .attr({
                    fill: color || this.defaultColor,
                    stroke: color || this.defaultColor,
                    'stroke-width': this.BORDER_WIDTH
                });
        };

        ShadowCircle.prototype.registerMoveListeners = function ShadowCircleRegisterMoveListeners() {
            var self = this;

            // call superclass
            Shape.prototype.registerMoveListeners.call(self);

            if (self.currentShape) {
                var prevDragStart = self.currentShape.dragstart || angular.noop;
                self.currentShape.dragstart = function shadowCircleDragStart() {
                    prevDragStart();
                    self.spotShadow.xStart = self.spotShadow.x();
                    self.spotShadow.yStart = self.spotShadow.y();
                };

                var prevDragMove = self.currentShape.dragmove || angular.noop;
                self.currentShape.dragmove = function shadowCircleDragMove(delta, event) {
                    prevDragMove(delta, event);
                    self.spotShadow.x(self.spotShadow.xStart + delta.x);
                    self.spotShadow.y(self.spotShadow.yStart + delta.y);
                };
            }
        };

        ShadowCircle.prototype.destroy = function destroyShadowCircle() {
            Shape.prototype.destroy.call(this);
            this.spotShadow.remove();
        };

        return ShadowCircle;
    }
]);
