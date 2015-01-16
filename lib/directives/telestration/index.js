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
    '$timeout', 'VG_STATES', 'VG_EVENTS', 'TelestrationInterface',
    function($timeout, VG_STATES, VG_EVENTS, telestrationInterface) {
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
            var text = '';
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
    'TELESTRATION_TYPES',
    function(TELESTRATION_TYPES) {
        return {
            restrict: 'E',
            scope: {
                glyphObject: '='
            },
            link: function(scope, elem, attr) {
                var BORDER_WIDTH = 2;

                elem[0].style.zIndex = scope.glyphObject.getZIndex();
                elem[0].style.backgroundColor = '#c9c9ff';

                var drawGlyph = function drawGlyph() {

                    var verticies = scope.glyphObject.getVerticies();
                    var startPoint = verticies[0];
                    var endPoint = verticies[1];
                    var quadrant = 2;
                    var pointDistance;

                    if (startPoint && startPoint.length && endPoint && endPoint.length) {
                        var offsetX = endPoint[0] - startPoint[0];
                        var offsetY = endPoint[1] - startPoint[1];
                        pointDistance = Math.sqrt(offsetX * offsetX + offsetY * offsetY);

                        elem[0].style.left = startPoint[0] + 'px';
                        elem[0].style.top = startPoint[1] + 'px';

                        /*  Quadrants

                              3 | 4
                            ---------
                              2 | 1
                        */

                        if (offsetX < 0 && offsetY > 0) {
                            //Quadrant 2
                            quadrant = 2;
                            elem[0].style.left = (startPoint[0] - pointDistance) + 'px';
                        } else if (offsetX < 0 && offsetY < 0) {
                            //Quadrant 3
                            quadrant = 3;
                            elem[0].style.top = (startPoint[1] - pointDistance) + 'px';
                            elem[0].style.left = (startPoint[0] - pointDistance) + 'px';
                        } else if (offsetX > 0 && offsetY < 0) {
                            //Quadrant 4
                            quadrant = 4;
                            elem[0].style.top = (startPoint[1] - pointDistance) + 'px';
                        } else {
                            //Quadrant 1 (Default)
                            quadrant = 1;
                        }
                    }

                    switch (scope.glyphObject.getType()) {
                        case TELESTRATION_TYPES.ARROW:
                        case TELESTRATION_TYPES.T_BAR:
                        case TELESTRATION_TYPES.CIRCLE:
                            if (startPoint && startPoint.length && endPoint && endPoint.length) {
                                elem[0].innerHTML = '';
                                var circleSVG = angular.element('<svg height="' + (pointDistance + BORDER_WIDTH * 2) + '" width="' + (pointDistance + BORDER_WIDTH * 2) + '">' +
                                  '<circle cx="' + (pointDistance / 2 + BORDER_WIDTH) + '" cy="' + (pointDistance / 2 + BORDER_WIDTH) + '" r="' + (pointDistance / 2) + '" stroke="black" stroke-width="' + BORDER_WIDTH + '" fill="red" />' +
                                '</svg>');
                                elem.append(circleSVG);
                            }
                            break;
                        case TELESTRATION_TYPES.SHADOW_CIRCLE:
                        case TELESTRATION_TYPES.CONE:
                        case TELESTRATION_TYPES.TEXT_TOOL:
                            break;
                    }
                };

                scope.glyphObject.registerDrawingFunction(drawGlyph);
            }
        };
    }
]);
