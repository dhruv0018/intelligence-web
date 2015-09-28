import { TeamPlayerFieldDefinition, fieldTemplate } from './directive';

const TeamPlayer = angular.module('Field.TeamPlayer', []);

TeamPlayer.run([
    '$templateCache',
    function run($templateCache) {
        $templateCache.put(fieldTemplate.dropdownTemplateUrl, fieldTemplate.dropdownTemplate);
    }
]);

TeamPlayer.directive('teamPlayerField', () => new TeamPlayerFieldDefinition());

export default TeamPlayer;
