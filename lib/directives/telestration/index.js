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

                var isMousedown = false;

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
                    telestrationInterface.isEditEnabled = false;
                    telestrationInterface.telestrationContainerElement.removeClass('telestrations-active');
                };

                telestrationInterface.showTelestrationControlsMenu = function() {
                    elem[0].style.display = 'block';
                    scope.isMenuDisplayed = true;
                    telestrationInterface.isEditEnabled = true;
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
            var text = 'Enter text here';
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
                var CONE_OPENING_WIDTH = 100;
                var ARROW_SIDE_LENGTH = 10;
                var ARROW_HEIGHT = Math.sqrt(ARROW_SIDE_LENGTH * ARROW_SIDE_LENGTH + (ARROW_SIDE_LENGTH / 2) * (ARROW_SIDE_LENGTH / 2));

                var thisGlyph;

                var drawGlyph = function drawGlyph() {

                    var verticies = scope.glyphObject.getVerticies();
                    var startPoint = verticies[0];
                    var endPoint = verticies[1];
                    var offsetX;
                    var offsetY;
                    var pointDistance;
                    var svgDrawing = telestrationInterface.telestrationSVG;
                    var m;
                    var m1;
                    var dx1;
                    var dx2;
                    var dx;
                    var dy;
                    var quadrant;

                    if (startPoint && startPoint.length && endPoint && endPoint.length) {

                        offsetX = endPoint[0] - startPoint[0];
                        offsetY = endPoint[1] - startPoint[1];
                        pointDistance = Math.sqrt(offsetX * offsetX + offsetY * offsetY);

                        elem[0].style.left = startPoint[0] + 'px';
                        elem[0].style.top = startPoint[1] + 'px';
                        elem[0].style.width = Math.abs(offsetX) + 'px';
                        elem[0].style.height = Math.abs(offsetY) + 'px';

                        /*  Quadrants

                              3 | 4
                            ---------
                              2 | 1
                        */

                        if (offsetX < 0 && offsetY > 0) {
                            //Quadrant 2
                            quadrant = 2;
                            elem[0].style.left = (startPoint[0] - Math.abs(offsetX)) + 'px';
                        } else if (offsetX < 0 && offsetY < 0) {
                            //Quadrant 3
                            quadrant = 3;
                            elem[0].style.top = (startPoint[1] - Math.abs(offsetY)) + 'px';
                            elem[0].style.left = (startPoint[0] - Math.abs(offsetX)) + 'px';
                        } else if (offsetX > 0 && offsetY < 0) {
                            //Quadrant 4
                            quadrant = 4;
                            elem[0].style.top = (startPoint[1] - Math.abs(offsetY)) + 'px';
                        } else {
                            //Quadrant 1 (Default)
                            quadrant = 1;
                        }

                        switch (scope.glyphObject.getType()) {

                            case TELESTRATION_TYPES.ARROW:
                                //Calculate the arrowhead
                                m1 = ((endPoint[1] - startPoint[1]) / (endPoint[0] - startPoint[0]));
                                m = 0 - (1 / m1);
                                dx1 = 1 / Math.sqrt(m1 * m1 + 1);
                                dy1 = m1 / Math.sqrt(m1 * m1 + 1);
                                dx = 1 / Math.sqrt(m * m + 1);
                                dy = m / Math.sqrt(m * m + 1);
                                if (isNaN(dy)) dy = 1;
                                if (isNaN(dy1)) dy1 = 1;

                                //3 points (x,y) for the arrowhead
                                var arrowTip = [];
                                var arrowBase1 = [];
                                var arrowBase2 = [];
                                if (offsetX >= 0) {
                                    arrowTip[0] = endPoint[0] + ARROW_HEIGHT * dx1;
                                    arrowTip[1] = endPoint[1] + ARROW_HEIGHT * dy1;
                                } else {
                                    arrowTip[0] = endPoint[0] - ARROW_HEIGHT * dx1;
                                    arrowTip[1] = endPoint[1] - ARROW_HEIGHT * dy1;
                                }
                                arrowBase1[0] = endPoint[0] - (ARROW_SIDE_LENGTH / 2) * dx;
                                arrowBase1[1] = endPoint[1] - (ARROW_SIDE_LENGTH / 2) * dy;
                                arrowBase2[0] = endPoint[0] + (ARROW_SIDE_LENGTH / 2) * dx;
                                arrowBase2[1] = endPoint[1] + (ARROW_SIDE_LENGTH / 2) * dy;


                                thisGlyph = thisGlyph || svgDrawing.path();

                                thisGlyph.plot('M ' + startPoint[0] + ' ' + startPoint[1] + ' L ' + endPoint[0] + ' ' + endPoint[1] + ' M ' + arrowBase1[0] + ' ' + arrowBase1[1] + ' L ' + arrowTip[0] + ' ' + arrowTip[1] + ' ' + arrowBase2[0] + ' ' + arrowBase2[1] + ' z')
                                        .attr({
                                            fill: scope.glyphObject.getColor(),
                                            stroke: scope.glyphObject.getColor(),
                                            'stroke-width': BORDER_WIDTH
                                        });
                                break;

                            case TELESTRATION_TYPES.T_BAR:

                                //Calculate the T portion
                                m = 0 - (1 / ((endPoint[1] - startPoint[1]) / (endPoint[0] - startPoint[0])));
                                dx = 1 / Math.sqrt(m * m + 1);
                                dy = m / Math.sqrt(m * m + 1);
                                if (isNaN(dy)) dy = 1;

                                //2 points (x,y) for the second line in the T
                                var tPoint1 = [];
                                var tPoint2 = [];
                                tPoint1[0] = endPoint[0] - (T_BAR_LENGTH / 2) * dx;
                                tPoint1[1] = endPoint[1] - (T_BAR_LENGTH / 2) * dy;
                                tPoint2[0] = endPoint[0] + (T_BAR_LENGTH / 2) * dx;
                                tPoint2[1] = endPoint[1] + (T_BAR_LENGTH / 2) * dy;

                                thisGlyph = thisGlyph || svgDrawing.path();

                                thisGlyph.plot('M ' + startPoint[0] + ' ' + startPoint[1] + ' L ' + endPoint[0] + ' ' + endPoint[1] + ' M ' + tPoint1[0] + ' ' + tPoint1[1] + ' L ' + tPoint2[0] + ' ' + tPoint2[1])
                                        .attr({
                                            fill: 'none',
                                            stroke: scope.glyphObject.getColor(),
                                            'stroke-width': BORDER_WIDTH
                                        });
                                break;

                            case TELESTRATION_TYPES.CIRCLE:
                                thisGlyph = thisGlyph || svgDrawing.circle();

                                thisGlyph.radius(pointDistance / 2)
                                        .cx((startPoint[0] + endPoint[0]) / 2)
                                        .cy((startPoint[1] + endPoint[1]) / 2)
                                        .attr({
                                            fill: 'none',
                                            stroke: scope.glyphObject.getColor(),
                                            'stroke-width': BORDER_WIDTH
                                        });
                                break;

                            case TELESTRATION_TYPES.SHADOW_CIRCLE:
                                thisGlyph = thisGlyph || svgDrawing.circle();

                                thisGlyph.radius(pointDistance / 2)
                                        .cx((startPoint[0] + endPoint[0]) / 2)
                                        .cy((startPoint[1] + endPoint[1]) / 2)
                                        .attr({
                                            fill: 'none',
                                            stroke: scope.glyphObject.getColor(),
                                            'stroke-width': BORDER_WIDTH
                                        });
                                break;

                            case TELESTRATION_TYPES.CONE:
                                //Calculate the opening
                                m1 = ((endPoint[1] - startPoint[1]) / (endPoint[0] - startPoint[0]));
                                m = 0 - (1 / m1);
                                dx1 = 1 / Math.sqrt(m1 * m1 + 1);
                                dy1 = m1 / Math.sqrt(m1 * m1 + 1);
                                dx = 1 / Math.sqrt(m * m + 1);
                                dy = m / Math.sqrt(m * m + 1);
                                if (isNaN(dy)) dy = 1;
                                if (isNaN(dy1)) dy1 = 1;

                                //2 points (x,y) for the cone structure
                                var conePoint1 = [];
                                var conePoint2 = [];
                                conePoint1[0] = endPoint[0] - (CONE_OPENING_WIDTH / 2) * dx;
                                conePoint1[1] = endPoint[1] - (CONE_OPENING_WIDTH / 2) * dy;
                                conePoint2[0] = endPoint[0] + (CONE_OPENING_WIDTH / 2) * dx;
                                conePoint2[1] = endPoint[1] + (CONE_OPENING_WIDTH / 2) * dy;

                                //3 points for the bezier curve
                                var extensionPoint = [];
                                var curveReferencePoint1 = [];
                                var curveReferencePoint2 = [];
                                if (offsetX >= 0) {
                                    extensionPoint[0] = endPoint[0] + (CONE_OPENING_WIDTH / 5) * dx1;
                                    extensionPoint[1] = endPoint[1] + (CONE_OPENING_WIDTH / 5) * dy1;
                                } else {
                                    extensionPoint[0] = endPoint[0] - (CONE_OPENING_WIDTH / 5) * dx1;
                                    extensionPoint[1] = endPoint[1] - (CONE_OPENING_WIDTH / 5) * dy1;
                                }

                                curveReferencePoint1[0] = extensionPoint[0] - (CONE_OPENING_WIDTH / 4) * dx;
                                curveReferencePoint1[1] = extensionPoint[1] - (CONE_OPENING_WIDTH / 4) * dy;
                                curveReferencePoint2[0] = extensionPoint[0] + (CONE_OPENING_WIDTH / 4) * dx;
                                curveReferencePoint2[1] = extensionPoint[1] + (CONE_OPENING_WIDTH / 4) * dy;

                                thisGlyph = thisGlyph || svgDrawing.path();

                                thisGlyph.plot('M ' + startPoint[0] + ' ' + startPoint[1] + ' L ' + conePoint1[0] + ' ' + conePoint1[1] + ' C' + curveReferencePoint1[0] + ' ' + curveReferencePoint1[1] + ' ' + curveReferencePoint2[0] + ' ' + curveReferencePoint2[1] + ' ' + conePoint2[0] + ' ' + conePoint2[1] + ' z')
                                        .attr({
                                            fill: 'none',
                                            stroke: scope.glyphObject.getColor(),
                                            'stroke-width': BORDER_WIDTH
                                        });
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

                                thisGlyph = thisGlyph || svgDrawing.path();

                                thisGlyph.plot(pathData)
                                        .attr({
                                            fill: 'none',
                                            stroke: scope.glyphObject.getColor(),
                                            'stroke-width': BORDER_WIDTH
                                        });
                                break;
                        }
                    }
                };

                scope.glyphObject.registerDrawingFunction(drawGlyph);
            }
        };
    }
]);
