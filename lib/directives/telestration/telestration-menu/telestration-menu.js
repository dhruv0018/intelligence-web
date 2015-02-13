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

//used for top level items in a dropdown menu
TelestrationMenu.directive('menuItemState',[
    'dropdownToolStates', 'TelestrationInterface',
    function(toolStates, telestrationInterface) {

        function link(scope, elem) {
            scope.clickCount = 0;

            var optionsElement = elem[0].nextElementSibling;

            elem.on('click', function() {
                scope.clickCount = scope.clickCount + 1;
                //every second click open the menu
                if (scope.clickCount % 2 === 0) {
                    optionsElement.className = 'active';
                } else {
                    //on the first click
                    var choiceMade = scope.dropdownState;
                    var isColor = typeof scope.dropdownState === 'string' && choiceMade[0] === '#';
                    if (isColor) {
                        telestrationInterface.selectedGlyphColor = choiceMade;
                    } else {
                        scope.selectedGlyphType = choiceMade;
                    }
                }

                scope.$apply();
            });

            scope.$watch('selectedGlyphType', function() {
                optionsElement.className = '';
            });

            scope.$watch('dropdownState', function() {
                optionsElement.className = '';
            });
        }

        return {
            restrict: 'AE',
            scope: {
                //the dropdown this item controls
                dropdownState: '=?',
                selectedGlyphType: '=?'
            },
            link: link
        };
    }
]);


TelestrationMenu.directive('telestrationMenuItem', [
    'TelestrationInterface',
    function(telestrationInterface) {
        return {
            restrict: 'AE',
            scope: {
                type: '@?',
                //if the item belongs to a dropdown - it sets the current state of the dropdown
                dropdownState: '=?',
                color: '@?'
            },
            link: function(scope, elem, attr) {

                elem.on('click', function() {
                    var selectedType = Number.parseInt(scope.type, 10); //fix since agular converts it to a string
                    telestrationInterface.selectedGlyphType = selectedType;

                    if (scope.dropdownState) {
                        scope.dropdownState = (scope.type) ? selectedType : scope.color;
                    }

                    scope.$apply();
                });
            }
        };
    }
]);

TelestrationMenu.directive('telestrationMenu', [
    '$timeout', 'VG_STATES', 'VG_EVENTS', 'TelestrationInterface', 'TELESTRATION_TYPES', 'TELESTRATION_COLORS', 'dropdownToolStates',
    function($timeout, VG_STATES, VG_EVENTS, telestrationInterface, TELESTRATION_TYPES, TELESTRATION_COLORS, toolStates) {
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
                //a way to keep track of the current selected tool in dropdown menus
                scope.dropdownToolStates = toolStates;
                scope.colors = TELESTRATION_COLORS;

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

TelestrationMenu.service('dropdownToolStates', [
    'TELESTRATION_TYPES', 'TELESTRATION_COLORS',
    function(TELESTRATION_TYPES, TELESTRATION_COLORS) {
        var toolStates = {
            'FREEHAND': TELESTRATION_TYPES.FREEHAND_SOLID,
            'T_BAR': TELESTRATION_TYPES.T_BAR_SOLID,
            'ARROW': TELESTRATION_TYPES.ARROW_SOLID,
            'COLOR_PICKER': TELESTRATION_COLORS.PRIMARY.hex
        };
        return toolStates;
    }
]);
