var TelestrationMenu = angular.module('TelestrationMenu', []);

TelestrationMenu.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put('telestration-menu.html', require('./menu-template.html'));
    }
]);

TelestrationMenu.directive('telestrationMenuButton', [
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

TelestrationMenu.directive('telestrationUndo', [
    'TelestrationInterface',
    function(telestrationInterface) {
        return {
            restrict: 'AE',
            link: function(scope, elem, attr) {
                scope.glyphs = telestrationInterface.getGlyphs();
                scope.undoGlyph = function() {
                    telestrationInterface.popGlyph();
                };
            }
        };
    }
]);

TelestrationMenu.directive('telestrationClear', [
    'TelestrationInterface',
    function(telestrationInterface) {
        return {
            restrict: 'AE',
            link: function(scope, elem, attr) {
                scope.glyphs = telestrationInterface.getGlyphs();
                scope.clearGlyphs = telestrationInterface.clearGlyphs;
            }
        };
    }
]);

TelestrationMenu.directive('telestrationMenuItem', [
    'TelestrationInterface',
    function(telestrationInterface) {
        return {
            restrict: 'AE',
            scope: {
                type: '@?'
            },
            link: function(scope, elem, attr) {

                elem.on('click', function() {
                    telestrationInterface.selectedGlyphType = Number.parseInt(scope.type, 10); //fix since agular converts it to a string
                    scope.$apply();
                });
            }
        };
    }
]);

TelestrationMenu.directive('telestrationMenu', [
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
