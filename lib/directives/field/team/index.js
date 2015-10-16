import TeamFieldDefinition from './directive';

const Team = angular.module('Field.Team', []);

Team.directive('teamField', () => new TeamFieldDefinition());

export default Team;
