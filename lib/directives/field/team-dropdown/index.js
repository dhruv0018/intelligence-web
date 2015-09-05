import TeamFieldDefinition from './directive';

const TeamDropdown = angular.module('Field.TeamDropdown', []);

TeamDropdown.directive('teamDropdownField', () => new TeamFieldDefinition());

export default TeamDropdown;
