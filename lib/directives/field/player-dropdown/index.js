import { PlayerFieldDefinition, fieldTemplate } from './directive';

const PlayerDropdown = angular.module('Field.PlayerDropdown', []);

PlayerDropdown.run([
    '$templateCache',
    function run($templateCache) {
        $templateCache.put(fieldTemplate.dropdownTemplateUrl, fieldTemplate.dropdownTemplate);
    }
]);

PlayerDropdown.directive('playerDropdownField', () => new PlayerFieldDefinition());

export default PlayerDropdown;
