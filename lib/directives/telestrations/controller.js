
/* Telestrations Controller */
module.exports = [
    '$scope', '$element', 'TELESTRATION_TYPES', 'TELESTRATION_COLORS',
    function($scope, $element, TELESTRATION_TYPES, TELESTRATION_COLORS) {

        var self = this;

        /* Defaults */
        self.game = null;
        self.currentTelestration = null;
        self.selectedGlyph = null;
        self.isDrawing = false;
        self.selectedGlyphType = TELESTRATION_TYPES.ARROW_SOLID;
        self.selectedGlyphColor = TELESTRATION_COLORS.PRIMARY.hex;
        self.currentZIndex = 1;
        self.telestrationContainerElement = undefined;
        self.hideTelestrationControlsMenu = undefined;
        self.showTelestrationControlsMenu = undefined;
        self.toggleTelestrationControlsMenu = undefined;
        self.telestrationSVG = undefined;
        self.isEditEnabled = true;

        self.$save = function $save(callback) {

            $scope.$emit('telestrations:save', callback);
        };

        self.$updated = function $updated() {

            $scope.$emit('telestrations:updated');
        };

        self.$clearCurrent = function $clearCurrent() {

            self.currentTelestration.glyphs.clearGlyphs();
            $scope.telestrationsEntity.remove(self.currentTelestration);
            self.$updated();
            self.$save();
        };

        self.$removeLast = function $removeLast() {

            self.currentTelestration.glyphs.removeLast();

            if (!self.currentTelestration.hasGlyphs()) {
                $scope.telestrationsEntity.remove(self.currentTelestration);
                self.$updated();
            }

            self.$save();
        };

    }
];
