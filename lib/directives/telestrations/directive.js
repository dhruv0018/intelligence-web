/* Telestration Directive */

module.exports = [
    '$state', '$window', '$timeout', 'EventEmitter', 'EVENT_MAP', 'GlyphFactory', 'TELESTRATIONS_CONSTANTS', 'VideoPlayerEventEmitter',
    function($state, $window, $timeout, emitter, EVENT_MAP, Glyphs, TELESTRATIONS_CONSTANTS, videoPlayerEventEmitter) {

        function postlink(scope, element, attributes, telestrationsController) {

            /* Variables */

            var currentTelestrationTime = 0;
            var isPaused = false;
            var elementRoot = element.find('div');
            var svgContainer = element.find('svg-context-area');

            /* Initialize */

            telestrationsController.telestrationSVG = SVG('svg-context-area').size(svgContainer[0].getBoundingClientRect().width, svgContainer[0].getBoundingClientRect().height);
            telestrationsController.telestrationSVGContainer = svgContainer;
            telestrationsController.telestrationContainerElement = elementRoot;
            scope.telestrationsController = telestrationsController;

            // Extend and override existing glyphs with view functionality

            scope.telestrationsEntity.forEach(function extendGlyphs(telestration) {
                if (telestration.glyphs) {
                    telestration.glyphs.forEach(function extendGlyph(glyph, index) {
                        telestration.glyphs[index] = Glyphs.extendGlyph(glyph, telestrationsController.telestrationSVG);
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

                if (!telestrationsController.isActive || !telestrationsController.isEditable) return;

                // Enable drawing
                telestrationsController.isDrawing = true;

                var telestration = scope.telestrationsEntity.getTelestration(currentTelestrationTime, scope.playId);
                // get new telestration if none was found at the currentTelestrationTime
                if (!telestration) {
                    telestration = scope.telestrationsEntity.addNewTelestration(currentTelestrationTime, scope.playId);
                }

                // set the current telestration
                telestrationsController.currentTelestration = telestration;

                // create new glyph
                var newGlyph = telestration.addGlyph(telestrationsController.selectedGlyphType, telestrationsController.telestrationSVG, telestrationsController.selectedGlyphColor);

                telestrationsController.selectedGlyph = newGlyph;

                var startRelativePixelX = mouseEvent.x - containerX();
                var startRelativePixelY = mouseEvent.y - containerY();

                newGlyph.addVertexFromPixels(startRelativePixelX, startRelativePixelY);

                scope.$apply();

            };

            // Handle Video Time Updates

            var timeUpdateHandler = function timeUpdateHandler(e) {
                // Set the currentTelestration time to the updated time
                if (!isPaused) currentTelestrationTime = e.detail.time;

                scope.telestrationsEntity.forEach(function(savedTelestration) {

                    if (scope.playId && savedTelestration.playId && savedTelestration.playId !== scope.playId) return;

                    var timeDelta = Math.abs(e.detail.time - savedTelestration.time);

                    // If a telestration was shown and we are not within the time frame it should be shown, reset it.
                    if (timeDelta > TELESTRATIONS_CONSTANTS.MAX_TIME_DELTA && savedTelestration.shown) savedTelestration.shown = false;

                    if ((timeDelta <= TELESTRATIONS_CONSTANTS.MAX_TIME_DELTA) && savedTelestration.hasGlyphs()) {

                        // Do not display already shown telestration
                        if (savedTelestration.shown) return;
                        else savedTelestration.shown = true;

                        isPaused = true;
                        // make sure svg is the correct size when drawing each time
                        resizeTelestrationContext();

                        // Override the current telestration time to the existing saved telestration's time in case of minor time difference
                        currentTelestrationTime = savedTelestration.time;

                        emitter.register(new CustomEvent('pause'));

                        telestrationsController.isActive = true;

                        telestrationsController.isDrawing = false;

                        telestrationsController.currentTelestration = savedTelestration;

                        scope.$apply();

                        // Render the saved telestration
                        savedTelestration.glyphs.show();
                        savedTelestration.glyphs.render();

                        // Viewable only for 3 seconds if not editable
                        if (!scope.isEditable) {
                            $timeout(function playVideo() {
                                emitter.register(new CustomEvent('play'));
                            }, 3000);
                        }

                    }
                });
            };

            // Clear Telestrations when Video is playing

            var playVideoHandler = function playVideoHandler(e) {

                isPaused = false;

                resizeTelestrationContext();
                telestrationsController.isActive = false;

                if (telestrationsController.currentTelestration) {
                    telestrationsController.currentTelestration.glyphs.hide();
                    telestrationsController.currentTelestration = null;
                }

                scope.$apply();

            };

            // Resets previously shown telestrations

            var seekingVideoHandler = function seekingVideoHandler(e) {

                if (telestrationsController.currentTelestration) {
                    telestrationsController.currentTelestration.glyphs.hide();
                    telestrationsController.currentTelestration = null;
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

            var pauseVideoHandler = function(e) {

                telestrationsController.isActive = true;
                scope.$apply();

            };

            // Resize SVG Context area based on SVG Container size

            var resizeTelestrationContext = function resizeTelestrationContext() {
                telestrationsController.telestrationSVG.size(svgContainer[0].getBoundingClientRect().width, svgContainer[0].getBoundingClientRect().height);
            };

            // Handle Fullscreen Event

            var handleFullscreenEvent = function handleFullscreenEvent(isFullscreen) {

                if (isFullscreen) {
                    telestrationsController.$requestFullScreen();
                } else {
                    telestrationsController.$exitFullScreen();
                }
                resizeTelestrationContext();
            };

            // Remove Event Listeners

            var removeEventHandlers = function removeEventHandlers() {
                telestrationsController.telestrationSVG.mousedown(null);
                telestrationsController.telestrationSVG.mouseup(null);
                emitter.unsubscribe(EVENT_MAP.timeupdate, timeUpdateHandler);
                emitter.unsubscribe(EVENT_MAP.canplay, canPlayHandler);
                emitter.unsubscribe(EVENT_MAP.play, playVideoHandler);
                emitter.unsubscribe(EVENT_MAP.seeking, seekingVideoHandler);
                emitter.unsubscribe(EVENT_MAP.pause, pauseVideoHandler);
                videoPlayerEventEmitter.removeListener('fullscreen', handleFullscreenEvent);
                $window.removeEventListener('resize', resizeTelestrationContext);
            };


            /* Register listeners and Bind Handlers */

            // Start Telestration

            telestrationsController.telestrationSVG.mousedown(telestrationStart);
            telestrationsController.telestrationSVG.mouseup(validateCurrentTelestration);

            // Subscribe to Video Events

            emitter.subscribe(EVENT_MAP.pause, pauseVideoHandler);
            emitter.subscribe(EVENT_MAP.timeupdate, timeUpdateHandler);
            emitter.subscribe(EVENT_MAP.play, playVideoHandler);
            emitter.subscribe(EVENT_MAP.seeking, seekingVideoHandler);
            emitter.subscribe(EVENT_MAP.canplay, canPlayHandler);
            videoPlayerEventEmitter.on('fullscreen', handleFullscreenEvent);

            // window event

            angular.element($window).bind('resize', resizeTelestrationContext);


            /* Cleanup on Destroy */

            element.on('$destroy', function $destroyTelestrations() {

                removeEventHandlers();

                scope.telestrationsEntity.forEach(function removeGlyphListeners(telestration) {
                    if (telestration.glyphs) telestration.glyphs.removeListeners();
                });
            });
        }

        return {
            restrict: 'E',
            scope: {
                telestrationsEntity: '=',
                playId: '=?',
                isEditable: '='
            },
            transclude: true,
            require: 'telestrations',
            templateUrl: 'telestration-template.html',
            link: {
                pre: function() {

                },
                post: postlink
            },
            controller: require('./controller')
        };
    }
];
