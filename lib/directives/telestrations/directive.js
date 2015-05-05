/* Telestration Directive */

TelestrationsDirective.$inject = [
    '$state',
    '$window',
    '$timeout',
    'VIDEO_PLAYER_EVENTS',
    'GlyphFactory',
    'TELESTRATIONS_CONSTANTS',
    'VideoPlayerEventEmitter',
    'TelestrationsEventEmitter',
    'TELESTRATION_PERMISSIONS',
    'TELESTRATION_EVENTS'
];

function TelestrationsDirective(
    $state,
    $window,
    $timeout,
    VIDEO_PLAYER_EVENTS,
    Glyphs,
    TELESTRATIONS_CONSTANTS,
    VideoPlayerEventEmitter,
    TelestrationsEventEmitter,
    TELESTRATION_PERMISSIONS,
    TELESTRATION_EVENTS
) {

    function postlink($scope, $element, $attributes, telestrationsController) {

        /* Permission */

        $scope.permissions = $scope.permissions || TELESTRATION_PERMISSIONS.NO_ACCESS;

        // $scope permissions to decide if one can EDIT, VIEW, or has no access to telestrations

        $scope.NO_ACCESS = $scope.permissions === TELESTRATION_PERMISSIONS.NO_ACCESS;
        $scope.EDIT = $scope.permissions === TELESTRATION_PERMISSIONS.EDIT;

        if ($scope.permissions === TELESTRATION_PERMISSIONS.NO_ACCESS) return;


        /* Variables */

        let currentTelestrationTime = 0;


        /* Initialize */

        telestrationsController.telestrationSVGContainer = $element.find('svg-context-area');
        telestrationsController.telestrationSVG = SVG('svg-context-area').size(
            telestrationsController.telestrationSVGContainer[0].getBoundingClientRect().width,
            telestrationsController.telestrationSVGContainer[0].getBoundingClientRect().height
        );

        telestrationsController.telestrationContainerElement = $element;

        // Extend and override existing glyphs with view functionality

        $scope.telestrationsEntity.forEach(function extendGlyphs(telestration) {

            if (telestration.hasGlyphs()) {

                telestration.glyphs.forEach(function extendGlyph(glyph, index) {

                    telestration.glyphs[index] = Glyphs.extendGlyph(glyph, telestrationsController.telestrationSVGContainer, telestrationsController.telestrationSVG);
                });

                telestration.glyphs.hide();
            }
        });


        /* Bind Handlers to Listeners */

        if (telestrationsController.permissions === TELESTRATION_PERMISSIONS.EDIT) {

            enableDraw();

            TelestrationsEventEmitter.on(TELESTRATION_EVENTS.DISABLE_DRAW, disableDraw);
            TelestrationsEventEmitter.on(TELESTRATION_EVENTS.ENABLE_DRAW, enableDraw);
        }

        // Subscribe to Video Events

        VideoPlayerEventEmitter.on(VIDEO_PLAYER_EVENTS.ON_PAUSE, onVideoPause);
        VideoPlayerEventEmitter.on(VIDEO_PLAYER_EVENTS.ON_TIME_UPDATE, onVideoTimeUpdate);
        VideoPlayerEventEmitter.on(VIDEO_PLAYER_EVENTS.ON_PLAY, onVideoPlay);
        VideoPlayerEventEmitter.on(VIDEO_PLAYER_EVENTS.ON_SEEKING, onVideoSeeking);
        VideoPlayerEventEmitter.on(VIDEO_PLAYER_EVENTS.ON_CAN_PLAY, onVideoCanPlay);

        // window event

        $window.addEventListener('resize', telestrationsController.resizeTelestrationContext);

        $scope.$watch('playId', function hideTelestrationsIfPlayChanges(newPlayId, oldPlayId) {

            if (newPlayId !== oldPlayId) {

                let currentTelestration = telestrationsController.currentTelestration;

                if (currentTelestration && currentTelestration.glyphs) currentTelestration.glyphs.hide();
            }
        });


        /* Helpers */

        function enableDraw(e) {

            addMouseHandlers();
            telestrationsController.selectedGlyph = null;
        }

        $scope.enableDraw = enableDraw;

        function disableDraw(e) {

            removeMouseHandlers();
        }

        $scope.disableDraw = disableDraw;


        // add/remove mouse handlers

        function addMouseHandlers() {

            removeMouseHandlers();
            telestrationsController.telestrationContainerElement.on('mousedown', onMousedown);
            telestrationsController.telestrationContainerElement.on('mouseup', onMouseup);
        }

        function removeMouseHandlers() {

            telestrationsController.telestrationContainerElement.off('mousedown', onMousedown);
            telestrationsController.telestrationContainerElement.off('mouseup', onMouseup);
        }

        /* Event Handlers */

        function onMousedown(event) {

            telestrationStart(event);
        }

        function onMouseup(event) {

            validateCurrentTelestration(event);
        }


        // Handle Start Telestration

        function telestrationStart(mouseEvent) {

            mouseEvent.preventDefault();

            if (!telestrationsController.canTelestrate() || !currentTelestrationTime) return;

            // Enable drawing
            telestrationsController.isDrawing = true;

            let telestration = $scope.telestrationsEntity.getTelestration(currentTelestrationTime, $scope.playId);

            // get new telestration if none was found at the currentTelestrationTime
            if (!telestration) {

                telestration = $scope.telestrationsEntity.addNewTelestration(currentTelestrationTime, $scope.playId);
            }

            // set the current telestration
            telestrationsController.currentTelestration = telestration;

            // create new glyph
            let newGlyph = telestration.addGlyph(telestrationsController.selectedGlyphType, telestrationsController.telestrationSVGContainer, telestrationsController.telestrationSVG, telestrationsController.selectedGlyphColor.hex);

            let startRelativePixelX = mouseEvent.x - telestrationsController.containerX();
            let startRelativePixelY = mouseEvent.y - telestrationsController.containerY();

            newGlyph.updateStartPointFromPixels(startRelativePixelX, startRelativePixelY);

            // set telestration to shown to ensure it does not display immediately after play resumes
            telestration.shown = true;

            $scope.$apply();
        }

        function showTelestration(telestration) {

            // Do not display already shown telestration
            if (telestration.shown || !telestration.hasGlyphs()) return;
            else telestration.shown = true;

            telestrationsController.activate();

            // Override the current telestration time to the existing saved telestration's time in case of minor time difference
            currentTelestrationTime = telestration.time;

            // make sure svg is the correct size when drawing each time
            telestrationsController.resizeTelestrationContext();

            TelestrationsEventEmitter.emit(TELESTRATION_EVENTS.ON_GLYPHS_VISIBLE);

            telestrationsController.isDrawing = false;

            telestrationsController.glyphsVisible = true;

            telestrationsController.currentTelestration = telestration;

            $scope.$apply();

            // Render the saved telestration
            telestration.glyphs.show();
            telestration.glyphs.render();

            // Viewable only for 3 seconds if not editable
            if (telestrationsController.permissions === TELESTRATION_PERMISSIONS.VIEW) {

                $timeout(function playVideo() {

                    VideoPlayerEventEmitter.emit(VIDEO_PLAYER_EVENTS.PLAY);
                }, TELESTRATIONS_CONSTANTS.VIEW_PLAY_DELAY);
            }
        }

        function validateCurrentTelestration() {

            let currentTelestration = telestrationsController.currentTelestration;

            if (currentTelestration) {

                // Remove Telestration without glyphs
                if (!currentTelestration.hasGlyphs()) {

                    $scope.telestrationsEntity.remove(currentTelestration);
                }
            }
        }


        // Handle Video Time Updates

        function onVideoTimeUpdate(event) {

            if (telestrationsController.glyphsVisible || telestrationsController.hide) return;

            // Set the currentTelestration time to the updated time
            currentTelestrationTime = event.target.currentTime;

            $scope.telestrationsEntity.forEach(function checkTelestrationTimeForDisplay(savedTelestration) {

                if ($scope.playId && savedTelestration.playId && savedTelestration.playId !== $scope.playId) return;

                let timeDelta = Math.abs(event.target.currentTime - savedTelestration.time);

                // If a telestration was shown and we are not within the time frame it should be shown, reset it.
                if (timeDelta > TELESTRATIONS_CONSTANTS.MAX_TIME_DELTA && savedTelestration.shown) savedTelestration.shown = false;

                if ((timeDelta <= TELESTRATIONS_CONSTANTS.MAX_TIME_DELTA) && !telestrationsController.glyphsVisible) {

                    showTelestration(savedTelestration);
                }
            });
        }

        // Deactivate telestrations when video is playing

        function onVideoPlay() {

            telestrationsController.resizeTelestrationContext();

            telestrationsController.deactivate();
            $scope.$apply();
        }

        // Deactivate telestrations and save current time previously shown telestrations

        function onVideoSeeking(event) {

            currentTelestrationTime = event.target.currentTime;

            telestrationsController.deactivate();
            $scope.$apply();
        }

        function onVideoCanPlay() {

            telestrationsController.resizeTelestrationContext();

            telestrationsController.activate();
            $scope.$apply();
        }


        // Enable Telestrations on Video Pause

        function onVideoPause() {

            telestrationsController.activate();
            $scope.$apply();
        }

        // Remove Event Listeners

        function removeEventHandlers() {

            removeMouseHandlers();
            VideoPlayerEventEmitter.removeListener(VIDEO_PLAYER_EVENTS.ON_TIME_UPDATE, onVideoTimeUpdate);
            VideoPlayerEventEmitter.removeListener(VIDEO_PLAYER_EVENTS.ON_CAN_PLAY, onVideoCanPlay);
            VideoPlayerEventEmitter.removeListener(VIDEO_PLAYER_EVENTS.ON_PLAY, onVideoPlay);
            VideoPlayerEventEmitter.removeListener(VIDEO_PLAYER_EVENTS.ON_SEEKING, onVideoSeeking);
            VideoPlayerEventEmitter.removeListener(VIDEO_PLAYER_EVENTS.ON_PAUSE, onVideoPause);
            $window.removeEventListener('resize', telestrationsController.resizeTelestrationContext);
        }


        /* Cleanup on Destroy */

        $element.on('$destroy', function destroyTelestrations() {

            removeEventHandlers();

            $scope.telestrationsEntity.forEach(function removeGlyphListeners(telestration) {

                if (telestration.glyphs) telestration.glyphs.decommission();
            });
        });
    }

    return {
        restrict: 'E',
        scope: {
            telestrationsEntity: '=',
            playId: '=?',
            permissions: '='
        },
        transclude: true,
        replace: true,
        require: 'telestrations',
        templateUrl: 'telestration-template.html',
        link: {
            pre: function() {

            },
            post: postlink
        },
        controller: require('./controller'),
        controllerAs: 'telestrations'
    };
}

module.exports = TelestrationsDirective;
