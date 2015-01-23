require('./glyph.js');
require('./telestration-menu.js');

/* Cache the template file */
var Telestration = angular.module('Telestration', [
    'Glyph',
    'TelestrationMenu'
]);

Telestration.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put('telestration-menu.html', require('./menu-template.html'));
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
            currentGlyph: undefined,
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
            restrict: 'A',
            require: '^videogular',
            scope: true,
            link: function(scope, elem, attr, API) {

                var isMousedown = false;
                var newGlyph;
                var startPoint;
                var isDrawing = false;

                var containerX = function() { return elem[0].getBoundingClientRect().left; };
                var containerY = function() { return elem[0].getBoundingClientRect().top; };

                telestrationInterface.telestrationSVG = SVG('videoSpot').size(elem[0].getBoundingClientRect().width, elem[0].getBoundingClientRect().height);

                telestrationInterface.telestrationContainerElement = elem;
                scope.telestrationInterface = telestrationInterface;

                function telestrationUpdate(mouseEvent) {
                    if (!telestrationInterface.isEditEnabled) return;

                    var updatePoint = [mouseEvent.x - containerX(), mouseEvent.y - containerY()];
                    telestrationInterface.currentGlyph.updateGlyph(updatePoint);
                }

                function telestrationStart(mouseEvent) {
                    if (!telestrationInterface.isEditEnabled) return;

                    //make sure svg is the correct size when drawing each time
                    telestrationInterface.telestrationSVG.size(elem[0].getBoundingClientRect().width, elem[0].getBoundingClientRect().height);

                    isMousedown = true;

                    newGlyph = new Glyph(telestrationInterface.selectedGlyphType, telestrationInterface.zIndex);
                    startPoint = [mouseEvent.x - containerX(), mouseEvent.y - containerY()];
                    newGlyph.addVertex(startPoint);

                    // add draw and end listeners
                    SVG.on($window, 'mousemove', telestrationDraw);
                    SVG.on($window, 'mouseup', telestrationEnd);
                    elem.bind('mouseleave', telestrationOutOfBounds);
                }

                function telestrationDraw(mouseEvent) {
                    if (!telestrationInterface.isEditEnabled) return;

                    if (isMousedown) {

                        //Don't create a new glyph unless the user is obviously drawing
                        if (newGlyph && startPoint) {

                            var currentPoint = [mouseEvent.x - containerX(), mouseEvent.y - containerY()];
                            var distanceDrawn = Math.sqrt((currentPoint[0] - startPoint[0]) * (currentPoint[0] - startPoint[0]) + (currentPoint[1] - startPoint[1]) * (currentPoint[1] - startPoint[1]));

                            if (distanceDrawn > 10) {
                                isDrawing = true;

                                telestrationInterface.currentGlyph = newGlyph;
                                telestrationInterface.glyphs.push(newGlyph);
                                scope.$apply();

                                //clear these out we are done with them until the next drawing
                                newGlyph = void(0);
                                startPoint = void(0);
                            }
                        }

                        if (isDrawing) {
                            telestrationUpdate(mouseEvent);
                            telestrationInterface.currentGlyph.draw();
                        }
                    }
                }

                function telestrationEnd(mouseEvent) {
                    if (!telestrationInterface.isEditEnabled) return;

                    isMousedown = false;

                    if (isDrawing) {
                        isDrawing = false;

                        telestrationUpdate(mouseEvent);
                        telestrationInterface.currentGlyph.draw();

                        telestrationInterface.zIndex = telestrationInterface.zIndex + 1;
                        telestrationInterface.currentGlyph = void(0);
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
