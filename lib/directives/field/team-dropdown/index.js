/* Constants */
let restrict = 'E';
let scope = {field: '=', event: '='};

var templateUrl = 'field/team-dropdown.html';

/* Component resources */
import template from '../template.html.js';
import dropdownTemplate from '../dropdown-input.html.js';
import FieldController from '../controller';
import link from '../link';

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * TeamDropdown
 * @module TeamDropdown
 */
var TeamDropdown = angular.module('Field.TeamDropdown', []);

/* Cache the template file */
TeamDropdown.run([
    '$templateCache',
    function run($templateCache) {
        $templateCache.put(templateUrl, template);
    }
]);

/**
 * TeamDropdown directive.
 * @module TeamDropdown
 * @name TeamDropdown
 * @type {Directive}
 */
TeamDropdown.directive('teamDropdownField', [
    function directive() {

        var TeamDropdown = {
            restrict,
            templateUrl,
            link,
            scope,
            controller: TeamFieldController
        };

        return TeamDropdown;
    }
]);

class TeamFieldController extends FieldController {
    constructor(scope) {
        super(scope);
    }
}
TeamFieldController.$inject = ['$scope'];

export default TeamDropdown;
