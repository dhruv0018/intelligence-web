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

var Vertex = function Vertex(x, y) {
    this.x = x;
    this.y = y;
};

Telestration.value('TELESTRATION_TYPES', TELESTRATION_TYPES);

Telestration.service('TelestrationInterface', function() {
    return {
        /*
        hideTelestrationControlsMenu(),
        showTelestrationControlsMenu(),
        toggleTelestrationControlsMenu()
        */

        selectedMenuItem: undefined,
        currentZIndex: 1,
        currentGlyph: undefined,
        glyphs: [],
        telestrationsEnabled: false
    };
});

Telestration.directive('telestration', [
    '$timeout', 'VG_STATES', 'VG_EVENTS',
    function($timeout, VG_STATES, VG_EVENTS) {
        return {
            restrict: 'A',
            require: '^videogular',
            link: function(scope, elem, attr, API) {

                var startPoint;
                var endPoint;

                function telestrationStart(mouseEvent) {
                    document.createElement('glyph');

                    startPoint = [mouseEvent.x, mouseEvent.y];
                }

                function telestrationEnd(mouseEvent) {
                    endPoint = [mouseEvent.x, mouseEvent.y];
                }

                function telestrationDraw() {
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
            controller: [
                '$scope',
                function($scope) {
                    $scope.toggleControlsMenu = function() {
                        if (telestrationInterface && telestrationInterface.toggleTelestrationControlsMenu) {
                            telestrationInterface.toggleTelestrationControlsMenu();
                        }
                    };
                }
            ]
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
                    telestrationInterface.selectedMenuItem = scope.type;
                });
            }
        };
    }
]);

Telestration.directive('telestrationMenu', [
    '$timeout', 'VG_STATES', 'VG_EVENTS', 'TelestrationInterface',
    function($timeout, VG_STATES, VG_EVENTS, telestrationInterface) {
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
                };

                telestrationInterface.showTelestrationControlsMenu = function() {
                    elem[0].style.display = 'block';
                    scope.isMenuDisplayed = true;
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

Telestration.factory('GlyphFactory', function() {
    return function Glyph(type, zIndex) {

        this.type = type || TELESTRATION_TYPES.FREEHAND;
        this.verticies = [];
        this.text = '';
        this.zIndex = zIndex;

    };
});

Telestration.directive('glyph', [
    'VG_STATES', 'VG_EVENTS',
    function(VG_STATES, VG_EVENTS) {
        return {
            restrict: 'E',
            scope: {
                type: '='
            },
            link: function(scope, elem, attr) {
                console.log('glyph link');
            }
        };
    }
]);
