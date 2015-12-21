import { TeamFieldDefinition, fieldTemplate } from './directive';

const Team = angular.module('Field.Team', []);

Team.run([
    '$templateCache',
    function run($templateCache) {
        $templateCache.put(fieldTemplate.dropdownTemplateUrl, fieldTemplate.dropdownTemplate);
    }
]);
Team.directive('teamField', () => new TeamFieldDefinition());

export default Team;
