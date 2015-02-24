// Get window location

var location = window.location;


/* Spotlight - Abstract class extends Glyph */

module.exports = [
    'GlyphValue',
    function(Glyph) {

        var numShadowShapes = 0;
        var initialized = false;

        // Semi-opaque layer
        var telestrationSVGMaskBlack;

        // Mask layer
        var telestrationSVGMask;
        var SVGMaskWhite;


        function Spotlight(type, options, SVGContext, shape, spotlightShape) {

            numShadowShapes++;

            this.SVGContext = SVGContext;

            if (numShadowShapes == 1) addMaskLayers.call(this);

            this.addSpotlight(spotlightShape);
            Glyph.call(this, type, options, SVGContext, shape);

        }
        angular.inheritPrototype(Spotlight, Glyph);

        Spotlight.prototype.telestrationSVGMaskBlack = null;
        Spotlight.prototype.telestrationSVGMask = null;

        Spotlight.prototype.hide = function hideSpotlight(spotlightShape) {

            Glyph.prototype.hide.call(this);
            this.spotlight.hide();
            SVGMaskWhite.hide();
            telestrationSVGMaskBlack.hide();

        };

        Spotlight.prototype.show = function showSpotlight(spotlightShape) {

            Glyph.prototype.show.call(this);
            this.spotlight.show();
            SVGMaskWhite.show();
            telestrationSVGMaskBlack.show();

        };

        Spotlight.prototype.addSpotlight = function ShadowShapeAddShadow(spotlightShape) {
            this.spotlight = spotlightShape;
            var theMask = telestrationSVGMask.add(spotlightShape);
            var objWithMask = telestrationSVGMaskBlack.maskWith(theMask);
            var shortUrl = objWithMask.attr('mask');
            var longUrl = 'url(' + location.href + shortUrl.match(/#\w+/i)[0] + ')';
            objWithMask.attr({'mask': longUrl});
        };

        Spotlight.prototype.registerMoveListeners = function ShadowShapeRegisterMoveListeners() {

            var self = this;

            // call superclass
            Glyph.prototype.registerMoveListeners.call(self);

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

            Glyph.prototype.destroy.call(this);
            removeShape.call(this);
            this.spotlight.remove();
        };


        // PRIVATE METHODS

        function addMaskLayers() {
            // Semi-opaque layer
            telestrationSVGMaskBlack = this.SVGContext.rect('100%', '100%').attr({ fill: '#000' }).opacity(0.4).back();

            // Mask layer
            telestrationSVGMask = this.SVGContext.mask();
            SVGMaskWhite = this.SVGContext.rect('100%', '100%').attr({ fill: '#fff' }).back().forward();
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
