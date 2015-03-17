
/* Spotlight - Abstract class extends SVGGlyph */

module.exports = [
    'SVGGlyphValue',
    function(SVGGlyph) {

        var visibleSpotlightShapes = [];
        var initialized = false;

        // Semi-opaque layer
        var blackBackdropLayer;

        // Mask layer
        var maskLayer;

        var BLACK_BACKDROP_OPACITY = 0.4;

        function Spotlight(type, options, containerElement, SVGContext, shape, spotlightShape) {

            this.SVGContext = SVGContext;
            this.spotlight = spotlightShape;

            if (!blackBackdropLayer) addBlackMask.call(this);
            if (!maskLayer) addMask.call(this);

            SVGGlyph.call(this, type, options, containerElement, SVGContext, shape);

            this.show();
        }
        angular.inheritPrototype(Spotlight, SVGGlyph);

        Spotlight.prototype.hide = function hideSpotlight() {

            SVGGlyph.prototype.hide.call(this);
            this.spotlight.hide();

            var index = visibleSpotlightShapes.indexOf(this.spotlight);
            // If found in visibleSpotlightShapes, remove it
            if (index !== -1) visibleSpotlightShapes.splice(index, 1);

            if (!visibleSpotlightShapes.length) {

                hideMaskLayers();
            }
        };

        Spotlight.prototype.show = function showSpotlight() {

            SVGGlyph.prototype.show.call(this);
            this.spotlight.show();

            var index = visibleSpotlightShapes.indexOf(this.spotlight);

            // If not in visibleSpotlightShapes yet, add it
            if (index === -1) {

                visibleSpotlightShapes.push(this.spotlight);
                var theMask = maskLayer.add(this.spotlight);
                var objWithMask = blackBackdropLayer.maskWith(theMask);
                var shortUrl = objWithMask.attr('mask');
                var longUrl = 'url(' + window.location.href + shortUrl.match(/#\w+/i)[0] + ')';
                objWithMask.attr({'mask': longUrl});
            }

            if (visibleSpotlightShapes.length) {

                showMaskLayers();
            }
        };

        Spotlight.prototype.addMoveHandlers = function SpotlightShapeaddMoveHandlers() {

            var self = this;

            // call superclass
            SVGGlyph.prototype.addMoveHandlers.call(self);

            if (self.primarySVGShape) {

                var prevDragStart = self.primarySVGShape.dragstart || angular.noop;
                self.primarySVGShape.dragstart = function SpotlightShapeDragStart() {

                    prevDragStart();
                    self.spotlight.xStart = self.spotlight.x();
                    self.spotlight.yStart = self.spotlight.y();
                };

                var prevDragMove = self.primarySVGShape.dragmove || angular.noop;
                self.primarySVGShape.dragmove = function SpotlightShapeDragMove(delta, event) {

                    prevDragMove(delta, event);
                    self.spotlight.x(self.spotlight.xStart + delta.x);
                    self.spotlight.y(self.spotlight.yStart + delta.y);
                };

                var prevDragEnd = self.primarySVGShape.dragend || angular.noop;
                self.primarySVGShape.dragend = function SpotlightShapeDragEnd(delta, event) {

                    prevDragEnd(delta, event);
                    self.render();
                };
            }
        };

        Spotlight.prototype.destroy = function destroySpotlightShape() {

            SVGGlyph.prototype.destroy.call(this);
            removeShape.call(this);
            this.spotlight.remove();
        };

        Spotlight.prototype.decommission = function decommissionSpotlight() {

            SVGGlyph.prototype.decommission.call(this);

            removeShape.call(this);
        };

        // PRIVATE METHODS

        function addBlackMask() {

            // Semi-opaque layer
            blackBackdropLayer = this.SVGContext.rect('100%', '100%').attr({ fill: '#000' }).opacity(BLACK_BACKDROP_OPACITY).back();
        }

        function addMask() {

            // Mask layer
            maskLayer = this.SVGContext.mask();
            var SVGMaskWhite = this.SVGContext.rect('100%', '100%').attr({ fill: '#fff' }).back().forward();
            maskLayer.add(SVGMaskWhite);
        }

        function removeMaskLayers() {

            if (blackBackdropLayer) {

                blackBackdropLayer.remove();
                blackBackdropLayer = null;
            }

            if (maskLayer) {

                maskLayer.remove();
                maskLayer = null;
            }
        }

        function showMaskLayers() {

            if (blackBackdropLayer) blackBackdropLayer.show();
            if (maskLayer) maskLayer.show();
        }

        function hideMaskLayers() {

            if (blackBackdropLayer) {

                blackBackdropLayer.unmask();
                blackBackdropLayer.hide();
            }

            if (maskLayer) {

                maskLayer.unmask();
                maskLayer.hide();
            }
        }

        function removeShape() {

            var index = visibleSpotlightShapes.indexOf(this.spotlight);
            // If found in visibleSpotlightShapes, remove it
            if (index !== -1) visibleSpotlightShapes.splice(index, 1);

            if (!visibleSpotlightShapes.length) {

                removeMaskLayers();
            }
        }

        return Spotlight;
    }
];
