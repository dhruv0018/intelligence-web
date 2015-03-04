
/* Spotlight - Abstract class extends Glyph */

module.exports = [
    'GlyphValue',
    function(Glyph) {

        var numSpotlights = 0;
        var visibleSpotlightShapes = [];
        var initialized = false;

        // Semi-opaque layer
        var telestrationSVGMaskBlack;

        // Mask layer
        var telestrationSVGMask;
        var SVGMaskWhite;


        function Spotlight(type, options, SVGContext, shape, spotlightShape) {

            this.SVGContext = SVGContext;

            numSpotlights++;
            if (numSpotlights === 1) addMaskLayers.call(this);

            this.addSpotlight(spotlightShape);
            Glyph.call(this, type, options, SVGContext, shape);

            this.show();
        }
        angular.inheritPrototype(Spotlight, Glyph);

        Spotlight.prototype.telestrationSVGMaskBlack = null;
        Spotlight.prototype.telestrationSVGMask = null;

        Spotlight.prototype.hide = function hideSpotlight() {

            Glyph.prototype.hide.call(this);
            this.spotlight.hide();
            visibleSpotlightShapes.pop();

            if (!visibleSpotlightShapes.length) {
                SVGMaskWhite.hide();
                telestrationSVGMaskBlack.hide();
            }
        };

        Spotlight.prototype.show = function showSpotlight() {

            Glyph.prototype.show.call(this);
            this.spotlight.show();
            visibleSpotlightShapes.push(this.spotlight);

            if (visibleSpotlightShapes.length) {
                SVGMaskWhite.show();
                telestrationSVGMaskBlack.show();
            }
        };

        Spotlight.prototype.addSpotlight = function ShadowShapeAddShadow(spotlightShape) {

            this.spotlight = spotlightShape;

            var theMask = telestrationSVGMask.add(spotlightShape);
            var objWithMask = telestrationSVGMaskBlack.maskWith(theMask);
            var shortUrl = objWithMask.attr('mask');
            var longUrl = 'url(' + window.location.href + shortUrl.match(/#\w+/i)[0] + ')';
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

            var index = visibleSpotlightShapes.indexOf(this.spotlight);
            visibleSpotlightShapes.splice(index, 1);

            if (!visibleSpotlightShapes.length) {
                SVGMaskWhite.hide();
                telestrationSVGMaskBlack.hide();
            }

            if (numSpotlights === 0) removeMaskLayers.call(this);
        }

        return Spotlight;
    }
];
