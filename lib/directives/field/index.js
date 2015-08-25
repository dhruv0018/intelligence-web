//components
import GapComponent from './gap';
import YardComponent from './yard';
import ArenaComponent from './arena';
import DropdownComponent from './dropdown';
import FormationComponent from './formation';
import PassingZoneComponent from './passing-zone';
import TeamDropdownComponent from './team-dropdown';
import PlayerDropdownComponent from './player-dropdown';
import TeamPlayerDropdownComponent from './team-player-dropdown';
import StaticComponent from './static';

//resources
import FieldDefinition from './directive';
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
    'Field.FormationDropdown',
    'Field.PassingZoneDropdown',
    'Field.TeamPlayerDropdown',
    'Field.YardDropdown',
    'Field.Dropdown',
    'Field.Static',
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
