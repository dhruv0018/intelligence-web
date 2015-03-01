module.exports = [
    '$scope', '$element',
    function($scope, $element) {

        var self = this;
        var telestrationsController = $element.inheritedData('$telestrationsController');

        // Assignments

        self.enabled = false;
        self.areGlyphsPresent = areGlyphsPresent;
        self.toggleControls = toggleControls;


        function areGlyphsPresent() {

            var currentTelestration = telestrationsController.currentTelestration;

            if (currentTelestration && currentTelestration.hasGlyphs()) {

                return true;
            }
        }

        function toggleControls() {

            self.enabled = !self.enabled;
        }
    }
];

// scope.getGlyphs = function() {
//     return (telestrationsController.currentTelestration) ? telestrationsController.currentTelestration.glyphs : [];
// };
// scope.undoGlyph = function() {
//     telestrationsController.currentTelestration.glyphs.popGlyph();

//     if (!telestrationsController.currentTelestration.glyphs.length) telestrationsController.$save(telestrationsController.$updated);
//     else telestrationsController.$save();
// };

// Clear functionality
// scope.getGlyphs = function() {
//     return (telestrationsController.currentTelestration) ? telestrationsController.currentTelestration.glyphs : [];
// };
// scope.clearGlyphs = function() {
//     telestrationsController.currentTelestration.glyphs.clearGlyphs();
//     telestrationsController.$save(telestrationsController.$updated);
// };
