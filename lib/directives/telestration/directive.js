/* Telestration Directive */

module.exports = [
    '$state', 'TelestrationInterface', '$window', 'EventEmitter', 'EVENT_MAP', 'GlyphFactory',
    function($state, telestrationInterface, $window, emitter, EVENT_MAP, Glyphs) {
        function postlink(scope, elem, attr, API) {

            /* Initialize */

            telestrationInterface.telestrationSVG = SVG('videoTelestration').size(elem[0].getBoundingClientRect().width, elem[0].getBoundingClientRect().height);
            telestrationInterface.telestrationContainerElement = elem;
            scope.telestrationInterface = telestrationInterface;


            /* Helpers */

            var containerX = function() { return telestrationInterface.telestrationContainerElement[0].getBoundingClientRect().left; };
            var containerY = function() { return telestrationInterface.telestrationContainerElement[0].getBoundingClientRect().top; };


            /* Create Event Handlers */

            // Handle Start Telestration

            var telestrationStart = function telestrationStart(mouseEvent) {

                if (!telestrationInterface.isEditEnabled) return;

                // create new glyph
                var newGlyph = Glyphs.createGlyph(telestrationInterface.selectedGlyphType, telestrationInterface.telestrationSVG);
                telestrationInterface.addGlyph(newGlyph);
                scope.$apply();

                // make sure svg is the correct size when drawing each time
                telestrationInterface.telestrationSVG.size(elem[0].getBoundingClientRect().width, elem[0].getBoundingClientRect().height);

                var startRelativePixelX = mouseEvent.x - containerX();
                var startRelativePixelY = mouseEvent.y - containerY();

                newGlyph.addVertexFromPixels(startRelativePixelX, startRelativePixelY);

            };

            // Handle Video Time Updates

            var timeUpdateHandler = function(e) {
                var isGame = (scope.film.description === 'games');
                var isBreakdown = (isGame && $state.current.name === 'Games.Breakdown');
                var telestrationsDataKey = (!isGame) ? 'telestrations' : (isBreakdown) ? 'playTelestrations' : 'rawTelestrations';

                scope.film[telestrationsDataKey].forEach(function(telestration) {
                    if (telestration.time <= e.detail.time && !telestration.shown) {
                        console.log('sending a outbound stopvideo event');
                        emitter.register(new CustomEvent('stopvideo'));
                        telestration.shown = true;

                        if (telestration.glyphs) {
                            telestration.glyphs.forEach(function(tempGlyph) {
                                var glyph = new Glyph(tempGlyph.type);
                                if (tempGlyph.vertices) {
                                    tempGlyph.vertices.forEach(function(vertex) {
                                        glyph.addVertexFromPixels(vertex.x, vertex.y);
                                    });
                                }
                                console.log(JSON.stringify(glyph));
                                telestrationInterface.addGlyph(glyph);
                                scope.$apply();
                                glyph.render();
                            });
                        }
                    }
                });
            };

            // Clear Telestrations when Video is playing

            var playVideoHandler = function(e) {
                telestrationInterface.isEditEnabled = false;
                telestrationInterface.clearGlyphs();
                scope.$apply();
            };

            // Resets previously shown telestrations

            var seekingVideoHandler = function(e) {
                var isGame = (scope.film.description === 'games');
                var isBreakdown = (isGame && $state.current.name === 'Games.Breakdown');
                var telestrationsDataKey = (!isGame) ? 'telestrations' : (isBreakdown) ? 'playTelestrations' : 'rawTelestrations';
                telestrationInterface.clearGlyphs();
                scope.film[telestrationsDataKey].forEach(function(telestration) {
                    if (telestration.time >= e.detail.time && telestration.shown) {
                        telestration.shown = !telestration.shown;
                    }
                });
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

            // Window Events

            angular.element($window).bind('resize', resizeTelestrationContext);


            /* Cleanup on Destroy */

            elem.on('$destroy', function() {
                removeEventHandlers();
            });
        }

        return {
            restrict: 'E',
            scope: false,
            transclude: true,
            templateUrl: 'telestration-template.html',
            link: {
                pre: function() {

                },
                post: postlink
            }
        };
    }
];
