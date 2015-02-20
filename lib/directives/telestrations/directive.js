/* Telestration Directive */

module.exports = [
    '$state', 'TelestrationInterface', '$window', 'EventEmitter', 'EVENT_MAP', 'GlyphFactory', 'PlayManager',
    function($state, telestrationInterface, $window, emitter, EVENT_MAP, Glyphs, PlayManager) {

        function postlink(scope, elem, attr, API) {

            /* Variables */

            var currentTelestrationTime = 0;
            var isPaused = false;

            /* Initialize */

            telestrationInterface.telestrationSVG = SVG('svg-context-area').size(elem[0].getBoundingClientRect().width, elem[0].getBoundingClientRect().height);
            telestrationInterface.telestrationContainerElement = elem;
            scope.telestrationInterface = telestrationInterface;

            // Extend and override existing glyphs with view functionality

            scope.telestrationsEntity.forEach(function extendGlyphs(telestration) {
                if (telestration.glyphs) {
                    telestration.glyphs.forEach(function extendGlyph(glyph, index) {
                        telestration.glyphs[index] = Glyphs.extendGlyph(glyph, telestrationInterface.telestrationSVG);
                    });
                }
            });


            /* Helpers */

            var containerX = function() { return telestrationInterface.telestrationContainerElement[0].getBoundingClientRect().left; };
            var containerY = function() { return telestrationInterface.telestrationContainerElement[0].getBoundingClientRect().top; };


            /* Create Event Handlers */

            // Handle Start Telestration

            var telestrationStart = function telestrationStart(mouseEvent) {

                if (!telestrationInterface.isEditEnabled) return;

                // Enable drawing
                telestrationInterface.isDrawing = true;

                var currentPlayId = PlayManager.current.id;

                // TODO: This is temporary scaffolding for rest of model creation
                var telestration = scope.telestrationsEntity.getTelestration(currentTelestrationTime, currentPlayId);
                telestrationInterface.currentTelestration = telestration;

                // create new glyph
                var newGlyph = telestration.addGlyph(telestrationInterface.selectedGlyphType, telestrationInterface.telestrationSVG, telestrationInterface.selectedGlyphColor);
                if (!newGlyph) return;

                telestrationInterface.selectedGlyph = newGlyph;

                // make sure svg is the correct size when drawing each time
                telestrationInterface.telestrationSVG.size(elem[0].getBoundingClientRect().width, elem[0].getBoundingClientRect().height);

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
                    if (savedTelestration.time <= e.detail.time && !savedTelestration.shown) {
                        isPaused = true;
                        // make sure svg is the correct size when drawing each time
                        telestrationInterface.telestrationSVG.size(elem[0].getBoundingClientRect().width, elem[0].getBoundingClientRect().height);

                        // Override the current telestration time to the existing saved telestration's time in case of minor time difference
                        currentTelestrationTime = savedTelestration.time;

                        emitter.register(new CustomEvent('stopvideo'));
                        savedTelestration.shown = true;

                        telestrationInterface.isDrawing = false;

                        telestrationInterface.currentTelestration = savedTelestration;
                        scope.$apply();

                        // Render the saved telestration
                        savedTelestration.glyphs.render();
                        savedTelestration.glyphs.show();

                    }
                });
            };

            // Clear Telestrations when Video is playing

            var playVideoHandler = function playVideoHandler(e) {

                isPaused = false;

                telestrationInterface.isEditEnabled = false;

                if (telestrationInterface.currentTelestration) telestrationInterface.currentTelestration.glyphs.hide();

                scope.telestrationsEntity.forEach(function updateShown(telestration) {
                    if ((e.detail.time <= telestration.time) && telestration.shown) {
                        telestration.shown = !telestration.shown;
                    }
                });

                scope.$apply();

            };

            // Resets previously shown telestrations

            var seekingVideoHandler = function seekingVideoHandler(e) {

                if (telestrationInterface.currentTelestration) telestrationInterface.currentTelestration.glyphs.hide();

                scope.telestrationsEntity.forEach(function updateShown(telestration) {
                    if ((e.detail.time <= telestration.time) && telestration.shown) {
                        telestration.shown = !telestration.shown;
                    }
                });

                scope.$apply();

            };

            var canPlayHandler = function canPlayHandler() {

                telestrationInterface.isEditEnabled = true;
                scope.$apply();

            };

            // Enable Telestrations on Video Pause

            var pauseVideoHandler = function(e) {

                telestrationInterface.isEditEnabled = true;
                scope.$apply();

            };

            // Remove Event Listeners

            var removeEventHandlers = function removeEventHandlers() {
                elem.unbind('mousedown', telestrationStart);
                emitter.unsubscribe(EVENT_MAP['timeupdate'], timeUpdateHandler);
                emitter.unsubscribe(EVENT_MAP['canplay'], canPlayHandler);
                emitter.unsubscribe(EVENT_MAP['play'], playVideoHandler);
                emitter.unsubscribe(EVENT_MAP['seeking'], seekingVideoHandler);
                emitter.unsubscribe(EVENT_MAP['pause'], pauseVideoHandler);
                $window.removeEventListener('resize', resizeTelestrationContext);
            };

            // Window Listeners

            var resizeTelestrationContext = function resizeTelestrationContext() {
                telestrationInterface.telestrationSVG.size(elem[0].getBoundingClientRect().width, elem[0].getBoundingClientRect().height);
            };

            /* Register listeners and Bind Handlers */

            // Start Telestration

            elem.bind('mousedown', telestrationStart);

            // Subscribe to Video Events

            emitter.subscribe(EVENT_MAP['pause'], pauseVideoHandler);
            emitter.subscribe(EVENT_MAP['timeupdate'], timeUpdateHandler);
            emitter.subscribe(EVENT_MAP['play'], playVideoHandler);
            emitter.subscribe(EVENT_MAP['seeking'], seekingVideoHandler);
            emitter.subscribe(EVENT_MAP['canplay'], canPlayHandler);

            // Window Events

            angular.element($window).bind('resize', resizeTelestrationContext);


            /* Cleanup on Destroy */

            elem.on('$destroy', function() {
                removeEventHandlers();
            });
        }

        return {
            restrict: 'E',
            scope: {
                telestrationsEntity: '='
            },
            transclude: true,
            templateUrl: 'telestration-template.html',
            link: {
                pre: function() {

                },
                post: postlink
            },
            controller: [
                '$scope', '$element',
                function($scope, $element) {

                    var self = this;

                    self.save = function save() {

                        $scope.$emit('telestrations:save');

                    };
                }
            ]
        };
    }
];
