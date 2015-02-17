
/* ExtendTelestrationValue Object */

module.exports = [
    'GlyphFactory', 'GlyphEntity',
    function(GlyphFactory, GlyphEntity) {

        function ExtendTelestrationValue() {

            this.addGlyph = function addGlyph(type, SVGContext, color) {

                var newGlyph = GlyphFactory.createGlyph(type, SVGContext, color);

                this.glyphs.addGlyph(newGlyph);

                return newGlyph;

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
