
/* ExtendTelestrationValue Object */

module.exports = [
    'GlyphFactory', 'GlyphEntity',
    function(GlyphFactory, glyphEntity) {

        function ExtendTelestrationValue() {

            this.addGlyph = function addGlyph(type, containerElement, SVGContext, color) {

                var newGlyph = GlyphFactory.createGlyph(type, containerElement, SVGContext, color);

                if (!newGlyph) return null;

                this.glyphs.addGlyph(newGlyph);

                return newGlyph;

            };

            this.hasGlyphs = function hasGlyphs() {
                return (this.glyphs) ? this.glyphs.length : false;
            };

            this.unextend = function unextendTelestrationValue() {

                var self = this;

                var copy = {};

                // TODO: Call Super()
                Object.keys(self).forEach(function assignCopies(key) {

                    if (self[key] && self[key].unextend) copy[key] = self[key].unextend();
                    else if (self[key] && typeof self[key] !== 'function') copy[key] = angular.copy(self[key]);
                });

                return copy;

            };

            // Extend Existing Glyphs
            if (this.glyphs) glyphEntity(this.glyphs);

        }

        var extendTelestrationValue = function extendTelestrationValue(telestrationValue) {

            ExtendTelestrationValue.call(telestrationValue);
        };

        return extendTelestrationValue;

    }
];
