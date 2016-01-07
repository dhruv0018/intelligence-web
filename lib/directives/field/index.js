//components
import GapField from './gap';
import YardField from './yard';
import ArenaField from './arena';
import DropdownField from './dropdown';
import PeriodField from './period';
import FormationField from './formation';
import PassingZoneField from './passing-zone';
import TeamField from './team';
import PlayerField from './player';
import TeamPlayerField from './team-player';
import StaticField from './static';

//resources
import FieldDefinition from './directive';
import FieldTemplate from './template.js';
let template = new FieldTemplate();

/**
 * Field
 * @module Field
 */
var Field = window.angular.module('Field', [
    'Field.Player',
    'Field.Team',
    'Field.Gap',
    'Field.Formation',
    'Field.PassingZone',
    'Field.TeamPlayer',
    'Field.Yard',
    'Field.Dropdown',
    'Field.Period',
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
