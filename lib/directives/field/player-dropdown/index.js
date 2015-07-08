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
                field: '=',
                event: '='
            },
            controller: PlayerFieldController
        };

        return PlayerDropdown;
    }
]);

class PlayerFieldController {
    constructor(scope) {
        this.scope = scope;
        this.scope.isSelecting = false;
        this.scope.selectedValue = {
            name: ''
        };
        this.scope.backupValue = {};
        this.initialize();
    }
    initialize() {
        this.scope.selectValue = (value) => {
            console.log('on select');
            this.scope.field.currentValue = value;
            this.scope.isSelecting = false;
        };

        this.scope.onBlur = () => {
            console.log('on blur');
            this.scope.isSelecting = false;
            let currentValue = this.scope.field.currentValue;
            if (currentValue) {
                let name = angular.copy(currentValue.name);
                this.scope.selectedValue = {name};
            } else {
                //restore what what previously there
                this.scope.field.currentValue = this.scope.backupValue;
            }
        };

        this.scope.onFocus = () => {
            console.log('on focus');
            this.scope.isSelecting = true;
            let currentValue = this.scope.field.currentValue;
            if (currentValue) {
                this.scope.backupValue = currentValue;
            }
            this.scope.field.reset();
        };

        this.scope.onChange = () => {
        };

        this.shouldFocus = () => {
            return false;
        };
    }

}
PlayerFieldController.$inject = ['$scope'];
