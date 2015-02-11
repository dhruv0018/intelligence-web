
/* Spotlight - Abstract class extends Shape */

module.exports = [
    '$location', 'TelestrationInterface', 'ShapeFactory',
    function($location, telestrationInterface, Shape) {

        var numShadowShapes = 0;
        var initialized = false;

        // Semi-opaque layer
        var telestrationSVGMaskBlack;

        // Mask layer
        var telestrationSVGMask;
        var SVGMaskWhite;


        function Spotlight(type, shape, spotlightShape) {

            numShadowShapes++;

            if (numShadowShapes == 1) addMaskLayers.call(this);

            this.addSpotlight(spotlightShape);
            Shape.call(this, type, shape);

        }
        angular.inheritPrototype(Spotlight, Shape);

        Spotlight.prototype.telestrationSVGMaskBlack = null;
        Spotlight.prototype.telestrationSVGMask = null;

        Spotlight.prototype.addSpotlight = function ShadowShapeAddShadow(spotlightShape) {
            this.spotlight = spotlightShape;
            var theMask = telestrationSVGMask.add(spotlightShape);
            var objWithMask = telestrationSVGMaskBlack.maskWith(theMask);
            var shortUrl = objWithMask.attr('mask');
            var longUrl = 'url(' + $location.absUrl() + shortUrl.match(/#\w+/i)[0] + ')';
            objWithMask.attr({'mask': longUrl});
        };

        Spotlight.prototype.registerMoveListeners = function ShadowShapeRegisterMoveListeners() {

            var self = this;

            // call superclass
            Shape.prototype.registerMoveListeners.call(self);

            if (self.currentShape) {
                var prevDragStart = self.currentShape.dragstart || angular.noop;
                self.currentShape.dragstart = function ShadowShapeDragStart() {
                    prevDragStart();
                    self.spotlight.xStart = self.spotlight.x();
                    self.spotlight.yStart = self.spotlight.y();
                };

                var prevDragMove = self.currentShape.dragmove || angular.noop;
                self.currentShape.dragmove = function ShadowShapeDragMove(delta, event) {
                    prevDragMove(delta, event);
                    self.spotlight.x(self.spotlight.xStart + delta.x);
                    self.spotlight.y(self.spotlight.yStart + delta.y);
                };
            }
        };

        Spotlight.prototype.destroy = function destroyShadowShape() {

            Shape.prototype.destroy.call(this);
            removeShape.call(this);
            this.spotlight.remove();
        };


        // PRIVATE METHODS

        function addMaskLayers() {
            // Semi-opaque layer
            telestrationSVGMaskBlack = telestrationInterface.telestrationSVG.rect('100%', '100%').attr({ fill: '#000' }).opacity(0.4).back();

            // Mask layer
            telestrationSVGMask = telestrationInterface.telestrationSVG.mask();
            SVGMaskWhite = telestrationInterface.telestrationSVG.rect('100%', '100%').attr({ fill: '#fff' }).back().forward();
            telestrationSVGMask.add(SVGMaskWhite);
        }

        function removeMaskLayers() {
            telestrationSVGMaskBlack.remove();
            SVGMaskWhite.remove();
        }

        function removeShape() {
            numShadowShapes--;

            if (numShadowShapes == 0) removeMaskLayers.call(this);
        }

        return Spotlight;
    }
];
