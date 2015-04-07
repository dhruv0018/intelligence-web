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

    function postlink(scope, element, attributes, telestrationsController) {

        /* Permission */

        scope.permissions = scope.permissions || TELESTRATION_PERMISSIONS.NO_ACCESS;

        // scope permissions to decide if one can EDIT, VIEW, or has no access to telestrations

        scope.NO_ACCESS = scope.permissions === TELESTRATION_PERMISSIONS.NO_ACCESS;
        scope.EDIT = scope.permissions === TELESTRATION_PERMISSIONS.EDIT;

        if (scope.permissions === TELESTRATION_PERMISSIONS.NO_ACCESS) return;


        /* Variables */

        var currentTelestrationTime = 0;
        var elementRoot = element.find('div');
        var svgContainer = element.find('svg-context-area');


        /* Initialize */

        telestrationsController.telestrationSVG = SVG('svg-context-area').size(svgContainer[0].getBoundingClientRect().width, svgContainer[0].getBoundingClientRect().height);
        telestrationsController.telestrationSVGContainer = svgContainer;
        telestrationsController.telestrationContainerElement = elementRoot;

        // Extend and override existing glyphs with view functionality

        scope.telestrationsEntity.forEach(function extendGlyphs(telestration) {
            if (telestration.glyphs) {
                telestration.glyphs.forEach(function extendGlyph(glyph, index) {
                    telestration.glyphs[index] = Glyphs.extendGlyph(glyph, telestrationsController.telestrationSVGContainer, telestrationsController.telestrationSVG);
                });
                telestration.glyphs.hide();
            }
        });


        /* Helpers */

        var containerX = function() { return telestrationsController.telestrationSVGContainer[0].getBoundingClientRect().left; };
        var containerY = function() { return telestrationsController.telestrationSVGContainer[0].getBoundingClientRect().top; };

        /* Create Event Handlers */

        // Handle Start Telestration

        var telestrationStart = function telestrationStart(mouseEvent) {

            mouseEvent.preventDefault();

            if (!telestrationsController.canTelestrate() || !currentTelestrationTime) return;

            // Enable drawing
            telestrationsController.isDrawing = true;

            var telestration = scope.telestrationsEntity.getTelestration(currentTelestrationTime, scope.playId);
            console.log('telestration?', telestration, 'at: ', currentTelestrationTime);
            // get new telestration if none was found at the currentTelestrationTime
            if (!telestration) {
                telestration = scope.telestrationsEntity.addNewTelestration(currentTelestrationTime, scope.playId);
            }

            // set the current telestration
            telestrationsController.currentTelestration = telestration;

            // create new glyph
            var newGlyph = telestration.addGlyph(telestrationsController.selectedGlyphType, telestrationsController.telestrationSVGContainer, telestrationsController.telestrationSVG, telestrationsController.selectedGlyphColor.hex);

            var startRelativePixelX = mouseEvent.x - containerX();
            var startRelativePixelY = mouseEvent.y - containerY();

            newGlyph.updateStartPointFromPixels(startRelativePixelX, startRelativePixelY);

            // set telestration to shown to ensure it does not display immediately after play resumes
            telestration.shown = true;

            scope.$apply();

        };

        // Handle Video Time Updates

        var timeUpdateHandler = function timeUpdateHandler(event) {
            // Set the currentTelestration time to the updated time
            if (telestrationsController.glyphsVisible || telestrationsController.hide) return;

            currentTelestrationTime = event.currentTime;
            console.log('timeUpdateHandler', event.currentTime);

            scope.telestrationsEntity.forEach(function(savedTelestration) {

                if (scope.playId && savedTelestration.playId && savedTelestration.playId !== scope.playId) return;

                var timeDelta = Math.abs(event.currentTime - savedTelestration.time);

                // If a telestration was shown and we are not within the time frame it should be shown, reset it.
                if (timeDelta > TELESTRATIONS_CONSTANTS.MAX_TIME_DELTA && savedTelestration.shown) savedTelestration.shown = false;

                if ((timeDelta <= TELESTRATIONS_CONSTANTS.MAX_TIME_DELTA) && savedTelestration.hasGlyphs() && !telestrationsController.glyphsVisible) {

                    // Do not display already shown telestration
                    if (savedTelestration.shown) return;
                    else savedTelestration.shown = true;

                    // make sure svg is the correct size when drawing each time
                    resizeTelestrationContext();

                    // Override the current telestration time to the existing saved telestration's time in case of minor time difference
                    currentTelestrationTime = savedTelestration.time;

                    TelestrationsEventEmitter.emit(TELESTRATION_EVENTS.ON_GLYPHS_VISIBLE);

                    telestrationsController.isActive = true;

                    telestrationsController.isDrawing = false;

                    telestrationsController.glyphsVisible = true;

                    telestrationsController.currentTelestration = savedTelestration;

                    scope.$apply();

                    // Render the saved telestration
                    savedTelestration.glyphs.show();
                    savedTelestration.glyphs.render();

                    // Viewable only for 3 seconds if not editable
                    if (telestrationsController.permissions === TELESTRATION_PERMISSIONS.VIEW) {
                        $timeout(function playVideo() {
                            VideoPlayerEventEmitter.emit(VIDEO_PLAYER_EVENTS.PLAY);
                        }, 3000);
                    }

                }
            });
        };

        // Clear Telestrations when Video is playing

        var playVideoHandler = function playVideoHandler(event) {

            resizeTelestrationContext();
            telestrationsController.isActive = false;
            telestrationsController.glyphsVisible = false;

            if (telestrationsController.currentTelestration) {
                telestrationsController.currentTelestration.glyphs.hide();
                telestrationsController.currentTelestration = undefined;
                telestrationsController.selectedGlyph = undefined;
            }

            scope.$apply();

        };

        // Resets previously shown telestrations

        var seekingVideoHandler = function seekingVideoHandler(event) {

            telestrationsController.isActive = false;
            currentTelestrationTime = event.currentTime;
            console.log('seekingVideoHandler', event.currentTime);
            telestrationsController.glyphsVisible = false;

            if (telestrationsController.currentTelestration) {
                telestrationsController.currentTelestration.glyphs.hide();
                telestrationsController.currentTelestration = undefined;
                telestrationsController.selectedGlyph = undefined;
            }

            scope.$apply();

        };

        var canPlayHandler = function canPlayHandler() {

            telestrationsController.isActive = true;

            // make sure svg is the correct size when drawing each time
            resizeTelestrationContext();

            scope.$apply();

        };

        var validateCurrentTelestration = function validateCurrentTelestration() {

            var currentTelestration = telestrationsController.currentTelestration;

            if (currentTelestration) {

                // Remove Telestration without glyphs
                if (!currentTelestration.hasGlyphs()) {

                    scope.telestrationsEntity.remove(currentTelestration);
                }
            }
        };

        // Enable Telestrations on Video Pause

        var pauseVideoHandler = function pauseVideoHandler() {

            telestrationsController.isActive = true;

            scope.$apply();
        };

        // add/remove mouse handlers

        var addMouseHandlers = function addMouseHandlers() {

            removeMouseHandlers();
            telestrationsController.telestrationContainerElement.on('mousedown', telestrationStart);
            telestrationsController.telestrationContainerElement.on('mouseup', validateCurrentTelestration);
        };

        var removeMouseHandlers = function removeMouseHandlers() {

            telestrationsController.telestrationContainerElement.off('mousedown', telestrationStart);
            telestrationsController.telestrationContainerElement.off('mouseup', validateCurrentTelestration);
        };

        // Resize SVG Context area based on SVG Container size

        var resizeTelestrationContext = function resizeTelestrationContext() {
            telestrationsController.telestrationSVG.size(svgContainer[0].getBoundingClientRect().width, svgContainer[0].getBoundingClientRect().height);
        };

        // Handle Fullscreen Event

        var handleFullscreenEvent = function handleFullscreenEvent(event) {

            if (event.isFullScreen) {
                telestrationsController.requestFullScreen();
            } else {
                telestrationsController.exitFullScreen();
            }
            resizeTelestrationContext();
        };

        // Remove Event Listeners

        var removeEventHandlers = function removeEventHandlers() {
            removeMouseHandlers();
            VideoPlayerEventEmitter.removeListener(VIDEO_PLAYER_EVENTS.ON_TIME_UPDATE, timeUpdateHandler);
            VideoPlayerEventEmitter.removeListener(VIDEO_PLAYER_EVENTS.ON_CAN_PLAY, canPlayHandler);
            VideoPlayerEventEmitter.removeListener(VIDEO_PLAYER_EVENTS.ON_PLAY, playVideoHandler);
            VideoPlayerEventEmitter.removeListener(VIDEO_PLAYER_EVENTS.ON_SEEKING, seekingVideoHandler);
            VideoPlayerEventEmitter.removeListener(VIDEO_PLAYER_EVENTS.ON_PAUSE, pauseVideoHandler);
            VideoPlayerEventEmitter.removeListener(VIDEO_PLAYER_EVENTS.FULLSCREEN, handleFullscreenEvent);
            $window.removeEventListener('resize', resizeTelestrationContext);
        };


        /* Register listeners and Bind Handlers */

        // Start Telestration

        if (telestrationsController.permissions === TELESTRATION_PERMISSIONS.EDIT) {

            addMouseHandlers();

            TelestrationsEventEmitter.on('disableDraw', function handleDisableDraw(event) {

                removeMouseHandlers();
            });

            TelestrationsEventEmitter.on('enableDraw', function handleEnableDraw(event) {

                addMouseHandlers();
            });
        }

        // Subscribe to Video Events

        VideoPlayerEventEmitter.on(VIDEO_PLAYER_EVENTS.ON_PAUSE, pauseVideoHandler);
        VideoPlayerEventEmitter.on(VIDEO_PLAYER_EVENTS.ON_TIME_UPDATE, timeUpdateHandler);
        VideoPlayerEventEmitter.on(VIDEO_PLAYER_EVENTS.ON_PLAY, playVideoHandler);
        VideoPlayerEventEmitter.on(VIDEO_PLAYER_EVENTS.ON_SEEKING, seekingVideoHandler);
        VideoPlayerEventEmitter.on(VIDEO_PLAYER_EVENTS.ON_CAN_PLAY, canPlayHandler);
        VideoPlayerEventEmitter.on(VIDEO_PLAYER_EVENTS.FULLSCREEN, handleFullscreenEvent);

        // window event

        $window.addEventListener('resize', resizeTelestrationContext);

        scope.$watch('playId', function hideTelestrationsIfPlayChanges(newPlayId, oldPlayId) {

            if (newPlayId !== oldPlayId) {

                var currentTelestration = telestrationsController.currentTelestration;

                if (currentTelestration && currentTelestration.glyphs) currentTelestration.glyphs.hide();
            }
        });


        /* Cleanup on Destroy */

        element.on('$destroy', function $destroyTelestrations() {

            removeEventHandlers();

            scope.telestrationsEntity.forEach(function removeGlyphListeners(telestration) {
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
