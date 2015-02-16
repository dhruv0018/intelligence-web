
/* TelestrationValue Object */

module.exports = [
    'GlyphFactory', 'GlyphEntity',
    function(GlyphFactory, GlyphEntity) {

        function TelestrationValue(time, gameId) {

            if (!time && parseInt(time) !== time) throw new Error('TelestrationValue is missing required \'time\' parameter or time parameter is not an integer.');
            if (!gameId) throw new Error('telestration object requires gameId');

            // Telestration Model
            this.gameId = gameId;
            this.time = time;
            this.glyphs = [];

            // Extend Glyphs with GlyphEntity
            GlyphEntity(this.glyphs);

        }

        TelestrationValue.prototype.addGlyph = function addGlyph(type, SVGContext, color) {

            var newGlyph = GlyphFactory.createGlyph(type, SVGContext, color);

            this.glyphs.addGlyph(newGlyph);

            return newGlyph;

        };

        return TelestrationValue;
    }
];
