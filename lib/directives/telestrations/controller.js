TelestrationsController.$inject = [
    '$scope',
    '$element',
    'Telestrations',
    'TELESTRATION_TYPES',
    'TELESTRATION_COLORS',
    'TELESTRATION_PERMISSIONS'
];

/* Telestrations Controller */
function TelestrationsController(
    $scope,
    $element,
    Telestrations,
    TELESTRATION_TYPES,
    TELESTRATION_COLORS,
    TELESTRATION_PERMISSIONS
) {

    /* Permissions */
    this.permissions = $scope.permissions;

    /* Defaults */
    this.game = null;
    this.telestrationsEntity = $scope.telestrationsEntity;
    this.currentTelestration = null;
    this.selectedGlyph = null;
    this.isDrawing = false;
    this.selectedGlyphType = TELESTRATION_TYPES.ARROW_SOLID;
    this.selectedGlyphColor = TELESTRATION_COLORS.GLYPHS.PRIMARY;
    this.currentZIndex = 1;
    this.telestrationSVGContainer = undefined;
    this.telestrationContainerElement = undefined;
    this.hideTelestrationControlsMenu = undefined;
    this.showTelestrationControlsMenu = undefined;
    this.toggleTelestrationControlsMenu = undefined;
    this.telestrationSVG = undefined;
    this.isActive = false; // explicitly set from telestration state (i.e. if video is playing -> isActive = false)
    this.isEnabled = false; // explicitly set from telestration control bar
    this.glyphsVisible = false;
    this.hide = true; // Overall setting to hide all of telestrations, which defaults to true

    let animationFrame;

    this.show = () => {

        this.hide = false;
        $scope.$apply();
    };

    this.save = (callback) => {

        $scope.$emit('telestrations:save', callback);
    };

    this.updated = () => {

        $scope.$emit('telestrations:updated');
    };

    this.glyphsCleared = () => {

        $scope.enableDraw();
    };

    this.glyphDeleted = () => {

        $scope.enableDraw();
    };

    this.removeLast = () => {

        this.currentTelestration.glyphs.removeLast();

        if (!this.currentTelestration.hasGlyphs()) {
            $scope.telestrationsEntity.remove(this.currentTelestration);
            this.updated();
        }

        this.save();
    };

    this.areGlyphsPresent = () => {

        if (this.currentTelestration && this.currentTelestration.hasGlyphs()) {

            return true;
        }
    };

    this.canTelestrate = () => {

        return this.isActive && this.isEnabled;
    };

    this.activate = () => {

        this.isActive = true;
    };

    this.deactivate = () => {

        this.isActive = false;
        this.glyphsVisible = false;

        if (this.currentTelestration) {

            this.currentTelestration.glyphs.hide();
            this.currentTelestration = undefined;
            this.selectedGlyph = undefined;
        }
    };

    this.containerX = () => this.telestrationSVGContainer[0].getBoundingClientRect().left;
    this.containerY = () => this.telestrationSVGContainer[0].getBoundingClientRect().top;

    this.resizeTelestrationContext = () => {};

    this.validateCurrentTelestration = () => {

        let currentTelestration = this.currentTelestration;

        if (currentTelestration) {

            // Remove Telestration without glyphs
            if (!currentTelestration.hasGlyphs()) {

                this.telestrationsEntity.remove(currentTelestration);
            }
        }
    };

    // Add controller to exposed Telestrations service
    Object.assign(Telestrations, this);
}


module.exports = TelestrationsController;
