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

Telestration.service('TelestrationInterface', function() {
    return {
        /*
        hideTelestrationControlsMenu(),
        showTelestrationControlsMenu(),
        toggleTelestrationControlsMenu()
        */

        selectedMenuItem: undefined
    };
});

Telestration.directive('telestration', [
    '$timeout', 'VG_STATES', 'VG_EVENTS',
    function($timeout, VG_STATES, VG_EVENTS) {
        return {
            restrict: 'A',
            require: '^videogular',
            link: function(scope, elem, attr, API) {
            }
        };
    }
]);

Telestration.directive('telestrationMenuButton', [
    '$timeout', 'VG_STATES', 'VG_EVENTS', 'TelestrationInterface',
    function($timeout, VG_STATES, VG_EVENTS, telestrationInterface) {
        return {
            restrict: 'AE',
            require: '^videogular',
            link: function(scope, elem, attr, API) {},
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
            require: '^videogular',
            scope: {
                type: '@'
            },
            link: function(scope, elem, attr, API) {

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
            require: '^videogular',
            templateUrl: 'telestration-menu.html',
            controller: [
                '$scope',
                function($scope) {
                    $scope.TELESTRATION_TYPES = TELESTRATION_TYPES;
                }
            ],
            link: function(scope, elem, attr, API) {

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

Telestration.directive('glyph', [
    'VG_STATES', 'VG_EVENTS',
    function(VG_STATES, VG_EVENTS) {
        return {
            restrict: 'E',
            require: '^videogular',
            scope: {
                type: '='
            },
            link: function(scope, elem, attr, API) {
            }
        };
    }
]);
