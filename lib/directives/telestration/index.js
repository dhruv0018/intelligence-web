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
        return {
            selectedGlyphType: TELESTRATION_TYPES.FREEHAND, //Defaults to freehand
            currentZIndex: 1,
            glyphs: [],
            telestrationContainerElement: undefined,
            hideTelestrationControlsMenu: undefined,
            showTelestrationControlsMenu: undefined,
            toggleTelestrationControlsMenu: undefined,
            telestrationSVG: undefined,
            isEditEnabled: false
        };
    }
]);

Telestration.directive('telestration', [
    'TelestrationInterface', 'GlyphFactory', '$window',
    function(telestrationInterface, Glyph, $window) {
        return {
            restrict: 'E',
            scope: false,
            transclude: true,
            templateUrl: 'telestration-template.html',
            link: function(scope, elem, attr, API) {

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

                                telestrationInterface.glyphs.push(newGlyph);
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

                elem.bind('mousedown', telestrationStart);

                // listen to window resize
                var resizeTelestrationContext = function resizeTelestrationContext() {
                    telestrationInterface.telestrationSVG.size(elem[0].getBoundingClientRect().width, elem[0].getBoundingClientRect().height);
                };

                angular.element($window).bind('resize', resizeTelestrationContext);

                // remove event handlers on element destroy
                elem.on('$destroy', function() {
                    elem.unbind('mousedown');
                    SVG.off($window, 'mousemove', telestrationDraw);
                    SVG.off($window, 'mouseup', telestrationEnd);
                    elem.unbind('mouseleave', telestrationOutOfBounds);
                });
            }
        };
    }
]);
