angular.module('GlyphShapes.ShadowShape', []).factory('ShadowShapeFactory', [
    '$location', 'TelestrationInterface', 'ShapeFactory',
    function($location, telestrationInterface, Shape) {

        var numShadowShapes = 0;
        var initialized = false;

        // Semi-opaque layer
        var telestrationSVGMaskBlack;

        // Mask layer
        var telestrationSVGMask;
        var SVGMaskWhite;


        function ShadowShape(shape, shadowShape) {

            numShadowShapes++;

            if (numShadowShapes == 1) addMaskLayers.call(this);

            this.addShadow(shadowShape);
            Shape.call(this, shape);

        }
        angular.inheritPrototype(ShadowShape, Shape);

        ShadowShape.prototype.telestrationSVGMaskBlack = null;
        ShadowShape.prototype.telestrationSVGMask = null;

        ShadowShape.prototype.addShadow = function ShadowShapeAddShadow(shadow) {
            this.spotShadow = shadow;
            var theMask = telestrationSVGMask.add(shadow);
            var objWithMask = telestrationSVGMaskBlack.maskWith(theMask);
            var shortUrl = objWithMask.attr('mask');
            var longUrl = 'url(' + $location.absUrl() + shortUrl.match(/#\w+/i)[0] + ')';
            objWithMask.attr({'mask': longUrl});
        };

        ShadowShape.prototype.registerMoveListeners = function ShadowShapeRegisterMoveListeners() {

            var self = this;

            // call superclass
            Shape.prototype.registerMoveListeners.call(self);

            if (self.currentShape) {
                var prevDragStart = self.currentShape.dragstart || angular.noop;
                self.currentShape.dragstart = function ShadowShapeDragStart() {
                    prevDragStart();
                    self.spotShadow.xStart = self.spotShadow.x();
                    self.spotShadow.yStart = self.spotShadow.y();
                };

                var prevDragMove = self.currentShape.dragmove || angular.noop;
                self.currentShape.dragmove = function ShadowShapeDragMove(delta, event) {
                    prevDragMove(delta, event);
                    self.spotShadow.x(self.spotShadow.xStart + delta.x);
                    self.spotShadow.y(self.spotShadow.yStart + delta.y);
                };
            }
        };

        ShadowShape.prototype.destroy = function destroyShadowShape() {

            Shape.prototype.destroy.call(this);

            removeShape.call(this);
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

        return ShadowShape;
    }
]);
