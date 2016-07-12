TelestrationsController.$inject = [
    '$scope',
    '$element',
    'Telestrations',
    'AnalyticsService',
    'TELESTRATION_EVENTS',
    'TELESTRATION_TYPES',
    'TELESTRATION_COLORS',
    'TELESTRATION_PERMISSIONS',
    'TelestrationsEventEmitter',
];

/* Telestrations Controller */
function TelestrationsController(
    $scope,
    $element,
    Telestrations,
    analytics,
    TELESTRATION_EVENTS,
    TELESTRATION_TYPES,
    TELESTRATION_COLORS,
    TELESTRATION_PERMISSIONS,
    TelestrationsEventEmitter
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
    this.glyphArrayLength = 0;

    let animationFrame;

    let playHasTelestrations = () => {

        if (!$scope.play) return;

        let playHasTelestration = this.telestrationsEntity.some((telestration) => {
            return telestration.playId === $scope.play.id && telestration.hasGlyphs();
        });

        $scope.play.hasTelestrations = playHasTelestration;
    };

    this.show = () => {

        this.hide = false;
        $scope.$apply();
    };

    this.save = (callback) => {
        if (this.currentTelestration.glyphs.length === 1) {
            analytics.track('Glyph Applied', {
                'Glyph Type': this.currentTelestration.glyphs.slice(-1).pop().constructor.name
            });
        } else {
            if(this.currentTelestration.glyphs.length > this.glyphArrayLength) {
                analytics.track('Glyph Applied', {
                    'Glyph Type': this.currentTelestration.glyphs.slice(-1).pop().constructor.name
                });
                this.glyphArrayLength = this.currentTelestration.glyphs.length;
            }
        }

        $scope.$emit('telestrations:save', callback);
    };

    this.updated = () => {

        $scope.$emit('telestrations:updated');
    };

    this.glyphsCleared = () => {

        $scope.enableDraw();

        playHasTelestrations();
    };

    this.glyphDeleted = () => {

        $scope.enableDraw();

        playHasTelestrations();
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

                playHasTelestrations();
            }
        }
    };

    this.controlsToggled = () => {

        this.isEnabled  = !this.isEnabled;

        TelestrationsEventEmitter.emit(TELESTRATION_EVENTS.TOGGLED, this.isEnabled);
    };

    this.toolToggled = (toolType) => {

        TelestrationsEventEmitter.emit(TELESTRATION_EVENTS.TOOL_TOGGLED, toolType);
    };

    // Add controller to exposed Telestrations service
    Object.assign(Telestrations, this);
}


module.exports = TelestrationsController;
