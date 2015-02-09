require('./glyph.js');
require('telestration-menu');

/* Cache the template file */
var Telestration = angular.module('Telestration', [
    'Glyph',
    'TelestrationMenu'
]);

Telestration.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put('telestration-template.html', require('./template.html'));
    }
]);

var TELESTRATION_TYPES_OBJECT = {
    FREEHAND: 1,
    ARROW: 2,
    T_BAR: 3,
    CIRCLE: 4,
    SHADOW_CIRCLE: 5,
    CONE: 6,
    TEXT_TOOL: 7
};

Telestration.value('TELESTRATION_TYPES', TELESTRATION_TYPES_OBJECT);

Telestration.service('TelestrationInterface', [
    'TELESTRATION_TYPES',
    function(TELESTRATION_TYPES) {

        var glyphs = [];

        var getGlyphs = function getGlyphs() {
            return glyphs;
        };

        var addGlyph = function addGlyph(glyph) {
            if (glyph) glyphs.push(glyph);
        };

        var popGlyph = function popGlyph() {
            return glyphs.pop();
        };

        var removeGlyph = function removeGlyph(glyph) {
            var glyphIndex = glyphs.indexOf(glyph);
            if (glyphIndex != -1) glyphs.splice(glyphIndex, 1);
        };

        var clearGlyphs = function clearGlyphs() {
            glyphs.length = 0;
        };

        return {
            selectedGlyphType: TELESTRATION_TYPES.FREEHAND, //Defaults to freehand
            currentZIndex: 1,
            telestrationContainerElement: undefined,
            hideTelestrationControlsMenu: undefined,
            showTelestrationControlsMenu: undefined,
            toggleTelestrationControlsMenu: undefined,
            telestrationSVG: undefined,
            isEditEnabled: false,
            getGlyphs: getGlyphs,
            addGlyph: addGlyph,
            popGlyph: popGlyph,
            removeGlyph: removeGlyph,
            clearGlyphs: clearGlyphs
        };
    }
]);

Telestration.directive('telestration', [
    '$state', 'TelestrationInterface', 'GlyphFactory', '$window', 'EventEmitter', 'EVENT_MAP',
    function($state, telestrationInterface, Glyph, $window, emitter, EVENT_MAP) {
        function postlink(scope, elem, attr, API) {

            var isMousedown = false;
            var newGlyph;
            var startPoint;
            var isDrawing = false;

            var containerX = function() { return elem[0].getBoundingClientRect().left; };
            var containerY = function() { return elem[0].getBoundingClientRect().top; };

            telestrationInterface.telestrationSVG = SVG('videoTelestration').size(elem[0].getBoundingClientRect().width, elem[0].getBoundingClientRect().height);

            telestrationInterface.telestrationContainerElement = elem;
            scope.telestrationInterface = telestrationInterface;

            //TODO: attr.observe some permission value
            function telestrationUpdate(mouseEvent) {
                if (!telestrationInterface.isEditEnabled) return;
                newGlyph.updateGlyphFromPixels(mouseEvent.x - containerX(), mouseEvent.y - containerY());
            }

            function telestrationStart(mouseEvent) {
                if (!telestrationInterface.isEditEnabled) return;

                //make sure svg is the correct size when drawing each time
                telestrationInterface.telestrationSVG.size(elem[0].getBoundingClientRect().width, elem[0].getBoundingClientRect().height);

                isMousedown = true;

                newGlyph = new Glyph(telestrationInterface.selectedGlyphType, telestrationInterface.zIndex);

                var startRelativePixelX = mouseEvent.x - containerX();
                var startRelativePixelY = mouseEvent.y - containerY();
                startPoint = [startRelativePixelX, startRelativePixelY];

                newGlyph.addVertexFromPixels(startRelativePixelX, startRelativePixelY);


                // add draw and end listeners
                SVG.on($window, 'mousemove', telestrationDraw);
                SVG.on($window, 'mouseup', telestrationEnd);
                elem.bind('mouseleave', telestrationOutOfBounds);
            }

            function telestrationDraw(mouseEvent) {
                if (!telestrationInterface.isEditEnabled) return;

                if (isMousedown) {
                    //Don't create a new glyph unless the user is obviously drawing
                    if (startPoint) {
                        var startRelativePixelX = mouseEvent.x - containerX();
                        var startRelativePixelY = mouseEvent.y - containerY();
                        var currentPoint = [startRelativePixelX, startRelativePixelY];

                        var distanceDrawn = Math.sqrt((currentPoint[0] - startPoint[0]) * (currentPoint[0] - startPoint[0]) + (currentPoint[1] - startPoint[1]) * (currentPoint[1] - startPoint[1]));
                        if (distanceDrawn > 10) {
                            isDrawing = true;

                            telestrationInterface.addGlyph(newGlyph);
                            scope.$apply();

                            //clear out we are done with it until the next drawing
                            startPoint = void(0);
                        }
                    }

                    if (isDrawing) {
                        telestrationUpdate(mouseEvent);
                        newGlyph.draw();
                    }
                }
            }

            function telestrationEnd(mouseEvent) {
                if (!telestrationInterface.isEditEnabled) return;

                isMousedown = false;

                if (isDrawing) {
                    isDrawing = false;

                    telestrationUpdate(mouseEvent);
                    newGlyph.draw();

                    telestrationInterface.currentZIndex = telestrationInterface.currentZIndex + 1;
                }

                SVG.off($window, 'mousemove', telestrationDraw);
                SVG.off($window, 'mouseup', telestrationEnd);
                elem.unbind('mouseleave', telestrationOutOfBounds);
            }

            function telestrationOutOfBounds() {
                isMousedown = false;
                SVG.off($window, 'mousemove', telestrationDraw);
                SVG.off($window, 'mouseup', telestrationEnd);
                elem.unbind('mouseleave', telestrationOutOfBounds);
            }

            // listen to window resize
            var resizeTelestrationContext = function resizeTelestrationContext() {
                telestrationInterface.telestrationSVG.size(elem[0].getBoundingClientRect().width, elem[0].getBoundingClientRect().height);
            };

            angular.element($window).bind('resize', resizeTelestrationContext);

            elem.bind('mousedown', telestrationStart);

            // remove event handlers on element destroy
            elem.on('$destroy', function() {
                elem.unbind('mousedown');
                SVG.off($window, 'mousemove', telestrationDraw);
                SVG.off($window, 'mouseup', telestrationEnd);
                elem.unbind('mouseleave', telestrationOutOfBounds);
                emitter.unsubscribe(EVENT_MAP['timeupdate'], timeUpdateHandler);
                emitter.subscribe(EVENT_MAP['play'], playVideoHandler);
            });

            //handles video update events
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
                                glyph.draw();
                            });
                        }
                    }
                });
            };

            //clears stagnant telestrations when the play button is clicked
            var playVideoHandler = function(e) {
                telestrationInterface.clearGlyphs();
                scope.$apply();
            };

            emitter.subscribe(EVENT_MAP['timeupdate'], timeUpdateHandler);
            emitter.subscribe(EVENT_MAP['play'], playVideoHandler);
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
]);
