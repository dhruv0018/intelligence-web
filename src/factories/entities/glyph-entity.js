

/* GlyphEntity - Extends GlyphEntityModel */

module.exports = [
    'ArrayEntity',
    function(ArrayEntity) {

        var GlyphEntity = function() {

            var self = this;

            /* Extend ArrayEntity */

            ArrayEntity(self);


            self.getGlyphs = function getGlyphs() {

                return self;

            };

            self.addGlyph = function addGlyph(glyph) {

                if (glyph) self.push(glyph);

            };

            self.removeLast = function removeLast() {

                // TODO: Use super and inherit properly here.
                // var lastGlyph = ArrayEntity.prototype.removeLast.call();

                var lastGlyph = self.pop();

                lastGlyph.destroy();

                return lastGlyph;

            };

            self.remove = function remove(glyph) {

                // TODO: Use super and inherit properly here.
                // ArrayEntity.prototype.remove.call(glyph);

                var index = this.indexOf(glyph);
                if (index != -1) this.splice(index, 1);

                glyph.destroy();

            };

            self.removeListeners = function removeListeners() {

                self.forEach(function removeGlyphListeners(glyph) {
                    glyph.removeListeners();
                });

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

