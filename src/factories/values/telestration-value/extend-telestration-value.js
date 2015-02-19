
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

            this.unextend = function unextendTelestrationValue() {

                var self = this;

                var modelAttributes = ['playId', 'reelId', 'gameId', 'time', 'glyphs'];

                /* Remove properties not in the model */

                for (var attr in self) {

                    var isMember = (modelAttributes.indexOf(attr) == -1) ? false : true;

                    if (!isMember) delete self[attr];

                }

                /* Unextend everything else */

                this.glyphs.unextend();

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
