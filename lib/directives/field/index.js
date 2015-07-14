import PlayerDropdownComponent from './player-dropdown/index.js';
import TeamDropdownComponent from './team-dropdown/index.js';
import FieldDefinition from './definition';

import dropdownTemplate from './dropdown-input.html.js';
/**
 * Field
 * @module Field
 */
var Field = window.angular.module('Field', [
    'Field.PlayerDropdown',
    'Field.TeamDropdown',
    'ui.router',
    'ui.bootstrap'
]);

Field.run([
    '$templateCache',
    function run($templateCache) {
        let dropdownTemplateUrl = 'field/dropdown-input.html';
        $templateCache.put(dropdownTemplateUrl, dropdownTemplate);
    }
]);

let definition = new FieldDefinition();
Field.directive('krossoverField', () => definition);

export default Field;
