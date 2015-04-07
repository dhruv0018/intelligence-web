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

    this.clearCurrent = () => {

        this.currentTelestration.glyphs.clearGlyphs();
        $scope.telestrationsEntity.remove(this.currentTelestration);
        this.selectedGlyph = undefined;
        this.updated();
        this.save();
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

    this.requestFullScreen = () => {

        console.log('requestFullScreen', this.telestrationContainerElement[0].requestFullscreen);
        this.telestrationContainerElement[0].requestFullscreen();
        this.telestrationContainerElement.addClass('fullscreen');
        this.resizeTelestrationContext();
    };

    this.exitFullScreen = () => {

        console.log('exitFullScreen');
        document.exitFullscreen();
        this.telestrationContainerElement.removeClass('fullscreen');
        this.resizeTelestrationContext();
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

    this.resizeTelestrationContext = () => {

        console.log('resizeTelestrationContext', this.telestrationSVGContainer[0].getBoundingClientRect());
        this.telestrationSVG.size(
            this.telestrationSVGContainer[0].getBoundingClientRect().width,
            this.telestrationSVGContainer[0].getBoundingClientRect().height
        );
    };

    // Add controller to exposed Telestrations service
    Object.assign(Telestrations, this);
}


module.exports = TelestrationsController;
