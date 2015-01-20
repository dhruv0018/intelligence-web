var x = require('./glyph.js');
var y = require('./telestration-menu.js');

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

var TELESTRATION_TYPES = {
    FREEHAND: 'freehand',
    ARROW: 'arrow',
    T_BAR: 'tBar',
    CIRCLE: 'circle',
    SHADOW_CIRCLE: 'shadowCircle',
    CONE: 'cone',
    TEXT_TOOL: 'textTool'
};

Telestration.value('TELESTRATION_TYPES', TELESTRATION_TYPES);

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
    'TelestrationInterface', 'GlyphFactory',
    function(telestrationInterface, Glyph) {
        return {
            restrict: 'A',
            require: '^videogular',
            scope: true,
            link: function(scope, elem, attr, API) {

                var elemBox = elem[0].getBoundingClientRect();
                var isMousedown = false;

                var containerX = function() { return elemBox.left; };
                var containerY = function() { return elemBox.top; };

                telestrationInterface.telestrationSVG = SVG('videoSpot').size(elemBox.width, elemBox.height);

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
                    telestrationInterface.telestrationSVG.size(elemBox.width, elemBox.height);

                    isMousedown = true;
                    var newGlyph = new Glyph(telestrationInterface.selectedGlyphType, telestrationInterface.zIndex);
                    telestrationInterface.currentGlyph = newGlyph;
                    telestrationInterface.glyphs.push(newGlyph);
                    scope.$apply();

                    var startPoint = [mouseEvent.x - containerX(), mouseEvent.y - containerY()];
                    newGlyph.addVertex(startPoint);
                    newGlyph.draw();
                }

                function telestrationEnd(mouseEvent) {
                    if (!telestrationInterface.isEditEnabled) return;

                    isMousedown = false;

                    telestrationUpdate(mouseEvent);
                    telestrationInterface.currentGlyph.draw();

                    telestrationInterface.zIndex = telestrationInterface.zIndex + 1;
                    telestrationInterface.currentGlyph = void(0);
                }

                function telestrationDraw(mouseEvent) {
                    if (!telestrationInterface.isEditEnabled) return;

                    if (isMousedown) {
                        telestrationUpdate(mouseEvent);
                        telestrationInterface.currentGlyph.draw();
                    }
                }

                function telestrationOutOfBounds() {
                }

                elem.bind('mousedown', telestrationStart);
                elem.bind('mouseup', telestrationEnd);
                elem.bind('mouseleave', telestrationOutOfBounds);
                elem.bind('mousemove', telestrationDraw);
            }
        };
    }
]);
