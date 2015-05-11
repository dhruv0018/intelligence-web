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

    this.resizeTelestrationContext = () => {

        if (this.telestrationSVG) {

            let newSVGContainerClientRect = this.telestrationSVGContainer[0].getBoundingClientRect();

            this.previousSVGContainerClientRect = newSVGContainerClientRect;

            this.telestrationSVG.size(
                newSVGContainerClientRect.width,
                newSVGContainerClientRect.height
            );
        }
    };

    this.renderGlyphs = () => {

        if (!this.currentTelestration || !this.currentTelestration.glyphs) return;

        this.currentTelestration.glyphs.render();
    };

    this.onFullScreenChange = (isFullScreen) => {

        let animationFrameMaxTime = 10000;
        if (animationFrame) cancelAnimationFrame(animationFrame);

        // If the domElement has not rendered to a different size within animationFrameMaxTime, cancel the animatinoFrame
        setTimeout(function cancel() {

            cancelAnimationFrame(animationFrame);

        }, animationFrameMaxTime);

        /**
         * NOTE: This uses requestAnimationFrame since we must continually checking the DOM to check
         * and see if it has rendered yet to the new size, so that the telestrationsSVGContainer
         * can resize to the new size. This is a fix for a race-condition that presents itself
         * in Chrome sometimes, and all of the time in Safari
         */
        if (isFullScreen) {

            animationFrame = requestAnimationFrame(renderDomElementToLargerSize.bind(this));

        } else {

            animationFrame = requestAnimationFrame(renderDomToSmallerSize.bind(this));
        }
    };

    function renderDomElementToLargerSize() {

        let newSVGContainerClientRect = this.telestrationSVGContainer[0].getBoundingClientRect();

        if (newSVGContainerClientRect.width > this.previousSVGContainerClientRect.width ||
            newSVGContainerClientRect.height > this.previousSVGContainerClientRect.height) {

            this.renderGlyphs();
            this.resizeTelestrationContext();
            return true;
        }

        animationFrame = requestAnimationFrame(renderDomElementToLargerSize.bind(this));
    }

    function renderDomToSmallerSize() {

        let newSVGContainerClientRect = this.telestrationSVGContainer[0].getBoundingClientRect();

        if (newSVGContainerClientRect.width < this.previousSVGContainerClientRect.width ||
            newSVGContainerClientRect.height < this.previousSVGContainerClientRect.height) {
            this.renderGlyphs();
            this.resizeTelestrationContext();
            return true;
        }

        animationFrame = requestAnimationFrame(renderDomToSmallerSize.bind(this));
    }

    // Add controller to exposed Telestrations service
    Object.assign(Telestrations, this);
}


module.exports = TelestrationsController;
