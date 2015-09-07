import { TeamPlayerFieldDefinition, fieldTemplate } from './directive';

const TeamPlayerDropdown = angular.module('Field.TeamPlayerDropdown', []);

TeamPlayerDropdown.run([
    '$templateCache',
    function run($templateCache) {
        $templateCache.put(fieldTemplate.dropdownTemplateUrl, fieldTemplate.dropdownTemplate);
    }
]);

TeamPlayerDropdown.directive('teamPlayerDropdownField', () => new TeamPlayerFieldDefinition());

export default TeamPlayerDropdown;
