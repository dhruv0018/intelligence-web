
/* ExtendTelestrationValue Object */

module.exports = [
    'GlyphFactory', 'GlyphEntity',
    function(GlyphFactory, GlyphEntity) {

        function ExtendTelestrationValue() {

            this.addGlyph = function addGlyph(type, SVGContext, color) {

                var newGlyph = GlyphFactory.createGlyph(type, SVGContext, color);

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

                    if (self[key].unextend) copy[key] = self[key].unextend();
                    else copy[key] = angular.copy(self[key]);

                });

                return copy;

            };

            // Extend Existing Glyphs
            GlyphEntity(this.glyphs);

        }

        var extendTelestrationValue = function extendTelestrationValue(telestrationValue) {

            ExtendTelestrationValue.call(telestrationValue);
        };

        return extendTelestrationValue;

    }
];
