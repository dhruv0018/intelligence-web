
/* Telestration Interface */

module.exports = [
    'TELESTRATION_TYPES',
    function(TELESTRATION_TYPES) {

        var glyphs = [];

        var getGlyphs = function getGlyphs() {
            return glyphs;
        };

        var addGlyph = function addGlyph(glyph) {
            if (glyph) glyphs.push(glyph);
        };

        var popGlyph = function popGlyph() {
            return glyphs.pop();
        };

        var removeGlyph = function removeGlyph(glyph) {
            var glyphIndex = glyphs.indexOf(glyph);
            if (glyphIndex != -1) glyphs.splice(glyphIndex, 1);
        };

        var clearGlyphs = function clearGlyphs() {
            glyphs.length = 0;
        };

        return {
            selectedGlyphType: TELESTRATION_TYPES.FREEHAND,
            currentZIndex: 1,
            telestrationContainerElement: undefined,
            hideTelestrationControlsMenu: undefined,
            showTelestrationControlsMenu: undefined,
            toggleTelestrationControlsMenu: undefined,
            telestrationSVG: undefined,
            isEditEnabled: false,
            getGlyphs: getGlyphs,
            addGlyph: addGlyph,
            popGlyph: popGlyph,
            removeGlyph: removeGlyph,
            clearGlyphs: clearGlyphs
        };
    }
];
