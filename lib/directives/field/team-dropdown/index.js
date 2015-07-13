/* Component resources */
import template from '../template.html.js';
import dropdownTemplate from '../dropdown-input.html.js';
import FieldController from '../controller';
import link from '../link';

/* Fetch angular from the browser scope */
var angular = window.angular;

let restrict = 'E';
let scope = {field: '=', event: '='};
let templateUrl = 'field/template.html';

let definition = {
    restrict,
    link,
    controller: TeamFieldController,
    templateUrl,
    scope
};


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
TeamDropdown.directive('teamDropdownField', [ ()=> definition ]);

class TeamFieldController extends FieldController {
    constructor(scope) {
        super(scope);
    }
}
TeamFieldController.$inject = ['$scope'];

export default TeamDropdown;
