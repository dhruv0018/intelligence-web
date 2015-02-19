var Telestrations = angular.module('Telestrations');

Telestrations.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put('telestration-menu.html', require('./menu-template.html'));
    }
]);

Telestrations.directive('telestrationUndo', [
    'TelestrationInterface',
    function(telestrationInterface) {
        return {
            restrict: 'AE',
            require: '^telestrations',
            link: function(scope, elem, attr, telestrationsCtrl) {
                scope.getGlyphs = function() {
                    return (telestrationInterface.currentTelestration) ? telestrationInterface.currentTelestration.glyphs : [];
                };
                scope.undoGlyph = function() {
                    telestrationInterface.currentTelestration.glyphs.popGlyph();
                    telestrationsCtrl.save();
                };
            }
        };
    }
]);

Telestrations.directive('telestrationClear', [
    'TelestrationInterface',
    function(telestrationInterface) {
        return {
            restrict: 'AE',
            require: '^telestrations',
            link: function(scope, elem, attr, telestrationsCtrl) {
                scope.getGlyphs = function() {
                    return (telestrationInterface.currentTelestration) ? telestrationInterface.currentTelestration.glyphs : [];
                };
                scope.clearGlyphs = function() {
                    telestrationInterface.currentTelestration.glyphs.clearGlyphs();
                    telestrationsCtrl.save();
                };
            }
        };
    }
]);

//used for top level items in a dropdown menu
Telestrations.directive('menuItemState',[
    'dropdownToolStates', 'TelestrationInterface',
    function(toolStates, telestrationInterface) {

        function link(scope, elem) {
            scope.clickCount = 0;
            var optionsElement = elem[0].nextElementSibling;
            var clickHandler;

            switch (scope.dropdownType) {
                case 'color-picker':
                    clickHandler = colorDropdownHandler;
                    break;
                default:
                    clickHandler = normalDropdownHandler;
            }

            elem.on('click', clickHandler);

            function colorDropdownHandler() {
                optionsElement.className = 'active';
            }

            function normalDropdownHandler() {
                scope.clickCount = scope.clickCount + 1;
                //every second click open the menu
                if (scope.clickCount % 2 === 0) {
                    optionsElement.className = 'active';
                } else {
                    //on the odd clicks
                    var choiceMade = scope.dropdownState;
                    scope.selectedGlyphType = scope.dropdownState;
                }

                scope.$apply();
            }

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
                selectedGlyphType: '=?',
                selectedGlyphColor: '=?',
                //exhibits different behavior if it's a normal dropdown or color picker
                dropdownType: '@?'
            },
            link: link
        };
    }
]);


Telestrations.directive('telestrationMenuItem', [
    'TelestrationInterface',
    function(telestrationInterface) {
        return {
            restrict: 'AE',
            scope: {
                type: '@',
                //if the item belongs to a dropdown - it sets the current state of the dropdown
                dropdownState: '=?',
                color: '@?'
            },
            link: function(scope, elem, attr) {
                var clickHandler;

                clickHandler = (scope.type) ? glyphSelection : angular.noop;
                if (scope.color) clickHandler = colorSelection;


                function glyphSelection() {
                    var selectedType = Number.parseInt(scope.type, 10); //fix since angular converts it to a string
                    telestrationInterface.selectedGlyphType = selectedType;
                    scope.dropdownState = selectedType;
                }

                function colorSelection() {
                    scope.dropdownState = scope.color;
                    telestrationInterface.selectedGlyphColor = scope.dropdownState;
                }

                elem.on('click', function($event) {
                    $event.stopImmediatePropagation();
                    clickHandler();
                    scope.$apply();
                });
            }
        };
    }
]);

Telestrations.directive('telestrationMenu', [
    '$timeout', 'VG_STATES', 'VG_EVENTS', 'TelestrationInterface', 'TELESTRATION_TYPES', 'TELESTRATION_COLORS', 'dropdownToolStates',
    function($timeout, VG_STATES, VG_EVENTS, telestrationInterface, TELESTRATION_TYPES, TELESTRATION_COLORS, toolStates) {
        return {
            restrict: 'E',
            templateUrl: 'telestration-menu.html',
            require: ['telestrationMenu', '^telestrationMenuButton'],
            controller: [
                '$scope', '$element',
                function($scope, $element) {

                    var self = this;

                    self.hide = function hideTelestrationControlsMenu() {
                        $element[0].style.display = 'none';
                        $scope.isMenuDisplayed = false;
                        telestrationInterface.telestrationContainerElement.removeClass('telestrations-active');
                    };

                    self.show = function showTelestrationControlsMenu() {
                        $element[0].style.display = 'block';
                        $scope.isMenuDisplayed = true;
                        telestrationInterface.telestrationContainerElement.addClass('telestrations-active');
                    };

                    self.toggle = function toggleTelestrationControlsMenu() {
                        if ($scope.isMenuDisplayed) {
                            self.hide();
                        } else {
                            self.show();
                        }
                    };

                }
            ],
            link: function(scope, elem, attr, ctrls) {

                /* Initialize */
                var menuCtrl = ctrls[0]; // grab the instance of the menuCtrl controller
                var parentMenu = ctrls[1];

                parentMenu.$registerMenuControl(menuCtrl);

                scope.telestrationInterface = telestrationInterface;
                scope.TELESTRATION_TYPES = TELESTRATION_TYPES;

                // A way to keep track of the current selected tool in dropdown menus
                scope.dropdownToolStates = toolStates;
                scope.colors = TELESTRATION_COLORS;

                // Hide initially
                elem[0].style.display = 'none';
                scope.isMenuDisplayed = false;

            }
        };
    }
]);

Telestrations.service('dropdownToolStates', [
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
