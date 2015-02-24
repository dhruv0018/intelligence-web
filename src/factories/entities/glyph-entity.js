

/* GlyphEntity - Extends GlyphEntityModel */

module.exports = [
    'BaseEntity',
    function(BaseEntity) {

        var GlyphEntity = function() {

            var self = this;

            /* Extend BaseEntity */

            BaseEntity(self);


            self.getGlyphs = function getGlyphs() {

                return self;

            };

            self.addGlyph = function addGlyph(glyph) {

                if (glyph) self.push(glyph);

            };

            self.popGlyph = function popGlyph() {

                var glyph = self.pop();
                glyph.destroy();

                return glyph;

            };

            self.removeGlyph = function removeGlyph(glyph) {

                var glyphIndex = self.indexOf(glyph);
                if (glyphIndex != -1) self.splice(glyphIndex, 1);

                glyph.destroy();

            };

            self.clearGlyphs = function clearGlyphs() {

                self.forEach(function renderGlyph(glyph) {
                    glyph.destroy();
                });
                self.length = 0;

            };

            self.render = function render() {

                self.forEach(function renderGlyph(glyph) {
                    glyph.render();
                });

            };

            self.hide = function hide() {

                self.forEach(function hideGlyph(glyph) {
                    glyph.hide();
                });

            };

            self.show = function show() {

                self.forEach(function showGlyph(glyph) {
                    glyph.show();
                });

            };

        };

        var extendGlyphEntityModel = function extendGlyphEntityModel(GlyphEntityModel) {

            GlyphEntity.call(GlyphEntityModel);
        };

        return extendGlyphEntityModel;

    }
];

