//components
import GapComponent from './gap/index.js';
import YardComponent from './yard/index.js';
import TextComponent from './text/index.js';
import ArenaComponent from './arena/index.js';
import DropdownComponent from './dropdown/index.js';
import FormationComponent from './formation/index.js';
import PassingZoneComponent from './passing-zone/index.js';
import TeamDropdownComponent from './team-dropdown/index.js';
import PlayerDropdownComponent from './player-dropdown/index.js';
import TeamPlayerDropdownComponent from './team-player-dropdown/index.js';

//resources
import FieldDefinition from './definition';
import FieldTemplate from './template.js';
let template = new FieldTemplate();

/**
 * Field
 * @module Field
 */
var Field = window.angular.module('Field', [
    'Field.PlayerDropdown',
    'Field.TeamDropdown',
    'Field.GapDropdown',
    'Field.TextDropdown',
    'Field.FormationDropdown',
    'Field.PassingZoneDropdown',
    'Field.TeamPlayerDropdown',
    'Field.YardDropdown',
    'Field.Dropdown',
    'Field.Arena',
    'ui.bootstrap',
    'ui.router'
]);

Field.run([
    '$templateCache',
    function run($templateCache) {
        $templateCache.put(template.dropdownTemplateUrl, template.dropdownTemplate);
    }
]);

let definition = new FieldDefinition();
Field.directive('krossoverField', () => definition);

export default Field;
