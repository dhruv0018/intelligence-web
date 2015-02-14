

/* GlyphEntity - Extends GlyphEntityModel */

var GlyphEntity = function() {

    this.getGlyphs = function getGlyphs() {
        return this.map(function(glyph) { return glyph; });
    };

    this.addGlyph = function addGlyph(glyph) {
        if (glyph) this.push(glyph);
    };

    this.popGlyph = function popGlyph() {
        return this.pop();
    };

    this.removeGlyph = function removeGlyph(glyph) {
        var glyphIndex = this.indexOf(glyph);
        if (glyphIndex != -1) this.splice(glyphIndex, 1);
    };

    this.clearGlyphs = function clearGlyphs() {
        this.length = 0;
    };

};

var extendGlyphEntityModel = function extendGlyphEntityModel(GlyphEntityModel) {

    GlyphEntity.call(GlyphEntityModel);
};

module.exports = extendGlyphEntityModel;
