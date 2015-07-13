import PlayerDropdownComponent from './player-dropdown/index.js';
import TeamDropdownComponent from './team-dropdown/index.js';

/* Fetch angular from the browser scope */
var angular = window.angular;

let restrict = 'E';
let scope = {field: '=', event: '='};
let templateUrl = 'field/template.html';
let dropdownTemplateUrl = 'field/dropdown-input.html';

/* Component resources */
import link from './link.js';
import template from './template.html.js';
import controller from './controller.js';
import dropdownTemplate from './dropdown-input.html.js';

let definition = {
    restrict,
    link,
    controller,
    templateUrl,
    scope
};

/**
 * Field
 * @module Field
 */
var Field = angular.module('Field', [
    'Field.PlayerDropdown',
    'Field.TeamDropdown',
    'ui.router',
    'ui.bootstrap'
]);

Field.run([
    '$templateCache',
    function run($templateCache) {
        $templateCache.put(templateUrl, template);
        $templateCache.put(dropdownTemplateUrl, dropdownTemplate);
    }
]);

Field.directive('krossoverField', [()=> definition]);

export default Field;
