/* Cache the template file */
var Telestration = angular.module('Telestration', []);

Telestration.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put('telestration-menu.html', require('./menu-template.html'));
        $templateCache.put('telestration-menu-item.html', require('./menu-item-template.html'));
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

                var isMousedown = false;

                var containerX = function() { return elem[0].getBoundingClientRect().left; };
                var containerY = function() { return elem[0].getBoundingClientRect().top; };

                telestrationInterface.telestrationContainerElement = elem;
                scope.telestrationInterface = telestrationInterface;

                function telestrationUpdate(mouseEvent) {
                    var updatePoint = [mouseEvent.x - containerX(), mouseEvent.y - containerY()];
                    telestrationInterface.currentGlyph.updateGlyph(updatePoint);
                }

                function telestrationStart(mouseEvent) {
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
                    isMousedown = false;

                    telestrationUpdate(mouseEvent);
                    telestrationInterface.currentGlyph.draw();

                    telestrationInterface.zIndex = telestrationInterface.zIndex + 1;
                    telestrationInterface.currentGlyph = void(0);
                }

                function telestrationDraw(mouseEvent) {
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

Telestration.directive('telestrationMenuButton', [
    '$timeout', 'VG_STATES', 'VG_EVENTS', 'TelestrationInterface',
    function($timeout, VG_STATES, VG_EVENTS, telestrationInterface) {
        return {
            restrict: 'AE',
            link: function(scope, elem, attr) {
                scope.toggleControlsMenu = function() {
                    if (telestrationInterface && telestrationInterface.toggleTelestrationControlsMenu) {
                        telestrationInterface.toggleTelestrationControlsMenu();
                    }
                };
            }
        };
    }
]);

Telestration.directive('telestrationMenuItem', [
    'TelestrationInterface',
    function(telestrationInterface) {
        return {
            restrict: 'AE',
            scope: {
                type: '@'
            },
            link: function(scope, elem, attr) {

                elem.on('click', function() {
                    telestrationInterface.selectedGlyphType = scope.type;
                    scope.$apply();
                });
            }
        };
    }
]);

Telestration.directive('telestrationMenu', [
    '$timeout', 'VG_STATES', 'VG_EVENTS', 'TelestrationInterface', 'TELESTRATION_TYPES',
    function($timeout, VG_STATES, VG_EVENTS, telestrationInterface, TELESTRATION_TYPES) {
        return {
            restrict: 'E',
            templateUrl: 'telestration-menu.html',
            controller: [
                '$scope',
                function($scope) {
                    $scope.telestrationInterface = telestrationInterface;
                    $scope.TELESTRATION_TYPES = TELESTRATION_TYPES;
                }
            ],
            link: function(scope, elem, attr) {

                elem[0].style.display = 'none';
                scope.isMenuDisplayed = false;

                telestrationInterface.hideTelestrationControlsMenu = function() {
                    elem[0].style.display = 'none';
                    scope.isMenuDisplayed = false;
                    telestrationInterface.telestrationContainerElement.removeClass('telestrations-active');
                };

                telestrationInterface.showTelestrationControlsMenu = function() {
                    elem[0].style.display = 'block';
                    scope.isMenuDisplayed = true;
                    telestrationInterface.telestrationContainerElement.addClass('telestrations-active');
                };

                telestrationInterface.toggleTelestrationControlsMenu = function() {
                    if (scope.isMenuDisplayed) {
                        telestrationInterface.hideTelestrationControlsMenu();
                    } else {
                        telestrationInterface.showTelestrationControlsMenu();
                    }
                };
            }
        };
    }
]);

Telestration.factory('GlyphFactory', [
    'TELESTRATION_TYPES',
    function(TELESTRATION_TYPES) {
        return function Glyph(glyphType, glyphZIndex) {

            var type = glyphType || TELESTRATION_TYPES.FREEHAND;
            var text = 'A text file (sometimes spelled "textfile": an old alternative name is "flatfile") is a kind of computer file that is structured as a sequence of lines of electronic text. A text file exists within a computer file system.';
            var color = '#FFFF00';
            var zIndex = glyphZIndex;
            var verticies = [];
            var drawingFunction;

            this.draw = function() {
                if (drawingFunction && typeof drawingFunction === 'function') {
                    drawingFunction();
                }
            };

            this.addVertex = function(newVertex) {
                verticies.push(newVertex);
            };

            this.updateGlyph = function(newVertex) {
                switch (type) {
                    case TELESTRATION_TYPES.ARROW:
                    case TELESTRATION_TYPES.T_BAR:
                    case TELESTRATION_TYPES.CIRCLE:
                    case TELESTRATION_TYPES.SHADOW_CIRCLE:
                    case TELESTRATION_TYPES.CONE:
                    case TELESTRATION_TYPES.TEXT_TOOL:
                        verticies[1] = newVertex;
                        break;
                    case TELESTRATION_TYPES.FREEHAND:
                        verticies.push(newVertex);
                        break;
                }
            };

            this.getVerticies = function() {
                return verticies;
            };

            this.setType = function(newType) {
                type = newType;
            };

            this.getType = function() {
                return type;
            };

            this.getColor = function() {
                return color;
            };

            this.getText = function() {
                return text;
            };

            this.getZIndex = function() {
                return zIndex;
            };

            this.toString = function() {
                return type + ': ' + JSON.stringify(verticies);
            };

            this.registerDrawingFunction = function(drawingFunctionToRegister) {
                drawingFunction = drawingFunctionToRegister;
            };

        };
    }
]);

Telestration.directive('glyph', [
    'TELESTRATION_TYPES', 'TelestrationInterface', '$location',
    function(TELESTRATION_TYPES, telestrationInterface, $location) {
        return {
            restrict: 'E',
            scope: {
                glyphObject: '='
            },
            link: function(scope, elem, attr) {

                var BORDER_WIDTH = 8;
                var T_BAR_LENGTH = 100;

                elem[0].style.zIndex = scope.glyphObject.getZIndex();
                elem[0].style.width = telestrationInterface.telestrationContainerElement[0].getBoundingClientRect().width + 'px';
                elem[0].style.height = telestrationInterface.telestrationContainerElement[0].getBoundingClientRect().height + 'px';

                var drawGlyph = function drawGlyph() {

                    var verticies = scope.glyphObject.getVerticies();
                    var startPoint = verticies[0];
                    var endPoint = verticies[1];
                    var updatedSVGShape;
                    var offsetX;
                    var offsetY;
                    var pointDistance;
                    var containerBox = telestrationInterface.telestrationContainerElement[0].getBoundingClientRect();

                    if (startPoint && startPoint.length && endPoint && endPoint.length) {

                        offsetX = endPoint[0] - startPoint[0];
                        offsetY = endPoint[1] - startPoint[1];
                        pointDistance = Math.sqrt(offsetX * offsetX + offsetY * offsetY);

                        elem[0].innerHTML = '';

                        switch (scope.glyphObject.getType()) {

                            case TELESTRATION_TYPES.ARROW:
                                //TODO: Might be able to extract this def into another location, so that there is not one per arrow
                                var arrowHeadDef = '<defs>' +
                                    '<marker id="TriangleArrowHeadSVG" viewBox="0 0 10 10" refX="0" refY="5" markerWidth="4" markerHeight="4" markerUnits="strokeWidth" orient="auto" fill="' + scope.glyphObject.getColor() + '">' +
                                        '<path d="M 0 0 L 10 5 L 0 10 z" />' +
                                    '</marker>' +
                                '</defs>';
                                updatedSVGShape = angular.element('<svg height="' + containerBox.height + '" width="' + containerBox.width + '">' +
                                    arrowHeadDef +
                                    '<path d="M ' + startPoint[0] + ' ' + startPoint[1] + ' L ' + endPoint[0] + ' ' + endPoint[1] + ' " stroke="' + scope.glyphObject.getColor() + '" stroke-width="' + BORDER_WIDTH + '" marker-end="url(' + $location.absUrl() + '#TriangleArrowHeadSVG' + ')" fill="none" />' +
                                '</svg>');
                                break;

                            case TELESTRATION_TYPES.T_BAR:

                                //Calculate the T portion
                                var m = 0 - (1 / ((endPoint[1] - startPoint[1]) / (endPoint[0] - startPoint[0])));
                                var dx = 1 / Math.sqrt(m * m + 1);
                                var dy = m / Math.sqrt(m * m + 1);
                                if (isNaN(dy)) dy = 1;

                                //2 points (x,y) for the second line in the T
                                var tPoint1 = [];
                                var tPoint2 = [];
                                tPoint1[0] = endPoint[0] - (T_BAR_LENGTH / 2) * dx;
                                tPoint1[1] = endPoint[1] - (T_BAR_LENGTH / 2) * dy;
                                tPoint2[0] = endPoint[0] + (T_BAR_LENGTH / 2) * dx;
                                tPoint2[1] = endPoint[1] + (T_BAR_LENGTH / 2) * dy;

                                updatedSVGShape = angular.element('<svg height="' + containerBox.height + '" width="' + containerBox.width + '">' +
                                    '<path d="M ' + startPoint[0] + ' ' + startPoint[1] + ' L ' + endPoint[0] + ' ' + endPoint[1] + ' M ' + tPoint1[0] + ' ' + tPoint1[1] + ' L ' + tPoint2[0] + ' ' + tPoint2[1] + '" stroke="' + scope.glyphObject.getColor() + '" stroke-width="' + BORDER_WIDTH + '" fill="none" />' +
                                '</svg>');
                                break;

                            case TELESTRATION_TYPES.CIRCLE:
                                updatedSVGShape = angular.element('<svg height="' + containerBox.height + '" width="' + containerBox.width + '">' +
                                  '<circle cx="' + ((startPoint[0] + endPoint[0]) / 2) + '" cy="' + ((startPoint[1] + endPoint[1]) / 2) + '" r="' + (pointDistance / 2) + '" stroke="' + scope.glyphObject.getColor() + '" stroke-width="' + BORDER_WIDTH + '" fill="none"/>' +
                                '</svg>');
                                break;

                            case TELESTRATION_TYPES.SHADOW_CIRCLE:
                                updatedSVGShape = angular.element('<svg height="' + containerBox.height + '" width="' + containerBox.width + '">' +
                                  '<circle cx="' + ((startPoint[0] + endPoint[0]) / 2) + '" cy="' + ((startPoint[1] + endPoint[1]) / 2) + '" r="' + (pointDistance / 2) + '" stroke="' + scope.glyphObject.getColor() + '" stroke-width="' + BORDER_WIDTH + '" fill="none"/>' +
                                '</svg>');
                                break;

                            case TELESTRATION_TYPES.CONE:
                                break;

                            case TELESTRATION_TYPES.TEXT_TOOL:
                                //TODO: make background color whiter version of border color?
                                updatedSVGShape = angular.element('<div style="position:relative;display:inline-block;overflow:hidden;background-color:#ffffcc;padding:8px;line-height:14px;letter-spacing:0px;font-size:16px;left:' + startPoint[0] + 'px;top:' + startPoint[1] + 'px;height:' + offsetY + 'px;width:' + offsetX + 'px;border:solid ' + BORDER_WIDTH + 'px ' + scope.glyphObject.getColor() + ';">' +
                                    '<span>' + scope.glyphObject.getText() + '</span>' +
                                '</div>');
                                break;
                            case TELESTRATION_TYPES.FREEHAND:
                                var pathData = 'M ' + startPoint[0] + ' ' + startPoint[1] + ' L';
                                for (var i = 1; i < verticies.length; i++) {
                                    pathData += ' ' + verticies[i][0] + ' ' + verticies[i][1];
                                }
                                updatedSVGShape = angular.element('<svg height="' + containerBox.height + '" width="' + containerBox.width + '">' +
                                    '<path d="' + pathData + '" stroke="' + scope.glyphObject.getColor() + '" stroke-width="' + BORDER_WIDTH + '" fill="none" />' +
                                '</svg>');
                                break;
                        }

                        if (updatedSVGShape) elem.append(updatedSVGShape);
                    }
                };

                scope.glyphObject.registerDrawingFunction(drawGlyph);
            }
        };
    }
]);
