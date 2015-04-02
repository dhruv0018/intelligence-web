
/* Telestrations Controller */
module.exports = [
    '$scope', '$element', 'TELESTRATION_TYPES', 'TELESTRATION_COLORS', 'TELESTRATION_PERMISSIONS',
    function($scope, $element, TELESTRATION_TYPES, TELESTRATION_COLORS, TELESTRATION_PERMISSIONS) {

        var self = this;

        /* Permissions */
        self.permissions = $scope.permissions;

        /* Defaults */
        self.game = null;
        self.currentTelestration = null;
        self.selectedGlyph = null;
        self.isDrawing = false;
        self.selectedGlyphType = TELESTRATION_TYPES.ARROW_SOLID;
        self.selectedGlyphColor = TELESTRATION_COLORS.GLYPHS.PRIMARY;
        self.currentZIndex = 1;
        self.telestrationSVGContainer = undefined;
        self.telestrationContainerElement = undefined;
        self.hideTelestrationControlsMenu = undefined;
        self.showTelestrationControlsMenu = undefined;
        self.toggleTelestrationControlsMenu = undefined;
        self.telestrationSVG = undefined;
        self.isActive = false; // explicitly set from telestration state (i.e. if video is playing -> isActive = false)
        self.isEnabled = false; // explicitly set from telestration control bar

        self.save = function save(callback) {

            $scope.$emit('telestrations:save', callback);
        };

        self.updated = function updated() {

            $scope.$emit('telestrations:updated');
        };

        self.clearCurrent = function clearCurrent() {

            self.currentTelestration.glyphs.clearGlyphs();
            $scope.telestrationsEntity.remove(self.currentTelestration);
            self.selectedGlyph = undefined;
            self.updated();
            self.save();
        };

        self.removeLast = function removeLast() {

            self.currentTelestration.glyphs.removeLast();

            if (!self.currentTelestration.hasGlyphs()) {
                $scope.telestrationsEntity.remove(self.currentTelestration);
                self.updated();
            }

            self.save();
        };

        self.areGlyphsPresent = function areGlyphsPresent() {

            if (self.currentTelestration && self.currentTelestration.hasGlyphs()) {

                return true;
            }
        };

        self.requestFullScreen = function requestFullScreen($event) {

            self.telestrationContainerElement[0].requestFullscreen();
            self.telestrationContainerElement.addClass('fullscreen');
        };

        self.exitFullScreen = function exitFullScreen() {

            document.exitFullscreen();
            self.telestrationContainerElement.removeClass('fullscreen');
        };

        self.canTelestrate = function canTelestrate() {

            return self.isActive && self.isEnabled;
        };
    }
];
