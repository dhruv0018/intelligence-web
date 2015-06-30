/* Constants */
var TO = '';
var ELEMENTS = 'E';

var templateUrl = 'field/player-dropdown.html';

/* Component resources */
var template = require('./template.html');

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * PlayerDropdown
 * @module PlayerDropdown
 */
var PlayerDropdown = angular.module('Field.PlayerDropdown', []);

/* Cache the template file */
PlayerDropdown.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put(templateUrl, template);
        $templateCache.put('field/player-dropdown-input.html', require('./player-dropdown-input.html'));
    }
]);

/**
 * PlayerDropdown directive.
 * @module PlayerDropdown
 * @name PlayerDropdown
 * @type {Directive}
 */
PlayerDropdown.directive('playerDropdownField', [
    function directive() {

        var PlayerDropdown = {

            restrict: TO += ELEMENTS,
            templateUrl: templateUrl,
            scope: {
                field: '='
            },
            controller: [
                '$scope',
                function($scope){
                    $scope.selectedValue = $scope.field.value;
                    console.log('the selected value is: ', $scope.selectedValue);
                    $scope.selectValue = (value) => {
                        $scope.field.currentValue = value;
                        let currentValue = $scope.field.currentValue;
                        console.log(currentValue.name);
                    };
                }
            ],
        };

        return PlayerDropdown;
    }
]);
