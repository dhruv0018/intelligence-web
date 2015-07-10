/* Constants */
var TO = '';
var ELEMENTS = 'E';

var templateUrl = 'field/player-dropdown.html';

/* Component resources */
import template from './template.html.js';
import dropdownTemplate from './player-dropdown-input.html.js';
import FieldController from '../controller';
import link from '../link';

console.log('from the player', FieldController);

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
        $templateCache.put('field/player-dropdown-input.html', dropdownTemplate);
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
            link,
            scope: {
                field: '=',
                event: '='
            },
            controller: PlayerFieldController
        };

        return PlayerDropdown;
    }
]);

class PlayerFieldController extends FieldController {
    constructor(scope) {
        super(scope);
    }
}
PlayerFieldController.$inject = ['$scope'];

export default PlayerDropdown;
