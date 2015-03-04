
/* Telestrations Controller */
module.exports = [
    '$scope', '$element', 'TELESTRATION_TYPES', 'TELESTRATION_COLORS',
    function($scope, $element, TELESTRATION_TYPES, TELESTRATION_COLORS) {

        var self = this;

        self.isEditable = $scope.isEditable || false; // whether or not a telestration can be edited

        /* Defaults */
        self.game = null;
        self.currentTelestration = null;
        self.selectedGlyph = null;
        self.isDrawing = false;
        self.selectedGlyphType = TELESTRATION_TYPES.ARROW_SOLID;
        self.selectedGlyphColor = TELESTRATION_COLORS.PRIMARY.hex;
        self.currentZIndex = 1;
        self.telestrationSVGContainer = undefined;
        self.telestrationContainerElement = undefined;
        self.hideTelestrationControlsMenu = undefined;
        self.showTelestrationControlsMenu = undefined;
        self.toggleTelestrationControlsMenu = undefined;
        self.telestrationSVG = undefined;
        self.isActive = true; // whether or not a telestration can be drawn or rendered

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

        self.$areGlyphsPresent = function $areGlyphsPresent() {

            if (self.currentTelestration && self.currentTelestration.hasGlyphs()) {

                return true;
            }
        };

    }
];
